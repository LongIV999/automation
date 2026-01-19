/**
 * Google Sheets Integration
 *
 * Đọc content từ Google Sheets và thêm vào queue tự động
 * Tích hợp với hệ thống automation hiện tại
 */

const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { QueueManager } = require('./publisher');

const SHEETS_CONFIG = {
    // Thay bằng Sheet ID của bạn
    SPREADSHEET_ID: '1RAHjxLDULl0aRWHSX0aqUh1dqv7li7zwi0DZA6atQj0',
    SHEET_NAME: 'Post',  // Sheet name trong spreadsheet

    // OAuth2 credentials paths
    CREDENTIALS_PATH: path.join(__dirname, '../drive-uploader/credentials.json'),
    TOKEN_PATH: path.join(__dirname, '../drive-uploader/token.json')
};

class SheetsIntegration {
    constructor() {
        this.queueManager = new QueueManager();
        this.sheets = null;
    }

    async init() {
        // Authenticate with OAuth2
        const credentials = JSON.parse(fs.readFileSync(SHEETS_CONFIG.CREDENTIALS_PATH, 'utf-8'));
        const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        try {
            const token = JSON.parse(fs.readFileSync(SHEETS_CONFIG.TOKEN_PATH, 'utf-8'));
            oAuth2Client.setCredentials(token);
        } catch (error) {
            throw new Error('Token not found. OAuth2 credentials required.');
        }

        this.sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
        this.drive = google.drive({ version: 'v3', auth: oAuth2Client });
        console.log('✓ Google Sheets authenticated');
    }

    async getReadyPosts() {
        const response = await this.sheets.spreadsheets.values.get({
            spreadsheetId: SHEETS_CONFIG.SPREADSHEET_ID,
            range: `${SHEETS_CONFIG.SHEET_NAME}!A:G`
        });

        const rows = response.data.values || [];
        if (rows.length === 0) {
            console.log('No data found in sheet');
            return [];
        }

        // Parse header
        const headers = rows[0];
        const posts = [];

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const post = {};

            headers.forEach((header, index) => {
                post[header] = row[index] || '';
            });

            // Chỉ lấy posts có Status = "Ready"
            if (post['Status'] === 'Ready' && post['Drive_Folder_ID']) {
                posts.push({
                    ...post,
                    rowNumber: i + 1  // Lưu row number để update sau
                });
            }
        }

        return posts;
    }

    async updatePostStatus(rowNumber, status, postUrl = '') {
        const values = [[status, postUrl]];

        await this.sheets.spreadsheets.values.update({
            spreadsheetId: SHEETS_CONFIG.SPREADSHEET_ID,
            range: `${SHEETS_CONFIG.SHEET_NAME}!E${rowNumber}:F${rowNumber}`,  // Status và Post_URL columns
            valueInputOption: 'RAW',
            resource: { values }
        });
    }

    async syncToQueue() {
        console.log('\n📥 Syncing posts from Google Sheets to queue...\n');

        await this.init();
        const readyPosts = await this.getReadyPosts();

        console.log(`Found ${readyPosts.length} ready posts`);

        for (const post of readyPosts) {
            // Get images from Drive folder
            const imagePaths = await this.getImagesFromDrive(post.Drive_Folder_ID);

            if (imagePaths.length === 0) {
                console.log(`⚠️  No images found for: ${post.Caption?.substring(0, 50)}`);
                continue;
            }

            // Add to queue
            this.queueManager.add({
                caption: post.Caption,
                imagePaths,
                sheetRowNumber: post.rowNumber,
                driveFolder: post.Drive_Folder_ID
            });

            // Update status to "Queued"
            await this.updatePostStatus(post.rowNumber, 'Queued');

            console.log(`✓ Added to queue: ${post.Caption?.substring(0, 50)} (${imagePaths.length} images)`);
        }

        const stats = this.queueManager.getStats();
        console.log(`\n✨ Sync complete! Queue stats:`, stats);
    }

    async getImagesFromDrive(folderId) {
        // List images from Drive folder
        const response = await this.drive.files.list({
            q: `'${folderId}' in parents and trashed = false and (mimeType contains 'image/')`,
            fields: 'files(id, name, webContentLink)',
            orderBy: 'name'
        });

        const files = response.data.files || [];

        // Download images to temp folder
        const tempDir = path.join(__dirname, 'temp', folderId);
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const imagePaths = [];

        for (const file of files) {
            const dest = path.join(tempDir, file.name);

            // Download file
            const fileData = await this.drive.files.get(
                { fileId: file.id, alt: 'media' },
                { responseType: 'stream' }
            );

            await new Promise((resolve, reject) => {
                const dest_stream = fs.createWriteStream(dest);
                fileData.data
                    .on('end', () => resolve())
                    .on('error', reject)
                    .pipe(dest_stream);
            });

            imagePaths.push(dest);
        }

        return imagePaths;
    }
}

// ==================== MAIN ====================
async function main() {
    const integration = new SheetsIntegration();
    await integration.syncToQueue();
}

if (require.main === module) {
    main().catch(error => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
}

module.exports = SheetsIntegration;


const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();
const { addPostToSheets } = require('./sheets-updater');

const CONFIG = {
    credentialsPath: process.env.GOOGLE_CREDENTIALS_PATH || './credentials.json',
    tokenPath: process.env.GOOGLE_TOKEN_PATH || './token.json',
    scopes: ['https://www.googleapis.com/auth/drive.metadata.readonly'],

    // Sheet IDs
    sheetId_LBAI: '1RAHjxLDULl0aRWHSX0aqUh1dqv7li7zwi0DZA6atQj0',
    sheetId_TVLand: '1SNv1t0h-KRXWQ4xANroW5RQN6zHU57OrrXj_OqzfVsY'
};

async function authorize() {
    const credentials = JSON.parse(await fs.readFile(CONFIG.credentialsPath, 'utf-8'));
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    try {
        const token = JSON.parse(await fs.readFile(CONFIG.tokenPath, 'utf-8'));
        oAuth2Client.setCredentials(token);
    } catch (error) {
        throw new Error('Token not found. Please run: npm run auth');
    }
    return oAuth2Client;
}

async function findRecentFolders(auth) {
    const drive = google.drive({ version: 'v3', auth });
    const today = new Date().toISOString().split('T')[0];
    const query = `mimeType = 'application/vnd.google-apps.folder' and name contains '${today}' and trashed = false`;

    console.log(`🔎 Searching for folders with query: "${query}"`);

    try {
        const response = await drive.files.list({
            q: query,
            fields: 'files(id, name, webViewLink, createdTime)',
            orderBy: 'createdTime desc',
            pageSize: 50
        });
        return response.data.files;
    } catch (error) {
        console.error('Error searching folders:', error.message);
        return [];
    }
}

function classifySheet(folderName) {
    const lowerName = folderName.toLowerCase();

    // Keywords for Thach Vu Land (Real Estate)
    const tvLandKeywords = [
        'bds', 'bat-dong-san', 'real-estate', 'land',
        'tien-ich', 'noi-dau', 'binh-duong', 'phu-dong',
        'sky-one', 'thach-vu', 'can-ho'
    ];

    for (const keyword of tvLandKeywords) {
        if (lowerName.includes(keyword)) {
            return {
                id: CONFIG.sheetId_TVLand,
                name: 'Thach Vu Land'
            };
        }
    }

    // Default to Long Best AI
    return {
        id: CONFIG.sheetId_LBAI,
        name: 'Long Best AI'
    };
}

async function syncFolders() {
    console.log('🚀 Starting Multi-Brand Drive <-> Sheet Sync...');

    try {
        const auth = await authorize();
        const folders = await findRecentFolders(auth);

        console.log(`📂 Found ${folders.length} folders created today.`);

        for (const folder of folders) {
            const targetSheet = classifySheet(folder.name);

            console.log(`\n---------------------------------------------------`);
            console.log(`Processing: ${folder.name}`);
            console.log(`Target Sheet: ${targetSheet.name}`);

            const postData = {
                folderId: folder.id,
                folderLink: folder.webViewLink,
                folderName: folder.name,
                spreadsheetId: targetSheet.id // Pass the correct Sheet ID
            };

            await addPostToSheets(postData);
        }

        console.log('\n✅ Sync completed!');

    } catch (error) {
        console.error('❌ Sync failed:', error);
    }
}

syncFolders();

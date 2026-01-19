const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { createFolder, uploadFile } = require('../drive-uploader/upload');
const { addPostToSheets } = require('../drive-uploader/sheets-updater');
require('dotenv').config({ path: path.join(__dirname, '../drive-uploader/.env') });

const imagesDir = path.join(__dirname, '../../output/claude-code-2025');

const posts = [
    {
        filename: 'claude-code-2025-1.png',
        headline: "Autonomous Coding",
        caption: "Claude Code 2025 không chỉ viết mã, nó kiến tạo phần mềm. Từ ý tưởng sơ khởi đến sản phẩm hoàn thiện chỉ trong một câu lệnh. #ClaudeCode #AI #AutonomousCoding"
    },
    {
        filename: 'claude-code-2025-2.png',
        headline: "Legacy Modernization",
        caption: "Khả năng thấu hiểu ngữ cảnh vô hạn (Infinite Context) giúp Claude Code 'hồi sinh' và tối ưu hóa các hệ thống legacy phức tạp nhất trong tích tắc. #ClaudeCode #LegacyModernization #Tech"
    },
    {
        filename: 'claude-code-2025-3.png',
        headline: "Real-time Collaboration",
        caption: "Lập trình cặp cùng Claude Code mang lại cảm giác như có một kỹ sư Senior ngồi ngay bên cạnh, dự đoán và hoàn thiện logic của bạn theo thời gian thực. #ClaudeCode #PairProgramming #DevTools"
    },
    {
        filename: 'claude-code-2025-4.png',
        headline: "Security First",
        caption: "Với kiến trúc Self-Healing, Claude Code tự động phát hiện lỗ hổng và vá lỗi bảo mật ngay khi chúng xuất hiện, đảm bảo an toàn tuyệt đối. #ClaudeCode #CyberSecurity #AIProtection"
    },
    {
        filename: 'claude-code-2025-5.png',
        headline: "Multimodal Engineering",
        caption: "Chỉ cần vẽ sơ đồ trên bảng trắng, Claude Code sẽ chuyển đổi nó thành kiến trúc Microservices hoàn chỉnh. Sức mạnh Multimodal chưa từng có. #ClaudeCode #Multimodal #SoftwareArchitecture"
    }
];

async function authorize() {
    const credentialsPath = process.env.GOOGLE_CREDENTIALS_PATH || path.join(__dirname, '../drive-uploader/credentials.json');
    const tokenPath = process.env.GOOGLE_TOKEN_PATH || path.join(__dirname, '../drive-uploader/token.json');

    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    const token = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
}

async function main() {
    console.log('🚀 Starting Batch Upload for Claude Code 2025...');

    try {
        const auth = await authorize();

        // 1. Create a parent folder for this batch
        const folderName = `2026-01-14_Claude-Code-Features_Batch`;
        // Use default parent folder from env if available
        const parentFolderId = process.env.DRIVE_PARENT_FOLDER_ID;
        const mainFolder = await createFolder(auth, folderName, parentFolderId);

        console.log(`📁 Created Batch Folder: ${mainFolder.name} (${mainFolder.id})`);

        // 2. Upload each file and add to sheet
        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            const filePath = path.join(imagesDir, post.filename);

            console.log(`\n[${i + 1}/${posts.length}] Processing: ${post.headline}`);

            const subFolderName = `${folderName}_Post-${i + 1}`;
            const subFolder = await createFolder(auth, subFolderName, mainFolder.id);

            const uploadedFile = await uploadFile(auth, filePath, subFolder.id, post.filename);
            console.log(`   ✅ Uploaded image: ${uploadedFile.name}`);

            // Update Sheet
            const sheetResult = await addPostToSheets({
                folderId: subFolder.id,
                folderLink: subFolder.webViewLink,
                folderName: subFolderName,
                caption: post.caption,
                status: 'Ready',
                topic: `Claude Code 2025`,
                brand: 'longbest',
                uploadedCount: 1,
                spreadsheetId: '1RAHjxLDULl0aRWHSX0aqUh1dqv7li7zwi0DZA6atQj0'
            });

            if (sheetResult.success) {
                console.log(`   📝 Sheet updated: Row ${sheetResult.row}`);
            } else {
                console.error(`   ❌ Sheet update failed: ${sheetResult.error}`);
            }
        }

        console.log('\n🎉 Batch processing complete!');

    } catch (error) {
        console.error('❌ Fatal Error:', error);
    }
}

main();

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { createFolder, uploadFile } = require('../drive-uploader/upload');
const { addPostToSheets } = require('../drive-uploader/sheets-updater');
require('dotenv').config({ path: path.join(__dirname, '../drive-uploader/.env') });

const imagesDir = path.join(__dirname, '../../output/veo4-posts');
const SCOPES = ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/spreadsheets'];

const posts = [
    { filename: 'veo4-post-1.png', headline: "Veo 4: Chất lượng video 4K siêu thực", caption: "Tạo video độ phân giải cao với chi tiết sắc nét chưa từng có. Veo 4 nâng tầm chất lượng hình ảnh, đáp ứng tiêu chuẩn điện ảnh chuyên nghiệp. #Veo4 #AIVideo #4K" },
    { filename: 'veo4-post-2.png', headline: "Hiểu ngữ cảnh chính xác tuyệt đối", caption: "Veo 4 không chỉ hiểu prompt, mà còn nắm bắt được ý đồ nghệ thuật của bạn. Mọi chuyển động, ánh sáng đều được tái hiện đúng như tưởng tượng. #Veo4 #ContextAwareness #AI" },
    { filename: 'veo4-post-3.png', headline: "Tốc độ tạo video nhanh gấp 2 lần", caption: "Tiết kiệm thời gian quý báu với khả năng render siêu tốc. Veo 4 giúp bạn hiện thực hóa ý tưởng chỉ trong tích tắc. #Veo4 #Speed #Productivity" },
    { filename: 'veo4-post-4.png', headline: "Chỉnh sửa video bằng ngôn ngữ tự nhiên", caption: "Không cần kỹ năng dựng phim phức tạp. Chỉ cần ra lệnh bằng văn bản, Veo 4 sẽ tự động cắt ghép, thêm hiệu ứng theo ý muốn. #Veo4 #VideoEditing #AIEdit" },
    { filename: 'veo4-post-5.png', headline: "Video dài hơn, câu chuyện trọn vẹn hơn", caption: "Vượt qua giới hạn độ dài cũ. Veo 4 cho phép tạo các video clip dài hơn, giúp bạn kể câu chuyện của mình một cách liền mạch và đầy đủ. #Veo4 #Storytelling #LongForm" }
];

async function authorize() {
    // Re-using logic from upload.js but adapted for this script's location
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
    console.log('🚀 Starting Batch Upload for Veo 4...');

    try {
        const auth = await authorize();

        // 1. Create a parent folder for this batch
        const folderName = `2026-01-14_Veo-4-Features_Batch`;
        // Use default parent folder from env if available
        const parentFolderId = process.env.DRIVE_PARENT_FOLDER_ID;
        const mainFolder = await createFolder(auth, folderName, parentFolderId);

        console.log(`📁 Created Batch Folder: ${mainFolder.name} (${mainFolder.id})`);

        // 2. Upload each file and add to sheet
        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            const filePath = path.join(imagesDir, post.filename);

            console.log(`\n[${i + 1}/${posts.length}] Processing: ${post.headline}`);

            // Upload file directly to the batch folder
            // NOTE: Usually we put each post in its own subfolder if it's a carousel.
            // Since these are single posts, we can either:
            // A. Put all images in one folder (but then how does the automation know which image belongs to which row?)
            // B. Create a subfolder for EACH post (Cleaner for the n8n automation which expects a Folder ID) -> ACCEPTED APPROACH

            const subFolderName = `${folderName}_Post-${i + 1}`;
            const subFolder = await createFolder(auth, subFolderName, mainFolder.id);

            const uploadedFile = await uploadFile(auth, filePath, subFolder.id, post.filename);
            console.log(`   ✅ Uploaded image: ${uploadedFile.name}`);

            // Update Sheet
            // We use the subFolder.id as the Drive_Folder_ID, so the automation picks up the image inside it.
            const sheetResult = await addPostToSheets({
                folderId: subFolder.id,
                folderLink: subFolder.webViewLink,
                folderName: subFolderName,
                caption: post.caption,
                status: 'Ready',
                topic: `Veo 4 Features`,
                brand: 'longbest',
                uploadedCount: 1,
                spreadsheetId: '1RAHjxLDULl0aRWHSX0aqUh1dqv7li7zwi0DZA6atQj0' // Explicitly set for LongBest
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

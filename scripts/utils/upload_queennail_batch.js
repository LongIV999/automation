const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { createFolder, uploadFile } = require('../drive-uploader/upload');
const { addPostToSheets } = require('../drive-uploader/sheets-updater');
require('dotenv').config({ path: path.join(__dirname, '../drive-uploader/.env') });

const imagesDir = path.join(__dirname, '../../output/queennail-recruitment');

// Queen Nail Content from Prompt
const contentBody = `Gia nhập đội ngũ Queen Nail Bern – một trong những hệ thống Salon chuyên nghiệp hàng đầu tại trung tâm thủ đô Bern, Thụy Sĩ. Chúng tôi đang tìm kiếm những cộng sự tài năng để cùng mang lại trải nghiệm hoàn hảo cho khách hàng.

✅ Quyền lợi và Đãi ngộ:
- Thu nhập hấp dẫn: Lương cơ bản từ 5.500 đến 6.000 CHF/tháng tùy theo năng lực.
- Hỗ trợ toàn diện: Hỗ trợ hoàn thiện các thủ tục làm giấy tờ pháp lý cần thiết.
- Chỗ ở ổn định: Hỗ trợ sắp xếp chỗ ở tiện nghi cho nhân viên ở xa hoặc mới đến.
- Môi trường làm việc: Sang trọng, chuyên nghiệp, trang thiết bị hiện đại và lượng khách hàng ổn định.

✅ Yêu cầu ứng viên:
- Có giấy tờ cá nhân hợp pháp theo quy định.
- Kỹ năng chuyên môn: Thành thạo kỹ thuật đắp bột (Acrylic) và làm Gel.
- Thái độ: Tỉ mỉ trong công việc, có trách nhiệm và mong muốn phát triển nghề nghiệp lâu dài.

📩 Cách thức ứng tuyển: Gửi hồ sơ trực tiếp qua tin nhắn Facebook hoặc liên hệ Hotline.
📍 Queen Nails & Lashes: Kramgasse 37, 3011 Bern, Schweiz
☎️ Hotline: +41 79 805 00 68

#QueenNailBern #Recruitment #BernJobs #NailTechnician #SwitzerlandJobs`;

const posts = [
    { filename: 'queennail-recruit-1.png', caption: contentBody },
    { filename: 'queennail-recruit-2.png', caption: contentBody },
    { filename: 'queennail-recruit-3.png', caption: contentBody },
    { filename: 'queennail-recruit-4.png', caption: contentBody },
    { filename: 'queennail-recruit-5.png', caption: contentBody }
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
    console.log('🚀 Starting Batch Upload for Queen Nail Recruitment...');

    try {
        const auth = await authorize();

        // 1. Create a parent folder for this batch
        const folderName = `2026-01-14_QueenNail_Recruitment`;
        const parentFolderId = process.env.DRIVE_PARENT_FOLDER_ID; // Or null if handled by upload.js defaults
        const mainFolder = await createFolder(auth, folderName, parentFolderId);

        console.log(`📁 Created Batch Folder: ${mainFolder.name} (${mainFolder.id})`);

        // 2. Upload each file and add to sheet
        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            const filePath = path.join(imagesDir, post.filename);

            console.log(`\n[${i + 1}/${posts.length}] Processing Post ${i + 1}`);

            // Create subfolder for clean automation trigger
            const subFolderName = `${folderName}_Layout-${i + 1}`;
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
                topic: `Recruitment`,
                brand: 'queennailbern',
                uploadedCount: 1,
                spreadsheetId: '1MPyLQw9Q4sLlRiSvWSCyY4NvtVGeoDKoib6n3f4PRTo' // Specific Sheet ID from request
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

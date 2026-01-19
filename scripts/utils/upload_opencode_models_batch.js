const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { createFolder, uploadFile } = require('../drive-uploader/upload');
const { addPostToSheets } = require('../drive-uploader/sheets-updater');
require('dotenv').config({ path: path.join(__dirname, '../drive-uploader/.env') });

const imagesDir = path.join(__dirname, '../../output/opencode-models');

const posts = [
    {
        filename: 'opencode-model-1.png',
        headline: "Multi-Model Mastery",
        caption: "Tại sao phải chọn một khi bạn có thể dùng tất cả? OpenCode cho phép kết hợp Claude 3.5 Sonnet để code logic phức tạp và GPT-4o để sáng tạo nội dung, tối ưu hóa mọi khía cạnh của dự án. #OpenCode #AIModels #DevTools"
    },
    {
        filename: 'opencode-model-2.png',
        headline: "Privacy First (Local LLMs)",
        caption: "Bảo mật mã nguồn tối đa bằng cách chạy models cục bộ qua Ollama ngay trong OpenCode. Sử dụng Llama 3 hoặc DeepSeek Coder mà không cần gửi một dòng code nào ra internet. #Privacy #LocalLLM #Ollama"
    },
    {
        filename: 'opencode-model-3.png',
        headline: "OpenCode Zen",
        caption: "Bạn bị choáng ngợp bởi hàng trăm models? Chế độ 'Zen' cung cấp danh sách models được đội ngũ OpenCode tinh chọn và kiểm thử kỹ lưỡng, đảm bảo hiệu năng cao nhất cho từng tác vụ. #ZenMode #CuratedAI"
    },
    {
        filename: 'opencode-model-4.png',
        headline: "Cost Efficiency",
        caption: "Không phải task nào cũng cần 'siêu trí tuệ'. Chuyển đổi linh hoạt sang GPT-4o Mini hoặc Claude Haiku cho các tác vụ đơn giản như fix bug nhỏ hay viết docs để tiết kiệm chi phí vận hành. #CostOptimization #AIEfficiency"
    },
    {
        filename: 'opencode-model-5.png',
        headline: "Infinite Context (Gemini)",
        caption: "Với cửa sổ ngữ cảnh khổng lồ, Gemini 1.5 Pro trong OpenCode có thể 'đọc' và hiểu toàn bộ repository của bạn cùng lúc. Tạm biệt nỗi lo quên context khi dự án phình to. #GeminiPro #BigContext #Coding"
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
    console.log('🚀 Starting Batch Upload for OpenCode Models...');

    try {
        const auth = await authorize();

        // 1. Create a parent folder for this batch
        const folderName = `2026-01-14_OpenCode-Models_Batch`;
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
                topic: `OpenCode Models`,
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

/**
 * Long Best AI - Google Drive Auto Uploader
 *
 * Tự động upload ảnh carousel lên Google Drive
 * - Tạo folder tự động (theo format: YYYY-MM-DD_Topic)
 * - Upload ảnh với số thứ tự: 01.png, 02.png, 03.png...
 * - Trả về Drive Folder ID để paste vào Google Sheets
 */

const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();
const { addPostToSheets, loadCaptionFromFile } = require('./sheets-updater');

// Cấu hình
const CONFIG = {
  credentialsPath: process.env.GOOGLE_CREDENTIALS_PATH || './credentials.json',
  tokenPath: process.env.GOOGLE_TOKEN_PATH || './token.json',
  parentFolderId: process.env.DRIVE_PARENT_FOLDER_ID || null, // Optional: Parent folder cho tất cả posts
  autoUpdateSheets: process.env.AUTO_UPDATE_SHEETS !== 'false', // Default: true
  autoDeleteAfterUpload: process.env.AUTO_DELETE_AFTER_UPLOAD === 'true', // Default: false (an toàn)
  scopes: ['https://www.googleapis.com/auth/drive.file']
};

/**
 * Load credentials và authorize
 */
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

/**
 * Tạo folder trên Google Drive
 * @param {string} folderName - Tên folder
 * @param {string} parentFolderId - ID của parent folder (optional)
 */
async function createFolder(auth, folderName, parentFolderId = null) {
  const drive = google.drive({ version: 'v3', auth });

  const fileMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: parentFolderId ? [parentFolderId] : []
  };

  try {
    const response = await drive.files.create({
      resource: fileMetadata,
      fields: 'id, name, webViewLink'
    });

    console.log(`✅ Created folder: ${response.data.name}`);
    console.log(`📁 Folder ID: ${response.data.id}`);
    console.log(`🔗 Link: ${response.data.webViewLink}`);

    return response.data;
  } catch (error) {
    console.error('❌ Error creating folder:', error.message);
    throw error;
  }
}

/**
 * Upload file lên Google Drive
 * @param {string} filePath - Đường dẫn file local
 * @param {string} folderId - ID của folder đích
 * @param {string} fileName - Tên file (optional, default: original name)
 */
async function uploadFile(auth, filePath, folderId, fileName = null) {
  const drive = google.drive({ version: 'v3', auth });

  const fileMetadata = {
    name: fileName || path.basename(filePath),
    parents: [folderId]
  };

  const media = {
    mimeType: 'image/png',
    body: await fs.readFile(filePath).then(buffer => {
      const { Readable } = require('stream');
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);
      return stream;
    })
  };

  try {
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink'
    });

    return response.data;
  } catch (error) {
    console.error(`❌ Error uploading ${fileName}:`, error.message);
    throw error;
  }
}

/**
 * Xóa ảnh local sau khi upload thành công
 * @param {string} imagesDir - Thư mục chứa ảnh
 * @param {Array} imageFiles - Danh sách file đã upload
 */
async function deleteLocalImages(imagesDir, imageFiles) {
  console.log('\n🗑️  Deleting local images...');

  let deletedCount = 0;
  let errorCount = 0;

  for (const fileName of imageFiles) {
    const filePath = path.join(imagesDir, fileName);

    try {
      await fs.unlink(filePath);
      console.log(`  ✓ Deleted: ${fileName}`);
      deletedCount++;
    } catch (error) {
      console.error(`  ✗ Failed to delete ${fileName}:`, error.message);
      errorCount++;
    }
  }

  if (deletedCount > 0) {
    console.log(`\n✅ Deleted ${deletedCount} local images`);
  }

  if (errorCount > 0) {
    console.warn(`⚠️  Failed to delete ${errorCount} files`);
  }

  // Xóa folder nếu trống
  try {
    const remainingFiles = await fs.readdir(imagesDir);
    if (remainingFiles.length === 0) {
      await fs.rmdir(imagesDir);
      console.log(`✓ Deleted empty folder: ${path.basename(imagesDir)}`);
    }
  } catch (error) {
    // Folder không trống hoặc lỗi khác, không cần xóa
  }

  return { deletedCount, errorCount };
}

/**
 * Upload toàn bộ carousel (nhiều ảnh)
 * @param {string} imagesDir - Thư mục chứa ảnh
 * @param {string} folderName - Tên folder trên Drive
 * @param {boolean} deleteAfterUpload - Xóa ảnh local sau khi upload (default: from CONFIG)
 */
async function uploadCarousel(imagesDir, folderName = null, deleteAfterUpload = CONFIG.autoDeleteAfterUpload) {
  console.log('🚀 Starting Google Drive upload...');

  try {
    // Authorize
    const auth = await authorize();

    // Tự động tạo folder name nếu không có
    if (!folderName) {
      const date = new Date().toISOString().split('T')[0];
      const baseName = path.basename(imagesDir);
      folderName = `${date}_${baseName}`;
    }

    // Tạo folder trên Drive
    const folder = await createFolder(auth, folderName, CONFIG.parentFolderId);

    // Đọc danh sách ảnh
    const files = await fs.readdir(imagesDir);
    const imageFiles = files
      .filter(f => f.match(/\.(png|jpg|jpeg)$/i))
      .sort(); // Sort để đúng thứ tự 01, 02, 03...

    console.log(`\n📸 Found ${imageFiles.length} images to upload`);

    // Upload từng ảnh
    for (let i = 0; i < imageFiles.length; i++) {
      const fileName = imageFiles[i];
      const filePath = path.join(imagesDir, fileName);

      console.log(`\n[${i + 1}/${imageFiles.length}] Uploading: ${fileName}...`);

      const uploadedFile = await uploadFile(auth, filePath, folder.id, fileName);

      console.log(`✅ Uploaded: ${uploadedFile.name}`);
    }

    console.log('\n🎉 Upload completed successfully!');
    console.log('\n📋 IMPORTANT - Copy this info:');
    console.log('─'.repeat(60));
    console.log(`Folder Name: ${folder.name}`);
    console.log(`Folder ID: ${folder.id}`);
    console.log(`Folder Link: ${folder.webViewLink}`);
    console.log('─'.repeat(60));

    const uploadResult = {
      folderId: folder.id,
      folderLink: folder.webViewLink,
      folderName: folder.name,
      uploadedCount: imageFiles.length
    };

    // Auto-update Google Sheets nếu enabled
    if (CONFIG.autoUpdateSheets) {
      try {
        // Tìm caption file nếu có
        const baseName = path.basename(imagesDir);
        const caption = await loadCaptionFromFile(baseName);

        // Update Google Sheets
        const sheetsResult = await addPostToSheets({
          ...uploadResult,
          caption: caption
        });

        if (sheetsResult.success) {
          console.log('\n✅ Google Sheets auto-updated!');
          console.log(`📝 Row: ${sheetsResult.row}, Post ID: ${sheetsResult.postId}`);
        }
      } catch (error) {
        console.warn('\n⚠️  Could not auto-update Google Sheets:', error.message);
        console.log('💡 You can update manually or run: node sheets-updater.js');
      }
    } else {
      console.log('\n💡 Paste Folder ID vào Google Sheets (Posts tab, Drive_Folder_ID column)');
    }

    // Auto-delete local images nếu enabled
    if (deleteAfterUpload) {
      console.log('\n' + '─'.repeat(60));
      const deleteResult = await deleteLocalImages(imagesDir, imageFiles);

      if (deleteResult.deletedCount > 0) {
        console.log('💾 Disk space saved! Images uploaded safely to Drive.');
      }
    } else {
      console.log('\n💾 Local images kept at: ' + imagesDir);
      console.log('💡 To auto-delete after upload, set AUTO_DELETE_AFTER_UPLOAD=true in .env');
    }

    return uploadResult;

  } catch (error) {
    console.error('\n❌ Upload failed:', error.message);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node upload.js <images-directory> [folder-name] [--delete]');
    console.log('\nExamples:');
    console.log('  node upload.js ../carousel-generator/output/post_001');
    console.log('  node upload.js ./images "2026-01-10_AI_Prompts"');
    console.log('  node upload.js ./images --delete  # Delete after upload');
    console.log('\nOptions:');
    console.log('  --delete, -d    Delete local images after upload');
    console.log('  --keep, -k      Keep local images (override AUTO_DELETE_AFTER_UPLOAD)');
    console.log('\nSetup:');
    console.log('  1. Run: npm run auth (first time only)');
    console.log('  2. Set DRIVE_PARENT_FOLDER_ID in .env (optional)');
    console.log('  3. Set AUTO_DELETE_AFTER_UPLOAD=true in .env to always delete');
    process.exit(1);
  }

  // Parse arguments
  let imagesDir = null;
  let folderName = null;
  let deleteAfterUpload = CONFIG.autoDeleteAfterUpload; // Default from config

  for (const arg of args) {
    if (arg === '--delete' || arg === '-d') {
      deleteAfterUpload = true;
    } else if (arg === '--keep' || arg === '-k') {
      deleteAfterUpload = false;
    } else if (!imagesDir) {
      imagesDir = arg;
    } else if (!folderName) {
      folderName = arg;
    }
  }

  if (!imagesDir) {
    console.error('❌ Images directory required');
    process.exit(1);
  }

  // Check if directory exists
  try {
    await fs.access(imagesDir);
  } catch (error) {
    console.error(`❌ Directory not found: ${imagesDir}`);
    process.exit(1);
  }

  // Upload
  try {
    const result = await uploadCarousel(imagesDir, folderName, deleteAfterUpload);

    // Return result as JSON for automation
    if (process.env.JSON_OUTPUT) {
      console.log(JSON.stringify(result, null, 2));
    }

  } catch (error) {
    console.error('Upload failed:', error.message);
    process.exit(1);
  }
}

// Export for use as module
module.exports = { uploadCarousel, createFolder, uploadFile };

// Run if called directly
if (require.main === module) {
  main();
}

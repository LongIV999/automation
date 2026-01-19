#!/usr/bin/env node

/**
 * Upload Thach Vu Land content to Drive and sync to Sheet
 * Tự động sử dụng caption từ content.json
 */

const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');
const { addPostToSheets } = require('./sheets-updater');

const CONFIG = {
  credentialsPath: '../../credentials.json',
  tokenPath: '../../token.json',
  sheetId: '1SNv1t0h-KRXWQ4xANroW5RQN6zHU57OrrXj_OqzfVsY',
  sheetName: 'Post',
  scopes: [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets'
  ]
};

async function authorize() {
  const credentials = JSON.parse(await fs.readFile(CONFIG.credentialsPath, 'utf-8'));
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  const token = JSON.parse(await fs.readFile(CONFIG.tokenPath, 'utf-8'));
  oAuth2Client.setCredentials(token);
  return oAuth2Client;
}

async function uploadToGoogleDrive(auth, folderPath, folderName) {
  const drive = google.drive({ version: 'v3', auth });

  console.log(`\n📤 Uploading to Google Drive...`);

  // Create folder on Drive
  const folderMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder'
  };

  const folder = await drive.files.create({
    resource: folderMetadata,
    fields: 'id, name, webViewLink'
  });

  console.log(`✓ Created folder: ${folder.data.name}`);

  // Upload images
  const files = await fs.readdir(folderPath);
  const imageFiles = files.filter(f => f.endsWith('.png') || f.endsWith('.jpg'));

  for (const file of imageFiles) {
    const filePath = path.join(folderPath, file);
    const fileMetadata = {
      name: file,
      parents: [folder.data.id]
    };

    const media = {
      mimeType: 'image/png',
      body: require('fs').createReadStream(filePath)
    };

    await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, name'
    });

    console.log(`  ✓ Uploaded: ${file}`);
  }

  console.log(`✅ Upload complete! ${imageFiles.length} file(s)`);

  return {
    folderId: folder.data.id,
    folderLink: folder.data.webViewLink,
    folderName: folder.data.name,
    uploadedCount: imageFiles.length
  };
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node upload-thachvuland.js <content-folder-name>');
    console.log('\nExample:');
    console.log('  node upload-thachvuland.js thachvuland-phu-dong-sky-one');
    console.log('\nOr use absolute path:');
    console.log('  node upload-thachvuland.js /full/path/to/folder');
    process.exit(1);
  }

  const folderName = args[0];

  console.log('🚀 Upload Thach Vu Land Content\n');

  try {
    const auth = await authorize();

    // Determine content path
    let contentPath;
    if (path.isAbsolute(folderName)) {
      contentPath = folderName;
    } else {
      // Try multiple possible locations
      const possiblePaths = [
        path.join(__dirname, '../carousel-generator/output', folderName),
        path.join('/Users/admin/automation/output', folderName),
        path.join('/Users/admin/automation/scripts/carousel-generator/output', folderName)
      ];

      for (const p of possiblePaths) {
        try {
          await fs.access(p);
          contentPath = p;
          break;
        } catch (e) {
          continue;
        }
      }

      if (!contentPath) {
        throw new Error(`Cannot find folder: ${folderName}\nTried:\n${possiblePaths.join('\n')}`);
      }
    }

    console.log(`📂 Content path: ${contentPath}`);

    // Load content.json
    const contentFile = path.join(contentPath, 'content.json');
    const contentData = JSON.parse(await fs.readFile(contentFile, 'utf-8'));

    console.log(`✓ Content loaded: ${contentData.topic || 'Untitled'}`);

    // Generate Drive folder name
    const date = new Date().toISOString().split('T')[0];
    const driveFolderName = `${date}_${path.basename(contentPath)}`;

    // Upload to Drive
    const uploadResult = await uploadToGoogleDrive(auth, contentPath, driveFolderName);

    // Prepare data for Sheet
    const postData = {
      spreadsheetId: CONFIG.sheetId,
      sheetName: CONFIG.sheetName,
      folderId: uploadResult.folderId,
      folderLink: uploadResult.folderLink,
      folderName: uploadResult.folderName,
      topic: contentData.topic || path.basename(contentPath),
      caption: contentData.caption || '',
      status: 'Ready', // Ready for n8n autopost
      uploadedCount: uploadResult.uploadedCount,
      keywords: contentData.keywords || '',
      targetAudience: contentData.targetAudience || '',
      priority: contentData.priority || 'Medium',
      researchNotes: `Auto-uploaded on ${date}`
    };

    // Add to Google Sheets
    const sheetResult = await addPostToSheets(postData);

    if (sheetResult.success) {
      console.log(`\n✅ UPLOAD & SYNC COMPLETE!`);
      console.log(`\n📋 Summary:`);
      console.log(`  - Topic: ${postData.topic}`);
      console.log(`  - Format: ${uploadResult.uploadedCount === 1 ? 'Single Post' : 'Carousel (' + uploadResult.uploadedCount + ' slides)'}`);
      console.log(`  - Drive: ${uploadResult.folderLink}`);
      console.log(`  - Sheet Row: ${sheetResult.row}`);
      console.log(`  - Post ID: ${sheetResult.postId}`);
      console.log(`  - Status: Ready ✅`);

      console.log(`\n📝 Caption preview:`);
      const preview = postData.caption.substring(0, 150);
      console.log(`  ${preview}${postData.caption.length > 150 ? '...' : ''}`);

      console.log(`\n💡 Next Steps:`);
      console.log(`  1. Kiểm tra Sheet: https://docs.google.com/spreadsheets/d/${CONFIG.sheetId}`);
      console.log(`  2. n8n sẽ tự động post (schedule: 30 phút)`);
      console.log(`  3. Hoặc trigger manual trong n8n`);
    } else {
      console.log(`\n⚠️  Sheet sync failed: ${sheetResult.error}`);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();

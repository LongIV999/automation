#!/usr/bin/env node

/**
 * Test: Upload Thach Vu Land Single Post to Google Drive and sync to Sheet
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
  console.log(`  ID: ${folder.data.id}`);

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

  console.log(`✅ Upload complete! Uploaded ${imageFiles.length} file(s)`);

  return {
    folderId: folder.data.id,
    folderLink: folder.data.webViewLink,
    folderName: folder.data.name,
    uploadedCount: imageFiles.length
  };
}

async function main() {
  console.log('🚀 Test: Upload Thach Vu Land Single Post\n');

  try {
    const auth = await authorize();

    // Path to generated content
    const contentPath = '/Users/admin/automation/scripts/carousel-generator/output/test-thachvuland-single-post';
    const contentFile = path.join(contentPath, 'content.json');

    // Load content data
    const contentData = JSON.parse(await fs.readFile(contentFile, 'utf-8'));

    // Generate folder name
    const date = new Date().toISOString().split('T')[0];
    const folderName = `${date}_test-bds-binh-duong-single-post`;

    // Upload to Drive
    const uploadResult = await uploadToGoogleDrive(auth, contentPath, folderName);

    console.log(`\n🔗 Google Drive Links:`);
    console.log(`  Folder: ${uploadResult.folderLink}`);

    // Prepare data for Sheet
    const postData = {
      spreadsheetId: CONFIG.sheetId,
      sheetName: CONFIG.sheetName,
      folderId: uploadResult.folderId,
      folderLink: uploadResult.folderLink,
      folderName: uploadResult.folderName,
      topic: contentData.topic || 'Bất Động Sản Bình Dương',
      caption: contentData.caption || '',
      status: 'Ready', // Ready to be posted by n8n
      uploadedCount: uploadResult.uploadedCount,
      keywords: contentData.keywords || '',
      targetAudience: contentData.targetAudience || '',
      priority: contentData.priority || 'High',
      researchNotes: `Test single post - Generated on ${date}`
    };

    // Add to Google Sheets
    const sheetResult = await addPostToSheets(postData);

    if (sheetResult.success) {
      console.log(`\n✅ UPLOAD & SYNC COMPLETE!`);
      console.log(`\n📋 Summary:`);
      console.log(`  - Format: Single Post (${uploadResult.uploadedCount} image)`);
      console.log(`  - Topic: ${postData.topic}`);
      console.log(`  - Drive Folder: ${uploadResult.folderLink}`);
      console.log(`  - Sheet Row: ${sheetResult.row}`);
      console.log(`  - Post ID: ${sheetResult.postId}`);
      console.log(`  - Status: Ready (will be auto-posted by n8n)`);

      console.log(`\n💡 Next Steps:`);
      console.log(`  1. Open sheet: https://docs.google.com/spreadsheets/d/${CONFIG.sheetId}`);
      console.log(`  2. Review row ${sheetResult.row} - verify Caption and Drive_Folder_ID`);
      console.log(`  3. n8n will auto-post when schedule runs (every 30 min)`);
      console.log(`  4. Or trigger n8n workflow manually`);
    } else {
      console.log(`\n⚠️  Sheet sync failed: ${sheetResult.error}`);
      console.log(`📝 Manual action required: Add row to sheet manually`);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();

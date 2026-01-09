/**
 * Get latest post from Google Sheets tab "Post"
 */

const { google } = require('googleapis');
const fs = require('fs').promises;
require('dotenv').config();

const CONFIG = {
  credentialsPath: process.env.GOOGLE_CREDENTIALS_PATH || './credentials.json',
  tokenPath: process.env.GOOGLE_TOKEN_PATH || './token.json',
  spreadsheetId: process.env.GOOGLE_SHEETS_ID || '1RAHjxLDULl0aRWHSX0aqUh1dqv7li7zwi0DZA6atQj0',
  sheetName: 'Post'
};

async function authorize() {
  const credentials = JSON.parse(await fs.readFile(CONFIG.credentialsPath, 'utf-8'));
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  try {
    const token = JSON.parse(await fs.readFile(CONFIG.tokenPath, 'utf-8'));
    oAuth2Client.setCredentials(token);
  } catch (error) {
    throw new Error('Token not found. Please run: node setup-auth.js');
  }

  return oAuth2Client;
}

async function getLatestPost() {
  const auth = await authorize();
  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: CONFIG.spreadsheetId,
    range: `${CONFIG.sheetName}!A:Z`
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    console.log('❌ No data found in Post tab');
    return null;
  }

  const headers = rows[0];

  console.log('📋 Post tab headers:', headers.join(', '));
  console.log(`\n📊 Total rows: ${rows.length - 1}\n`);

  // Show all posts
  console.log('All posts in Post tab:\n');
  for (let i = 1; i < Math.min(rows.length, 6); i++) {
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = rows[i][idx] || '';
    });
    console.log(`${i}. Topic: ${row.Topic || '(empty)'}`);
    console.log(`   Status: ${row.Status || '(empty)'}`);
    console.log(`   Drive_Folder_ID: ${row.Drive_Folder_ID || '(empty)'}`);
    console.log('');
  }

  // Find rows with Status = "Ready" (chưa có Drive_Folder_ID)
  const readyPosts = [];
  for (let i = 1; i < rows.length; i++) {
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = rows[i][idx] || '';
    });

    if (row.Status === 'Ready' && !row.Drive_Folder_ID) {
      readyPosts.push({ ...row, rowIndex: i + 1 });
    }
  }

  console.log(`\n✅ Found ${readyPosts.length} posts with Status="Ready" (chưa upload):\n`);

  readyPosts.forEach((post, idx) => {
    console.log(`${idx + 1}. ${post.Topic}`);
    console.log(`   Post_ID: ${post.Post_ID}`);
    console.log(`   Date_Planned: ${post.Date_Planned}`);
    console.log(`   Priority: ${post.Priority}`);
    console.log(`   Research_Notes: ${post.Research_Notes?.substring(0, 60)}...`);
    console.log('');
  });

  // Return latest (first) ready post
  if (readyPosts.length > 0) {
    console.log('🎯 Latest post to work on:');
    console.log(`   Topic: ${readyPosts[0].Topic}`);
    console.log(`   Post_ID: ${readyPosts[0].Post_ID}`);
    return readyPosts[0];
  } else {
    console.log('ℹ️  No posts need carousel generation (all have Drive_Folder_ID or not Ready)');
    return null;
  }
}

if (require.main === module) {
  getLatestPost()
    .then(post => {
      if (post) {
        console.log('\n📝 Next steps:');
        console.log('1. Create content JSON for this topic');
        console.log('2. Generate carousel images');
        console.log('3. Upload to Drive');
      }
    })
    .catch(error => {
      console.error('❌ Error:', error.message);
      process.exit(1);
    });
}

module.exports = { getLatestPost };

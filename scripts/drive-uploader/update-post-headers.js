/**
 * Add missing columns to Post tab
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

// Desired column structure for Post tab
const DESIRED_HEADERS = [
  'Post_ID',
  'Date_Created',
  'Date_Planned',
  'Topic',
  'Caption',
  'Drive_Folder_ID',
  'Drive_Link',
  'Status',
  'Type',
  'Images_Count',
  'Keywords',
  'Target_Audience',
  'Priority',
  'Research_Notes',
  'Post_URL',
  'Published_Date',
  'Created_At'
];

async function authorize() {
  const credentials = JSON.parse(await fs.readFile(CONFIG.credentialsPath, 'utf-8'));
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  const token = JSON.parse(await fs.readFile(CONFIG.tokenPath, 'utf-8'));
  oAuth2Client.setCredentials(token);

  return oAuth2Client;
}

async function updatePostHeaders() {
  console.log('🔧 Updating Post tab headers...\n');

  const auth = await authorize();
  const sheets = google.sheets({ version: 'v4', auth });

  // Read current headers
  const currentRes = await sheets.spreadsheets.values.get({
    spreadsheetId: CONFIG.spreadsheetId,
    range: `${CONFIG.sheetName}!A1:Z1`
  });

  const currentHeaders = currentRes.data.values ? currentRes.data.values[0] : [];

  console.log('📋 Current headers:', currentHeaders.join(', '));
  console.log('\n🎯 Desired headers:', DESIRED_HEADERS.join(', '));

  // Update headers
  await sheets.spreadsheets.values.update({
    spreadsheetId: CONFIG.spreadsheetId,
    range: `${CONFIG.sheetName}!A1`,
    valueInputOption: 'RAW',
    resource: {
      values: [DESIRED_HEADERS]
    }
  });

  console.log('\n✅ Headers updated successfully!');
  console.log(`📊 Total columns: ${DESIRED_HEADERS.length}`);

  // Verify
  const verifyRes = await sheets.spreadsheets.values.get({
    spreadsheetId: CONFIG.spreadsheetId,
    range: `${CONFIG.sheetName}!A1:Z1`
  });

  console.log('\n✓ Verified new headers:', verifyRes.data.values[0].join(', '));
}

if (require.main === module) {
  updatePostHeaders().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
}

module.exports = { updatePostHeaders };

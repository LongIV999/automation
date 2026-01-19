const { google } = require('googleapis');
const fs = require('fs').promises;
require('dotenv').config();

const CONFIG = {
  credentialsPath: process.env.GOOGLE_CREDENTIALS_PATH || './credentials.json',
  tokenPath: process.env.GOOGLE_TOKEN_PATH || './token.json',
  spreadsheetId: '1MPyLQw9Q4sLlRiSvWSCyY4NvtVGeoDKoib6n3f4PRTo', // The provided sheet ID
  targetSheetId: 1123323036, // The gid
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
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

async function checkSheet() {
  const auth = await authorize();
  const sheets = google.sheets({ version: 'v4', auth });

  // First, get the spreadsheet metadata to find the sheet name
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: CONFIG.spreadsheetId
  });

  const targetSheet = spreadsheet.data.sheets.find(sheet => sheet.properties.sheetId === CONFIG.targetSheetId);
  if (!targetSheet) {
    console.error('Sheet with gid not found');
    return;
  }

  const sheetName = targetSheet.properties.title;
  console.log(`Sheet name: ${sheetName}`);

  // Now read the data
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: CONFIG.spreadsheetId,
    range: `${sheetName}!A:Z`
  });

  const rows = response.data.values || [];
  console.log(`Rows found: ${rows.length}`);

  // Check for folder IDs from recent uploads
  const recentFolderIds = [
    '1rG0gW5SxIftnYe-pMkyrCgKo0P_eCj2P', // queennailbern new
    '1AHeqWwoa7lUspe-n5tgyNOBcDCtfRm9_', // longbestai
    '1B-h5kWrWLRfBeolgli4cl0geOkPaHtRu', // queennailbern old
    '11QlQTDW7TldEh9s5SxeX9T475DeGgcxI', // queennailbern test
    '1GqkPshH-Dkn2V3w4CYvrAFPD_nLs5NaT' // queennailbern another
  ];

  let found = false;
  rows.forEach((row, index) => {
    row.forEach(cell => {
      if (recentFolderIds.some(id => cell.includes(id))) {
        console.log(`Found folder ID in row ${index + 1}: ${cell}`);
        found = true;
      }
    });
  });

  if (!found) {
    console.log('No recent folder IDs found in the sheet.');
  } else {
    console.log('Recent uploads are already in the sheet.');
  }
}

checkSheet().catch(console.error);
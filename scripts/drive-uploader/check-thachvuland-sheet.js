const { google } = require('googleapis');
const fs = require('fs').promises;

async function checkSheet() {
  const credentials = JSON.parse(await fs.readFile('../../credentials.json', 'utf-8'));
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  const token = JSON.parse(await fs.readFile('../../token.json', 'utf-8'));
  oAuth2Client.setCredentials(token);

  const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });

  // Get sheet info
  const sheetInfo = await sheets.spreadsheets.get({
    spreadsheetId: '1SNv1t0h-KRXWQ4xANroW5RQN6zHU57OrrXj_OqzfVsY'
  });

  console.log('\n📋 AVAILABLE TABS:');
  sheetInfo.data.sheets.forEach(sheet => {
    console.log(` - ${sheet.properties.title} (ID: ${sheet.properties.sheetId})`);
  });

  // Check Post tab headers
  const postHeaders = await sheets.spreadsheets.values.get({
    spreadsheetId: '1SNv1t0h-KRXWQ4xANroW5RQN6zHU57OrrXj_OqzfVsY',
    range: 'Post!A1:Z1'
  });

  console.log('\n📊 POST TAB HEADERS:');
  console.log(postHeaders.data.values[0]);

  // Check sample data
  const sampleData = await sheets.spreadsheets.values.get({
    spreadsheetId: '1SNv1t0h-KRXWQ4xANroW5RQN6zHU57OrrXj_OqzfVsY',
    range: 'Post!A2:Z2'
  });

  console.log('\n📝 SAMPLE ROW (Row 2):');
  if (sampleData.data.values && sampleData.data.values[0]) {
    console.log(sampleData.data.values[0]);
  } else {
    console.log('No data found');
  }
}

checkSheet().catch(console.error);

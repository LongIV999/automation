/**
 * Setup Google Drive Authentication
 *
 * Hướng dẫn người dùng authorize và lưu token
 */

const { google } = require('googleapis');
const fs = require('fs').promises;
const http = require('http');
const url = require('url');
const open = require('open');
require('dotenv').config();

const CONFIG = {
  credentialsPath: process.env.GOOGLE_CREDENTIALS_PATH || './credentials.json',
  tokenPath: process.env.GOOGLE_TOKEN_PATH || './token.json',
  scopes: [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets'
  ],
  port: 3456
};

/**
 * Get OAuth URL and wait for callback
 */
async function getNewToken() {
  const credentials = JSON.parse(await fs.readFile(CONFIG.credentialsPath, 'utf-8'));
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    `http://localhost:${CONFIG.port}`
  );

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: CONFIG.scopes,
  });

  console.log('🔐 Authorizing Google Drive access...\n');
  console.log('Opening browser for authorization...');
  console.log(`If browser doesn't open, visit this URL:\n${authUrl}\n`);

  // Open browser
  await open(authUrl);

  // Start local server to receive callback
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const qs = new url.URL(req.url, `http://localhost:${CONFIG.port}`).searchParams;
        const code = qs.get('code');

        if (code) {
          res.end('✅ Authentication successful! You can close this window.');
          server.close();

          // Exchange code for token
          const { tokens } = await oAuth2Client.getToken(code);
          oAuth2Client.setCredentials(tokens);

          // Save token
          await fs.writeFile(CONFIG.tokenPath, JSON.stringify(tokens));
          console.log('\n✅ Token saved to:', CONFIG.tokenPath);

          resolve(oAuth2Client);
        } else {
          // Ignore requests without code (e.g. favicon.ico)
          res.end('Waiting for authentication...');
        }
      } catch (error) {
        reject(error);
      }
    }).listen(CONFIG.port, () => {
      console.log(`Waiting for authorization (listening on port ${CONFIG.port})...`);
    });
  });
}

/**
 * Main setup
 */
async function main() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║   Long Best AI - Google Drive Setup             ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  try {
    // Check if credentials exist
    try {
      await fs.access(CONFIG.credentialsPath);
    } catch (error) {
      console.error('❌ credentials.json not found!');
      console.log('\n📝 How to get credentials.json:');
      console.log('1. Go to: https://console.cloud.google.com');
      console.log('2. Create project (or select existing)');
      console.log('3. Enable Google Drive API');
      console.log('4. Create OAuth 2.0 Client ID (Desktop app)');
      console.log('5. Download JSON and save as credentials.json');
      console.log(`6. Place it at: ${CONFIG.credentialsPath}\n`);
      process.exit(1);
    }

    // Check if token already exists
    try {
      await fs.access(CONFIG.tokenPath);
      console.log('✅ Token already exists!');
      console.log('To re-authenticate, delete token.json and run again.\n');
      return;
    } catch (error) {
      // Token doesn't exist, proceed with auth
    }

    // Authorize
    await getNewToken();

    console.log('\n🎉 Setup completed successfully!');
    console.log('\nYou can now run:');
    console.log('  node upload.js <images-directory>\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();

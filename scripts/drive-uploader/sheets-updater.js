/**
 * Long Best AI - Google Sheets Auto-Update
 *
 * Tự động cập nhật Google Sheets sau khi upload Drive
 * - Thêm row mới vào Posts tab
 * - Điền Drive Folder ID, Link, và thông tin cơ bản
 */

const { google } = require('googleapis');
const fs = require('fs').promises;
require('dotenv').config();

// Cấu hình
const CONFIG = {
  credentialsPath: process.env.GOOGLE_CREDENTIALS_PATH || './credentials.json',
  tokenPath: process.env.GOOGLE_TOKEN_PATH || './token.json',
  spreadsheetId: process.env.GOOGLE_SHEETS_ID || '1RAHjxLDULl0aRWHSX0aqUh1dqv7li7zwi0DZA6atQj0',
  sheetName: 'Post', // Tên tab trong Google Sheets
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file'
  ]
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
 * Đọc header row để xác định vị trí các cột
 */
async function getColumnMapping(auth) {
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: CONFIG.spreadsheetId,
      range: `${CONFIG.sheetName}!A1:Z1`
    });

    const headers = response.data.values[0];
    const mapping = {};

    headers.forEach((header, index) => {
      const columnLetter = String.fromCharCode(65 + index); // A, B, C...
      mapping[header] = columnLetter;
    });

    return mapping;
  } catch (error) {
    console.error('❌ Error reading headers:', error.message);
    throw error;
  }
}

/**
 * Tìm row trống tiếp theo
 */
async function getNextEmptyRow(auth) {
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: CONFIG.spreadsheetId,
      range: `${CONFIG.sheetName}!A:A`
    });

    const rows = response.data.values || [];
    return rows.length + 1; // Next empty row
  } catch (error) {
    console.error('❌ Error finding empty row:', error.message);
    throw error;
  }
}

/**
 * Thêm post mới vào Google Sheets
 * @param {Object} postData - Dữ liệu post
 * @param {string} postData.postId - ID của post (tùy chọn, sẽ tự tạo)
 * @param {string} postData.folderId - Google Drive Folder ID
 * @param {string} postData.folderLink - Link đến folder
 * @param {string} postData.folderName - Tên folder
 * @param {string} postData.caption - Caption cho post
 * @param {string} postData.status - Status (default: "Ready")
 * @param {string} postData.topic - Topic/Category
 */
async function addPostToSheets(postData) {
  console.log('\n📊 Updating Google Sheets...');

  try {
    const auth = await authorize();
    const sheets = google.sheets({ version: 'v4', auth });

    // Lấy column mapping
    const columns = await getColumnMapping(auth);
    console.log('✓ Column mapping loaded');

    // Tìm row trống
    const nextRow = await getNextEmptyRow(auth);
    console.log(`✓ Next empty row: ${nextRow}`);

    // Chuẩn bị data
    const timestamp = new Date().toISOString();
    const date = new Date().toISOString().split('T')[0];

    const rowData = {
      'Post_ID': postData.postId || `post_${Date.now()}`,
      'Date_Created': date,
      'Drive_Folder_ID': postData.folderId,
      'Drive_Link': postData.folderLink,
      'Caption': postData.caption || '',
      'Status': postData.status || 'Ready',
      'Type': 'Carousel',
      'Topic': postData.topic || extractTopicFromName(postData.folderName),
      'Images_Count': postData.uploadedCount || '',
      'Created_At': timestamp
    };

    // Build values array theo đúng thứ tự columns
    const values = [];
    const updates = [];

    for (const [columnName, columnLetter] of Object.entries(columns)) {
      if (rowData[columnName] !== undefined) {
        const range = `${CONFIG.sheetName}!${columnLetter}${nextRow}`;
        updates.push({
          range: range,
          values: [[rowData[columnName]]]
        });
      }
    }

    // Batch update
    if (updates.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: CONFIG.spreadsheetId,
        resource: {
          valueInputOption: 'USER_ENTERED',
          data: updates
        }
      });

      console.log('✅ Google Sheets updated successfully!');
      console.log(`📝 Row ${nextRow}: ${rowData.Post_ID}`);
      console.log(`🔗 Sheet: https://docs.google.com/spreadsheets/d/${CONFIG.spreadsheetId}`);

      return {
        success: true,
        row: nextRow,
        postId: rowData.Post_ID
      };
    }

  } catch (error) {
    console.error('❌ Error updating Google Sheets:', error.message);

    // Không throw error - vẫn tiếp tục nếu Sheets update fail
    console.warn('⚠️  Continuing without Sheets update. Please add manually.');

    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Extract topic từ folder name
 * Ví dụ: "2026-01-09_nano-banana-prompts" → "Nano Banana"
 */
function extractTopicFromName(folderName) {
  const parts = folderName.split('_');
  if (parts.length > 1) {
    const topic = parts.slice(1).join(' ');
    return topic
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return folderName;
}

/**
 * Load caption từ file nếu có
 */
async function loadCaptionFromFile(contentName) {
  const captionPaths = [
    `/Users/admin/automation/content-calendar/${contentName}-caption.md`,
    `/Users/admin/automation/content-calendar/${contentName}.caption.txt`
  ];

  for (const captionPath of captionPaths) {
    try {
      const content = await fs.readFile(captionPath, 'utf-8');

      // Tìm VERSION 1 nếu có
      const version1Match = content.match(/## VERSION 1[^\n]*\n\n([\s\S]+?)(?=\n##|\n---|\n\*\*|$)/);
      if (version1Match) {
        return version1Match[1].trim();
      }

      // Nếu không có VERSION 1, trả về toàn bộ
      return content.trim();
    } catch (error) {
      // File không tồn tại, thử file tiếp theo
      continue;
    }
  }

  return ''; // Không tìm thấy caption
}

// Export
module.exports = {
  addPostToSheets,
  getColumnMapping,
  getNextEmptyRow,
  loadCaptionFromFile
};

// CLI usage
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node sheets-updater.js <folder-id> <folder-link> <folder-name> [caption]');
    console.log('\nExample:');
    console.log('  node sheets-updater.js "1BKD-..." "https://drive.google..." "2026-01-09_nano-banana" "Caption here"');
    process.exit(1);
  }

  const postData = {
    folderId: args[0],
    folderLink: args[1],
    folderName: args[2],
    caption: args[3] || ''
  };

  await addPostToSheets(postData);
}

if (require.main === module) {
  main();
}

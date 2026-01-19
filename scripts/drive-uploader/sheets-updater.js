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
  sheetName: 'Post', // Tên tab trong Google Sheets (updated for TVLand)
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
async function getColumnMapping(auth, spreadsheetId = CONFIG.spreadsheetId, sheetName = null) {
  const sheets = google.sheets({ version: 'v4', auth });
  const targetSheetName = sheetName || CONFIG.sheetName;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: `${targetSheetName}!A1:Z1`
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
async function getNextEmptyRow(auth, spreadsheetId = CONFIG.spreadsheetId, sheetName = null) {
  const sheets = google.sheets({ version: 'v4', auth });
  const targetSheetName = sheetName || CONFIG.sheetName;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: `${targetSheetName}!A:A`
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
 * @param {string} postData.spreadsheetId - Override default Spreadsheet ID
 */
async function addPostToSheets(postData) {
  console.log('\n📊 Updating Google Sheets...');

  // Determine which spreadsheet and sheet name to use
  const spreadsheetId = postData.spreadsheetId || CONFIG.spreadsheetId;
  const sheetName = postData.sheetName || CONFIG.sheetName;

  try {
    const auth = await authorize();
    const sheets = google.sheets({ version: 'v4', auth });

    // Lấy column mapping - Pass spreadsheetId and sheetName explicitly
    const columns = await getColumnMapping(auth, spreadsheetId, sheetName);
    console.log(`✓ Column mapping loaded for Sheet: ${spreadsheetId.substring(0, 10)}...`);

    // Tìm row trống - Pass spreadsheetId and sheetName explicitly
    const nextRow = await getNextEmptyRow(auth, spreadsheetId, sheetName);
    console.log(`✓ Next empty row: ${nextRow}`);

    // Chuẩn bị data - Match new column headers
    const date = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toISOString();

    // Build row data - support both legacy (LBAI) and new (TVLand) formats
    const rowData = {
      // Common fields
      'Post_ID': postData.postId || `post_${Date.now()}`,
      'Date': date,                                    // LBAI format
      'Date_Created': date,                            // TVLand format
      'Date_Planned': postData.datePlanned || date,    // TVLand format
      'Created_At': timestamp,
      'Topic': postData.topic || extractTopicFromName(postData.folderName),

      // Brand-specific (LBAI)
      'Brand': postData.brand || '',
      'Style': postData.style || '',
      'Content_Type': postData.uploadedCount === 1 ? 'Image' : 'Carousel',

      // Content fields
      'Type': postData.uploadedCount === 1 ? 'Image' : 'Carousel',
      'Caption': postData.caption || '',

      // Drive fields (required for n8n)
      'Drive_Folder_ID': postData.folderId,
      'Drive_Link': postData.folderLink,
      'Folder_Link': postData.folderLink, // Alias for screenshot match

      // Status (required for n8n workflow)
      'Status': postData.status || 'Ready',

      // Metrics
      'Images': postData.uploadedCount || '',
      'Images_Count': postData.uploadedCount || '',    // TVLand format

      // TVLand specific fields
      'Keywords': postData.keywords || '',
      'Target_Audience': postData.targetAudience || '',
      'Priority': postData.priority || 'Medium',
      'Research_Notes': postData.researchNotes || '',

      // Post results (filled by n8n)
      'Post_URL': '',
      'Published_Date': '',
      'FB_Post_ID': '',
      'ReachEngagement': ''
    };

    // Build values array theo đúng thứ tự columns
    const values = [];
    const updates = [];

    for (const [columnName, columnLetter] of Object.entries(columns)) {
      if (rowData[columnName] !== undefined) {
        const range = `${sheetName}!${columnLetter}${nextRow}`;
        updates.push({
          range: range,
          values: [[rowData[columnName]]]
        });
      }
    }

    // Batch update
    if (updates.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: spreadsheetId,
        resource: {
          valueInputOption: 'USER_ENTERED',
          data: updates
        }
      });

      console.log('✅ Google Sheets updated successfully!');
      console.log(`📝 Row ${nextRow}: ${rowData.Post_ID}`);
      console.log(`🔗 Sheet: https://docs.google.com/spreadsheets/d/${spreadsheetId}`);

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

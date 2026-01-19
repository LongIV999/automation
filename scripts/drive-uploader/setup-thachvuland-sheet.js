/**
 * Setup Google Sheet cho Thach Vu Land
 * Tối ưu hóa để tương thích với n8n workflow autopost-tvland.json
 */

const { google } = require('googleapis');
const fs = require('fs').promises;

const SHEET_ID = '1SNv1t0h-KRXWQ4xANroW5RQN6zHU57OrrXj_OqzfVsY';
const POST_TAB_NAME = 'Post';

async function authorize() {
  const credentials = JSON.parse(await fs.readFile('../../credentials.json', 'utf-8'));
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  const token = JSON.parse(await fs.readFile('../../token.json', 'utf-8'));
  oAuth2Client.setCredentials(token);
  return oAuth2Client;
}

async function setupSheet() {
  console.log('🚀 Setting up Thach Vu Land Google Sheet...\n');

  const auth = await authorize();
  const sheets = google.sheets({ version: 'v4', auth });

  // Headers phù hợp với n8n workflow
  const headers = [
    'Post_ID',           // A - Unique ID
    'Date_Created',      // B - Ngày tạo content
    'Date_Planned',      // C - Ngày dự kiến đăng
    'Topic',             // D - Chủ đề
    'Caption',           // E - Caption cho post (REQUIRED by n8n)
    'Drive_Folder_ID',   // F - ID folder trên Drive (REQUIRED by n8n)
    'Drive_Link',        // G - Link đến folder
    'Status',            // H - Status: Draft/Ready/Done (REQUIRED by n8n)
    'Type',              // I - Loại: Carousel/Image/Video
    'Images_Count',      // J - Số lượng ảnh
    'Keywords',          // K - Keywords SEO
    'Target_Audience',   // L - Đối tượng mục tiêu
    'Priority',          // M - Độ ưu tiên: High/Medium/Low
    'Research_Notes',    // N - Ghi chú nghiên cứu
    'Post_URL',          // O - URL sau khi đăng (Updated by n8n)
    'Published_Date',    // P - Ngày đăng thực tế
    'Created_At'         // Q - Timestamp tạo
  ];

  try {
    // 1. Clear existing headers
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SHEET_ID,
      range: `${POST_TAB_NAME}!A1:Z1`
    });
    console.log('✓ Cleared old headers');

    // 2. Write new headers
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${POST_TAB_NAME}!A1:Q1`,
      valueInputOption: 'RAW',
      resource: {
        values: [headers]
      }
    });
    console.log('✓ Added new headers');

    // 3. Format header row (bold + background color)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      resource: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 1123323036, // Post tab ID
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: 17
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.04,
                    green: 0.15,
                    blue: 0.25
                  },
                  textFormat: {
                    foregroundColor: {
                      red: 1.0,
                      green: 1.0,
                      blue: 1.0
                    },
                    fontSize: 11,
                    bold: true
                  }
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat)'
            }
          },
          // Freeze header row
          {
            updateSheetProperties: {
              properties: {
                sheetId: 1123323036,
                gridProperties: {
                  frozenRowCount: 1
                }
              },
              fields: 'gridProperties.frozenRowCount'
            }
          },
          // Auto-resize columns
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: 1123323036,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: 17
              }
            }
          }
        ]
      }
    });
    console.log('✓ Formatted headers');

    // 4. Add sample row for testing
    const sampleRow = [
      `post_${Date.now()}`,                                    // Post_ID
      new Date().toISOString().split('T')[0],                  // Date_Created
      new Date().toISOString().split('T')[0],                  // Date_Planned
      '10 Lý Do Nên Đầu Tư BĐS Bình Dương',                   // Topic
      'Khám phá 10 lý do vì sao Bình Dương là điểm đến đầu tư bất động sản hàng đầu 2026! 🏡✨',  // Caption
      'SAMPLE_FOLDER_ID',                                      // Drive_Folder_ID
      'https://drive.google.com/drive/folders/SAMPLE',         // Drive_Link
      'Ready',                                                 // Status
      'Carousel',                                              // Type
      '7',                                                     // Images_Count
      'bất động sản, Bình Dương, đầu tư',                      // Keywords
      'Người mua nhà lần đầu, Nhà đầu tư',                     // Target_Audience
      'High',                                                  // Priority
      'Content dựa trên xu hướng thị trường Q1 2026',          // Research_Notes
      '',                                                      // Post_URL (empty, will be filled by n8n)
      '',                                                      // Published_Date
      new Date().toISOString()                                 // Created_At
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${POST_TAB_NAME}!A2`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [sampleRow]
      }
    });
    console.log('✓ Added sample row');

    console.log('\n✅ Sheet setup complete!');
    console.log(`🔗 View sheet: https://docs.google.com/spreadsheets/d/${SHEET_ID}`);

    console.log('\n📋 COLUMN MAPPING:');
    headers.forEach((header, index) => {
      const column = String.fromCharCode(65 + index);
      console.log(`  ${column}: ${header}`);
    });

    console.log('\n📝 N8N WORKFLOW REQUIREMENTS:');
    console.log('  ✓ Caption (Column E) - Required for Facebook post message');
    console.log('  ✓ Drive_Folder_ID (Column F) - Required to list images');
    console.log('  ✓ Status (Column H) - Workflow filters by "Ready" status');
    console.log('  ✓ Post_URL (Column O) - Updated after successful post');

    console.log('\n💡 NEXT STEPS:');
    console.log('  1. Update Status from "Ready" to trigger autopost workflow');
    console.log('  2. Make sure Drive_Folder_ID contains valid Google Drive folder ID');
    console.log('  3. Caption should be compelling and include hashtags');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

setupSheet().catch(console.error);

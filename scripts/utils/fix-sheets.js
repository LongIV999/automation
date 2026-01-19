/**
 * Google Sheets Header & Format Fixer
 * 
 * Sửa lỗi hiển thị và đặt lại header chuẩn cho sheets
 * Giữ nguyên các cột cần thiết cho n8n workflow:
 * - Drive_Folder_ID (bắt buộc cho n8n)
 * - Caption (nội dung bài đăng)
 * - Status (trạng thái: Ready, Posted, etc.)
 */

const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../drive-uploader/.env') });

const CONFIG = {
    credentialsPath: path.join(__dirname, '../drive-uploader/credentials.json'),
    tokenPath: path.join(__dirname, '../drive-uploader/token.json'),
    sheets: [
        {
            id: process.env.GOOGLE_SHEETS_ID,
            name: 'Long Best AI',
            headerColor: { red: 0.12, green: 0.12, blue: 0.12 } // Dark Grey
        },
        {
            id: process.env.GOOGLE_SHEETS_ID_THACHVULAND,
            name: 'Thach Vu Land',
            headerColor: { red: 0.04, green: 0.15, blue: 0.25 } // Navy
        }
    ],
    // Các cột cần thiết cho n8n và automation
    headers: [
        'Post_ID',
        'Date',
        'Topic',
        'Caption',
        'Drive_Folder_ID',
        'Drive_Link',
        'Status',
        'Type',
        'Images'
    ]
};

async function authorize() {
    const credentials = JSON.parse(await fs.readFile(CONFIG.credentialsPath, 'utf-8'));
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    try {
        const token = JSON.parse(await fs.readFile(CONFIG.tokenPath, 'utf-8'));
        oAuth2Client.setCredentials(token);
        return oAuth2Client;
    } catch (error) {
        console.error('❌ Token not found.');
        process.exit(1);
    }
}

async function fixSheetHeaders(auth, spreadsheetId, brandName, headerColor) {
    const sheets = google.sheets({ version: 'v4', auth });

    console.log(`\n🔧 Fixing sheet: ${brandName}...`);

    try {
        // Get sheet metadata
        const metadata = await sheets.spreadsheets.get({ spreadsheetId });
        const sheetId = metadata.data.sheets[0].properties.sheetId;
        const sheetName = metadata.data.sheets[0].properties.title;

        // 1. Clear hàng 1 và đặt lại headers mới
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!A1:${String.fromCharCode(65 + CONFIG.headers.length - 1)}1`,
            valueInputOption: 'RAW',
            resource: {
                values: [CONFIG.headers]
            }
        });
        console.log(`✓ Headers updated: ${CONFIG.headers.join(', ')}`);

        // 2. Format header row
        const requests = [
            // Đóng băng hàng đầu
            {
                updateSheetProperties: {
                    properties: {
                        sheetId: sheetId,
                        gridProperties: { frozenRowCount: 1 }
                    },
                    fields: 'gridProperties.frozenRowCount'
                }
            },
            // Style header: màu nền, chữ trắng đậm
            {
                repeatCell: {
                    range: { sheetId: sheetId, startRowIndex: 0, endRowIndex: 1 },
                    cell: {
                        userEnteredFormat: {
                            backgroundColor: headerColor,
                            textFormat: {
                                foregroundColor: { red: 1, green: 1, blue: 1 },
                                bold: true,
                                fontSize: 11,
                                fontFamily: 'Roboto'
                            },
                            horizontalAlignment: 'CENTER',
                            verticalAlignment: 'MIDDLE'
                        }
                    },
                    fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)'
                }
            },
            // Set font cho toàn bộ sheet
            {
                repeatCell: {
                    range: { sheetId: sheetId, startRowIndex: 1 },
                    cell: {
                        userEnteredFormat: {
                            textFormat: {
                                fontFamily: 'Roboto',
                                fontSize: 10
                            }
                        }
                    },
                    fields: 'userEnteredFormat.textFormat'
                }
            },
            // Set column widths
            {
                updateDimensionProperties: {
                    range: { sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, // Post_ID
                    properties: { pixelSize: 180 },
                    fields: 'pixelSize'
                }
            },
            {
                updateDimensionProperties: {
                    range: { sheetId, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 }, // Date
                    properties: { pixelSize: 100 },
                    fields: 'pixelSize'
                }
            },
            {
                updateDimensionProperties: {
                    range: { sheetId, dimension: 'COLUMNS', startIndex: 2, endIndex: 3 }, // Topic
                    properties: { pixelSize: 200 },
                    fields: 'pixelSize'
                }
            },
            {
                updateDimensionProperties: {
                    range: { sheetId, dimension: 'COLUMNS', startIndex: 3, endIndex: 4 }, // Caption
                    properties: { pixelSize: 350 },
                    fields: 'pixelSize'
                }
            },
            {
                updateDimensionProperties: {
                    range: { sheetId, dimension: 'COLUMNS', startIndex: 4, endIndex: 5 }, // Drive_Folder_ID
                    properties: { pixelSize: 200 },
                    fields: 'pixelSize'
                }
            },
            {
                updateDimensionProperties: {
                    range: { sheetId, dimension: 'COLUMNS', startIndex: 5, endIndex: 6 }, // Drive_Link
                    properties: { pixelSize: 250 },
                    fields: 'pixelSize'
                }
            },
            {
                updateDimensionProperties: {
                    range: { sheetId, dimension: 'COLUMNS', startIndex: 6, endIndex: 7 }, // Status
                    properties: { pixelSize: 100 },
                    fields: 'pixelSize'
                }
            },
            // Xóa các conditional format rules cũ
            {
                deleteConditionalFormatRule: {
                    sheetId: sheetId,
                    index: 0
                }
            }
        ];

        try {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                resource: { requests }
            });
        } catch (e) {
            // Ignore error if no conditional format rules exist
            // Re-run without delete rule
            requests.pop();
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                resource: { requests }
            });
        }

        console.log(`✅ Sheet "${brandName}" fixed successfully!`);
        console.log(`📊 https://docs.google.com/spreadsheets/d/${spreadsheetId}`);

    } catch (error) {
        console.error(`❌ Error fixing ${brandName}:`, error.message);
    }
}

async function main() {
    const auth = await authorize();

    for (const sheet of CONFIG.sheets) {
        if (sheet.id) {
            await fixSheetHeaders(auth, sheet.id, sheet.name, sheet.headerColor);
        } else {
            console.warn(`⚠️  No ID for ${sheet.name}, skipping.`);
        }
    }

    console.log('\n✨ ALL SHEETS FIXED! ✨');
    console.log('\nNew columns: Post_ID | Date | Topic | Caption | Drive_Folder_ID | Drive_Link | Status | Type | Images');
}

main();

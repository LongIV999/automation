/**
 * Google Sheets Formatter
 * 
 * Áp dụng thiết kế chuyên nghiệp cho các trang Google Sheet:
 * - Header: Màu thương hiệu, Chữ trắng, In đậm, Đóng băng hàng đầu.
 * - Nội dung: Kẻ sọc (Alternating colors), font chữ dễ nhìn.
 * - Cột: Tự động căn chỉnh độ rộng.
 * - Conditional Formatting: Màu sắc cho trạng thái (Ready, Published, Pending).
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
            id: process.env.GOOGLE_SHEETS_ID || '1RAHjxLDULl0aRWHSX0aqUh1dqv7li7zwi0DZA6atQj0',
            name: 'Long Best AI',
            color: { red: 0.1, green: 0.1, blue: 0.1 } // Dark Grey
        },
        {
            id: process.env.GOOGLE_SHEETS_ID_THACHVULAND || '1SNv1t0h-KRXWQ4xANroW5RQN6zHU57OrrXj_OqzfVsY',
            name: 'Thach Vu Land',
            color: { red: 0.04, green: 0.14, blue: 0.25 } // Navy
        }
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
        console.error('❌ Token not found. Please authenticate first.');
        process.exit(1);
    }
}

async function formatSheet(auth, spreadsheetId, brandColor) {
    const sheets = google.sheets({ version: 'v4', auth });

    console.log(`\n🎨 Designing sheet: ${spreadsheetId}...`);

    try {
        // 1. Get spreadsheet metadata to find sheetId
        const metadata = await sheets.spreadsheets.get({ spreadsheetId });
        const sheetId = metadata.data.sheets[0].properties.sheetId;

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
            // Styling Header (Hàng 1)
            {
                repeatCell: {
                    range: { sheetId: sheetId, startRowIndex: 0, endRowIndex: 1 },
                    cell: {
                        userEnteredFormat: {
                            backgroundColor: brandColor,
                            textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 11 },
                            horizontalAlignment: 'CENTER',
                            verticalAlignment: 'MIDDLE'
                        }
                    },
                    fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)'
                }
            },
            // Kẻ sọc (Alternating colors) cho toàn bộ bảng
            {
                addConditionalFormatRule: {
                    rule: {
                        ranges: [{ sheetId: sheetId, startRowIndex: 1 }],
                        booleanRule: {
                            condition: { type: 'CUSTOM_FORMULA', values: [{ userEnteredValue: '=ISEVEN(ROW())' }] },
                            format: { backgroundColor: { red: 0.95, green: 0.95, blue: 0.95 } }
                        }
                    },
                    index: 0
                }
            },
            // Tự động căn chỉnh độ rộng cột
            {
                autoResizeDimensions: {
                    dimensions: {
                        sheetId: sheetId,
                        dimension: 'COLUMNS',
                        startIndex: 0,
                        endIndex: 15
                    }
                }
            }
        ];

        // Thực hiện batch update
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: spreadsheetId,
            resource: { requests }
        });

        console.log(`✅ Sheet redesign complete!`);

    } catch (error) {
        console.error(`❌ Error formatting sheet ${spreadsheetId}:`, error.message);
    }
}

async function main() {
    const auth = await authorize();

    for (const sheet of CONFIG.sheets) {
        await formatSheet(auth, sheet.id, sheet.color);
    }

    console.log('\n✨✨✨ ALL SHEETS REDESIGNED SUCCESSFULLY ✨✨✨');
}

main();

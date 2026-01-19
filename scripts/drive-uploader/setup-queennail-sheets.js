/**
 * Queen Nail Bern - Google Sheets Auto Setup
 *
 * Automatically creates and configures required tabs:
 * - Content_Calendar (main scheduling tab)
 * - Analytics (performance tracking)
 * - Rename "Analys" to "Analytics" if needed
 */

const fs = require('fs');
const { google } = require('googleapis');

const BRAND_CONFIG = require('../../brands/queennailbern/brand.json');
const SHEET_ID = BRAND_CONFIG.googleSheets.sheetId;

// Load OAuth credentials
const credentials = JSON.parse(fs.readFileSync('credentials.json'));
const token = JSON.parse(fs.readFileSync('token.json'));

const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
oAuth2Client.setCredentials(token);

const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });

// Color definitions (RGB 0-1 scale)
const COLORS = {
  pink: { red: 0.91, green: 0.71, blue: 0.78 },      // #E8B4C8
  white: { red: 1, green: 1, blue: 1 },
  lightGreen: { red: 0.85, green: 0.92, blue: 0.82 },
  lightYellow: { red: 1, green: 0.95, blue: 0.8 },
  lightOrange: { red: 1, green: 0.85, blue: 0.7 },
  lightBlue: { red: 0.82, green: 0.88, blue: 0.95 }
};

async function getExistingSheets() {
  const response = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  return response.data.sheets.map(s => ({
    id: s.properties.sheetId,
    title: s.properties.title
  }));
}

async function createContentCalendarTab(existingSheets) {
  console.log('\n📅 Setting up Content_Calendar tab...');

  // Check if tab exists
  const existing = existingSheets.find(s => s.title === 'Content_Calendar');
  if (existing) {
    console.log('  ✓ Tab already exists (ID:', existing.id + ')');
    return existing.id;
  }

  // Create new tab
  const request = {
    spreadsheetId: SHEET_ID,
    resource: {
      requests: [{
        addSheet: {
          properties: {
            title: 'Content_Calendar',
            gridProperties: {
              rowCount: 100,
              columnCount: 9,
              frozenRowCount: 1
            }
          }
        }
      }]
    }
  };

  const response = await sheets.spreadsheets.batchUpdate(request);
  const sheetId = response.data.replies[0].addSheet.properties.sheetId;
  console.log('  ✓ Tab created (ID:', sheetId + ')');

  // Add headers
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: 'Content_Calendar!A1:I1',
    valueInputOption: 'RAW',
    resource: {
      values: [[
        'Date', 'Day', 'Topic', 'Content_Type', 'Status',
        'Folder_ID', 'Folder_Link', 'Image_Count', 'Posted_At'
      ]]
    }
  });

  // Format headers
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    resource: {
      requests: [
        // Header background color (pink)
        {
          repeatCell: {
            range: {
              sheetId: sheetId,
              startRowIndex: 0,
              endRowIndex: 1
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: COLORS.pink,
                textFormat: {
                  bold: true,
                  foregroundColor: COLORS.white
                },
                horizontalAlignment: 'CENTER'
              }
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
          }
        },
        // Column widths
        {
          updateDimensionProperties: {
            range: { sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 },
            properties: { pixelSize: 100 },
            fields: 'pixelSize'
          }
        },
        {
          updateDimensionProperties: {
            range: { sheetId, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 },
            properties: { pixelSize: 90 },
            fields: 'pixelSize'
          }
        },
        {
          updateDimensionProperties: {
            range: { sheetId, dimension: 'COLUMNS', startIndex: 2, endIndex: 3 },
            properties: { pixelSize: 250 },
            fields: 'pixelSize'
          }
        },
        {
          updateDimensionProperties: {
            range: { sheetId, dimension: 'COLUMNS', startIndex: 3, endIndex: 5 },
            properties: { pixelSize: 140 },
            fields: 'pixelSize'
          }
        },
        // Data validation for Status column (E)
        {
          setDataValidation: {
            range: {
              sheetId: sheetId,
              startRowIndex: 1,
              startColumnIndex: 4,
              endColumnIndex: 5
            },
            rule: {
              condition: {
                type: 'ONE_OF_LIST',
                values: [
                  { userEnteredValue: 'draft' },
                  { userEnteredValue: 'pending' },
                  { userEnteredValue: 'scheduled' },
                  { userEnteredValue: 'published' },
                  { userEnteredValue: 'archived' }
                ]
              },
              showCustomUi: true
            }
          }
        },
        // Data validation for Content_Type column (D)
        {
          setDataValidation: {
            range: {
              sheetId: sheetId,
              startRowIndex: 1,
              startColumnIndex: 3,
              endColumnIndex: 4
            },
            rule: {
              condition: {
                type: 'ONE_OF_LIST',
                values: [
                  { userEnteredValue: 'Nail Designs & Trends' },
                  { userEnteredValue: 'Tips & Care' },
                  { userEnteredValue: 'Promotions & Pricing' },
                  { userEnteredValue: 'Customer Reviews' },
                  { userEnteredValue: 'Behind the Scenes' }
                ]
              },
              showCustomUi: true
            }
          }
        },
        // Conditional formatting for Status
        {
          addConditionalFormatRule: {
            rule: {
              ranges: [{ sheetId: sheetId, startRowIndex: 1, startColumnIndex: 4, endColumnIndex: 5 }],
              booleanRule: {
                condition: {
                  type: 'TEXT_EQ',
                  values: [{ userEnteredValue: 'published' }]
                },
                format: { backgroundColor: COLORS.lightGreen }
              }
            }
          }
        },
        {
          addConditionalFormatRule: {
            rule: {
              ranges: [{ sheetId: sheetId, startRowIndex: 1, startColumnIndex: 4, endColumnIndex: 5 }],
              booleanRule: {
                condition: {
                  type: 'TEXT_EQ',
                  values: [{ userEnteredValue: 'scheduled' }]
                },
                format: { backgroundColor: COLORS.lightYellow }
              }
            }
          }
        },
        {
          addConditionalFormatRule: {
            rule: {
              ranges: [{ sheetId: sheetId, startRowIndex: 1, startColumnIndex: 4, endColumnIndex: 5 }],
              booleanRule: {
                condition: {
                  type: 'TEXT_EQ',
                  values: [{ userEnteredValue: 'draft' }]
                },
                format: { backgroundColor: COLORS.lightOrange }
              }
            }
          }
        },
        {
          addConditionalFormatRule: {
            rule: {
              ranges: [{ sheetId: sheetId, startRowIndex: 1, startColumnIndex: 4, endColumnIndex: 5 }],
              booleanRule: {
                condition: {
                  type: 'TEXT_EQ',
                  values: [{ userEnteredValue: 'pending' }]
                },
                format: { backgroundColor: COLORS.lightBlue }
              }
            }
          }
        }
      ]
    }
  });

  console.log('  ✓ Headers and formatting applied');

  // Add sample data
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: 'Content_Calendar!A2:I6',
    valueInputOption: 'RAW',
    resource: {
      values: [
        ['2026-01-13', 'Monday', '5 Trendige Nageldesigns für Winter 2026', 'Nail Designs & Trends', 'draft', '', '', '', ''],
        ['2026-01-14', 'Tuesday', '7 Tipps für gesunde Nägel im Winter', 'Tips & Care', 'draft', '', '', '', ''],
        ['2026-01-15', 'Wednesday', 'French Manicure: Zeitlos und Elegant', 'Nail Designs & Trends', 'draft', '', '', '', ''],
        ['2026-01-16', 'Thursday', 'Neukunden-Special: 20% Rabatt', 'Promotions & Pricing', 'draft', '', '', '', ''],
        ['2026-01-17', 'Friday', 'Kundin des Monats: Lisa\'s Story', 'Customer Reviews', 'draft', '', '', '', '']
      ]
    }
  });

  console.log('  ✓ Sample Week 1 data added');

  return sheetId;
}

async function createAnalyticsTab(existingSheets) {
  console.log('\n📊 Setting up Analytics tab...');

  // Check if need to rename "Analys"
  const analys = existingSheets.find(s => s.title === 'Analys');
  if (analys) {
    console.log('  → Renaming "Analys" to "Analytics"...');
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      resource: {
        requests: [{
          updateSheetProperties: {
            properties: {
              sheetId: analys.id,
              title: 'Analytics'
            },
            fields: 'title'
          }
        }]
      }
    });
    console.log('  ✓ Tab renamed');
    return analys.id;
  }

  // Check if Analytics already exists
  const existing = existingSheets.find(s => s.title === 'Analytics');
  if (existing) {
    console.log('  ✓ Tab already exists (ID:', existing.id + ')');
    return existing.id;
  }

  // Create new tab
  const request = {
    spreadsheetId: SHEET_ID,
    resource: {
      requests: [{
        addSheet: {
          properties: {
            title: 'Analytics',
            gridProperties: {
              rowCount: 50,
              columnCount: 8,
              frozenRowCount: 1
            }
          }
        }
      }]
    }
  };

  const response = await sheets.spreadsheets.batchUpdate(request);
  const sheetId = response.data.replies[0].addSheet.properties.sheetId;
  console.log('  ✓ Tab created (ID:', sheetId + ')');

  // Add headers
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: 'Analytics!A1:H1',
    valueInputOption: 'RAW',
    resource: {
      values: [[
        'Week', 'Content_Type', 'Posts_Count', 'Total_Reach',
        'Avg_Engagement', 'Top_Post', 'Notes', 'Action_Items'
      ]]
    }
  });

  // Format headers
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    resource: {
      requests: [{
        repeatCell: {
          range: {
            sheetId: sheetId,
            startRowIndex: 0,
            endRowIndex: 1
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: COLORS.pink,
              textFormat: {
                bold: true,
                foregroundColor: COLORS.white
              },
              horizontalAlignment: 'CENTER'
            }
          },
          fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
        }
      }]
    }
  });

  console.log('  ✓ Headers formatted');

  return sheetId;
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  👑 QUEEN NAIL BERN - GOOGLE SHEETS AUTO SETUP 💅');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('\n📋 Sheet ID:', SHEET_ID);

  try {
    // Get existing sheets
    console.log('\n🔍 Checking existing tabs...');
    const existingSheets = await getExistingSheets();
    console.log('  Found tabs:', existingSheets.map(s => s.title).join(', '));

    // Setup Content_Calendar
    await createContentCalendarTab(existingSheets);

    // Setup Analytics
    await createAnalyticsTab(existingSheets);

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('✅ SETUP COMPLETE!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n📊 Your Google Sheet is ready:');
    console.log('  ✓ Content_Calendar - Main scheduling tab');
    console.log('  ✓ Posts - Published posts archive');
    console.log('  ✓ Archive - Old content storage');
    console.log('  ✓ Analytics - Performance tracking');
    console.log('\n📝 Sample Week 1 content added to Content_Calendar');
    console.log('\n🔗 View your sheet:');
    console.log(`  https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`);
    console.log('\n🚀 Next: Generate content with:');
    console.log('  node scripts/daily-agent.js "Topic" --brand queennailbern');
    console.log('');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error);
    process.exit(1);
  }
}

main();

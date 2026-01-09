/**
 * Long Best AI - Google Sheets Automation
 *
 * Auto-sync từ ToTable → Post tab
 * Khi status trong ToTable = "Planned" → Copy sang Post tab với status "Ready"
 */

// Configuration
const CONFIG = {
  sourceTab: 'ToTable',
  targetTab: 'Post',
  statusColumn: 'Status',
  triggerStatus: 'Planned',
  targetStatus: 'Ready'
};

/**
 * Trigger khi user edit cell trong Sheets
 */
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const sheetName = sheet.getName();

  // Chỉ chạy khi edit tab ToTable
  if (sheetName !== CONFIG.sourceTab) {
    return;
  }

  const range = e.range;
  const row = range.getRow();
  const col = range.getColumn();

  // Skip header row
  if (row === 1) {
    return;
  }

  // Check if Status column was edited
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const statusColIndex = headers.indexOf(CONFIG.statusColumn) + 1;

  if (col === statusColIndex) {
    const newStatus = range.getValue();

    // Nếu status = "Planned" → Copy sang Post tab
    if (newStatus === CONFIG.triggerStatus) {
      copyToPostTab(sheet, row);
    }
  }
}

/**
 * Copy row từ ToTable sang Post tab
 */
function copyToPostTab(sourceSheet, sourceRow) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const targetSheet = ss.getSheetByName(CONFIG.targetTab);

    if (!targetSheet) {
      Logger.log('Tab "Post" không tồn tại');
      return;
    }

    // Đọc headers từ cả 2 tabs
    const sourceHeaders = sourceSheet.getRange(1, 1, 1, sourceSheet.getLastColumn()).getValues()[0];
    const targetHeaders = targetSheet.getRange(1, 1, 1, targetSheet.getLastColumn()).getValues()[0];

    // Đọc data từ source row
    const sourceData = sourceSheet.getRange(sourceRow, 1, 1, sourceSheet.getLastColumn()).getValues()[0];

    // Map data theo headers
    const rowData = {};
    sourceHeaders.forEach((header, index) => {
      rowData[header] = sourceData[index];
    });

    // Chuẩn bị data cho Post tab
    const timestamp = new Date().toISOString();
    const postRow = {
      'Post_ID': rowData['Post_ID'] || '',
      'Date_Created': new Date().toISOString().split('T')[0],
      'Date_Planned': rowData['Date'] || '',
      'Topic': rowData['Topic'] || '',
      'Caption': rowData['Topic'] || '', // Auto-copy từ Topic
      'Drive_Folder_ID': '', // Sẽ điền khi upload
      'Drive_Link': '',
      'Status': CONFIG.targetStatus, // "Ready"
      'Type': 'Carousel',
      'Images_Count': '7',
      'Keywords': rowData['Keywords'] || '',
      'Target_Audience': rowData['Target_Audience'] || '',
      'Priority': rowData['**Priority**'] || 'Medium',
      'Research_Notes': rowData['Research_Notes'] || '',
      'Created_At': timestamp
    };

    // Tìm row trống trong Post tab
    const nextRow = targetSheet.getLastRow() + 1;

    // Build values array theo đúng thứ tự columns trong Post tab
    const values = [];
    targetHeaders.forEach(header => {
      values.push(postRow[header] || '');
    });

    // Write to Post tab
    targetSheet.getRange(nextRow, 1, 1, values.length).setValues([values]);

    // Update ToTable status sang "Synced" để mark là đã copy
    const statusColIndex = sourceHeaders.indexOf(CONFIG.statusColumn) + 1;
    sourceSheet.getRange(sourceRow, statusColIndex).setValue('Synced');

    // Log success
    Logger.log(`✅ Copied row ${sourceRow} to Post tab (row ${nextRow})`);

    // Show notification (optional)
    SpreadsheetApp.getActiveSpreadsheet().toast(
      `✅ Copied "${rowData['Topic']}" to Post tab with status "Ready"`,
      'Auto-Sync Success',
      5
    );

  } catch (error) {
    Logger.log('❌ Error copying to Post tab: ' + error.toString());
    SpreadsheetApp.getActiveSpreadsheet().toast(
      '❌ Error: ' + error.toString(),
      'Auto-Sync Failed',
      5
    );
  }
}

/**
 * Menu custom để manual sync
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🤖 Long Best AI')
    .addItem('📋 Sync All Planned → Post', 'syncAllPlanned')
    .addItem('🧪 Test Auto-Sync', 'testAutoSync')
    .addSeparator()
    .addItem('📖 Help', 'showHelp')
    .addToUi();
}

/**
 * Sync tất cả rows có status "Planned"
 */
function syncAllPlanned() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = ss.getSheetByName(CONFIG.sourceTab);

  if (!sourceSheet) {
    SpreadsheetApp.getUi().alert('Tab "ToTable" không tồn tại');
    return;
  }

  const headers = sourceSheet.getRange(1, 1, 1, sourceSheet.getLastColumn()).getValues()[0];
  const statusColIndex = headers.indexOf(CONFIG.statusColumn) + 1;
  const lastRow = sourceSheet.getLastRow();

  let syncCount = 0;

  // Loop qua tất cả rows
  for (let row = 2; row <= lastRow; row++) {
    const status = sourceSheet.getRange(row, statusColIndex).getValue();

    if (status === CONFIG.triggerStatus) {
      copyToPostTab(sourceSheet, row);
      syncCount++;
    }
  }

  SpreadsheetApp.getUi().alert(
    `✅ Synced ${syncCount} items from ToTable → Post tab`
  );
}

/**
 * Test function
 */
function testAutoSync() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = ss.getSheetByName(CONFIG.sourceTab);

  if (!sourceSheet) {
    SpreadsheetApp.getUi().alert('Tab "ToTable" không tồn tại');
    return;
  }

  // Test với row 2
  copyToPostTab(sourceSheet, 2);

  SpreadsheetApp.getUi().alert('✅ Test completed! Check Post tab.');
}

/**
 * Show help dialog
 */
function showHelp() {
  const html = `
    <div style="font-family: Arial; padding: 20px;">
      <h2>🤖 Long Best AI - Auto-Sync Guide</h2>

      <h3>Cách hoạt động:</h3>
      <ol>
        <li>Trong tab <b>ToTable</b>, chuyển Status thành <b>"Planned"</b></li>
        <li>Script tự động copy row đó sang tab <b>Post</b></li>
        <li>Status trong Post tab = <b>"Ready"</b> (sẵn sàng cho n8n)</li>
        <li>Status trong ToTable đổi thành <b>"Synced"</b></li>
      </ol>

      <h3>Manual Sync:</h3>
      <p>Menu: <b>🤖 Long Best AI → 📋 Sync All Planned → Post</b></p>
      <p>Sync tất cả rows có status "Planned" cùng lúc</p>

      <h3>Workflow:</h3>
      <pre>
ToTable (Status: Planned)
    ↓ Auto-Sync
Post tab (Status: Ready)
    ↓ n8n workflow
Facebook (Auto-post)
    ↓ Update
Post tab (Status: Done)
      </pre>

      <p style="color: #666; margin-top: 20px;">
        Created by Long Best AI<br>
        2026-01-09
      </p>
    </div>
  `;

  const htmlOutput = HtmlService.createHtmlOutput(html)
    .setWidth(500)
    .setHeight(450);

  SpreadsheetApp.getUi().showModalDialog(htmlOutput, '🤖 Auto-Sync Help');
}

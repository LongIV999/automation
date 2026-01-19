# AUTO-SYNC: ToTable → Post Tab

## 🎯 Tổng quan

Tự động chuyển content từ tab **ToTable** sang tab **Post** khi status = "Planned".

**Workflow:**
```
ToTable tab (Status: "Planned")
    ↓ Auto-Sync (Google Apps Script)
Post tab (Status: "Ready")
    ↓ n8n workflow
Facebook (Auto-post)
    ↓ Update
Post tab (Status: "Done")
```

**Khi nào dùng:**
- Đã tạo content plan trong ToTable
- Sẵn sàng tạo carousel cho topic
- Muốn đưa vào queue để n8n auto-post

---

## 🚀 SETUP GOOGLE APPS SCRIPT

### Bước 1: Mở Google Sheets

Vào: https://docs.google.com/spreadsheets/d/1RAHjxLDULl0aRWHSX0aqUh1dqv7li7zwi0DZA6atQj0

### Bước 2: Mở Apps Script Editor

1. Menu: **Extensions** → **Apps Script**
2. Tab mới sẽ mở Apps Script editor

### Bước 3: Copy code vào

1. Xóa hết code mặc định (function myFunction...)
2. Copy toàn bộ code từ file: `/Users/admin/automation/scripts/drive-uploader/sheets-automation.gs`
3. Paste vào Apps Script editor

**Hoặc copy trực tiếp:**

```javascript
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

// ... (copy toàn bộ code từ file .gs)
```

### Bước 4: Lưu project

1. Click **Save** (💾 icon) hoặc Cmd+S
2. Đặt tên project: **"Long Best AI - Auto Sync"**
3. Click **OK**

### Bước 5: Setup trigger

1. Click **Triggers** icon (⏰ bên trái)
2. Click **+ Add Trigger** (góc dưới bên phải)

**Configure trigger:**
- Choose which function to run: **`onEdit`**
- Choose which deployment: **Head**
- Select event source: **From spreadsheet**
- Select event type: **On edit**
- Click **Save**

3. Authorize script:
   - Click **Review Permissions**
   - Chọn Google account
   - Click **Advanced** → **Go to Long Best AI - Auto Sync (unsafe)**
   - Click **Allow**

### Bước 6: Test

1. Quay lại Google Sheets
2. Refresh page (F5)
3. Bạn sẽ thấy menu mới: **🤖 Long Best AI**

---

## ✅ CÁCH SỬ DỤNG

### Option 1: Auto-Sync (Recommended)

**Mỗi khi muốn move content sang Post tab:**

1. Mở tab **ToTable**
2. Chọn row muốn sync
3. Đổi **Status** thành **"Planned"**
4. Script tự động:
   - Copy row sang tab **Post**
   - Set Status = **"Ready"** trong Post tab
   - Đổi Status = **"Synced"** trong ToTable
   - Show notification: "✅ Copied ... to Post tab"

**Ví dụ:**

| Date | Week | Topic | Status | → | Status (sau sync) |
|------|------|-------|--------|---|-------------------|
| 2026-01-19 | Week 1 | 5 Mẹo ChatGPT... | **Planned** | → | **Synced** |

**Trong Post tab:**

| Post_ID | Topic | Status | Drive_Folder_ID |
|---------|-------|--------|-----------------|
| 2026-01-19_5-meo-chatgpt... | 5 Mẹo ChatGPT... | **Ready** | (empty) |

---

### Option 2: Manual Sync (Batch)

**Sync nhiều rows cùng lúc:**

1. Trong tab **ToTable**, đổi Status nhiều rows thành **"Planned"**
2. Menu: **🤖 Long Best AI** → **📋 Sync All Planned → Post**
3. Alert sẽ hiện: "✅ Synced X items from ToTable → Post tab"

**Khi nào dùng:**
- Muốn sync nhiều posts cùng lúc
- Đã plan content cho cả tuần

---

### Option 3: Test Sync

**Test để đảm bảo script hoạt động:**

1. Menu: **🤖 Long Best AI** → **🧪 Test Auto-Sync**
2. Script sẽ test với row 2
3. Check tab **Post** để verify

---

## 📋 WORKFLOW HOÀN CHỈNH

### Step 1: Tạo Content Plan

```bash
cd /Users/admin/automation/scripts/drive-uploader
node content-planner.js generate 8
```

**Kết quả:** 24 posts trong tab ToTable với status "In Progress" hoặc "Planned"

---

### Step 2: Chọn Topic Để Làm

Trong tab **ToTable**, sort by Priority:
- High priority topics → Làm trước
- Check Research_Notes để biết cần chuẩn bị gì

---

### Step 3: Chuyển Status → "Planned"

Khi đã sẵn sàng tạo content cho topic:
1. Đổi Status = **"Planned"**
2. Auto-sync sẽ copy sang Post tab
3. Status trong ToTable → **"Synced"**

---

### Step 4: Tạo Carousel

```bash
cd /Users/admin/automation/scripts/carousel-generator

# Tạo content JSON từ Research_Notes
# Ví dụ: content/chatgpt-tips.json

# Generate carousel
node generator.js content/chatgpt-tips.json
```

**Output:** Images trong `output/chatgpt-tips/`

---

### Step 5: Upload Lên Drive

```bash
cd ../drive-uploader

# Upload và auto-update Post tab
node upload.js ../carousel-generator/output/chatgpt-tips --delete
```

**Kết quả:**
- Images uploaded to Drive
- Post tab updated với Drive_Folder_ID
- Local images deleted
- Status vẫn là "Ready"

---

### Step 6: n8n Auto-Post

n8n workflow tự động:
1. Check Post tab mỗi giờ
2. Tìm rows có Status = "Ready"
3. Post lên Facebook
4. Update Status = "Done"

**Không cần làm gì thêm!**

---

## 🔧 CUSTOMIZATION

### Thay đổi trigger status

Edit trong Apps Script:

```javascript
const CONFIG = {
  sourceTab: 'ToTable',
  targetTab: 'Post',
  statusColumn: 'Status',
  triggerStatus: 'Planned',  // ← Đổi thành status khác
  targetStatus: 'Ready'       // ← Status trong Post tab
};
```

**Ví dụ:**
```javascript
triggerStatus: 'Ready to Create',  // Custom status
targetStatus: 'Queued'             // Custom status trong Post
```

---

### Map thêm columns

Nếu Post tab có columns khác, edit function `copyToPostTab()`:

```javascript
const postRow = {
  'Post_ID': rowData['Post_ID'] || '',
  'Date_Created': new Date().toISOString().split('T')[0],
  'Topic': rowData['Topic'] || '',

  // Thêm columns mới
  'Content_Type': rowData['Content_Type'] || 'Carousel',
  'Week': rowData['Week'] || '',

  'Status': CONFIG.targetStatus,
  // ...
};
```

---

### Thay đổi status sau sync

Hiện tại: ToTable status → "Synced"

Nếu muốn giữ nguyên "Planned":

```javascript
// Comment dòng này trong copyToPostTab()
// sourceSheet.getRange(sourceRow, statusColIndex).setValue('Synced');
```

---

## 📊 DATA MAPPING

### ToTable → Post Tab

| ToTable Column | → | Post Tab Column | Note |
|----------------|---|-----------------|------|
| Post_ID | → | Post_ID | Unique ID |
| Date | → | Date_Planned | Ngày dự kiến post |
| Topic | → | Topic | Tên carousel |
| Keywords | → | Keywords | SEO keywords |
| Target_Audience | → | Target_Audience | Audience |
| **Priority** | → | Priority | High/Medium/Low |
| Research_Notes | → | Research_Notes | Ghi chú |
| Status: "Planned" | → | Status: "Ready" | ⚠️ Đổi status |
| - | → | Drive_Folder_ID | Empty (fill later) |
| - | → | Caption | Empty (fill later) |
| - | → | Type | "Carousel" |

---

## 🧪 TESTING

### Test 1: Single row sync

1. Tab ToTable, chọn 1 row bất kỳ
2. Đổi Status = "Planned"
3. **Expect:**
   - Notification: "✅ Copied ... to Post tab"
   - ToTable status → "Synced"
   - Post tab có row mới với status "Ready"

### Test 2: Batch sync

1. Tab ToTable, đổi 5 rows → Status = "Planned"
2. Menu: **🤖 Long Best AI → Sync All Planned**
3. **Expect:**
   - Alert: "✅ Synced 5 items..."
   - 5 rows mới trong Post tab

### Test 3: Duplicate prevention

1. Sync 1 row (status → "Synced")
2. Manually đổi status lại thành "Planned"
3. **Expect:**
   - Script sync lại (sẽ tạo duplicate)
   - ⚠️ Cần manual delete duplicate nếu không cần

**Note:** Script không check duplicate. Nếu sync 2 lần → 2 rows trong Post tab.

---

## ⚠️ IMPORTANT NOTES

### 1. Status Flow

```
ToTable: "In Progress" → (working on content)
ToTable: "Planned" → (ready to create)
    ↓ Auto-Sync
Post: "Ready" → (waiting for upload)
    ↓ Upload Drive
Post: "Ready" (Drive_Folder_ID filled) → (waiting for n8n)
    ↓ n8n auto-post
Post: "Done" → (posted to Facebook)
```

### 2. Duplicates

- Nếu sync cùng 1 row 2 lần → Duplicate trong Post tab
- **Prevention:** Chỉ sync rows có status "Planned"
- Sau khi sync → Status đổi thành "Synced"
- Nếu cần sync lại → Manually đổi lại "Planned"

### 3. Manual Edits

Sau khi sync sang Post tab, bạn có thể:
- ✅ Edit Caption
- ✅ Edit Keywords
- ✅ Edit Priority
- ❌ Không nên edit Post_ID (dùng để track)

### 4. Permissions

Apps Script cần quyền:
- Read/Write Google Sheets
- Show notifications
- Run triggers

**Lần đầu setup:** Google sẽ yêu cầu authorize

---

## 🔍 TROUBLESHOOTING

### Script không chạy khi edit Status

**Check:**
1. Trigger có được setup chưa? (Apps Script → Triggers)
2. Function: `onEdit`
3. Event type: "On edit"

**Fix:**
- Delete trigger cũ → Tạo lại

---

### Notification không hiện

**Nguyên nhân:** Browser block notifications

**Fix:**
1. Check browser notification settings
2. Allow notifications for Google Sheets

---

### Data không map đúng

**Debug:**
1. Apps Script → **Executions** (xem logs)
2. Check `Logger.log()` output
3. Verify column names match exactly

**Fix:**
- Edit `copyToPostTab()` function
- Update column mapping

---

### "Tab Post không tồn tại"

**Nguyên nhân:** Sheet không có tab "Post"

**Fix:**
- Tạo tab "Post" trong Google Sheets
- Hoặc đổi tên trong CONFIG:
  ```javascript
  targetTab: 'YourTabName'
  ```

---

## 📝 SCRIPT FILES

**Google Apps Script:**
- Trong Google Sheets: **Extensions → Apps Script**
- Backup local: `/Users/admin/automation/scripts/drive-uploader/sheets-automation.gs`

**Guide:**
- `/Users/admin/automation/AUTO_SYNC_GUIDE.md` (file này)

---

## 🎯 BEST PRACTICES

### ✅ NÊN:

1. **Sync từng tuần**
   - Plan 8 tuần trước
   - Mỗi tuần sync 3 topics cần làm

2. **Review trước khi sync**
   - Check Research_Notes
   - Đảm bảo đủ thông tin để tạo content

3. **Dùng Priority**
   - Sync High priority trước
   - Medium/Low làm khi có thời gian

4. **Monitor Post tab**
   - Check định kỳ
   - Đảm bảo n8n đang hoạt động

### ❌ KHÔNG NÊN:

1. **Sync quá nhiều cùng lúc**
   - Sync 3-5 topics/lần
   - Tránh queue quá dài

2. **Edit Status ngẫu nhiên**
   - Follow workflow: In Progress → Planned → Synced
   - Không skip steps

3. **Duplicate sync**
   - Check status trước khi sync
   - Nếu đã "Synced" → Không cần sync lại

---

## 📈 EXAMPLE WORKFLOW

### Scenario: Week 1 Content Creation

**Monday morning:**

1. Open ToTable tab
2. Review Week 1 topics (3 posts)
3. Pick topic #1: "5 Mẹo ChatGPT..."
4. Change Status → "Planned"
5. ✅ Auto-sync to Post tab

**Monday afternoon:**

6. Create content JSON
7. Generate carousel
8. Upload to Drive
9. Post tab updated with Drive_Folder_ID
10. Status still "Ready" → n8n will auto-post

**Tuesday:**

11. n8n runs at top of hour
12. Finds row with Status = "Ready"
13. Posts to Facebook
14. Updates Status = "Done"

**Repeat for topics #2 and #3**

---

## 🆘 SUPPORT

**Nếu gặp lỗi:**

1. Check Apps Script Executions:
   - Apps Script editor → **Executions** tab
   - Xem error logs

2. Check trigger:
   - Apps Script → **Triggers**
   - Verify `onEdit` trigger exists

3. Test manually:
   - Menu: **🤖 Long Best AI → Test Auto-Sync**

4. Re-authorize:
   - Delete trigger → Recreate
   - Re-authorize permissions

---

**Created by:** Long Best AI
**Date:** 2026-01-09
**Script:** `/Users/admin/automation/scripts/drive-uploader/sheets-automation.gs`
**Sheet:** https://docs.google.com/spreadsheets/d/1RAHjxLDULl0aRWHSX0aqUh1dqv7li7zwi0DZA6atQj0

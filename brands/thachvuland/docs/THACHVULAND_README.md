# 📊 Thach Vu Land - Google Sheet Optimization

**Status**: ✅ PRODUCTION READY
**Last Updated**: 2026-01-14
**Version**: 1.0.0

---

## 🎯 Tổng Quan

Đã tối ưu hóa hoàn toàn Google Sheet cho dự án **Thach Vu Land** để tương thích 100% với n8n workflow `autopost-tvland.json`.

### Thay Đổi Chính

✅ **17 column headers** semantic (từ "Column 1, Column 2,..." → "Post_ID, Caption, ...")
✅ **Tab name** chuẩn hóa: "Post" (gid: 1123323036)
✅ **Sample data** để test workflow
✅ **Scripts** hỗ trợ setup, test, và check
✅ **Full documentation** chi tiết

---

## 🔗 Quick Links

- **Google Sheet**: [kehoach_tvl](https://docs.google.com/spreadsheets/d/1SNv1t0h-KRXWQ4xANroW5RQN6zHU57OrrXj_OqzfVsY)
- **n8n Workflow**: `/Users/admin/Downloads/autopost-tvland.json`
- **Documentation**:
  - [Full Optimization Guide](./THACHVULAND_SHEET_OPTIMIZATION.md)
  - [Summary](./THACHVULAND_OPTIMIZATION_SUMMARY.md)
  - [Checklist](./THACHVULAND_CHECKLIST.md)

---

## 🚀 Quick Start

### 1. First Time Setup

```bash
cd /Users/admin/automation/scripts/drive-uploader
node setup-thachvuland-sheet.js
```

### 2. Test Integration

```bash
node test-thachvuland-integration.js
```

**Expected Output**:
```
✅ All tests passed!
🎉 Integration verified!
```

### 3. Check Current Status

```bash
node check-thachvuland-sheet.js
```

---

## 📋 Sheet Structure

### Tab "Post" - Column Headers

| Col | Header           | Mô tả                                   | Required |
|-----|------------------|-----------------------------------------|----------|
| A   | Post_ID          | ID duy nhất                             | ✓        |
| B   | Date_Created     | Ngày tạo content                        |          |
| C   | Date_Planned     | Ngày dự kiến đăng                       |          |
| D   | Topic            | Chủ đề                                  |          |
| E   | **Caption**      | Caption cho Facebook (REQUIRED)         | ✓        |
| F   | **Drive_Folder_ID** | Google Drive Folder ID (REQUIRED)    | ✓        |
| G   | Drive_Link       | Link đến folder                         |          |
| H   | **Status**       | Draft/Ready/Done (REQUIRED)             | ✓        |
| I   | Type             | Carousel/Image/Video                    |          |
| J   | Images_Count     | Số lượng ảnh                            |          |
| K   | Keywords         | Keywords SEO                            |          |
| L   | Target_Audience  | Đối tượng mục tiêu                      |          |
| M   | Priority         | High/Medium/Low                         |          |
| N   | Research_Notes   | Ghi chú nghiên cứu                      |          |
| O   | **Post_URL**     | URL sau khi đăng (Updated by n8n)       |          |
| P   | Published_Date   | Ngày đăng thực tế                       |          |
| Q   | Created_At       | Timestamp tạo record                    |          |

**Columns được n8n sử dụng**:
- **E (Caption)**: Message của Facebook post
- **F (Drive_Folder_ID)**: Để list ảnh trong folder
- **H (Status)**: Filter "Ready" để trigger post
- **O (Post_URL)**: Update sau khi post thành công

---

## 🔄 Workflow Overview

```
Content Creation → Drive Upload → Sheet Sync → n8n Autopost
     ↓                  ↓              ↓             ↓
   Daily Agent      Upload script  Auto-update   Schedule
   (Generator)      + Sync         Status=Ready  (30 min)
```

### Status Flow

```
Draft → Ready → Done
  ↓       ↓       ↓
Editing  n8n    Posted
        Trigger  to FB
```

---

## 📝 Common Tasks

### Create New Content

```bash
# Generate content
cd /Users/admin/automation
npm run daily -- thachvuland

# Upload to Drive + Auto-sync to Sheet
cd scripts/drive-uploader
npm run upload:tvland
```

→ Sheet sẽ có row mới với Status="Ready"
→ n8n sẽ tự động post theo schedule (mỗi 30 phút)

### Manual Post

1. Open Google Sheet
2. Edit Caption nếu cần
3. Change Status from "Draft" → "Ready"
4. Wait for n8n schedule OR trigger manually in n8n
5. Verify Status → "Done" và Post_URL được fill

### Check Results

```bash
# View sheet in browser
open "https://docs.google.com/spreadsheets/d/1SNv1t0h-KRXWQ4xANroW5RQN6zHU57OrrXj_OqzfVsY"

# Check specific row
node check-thachvuland-sheet.js
```

---

## 🧪 Testing

### Full Integration Test

```bash
cd /Users/admin/automation/scripts/drive-uploader
node test-thachvuland-integration.js
```

**Tests performed**:
1. ✅ Verify all required columns exist
2. ✅ Check sample row data
3. ✅ Simulate n8n query (find Status="Ready")
4. ✅ Test `addPostToSheets()` function
5. ✅ Verify data integrity

### Manual Test with n8n

1. Update sample row (row 2):
   - Replace `SAMPLE_FOLDER_ID` with real folder ID
   - Verify Caption
   - Set Status = "Ready"

2. Trigger n8n workflow (manual or wait for schedule)

3. Verify:
   - Status → "Done"
   - Post_URL → "fb.com/[post_id]"
   - Post visible on Facebook

---

## 🛠️ Scripts Reference

### Setup & Maintenance

```bash
# Setup sheet structure (first time)
node setup-thachvuland-sheet.js

# Check current sheet structure
node check-thachvuland-sheet.js

# Test full integration
node test-thachvuland-integration.js

# View all commands
./tvland-commands.sh
```

### Scripts Location

All scripts in: `/Users/admin/automation/scripts/drive-uploader/`

---

## 🐛 Troubleshooting

### Common Issues

#### Issue: Workflow không tìm thấy row
**Cause**: Status không exact match "Ready"
**Fix**: Đảm bảo Status = `"Ready"` (no spaces, exact match)

#### Issue: Drive_Folder_ID invalid
**Cause**: Folder ID sai hoặc không có quyền
**Fix**: Copy ID từ URL: `drive.google.com/drive/folders/[ID_HERE]`

#### Issue: Caption không hiển thị
**Cause**: Column E trống
**Fix**: Điền Caption trước khi set Status="Ready"

#### Issue: Post_URL không update
**Cause**: Matching key không khớp
**Fix**: Đảm bảo Drive_Folder_ID unique trong sheet

---

## 📚 Documentation

### Complete Guides

1. **[THACHVULAND_SHEET_OPTIMIZATION.md](./THACHVULAND_SHEET_OPTIMIZATION.md)**
   - Full sheet structure
   - N8N workflow chi tiết
   - Best practices

2. **[THACHVULAND_OPTIMIZATION_SUMMARY.md](./THACHVULAND_OPTIMIZATION_SUMMARY.md)**
   - Summary of changes
   - Testing results
   - Next steps

3. **[THACHVULAND_CHECKLIST.md](./THACHVULAND_CHECKLIST.md)**
   - Pre-flight checks
   - Production readiness
   - Monitoring guide

---

## ⚙️ Configuration

### Brand Config

File: `/brands/thachvuland/brand.json`

```json
{
  "googleSheets": {
    "sheetId": "1SNv1t0h-KRXWQ4xANroW5RQN6zHU57OrrXj_OqzfVsY",
    "tabName": "Post"
  }
}
```

### n8n Workflow Config

- **Sheet ID**: `1SNv1t0h-KRXWQ4xANroW5RQN6zHU57OrrXj_OqzfVsY`
- **Tab**: `Post` (gid: 1123323036)
- **Filter**: Status = "Ready"
- **Schedule**: Every 30 minutes
- **Facebook Page**: 915248175005876

---

## ✅ Verification

Run this command to verify everything is set up correctly:

```bash
cd /Users/admin/automation/scripts/drive-uploader
node test-thachvuland-integration.js
```

Expected output:
```
🎉 All tests passed!

✅ Column headers: OK
✅ Sample row: OK
✅ n8n query simulation: OK
✅ Add post function: OK
✅ Data integrity: OK
```

---

## 📞 Support

- **Issues**: Check [THACHVULAND_CHECKLIST.md](./THACHVULAND_CHECKLIST.md) troubleshooting section
- **Documentation**: See links above
- **Scripts**: All in `/scripts/drive-uploader/`

---

## 🎉 Kết Luận

✅ Google Sheet đã được tối ưu hóa hoàn toàn
✅ Tương thích 100% với n8n workflow
✅ All tests passed
✅ Documentation đầy đủ
✅ **READY FOR PRODUCTION**

---

**Created by**: Claude Code (Antigravity)
**Date**: 2026-01-14
**Version**: 1.0.0

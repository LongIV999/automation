# AUTO-UPDATE GOOGLE SHEETS - HƯỚNG DẪN SETUP

## 🎯 Tổng quan

Hệ thống đã được nâng cấp để **TỰ ĐỘNG** cập nhật Google Sheets sau khi upload ảnh lên Google Drive!

**Trước đây:**
```
1. Upload ảnh → Drive
2. Copy Folder ID thủ công
3. Mở Google Sheets
4. Paste vào từng cell
```

**Bây giờ:**
```
1. Upload ảnh → Drive
2. ✅ XONG! (Sheets tự động cập nhật)
```

---

## 📦 FILES MỚI ĐÃ TẠO

### 1. `sheets-updater.js`
- Module xử lý Google Sheets API
- Tự động thêm row mới với thông tin post
- Tự động load caption từ file (nếu có)

### 2. `.env` (Updated)
- Thêm `GOOGLE_SHEETS_ID`
- Thêm `AUTO_UPDATE_SHEETS` flag

### 3. `upload.js` (Updated)
- Tích hợp sheets-updater
- Tự động gọi API sau khi upload Drive thành công

---

## 🔧 SETUP (Chỉ làm 1 lần)

### Bước 1: Re-authenticate với Sheets permission

Do thêm quyền Google Sheets, bạn cần re-authenticate:

```bash
cd /Users/admin/automation/scripts/drive-uploader

# Xóa token cũ
rm -f token.json

# Run setup (có thể cần update redirect URI trong Google Console trước)
node setup-auth.js
```

**LƯU Ý:** Nếu gặp lỗi redirect URI, làm theo hướng dẫn bên dưới.

### Bước 2: Xác nhận Google Sheets ID

File `.env` đã được cấu hình với ID:
```
GOOGLE_SHEETS_ID=1RAHjxLDULl0aRWHSX0aqUh1dqv7li7zwi0DZA6atQj0
```

Kiểm tra xem đúng ID không bằng cách mở link:
```
https://docs.google.com/spreadsheets/d/1RAHjxLDULl0aRWHSX0aqUh1dqv7li7zwi0DZA6atQj0
```

### Bước 3: Kiểm tra cấu trúc Google Sheets

Sheet phải có tab tên "Posts" với các cột header (row 1):

**Required columns:**
- `Post_ID`
- `Date_Created`
- `Drive_Folder_ID`
- `Drive_Link`
- `Caption`
- `Status`

**Optional columns:**
- `Type`
- `Topic`
- `Images_Count`
- `Created_At`
- `Scheduled_Time`
- `Page_ID`
- `Post_URL`

---

## 🚀 SỬ DỤNG

### Cách 1: Tự động hoàn toàn (RECOMMENDED)

Chạy upload như bình thường. Sheets sẽ tự động cập nhật!

```bash
cd /Users/admin/automation/scripts/drive-uploader

# Upload ảnh
node upload.js ../carousel-generator/output/nano-banana-prompts
```

**Kết quả:**
```
🚀 Starting Google Drive upload...
✅ Created folder: 2026-01-09_nano-banana-prompts
📁 Folder ID: 1BKD-7ose12tkBE0yJjCGh5-xg05O-0w1

📸 Found 8 images to upload
[1/8] Uploading: 01.png...
✅ Uploaded: 01.png
...
[8/8] Uploading: 08.png...
✅ Uploaded: 08.png

🎉 Upload completed successfully!

📊 Updating Google Sheets...
✓ Column mapping loaded
✓ Next empty row: 5
✅ Google Sheets updated successfully!
📝 Row 5: post_1736463234567
🔗 Sheet: https://docs.google.com/spreadsheets/d/1RAH...
```

### Cách 2: Tắt auto-update (thủ công)

Nếu muốn tắt tính năng auto-update:

```bash
# Trong file .env
AUTO_UPDATE_SHEETS=false
```

Sau đó chạy upload, bạn sẽ thấy:
```
💡 Paste Folder ID vào Google Sheets (Posts tab, Drive_Folder_ID column)
```

### Cách 3: Update Sheets thủ công sau này

Nếu muốn update sau (hoặc update failed lúc trước):

```bash
cd /Users/admin/automation/scripts/drive-uploader

node sheets-updater.js \
  "1BKD-7ose12tkBE0yJjCGh5-xg05O-0w1" \
  "https://drive.google.com/drive/folders/1BKD-7ose12tkBE0yJjCGh5-xg05O-0w1" \
  "2026-01-09_nano-banana-prompts" \
  "Caption text here..."
```

---

## 🎨 CAPTION AUTO-LOAD

Hệ thống sẽ **tự động tìm và load caption** nếu bạn đặt file caption đúng vị trí:

### Convention:
Nếu folder ảnh là: `nano-banana-prompts`

File caption phải tên là:
- `/Users/admin/automation/content-calendar/nano-banana-prompts-caption.md` (RECOMMENDED)
- hoặc: `/Users/admin/automation/content-calendar/nano-banana-prompts.caption.txt`

### Format caption file:

Nếu file có nhiều version, hệ thống sẽ tự động lấy **VERSION 1**:

```markdown
# Facebook Caption

## VERSION 1: Hấp dẫn, viral (Recommended)

Caption text ở đây...
Có thể nhiều dòng...

#Hashtags

## VERSION 2: Khác

...
```

Nó sẽ extract phần giữa `## VERSION 1` và `##` tiếp theo.

---

## 🔄 WORKFLOW TỰ ĐỘNG HOÀN CHỈNH

### End-to-end workflow:

```bash
cd /Users/admin/automation/scripts/carousel-generator

# 1. Tạo carousel với preset tối ưu
node set-preset.js set readablePreview
node generator.js content/my-post.json

# 2. Upload lên Drive + Auto-update Sheets
cd ../drive-uploader
node upload.js ../carousel-generator/output/my-post

# ✅ DONE!
# - Ảnh đã lên Drive
# - Google Sheets đã update
# - Caption đã điền (nếu có file)
# - Status = "Ready"
# - n8n sẽ tự động post trong 15 phút!
```

### Script tự động hóa (tạo file này):

`scripts/content-automation/create-and-publish.sh`

```bash
#!/bin/bash

# Usage: ./create-and-publish.sh content/my-post.json

CONTENT_FILE=$1

if [ -z "$CONTENT_FILE" ]; then
  echo "Usage: $0 <content-file.json>"
  exit 1
fi

BASE_NAME=$(basename "$CONTENT_FILE" .json)

echo "🚀 Creating carousel: $BASE_NAME"

# Step 1: Set typography preset
cd /Users/admin/automation/scripts/carousel-generator
node set-preset.js set readablePreview

# Step 2: Generate carousel
node generator.js "$CONTENT_FILE"

# Step 3: Upload to Drive + Update Sheets
cd ../drive-uploader
node upload.js "../carousel-generator/output/$BASE_NAME"

echo ""
echo "✅ ALL DONE!"
echo "📊 Check Google Sheets: https://docs.google.com/spreadsheets/d/1RAHjxLDULl0aRWHSX0aqUh1dqv7li7zwi0DZA6atQj0"
echo "⏰ Post will be published by n8n in ~15 minutes"
```

Sử dụng:
```bash
chmod +x scripts/content-automation/create-and-publish.sh
./scripts/content-automation/create-and-publish.sh content/my-post.json
```

---

## 🔧 TROUBLESHOOTING

### 1. Lỗi: "Token not found"

```bash
cd /Users/admin/automation/scripts/drive-uploader
rm -f token.json
node setup-auth.js
```

### 2. Lỗi: "Could not auto-update Google Sheets"

Kiểm tra:
- [ ] Token có quyền Sheets chưa? (Cần re-auth)
- [ ] Sheets ID đúng chưa? (Check .env)
- [ ] Tab "Posts" có tồn tại không?
- [ ] Header row có đúng tên cột không?

Debug:
```bash
node sheets-updater.js "test-id" "test-link" "test-name" "test caption"
```

### 3. Caption không tự động load

Kiểm tra:
- [ ] File caption đặt đúng vị trí: `content-calendar/<name>-caption.md`
- [ ] Tên file khớp với folder name (không có ngày tháng prefix)

### 4. Sheets bị duplicate rows

Hệ thống sẽ tìm row trống tiếp theo, không check duplicate.

Để tránh:
- Không chạy upload 2 lần cho cùng 1 folder
- Hoặc xóa row cũ trước khi re-upload

---

## 📊 GOOGLE SHEETS DATA MAPPING

| Sheets Column | Giá trị | Nguồn |
|---------------|---------|-------|
| `Post_ID` | post_1736463234567 | Auto-generated timestamp |
| `Date_Created` | 2026-01-09 | Current date |
| `Drive_Folder_ID` | 1BKD-7ose... | From Drive API |
| `Drive_Link` | https://drive.google... | From Drive API |
| `Caption` | Caption text... | From caption file or empty |
| `Status` | Ready | Default |
| `Type` | Carousel | Fixed |
| `Topic` | Nano Banana | Extracted from folder name |
| `Images_Count` | 8 | Count of uploaded files |
| `Created_At` | 2026-01-09T10:47:14.567Z | ISO timestamp |

---

## 🎯 NEXT STEPS

1. **Re-authenticate** để thêm Sheets permission
2. **Test upload** một carousel để xem auto-update hoạt động
3. **Tạo script automation** để chạy full workflow
4. **Configure n8n** để đọc từ Sheets và auto-post

---

## ❓ FAQ

**Q: Tôi có thể tắt auto-update không?**
A: Có, set `AUTO_UPDATE_SHEETS=false` trong `.env`

**Q: Caption có bắt buộc không?**
A: Không, nếu không có caption file, column Caption sẽ để trống.

**Q: Tôi có thể update caption sau không?**
A: Có, vào Sheets và edit trực tiếp. Hoặc chạy lại sheets-updater.js

**Q: Sheets ID lấy ở đâu?**
A: Trong URL của Google Sheets:
`https://docs.google.com/spreadsheets/d/[ĐÂY_LÀ_ID]/edit`

**Q: Nếu upload thành công nhưng Sheets fail?**
A: Upload vẫn OK. Bạn có thể:
- Chạy sheets-updater.js thủ công
- Hoặc paste thủ công vào Sheets

---

**Tạo bởi:** Long Best AI
**Ngày:** 2026-01-09

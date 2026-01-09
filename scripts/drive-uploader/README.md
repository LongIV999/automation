# Google Drive Auto Uploader

Tự động upload ảnh carousel lên Google Drive với numbered naming convention.

## 🎯 Tính Năng

- ✅ Tự động tạo folder trên Drive (format: `YYYY-MM-DD_Topic`)
- ✅ Upload ảnh giữ nguyên số thứ tự: `01.png`, `02.png`, `03.png`...
- ✅ Trả về Folder ID để paste vào Google Sheets
- ✅ Support parent folder (tổ chức tất cả posts vào 1 folder chung)

---

## 📋 Setup (Chỉ làm 1 lần)

### Bước 1: Tạo Google Cloud Project

1. Truy cập: https://console.cloud.google.com
2. Create new project: **"Long Best AI Automation"**
3. Enable **Google Drive API**:
   - APIs & Services → Library
   - Search "Google Drive API"
   - Click Enable

### Bước 2: Tạo OAuth Credentials

1. APIs & Services → Credentials
2. Create Credentials → OAuth Client ID
3. Application type: **Desktop app**
4. Name: **"Drive Uploader"**
5. Click **Download JSON**
6. Rename file → `credentials.json`
7. Di chuyển file vào: `scripts/drive-uploader/credentials.json`

### Bước 3: Install Dependencies

```bash
cd scripts/drive-uploader
npm install
```

### Bước 4: Authorize

```bash
npm run auth
```

**Quy trình:**
1. Browser tự động mở
2. Chọn Google account của bạn
3. Click "Allow" để cấp quyền
4. Đợi message "Authentication successful"
5. File `token.json` sẽ được tạo tự động

✅ Setup xong! Giờ có thể upload.

---

## 🚀 Cách Sử Dụng

### Upload Cơ Bản

```bash
# Cú pháp
node upload.js <images-directory> [folder-name]

# Ví dụ 1: Auto folder name (YYYY-MM-DD_post_001)
node upload.js ../carousel-generator/output/post_001

# Ví dụ 2: Custom folder name
node upload.js ../carousel-generator/output/post_001 "2026-01-10_AI_Prompts_BDS"
```

### Kết Quả

Script sẽ:
1. Tạo folder trên Google Drive
2. Upload tất cả ảnh `.png`, `.jpg` trong thư mục
3. Giữ nguyên thứ tự: `01.png`, `02.png`, `03.png`...
4. Hiển thị **Folder ID** và **Link**

```
✅ Upload completed successfully!

📋 IMPORTANT - Copy this info:
────────────────────────────────────────────────────────
Folder Name: 2026-01-08_post_001
Folder ID: 1AbCdEfGhIjKlMnOpQrStUvWxYz
Folder Link: https://drive.google.com/drive/folders/1AbCd...
────────────────────────────────────────────────────────

💡 Paste Folder ID vào Google Sheets (Posts tab, Drive_Folder_ID column)
```

---

## 🔧 Advanced Usage

### 1. Set Parent Folder (Tổ chức tốt hơn)

Tạo 1 folder cha trên Drive để chứa tất cả post folders.

**Cách làm:**

1. Tạo folder trên Drive: **"Long Best AI - Posts"**
2. Copy Folder ID từ URL:
   ```
   https://drive.google.com/drive/folders/1XYZ_PARENT_FOLDER_ID
                                           ^^^^^^^^^^^^^^^^^^^^^
   ```
3. Tạo file `.env`:
   ```bash
   cd scripts/drive-uploader
   nano .env
   ```
4. Thêm vào:
   ```env
   DRIVE_PARENT_FOLDER_ID=1XYZ_PARENT_FOLDER_ID
   ```

Giờ tất cả uploads sẽ tự động vào folder cha này!

**Cấu trúc Drive sau khi setup:**
```
Long Best AI - Posts/
├── 2026-01-08_post_001/
│   ├── 01.png
│   ├── 02.png
│   └── ...
├── 2026-01-10_post_002/
│   ├── 01.png
│   └── ...
```

---

### 2. Naming Convention

**Default auto naming:**
```
YYYY-MM-DD_<directory-name>

Example:
Input: ./output/post_001
Output: 2026-01-08_post_001
```

**Custom naming:**
```bash
node upload.js ./output/post_001 "10_Prompt_AI_BDS"
# Tạo folder: "10_Prompt_AI_BDS"
```

**Best practice:**
```
YYYY-MM-DD_<topic-slug>

Examples:
- 2026-01-10_AI_Prompts_Real_Estate
- 2026-01-12_Nano_Banana_Guide
- 2026-01-15_ChatGPT_Tips
```

---

### 3. Batch Upload (Nhiều posts cùng lúc)

```bash
# Upload tất cả posts trong output/
for dir in ../carousel-generator/output/*; do
  echo "Uploading $dir..."
  node upload.js "$dir"
  echo "---"
done
```

---

### 4. JSON Output (For automation)

```bash
# Export result as JSON
JSON_OUTPUT=1 node upload.js ./images

# Output:
{
  "folderId": "1AbCdEfGhIjK",
  "folderLink": "https://drive.google.com/...",
  "folderName": "2026-01-08_post_001",
  "uploadedCount": 7
}
```

Dùng trong n8n workflow để parse kết quả.

---

## 🔗 Tích Hợp End-to-End

### One-liner: Generate + Upload

```bash
# Generate ảnh → Upload Drive
node ../carousel-generator/generator.js content.json output/post_001 && \
node upload.js ../carousel-generator/output/post_001
```

### Automation Script (All-in-one)

Tạo file: `scripts/content-automation/create-post.sh`

```bash
#!/bin/bash
# Usage: ./create-post.sh content.json "Folder Name"

CONTENT_FILE=$1
FOLDER_NAME=$2
OUTPUT_DIR="../carousel-generator/output/$(basename $CONTENT_FILE .json)"

echo "🎨 Step 1: Generating carousel images..."
node ../carousel-generator/generator.js "$CONTENT_FILE" "$OUTPUT_DIR"

echo ""
echo "☁️  Step 2: Uploading to Google Drive..."
node ../drive-uploader/upload.js "$OUTPUT_DIR" "$FOLDER_NAME"

echo ""
echo "✅ Done! Now update Google Sheets with Folder ID."
```

**Sử dụng:**
```bash
chmod +x create-post.sh
./create-post.sh content/post_001.json "2026-01-10_AI_Prompts"
```

---

## 🐛 Troubleshooting

### ❌ "Token not found"

**Problem:** Chưa chạy setup-auth

**Fix:**
```bash
npm run auth
```

---

### ❌ "Credentials.json not found"

**Problem:** Chưa tải OAuth credentials từ Google Cloud

**Fix:** Làm theo Bước 2 trong Setup

---

### ❌ "Invalid authentication credentials"

**Problem:** Token hết hạn

**Fix:**
```bash
# Xóa token cũ
rm token.json

# Authorize lại
npm run auth
```

---

### ❌ "Error uploading file: Rate limit exceeded"

**Problem:** Upload quá nhiều file cùng lúc

**Fix:** Thêm delay giữa uploads (sửa code):

```javascript
// Trong upload.js, thêm delay
for (let i = 0; i < imageFiles.length; i++) {
  // ... upload code ...

  // Delay 500ms giữa uploads
  await new Promise(resolve => setTimeout(resolve, 500));
}
```

---

### ❌ "Permission denied"

**Problem:** Service account không có quyền access folder

**Fix:**
1. Vào Google Drive
2. Right-click folder → Share
3. Add email từ credentials.json
4. Grant "Editor" permission

---

## 📊 File Structure

```
drive-uploader/
├── package.json          # Dependencies
├── upload.js             # Main upload script
├── setup-auth.js         # OAuth setup
├── credentials.json      # OAuth credentials (GITIGNORE)
├── token.json            # OAuth token (GITIGNORE)
├── .env                  # Config (GITIGNORE)
└── README.md             # This file
```

**⚠️ IMPORTANT:** Never commit credentials/token to git!

Add to `.gitignore`:
```
scripts/drive-uploader/credentials.json
scripts/drive-uploader/token.json
scripts/drive-uploader/.env
```

---

## 🔐 Security Best Practices

1. **Credentials.json:**
   - Store securely
   - Never commit to public repo
   - Rotate if leaked

2. **Token.json:**
   - Auto-generated
   - Can be regenerated anytime
   - Delete and re-auth if compromised

3. **Scopes:**
   - Currently using: `drive.file` (minimal scope)
   - Only access files created by this app
   - Cannot access your entire Drive

---

## 📈 Performance

- **Upload speed:** ~2-5 seconds per image (depends on internet)
- **Batch upload:** 7 images = ~15-30 seconds
- **Concurrency:** Sequential (to avoid rate limits)

**Optimization tips:**
- Use wired internet (faster than WiFi)
- Upload during off-peak hours
- Compress images before upload if size > 5MB

---

## 🆘 Support

**Common issues:**
- Check Node.js version: `node --version` (need >= 16)
- Check credentials setup: `cat credentials.json | jq .`
- Test Drive API: https://developers.google.com/drive/api/v3/quickstart/nodejs

**Google Drive API Docs:**
- https://developers.google.com/drive/api/v3/about-sdk
- https://github.com/googleapis/google-api-nodejs-client

---

**Version**: 1.0.0
**Last Updated**: 2026-01-08

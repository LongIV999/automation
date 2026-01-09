# GOOGLE CLOUD CONSOLE SETUP - HƯỚNG DẪN CHI TIẾT

## 🎯 Mục đích

Cấu hình Google Cloud Console để:
1. ✅ Thêm quyền Google Sheets API
2. ✅ Cập nhật Redirect URI để authentication hoạt động
3. ✅ Enable các API cần thiết

---

## 📋 YÊU CẦU

- Tài khoản Google (đã có)
- Quyền quản trị Google Cloud Project (hoặc tạo project mới)

---

## 🔧 BƯỚC 1: Truy cập Google Cloud Console

### 1.1. Mở trình duyệt

Vào: **https://console.cloud.google.com**

### 1.2. Chọn hoặc tạo project

- Nếu đã có project: Click vào tên project ở góc trên bên trái
- Nếu chưa có: Click "New Project" và tạo project mới

**Tên đề xuất:** `Long Best AI Automation`

---

## 🔧 BƯỚC 2: Enable Google Sheets API

### 2.1. Vào API Library

1. Click menu (☰) bên trái
2. Chọn **"APIs & Services"** → **"Library"**

### 2.2. Tìm và enable Sheets API

1. Trong ô search, gõ: `Google Sheets API`
2. Click vào **"Google Sheets API"**
3. Click nút **"ENABLE"**

✅ Chờ vài giây cho API được kích hoạt

### 2.3. Kiểm tra Drive API (đã enable trước đó)

1. Quay lại Library
2. Search: `Google Drive API`
3. Nếu chưa enable → Click **"ENABLE"**

---

## 🔧 BƯỚC 3: Cập nhật OAuth 2.0 Client

### 3.1. Vào Credentials

1. Click menu (☰) → **"APIs & Services"** → **"Credentials"**
2. Bạn sẽ thấy list các credentials

### 3.2. Tìm OAuth 2.0 Client ID

Trong danh sách, tìm credential có type: **"OAuth 2.0 Client IDs"**

Thường tên là:
- `Desktop client 1`
- hoặc `Web client 1`
- hoặc tên tùy chỉnh

### 3.3. Edit OAuth Client

1. Click vào tên OAuth Client
2. Hoặc click icon ✏️ (Edit) bên phải

### 3.4. Cập nhật Authorized redirect URIs

Scroll xuống phần **"Authorized redirect URIs"**

**Thêm các URIs sau:**

```
http://localhost:3000
http://localhost:3456
```

**Cách thêm:**
1. Click **"+ ADD URI"**
2. Nhập: `http://localhost:3000`
3. Click **"+ ADD URI"** lần nữa
4. Nhập: `http://localhost:3456`

✅ Bạn sẽ thấy 2 URIs trong list

### 3.5. Cập nhật Scopes (nếu có)

Nếu có phần **"Scopes"**, đảm bảo có:
- `https://www.googleapis.com/auth/drive.file`
- `https://www.googleapis.com/auth/spreadsheets`

*(Thường không cần config scopes trong Console, vì scopes được set trong code)*

### 3.6. Save

Click nút **"SAVE"** ở dưới cùng

⏰ Chờ vài giây để thay đổi có hiệu lực

---

## 🔧 BƯỚC 4: Download Credentials (nếu cần)

Nếu bạn chưa có file `credentials.json`:

### 4.1. Vào Credentials page

**"APIs & Services"** → **"Credentials"**

### 4.2. Download JSON

1. Tìm OAuth 2.0 Client ID vừa edit
2. Click icon ⬇️ (Download) bên phải
3. Hoặc click vào tên → Click **"DOWNLOAD JSON"**

### 4.3. Lưu file

1. Rename file thành: `credentials.json`
2. Move vào: `/Users/admin/automation/scripts/drive-uploader/`

```bash
mv ~/Downloads/client_secret_*.json \
   /Users/admin/automation/scripts/drive-uploader/credentials.json
```

---

## 🔧 BƯỚC 5: OAuth Consent Screen (nếu chưa setup)

### 5.1. Kiểm tra Consent Screen

1. Menu → **"APIs & Services"** → **"OAuth consent screen"**

### 5.2. Nếu chưa configure:

**User Type:**
- Chọn: **"External"** (nếu chỉ bạn dùng)
- Click **"CREATE"**

**App information:**
- App name: `Long Best AI Automation`
- User support email: (email của bạn)
- Developer contact: (email của bạn)

**Scopes:**
- Click **"ADD OR REMOVE SCOPES"**
- Tìm và chọn:
  - `.../auth/drive.file`
  - `.../auth/spreadsheets`
- Click **"UPDATE"**

**Test users (nếu app ở Testing mode):**
- Click **"ADD USERS"**
- Thêm email của bạn
- Click **"ADD"**

**Save and Continue** cho đến hết

---

## ✅ HOÀN TẤT! Bây giờ test authentication

### Test 1: Xóa token cũ

```bash
cd /Users/admin/automation/scripts/drive-uploader
rm -f token.json
```

### Test 2: Chạy setup-auth

```bash
node setup-auth.js
```

**Kết quả mong đợi:**

```
╔══════════════════════════════════════════════════╗
║   Long Best AI - Google Drive Setup             ║
╚══════════════════════════════════════════════════╝

🔐 Authorizing Google Drive access...

Opening browser for authorization...
Waiting for authorization (listening on port 3456)...
```

Browser sẽ mở → Đăng nhập → Cho phép quyền

**Lần này sẽ thấy 2 permissions:**
1. ✅ View and manage Google Drive files
2. ✅ **View and manage your spreadsheets** (MỚI!)

Click **"Allow"**

**Kết quả:**

```
✅ Token saved to: ./token.json

🎉 Setup completed successfully!

You can now run:
  node upload.js <images-directory>
```

---

## 🔍 TROUBLESHOOTING

### Lỗi: "redirect_uri_mismatch"

**Nguyên nhân:** Redirect URI chưa được thêm vào Console

**Giải pháp:**
1. Xem URL trong error message
2. Copy exact URL đó (ví dụ: `http://localhost:3456`)
3. Thêm vào Console theo BƯỚC 3.4

### Lỗi: "Access blocked: This app's request is invalid"

**Nguyên nhân:** OAuth Consent Screen chưa setup

**Giải pháp:**
- Làm theo BƯỚC 5

### Lỗi: "The project ... does not have Google Sheets API enabled"

**Nguyên nhân:** Chưa enable API

**Giải pháp:**
- Làm theo BƯỚC 2

### Browser không tự mở

**Giải pháp:**
1. Copy URL trong terminal
2. Paste vào browser thủ công
3. Authorize
4. Quay lại terminal

---

## 📸 SCREENSHOTS QUAN TRỌNG

### 1. OAuth Client - Redirect URIs

Phải có:
```
Authorized redirect URIs
  http://localhost:3000    ❌ Remove
  http://localhost:3456    ❌ Remove
```

### 2. APIs & Services - Enabled APIs

Phải thấy:
- ✅ Google Drive API - Enabled
- ✅ Google Sheets API - Enabled

### 3. OAuth Consent Screen - Scopes

Phải có:
- ✅ .../auth/drive.file
- ✅ .../auth/spreadsheets

---

## 🎯 SAU KHI SETUP XONG

### Verify token có đủ quyền

```bash
cd /Users/admin/automation/scripts/drive-uploader

# Check token content
cat token.json
```

Sẽ thấy `scope` có cả:
```json
{
  "scope": "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets",
  ...
}
```

### Test upload + Sheets update

```bash
# Upload ảnh đã có
node upload.js ../carousel-generator/output/nano-banana-prompts
```

**Kết quả mong đợi:**

```
🚀 Starting Google Drive upload...
✅ Created folder: 2026-01-09_nano-banana-prompts
📸 Found 8 images to upload
...
🎉 Upload completed successfully!

📊 Updating Google Sheets...
✓ Column mapping loaded
✓ Next empty row: 2
✅ Google Sheets updated successfully!
📝 Row 2: post_1736467890123
🔗 Sheet: https://docs.google.com/...
```

### Kiểm tra Google Sheets

Mở sheet:
```
https://docs.google.com/spreadsheets/d/1RAHjxLDULl0aRWHSX0aqUh1dqv7li7zwi0DZA6atQj0
```

Sẽ thấy row mới với đầy đủ thông tin!

---

## 📝 CHECKLIST

Trước khi chạy workflow:

- [ ] Google Cloud Project đã tạo
- [ ] Google Drive API enabled
- [ ] Google Sheets API enabled
- [ ] OAuth 2.0 Client created
- [ ] Redirect URIs: `http://localhost:3456` added
- [ ] OAuth Consent Screen configured
- [ ] credentials.json downloaded và đặt đúng vị trí
- [ ] Đã chạy `node setup-auth.js` thành công
- [ ] File `token.json` đã được tạo
- [ ] Token có scope `spreadsheets`

✅ **Tất cả xong → Sẵn sàng test workflow!**

---

## 🔗 LINKS QUAN TRỌNG

- **Google Cloud Console:** https://console.cloud.google.com
- **API Library:** https://console.cloud.google.com/apis/library
- **Credentials:** https://console.cloud.google.com/apis/credentials
- **OAuth Consent:** https://console.cloud.google.com/apis/credentials/consent

---

**Tạo bởi:** Long Best AI
**Ngày:** 2026-01-09
**File:** GOOGLE_CLOUD_SETUP_GUIDE.md

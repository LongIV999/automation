# 🚀 QUICK START GUIDE - Long Best AI Automation

Hướng dẫn nhanh để chạy hệ thống automation trong 10 phút.

---

## ⚡ Setup Nhanh (10 phút)

### Bước 1: Install Dependencies (2 phút)

```bash
cd /Users/admin/automation

# Carousel Generator
cd scripts/carousel-generator
npm install

# Drive Uploader
cd ../drive-uploader
npm install

cd ../..
```

### Bước 2: Setup Google Drive (5 phút)

**2.1. Tạo OAuth Credentials:**

1. Truy cập: https://console.cloud.google.com
2. Create project: "Long Best AI"
3. Enable Google Drive API
4. Create OAuth 2.0 Client ID (Desktop app)
5. Download JSON → Rename: `credentials.json`
6. Copy vào: `scripts/drive-uploader/credentials.json`

**2.2. Authorize:**

```bash
cd scripts/drive-uploader
npm run auth
```

Browser sẽ mở → Cho phép access → Done!

### Bước 3: Setup Google Sheets (3 phút)

**3.1. Tạo Sheet:**

1. Go to: https://sheets.google.com
2. Create: "Long Best AI - Content Calendar"
3. Tạo 2 tabs:
   - `Content_Calendar`
   - `Posts`

**3.2. Thêm columns vào tab "Posts":**

| ID | Caption | Drive_Folder_ID | Status | Post_URL | Published_Date |
|----|---------|-----------------|--------|----------|----------------|

**3.3. Share với n8n:**

1. Vào n8n → Google Sheets credential
2. Copy service account email
3. Share sheet với email đó (Editor permission)

---

## ✅ Kiểm Tra Setup

### Test 1: Generate Images

```bash
cd scripts/carousel-generator
node generator.js example-content.json output/test
```

✅ Nếu thành công: Sẽ có folder `output/test` với 7 ảnh PNG

### Test 2: Upload Drive

```bash
cd ../drive-uploader
node upload.js ../carousel-generator/output/test "Test_Upload"
```

✅ Nếu thành công: Sẽ hiển thị Folder ID và link Drive

### Test 3: End-to-End

```bash
cd ../content-automation
./create-post.sh ../carousel-generator/example-content.json "Test_Post"
```

✅ Nếu thành công: Hiển thị summary với Folder ID

---

## 🎯 Tạo Post Đầu Tiên

### 1. Tạo Content File

```bash
cd scripts/content-automation
mkdir -p content
nano content/first-post.json
```

Paste template:

```json
{
  "title": "10 AI Tips",
  "slides": [
    {"type": "title", "headline": "10 AI Tips Bạn Cần Biết"},
    {"type": "content", "headline": "Tip #1", "content": "Nội dung tip 1..."},
    {"type": "content", "headline": "Tip #2", "content": "Nội dung tip 2..."},
    {"type": "content", "headline": "Tip #3", "content": "Nội dung tip 3..."},
    {"type": "list", "headline": "More Tips", "content": ["Tip 4", "Tip 5", "Tip 6"]},
    {"type": "content", "headline": "Kết luận", "content": "Áp dụng ngay!"},
    {"type": "cta", "headline": "Nhận Template!", "content": "Comment 'AI' bên dưới"}
  ]
}
```

Save (Ctrl+O, Enter, Ctrl+X)

### 2. Generate + Upload

```bash
./create-post.sh content/first-post.json "2026-01-10_10_AI_Tips"
```

Đợi 30 giây...

### 3. Copy Folder ID

```
✓ Upload completed successfully
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 Folder ID:   1AbCdEfGhIjKlMnOp  ← COPY CÁI NÀY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Update Google Sheets

1. Mở Google Sheets → Tab "Posts"
2. Thêm row mới:
   - **ID**: `post_001`
   - **Caption**: Viết caption cho Facebook post
   - **Drive_Folder_ID**: Paste Folder ID từ bước 3
   - **Status**: `Ready`

### 5. Đợi n8n Auto-post

n8n workflow chạy mỗi 15 phút → Tự động đăng Facebook!

---

## 📋 Quy Trình Hàng Ngày

### Sáng: Lên Kế Hoạch (5 phút)

```
1. Mở Content_Calendar tab
2. Brainstorm 3-5 topic ideas
3. Add vào sheet với Status = "Idea"
```

### Trưa: Tạo Content (10 phút/post)

```
1. Pick 1 topic từ calendar
2. Tạo content JSON file
3. Run: ./create-post.sh content/topic.json
4. Paste Folder ID vào Sheets
5. Viết caption
6. Set Status = "Ready"
```

### Chiều: Monitor (5 phút)

```
1. Check Facebook posts đã đăng chưa
2. Reply comments
3. Track engagement metrics
4. Update Archive tab
```

---

## 🔄 Workflow Diagram

```
┌─────────────────────┐
│ 1. Create JSON      │  ← 5 phút
│    (Content idea)   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ 2. Run Script       │  ← 30 giây (tự động)
│    ./create-post.sh │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ 3. Paste to Sheets  │  ← 1 phút
│    + Write Caption  │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ 4. n8n Auto-post    │  ← Tự động
│    to Facebook      │
└─────────────────────┘

TOTAL TIME: ~7 phút
```

**Before automation:** 55 phút/post
**After automation:** 7 phút/post
**Time saved:** 48 phút/post (87% faster!)

---

## 🆘 Common Issues

### ❌ "Command not found: node"

```bash
# Install Node.js
brew install node  # macOS
```

### ❌ "npm install failed"

```bash
# Clear cache and retry
npm cache clean --force
npm install
```

### ❌ "Token not found"

```bash
cd scripts/drive-uploader
npm run auth
```

### ❌ "n8n not posting"

**Check:**
1. n8n workflow active?
2. Status in Sheets = "Ready"?
3. Drive_Folder_ID correct?
4. Check n8n logs

---

## 📞 Cần Help?

**Xem tài liệu chi tiết:**

- 📖 **Tổng quan hệ thống**: `WORKFLOW_MANAGEMENT.md`
- 🎨 **Carousel Generator**: `scripts/carousel-generator/README.md`
- ☁️ **Drive Uploader**: `scripts/drive-uploader/README.md`
- 🤖 **Content Automation**: `scripts/content-automation/README.md`
- 📅 **Content Calendar**: `content-calendar/README.md`

---

## 🎉 Next Steps

### Tuần 1: Practice

- [ ] Tạo 5 posts thử nghiệm
- [ ] Monitor engagement
- [ ] Tweak content based on performance

### Tuần 2: Scale

- [ ] Tăng lên 7 posts/week (1/ngày)
- [ ] Setup content calendar 2 tuần trước
- [ ] Batch create content

### Tuần 3: Optimize

- [ ] A/B test hooks
- [ ] Optimize posting times
- [ ] Analyze top performing content

### Tuần 4: Automate More

- [ ] Setup n8n workflow để auto-generate JSON
- [ ] Auto-update Sheets với Folder ID
- [ ] Setup analytics dashboard

---

**Ready to go! 🚀**

Bắt đầu với lệnh:
```bash
cd /Users/admin/automation/scripts/content-automation
./create-post.sh content/first-post.json
```

Good luck! 🍀

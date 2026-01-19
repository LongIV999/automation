# 📋 CHEAT SHEET - Tạo Post Nhanh

**Quick reference cho quy trình hàng ngày**

---

## 🚀 Quick Commands

### Tạo Post Mới (Full Process)

```bash
# 1. Navigate to automation folder
cd /Users/admin/automation/scripts/content-automation

# 2. Create content file
nano content/post_$(date +%Y%m%d).json

# 3. Run automation
./create-post.sh content/post_$(date +%Y%m%d).json

# 4. Copy Folder ID (tự động copy vào clipboard)
# 5. Paste vào Google Sheets
# 6. Set Status = "Ready"
# 7. Đợi n8n auto-post (15 phút)
```

---

## 📝 Content JSON Template

```json
{
  "title": "Tiêu Đề Post",
  "topic": "Topic Name",
  "brand": "Long Best AI",
  "slides": [
    {"type": "title", "headline": "...", "subheadline": "..."},
    {"type": "content", "headline": "...", "content": "..."},
    {"type": "prompt", "headline": "...", "subheadline": "...", "content": "..."},
    {"type": "list", "headline": "...", "content": ["...", "..."]},
    {"type": "content", "headline": "...", "content": "..."},
    {"type": "content", "headline": "...", "content": "..."},
    {"type": "cta", "headline": "...", "content": "..."}
  ]
}
```

---

## 🎨 5 Loại Slides

### 1. Title (Slide tiêu đề)
```json
{
  "type": "title",
  "headline": "10 Prompt AI Cần Biết",
  "subheadline": "Tiết kiệm 5 giờ/tuần"
}
```

### 2. Content (Nội dung thường)
```json
{
  "type": "content",
  "headline": "Vấn Đề",
  "content": "Bạn mất quá nhiều thời gian...\n\nAI có thể giúp!"
}
```

### 3. Prompt (AI prompt box)
```json
{
  "type": "prompt",
  "headline": "Prompt #1: Email",
  "subheadline": "Copy vào ChatGPT:",
  "content": "Viết email về [topic]..."
}
```

### 4. List (Danh sách có checkmark)
```json
{
  "type": "list",
  "headline": "6 Prompt Khác",
  "content": [
    "Item 1",
    "Item 2",
    "Item 3"
  ]
}
```

### 5. CTA (Call to action)
```json
{
  "type": "cta",
  "headline": "Download Ngay!",
  "content": "💬 Comment 'AI' để nhận PDF"
}
```

---

## 🛠 Common Issues & Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| **Token not found** | `cd scripts/drive-uploader && npm run auth` |
| **Permission denied** | `chmod +x scripts/content-automation/create-post.sh` |
| **Node not found** | `brew install node` |
| **n8n not posting** | Check: Workflow active? Status = "Ready"? |

---

## 📊 Google Sheets Structure

| Column | Value | Example |
|--------|-------|---------|
| **ID** | post_XXX | `post_001` |
| **Caption** | Facebook caption | `10 prompt AI hay nhất...` |
| **Drive_Folder_ID** | From script | `1AbCdEfGhIj...` |
| **Status** | Ready/Published | `Ready` |
| **Post_URL** | Auto-filled | `https://fb.me/...` |
| **Published_Date** | Auto-filled | `2026-01-10` |

---

## ✍️ Caption Formula

```
🔥 [HOOK - 1 câu ngắn gọn, gây tò mò]

[VALUE PREVIEW - 2-3 dòng mô tả nội dung]

[BULLET POINTS]
✓ Point 1
✓ Point 2
✓ Point 3

💬 [CTA] Comment "[keyword]" để nhận [incentive]

#AI #Hashtag1 #Hashtag2
```

---

## 🎯 Best Practices

### Content
- ✅ Hook trong 2 giây đầu
- ✅ Mỗi slide 1 ý chính
- ✅ Dùng bullet points cho dễ đọc
- ✅ CTA rõ ràng ở slide cuối
- ❌ Quá nhiều text trong 1 slide
- ❌ Thiếu CTA

### Design
- ✅ Brand colors: #d97757 (cam), #788c5d (xanh)
- ✅ Fonts: Poppins (headline), Lora (body)
- ✅ Tỷ lệ 4:5 (1080x1350) cho Facebook
- ❌ Ảnh bị mờ (luôn export retina quality)

### Posting
- ✅ Best times: 7-9h, 12-13h, 20-22h
- ✅ 1 post/ngày minimum
- ✅ Monitor engagement đầu 2 tiếng
- ❌ Post vào lúc 2-5h sáng

---

## 🔄 Workflow at a Glance

```
JSON → Script → Drive → Sheets → n8n → Facebook
 ↓        ↓       ↓       ↓       ↓       ↓
5min    30sec   auto    2min    auto   auto
```

**Total: ~7 phút**
**Before automation: 55 phút**
**Time saved: 87%**

---

## 📞 Quick Links

- **Google Sheets:** [Your Sheet URL]
- **Google Drive Folder:** [Your Parent Folder]
- **Facebook Page:** https://facebook.com/longbestai
- **n8n Dashboard:** http://localhost:5678
- **Graph API Explorer:** https://developers.facebook.com/tools/explorer

---

## 🚨 Emergency Commands

```bash
# Restart n8n
pm2 restart n8n
# or
docker-compose restart n8n

# Check n8n logs
pm2 logs n8n
# or
docker logs n8n-container -f

# Re-authenticate Drive
cd scripts/drive-uploader
npm run auth

# Test generation only (no upload)
cd scripts/carousel-generator
node generator.js content.json output/test

# Test upload only
cd scripts/drive-uploader
node upload.js ../carousel-generator/output/test "Test_Folder"
```

---

## 📈 Daily Routine

### Sáng (5-10 phút)
```
1. Check Sheets → Tab "Posts"
2. Review posts đã publish hôm qua
3. Plan topics cho hôm nay
```

### Trưa (10 phút)
```
1. Tạo 1-2 content JSON files
2. Run create-post.sh
3. Update Sheets với Folder ID + Caption
4. Set Status = "Ready"
```

### Chiều (5 phút)
```
1. Check Facebook post performance
2. Reply comments
3. Track metrics trong Analytics tab
```

---

## 🎓 Learning Resources

**Đọc theo thứ tự:**
1. `QUICKSTART.md` - Setup lần đầu (10 phút)
2. `HUONG_DAN_CHI_TIET.md` - Hiểu chi tiết (30 phút)
3. `CHEAT_SHEET.md` - File này - Reference nhanh
4. `WORKFLOW_MANAGEMENT.md` - System overview

---

**Print this page và dán lên tường! 📌**

**Version**: 1.0.0
**Last Updated**: 2026-01-08

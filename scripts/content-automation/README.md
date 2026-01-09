# Content Automation Scripts

Tự động hóa end-to-end: Content → Images → Drive → Facebook

## 🎯 Quy Trình Tự Động

```
Input: content.json
  ↓
Generate Images (Puppeteer)
  ↓
Upload to Drive (Google API)
  ↓
Update Google Sheets
  ↓
Auto Post to Facebook (n8n)
```

---

## 🚀 Quick Start

### One Command để tạo post:

```bash
./create-post.sh content/post_001.json "2026-01-10_AI_Prompts"
```

**Kết quả:**
- ✅ 7 ảnh carousel được generate
- ✅ Upload lên Google Drive
- ✅ Hiển thị Folder ID
- ✅ Copy Folder ID vào clipboard (macOS)
- ✅ Sẵn sàng để paste vào Google Sheets

**Bạn chỉ cần:**
1. Chạy command
2. Paste Folder ID vào Sheets
3. Set Status = "Ready"
4. n8n tự động đăng Facebook!

---

## 📋 Prerequisites

### 1. Install Dependencies

```bash
# Carousel Generator
cd ../carousel-generator
npm install

# Drive Uploader
cd ../drive-uploader
npm install

# Authorize Google Drive (chỉ 1 lần)
npm run auth
```

### 2. Setup Google Sheets

Tạo Sheet với các tab:
- `Content_Calendar` - Lập kế hoạch
- `Posts` - Queue đăng bài
- `Archive` - Lưu trữ

Xem: `content-calendar/README.md`

### 3. Setup n8n Workflow

Import workflow: `n8n-skill/awesome-n8n-workflows-main/workflows/facebook-longbest-publisher/`

---

## 🛠 Usage Examples

### Example 1: Tạo Post Cơ Bản

```bash
./create-post.sh content/ai-prompts.json
```

Output:
```
━━━ STEP 1: Generating Carousel Images ━━━
✓ Images generated successfully
ℹ Generated 7 images

━━━ STEP 2: Uploading to Google Drive ━━━
✓ Upload completed successfully
✓ Folder ID: 1AbCdEfGhIjKlMnOp
✓ Folder Link: https://drive.google.com/...

━━━ SUMMARY ━━━
Post Created Successfully!
📁 Folder Name: 2026-01-08_ai-prompts
🆔 Folder ID:   1AbCdEfGhIjKlMnOp
🔗 Folder Link: https://drive.google.com/...
📸 Images:      7 files
```

### Example 2: Custom Folder Name

```bash
./create-post.sh content/post_001.json "10_AI_Prompts_Hay_Nhat"
```

### Example 3: Batch Create Multiple Posts

```bash
#!/bin/bash
# create-multiple.sh

for file in content/*.json; do
    echo "Creating post: $file"
    ./create-post.sh "$file"
    echo "Waiting 5 seconds..."
    sleep 5
done

echo "All posts created!"
```

---

## 📁 Directory Structure

```
content-automation/
├── create-post.sh           # Main automation script
├── create-multiple.sh       # Batch processing (optional)
├── README.md                # This file
└── content/                 # Content JSON files
    ├── post_001.json
    ├── post_002.json
    └── ...
```

**Recommended structure:**

```
automation/
├── scripts/
│   ├── carousel-generator/
│   │   ├── generator.js
│   │   └── output/           # Generated images
│   │       ├── post_001/
│   │       ├── post_002/
│   │       └── ...
│   ├── drive-uploader/
│   │   └── upload.js
│   └── content-automation/
│       ├── create-post.sh
│       └── content/          # Your content files
│           ├── post_001.json
│           └── ...
```

---

## 🔄 Full Workflow Integration

### Manual Workflow (Current)

```bash
# Step 1: Create content JSON
nano content/post_001.json

# Step 2: Run automation
./create-post.sh content/post_001.json

# Step 3: Paste Folder ID to Google Sheets

# Step 4: Set Status = "Ready"

# Step 5: n8n auto-posts to Facebook
```

**Time:** ~2 phút

---

### Semi-Auto Workflow (Better)

Tạo helper script: `quick-create.sh`

```bash
#!/bin/bash
# Usage: ./quick-create.sh "Topic Name" "Caption text..."

TOPIC=$1
CAPTION=$2
DATE=$(date +%Y-%m-%d)
FILENAME="${DATE}_$(echo $TOPIC | tr ' ' '_').json"

# Generate JSON from template
cat > "content/$FILENAME" <<EOF
{
  "title": "$TOPIC",
  "slides": [
    {"type": "title", "headline": "$TOPIC"},
    {"type": "content", "headline": "Introduction", "content": "$CAPTION"},
    ...
  ]
}
EOF

# Run automation
./create-post.sh "content/$FILENAME"
```

**Usage:**
```bash
./quick-create.sh "10 AI Prompts" "Đây là 10 prompt AI hay nhất..."
```

---

### Fully Auto Workflow (Target - with n8n)

**n8n Workflow Design:**

```
[Google Sheets Trigger]
    ↓ (When Status = "Design")
    ↓
[Read Row Data]
    ↓ (Get Topic, Caption)
    ↓
[Generate JSON] (Function node)
    ↓
[Execute Shell: create-post.sh]
    ↓ (Wait for completion)
    ↓
[Parse Output] (Get Folder ID)
    ↓
[Update Sheet: Drive_Folder_ID]
    ↓
[Update Status: "Ready"]
    ↓
[Existing Facebook Publisher Workflow]
    ↓
[Update Status: "Published"]
```

**Import workflow:** (Tạo file JSON riêng nếu cần)

---

## 📊 Content JSON Templates

### Template 1: Tutorial (7 slides)

```json
{
  "title": "Hướng Dẫn Tạo Ảnh Đẹp với AI",
  "topic": "AI Image Generation Tutorial",
  "brand": "Long Best AI",
  "slides": [
    {
      "type": "title",
      "headline": "Tạo Ảnh Đẹp Như Pro với AI",
      "subheadline": "Không cần camera đắt tiền!"
    },
    {
      "type": "content",
      "headline": "Tại Sao Dùng AI?",
      "content": "Tiết kiệm thời gian và chi phí..."
    },
    {
      "type": "prompt",
      "headline": "Prompt Mẫu #1",
      "content": "Modern living room, natural light..."
    },
    {
      "type": "list",
      "headline": "5 Tips Quan Trọng",
      "content": ["Tip 1", "Tip 2", "Tip 3"]
    },
    {
      "type": "content",
      "headline": "Kết Quả",
      "content": "Ảnh đẹp chỉ trong 5 phút!"
    },
    {
      "type": "cta",
      "headline": "Nhận Template Miễn Phí!",
      "content": "Comment 'AI' bên dưới"
    }
  ]
}
```

### Template 2: Listicle (7 slides)

```json
{
  "title": "10 Prompt AI Hay Nhất",
  "slides": [
    {"type": "title", "headline": "10 Prompt AI Bạn Phải Thử"},
    {"type": "list", "headline": "Prompt 1-3", "content": [...]},
    {"type": "list", "headline": "Prompt 4-6", "content": [...]},
    {"type": "list", "headline": "Prompt 7-9", "content": [...]},
    {"type": "prompt", "headline": "Ví Dụ Chi Tiết"},
    {"type": "content", "headline": "Bonus Tip"},
    {"type": "cta", "headline": "Comment để nhận 100 prompts!"}
  ]
}
```

**More templates:** See `carousel-generator/example-content.json`

---

## 🔧 Advanced Features

### 1. Add Post to Google Sheets Automatically

```bash
# create-and-add-to-sheet.sh

./create-post.sh "$1" "$2"

# Get Folder ID from last run
FOLDER_ID=$(cat /tmp/last-folder-id.txt)

# Use Google Sheets API to add row
# (Requires Google Sheets API setup)
```

### 2. Scheduling Posts

```bash
# schedule-post.sh
# Usage: ./schedule-post.sh content.json "2026-01-15 09:00"

CONTENT=$1
SCHEDULE_TIME=$2

# Use 'at' command (macOS/Linux)
echo "./create-post.sh $CONTENT" | at $SCHEDULE_TIME
```

### 3. Monitoring & Alerts

```bash
# Send notification when post ready
./create-post.sh content.json && \
  osascript -e 'display notification "Post ready!" with title "Long Best AI"'
```

---

## 🐛 Troubleshooting

### Script fails: "Permission denied"

```bash
chmod +x create-post.sh
```

### "Command not found: node"

```bash
# Check Node.js installed
which node

# If not installed
brew install node  # macOS
```

### "Generator failed"

```bash
# Check dependencies
cd ../carousel-generator
npm install
```

### "Upload failed: Not authenticated"

```bash
cd ../drive-uploader
npm run auth
```

---

## 📈 Performance

**Typical execution time:**
- Generate images: 10-15 seconds
- Upload to Drive: 15-20 seconds
- **Total: ~30-35 seconds**

**Manual process before automation:**
- Research + write: 30 minutes
- Design carousel: 15 minutes
- Export images: 5 minutes
- Upload Drive: 3 minutes
- Update sheet: 2 minutes
- **Total: ~55 minutes**

**Time saved: 54 minutes per post!** 🎉

---

## 🎯 Best Practices

1. **Naming Convention:**
   - Content files: `YYYY-MM-DD_topic-slug.json`
   - Folders: `YYYY-MM-DD_Topic_Name`

2. **Organization:**
   - Keep content files in `content/` directory
   - Archive old content monthly

3. **Quality Control:**
   - Preview images locally before posting
   - Test with 1-2 posts first
   - Monitor Facebook analytics

4. **Backup:**
   ```bash
   # Backup all content
   tar -czf content-backup-$(date +%Y%m%d).tar.gz content/

   # Backup generated images
   tar -czf images-backup-$(date +%Y%m%d).tar.gz ../carousel-generator/output/
   ```

---

## 🆘 Support

**Debug mode:**
```bash
# Run with verbose output
bash -x ./create-post.sh content.json
```

**Check logs:**
```bash
# Generator logs
tail -f ../carousel-generator/output/log.txt

# Uploader logs
tail -f ../drive-uploader/upload.log
```

---

**Version**: 1.0.0
**Last Updated**: 2026-01-08

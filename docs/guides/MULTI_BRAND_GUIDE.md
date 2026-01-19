# 🏢 Multi-Brand Management Guide

Hướng dẫn chi tiết quản lý nhiều brands/fanpages trong automation system.

---

## 📚 Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [Cài Đặt Lần Đầu](#cài-đặt-lần-đầu)
3. [Tạo Brand Mới](#tạo-brand-mới)
4. [Nhân Bản Brand](#nhân-bản-brand)
5. [Tạo Content Cho Brand](#tạo-content-cho-brand)
6. [n8n Workflow Setup](#n8n-workflow-setup)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Tổng Quan

### Kiến Trúc Multi-Brand

```
automation/
├── brands/                          # ⭐ Multi-brand configs
│   ├── _templates/                  # Templates cho brand mới
│   ├── longbest-ai/                 # Brand 1
│   │   ├── brand.json              # Config
│   │   ├── content/                # Content JSON files
│   │   ├── output/                 # Generated images
│   │   └── n8n-workflow.json       # Auto-generated workflow
│   └── thachvuland/                # Brand 2
│       └── ...
│
├── brand-manager.sh                 # ⭐ CLI tool quản lý brands
│
└── scripts/
    ├── carousel-generator/
    │   ├── generator.js
    │   └── brand-loader.js          # ⭐ Load brand configs
    ├── drive-uploader/
    └── content-automation/
```

### Workflow Mới

```
1. Tạo brand            → ./brand-manager.sh create <brand-id>
2. Config brand         → Edit brands/<brand-id>/brand.json
3. Tạo content          → Add to brands/<brand-id>/content/
4. Generate carousel    → ./create-post.sh --brand <brand-id> ...
5. Auto-upload Drive    → Automatic
6. Generate n8n workflow→ ./brand-manager.sh generate-workflow <brand-id>
7. Import to n8n        → Import JSON, activate
8. Auto-post Facebook   → n8n runs every hour
```

---

## 🔧 Cài Đặt Lần Đầu

### Prerequisites

Hệ thống đã setup:
- ✅ Google Drive API credentials
- ✅ Google Sheets API credentials
- ✅ n8n installed và running
- ✅ Node.js packages installed

### Verify Setup

```bash
# Check brand manager works
./brand-manager.sh

# List existing brands
./brand-manager.sh list

# Check brand info
./brand-manager.sh info longbest-ai
```

Expected output:
```
BRAND ID             NAME                           DESCRIPTION
────────────────────────────────────────────────────────────────────────────────────
longbest-ai          Long Best AI                   Vietnamese AI education fanpage
thachvuland          Thach Vu Land                  Real estate content automation

✓ Total: 2 brands
```

---

## 🆕 Tạo Brand Mới

### Step 1: Tạo Brand Structure

```bash
./brand-manager.sh create nano-banana "Nano Banana" "AI prompt creator fanpage"
```

Output:
```
━━━ Creating brand: Nano Banana ━━━
ℹ Tạo cấu trúc thư mục...
ℹ Tạo brand config...
ℹ Tạo .env file...
ℹ Tạo README...
✓ Brand 'nano-banana' created successfully!
```

Directory được tạo:
```
brands/nano-banana/
├── brand.json          # Config chính
├── .env               # Env variables
├── README.md          # Setup guide
├── content/           # Nơi lưu content JSON
├── output/            # Nơi lưu generated images
├── credentials/       # Facebook credentials (optional)
└── assets/            # Brand assets (logos, fonts)
```

### Step 2: Config Brand

Edit `brands/nano-banana/brand.json`:

```json
{
  "brandId": "nano-banana",
  "name": "Nano Banana",
  "description": "AI prompt creator fanpage",

  "colors": {
    "primary": "#FFD700",      // ⬅️ Customize màu
    "background": "#FFF9E5",
    "accent": "#FF6B9D"
  },

  "typography": {
    "headline": "Montserrat",  // ⬅️ Customize font
    "body": "Open Sans",
    "sizes": {
      "h1Title": 80,           // ⬅️ Customize sizes
      "h1Content": 60
    }
  },

  "branding": {
    "logoText": "🍌 Nano Banana",
    "tagline": "Prompts That Work",  // ⬅️ Tagline
    "cornerText": "Nano Banana"
  },

  "googleSheets": {
    "sheetId": "YOUR_GOOGLE_SHEETS_ID",  // ⬅️ ⚠️ BẮT BUỘC
    "tabName": "Posts"
  },

  "facebook": {
    "pageId": "YOUR_FACEBOOK_PAGE_ID",   // ⬅️ ⚠️ BẮT BUỘC
    "credentialId": "YOUR_N8N_CREDENTIAL_ID"  // ⬅️ Get from n8n
  }
}
```

**⚠️ QUAN TRỌNG:** Phải update:
- `googleSheets.sheetId` - Google Sheets ID cho brand này
- `facebook.pageId` - Facebook Page ID
- `facebook.credentialId` - Từ n8n (setup ở bước sau)

### Step 3: Validate Config

```bash
./brand-manager.sh validate nano-banana
```

Output:
```
━━━ Validating: nano-banana ━━━
  Checking JSON syntax... ✓
  Checking required fields... ✓
  Checking directories... ✓

✓ Validation passed!
```

---

## 🔄 Nhân Bản Brand

Nhanh hơn là clone brand có sẵn:

```bash
./brand-manager.sh clone longbest-ai nano-banana "Nano Banana"
```

Lợi ích:
- ✅ Copy toàn bộ cấu trúc
- ✅ Giữ nguyên content mẫu
- ✅ Chỉ cần sửa IDs

**⚠️ LƯU Ý:** Sau khi clone, PHẢI update:
- Google Sheets ID
- Facebook Page ID
- Facebook Credential ID
- Colors, fonts (optional)

---

## 📝 Tạo Content Cho Brand

### 1. Tạo Content JSON File

Tạo file trong `brands/nano-banana/content/`:

**`brands/nano-banana/content/chatgpt-tips.json`:**

```json
{
  "title": "10 ChatGPT Tips You Need",
  "slides": [
    {
      "type": "title",
      "headline": "10 CHATGPT TIPS",
      "subheadline": "You probably don't know about"
    },
    {
      "type": "content",
      "headline": "Tip #1: Use System Prompts",
      "content": "Start with 'You are a...' to set context"
    },
    {
      "type": "list",
      "headline": "Benefits",
      "content": [
        "Better responses",
        "More consistency",
        "Professional tone"
      ]
    },
    {
      "type": "prompt",
      "headline": "Example Prompt",
      "subheadline": "Copy this:",
      "content": "You are a marketing expert. Help me write a Facebook ad..."
    },
    {
      "type": "cta",
      "headline": "Want More?",
      "content": "Follow @NanoBanana for daily AI tips!"
    }
  ]
}
```

### 2. Generate Carousel + Upload

**Cách 1: Full automation (RECOMMENDED)**

```bash
cd scripts/content-automation

./create-post.sh --brand nano-banana \
  ../../brands/nano-banana/content/chatgpt-tips.json \
  "2026-01-10_ChatGPT_Tips"
```

**Cách 2: Step by step**

```bash
# Generate images only
cd scripts/carousel-generator
node generator.js --brand nano-banana \
  ../../brands/nano-banana/content/chatgpt-tips.json

# Upload to Drive
cd ../drive-uploader
node upload.js --brand nano-banana \
  ../../brands/nano-banana/output/chatgpt-tips \
  "2026-01-10_ChatGPT_Tips"
```

### 3. Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Post Created Successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 Folder Name: 2026-01-10_ChatGPT_Tips
🆔 Folder ID:   1AbCdEfGhIjKlMnOp
🔗 Folder Link: https://drive.google.com/...
📸 Images:      5 files

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Folder ID tự động được copy vào clipboard (macOS).

---

## 🤖 n8n Workflow Setup

### Step 1: Generate Workflow File

```bash
./brand-manager.sh generate-workflow nano-banana
```

Output:
```
━━━ Generating n8n workflow for: nano-banana ━━━
✓ Workflow generated: brands/nano-banana/n8n-workflow.json

ℹ Import file này vào n8n UI để sử dụng
```

### Step 2: Setup Facebook Credentials trong n8n

1. Mở n8n UI: `http://localhost:5678`
2. Settings → Credentials → Add New
3. Chọn "Facebook Graph API"
4. Nhập:
   - Access Token (từ Facebook Developers)
   - Page ID
5. **Save** và **Copy Credential ID**

### Step 3: Update Brand Config

Paste Credential ID vào `brands/nano-banana/brand.json`:

```json
{
  "facebook": {
    "pageId": "123456789",
    "credentialId": "a1b2c3d4e5f6g7h8"  // ⬅️ Paste ID ở đây
  }
}
```

### Step 4: Re-generate Workflow

```bash
./brand-manager.sh generate-workflow nano-banana
```

### Step 5: Import vào n8n

1. n8n UI → Workflows → Import from File
2. Chọn file: `brands/nano-banana/n8n-workflow.json`
3. Review workflow:
   - Schedule Trigger: Every hour
   - Google Sheets: Read "Posts" tab where Status="Ready"
   - Google Drive: Download images
   - Facebook: Upload carousel
   - Google Sheets: Update Status="Published"
4. **Activate workflow** ⚡

### Step 6: Test Workflow

1. Mở Google Sheets cho brand này
2. Paste Folder ID vào cột `Drive_Folder_ID`
3. Set `Status` = "Ready"
4. Đợi 1 hour (hoặc run manually trong n8n)
5. Check Facebook Page → Post đã được đăng! ✅

---

## ✅ Best Practices

### 1. Naming Convention

**Brand IDs:**
- Lowercase only
- Dùng dấu gạch ngang (kebab-case)
- Ngắn gọn, dễ nhớ

✅ Good:
- `longbest-ai`
- `nano-banana`
- `thachvuland`

❌ Bad:
- `LongBestAI` (uppercase)
- `nano_banana` (underscore)
- `my-super-long-brand-name` (too long)

**Content Files:**
- Descriptive, dễ tìm
- Bao gồm topic
- Số thứ tự nếu series

✅ Good:
- `chatgpt-tips-001.json`
- `midjourney-guide-beginners.json`
- `ai-news-2026-01-10.json`

### 2. Color Palette

Mỗi brand nên có consistent color system:

```json
{
  "colors": {
    "primary": "#...",      // Main brand color
    "background": "#...",   // Light background
    "backgroundDark": "#...", // Dark background
    "accent": "#...",       // Secondary color
    "text": "#...",         // Light text
    "textDark": "#..."      // Dark text
  }
}
```

**Tips:**
- Primary: Brand signature color
- Accent: Contrast cho CTAs
- Background: Warm, không quá trắng (#F4F3EE tốt hơn #FFFFFF)
- Test contrast cho readability

### 3. Content Organization

```
brands/nano-banana/content/
├── 2026-01/                    # Theo tháng
│   ├── week-1/
│   │   ├── chatgpt-tips.json
│   │   └── midjourney-guide.json
│   └── week-2/
│       └── ai-news.json
│
├── templates/                   # Content templates
│   ├── tips-template.json
│   └── tutorial-template.json
│
└── archive/                     # Published content
    └── 2025/
```

### 4. Google Sheets Structure

Mỗi brand có Google Sheet riêng với tabs:

| Tab | Purpose |
|-----|---------|
| **Posts** | Execution queue (n8n reads this) |
| **Content_Calendar** | Planning (ideas, research) |
| **Archive** | Published posts với metrics |
| **Analytics** | Dashboard & performance |

**Posts Tab Columns:**
- `Post_ID` - Unique ID
- `Date` - Ngày đăng
- `Topic` - Chủ đề
- `Drive_Folder_ID` - ⬅️ n8n reads this
- `Caption` - Post caption
- `Status` - Ready/Published/Failed
- `Post_URL` - Facebook post link
- `Views` - View count
- `Engagement` - Likes + Comments + Shares

### 5. Backup Strategy

**Automated Backups:**

```bash
# Backup brand configs (weekly)
tar -czf backups/brands-$(date +%Y-%m-%d).tar.gz brands/

# Backup Google Drive (tự động)
# Drive itself is backup!

# Backup Google Sheets
# File → Make a copy → Archive folder
```

**Critical Files:**
- `brands/*/brand.json` - Brand configs
- `brands/*/credentials/*` - Facebook credentials
- `brands/*/.env` - Environment variables

⚠️ **NEVER commit credentials to git!**

### 6. Error Handling

**Common Errors:**

| Error | Cause | Fix |
|-------|-------|-----|
| "Brand not found" | Typo trong brand ID | Check spelling |
| "Invalid JSON" | Syntax error trong brand.json | Use `./brand-manager.sh validate` |
| "Google Sheets ID invalid" | Wrong Sheets ID | Verify ID trong browser URL |
| "Facebook API error" | Invalid credentials | Re-auth Facebook trong n8n |
| "Drive quota exceeded" | Out of storage | Clean old files hoặc upgrade |

**Debug Mode:**

```bash
# Enable debug logging
DEBUG=true ./create-post.sh --brand nano-banana ...

# Check n8n logs
docker logs n8n

# Check Google API errors
# Trong Google Cloud Console → Logs
```

---

## 🆘 Troubleshooting

### Brand không generate được carousel

**Problem:** Colors không đúng, text bị crop

**Solution:**
1. Check `brand.json` syntax: `./brand-manager.sh validate nano-banana`
2. Verify colors are valid hex codes
3. Test với content JSON đơn giản trước

### n8n workflow không chạy

**Checklist:**
- [ ] Workflow activated trong n8n? (switch ON)
- [ ] Schedule Trigger enabled?
- [ ] Google Sheets credentials OK?
- [ ] Facebook credentials OK?
- [ ] Có posts với Status="Ready"?
- [ ] Drive_Folder_ID đúng format?

**Test manually:**
1. n8n UI → Open workflow
2. Click "Execute Workflow" button
3. Xem error message chi tiết
4. Fix issue
5. Test lại

### Drive upload failed

**Possible causes:**
1. **No authentication:**
   ```bash
   cd scripts/drive-uploader
   npm run auth
   ```

2. **Invalid folder name:**
   - Không dùng special characters
   - Format: `YYYY-MM-DD_Topic_Name`

3. **Quota exceeded:**
   - Check Google Drive storage
   - Delete old files
   - Hoặc upgrade storage

### Images không có màu đúng brand

**Solution:**

Brand colors được apply qua `brand-loader.js`. Verify:

```bash
node -e "
const loader = require('./scripts/carousel-generator/brand-loader');
loader.loadBrandConfig('nano-banana').then(config => {
  console.log(config.colors);
});
"
```

Expected output:
```json
{
  "primary": "#FFD700",
  "background": "#FFF9E5",
  ...
}
```

Nếu sai → Check `brands/nano-banana/brand.json`

---

## 📚 Quick Reference

### Commands Cheat Sheet

```bash
# Brand Management
./brand-manager.sh create <brand-id> "<name>" [desc]
./brand-manager.sh clone <source> <new-id>
./brand-manager.sh list
./brand-manager.sh info <brand-id>
./brand-manager.sh validate <brand-id>
./brand-manager.sh generate-workflow <brand-id>

# Content Creation
./create-post.sh --brand <brand-id> <content.json> "<Folder_Name>"

# Manual Steps
cd scripts/carousel-generator
node generator.js --brand <brand-id> <content.json>

cd ../drive-uploader
node upload.js --brand <brand-id> <images-dir> "<Folder_Name>"
```

### Files to Edit

| File | Purpose | When to Edit |
|------|---------|--------------|
| `brands/<brand-id>/brand.json` | Brand config | Always (required) |
| `brands/<brand-id>/.env` | Env vars | Optional |
| `brands/<brand-id>/content/*.json` | Content data | Every post |

### Required IDs

| ID | Where to Get | Where to Use |
|----|--------------|--------------|
| **Google Sheets ID** | Browser URL: `docs.google.com/spreadsheets/d/<ID>` | `brand.json` → `googleSheets.sheetId` |
| **Facebook Page ID** | Facebook Page Settings → Page Info | `brand.json` → `facebook.pageId` |
| **n8n Credential ID** | n8n → Credentials → Copy ID | `brand.json` → `facebook.credentialId` |
| **Drive Folder ID** | Auto-generated after upload | Paste vào Google Sheets |

---

## 🚀 Next Steps

Sau khi setup xong:

1. **Tạo content schedule** - Plan 2-4 tuần trước
2. **Batch generate content** - Tạo nhiều posts 1 lúc
3. **Monitor performance** - Track metrics trong Google Sheets
4. **Optimize workflow** - Dựa trên engagement data
5. **Scale to new brands** - Clone và customize

**Happy automating! 🎉**

---

**Need help?** Check:
- [Brand README](brands/README.md) - System overview
- [QUICKSTART](QUICKSTART.md) - Quick setup guide
- [CHEAT_SHEET](CHEAT_SHEET.md) - Daily commands

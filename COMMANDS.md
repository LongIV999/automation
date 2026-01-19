



# Long Best AI - Automation Commands Reference

Tổng hợp các câu lệnh để sử dụng và kích hoạt các workflow trong hệ thống automation.

---

## 📋 Mục Lục
- [🤖 Antigravity Workflow (NEW)](#-antigravity-workflow-new)
- [Content Creation Pipeline](#content-creation-pipeline)
- [Review Dashboard](#review-dashboard)
- [Analytics & Reporting](#analytics--reporting)
- [Multi-Format Generators](#multi-format-generators)
- [Google Sheets Management](#google-sheets-management)
- [Workflow Monitoring](#-workflow-monitoring)
- [OpenCode Agent](#-opencode-agent)
- [Utilities](#utilities)

---

## 📡 Workflow Monitoring

Hệ thống theo dõi real-time tiến độ của automation workflow.

### 1. Khởi động Monitor & Dashboard
Cách nhanh nhất (Start server + Open browser):
```bash
npm run start:monitor
```

Hoặc chạy thủ công từng bước:
```bash
# B1: Start server
node scripts/workflow-monitor/monitor.js &

# B2: Open dashboard
open http://localhost:3001/scripts/workflow-monitor/dashboard.html
```

### 2. Chạy Workflow có Monitoring
Sau khi dashboard đã mở, chạy lệnh sau để bắt đầu tạo content và xem tiến độ:

```bash
# Format chuẩn
node scripts/daily-agent-monitored.js "Topic của bạn" --brand longbest

# Sử dụng npm script
npm run agent:monitored -- "Topic của bạn" --brand longbest
```

---

## 🤖 OpenCode Agent

AI Coding Agent chạy trực tiếp trong terminal để hỗ trợ code.

### Usage
```bash
# Khởi động agent
opencode

# Hoặc dùng npm script
npm run opencode
```

---

## 🤖 Antigravity Workflow (NEW)

### Interactive Daily Content Creation

**Cách nhanh nhất**: Chỉ cần nói với Antigravity!

```
User: "tạo bài đăng"
User: "đăng bài lên fanpage"
User: "viết lại bài này"
User: "content hôm nay"
```

Antigravity sẽ hỏi bạn 3 câu:
1. **Source**: Topic mới hay rewrite từ link?
2. **Format**: Single/Carousel-mini/Carousel-standard/Auto?
3. **Fanpage**: Long Best AI / Thach Vu Land / Queen Nail Bern?

Sau đó tự động:
- ✅ Generate content (Claude AI)
- ✅ Create images (Puppeteer)
- ✅ Enhance images (Sharp)
- ✅ Upload to Drive
- ✅ Update Google Sheets
- ✅ **Publish to Facebook** 🎉

**Thời gian**: 30-120s tùy format

**Chi tiết**: Xem `.claude/daily-content-workflow.md`

---

## 🚀 Content Creation Pipeline

### 1. Daily Agent (Full Workflow)
Tạo content → Tạo ảnh → Upload Drive → Update Sheets → **Publish to Facebook**

```bash
# FLEXIBLE FORMAT (NEW!)

# Auto-detect format (Recommended)
node scripts/daily-agent.js "Topic của bạn" --brand longbest --format auto

# Single Post (1 ảnh, 1200x1200px) - Nhanh nhất 30s
node scripts/daily-agent.js "Quote hoặc announcement" --brand longbest --format single

# Carousel Mini (3-5 ảnh, 1080x1350px) - ~85s
node scripts/daily-agent.js "5 tips hữu ích" --brand longbest --format carousel-mini

# Carousel Standard (7 ảnh, 1080x1350px) - ~95s
node scripts/daily-agent.js "Complete guide" --brand longbest --format carousel-standard

# MULTI-BRAND SUPPORT

# Long Best AI (default)
node scripts/daily-agent.js "Topic của bạn"

# Thach Vu Land
node scripts/daily-agent.js "Topic của bạn" --brand thachvuland

# Queen Nail Bern (German/Vietnamese)
node scripts/daily-agent.js "Nageltrends Winter" --brand queennailbern

# AUTO-PUBLISH TO FACEBOOK (NEW!)
node scripts/daily-agent.js "Topic" --brand queennailbern --format single --auto-publish

# ADVANCED OPTIONS

# Notebook style design
node scripts/daily-agent.js "Topic" --brand longbest --style notebook

# Override content type
node scripts/daily-agent.js "Topic" --brand longbest --type quote

# Force specific slide count
node scripts/daily-agent.js "Topic" --brand longbest --slides 5

# Ví dụ
node scripts/daily-agent.js "5 công cụ AI miễn phí" --format auto
node scripts/daily-agent.js "Quy hoạch bất động sản Hà Nội 2024" --brand thachvuland --format carousel-standard
node scripts/daily-agent.js "Wir suchen Nageldesignerin" --brand queennailbern --format single
```

**Performance:**
- Single post: ~30s (75% faster!)
- Carousel mini: ~85s (30% faster)
- Carousel standard: ~95s

**Docs:** See `docs/PHASE_2_SUMMARY.md` for details

### 2. Agent Writer (Chỉ tạo content)
```bash
cd scripts/agent-writer

# FLEXIBLE FORMAT SUPPORT (NEW!)

# Long Best AI - Auto format
node writer.js "Topic của bạn" --format auto

# Single post
node writer.js "Quote ngắn gọn" --format single

# Carousel mini
node writer.js "5 tips nhanh" --format carousel-mini

# Thach Vu Land - Standard carousel
node writer.js "Topic của bạn" --brand thachvuland --format carousel-standard

# Queen Nail Bern - German content
node writer.js "Nageltrends" --brand queennailbern --format auto
```

### 3. Carousel Generator (Chỉ tạo ảnh)
```bash
cd scripts/carousel-generator

# Tạo từ JSON file
node generator.js content/your-file.json output/folder-name

# Ví dụ
node generator.js content/longbest-ai-tips.json output/longbest-ai-tips
```

### 4. Image Enhancer (Làm nét ảnh)
```bash
cd scripts/carousel-generator

# Làm nét toàn bộ folder
node enhancer.js output/folder-name
```

### 5. Drive Uploader (Upload lên Google Drive)
```bash
cd scripts/drive-uploader

# Long Best AI
node upload.js ../carousel-generator/output/folder-name

# Thach Vu Land
node upload.js ../carousel-generator/output/folder-name --brand thachvuland

# Auto-delete sau khi upload
node upload.js ../carousel-generator/output/folder-name --delete
```

---

## 📊 Review Dashboard

### Start Dashboard Server
```bash
cd scripts/review-dashboard
node server.js

# Mở browser: http://localhost:3000
```

**Chức năng:**
- View pending content
- Edit content trước khi publish
- Generate/regenerate images
- Approve & Publish → auto upload Drive
- Reject content

---

## 📈 Analytics & Reporting

### View Analytics Report
```bash
node scripts/analytics/report.js
```

**Hiển thị:**
- Workflow performance (7 days)
- Recent posts
- Top performing posts
- Daily stats

---

## 🎨 Multi-Format Generators

Tất cả generators ở trong: `scripts/content-generator/formats/`

### 1. Single Image (1080x1080)
```bash
cd scripts/content-generator

# Demo mode
node formats/single-post.js

# Với JSON input
node formats/single-post.js input.json output.png
```

**Input JSON:**
```json
{
  "headline": "5 Cách Sử Dụng Claude AI",
  "bodyText": "Khám phá những mẹo hay...",
  "ctaText": "Xem Ngay",
  "topic": "AI Tips"
}
```

### 2. Quote Card (1080x1350)
```bash
# Demo mode
node formats/quote-card.js

# Với JSON input
node formats/quote-card.js input.json output.png
```

**Input JSON:**
```json
{
  "quoteText": "AI không thay thế con người...",
  "author": "Sam Altman",
  "authorTitle": "CEO OpenAI",
  "topic": "AI Insights"
}
```

### 3. Short-form Cover (1080x1920)
Reels, Shorts, TikTok cover

```bash
# Demo mode
node formats/short-cover.js

# Với JSON input
node formats/short-cover.js input.json output.png
```

**Input JSON:**
```json
{
  "headline": "3 Công Cụ AI Miễn Phí",
  "subheadline": "Số 2 sẽ khiến bạn bất ngờ!",
  "topic": "AI Tools",
  "duration": "45s",
  "showPlay": true
}
```

### 4. Infographic (1080x1920)
Data visualization, stats

```bash
# Demo mode
node formats/infographic.js

# Với JSON input
node formats/infographic.js input.json output.png
```

**Input JSON:**
```json
{
  "title": "Thị Trường AI Việt Nam 2024",
  "subtitle": "Những con số ấn tượng",
  "topic": "AI Market",
  "stats": [
    { "icon": "💰", "value": "$753M", "label": "Quy mô thị trường" },
    { "icon": "📈", "value": "28.6%", "label": "Tốc độ tăng trưởng" }
  ],
  "insight": "Việt Nam là thị trường AI tiềm năng...",
  "source": "Statista, 2024"
}
```

---

## 📑 Google Sheets Management

### Fix Sheet Headers & Formatting
```bash
node scripts/utils/fix-sheets.js
```

**Cập nhật:**
- Reset headers chuẩn
- Font Roboto cho tiếng Việt
- Column widths
- Frozen header
- Brand colors

### Pretty Sheets (Style Only)
```bash
node scripts/utils/pretty-sheets.js
```

---

## 🛠 Utilities

### Typography Config
```bash
cd scripts/carousel-generator

# Xem presets hiện có
node set-preset.js --list

# Đổi preset
node set-preset.js readablePreview
node set-preset.js compact
```

### Logs
```bash
# View combined logs
tail -f logs/combined.log

# View error logs only
tail -f logs/error.log

# Clear logs
rm logs/*.log
```

### Database
```bash
# Analytics database location
# /Users/admin/automation/data/analytics.db

# View with sqlite3
sqlite3 data/analytics.db
> SELECT * FROM workflow_runs;
> .quit
```

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `scripts/drive-uploader/.env` | Drive API, Sheets IDs |
| `scripts/content-generator/brand-config.json` | Brand colors, fonts |
| `scripts/carousel-generator/typography-config.json` | Font presets |

---

## 📝 Quick Examples

### Workflow hoàn chỉnh từ A đến Z
```bash
# 1. Tạo content + images + upload
node scripts/daily-agent.js "ChatGPT vs Claude: So sánh"

# 2. Review trên dashboard
cd scripts/review-dashboard && node server.js
# → Mở http://localhost:3000
# → Edit nếu cần → Approve

# 3. Xem analytics
node scripts/analytics/report.js
```

### Tạo nhiều formats cho cùng 1 topic
```bash
cd scripts/content-generator

# Single Image
node formats/single-post.js topic.json single.png

# Quote Card  
node formats/quote-card.js quote.json quote.png

# Short Cover
node formats/short-cover.js cover.json cover.png

# Infographic
node formats/infographic.js stats.json infographic.png
```

---

## 🆘 Troubleshooting

### Lỗi Google API
```bash
cd scripts/drive-uploader
node setup-auth.js
# → Follow browser authentication
```

### Lỗi Puppeteer
```bash
cd scripts
npm install puppeteer

cd content-generator
npm install puppeteer
```

### Dashboard không chạy
```bash
# Kill process cũ
lsof -ti:3000 | xargs kill -9

# Restart
cd scripts/review-dashboard
node server.js
```

---

## 📘 Facebook Publishing (NEW!)

### Publish Post Manually
```bash
# Publish từ output folder
node scripts/publish-post.js "./carousel-generator/output/folder-name" queennailbern

# Ví dụ
node scripts/publish-post.js "./carousel-generator/output/queennailbern-wir-suchen-nageldesignerin-jetzt-bewerben-singlepost" queennailbern
```

**Output:**
- ✅ Upload images to Facebook
- ✅ Create post with caption
- ✅ Return Facebook post URL

**Brands Configured:**
- `queennailbern` - Queen Nail Bern (Ready ✅)
- `longbest` - Long Best AI (TODO)
- `thachvuland` - Thach Vu Land (TODO)

**Config:** Check `brands/*/brand.json` for Facebook credentials

---

## 📚 Documentation

- **Antigravity Workflow**: `.claude/daily-content-workflow.md` ⭐ NEW
- **Agent Instructions**: `.claude/agents/daily-content-agent.md` ⭐ NEW
- **Flexible Formats**: `docs/PHASE_2_SUMMARY.md` ⭐ NEW
- Brand Guidelines: `context-longbest.md`, `context-thachvuland.md`, `context-queennailbern.md`
- Setup Guide: `docs/error-handling-setup.md`
- Carousel README: `scripts/carousel-generator/README.md`

---

## 🎯 Workflows by Use Case

### Case 0: 🤖 Antigravity Interactive (Easiest!) ⭐ NEW
```
Just say: "tạo bài đăng" or "post to facebook"
→ Answer 3 questions
→ Done! Post published automatically
```

### Case 1: Tạo carousel post thông thường
```bash
node scripts/daily-agent.js "Topic" [--brand thachvuland] [--format auto]
```

### Case 1.1: Single post nhanh (30s) ⭐ NEW
```bash
node scripts/daily-agent.js "Quote ngắn" --format single
```

### Case 1.2: Carousel mini (5 ảnh) ⭐ NEW
```bash
node scripts/daily-agent.js "5 tips hữu ích" --format carousel-mini
```

### Case 2: Tạo quote card nhanh
```bash
cd scripts/content-generator
node formats/quote-card.js
```

### Case 3: Tạo Reels cover
```bash
cd scripts/content-generator
node formats/short-cover.js my-cover.json output.png
```

### Case 4: Xem performance stats
```bash
node scripts/analytics/report.js
```

### Case 5: Review & edit content trước publish
```bash
cd scripts/review-dashboard
node server.js
# → http://localhost:3000
```

---

**Last Updated:** 2026-01-12
**Version:** 3.0.0 - Antigravity Workflow + Flexible Formats + Facebook Auto-Publish

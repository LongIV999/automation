# 📝 SETUP CHECKLIST - Long Best AI Automation

Checklist để setup và verify hệ thống automation.

---

## Phase 1: Setup Môi Trường ✅

### Node.js & Dependencies

- [x] **Node.js installed** (version >= 16)
  ```bash
  node --version
  # Should show: v16.x.x or higher
  ```

- [x] **Install Carousel Generator dependencies**
  ```bash
  cd scripts/carousel-generator
  npm install
  # ✓ puppeteer installed
  # ✓ dotenv installed
  ```

- [x] **Install Drive Uploader dependencies**
  ```bash
  cd ../drive-uploader
  npm install
  # ✓ googleapis installed
  # ✓ dotenv installed
  ```

---

## Phase 2: Google Cloud Setup ✅

### Google Drive API

- [x] **Create Google Cloud Project**
  - Project name: "Long Best AI Automation"
  - Project ID: (Done)

- [x] **Enable Google Drive API**
  - Navigate to: APIs & Services → Library
  - Search: "Google Drive API"
  - Click: Enable

- [x] **Create OAuth 2.0 Credentials**
  - Type: Desktop app
  - Name: "Drive Uploader"
  - Download JSON
  - Rename to: `credentials.json`
  - Move to: `scripts/drive-uploader/credentials.json`

- [x] **Authorize Application**
  ```bash
  cd scripts/drive-uploader
  npm run auth
  # Browser opens → Select Google account
  # Click "Allow"
  # ✓ token.json created
  ```

- [x] **Verify authentication**
  ```bash
  ls -la | grep token.json
  # Should see: token.json
  ```

---

## Phase 3: Google Sheets Setup ✅

### Create Content Calendar Sheet

- [x] **Create new Google Sheet**
  - Go to: https://sheets.google.com
  - Create new
  - Name: "Long Best AI - Content Calendar"
  - Copy Sheet ID from URL

- [x] **Create tabs:**
  - [x] Content_Calendar
  - [x] Posts
  - [x] Archive
  - [ ] Analytics (optional)

- [x] **Setup "Posts" tab columns:**
  ```
  Row 1 (Headers):
  | ID | Caption | Drive_Folder_ID | Status | Post_URL | Published_Date |
  ```

- [x] **Setup dropdowns:**
  - Status column: `Draft, Ready, Published, Failed`
  - Data → Data validation → List from a range

- [x] **Setup formulas (optional):**
  - ID auto-generation: `=IF(B2="","","post_"&TEXT(ROW()-1,"000"))`

### Share with n8n

- [x] **Get n8n service account email**
  - From n8n: Credentials → Google Sheets
  - Copy service account email

- [x] **Share sheet with service account**
  - Click "Share" in Google Sheets
  - Paste service account email
  - Grant "Editor" permission

- [x] **Test n8n connection**
  - In n8n workflow
  - Test "Read Sheet" node
  - ✓ Should successfully read data

---

## Phase 4: n8n Workflow Setup ✅

### Facebook Publisher Workflow

- [x] **Import workflow**
  - Location: `n8n-skill/awesome-n8n-workflows-main/workflows/facebook-longbest-publisher/`
  - File: `facebook-carousel-workflow.json`
  - In n8n: Import from file

- [x] **Setup credentials:**
  - [x] Google Sheets OAuth2
  - [x] Google Drive OAuth2
  - [x] Facebook Graph API (Page Access Token)

- [x] **Configure nodes:**
  - [x] Google Sheets node: Select correct sheet
  - [x] Set tab name: "Posts"
  - [x] Filter: Status = "Ready"

- [x] **Test workflow manually:**
  - Add test row to "Posts" tab
  - Status = "Ready"
  - Execute workflow in n8n
  - ✓ Should post to Facebook

- [x] **Activate schedule trigger:**
  - Set interval: 15 minutes
  - Activate workflow

---

## Phase 5: Test Automation Pipeline ✅

### Test 1: Carousel Generator

- [x] **Navigate to directory:**
  ```bash
  cd /Users/admin/automation/scripts/carousel-generator
  ```

- [x] **Run test generation:**
  ```bash
  node generator.js example-content.json output/test
  ```

- [x] **Verify output:**
  ```bash
  ls output/test/
  # Should see: 01.png, 02.png, ..., 07.png
  ```

- [x] **Check image quality:**
  - Open any PNG file
  - Size: 1080 x 1350px
  - ✓ Readable text
  - ✓ Correct branding

### Test 2: Drive Uploader

- [x] **Upload test images:**
  ```bash
  cd ../drive-uploader
  node upload.js ../carousel-generator/output/test "Test_Upload"
  ```

- [x] **Verify upload:**
  - ✓ Console shows success message
  - ✓ Folder ID displayed: 1-G5qOXeZtYUxiPIbVrhLU9vUWtCZG4-X
  - ✓ Folder Link displayed

- [x] **Check Google Drive:**
  - Open link from console
  - ✓ Folder exists
  - ✓ All images uploaded
  - ✓ Correct naming: 01.png, 02.png...

### Test 3: End-to-End Automation

- [x] **Run full pipeline:**
  ```bash
  cd ../content-automation
  ./create-post.sh ../carousel-generator/example-content.json "E2E_Test"
  ```

- [x] **Verify steps:**
  - ✓ Images generated
  - ✓ Uploaded to Drive
  - ✓ Folder ID displayed: 100pf_utT9OYB5fya5OKDAvqdYHJ-CaEu
  - ✓ Summary shown

- [x] **Check outputs:**
  - Drive folder created
  - All images present
  - Naming correct

---

## Phase 6: Production Setup ✅

### Content Creation

- [x] **Create content directory:**
  ```bash
  mkdir -p scripts/content-automation/content
  ```

- [x] **Create first real content:**
  - Copy template: `example-content.json`
  - Edit for your topic
  - Save as: `content/post_001.json`

### Google Sheets Production

- [ ] **Add first post to "Posts" tab:**
  - ID: `post_001`
  - Caption: Write your Facebook caption
  - Drive_Folder_ID: (leave empty for now)
  - Status: `Draft`

### Create First Post

- [ ] **Run automation:**
  ```bash
  cd scripts/content-automation
  ./create-post.sh content/post_001.json "2026-01-10_First_Post"
  ```

- [ ] **Copy Folder ID from output**

- [ ] **Update Google Sheets:**
  - Paste Folder ID
  - Set Status = "Ready"

- [ ] **Wait for n8n (max 15 min)**
  - Check Facebook page
  - ✓ Post published
  - Check Google Sheets
  - ✓ Status = "Published"
  - ✓ Post_URL filled

---

## Phase 7: Documentation & Training ✅

### Read Documentation

- [ ] **Read QUICKSTART.md**
  - Understand quick workflow
  - Note important commands

- [ ] **Read WORKFLOW_MANAGEMENT.md**
  - Understand system architecture
  - Know troubleshooting steps

- [ ] **Read individual tool docs:**
  - [ ] scripts/carousel-generator/README.md
  - [ ] scripts/drive-uploader/README.md
  - [ ] scripts/content-automation/README.md

### Practice

- [ ] **Create 3 test posts**
  - Different content types
  - Verify each step
  - Note any issues

- [ ] **Monitor results:**
  - Check Facebook analytics
  - Update Archive tab
  - Review performance

---

## Phase 8: Optimization & Scale ✅

### Content Calendar

- [ ] **Fill Content_Calendar tab:**
  - Plan 2 weeks ahead
  - 5-7 topics per week
  - Mix content types

### Automation Refinement

- [ ] **Create content templates:**
  - Tutorial template
  - Listicle template
  - Case study template

- [ ] **Setup monitoring:**
  - Daily check: n8n executions
  - Weekly review: Analytics tab
  - Monthly report: Performance metrics

### Scaling

- [ ] **Batch content creation:**
  - Create 5-10 JSON files
  - Run automation for all
  - Queue in Google Sheets

- [ ] **Time optimization:**
  - Set best posting times
  - Schedule content strategically
  - A/B test hooks

---

---

## Phase 9: Advanced Content & Design Automation 🧪

### AI Research & Persona Design
- [x] **Locate Research Skills**
  - Folder: `skill/research-design-automation/`
  - Verify `prompt-research.md`
- [x] **Implement AI Persona Research**
  - Research topic: "Types of people before AI wave"
  - Generate design concepts
- [x] **Home Buying Anxieties Research**
  - Conduct deep research on first-time home buying
  - Create content series outline

---

## Phase 10: Brand Aesthetics & Consistency 🎨

### Cyber-Hustle Opportunism Integration
- [x] **Define Design Philosophy**
  - File: `design_philosophy.md`
  - Core values: Tech-optimism, Speed, Opportunity
- [x] **Integrate with Generator**
  - Update `carousel-generator` with brand colors
  - Implement glassmorphism & neon accents
- [x] **Verify Consistency**
  - Review all generated images for brand alignment
  - Ensure "Premium" feel in all assets

---

## Phase 11: News Scraping & Analysis 📰

### Site Scraping Setup
- [x] **Configure Scrapers**
  - Targets: `cafef.vn` (Working), `batdongsan.com.vn` (Setup)
- [x] **AI Rewriting Engine**
  - Setup script `publisher.js` with analysis template
- [x] **Automated Publishing**
  - Output saved to `data/articles.json`
  - Ready for website integration

---

## ✅ FINAL VERIFICATION

### System Health Check

- [x] **All dependencies installed** (Drive Uploader)
- [x] **Google Drive authenticated**
- [x] **Google Sheets accessible**
- [x] **n8n workflow active**
- [x] **Brand guidelines integrated**
- [x] **Research workflow operational**

### Ready to Go!

**Current Status:**
🎉 Hệ thống đã vận hành và đang mở rộng thêm các tính năng Premium!

---

## 🆘 Common Issues

### ❌ Issue: npm install fails
**Fix:** Use `--force` or check node version.

### ❌ Issue: "Token not found"
**Fix:** Run `npm run auth` in `drive-uploader`.

---

## 📅 Version History
- **1.1.0** (2026-01-08): Thêm Advanced Automation, Brand Aesthetics & News Scraping phases.
- **1.0.0** (2026-01-07): Initial release.

**Last Updated**: 2026-01-08 16:30
**Status**: ✅ All automation tests (Phase 5) passed successfully.
**Verified By**: Antigravity AI

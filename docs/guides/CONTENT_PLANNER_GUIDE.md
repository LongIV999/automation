# CONTENT PLANNER - HƯỚNG DẪN SỬ DỤNG

## 🎯 Tổng quan

**Content Planner** tự động tạo kế hoạch nội dung dài hạn và update vào Google Sheets tab **ToTable**.

**Tính năng:**
- ✅ Tạo content plan cho 4-12 tuần
- ✅ 22 topic templates đa dạng (AI Tips, Nano Banana, Case Studies, Automation)
- ✅ Tự động schedule theo thứ 2, 4, 6 hàng tuần
- ✅ Research notes chi tiết cho từng topic
- ✅ Phân loại Target Audience và Priority
- ✅ Update trực tiếp vào Google Sheets

---

## 📊 GOOGLE SHEETS STRUCTURE

**Tab ToTable** có các cột:

| Column | Mô tả | Ví dụ |
|--------|-------|-------|
| Date | Ngày post | 2026-01-19 |
| Week | Tuần số mấy | Week 1 |
| Topic | Chủ đề carousel | 5 Mẹo ChatGPT Cho Người Mới Bắt Đầu |
| Content_Type | Loại content | Tutorial Carousel, Case Study, etc. |
| Status | Trạng thái | Planned, In Progress, Done |
| **Priority** | Độ ưu tiên | High, Medium, Low |
| Keywords | SEO keywords | ChatGPT, AI, beginners, tips |
| Target_Audience | Đối tượng mục tiêu | Người mới bắt đầu với AI |
| Research_Notes | Ghi chú research | 7 slides: intro + 5 tips + CTA |
| Assigned_To | Người phụ trách | Long Best AI |
| Post_ID | ID unique | 2026-01-19_5-meo-chatgpt-cho-nguoi... |

---

## 🚀 CÁCH SỬ DỤNG

### 1. Xem cấu trúc tab ToTable

```bash
cd /Users/admin/automation/scripts/drive-uploader

node content-planner.js headers
```

**Output:**
```
📋 Tab ToTable headers: [
  'Date', 'Week', 'Topic', 'Content_Type', 'Status',
  '**Priority**', 'Keywords', 'Target_Audience', ...
]
✅ Headers found: 12
```

---

### 2. Preview content plan trước khi update

```bash
# Preview 4 tuần (mặc định)
node content-planner.js preview

# Preview 8 tuần
node content-planner.js preview 8

# Preview 12 tuần
node content-planner.js preview 12
```

**Output:**
```
📋 Content Plan Preview (8 weeks, 24 posts):

1. 2026-01-19 (Week 1) - Tutorial Carousel
   📌 5 Mẹo ChatGPT Cho Người Mới Bắt Đầu
   🎯 Người mới bắt đầu với AI | Priority: High

2. 2026-01-21 (Week 1) - Tutorial Carousel
   📌 Prompt Engineering 101: Viết Prompt Hiệu Quả
   🎯 Content creators, marketers | Priority: High

...
```

---

### 3. Generate và update vào Google Sheets

```bash
# Generate 4 tuần (12 posts)
node content-planner.js generate

# Generate 8 tuần (24 posts)
node content-planner.js generate 8

# Generate 12 tuần (36 posts)
node content-planner.js generate 12
```

**Output:**
```
🎯 Generating content plan for 8 weeks...
📊 Total posts: 24

📊 Updating ToTable with content plan...
✓ Starting from row: 2
✓ Adding 24 content items...
✅ Content plan updated successfully!
📝 Added 24 items starting from row 2
🔗 Sheet: https://docs.google.com/spreadsheets/d/...
```

---

## 📋 CONTENT DATABASE

Script có sẵn **22 topic templates** trong 4 categories:

### 1. AI Tips & Tutorials (5 topics)
- 5 Mẹo ChatGPT Cho Người Mới Bắt Đầu
- Prompt Engineering 101: Viết Prompt Hiệu Quả
- Tự Động Hóa Email Marketing Với AI
- AI Content Calendar: Lên Kế Hoạch 1 Tháng Trong 10 Phút
- 7 Công Cụ AI Miễn Phí Cho Content Creator

### 2. Nano Banana Content (5 topics)
- Top 7 Nano Banana Prompts Cho Portrait Photography
- Tạo Product Photos Chuyên Nghiệp Với Nano Banana
- Nano Banana vs MidJourney: So Sánh Chi Tiết
- Fashion Photography AI: Xu Hướng 2026
- Behind The Scenes: AI Image Generation Workflow

### 3. Case Studies (4 topics)
- Case Study: Tăng Engagement 300% Với AI Content
- Từ 0 Đến 10K Followers: Chiến Lược AI Content
- ROI Từ AI Automation: Tính Toán Chi Tiết
- E-commerce + AI: Tăng Doanh Thu 200%

### 4. Automation & Tools (4 topics)
- Setup N8N Automation Trong 15 Phút
- Google Sheets + AI: Tự Động Hóa Toàn Bộ
- Facebook Auto-Posting: Complete Workflow
- 5 Sai Lầm Khi Tự Động Hóa Content

### 5. Engagement & Tips (4 topics)
- Carousel Design: 7 Nguyên Tắc Vàng
- Viết Caption Viral: Công Thức 4 Bước
- Best Time To Post: Data-Driven Analysis 2026
- Hashtag Strategy: Tăng Reach 10X

---

## 📅 POSTING SCHEDULE

**Tần suất:** 3 posts/tuần

**Ngày post:**
- Thứ Hai (Monday)
- Thứ Tư (Wednesday)
- Thứ Sáu (Friday)

**Bắt đầu:** Thứ Hai tuần sau (để có thời gian chuẩn bị)

**Ví dụ:** Nếu hôm nay là 2026-01-09 (Thứ 5):
- First post: 2026-01-19 (Thứ 2 tuần sau)
- Posts: Thứ 2, 4, 6 mỗi tuần

---

## ⚙️ CUSTOMIZATION

### Thêm topic mới

Edit file `content-planner.js`:

```javascript
// Thêm vào contentDatabase array
{
  topic: 'Topic mới của bạn',
  contentType: 'Tutorial Carousel',
  keywords: 'keyword1, keyword2, keyword3',
  targetAudience: 'Đối tượng mục tiêu',
  researchNotes: 'Ghi chú về content này',
  priority: 'High'
}
```

### Thay đổi posting schedule

```javascript
// Trong generateContentPlan()
const postDays = [0, 2, 4]; // Monday, Wednesday, Friday

// Đổi thành:
const postDays = [0, 1, 2, 3, 4]; // Thứ 2-6 (5 posts/week)
// Hoặc:
const postDays = [0, 3]; // Thứ 2, 5 (2 posts/week)
```

### Thay đổi số posts mỗi tuần

```javascript
// Hiện tại: 3 posts/week (postDays = [0, 2, 4])

// 5 posts/week:
const postDays = [0, 1, 2, 3, 4];

// 2 posts/week:
const postDays = [0, 3];

// 7 posts/week (mỗi ngày):
const postDays = [0, 1, 2, 3, 4, 5, 6];
```

---

## 🔄 WORKFLOW KHUYẾN NGHỊ

### Bước 1: Generate quarterly plan (12 tuần)

```bash
# Preview trước
node content-planner.js preview 12

# Confirm → Generate
node content-planner.js generate 12
```

**Kết quả:** 36 posts trong 3 tháng tới

### Bước 2: Review trong Google Sheets

Mở sheet: https://docs.google.com/spreadsheets/d/1RAHjxLDULl0aRWHSX0aqUh1dqv7li7zwi0DZA6atQj0

**Tab ToTable** sẽ có:
- 36 rows với đầy đủ thông tin
- Dates đã schedule sẵn
- Research notes cho từng topic
- Priority để biết topic nào làm trước

### Bước 3: Tạo content theo plan

Mỗi tuần, pick 3 topics từ ToTable:

```bash
# Week 1:
cd /Users/admin/automation/scripts/carousel-generator

# Tạo content cho topic 1
node generator.js content/chatgpt-tips.json

# Upload và update Sheets
cd ../drive-uploader
node upload.js ../carousel-generator/output/chatgpt-tips --delete

# Lặp lại cho 2 topics còn lại
```

### Bước 4: Update status trong ToTable

Sau khi tạo xong:
- "Planned" → "In Progress" (đang làm)
- "In Progress" → "Done" (đã post)

---

## 📊 INTEGRATION VỚI WORKFLOW HIỆN TẠI

Content Planner kết hợp với automation hiện có:

```
┌─────────────────────────────────────────────────────────┐
│ 1. CONTENT PLANNER (mới)                                │
│    → Generate content plan cho 8-12 tuần                │
│    → Update vào ToTable tab                             │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 2. CAROUSEL GENERATOR (có sẵn)                          │
│    → Tạo carousel theo topics từ ToTable                │
│    → Output: PNG images                                 │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 3. DRIVE UPLOADER (có sẵn)                              │
│    → Upload images lên Google Drive                     │
│    → Update Post tab với Drive Folder ID                │
│    → Auto-delete local images (optional)                │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 4. N8N AUTO-POSTING (có sẵn)                            │
│    → Đọc Post tab với Status = "Ready"                  │
│    → Post lên Facebook tự động                          │
│    → Update Status = "Done"                             │
└─────────────────────────────────────────────────────────┘
```

---

## 💡 BEST PRACTICES

### ✅ NÊN:

1. **Generate plan 8-12 tuần trước**
   - Có đủ thời gian research
   - Linh động điều chỉnh theo trends

2. **Review và edit topics**
   - Không phải topic nào cũng phù hợp
   - Thay đổi theo feedback audience

3. **Update priority theo data**
   - High priority cho topics có engagement cao
   - Low priority cho experiments

4. **Sync với Post tab**
   - ToTable = long-term plan
   - Post tab = execution queue

5. **Backup plan**
   - Export ToTable ra CSV định kỳ
   - Git commit content files

### ❌ KHÔNG NÊN:

1. **Generate quá nhiều**
   - 12 tuần là đủ
   - Plan quá xa → lỗi thời

2. **Không update status**
   - Dễ quên topics nào đã làm
   - Duplicate content

3. **Copy nguyên văn research notes**
   - Dùng làm inspiration, không phải script
   - Customize cho brand voice

---

## 🧪 TESTING

### Test 1: Preview plan

```bash
node content-planner.js preview 4
```

**Kỳ vọng:** Hiện 12 posts (4 tuần × 3 posts/tuần)

### Test 2: Generate to Sheets

```bash
node content-planner.js generate 1
```

**Kỳ vọng:**
- Tab ToTable có 3 rows mới
- Dates: Thứ 2, 4, 6 tuần sau
- Đầy đủ columns

### Test 3: Check Sheets

Mở: https://docs.google.com/spreadsheets/d/1RAHjxLDULl0aRWHSX0aqUh1dqv7li7zwi0DZA6atQj0

**Verify:**
- Tab ToTable có data
- Post_ID unique
- Research_Notes đầy đủ

---

## 🔍 TROUBLESHOOTING

### Lỗi: "Token not found"

**Nguyên nhân:** Chưa authenticate Google API

**Giải pháp:**
```bash
cd /Users/admin/automation/scripts/drive-uploader
node setup-auth.js
```

### Lỗi: "Tab ToTable not found"

**Nguyên nhân:** Sheet không có tab tên "ToTable"

**Giải pháp:**
- Mở Google Sheets
- Tạo tab mới tên "ToTable"
- Hoặc đổi tên tab hiện có

### Lỗi: "Headers mismatch"

**Nguyên nhân:** Cột trong Sheets không match script

**Giải pháp:**
```bash
# Check headers hiện tại
node content-planner.js headers

# Sửa script hoặc Sheets header cho khớp
```

### Posts không theo đúng ngày

**Nguyên nhân:** Logic tính ngày sai

**Debug:**
```javascript
// Check trong generateContentPlan()
console.log('Next Monday:', nextMonday.toISOString());
console.log('Post date:', postDate.toISOString());
```

---

## 📝 COMMAND REFERENCE

```bash
# Xem usage
node content-planner.js

# Xem headers tab ToTable
node content-planner.js headers

# Preview content plan
node content-planner.js preview [weeks]
node content-planner.js preview 4   # 4 weeks
node content-planner.js preview 8   # 8 weeks
node content-planner.js preview 12  # 12 weeks

# Generate và update Sheets
node content-planner.js generate [weeks]
node content-planner.js generate 4  # 4 weeks (12 posts)
node content-planner.js generate 8  # 8 weeks (24 posts)
node content-planner.js generate 12 # 12 weeks (36 posts)
```

---

## 🎯 EXAMPLE WORKFLOW

### Scenario: Lên plan cho Q1 2026 (12 tuần)

```bash
cd /Users/admin/automation/scripts/drive-uploader

# 1. Preview plan
node content-planner.js preview 12

# Output: 36 posts, check topics

# 2. Generate to Sheets
node content-planner.js generate 12

# Output: ✅ Added 36 items to ToTable

# 3. Open Sheets và review
# https://docs.google.com/spreadsheets/d/1RAHjxLDULl0aRWHSX0aqUh1dqv7li7zwi0DZA6atQj0

# 4. Edit topics nếu cần
# Thay đổi Priority, Keywords, Research Notes

# 5. Bắt đầu tạo content
# Mỗi tuần pick 3 topics có Priority = High
```

---

## 📈 KẾT QUẢ MONG ĐỢI

Sau khi chạy `node content-planner.js generate 8`:

**Google Sheets tab ToTable:**

| Date | Week | Topic | Content_Type | Status | Priority | Keywords |
|------|------|-------|--------------|--------|----------|----------|
| 2026-01-19 | Week 1 | 5 Mẹo ChatGPT... | Tutorial Carousel | In Progress | High | ChatGPT, AI... |
| 2026-01-21 | Week 1 | Prompt Engineering... | Tutorial Carousel | Planned | High | prompt engineering... |
| 2026-01-23 | Week 1 | Tự Động Hóa Email... | Tutorial Carousel | Planned | Medium | email marketing... |
| ... | ... | ... | ... | ... | ... | ... |

**24 rows** với đầy đủ thông tin cho 8 tuần.

---

**Tạo bởi:** Long Best AI
**Ngày:** 2026-01-09
**Script:** `/Users/admin/automation/scripts/drive-uploader/content-planner.js`
**Sheet:** https://docs.google.com/spreadsheets/d/1RAHjxLDULl0aRWHSX0aqUh1dqv7li7zwi0DZA6atQj0

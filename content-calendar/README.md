# Content Calendar System - Long Best AI

## 📅 Tổng Quan

Hệ thống quản lý lịch xuất bản nội dung cho fanpage Long Best AI, tích hợp với n8n automation workflows.

---

## 🎯 Google Sheets Template

### Cấu Trúc Sheet

**URL**: (Tạo Google Sheet và paste link vào đây)

**Tabs Required:**

1. `Content_Calendar` - Lịch content planning
2. `Posts` - Queue bài đăng (cho n8n workflow)
3. `Archive` - Lưu trữ bài đã đăng
4. `Analytics` - Metrics tracking

---

## 📋 Tab 1: Content_Calendar

**Purpose**: Lập kế hoạch nội dung dài hạn

### Columns:

|          Column          | Type     | Description            | Example                                      |
| :-----------------------: | -------- | ---------------------- | -------------------------------------------- |
|      **Date**      | Date     | Ngày dự kiến đăng | 2026-01-15                                   |
|      **Week**      | Formula  | Tuần số (auto)       | W02                                          |
|      **Topic**      | Text     | Chủ đề bài viết   | "10 AI Prompts cho Real Estate"              |
|  **Content_Type**  | Dropdown | Loại content          | Carousel / Single / Video                    |
|     **Status**     | Dropdown | Trạng thái           | Idea / Research / Design / Ready / Published |
|    **Priority**    | Dropdown | Mức ưu tiên         | High / Medium / Low                          |
|    **Keywords**    | Text     | Keywords chính        | "AI, Prompt, ChatGPT"                        |
| **Target_Audience** | Text     | Đối tượng          | "Beginners, Real Estate Agents"              |
|    **Hook_Idea**    | Text     | Ý tưởng mở bài    | "Bạn có biết..."                          |
| **Research_Notes** | Text     | Ghi chú research      | Link tài liệu, data...                     |
|   **Assigned_To**   | Dropdown | Người phụ trách    | Auto / Manual                                |
|     **Post_ID**     | Text     | ID khi ready           | post_001 (link to Posts tab)                 |

### Status Flow:

```
Idea → Research → Design → Ready → Published
```

### Example Rows:

| Date       | Topic                             | Status   | Priority | Keywords               |
| ---------- | --------------------------------- | -------- | -------- | ---------------------- |
| 2026-01-10 | 10 Prompt AI cho Bất Động Sản | Research | High     | AI, Real Estate        |
| 2026-01-12 | Hướng dẫn Nano Banana Pro      | Design   | Medium   | Nano Banana, Image Gen |
| 2026-01-15 | Tránh Sai Lầm khi dùng ChatGPT | Idea     | Low      | ChatGPT, Tips          |

---

## 📤 Tab 2: Posts

**Purpose**: Queue bài sẵn sàng đăng (n8n workflow sẽ đọc tab này)

### Columns:

| Column                    | Type     | Description                              | Example                      | Required |
| ------------------------- | -------- | ---------------------------------------- | ---------------------------- | -------- |
| **ID**              | Text     | Unique post ID                           | post_001                     | ✅       |
| **Caption**         | Text     | Nội dung text của post                 | "10 prompt AI giúp bạn..." | ✅       |
| **Drive_Folder_ID** | Text     | Google Drive folder ID chứa ảnh        | 1AbCdEfGhIjK...              | ✅       |
| **Status**          | Dropdown | Ready / Published / Failed               | Ready                        | ✅       |
| **Post_URL**        | Text     | Link bài đã đăng (auto-fill by n8n) | https://fb.me/...            | Auto     |
| **Published_Date**  | Date     | Ngày đăng thực tế (auto-fill)       | 2026-01-08 14:30             | Auto     |
| **Scheduled_Time**  | DateTime | Thời gian muốn đăng                  | 2026-01-10 09:00             | Optional |
| **Topic_Link**      | Formula  | Link to Content_Calendar                 | =HYPERLINK(...)              | Auto     |

### Important Notes:

**Status Values:**

- `Ready` - n8n sẽ pick up và đăng
- `Published` - Đã đăng thành công (n8n auto update)
- `Failed` - Đăng lỗi (check logs)
- `Draft` - Chưa sẵn sàng (n8n skip)

**Caption Format:**

```
[Hook line - 1 câu hấp dẫn]

[Main content - 2-3 đoạn]

[CTA]
✨ Comment "AI" để nhận template miễn phí!

#LongBestAI #AI #BatDongSan #ChatGPT
```

**Drive_Folder_ID** - Cách lấy:

1. Mở Google Drive folder chứa ảnh
2. URL: `https://drive.google.com/drive/folders/1AbCdEfGhIjK...`
3. Copy phần sau `/folders/` → Paste vào sheet

---

## 📦 Tab 3: Archive

**Purpose**: Lưu trữ bài đã đăng + metrics

### Columns:

| Column                      | Description                          |
| --------------------------- | ------------------------------------ |
| **Post_ID**           | Link to original post                |
| **Published_Date**    | Ngày đăng                         |
| **Topic**             | Chủ đề                            |
| **Post_URL**          | Facebook link                        |
| **Views**             | Lượt xem (update manual hoặc API) |
| **Reactions**         | Tổng reactions                      |
| **Comments**          | Số comment                          |
| **Shares**            | Số share                            |
| **CTR**               | Click-through rate                   |
| **Performance_Score** | ⭐⭐⭐⭐⭐ (1-5 sao)                 |
| **Notes**             | Ghi chú phân tích                 |

### Performance Scoring:

```
⭐⭐⭐⭐⭐ (5 sao): Viral hit (>10K reach)
⭐⭐⭐⭐ (4 sao): Great (5K-10K reach)
⭐⭐⭐ (3 sao): Good (2K-5K reach)
⭐⭐ (2 sao): Average (500-2K reach)
⭐ (1 sao): Low (<500 reach)
```

---

## 📊 Tab 4: Analytics

**Purpose**: Dashboard metrics

### Section 1: Overview Stats

| Metric                 | Formula                       | Description                         |
| ---------------------- | ----------------------------- | ----------------------------------- |
| Total Posts This Month | `COUNTIF(Archive!B:B, ...)` | Tổng bài đăng tháng này       |
| Avg Views per Post     | `AVERAGE(Archive!E:E)`      | Views trung bình                   |
| Total Engagement       | `SUM(Archive!F:H)`          | Tổng reactions + comments + shares |
| Top Performing Topic   | `INDEX/MATCH(...)`          | Topic có performance cao nhất     |

### Section 2: Content Type Performance

| Content Type | Posts Count   | Avg Views       | Avg Engagement  |
| ------------ | ------------- | --------------- | --------------- |
| Carousel     | =COUNTIF(...) | =AVERAGEIF(...) | =AVERAGEIF(...) |
| Single Image |               |                 |                 |
| Video        |               |                 |                 |

### Section 3: Weekly Trends

Chart: Views over time (line chart)

---

## 🔄 Workflow Integration

### n8n Facebook Publisher Workflow

**How it works:**

1. n8n runs every 15 minutes (schedule trigger)
2. Reads `Posts` tab → filter `Status = "Ready"`
3. For each ready post:
   - Get `Drive_Folder_ID`
   - Download all images from folder
   - Upload to Facebook as carousel
   - Post with `Caption`
4. Update sheet:
   - `Status` → `"Published"`
   - `Post_URL` → Facebook post link
   - `Published_Date` → Current timestamp
5. Copy row to `Archive` tab

---

## 🎨 Content Creation Workflow

### Manual Process (Current)

```
Step 1: Planning
- Open Content_Calendar tab
- Add new row with topic idea
- Set Status = "Idea"

Step 2: Research
- Research topic (use content-research-writer skill)
- Add notes to Research_Notes column
- Update Status = "Research"

Step 3: Writing
- Write caption following format
- Add to Posts tab
- Set Status = "Draft"

Step 4: Design
- Open design_carousel.html
- Fill content from caption
- Export slides as PNG
- Upload to Google Drive
- Name images: 01.png, 02.png, 03.png...

Step 5: Prepare
- Copy Drive folder ID
- Paste to Posts tab
- Update Status = "Ready"

Step 6: Auto-publish
- n8n workflow picks up
- Posts to Facebook
- Updates sheet automatically
```

### Automated Process (Target) 🎯

```
Step 1: Input Idea
- Add topic to Content_Calendar
- Fill: Topic, Keywords, Target_Audience
- Set Status = "Idea"

Step 2: Auto Research ✨ NEW
- Trigger: Status → "Research"
- AI agent researches topic
- Auto-fills Caption + Research_Notes
- Updates Status → "Design"

Step 3: Auto Design ✨ NEW
- Trigger: Status → "Design"
- Carousel generator reads Caption
- Auto-generates 7 slides
- Exports PNG files
- Updates Status → "Uploading"

Step 4: Auto Upload ✨ NEW
- Creates Drive folder (named: YYYY-MM-DD_Topic)
- Uploads: 01.png, 02.png... 07.png
- Copies folder ID to Posts tab
- Updates Status → "Ready"

Step 5: Auto Post (EXISTING ✅)
- n8n workflow posts to Facebook
- Updates Archive
- Sends notification
```

---

## 🛠 Setup Instructions

### 1. Create Google Sheet

```
1. Go to: https://sheets.google.com
2. Create new sheet: "Long Best AI - Content Calendar"
3. Create 4 tabs: Content_Calendar, Posts, Archive, Analytics
4. Copy column headers from this doc
5. Format cells:
   - Dates: Format → Number → Date
   - Dropdowns: Data → Data validation
```

### 2. Setup Dropdowns

**Status (Content_Calendar):**

```
Idea, Research, Design, Ready, Published
```

**Status (Posts):**

```
Draft, Ready, Published, Failed
```

**Priority:**

```
High, Medium, Low
```

**Content_Type:**

```
Carousel, Single, Video, Text
```

### 3. Add Formulas

**Week Number (Content_Calendar B column):**

```
=IF(A2="","","W"&WEEKNUM(A2))
```

**Post_ID Auto-generate (Posts A column):**

```
=IF(B2="","","post_"&TEXT(ROW()-1,"000"))
```

### 4. Conditional Formatting

**Color-code Status:**

- `Idea` → Light gray
- `Research` → Yellow
- `Design` → Orange
- `Ready` → Light green
- `Published` → Dark green

**Apply to**: Content_Calendar Status column

### 5. Share with n8n

```
1. Click "Share" button
2. Add service account email (from Google Cloud Console)
3. Grant "Editor" access
4. Copy Sheet ID from URL
5. Paste into n8n Google Sheets node
```

---

## 📝 Content Templates

### Template 1: Tutorial Carousel

**Topic**: "Hướng dẫn tạo ảnh đẹp với AI"

**Caption Structure:**

```
🎨 Bạn có biết tạo ảnh đẹp như photographer chuyên nghiệp chỉ với AI?

Đây là bí kíp mình dùng mỗi ngày với Nano Banana Pro:

✅ Bước 1: Viết prompt theo công thức [Chủ thể + Hành động + Ánh sáng + Góc máy]
✅ Bước 2: Dùng tính năng Relight để chỉnh ánh sáng
✅ Bước 3: Upscale lên 4K để có độ nét cực cao

Kết quả? Ảnh đẹp đến mức bạn bè hỏi "Chụp bằng máy gì?" 😅

Swipe để xem chi tiết từng bước! 👉

💬 Comment "BANANA" để nhận bộ 50 prompt mẫu miễn phí!

#LongBestAI #AIPhotography #NanoBanana #AITools
```

### Template 2: Listicle

**Topic**: "10 Prompt AI hay nhất"

**Caption Structure:**

```
🔥 10 PROMPT AI giúp bạn tiết kiệm 5 tiếng mỗi tuần!

Mình đã test hơn 200 prompts, đây là 10 cái CHẤT nhất:

1️⃣ [Prompt 1 name]
2️⃣ [Prompt 2 name]
...
🔟 [Prompt 10 name]

Swipe để xem chi tiết và ví dụ cụ thể!

Prompt nào bạn thích nhất? Comment số thứ tự bên dưới! 👇

#AI #Productivity #ChatGPT #LongBestAI
```

### Template 3: Case Study

**Topic**: "Khách hàng tăng doanh số 300%"

**Caption Structure:**

```
💰 Case Study: Anh Minh tăng doanh số 300% nhờ AI

"Trước đây mình mất 2 ngày để tạo content cho 20 BĐS.
Giờ chỉ mất 2 tiếng!" - Anh Minh, Môi Giới BĐS

Bí quyết của anh:
→ Dùng AI tạo mô tả property tự động
→ Generate ảnh render nội thất trong 5 phút
→ Tạo video tour ảo không cần quay phim

Swipe để xem quy trình chi tiết! 📊

Bạn cũng làm BĐS? Tag đồng nghiệp để cùng học! 🏡

#BatDongSan #AI #RealEstate #LongBestAI
```

---

## 🎯 Content Pillar Strategy

### Phân bổ nội dung (theo tuần)

**Monday**: Tutorial / How-to (Carousel)
**Tuesday**: Quick Tips (Single image + tip)
**Wednesday**: Tool Review (Carousel)
**Thursday**: Case Study / Success Story
**Friday**: Q&A / Community Engagement
**Saturday**: Trending Topic / News
**Sunday**: Rest / Behind-the-scenes

---

## 📈 KPIs to Track

### Content KPIs

- [ ] 5 posts per week minimum
- [ ] Average engagement rate: >3%
- [ ] Content backlog: 2 weeks ahead
- [ ] Response time to comments: <2 hours

### Automation KPIs

- [ ] Time saved per post: 2 hours → 15 minutes
- [ ] Error rate: <5%
- [ ] Automation success rate: >95%

---

## 🆘 Troubleshooting

### Problem: n8n không đọc được sheet

**Fix:**

1. Check sheet sharing permissions
2. Verify sheet name = `Posts`
3. Check column names match exactly

### Problem: Status không tự động update

**Fix:**

1. Check n8n workflow "Update Sheet" node
2. Verify credentials valid
3. Test manually in n8n

---

**Last Updated**: 2026-01-08
**Version**: 1.0

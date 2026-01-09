# 📖 HƯỚNG DẪN CHI TIẾT - Hệ Thống Tự Động Hóa

**Tài liệu này giải thích từng bước trong quy trình tạo ảnh và post lên Facebook**

---

## 🔄 TỔNG QUAN QUY TRÌNH

```
┌─────────────────────────────────────────────────────────────┐
│                    QUY TRÌNH HOÀN CHỈNH                     │
└─────────────────────────────────────────────────────────────┘

1️⃣ TẠO FILE JSON            (5 phút - Thủ công)
   ↓
2️⃣ CHẠY SCRIPT              (30 giây - Tự động)
   ├─ Generate 7 ảnh carousel
   └─ Upload lên Google Drive
   ↓
3️⃣ CẬP NHẬT GOOGLE SHEETS   (2 phút - Thủ công)
   ├─ Paste Folder ID
   ├─ Viết caption
   └─ Set Status = "Ready"
   ↓
4️⃣ N8N AUTO-POST FACEBOOK   (Tự động - Mỗi 15 phút)
   ├─ Đọc từ Google Sheets
   ├─ Download ảnh từ Drive
   ├─ Post carousel lên Facebook
   └─ Update Status = "Published"

TỔNG THỜI GIAN: ~7 phút (so với 55 phút trước đây)
```

---

## 📝 BƯỚC 1: TẠO FILE JSON CONTENT

### Cấu Trúc File JSON

File JSON chứa nội dung cho 7 slides của carousel. Mỗi slide có thể là 1 trong 5 loại:

```json
{
  "title": "Tiêu đề chính của carousel",
  "topic": "Chủ đề",
  "brand": "Long Best AI",
  "slides": [...]
}
```

### 5 Loại Slides

#### 1. **Type: "title"** - Slide Tiêu Đề
```json
{
  "type": "title",
  "headline": "10 Prompt AI Giúp Môi Giới BĐS Tiết Kiệm 5 Tiếng/Tuần",
  "subheadline": "Từ viết mô tả đến tạo ảnh render - tất cả chỉ với AI"
}
```
**Hiển thị:**
- Font size lớn (72px), in hoa, bold
- Căn giữa màn hình
- Background: Dark gradient
- Dùng làm slide đầu tiên để hook người xem

---

#### 2. **Type: "content"** - Slide Nội Dung Chính
```json
{
  "type": "content",
  "headline": "Tại Sao Bạn Cần Dùng AI?",
  "content": "Thời gian là vàng bạc...\n\nAI giúp bạn làm tất cả nhanh gấp 10 lần!"
}
```
**Hiển thị:**
- Headline: 56px, màu cam (#d97757)
- Content: 24px, font serif (Lora)
- Hỗ trợ xuống dòng với `\n`

---

#### 3. **Type: "list"** - Slide Danh Sách
```json
{
  "type": "list",
  "headline": "8 Prompt Khác Bạn Sẽ Nhận",
  "content": [
    "Trả lời tin nhắn khách hàng tự động",
    "Tạo caption Facebook hấp dẫn",
    "Phân tích thị trường địa phương"
  ]
}
```
**Hiển thị:**
- Mỗi item có checkmark (✓) màu xanh
- Font size 26px
- Spacing thoải mái giữa các item

---

#### 4. **Type: "prompt"** - Slide Prompt AI
```json
{
  "type": "prompt",
  "headline": "Prompt #1: Viết Mô Tả Property",
  "subheadline": "Copy prompt này vào ChatGPT:",
  "content": "Viết mô tả bất động sản hấp dẫn cho:\n- Loại hình: [Căn hộ]\n- Diện tích: [80m2]..."
}
```
**Hiển thị:**
- Prompt box: Background đen với border cam
- Font: Monospace (Courier New) - giống terminal
- Dễ copy-paste

---

#### 5. **Type: "cta"** - Slide Call-to-Action
```json
{
  "type": "cta",
  "headline": "Nhận Ngay 10 Prompts Đầy Đủ!",
  "content": "💬 Comment \"BĐS\" bên dưới để nhận file PDF miễn phí"
}
```
**Hiển thị:**
- Background: Gradient cam → xanh
- Text màu đen (dễ đọc trên background sáng)
- Căn giữa, nổi bật

---

### Template Mẫu Hoàn Chỉnh

Lưu file này vào: `scripts/content-automation/content/my-post.json`

```json
{
  "title": "10 Prompt AI Hay Nhất 2026",
  "topic": "AI Prompts",
  "brand": "Long Best AI",
  "slides": [
    {
      "type": "title",
      "headline": "10 Prompt AI Bạn Cần Biết Năm 2026",
      "subheadline": "Tiết kiệm 5 giờ mỗi tuần chỉ với những prompt này"
    },
    {
      "type": "content",
      "headline": "Vấn Đề Bạn Đang Gặp",
      "content": "Bạn mất quá nhiều thời gian cho những việc lặp đi lặp lại:\n\n• Viết email\n• Tạo content\n• Nghiên cứu thị trường\n\nAI có thể làm tất cả!"
    },
    {
      "type": "prompt",
      "headline": "Prompt #1: Email Chuyên Nghiệp",
      "subheadline": "Copy vào ChatGPT:",
      "content": "Viết email chuyên nghiệp về [chủ đề].\nTông giọng: [thân thiện/chính thức]\nĐộ dài: [ngắn gọn/chi tiết]\nKết thúc với CTA rõ ràng."
    },
    {
      "type": "prompt",
      "headline": "Prompt #2: Research Nhanh",
      "subheadline": "Nghiên cứu trong 60 giây:",
      "content": "Phân tích xu hướng [ngành] năm 2026.\nBao gồm:\n• Top 3 xu hướng\n• Cơ hội kinh doanh\n• Rủi ro cần lưu ý\nNguồn: Dữ liệu mới nhất"
    },
    {
      "type": "list",
      "headline": "6 Prompt Nữa Trong Series",
      "content": [
        "Tạo content viral cho social media",
        "Viết script video YouTube",
        "Phân tích đối thủ cạnh tranh",
        "Brainstorm ý tưởng sản phẩm mới",
        "Tối ưu SEO cho website",
        "Tạo chatbot tự động trả lời"
      ]
    },
    {
      "type": "content",
      "headline": "Case Study Thực Tế",
      "content": "Chị Hoa (Digital Marketer) chia sẻ:\n\n\"Trước đây tôi mất 3 ngày tạo content plan. Giờ chỉ cần 2 tiếng nhờ AI. Tôi có thời gian sáng tạo nhiều hơn!\""
    },
    {
      "type": "cta",
      "headline": "Download Ngay 10 Prompts!",
      "content": "💬 Comment \"AI\" để nhận file PDF đầy đủ + 20 prompts bonus"
    }
  ]
}
```

---

## 🎨 BƯỚC 2: GENERATOR.JS - TẠO ẢNH TỰ ĐỘNG

### Cách Hoạt Động

File `scripts/carousel-generator/generator.js` sử dụng **Puppeteer** (headless Chrome) để:

1. **Đọc file JSON** bạn vừa tạo
2. **Tạo HTML động** cho từng slide với styling đẹp
3. **Render HTML thành PNG** với độ phân giải cao (1080x1350)
4. **Lưu 7 file ảnh**: `01.png`, `02.png`, ..., `07.png`

### Chi Tiết Kỹ Thuật

#### Config Quan Trọng
```javascript
const CONFIG = {
  slideWidth: 1080,      // Chiều rộng Facebook carousel
  slideHeight: 1350,     // Tỷ lệ 4:5 tối ưu cho FB
  deviceScaleFactor: 2   // Retina quality (2x resolution)
};
```

**Kết quả:** Ảnh có độ phân giải thực tế **2160x2700px** (siêu nét!)

---

#### Quy Trình Render

```javascript
for (let i = 0; i < contentData.slides.length; i++) {
  // 1. Tạo HTML cho slide này
  const slideHTML = createSlideHTML(contentData.slides[i], i + 1);

  // 2. Load HTML vào browser
  await page.setContent(slideHTML);

  // 3. Đợi fonts load (Google Fonts)
  await page.evaluateHandle('document.fonts.ready');

  // 4. Screenshot
  await page.screenshot({
    path: `${slideNum}.png`,
    type: 'png'
  });
}
```

---

#### HTML Template Động

Mỗi slide được render với:

**1. Base Layout:**
```html
<div class="slide">
  <div class="glass-overlay"></div>        <!-- Border mờ trang trí -->
  <div class="slide-number">1/7</div>      <!-- Số thứ tự -->

  <!-- Nội dung slide ở đây -->

  <div class="brand-corner">Long Best AI</div>  <!-- Watermark -->
</div>
```

**2. CSS Variables (Brand Colors):**
```css
:root {
  --bg-dark: #141413;         /* Nền tối chính */
  --accent-orange: #d97757;   /* Cam - CTA, highlights */
  --accent-green: #788c5d;    /* Xanh - Brand corner */
  --text-main: #faf9f5;       /* Text sáng */
}
```

**3. Typography:**
- **Headlines:** Poppins (Sans-serif, Bold, Uppercase)
- **Body text:** Lora (Serif, Editorial style)
- **Prompts:** Courier New (Monospace)

---

### Ví Dụ Render

**Input JSON:**
```json
{
  "type": "prompt",
  "headline": "Prompt #1: Email Pro",
  "subheadline": "Copy vào ChatGPT:",
  "content": "Viết email về [topic]..."
}
```

**Output HTML:**
```html
<div class="slide">
  <h2>Prompt #1: Email Pro</h2>              <!-- Orange, 36px -->
  <p class="subheadline">Copy vào ChatGPT:</p> <!-- Gray, 28px -->
  <div class="prompt-box">                   <!-- Dark bg, orange border -->
    Viết email về [topic]...
  </div>
</div>
```

**Screenshot:** File `03.png` với layout hoàn chỉnh!

---

## ☁️ BƯỚC 3: UPLOAD.JS - TẢI LÊN GOOGLE DRIVE

### Google Drive API Flow

```
┌──────────────────────────────────────────────────────┐
│          GOOGLE DRIVE UPLOAD WORKFLOW                │
└──────────────────────────────────────────────────────┘

1. AUTHORIZATION
   ├─ Đọc credentials.json (OAuth Client ID/Secret)
   ├─ Đọc token.json (Access token đã authorize)
   └─ Tạo authenticated client

2. TẠO FOLDER
   ├─ Tên folder: "YYYY-MM-DD_Topic_Name"
   ├─ Parent folder: [Optional - từ .env]
   └─ Return: Folder ID + WebViewLink

3. UPLOAD ẢNH
   ├─ Đọc tất cả file .png trong output/
   ├─ Sort theo tên (01, 02, 03...)
   └─ Upload tuần tự vào folder

4. RETURN RESULT
   └─ { folderId, folderLink, uploadedCount }
```

---

### Chi Tiết Code

#### 1. Authorization (OAuth2)
```javascript
async function authorize() {
  // Đọc credentials từ Google Cloud Console
  const credentials = JSON.parse(
    await fs.readFile('./credentials.json')
  );

  // Tạo OAuth2 client
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Load access token (đã authorize trước đó)
  const token = JSON.parse(await fs.readFile('./token.json'));
  oAuth2Client.setCredentials(token);

  return oAuth2Client;
}
```

**Setup lần đầu:**
```bash
cd scripts/drive-uploader
npm run auth
# Browser mở → Đăng nhập Google → Cho phép access
# → token.json được tạo tự động
```

---

#### 2. Tạo Folder
```javascript
async function createFolder(auth, folderName, parentFolderId) {
  const drive = google.drive({ version: 'v3', auth });

  const fileMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: parentFolderId ? [parentFolderId] : []
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    fields: 'id, name, webViewLink'
  });

  return response.data;
  // { id: "1AbCdEf...", name: "2026-01-10_AI_Prompts", ... }
}
```

**Folder Format:** `2026-01-10_AI_Prompts`
- Prefix: Ngày tháng (YYYY-MM-DD)
- Suffix: Tên topic

---

#### 3. Upload File
```javascript
async function uploadFile(auth, filePath, folderId, fileName) {
  const drive = google.drive({ version: 'v3', auth });

  // Metadata
  const fileMetadata = {
    name: fileName,     // "01.png"
    parents: [folderId] // Folder ID từ bước trước
  };

  // File content
  const media = {
    mimeType: 'image/png',
    body: fs.createReadStream(filePath)
  };

  // Upload
  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id, name, webViewLink'
  });

  return response.data;
}
```

---

#### 4. Numbered Naming

Ảnh được upload với tên **có số thứ tự**:

```javascript
const imageFiles = files
  .filter(f => f.match(/\.(png|jpg|jpeg)$/i))
  .sort(); // Sort alphabetically: 01.png, 02.png, ...

for (let i = 0; i < imageFiles.length; i++) {
  const fileName = imageFiles[i]; // "01.png"
  await uploadFile(auth, filePath, folderId, fileName);
}
```

**Tại sao quan trọng?**
- n8n workflow cần ảnh theo thứ tự 01→07
- Facebook carousel hiển thị đúng thứ tự

---

### Output Cuối Cùng

```bash
✓ Upload completed successfully

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Folder Name: 2026-01-10_AI_Prompts
Folder ID:   1AbCdEfGhIjKlMnOp12345
Folder Link: https://drive.google.com/drive/folders/1AbC...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Paste Folder ID vào Google Sheets!
```

**Folder ID** này là key để n8n download ảnh về!

---

## 🚀 BƯỚC 4: CREATE-POST.SH - SCRIPT TỔNG HỢP

### Bash Script Orchestrator

File `create-post.sh` là **main script** kết nối tất cả các bước:

```bash
#!/bin/bash

# Input: content.json, folder-name (optional)
# Output: Folder ID để paste vào Sheets

# STEP 1: Generate Images
cd scripts/carousel-generator
node generator.js $CONTENT_FILE $OUTPUT_DIR

# STEP 2: Upload to Drive
cd scripts/drive-uploader
node upload.js $OUTPUT_DIR $FOLDER_NAME

# STEP 3: Display Summary
echo "Folder ID: $FOLDER_ID"
echo "→ Paste vào Google Sheets!"

# Auto-copy to clipboard (macOS)
echo $FOLDER_ID | pbcopy
```

---

### Cách Sử Dụng

```bash
cd /Users/admin/automation/scripts/content-automation

# Cách 1: Tự động đặt tên folder
./create-post.sh content/my-post.json

# Cách 2: Custom folder name
./create-post.sh content/my-post.json "2026-01-15_New_Topic"
```

---

### Xử Lý Lỗi

Script có built-in error handling:

```bash
# Check file exists
if [ ! -f "$CONTENT_FILE" ]; then
  echo "❌ Content file not found!"
  exit 1
fi

# Check Drive authentication
if [ ! -f "token.json" ]; then
  echo "❌ Google Drive not authenticated!"
  echo "→ Run: npm run auth"
  exit 1
fi

# Check each step success
if [ $? -eq 0 ]; then
  echo "✓ Success"
else
  echo "✗ Failed"
  exit 1
fi
```

---

## 📊 BƯỚC 5: GOOGLE SHEETS - CONTENT MANAGEMENT

### Cấu Trúc Google Sheets

**Sheet: "Posts"**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| **ID** | Text | Unique post ID | `post_001` |
| **Caption** | Text | Facebook post caption | `10 prompt AI hay nhất...` |
| **Drive_Folder_ID** | Text | Folder ID từ script | `1AbCdEfGhIj...` |
| **Status** | Dropdown | `Ready` / `Published` / `Error` | `Ready` |
| **Post_URL** | Text | Auto-fill bởi n8n | `https://facebook.com/...` |
| **Published_Date** | Date | Auto-fill bởi n8n | `2026-01-10` |

---

### Workflow Trong Sheets

```
1. Tạo Row Mới
   ├─ ID: post_001
   ├─ Caption: Viết caption hấp dẫn (hook + CTA)
   ├─ Drive_Folder_ID: [PASTE FOLDER ID TỪ SCRIPT]
   └─ Status: Ready

2. Đợi n8n Workflow (Auto)
   └─ Chạy mỗi 15 phút

3. Sau Khi Publish
   ├─ Status: Ready → Published
   ├─ Post_URL: [Link bài đăng FB]
   └─ Published_Date: [Timestamp]
```

---

### Tips Viết Caption

**Công thức caption hiệu quả:**

```
1. HOOK (2-3 dòng đầu)
   → "99% người Việt chưa biết..."
   → "10 prompt AI giúp bạn..."

2. VALUE PREVIEW
   → "Bao gồm: prompt viết email, tạo content, research..."

3. SOCIAL PROOF (Optional)
   → "Anh Minh đã tăng 300% doanh số nhờ điều này"

4. CTA
   → "💬 Comment 'AI' để nhận file PDF"
```

**Ví dụ:**
```
🔥 10 Prompt AI Giúp Bạn Tiết Kiệm 5 Giờ/Tuần

Bạn có biết AI có thể viết email, tạo content,
research thị trường chỉ trong vài giây?

Trong carousel này, bạn sẽ học:
✓ Prompt viết email chuyên nghiệp
✓ Prompt research nhanh
✓ Prompt tạo content viral
+ 7 prompt khác cực kỳ hữu ích!

💬 Comment "AI" bên dưới để nhận file PDF
đầy đủ 10 prompts + 20 bonus prompts!

#AI #Productivity #ChatGPT #LongBestAI
```

---

## 🤖 BƯỚC 6: N8N WORKFLOW - AUTO-POST FACEBOOK

### Workflow Overview

File: `n8n-skill/awesome-n8n-workflows-main/workflows/facebook-longbest-publisher/`

```
┌─────────────────────────────────────────────┐
│         N8N FACEBOOK PUBLISHER              │
└─────────────────────────────────────────────┘

TRIGGER: Schedule (Every 15 minutes)
   ↓
NODE 1: Google Sheets - Read
   ├─ Filter: Status = "Ready"
   ├─ Limit: 1 post per run
   └─ Return: ID, Caption, Drive_Folder_ID
   ↓
NODE 2: Google Drive - List Files
   ├─ Input: Drive_Folder_ID
   ├─ Filter: .png files
   └─ Sort: By name (01.png → 07.png)
   ↓
NODE 3: Loop: Download Each Image
   ├─ Google Drive - Download File
   └─ Store in /tmp/ hoặc memory
   ↓
NODE 4: Facebook Graph API - Post Carousel
   ├─ Method: POST /me/photos
   ├─ Upload ảnh 1-6: published=false
   ├─ Upload ảnh 7: published=true + caption
   └─ Return: Post ID + URL
   ↓
NODE 5: Google Sheets - Update Row
   ├─ Status: "Ready" → "Published"
   ├─ Post_URL: [Facebook link]
   └─ Published_Date: NOW()
```

---

### Chi Tiết Các Node

#### NODE 1: Schedule Trigger
```javascript
{
  "cron": "*/15 * * * *",  // Every 15 minutes
  "timezone": "Asia/Ho_Chi_Minh"
}
```

---

#### NODE 2: Google Sheets - Read
```javascript
{
  "operation": "read",
  "sheetName": "Posts",
  "range": "A:F",
  "filters": [
    { "column": "Status", "value": "Ready" }
  ],
  "limit": 1  // Chỉ lấy 1 post mỗi lần
}
```

**Output:**
```json
{
  "ID": "post_001",
  "Caption": "10 prompt AI...",
  "Drive_Folder_ID": "1AbCdEf...",
  "Status": "Ready"
}
```

---

#### NODE 3: Google Drive - List Files
```javascript
{
  "operation": "list",
  "folderId": "{{ $json.Drive_Folder_ID }}",
  "fileTypes": ["image/png"],
  "sort": { "field": "name", "order": "asc" }
}
```

**Output:**
```json
[
  { "id": "fileId1", "name": "01.png" },
  { "id": "fileId2", "name": "02.png" },
  ...
  { "id": "fileId7", "name": "07.png" }
]
```

---

#### NODE 4: Loop Download Images
```javascript
// For each file in list
for (let i = 0; i < files.length; i++) {
  const file = await drive.files.get({
    fileId: files[i].id,
    alt: 'media'
  });

  // Store image buffer
  images.push({
    name: files[i].name,
    buffer: file.data
  });
}
```

---

#### NODE 5: Facebook Post Carousel

**Facebook API Carousel Flow:**

```javascript
// Step 1: Upload images 1-6 (unpublished)
const photoIds = [];
for (let i = 0; i < 6; i++) {
  const response = await fb.post('/me/photos', {
    source: images[i].buffer,
    published: false  // Không publish ngay
  });
  photoIds.push(response.id);
}

// Step 2: Upload ảnh 7 + publish tất cả
const finalPost = await fb.post('/me/photos', {
  source: images[6].buffer,
  published: true,
  message: caption,  // Caption từ Google Sheets
  attached_media: photoIds.map(id => ({ media_fbid: id }))
});

return {
  postId: finalPost.id,
  postUrl: `https://facebook.com/${finalPost.id}`
};
```

---

#### NODE 6: Update Google Sheets
```javascript
{
  "operation": "update",
  "sheetName": "Posts",
  "range": `A${rowIndex}:F${rowIndex}`,
  "values": [
    [
      "post_001",
      "{{ $json.Caption }}",
      "{{ $json.Drive_Folder_ID }}",
      "Published",  // ✅ Update status
      "{{ $node.FacebookPost.json.postUrl }}",
      "{{ new Date().toISOString() }}"
    ]
  ]
}
```

---

## ⚙️ SETUP CREDENTIALS

### 1. Google Drive API

**Bước 1: Tạo Project**
1. https://console.cloud.google.com
2. New Project → "Long Best AI Automation"
3. Enable APIs:
   - Google Drive API
   - Google Sheets API

**Bước 2: OAuth Credentials**
1. APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Application type: **Desktop app**
4. Download JSON → `credentials.json`

**Bước 3: Authorize**
```bash
cd scripts/drive-uploader
npm run auth
# Browser mở → Đăng nhập → Cho phép access
# → token.json được tạo
```

---

### 2. Facebook Graph API

**Bước 1: Tạo App**
1. https://developers.facebook.com
2. Create App → Business
3. Add Product: **Facebook Login**

**Bước 2: Generate Page Token**
1. Graph API Explorer: https://developers.facebook.com/tools/explorer
2. Select your app
3. Select your page
4. Permissions cần có:
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_manage_posts`
5. Generate Access Token
6. **Extend token to Never Expire:**
   ```
   https://developers.facebook.com/tools/debug/accesstoken/
   → Paste token → Extend
   ```

**Bước 3: Add to n8n**
1. n8n → Credentials → Facebook Graph API
2. Paste Access Token
3. Test connection

---

### 3. n8n Environment

```env
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_secure_password

WEBHOOK_URL=https://your-n8n-instance.com
```

---

## 🎯 QUY TRÌNH SỬ DỤNG HÀNG NGÀY

### Quy Trình Chuẩn (7 phút/post)

```bash
# 1. Tạo content file (5 phút)
nano scripts/content-automation/content/post_$(date +%Y%m%d).json
# → Paste template, customize nội dung

# 2. Chạy automation (30 giây)
cd scripts/content-automation
./create-post.sh content/post_$(date +%Y%m%d).json

# Output: Folder ID hiển thị
# → Tự động copy vào clipboard (macOS)

# 3. Update Google Sheets (1.5 phút)
# - Mở Sheets → Tab "Posts"
# - Add row mới:
#   ID: post_XXX
#   Caption: [Viết caption]
#   Drive_Folder_ID: [Paste từ clipboard]
#   Status: Ready

# 4. Đợi n8n auto-post (tự động)
# - n8n chạy mỗi 15 phút
# - Tự động đăng lên Facebook
# - Update Status = "Published"
```

---

### Batch Processing (Tạo nhiều posts cùng lúc)

```bash
# Tạo 5 posts một lúc
for i in {1..5}; do
  ./create-post.sh content/post_00$i.json
done

# Sau đó update hàng loạt vào Sheets
# Set Status = "Ready" cho tất cả
# → n8n sẽ đăng tuần tự (mỗi 15 phút 1 post)
```

---

## 🔧 TROUBLESHOOTING

### Lỗi Thường Gặp

#### 1. "Token not found" (Drive Uploader)
```bash
cd scripts/drive-uploader
npm run auth
# → Authorize lại
```

---

#### 2. "Command not found: node"
```bash
# Install Node.js
brew install node  # macOS
```

---

#### 3. Ảnh không generate
```bash
# Check Puppeteer Chrome path
# Edit generator.js:
executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
```

---

#### 4. n8n không post lên Facebook
**Checklist:**
- [ ] Workflow có active không?
- [ ] Facebook token còn valid?
- [ ] Status trong Sheets = "Ready"?
- [ ] Drive_Folder_ID đúng?

**Debug:**
```bash
# Check n8n execution logs
# n8n UI → Workflow → Executions tab
# → Xem error ở node nào
```

---

#### 5. Upload Drive failed
**Check:**
```bash
# 1. Credentials valid?
cat scripts/drive-uploader/credentials.json

# 2. Token valid?
cat scripts/drive-uploader/token.json

# 3. Re-authorize
npm run auth
```

---

## 📈 OPTIMIZATION TIPS

### 1. Content Quality

**Hook hiệu quả:**
- "99% người [nhóm] không biết..."
- "[Số] cách để..."
- "Tại sao [vấn đề] lại quan trọng..."

**CTA mạnh:**
- "Comment '[keyword]' để nhận..."
- "Tag bạn bè cần biết điều này"
- "Save lại để dùng sau"

---

### 2. Posting Schedule

**Best times để post:**
- **Sáng:** 7-9h (check FB trước khi làm việc)
- **Trưa:** 12-13h (nghỉ trưa)
- **Tối:** 20-22h (sau bữa tối)

**Cách set:**
```javascript
// n8n Schedule node
{
  "cron": "0 7,12,20 * * *",  // 7h, 12h, 20h mỗi ngày
  "timezone": "Asia/Ho_Chi_Minh"
}
```

---

### 3. A/B Testing

**Test các biến:**
- Hook style (question vs statement)
- CTA type (comment vs share)
- Slide order
- Visual style

**Cách track:**
```
Google Sheets → Tab "Analytics"
| Post_ID | Hook_Type | CTA_Type | Views | Engagement_Rate |
```

---

## 📊 METRICS & MONITORING

### KPIs Quan Trọng

```
1. EFFICIENCY
   - Time per post: Target < 10 phút
   - Automation success rate: Target > 95%

2. ENGAGEMENT
   - Views per post: Target > 1000
   - Engagement rate: Target > 5%
   - Comments per post: Target > 20

3. GROWTH
   - Posts per week: Target 7 (1/ngày)
   - Page followers growth: Target +100/tháng
```

---

### Dashboard Setup

**Google Sheets - Tab "Analytics":**

```
=QUERY(Posts!A:F,
  "SELECT A, COUNT(A), AVG(Views), SUM(Engagement)
   WHERE Status='Published'
   GROUP BY Week")
```

---

## 🚀 NEXT STEPS

### Phase 2: Full Automation

**Mục tiêu:** Giảm còn 2 phút/post

**Cần làm:**

1. **Auto-generate JSON từ topic**
   - Input: 1 dòng keyword
   - AI research + viết content
   - Output: content.json

2. **Auto-update Sheets**
   - Sau upload Drive
   - Tự động fill Folder ID
   - Sử dụng Google Sheets API

3. **Smart scheduling**
   - Best time to post (analytics-based)
   - Auto-queue content
   - Drip posting

---

## 📞 SUPPORT

**File Structure:**
```
automation/
├── HUONG_DAN_CHI_TIET.md          ← File này
├── QUICKSTART.md                   ← Quick setup
├── WORKFLOW_MANAGEMENT.md          ← System overview
└── scripts/content-automation/
    └── create-post.sh              ← Main script
```

**Workflow:**
1. Đọc QUICKSTART.md để setup
2. Đọc HUONG_DAN_CHI_TIET.md (file này) để hiểu rõ
3. Chạy create-post.sh để tạo posts
4. Monitor trong DASHBOARD.md

---

**Good luck! 🍀**

---

**Version**: 1.0.0
**Created**: 2026-01-08
**Author**: Long Best AI Team

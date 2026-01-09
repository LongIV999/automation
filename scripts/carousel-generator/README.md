# Carousel Image Generator

Tự động tạo ảnh carousel cho Facebook từ content JSON.

## 🚀 Cài Đặt

```bash
cd scripts/carousel-generator
npm install
```

## 📝 Cách Sử Dụng

### 1. Tạo Content File

Tạo file JSON với cấu trúc:

```json
{
  "title": "Tiêu đề carousel",
  "topic": "Topic chính",
  "brand": "Long Best AI",
  "slides": [
    {
      "type": "title",
      "headline": "Tiêu đề chính",
      "subheadline": "Tiêu đề phụ (optional)"
    },
    {
      "type": "content",
      "headline": "Headline slide",
      "content": "Nội dung text..."
    }
  ]
}
```

### 2. Generate Ảnh

```bash
# Cú pháp cơ bản
node generator.js <content-file.json> [output-directory]

# Ví dụ
node generator.js example-content.json output/post_001
```

### 3. Kết Quả

Script sẽ tạo các file:
```
output/post_001/
├── 01.png
├── 02.png
├── 03.png
├── 04.png
├── 05.png
├── 06.png
└── 07.png
```

---

## 📐 Slide Types

### 1. Title Slide (Slide đầu)

```json
{
  "type": "title",
  "headline": "Tiêu đề lớn, bắt mắt",
  "subheadline": "Mô tả ngắn gọn"
}
```

**Dùng cho**: Slide đầu tiên, hook người xem

---

### 2. Content Slide (Nội dung text)

```json
{
  "type": "content",
  "headline": "Headline",
  "content": "Nội dung dài...\n\nCó thể nhiều đoạn."
}
```

**Dùng cho**: Giải thích, context, story

---

### 3. List Slide (Danh sách)

```json
{
  "type": "list",
  "headline": "Danh sách điều quan trọng",
  "content": [
    "Item thứ nhất",
    "Item thứ hai",
    "Item thứ ba"
  ]
}
```

**Dùng cho**: Checklist, steps, benefits

---

### 4. Prompt Slide (Hiển thị prompt)

```json
{
  "type": "prompt",
  "headline": "Prompt AI Mẫu",
  "subheadline": "Copy và dùng ngay:",
  "content": "Đây là prompt AI..."
}
```

**Dùng cho**: Hiển thị code, prompt, command

---

### 5. CTA Slide (Call to Action - Slide cuối)

```json
{
  "type": "cta",
  "headline": "Hành động tiếp theo",
  "content": "Comment 'AI' để nhận template!"
}
```

**Dùng cho**: Slide cuối, kêu gọi engagement

---

## 🎨 Design Specs

- **Kích thước**: 1080 x 1350px (4:5 ratio - optimal cho Facebook)
- **Quality**: Retina 2x (2160 x 2700 actual)
- **Format**: PNG
- **Fonts**:
  - Headlines: Poppins (Bold, Uppercase)
  - Body: Lora (Serif)
  - Prompts: Courier New (Monospace)

### Colors (Anthropic Brand)

- Background: `#141413` (Dark)
- Text: `#faf9f5` (Cream)
- Primary Accent: `#d97757` (Orange)
- Secondary Accent: `#788c5d` (Green)

---

## 📋 Content Templates

### Template: Tutorial (7 slides)

```json
{
  "slides": [
    { "type": "title", "headline": "Hướng dẫn..." },
    { "type": "content", "headline": "Tại sao cần?" },
    { "type": "prompt", "headline": "Bước 1" },
    { "type": "prompt", "headline": "Bước 2" },
    { "type": "prompt", "headline": "Bước 3" },
    { "type": "content", "headline": "Kết quả" },
    { "type": "cta", "headline": "Nhận thêm tips!" }
  ]
}
```

### Template: Listicle (7 slides)

```json
{
  "slides": [
    { "type": "title", "headline": "10 Cách..." },
    { "type": "list", "content": ["Item 1-3"] },
    { "type": "list", "content": ["Item 4-6"] },
    { "type": "list", "content": ["Item 7-9"] },
    { "type": "prompt", "headline": "Ví dụ chi tiết" },
    { "type": "content", "headline": "Bonus tip" },
    { "type": "cta", "headline": "Comment để nhận..." }
  ]
}
```

### Template: Case Study (7 slides)

```json
{
  "slides": [
    { "type": "title", "headline": "Case Study: ..." },
    { "type": "content", "headline": "Vấn đề ban đầu" },
    { "type": "content", "headline": "Giải pháp" },
    { "type": "prompt", "headline": "Công cụ dùng" },
    { "type": "content", "headline": "Quy trình" },
    { "type": "content", "headline": "Kết quả (số liệu)" },
    { "type": "cta", "headline": "Bạn cũng làm được!" }
  ]
}
```

---

## 🔧 Advanced Options

### Custom Output Directory

```bash
node generator.js content.json /path/to/custom/output
```

### Batch Generate Multiple Posts

```bash
# Tạo script batch
for file in content/*.json; do
  node generator.js "$file" "output/$(basename $file .json)"
done
```

---

## 🐛 Troubleshooting

### Lỗi: "Cannot find module 'puppeteer'"

**Fix:**
```bash
npm install
```

### Lỗi: Font không hiển thị

**Fix:** Script tự động load Google Fonts. Cần internet khi generate.

### Ảnh bị mờ / chất lượng thấp

**Fix:** Script đã set `deviceScaleFactor: 2` cho Retina. Nếu vẫn mờ:
```javascript
// Trong generator.js, tăng deviceScaleFactor
deviceScaleFactor: 3
```

### Puppeteer không chạy trên server

**Fix:**
```bash
# Install dependencies (Ubuntu/Debian)
sudo apt-get install -y \
  chromium-browser \
  fonts-liberation \
  libnss3 \
  libatk-bridge2.0-0
```

---

## 🚀 Next Steps

### Tích hợp với Drive Upload

Sau khi generate, tự động upload lên Google Drive:

```bash
node generator.js content.json output/post_001 && \
node ../drive-uploader/upload.js output/post_001
```

### Tích hợp với n8n

Tạo n8n workflow:
1. Trigger: Google Sheets có row mới `Status = "Design"`
2. Node 1: Đọc content từ sheet
3. Node 2: Tạo JSON file
4. Node 3: Execute `generator.js`
5. Node 4: Upload ảnh lên Drive
6. Node 5: Update sheet với `Drive_Folder_ID`

---

## 📝 Example Content Files

Xem các ví dụ trong thư mục này:
- `example-content.json` - Full tutorial carousel
- `example-listicle.json` - Listicle format (tạo thêm nếu cần)
- `example-casestudy.json` - Case study format (tạo thêm nếu cần)

---

## 📞 Support

Gặp vấn đề? Check:
1. Node.js version >= 16: `node --version`
2. NPM packages installed: `npm list`
3. Content JSON valid: Use JSON validator

---

**Version**: 1.0.0
**Last Updated**: 2026-01-08

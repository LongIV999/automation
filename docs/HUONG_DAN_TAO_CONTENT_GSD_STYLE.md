# 🎨 Hướng Dẫn Tạo Content Kiểu GSD/NotebookLM

## 📋 Mục Lục
1. [Phân Tích Phong Cách](#phân-tích-phong-cách)
2. [Cấu Trúc Content JSON](#cấu-trúc-content-json)
3. [Hướng Dẫn Tạo Content](#hướng-dẫn-tạo-content)
4. [Chạy Automation](#chạy-automation)
5. [Tips & Best Practices](#tips--best-practices)

---

## 📊 Phân Tích Phong Cách

### 1. Màu Sắc (Brand: Long Best AI)
```json
{
  "primary": "#C15F3C",        // Terracotta - cho accents, buttons
  "background": "#F4F3EE",     // Warm cream - nền chính
  "backgroundDark": "#141413", // Đen đậm - cho text/contrast
  "accent": "#788c5d",         // Xanh ô liu - cho highlights
  "text": "#faf9f5",           // Trắng kem - cho text trên dark bg
  "textDark": "#000000"        // Đen - cho text trên light bg
}
```

### 2. Typography
- **Headline Font**: Poppins (Bold/Black)
  - Title slide: 72px
  - Content slides: 56px
- **Body Font**: Lora (Regular)
  - Subheadline: 28px
  - Body text: 24px
  - List items: 26px

### 3. Layout Characteristics
✅ **Bất đối xứng**: Text chiếm 40-50% bên trái, Visual 50-60% bên phải
✅ **Không gian âm nhiều**: Tối thiểu 60-80px padding
✅ **Hierarchy rõ ràng**: Headline → Subheadline → Body (giảm dần 30-40%)
✅ **Single focus**: Mỗi slide chỉ 1 ý chính

### 4. Visual Style
- **Abstract illustrations**: Flowing shapes, geometric transitions
- **Technical diagrams**: Flowcharts, graphs, curves
- **Minimalist icons**: Line art, simple shapes
- **Overlay effects**: Transparent gradients, subtle shadows
- **NotebookLM aesthetic**: Warm, professional, educational

---

## 🗂️ Cấu Trúc Content JSON

### File Template
```json
{
  "title": "Tiêu Đề Chính Của Carousel",
  "topic": "mô tả ngắn gọn về chủ đề",
  "brand": "Long Best AI",
  "designStyle": "notebook",  // ⭐ Quan trọng: bật NotebookLM style
  "slides": [
    // Slide 1: Title (required)
    {
      "type": "title",
      "headline": "Tiêu Đề Chính Ngắn Gọn",
      "subheadline": "Mô tả phụ giải thích thêm về headline",
      "content": "Context hoặc nguồn trích dẫn (optional)",
      "visual": "Mô tả visual chi tiết cho AI generator"
    },

    // Slide 2-6: Content/List/Prompt
    {
      "type": "content", // hoặc "list", "prompt"
      "headline": "Điểm Chính",
      "subheadline": "Giải thích ngắn",
      "content": "Nội dung chi tiết...",
      "visual": "Mô tả visual..."
    },

    // Slide 7: CTA (required)
    {
      "type": "cta",
      "headline": "Call To Action Hấp Dẫn",
      "subheadline": "Lợi ích cụ thể",
      "content": "Hướng dẫn action và giá trị nhận được",
      "visual": "CTA design với branding..."
    }
  ]
}
```

### Các Loại Slide Types

#### 1. **title** - Slide Mở Đầu
- Headline: Câu chủ đề chính (7-10 từ)
- Subheadline: Giải thích value proposition (15-20 từ)
- Content: Nguồn/credit (optional, 5-10 từ)
- Visual: Abstract, high-impact, brand-aligned

#### 2. **content** - Slide Nội Dung
- Headline: Ý chính của slide (5-8 từ)
- Subheadline: Context hoặc kết quả (10-15 từ)
- Content: Giải thích chi tiết (40-60 từ)
- Visual: Supporting illustration hoặc diagram

#### 3. **list** - Slide Danh Sách
- Headline: Giới thiệu danh sách (5-8 từ)
- Subheadline: Số lượng items (3-5 từ)
- Content: Array of 3-5 bullet points (mỗi item 8-12 từ)
- Visual: Numbered grid hoặc icon list

#### 4. **prompt** - Slide Template/Code
- Headline: Tên prompt/template (5-8 từ)
- Subheadline: Công dụng (8-12 từ)
- Content: Nội dung prompt đầy đủ (có thể dài)
- Visual: Code box với syntax highlighting

#### 5. **cta** - Slide Kêu Gọi Hành Động
- Headline: Action mong muốn (4-6 từ)
- Subheadline: Lợi ích khi thực hiện (10-15 từ)
- Content: Chi tiết offer và cách thực hiện (30-50 từ)
- Visual: Button/CTA design với branding

---

## ✍️ Hướng Dẫn Tạo Content

### Bước 1: Brainstorm Chủ Đề
Chọn topic phù hợp với brand pillars:
- ✅ Tutorials (Hướng dẫn)
- ✅ Tips & Tricks (Mẹo vặt)
- ✅ Case Studies (Nghiên cứu điển hình)
- ✅ Tool Reviews (Đánh giá công cụ)
- ✅ News & Updates (Tin tức mới)

### Bước 2: Lên Outline 7 Slides
```
Slide 1: Title - Hook attention
Slide 2: Problem/Context - Giới thiệu vấn đề
Slide 3: Core Concept - Giải thích khái niệm
Slide 4: Solution/Framework - Giải pháp
Slide 5: How It Works - Cách thức hoạt động
Slide 6: Benefits/Results - Lợi ích
Slide 7: CTA - Kêu gọi hành động
```

### Bước 3: Viết Content Chi Tiết

#### ✅ DO (Nên làm):
- Headline ngắn gọn, punchy (5-10 từ max)
- Subheadline giải thích thêm context
- Content chi tiết nhưng súc tích (40-60 từ cho content slides)
- Visual description cụ thể (màu sắc, layout, elements)
- Sử dụng số liệu, %, thống kê để tăng credibility

#### ❌ DON'T (Tránh):
- Headline quá dài (>12 từ)
- Content quá dài (>80 từ/slide) → khó đọc
- Visual description mơ hồ ("có ảnh đẹp", "màu đẹp")
- Quá nhiều ý trong 1 slide
- Copy-paste text từ blog/article

### Bước 4: Viết Visual Descriptions

#### Framework cho Visual Prompts:
```
[Main subject] + [Style] + [Color palette] + [Layout] + [Mood]
```

#### Ví dụ:
```
"Abstract flowing shapes transitioning from chaos to order,
warm cream background (#F4F3EE) with dark green (#4A7C59)
and gray accents, split composition (chaotic left, organized right),
professional minimalist design, educational mood"
```

#### Visual Elements Phổ Biến:
- **Abstract**: flowing lines, geometric shapes, gradients
- **Technical**: flowcharts, diagrams, graphs, curves
- **Human**: developer illustrations, user personas
- **UI Elements**: dashboards, mobile screens, code editors
- **Icons**: minimalist line icons, numbered badges
- **Comparisons**: before/after, split screen, side-by-side

---

## 🚀 Chạy Automation

### Bước 1: Tạo File JSON
```bash
# Tạo file mới trong thư mục content
nano scripts/carousel-generator/content/longbest-[topic-slug].json
```

### Bước 2: Paste Content
Paste nội dung JSON đã chuẩn bị vào file

### Bước 3: Run Generator
```bash
# Di chuyển đến thư mục scripts
cd scripts

# Chạy process-all để generate images
node process-all.js

# Hoặc chạy riêng cho 1 file
node carousel-generator/generator.js \
  carousel-generator/content/longbest-[topic-slug].json \
  ../output/longbest-[topic-slug]
```

### Bước 4: Kiểm Tra Output
```bash
# Xem kết quả
open output/longbest-[topic-slug]/

# Nếu cần enhance lại
node carousel-generator/enhancer.js \
  ../output/longbest-[topic-slug]
```

### Bước 5: Upload & Publish
```bash
# Upload lên Google Drive + Sheets
node drive-uploader/upload.js longbest-ai longbest-[topic-slug]

# Publish lên Facebook (nếu đã config)
node publish-post.js longbest-ai longbest-[topic-slug]
```

---

## 💡 Tips & Best Practices

### Content Writing Tips

1. **Hook trong 3 giây đầu**
   - Title slide phải instantly communicate value
   - Dùng numbers: "7 Mẹo", "5 Bước", "3 Lỗi Sai"
   - Dùng pain points: "Bạn Đang ... Sai Cách"

2. **One Idea Per Slide**
   - Mỗi slide = 1 ý chính duy nhất
   - Nếu có >1 ý → chia thành 2 slides

3. **Visual > Text**
   - Hình ảnh chiếm 50-60% diện tích
   - Text chỉ là support, không phải main content

4. **Storytelling Arc**
   - Problem → Solution → How → Results → CTA
   - Có narrative flow, không phải bullet points rời rạc

### Design Tips

1. **Consistency is Key**
   - Dùng đúng brand colors
   - Font sizes theo hierarchy
   - Layout pattern lặp lại

2. **Breathing Room**
   - Padding tối thiểu 60-80px
   - Line height 1.4-1.6 cho readability
   - Không nhồi nhét quá nhiều elements

3. **Visual Hierarchy**
   - Headline: 100% contrast (đen đậm)
   - Subheadline: 70% (gray)
   - Body: 60% (lighter gray)

4. **Color Usage**
   - Background: luôn là cream (#F4F3EE)
   - Accent: chỉ dùng cho highlights (10-15% diện tích)
   - Text: đen hoặc dark gray

### Testing & Iteration

1. **Mobile Preview Test**
   - Zoom out 50% để xem như trên mobile
   - Text có đọc được không?
   - Visual có rõ ràng không?

2. **3-Second Rule**
   - Người xem có hiểu main message trong 3s?
   - Nếu không → đơn giản hóa

3. **A/B Testing**
   - Tạo 2 versions của title slide
   - Test engagement trên Facebook
   - Lấy winner làm template

---

## 📦 Ví Dụ Hoàn Chỉnh

### Case Study: "Bạn Đang Dùng Claude Code Sai Cách"

#### Slide 1: Title
```json
{
  "type": "title",
  "headline": "Bạn Đang Dùng Claude Code Sai Cách.",
  "subheadline": "Giới thiệu GSD: Framework mới để biến ý tưởng thành sản phẩm hoàn chỉnh một cách bền vững.",
  "content": "Dựa trên phân tích từ video của kênh YouTube 'Chase AI'.",
  "visual": "Abstract flowing shapes transitioning from chaotic lines on left to organized geometric blocks on right, warm cream background with dark green and gray accents, professional minimalist design"
}
```

**Phân tích:**
- ✅ Headline punchy, controversial ("Sai Cách")
- ✅ Subheadline giải thích solution ngay (GSD Framework)
- ✅ Content credit source (tăng credibility)
- ✅ Visual mô tả chaos → order (match với message)

#### Slide 3: Concept Explanation
```json
{
  "type": "content",
  "headline": "Thủ Phạm Chính: Hiện Tượng 'Thôi Rửa Ngữ Cảnh'",
  "subheadline": "Context decay trong LLM",
  "content": "Hiệu quả của LLM giảm dần trong một phiên làm việc. Các token ở đầu của sơ ngữ cảnh có tác động mạnh hơn nhiều so với các token ở cuối. Càng trò chuyện lâu, Claude càng 'kém thông minh' đi. Đây là một thực tế của công nghệ.",
  "visual": "Professional curve graph showing efficiency decay over time, with 'Cao' (high) at start declining to 'Thấp' (low) at end, color gradient from green to gray/red, labeled sections: 'Bắt đầu' -> 'Độ Dài Ngữ Cảnh' -> 'Kết thúc', clean data visualization style"
}
```

**Phân tích:**
- ✅ Headline: giới thiệu vấn đề với term catchy ("Thôi Rửa Ngữ Cảnh")
- ✅ Subheadline: technical term (context decay)
- ✅ Content: giải thích chi tiết nhưng dễ hiểu (58 từ)
- ✅ Visual: data visualization cụ thể (graph với labels)

---

## 🔧 Troubleshooting

### Issue: Hình ảnh bị cắt xén
**Solution:** Kiểm tra `slideWidth` và `slideHeight` trong brand.json
```json
"carousel": {
  "slideWidth": 1080,
  "slideHeight": 1350  // Ratio 4:5 for Facebook
}
```

### Issue: Font không load
**Solution:** Kiểm tra font trong `typography` config
```json
"typography": {
  "headline": "Poppins",  // Phải có trong Google Fonts
  "body": "Lora"
}
```

### Issue: Màu sắc không đúng brand
**Solution:** Verify màu trong brand.json và sử dụng trong visual description

### Issue: Text quá nhỏ trên mobile
**Solution:** Tăng font sizes trong brand.json hoặc giảm content length

---

## 📚 Resources

### Tools Cần Thiết
- Node.js 16+
- Puppeteer (auto-installed)
- Google Chrome
- Google Cloud credentials (cho Drive/Sheets)

### Learning Resources
- NotebookLM Design: https://notebooklm.google/
- Canva Design School (Vietnamese)
- Typography.com (for font pairing)

### Inspiration Sources
- Chase AI YouTube Channel
- AI Jason YouTube
- Các carousel viral trên LinkedIn

---

## ✅ Checklist Trước Khi Publish

- [ ] Title slide có hook rõ ràng
- [ ] Mỗi slide có 1 ý chính
- [ ] Visual descriptions chi tiết
- [ ] CTA rõ ràng với value proposition
- [ ] Kiểm tra typos/grammar
- [ ] Test generate local trước
- [ ] Preview trên mobile
- [ ] Brand colors đúng
- [ ] File naming convention: `longbest-[topic-slug].json`

---

**Tạo bởi:** Long Best AI Automation System
**Version:** 1.0
**Last updated:** 2026-01-12

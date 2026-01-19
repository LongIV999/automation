# 🎨 THACH VU LAND - NOTEBOOKLM STYLE

**Phong cách**: Typography Black & White Infographic
**Ngày áp dụng**: 2026-01-14
**Status**: ✅ PRODUCTION READY

---

## 📋 TỔNG QUAN

Đã chuyển đổi từ phong cách Anthropic colorful sang **NotebookLM Style** - phong cách typography đen trắng tối giản, chuyên nghiệp, tập trung vào nội dung và dễ đọc.

### Đặc Điểm Chính

✅ **Black & White Only** - Chỉ sử dụng đen (#000000) và trắng (#FFFFFF)
✅ **Typography-focused** - Tập trung vào chữ, hierarchy rõ ràng
✅ **Infographic Layout** - Bố cục infographic summarize
✅ **Clean & Professional** - Tối giản, chuyên nghiệp
✅ **Notebook-inspired** - Lấy cảm hứng từ NotebookLM

---

## 🎨 DESIGN SYSTEM

### Colors

```json
{
  "primary": "#000000",      // Black
  "background": "#FFFFFF",   // White
  "text": "#000000",         // Black text
  "accent": "#000000"        // Black accents
}
```

**Không sử dụng màu khác** - Chỉ đen trắng thuần túy.

### Typography

**Fonts**:
- **Inter** - Sans-serif hiện đại, dễ đọc
- **JetBrains Mono** - Monospace cho labels, tags

**Font Sizes**:
- Headline: 48px (Bold 800)
- Subheadline: 20px
- Stats Value: 32-36px (Bold 800)
- Body text: 15-16px
- Labels: 12-14px (Uppercase + Letter spacing)

**Font Weights**:
- Headlines: 800 (Extra Bold)
- Stats: 800 (Extra Bold)
- Body: 400 (Regular)
- Labels: 600 (Semi Bold)

### Layout Structure

```
┌─────────────────────────────────┐
│ ▪ HEADER (Black background)     │
│   - Brand Tag (JetBrains Mono)  │
│   - Headline (48px, Bold)       │
│   - Subheadline (20px)          │
├─────────────────────────────────┤
│ CONTENT AREA (White)            │
│                                 │
│ ┌─────────┐ ┌─────────┐        │
│ │ STAT 1  │ │ STAT 2  │        │
│ └─────────┘ └─────────┘        │
│ ┌─────────┐ ┌─────────┐        │
│ │ STAT 3  │ │ STAT 4  │        │
│ └─────────┘ └─────────┘        │
│                                 │
│ ● HIGHLIGHTS                    │
│ ① Point 1                       │
│ ② Point 2                       │
│ ③ Point 3                       │
│                                 │
│ ■ INFO BOX (Black bg)           │
│   Content description           │
├─────────────────────────────────┤
│ ■ FOOTER (Black background)     │
│   Contact | Website             │
└─────────────────────────────────┘
```

### Design Elements

1. **Header Section**
   - Full-width black background
   - White text
   - Brand tag uppercase + letter spacing
   - Corner decorative brackets

2. **Stats Grid**
   - 2x2 grid layout
   - Black border boxes
   - Large bold numbers
   - Uppercase labels with mono font

3. **Highlights List**
   - Numbered circles (black background, white number)
   - Section title with bottom border
   - Clean spacing between items

4. **Info Box**
   - Black background, white text
   - Uppercase title
   - Regular content text

5. **Footer**
   - Black background
   - Contact info + Website
   - Mono font for contact

6. **Corner Markers**
   - Decorative brackets top-left and bottom-right
   - Simple black borders

---

## 📝 CONTENT FORMAT

### JSON Structure

```json
{
  "formatType": "single-post",
  "designStyle": "notebook-lm",
  "dimensions": {
    "width": 1080,
    "height": 1350
  },
  "slides": [
    {
      "type": "notebook-lm",
      "headline": "HEADLINE HERE",
      "subheadline": "Subheadline description",
      "stats": {
        "Label 1": "VALUE",
        "Label 2": "VALUE",
        "Label 3": "VALUE",
        "Label 4": "VALUE"
      },
      "highlights": [
        "Highlight point 1",
        "Highlight point 2",
        "Highlight point 3"
      ],
      "content": "Additional information about the project"
    }
  ]
}
```

### Stats Examples

**Bất Động Sản**:
```json
"stats": {
  "Giá khởi điểm": "1.5 TỶ",
  "Diện tích": "50-80 M²",
  "Bàn giao": "Q4/2026",
  "Thanh toán": "20% HĐMB"
}
```

**Dự Án**:
```json
"stats": {
  "Tổng vốn": "500 TỶ",
  "Quy mô": "1,200 CĂN",
  "Mật độ": "25%",
  "Tiện ích": "30+"
}
```

---

## 🚀 USAGE

### 1. Tạo Content

```bash
cd /Users/admin/automation/scripts/carousel-generator/content
# Tạo file JSON theo template notebook-lm
```

### 2. Generate Image

```bash
cd /Users/admin/automation
node scripts/carousel-generator/generator.js scripts/carousel-generator/content/[filename].json
```

### 3. Upload & Sync

```bash
cd scripts/drive-uploader
node upload-thachvuland.js [folder-name]
```

---

## ✅ TEST RESULTS

### Test Case: Phú Đông Sky One

**Input**: `thachvuland-notebook-lm-test.json`

**Output**:
- ✅ Image generated: 296KB PNG (1080x1350)
- ✅ Black & White only - No colors
- ✅ Typography hierarchy clear
- ✅ Stats grid 2x2 layout
- ✅ 5 highlights numbered
- ✅ Footer with contact info
- ✅ Corner decorative markers

**Upload**:
- ✅ Google Drive: Uploaded successfully
- ✅ Google Sheet Row 7: Status Ready
- ✅ Caption with full contact info

---

## 🎯 WHY NOTEBOOK-LM STYLE?

### Advantages

1. **Professional & Clean**
   - Tối giản, dễ nhìn
   - Tập trung vào nội dung
   - Không bị phân tán bởi màu sắc

2. **Better Readability**
   - Typography hierarchy rõ ràng
   - Dễ scan thông tin quan trọng
   - Stats nổi bật

3. **Brand Authority**
   - Phong cách chuyên nghiệp
   - Tin cậy, uy tín
   - Phù hợp bất động sản

4. **Versatile**
   - Dễ dàng điều chỉnh
   - Phù hợp mọi loại nội dung
   - Không lỗi thời

5. **Cost-effective**
   - Dễ in ấn (chỉ đen trắng)
   - Tiết kiệm chi phí
   - Phù hợp mọi nền tảng

---

## 📊 COMPARISON

### Before (Anthropic Style)

- ❌ Nhiều màu sắc (#0A2540, #4A7C59, #F4F3EE)
- ❌ Background gradients
- ❌ Decorative elements phức tạp
- ❌ Fonts: Poppins + Lora
- ⚠️ Có thể phân tán

### After (NotebookLM Style)

- ✅ Chỉ đen trắng (#000000, #FFFFFF)
- ✅ Flat design, no gradients
- ✅ Minimal decorative (chỉ corner brackets)
- ✅ Fonts: Inter + JetBrains Mono
- ✅ Tập trung, rõ ràng

---

## 📚 TEMPLATES MẪU

### Template 1: Giới Thiệu Dự Án

```json
{
  "headline": "TÊN DỰ ÁN",
  "subheadline": "Mô tả ngắn gọn về dự án",
  "stats": {
    "Giá": "X.X TỶ",
    "Diện tích": "XX M²",
    "Bàn giao": "QX/202X",
    "Thanh toán": "XX%"
  },
  "highlights": [
    "Điểm nổi bật 1",
    "Điểm nổi bật 2",
    "Điểm nổi bật 3"
  ]
}
```

### Template 2: So Sánh Thị Trường

```json
{
  "headline": "SO SÁNH THỊ TRƯỜNG",
  "subheadline": "Khu vực [Tên khu vực]",
  "stats": {
    "Giá trung bình": "XX TỶ",
    "Tăng trưởng": "+XX%",
    "Giao dịch": "XXX",
    "ROI": "XX%"
  }
}
```

### Template 3: Ưu Đãi

```json
{
  "headline": "ưu đãi đặc biệt",
  "subheadline": "Chỉ trong tháng [Tháng]",
  "stats": {
    "Chiết khấu": "XX%",
    "Quà tặng": "XX TRIỆU",
    "Hỗ trợ vay": "XX%",
    "Lãi suất": "X.X%"
  }
}
```

---

## 🔧 CONFIGURATION

### Brand Config Updated

```json
{
  "colors": {
    "primary": "#000000",
    "background": "#FFFFFF",
    "text": "#000000"
  },
  "typography": {
    "headline": "Inter",
    "body": "Inter",
    "mono": "JetBrains Mono"
  },
  "designStyle": {
    "type": "notebook-lm",
    "theme": "black-white-typography",
    "layout": "infographic-summarize"
  }
}
```

---

## 📁 FILES CREATED/UPDATED

### Created
- `/scripts/carousel-generator/templates/notebook-lm-style.js` - Template
- `/scripts/carousel-generator/createNotebookLMHTML.js` - HTML generator
- `/scripts/carousel-generator/content/thachvuland-notebook-lm-test.json` - Test content
- `/docs/THACHVULAND_NOTEBOOKLM_STYLE.md` - This doc

### Updated
- `/brands/thachvuland/brand.json` - Colors, typography, design style
- `/scripts/carousel-generator/generator.js` - Added NotebookLM support

---

## 🎉 KẾT LUẬN

✅ **Style NotebookLM** đã được implement hoàn toàn
✅ **Black & White typography** - Chuyên nghiệp, tối giản
✅ **Infographic layout** - Dễ đọc, rõ ràng
✅ **Test thành công** - Row 7 trong Sheet, ready to post
✅ **Production ready** - Sẵn sàng sử dụng

**Từ giờ trở đi, tất cả content Thach Vu Land sẽ sử dụng NotebookLM Style!**

---

**Created by**: Claude Code (Antigravity)
**Date**: 2026-01-14
**Version**: 1.0.0

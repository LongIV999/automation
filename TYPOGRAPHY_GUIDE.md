# HƯỚNG DẪN ĐIỀU CHỈNH KÍCH THƯỚC CHỮ TRONG CAROUSEL

## Tổng quan
Hệ thống carousel generator hiện đã được nâng cấp với **typography configuration system** - cho phép bạn dễ dàng thay đổi kích thước chữ mà không cần sửa code.

## Cấu trúc Files

```
scripts/carousel-generator/
├── generator.js               # Script tạo carousel (đã cập nhật)
├── typography-config.json     # File cấu hình kích thước chữ (MỚI)
├── set-preset.js             # Script tiện ích thay đổi preset (MỚI)
└── content/                  # Thư mục chứa nội dung JSON
```

---

## 📐 Cách sử dụng

### 1. XEM CẤU HÌNH HIỆN TẠI

```bash
cd scripts/carousel-generator
node set-preset.js show
```

Kết quả:
```
📐 TYPOGRAPHY CONFIGURATION

Current Preset: readablePreview
Description: Tối ưu cho preview trên carousel - chữ to hơn 40%
Multiplier: 1.4x

Font Sizes (with current preset applied):
  h1Title         : 140px  (base: 100px)
  h1Content       : 112px  (base: 80px)
  h2              : 73px   (base: 52px)
  subheadline     : 56px   (base: 40px)
  content         : 48px   (base: 34px)
  listItem        : 53px   (base: 38px)
  ...
```

---

### 2. THAY ĐỔI PRESET (Cách đơn giản nhất)

#### Chế độ Interactive (Recommended)
```bash
node set-preset.js
```

Bạn sẽ thấy menu:
```
Available Presets:

  [1] default
      Kích thước mặc định (cũ) - chữ nhỏ
      Multiplier: 1.0x

➤ [2] readablePreview
      Tối ưu cho preview trên carousel - chữ to hơn 40%
      Multiplier: 1.4x

  [3] extraLarge
      Rất to - cho người kém thị lực hoặc preview rất nhỏ
      Multiplier: 1.6x

Select preset (1-3):
```

Nhập số `2` hoặc `3` và nhấn Enter.

#### Chế độ Command Line
```bash
# Chuyển về preset mặc định (chữ nhỏ)
node set-preset.js set default

# Preset tối ưu cho Facebook carousel preview (RECOMMENDED)
node set-preset.js set readablePreview

# Preset chữ rất to
node set-preset.js set extraLarge
```

---

### 3. GENERATE CAROUSEL VỚI KÍCH THƯỚC MỚI

Sau khi thay đổi preset, chạy generator như bình thường:

```bash
node generator.js content/antigravity-tips.json
```

Bạn sẽ thấy thông báo:
```
📐 Loading typography configuration...
✓ Typography loaded: readablePreview (Tối ưu cho preview trên carousel - chữ to hơn 40%)
🚀 Starting carousel generation...
📸 Generating slide 01...
✅ Slide 01 saved: ./output/antigravity-tips/01.png
...
```

---

## 🎨 Tùy chỉnh nâng cao

### Chỉnh sửa kích thước chi tiết

Mở file `typography-config.json`:

```json
{
  "fontSizes": {
    "h1Title": {
      "value": 100,  // ← Thay đổi số này
      "unit": "px",
      "description": "Tiêu đề chính cho slide đầu tiên"
    },
    "h2": {
      "value": 52,   // ← Thay đổi số này
      "unit": "px",
      "description": "Tiêu đề phụ"
    },
    ...
  },
  "currentPreset": "readablePreview"  // ← Preset đang dùng
}
```

**Lưu ý:** Các giá trị trong `fontSizes` là **base values**. Kích thước thật sẽ được nhân với `multiplier` của preset hiện tại.

### Tạo preset mới

Thêm vào phần `presets`:

```json
{
  "presets": {
    "default": { ... },
    "readablePreview": { ... },
    "extraLarge": { ... },

    "myCustomPreset": {
      "description": "Preset riêng của tôi",
      "multiplier": 1.2
    }
  },
  "currentPreset": "myCustomPreset"
}
```

---

## 🔄 QUY TRÌNH TỰ ĐỘNG HÓA

### Workflow hiện tại của bạn:

```
1. Tạo nội dung JSON
   ↓
2. Generate carousel images với generator.js
   ↓
3. Upload lên Google Drive (upload.js)
   ↓
4. Cập nhật Google Sheets
   ↓
5. n8n tự động đăng lên Facebook
```

### Cách tích hợp vào workflow:

#### Option 1: Thay đổi preset một lần
```bash
# Chỉ cần chạy 1 lần để set preset mặc định
cd scripts/carousel-generator
node set-preset.js set readablePreview

# Sau đó tất cả carousel được tạo sẽ dùng preset này
```

#### Option 2: Tạo script tự động
Tạo file `scripts/content-automation/create-post-large-text.sh`:

```bash
#!/bin/bash

# Set preset to readablePreview
cd scripts/carousel-generator
node set-preset.js set readablePreview

# Generate carousel
node generator.js "$1"

# Upload to Drive
cd ../drive-uploader
node upload.js "../../carousel-generator/output/$(basename $1 .json)"
```

Chạy:
```bash
./scripts/content-automation/create-post-large-text.sh content/post_001.json
```

---

## 📊 SO SÁNH PRESET

| Element | Default (1.0x) | Readable (1.4x) | Extra Large (1.6x) |
|---------|----------------|-----------------|-------------------|
| h1 Title | 100px | 140px | 160px |
| h1 Content | 80px | 112px | 128px |
| h2 | 52px | 73px | 83px |
| Content | 34px | 48px | 54px |
| List Item | 38px | 53px | 61px |

**Khuyến nghị:** Dùng `readablePreview` (1.4x) cho Facebook carousel.

---

## 🐛 Troubleshooting

### Lỗi: "Could not load typography config"
```bash
# Kiểm tra file có tồn tại không
ls -la scripts/carousel-generator/typography-config.json

# Nếu không có, copy từ template
# (Bạn đã có file này rồi)
```

### Chữ vẫn nhỏ sau khi thay đổi preset
```bash
# 1. Kiểm tra preset hiện tại
node set-preset.js show

# 2. Xóa cache output cũ
rm -rf scripts/carousel-generator/output/*

# 3. Generate lại
node generator.js content/your-content.json
```

### Muốn chỉnh một phần tử cụ thể
```bash
# Mở file config và tìm element
code typography-config.json

# Hoặc dùng grep
grep "h1Title" typography-config.json
```

---

## 💡 Tips & Best Practices

1. **Preview trước khi đăng**
   - Generate với preset khác nhau
   - Xem trên điện thoại trước khi đăng Facebook

2. **Dùng preset phù hợp**
   - `default`: Nếu post là PDF hoặc website
   - `readablePreview`: Cho Facebook/Instagram carousel
   - `extraLarge`: Cho Stories hoặc Reels thumbnail

3. **Backup config**
   ```bash
   cp typography-config.json typography-config.backup.json
   ```

4. **Version control**
   ```bash
   git add typography-config.json
   git commit -m "Update typography preset to readablePreview"
   ```

---

## 📝 Lệnh nhanh

```bash
# Xem preset hiện tại
node set-preset.js show

# Thay đổi preset (interactive)
node set-preset.js

# Thay đổi preset (command)
node set-preset.js set readablePreview

# Liệt kê tất cả preset
node set-preset.js list

# Generate carousel
node generator.js content/post.json

# Tất cả trong một lệnh (bash)
node set-preset.js set readablePreview && node generator.js content/post.json
```

---

## 🎯 Kết luận

Bây giờ bạn có thể:

✅ Thay đổi kích thước chữ dễ dàng bằng preset
✅ Không cần sửa code mỗi lần muốn thay đổi
✅ Tạo nhiều preset cho mục đích khác nhau
✅ Tích hợp vào workflow automation hiện có

**Bước tiếp theo:** Generate một carousel thử nghiệm và xem kết quả!

```bash
cd scripts/carousel-generator
node set-preset.js set readablePreview
node generator.js content/antigravity-tips.json
```

---

**Tạo bởi:** Long Best AI Automation System
**Ngày:** 2026-01-09

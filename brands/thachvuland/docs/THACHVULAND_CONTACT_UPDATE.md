# 📞 THÔNG TIN LIÊN HỆ THACH VU LAND - CẬP NHẬT

**Ngày cập nhật**: 2026-01-14

---

## ✅ THÔNG TIN MỚI

### Liên Hệ
- **Hotline**: 0903.469.888
- **Zalo**: 0903.469.888
- **Địa chỉ**: 32 đường 40 . KDC Vạn Phúc , TP Thủ Đức
- **Website**: thachvuland.com
- **Email**: info@thachvuland.com
- **Giờ làm việc**: 8:00 - 18:00 (Thứ 2 - Chủ Nhật)

### Tagline
**"Đầu Tư BĐS Bình Dương Uy Tín"**

---

## 📋 ĐÃ CẬP NHẬT

### 1. Brand Config ✅
**File**: `/brands/thachvuland/brand.json`

```json
{
  "branding": {
    "logoText": "Thach Vu Land",
    "tagline": "Đầu Tư BĐS Bình Dương Uy Tín",
    "website": "thachvuland.com",
    "email": "info@thachvuland.com"
  },
  "contact": {
    "hotline": "0903.469.888",
    "phone": "0903.469.888",
    "address": "32 đường 40, KDC Vạn Phúc, TP Thủ Đức",
    "fullAddress": "32 đường 40 . KDC Vạn Phúc , TP Thủ Đức",
    "zalo": "0903.469.888",
    "workingHours": "8:00 - 18:00 (Thứ 2 - Chủ Nhật)"
  }
}
```

### 2. Caption Helper ✅
**File**: `/brands/thachvuland/caption-helper.js`

Tự động thêm thông tin liên hệ vào mọi caption.

**Format mẫu**:
```
[Nội dung chính của bài viết]

━━━━━━━━━━━━━━━━━━━━

📞 Liên hệ ngay: 0903.469.888
📍 Địa chỉ: 32 đường 40 . KDC Vạn Phúc , TP Thủ Đức
💬 Zalo: 0903.469.888
🌐 Website: thachvuland.com

⏰ Giờ làm việc: 8:00 - 18:00 (Thứ 2 - Chủ Nhật)

Đầu Tư BĐS Bình Dương Uy Tín
```

### 3. Upload Script ✅
**File**: `/scripts/drive-uploader/upload-thachvuland.js`

Tự động sử dụng caption từ `content.json` (đã có thông tin liên hệ).

---

## 🚀 CÁCH SỬ DỤNG

### Tạo Content Mới với Thông Tin Liên Hệ

#### Option 1: Sử dụng Caption Helper (Recommended)

```javascript
const { generateCaption } = require('../brands/thachvuland/caption-helper');

const content = {
  headline: '🏡 CĂN HỘ CAO CẤP PHÚ ĐÔNG SKY ONE',
  description: 'Sở hữu ngay căn hộ 2PN tại vị trí vàng...',
  highlights: [
    '✨ Vị trí đắc địa - Gần KCN VSIP',
    '🏗️ Tiến độ nhanh - Bàn giao Q4/2026',
    // ...
  ],
  cta: 'Đặt chỗ ngay hôm nay!',
  hashtags: '#PhuDongSkyOne #BatDongSan #BinhDuong'
};

const caption = await generateCaption(content);
// Caption sẽ tự động có thông tin liên hệ ở cuối
```

#### Option 2: Update Existing Caption

```javascript
const { updateCaptionWithContact } = require('../brands/thachvuland/caption-helper');

const oldCaption = 'Căn hộ cao cấp giá rẻ...';
const newCaption = await updateCaptionWithContact(oldCaption);
// Thông tin liên hệ được thêm vào
```

#### Option 3: CLI Tool

```bash
# Xem thông tin liên hệ
cd /Users/admin/automation/brands/thachvuland
node caption-helper.js --contact-only

# Update caption
node caption-helper.js "Nội dung caption của bạn"
```

### Workflow Tạo Post Mới

```bash
# 1. Tạo content script (sử dụng caption-helper)
cd /Users/admin/automation/scripts
node test-thachvuland-with-contact.js
# → Tạo file JSON với caption đã có thông tin liên hệ

# 2. Generate ảnh
cd /Users/admin/automation
node scripts/carousel-generator/generator.js carousel-generator/content/thachvuland-phu-dong-sky-one.json
# → Tạo ảnh trong output/

# 3. Upload và sync to Sheet
cd scripts/drive-uploader
node upload-thachvuland.js thachvuland-phu-dong-sky-one
# → Upload Drive + Sync Sheet với caption đầy đủ

# 4. n8n auto-post
# → Workflow tự động post lên Facebook với thông tin liên hệ
```

---

## ✅ TEST & VERIFICATION

### Test đã thực hiện:

1. **Caption Generation** ✅
   ```bash
   node caption-helper.js --contact-only
   ```
   - Kết quả: Thông tin liên hệ đầy đủ

2. **Content Creation** ✅
   ```bash
   node test-thachvuland-with-contact.js
   ```
   - Topic: Căn Hộ Phú Đông Sky One
   - Caption length: 744 ký tự
   - Contact info: ✅ Có đầy đủ

3. **Image Generation** ✅
   - Format: Single Post (1080x1080)
   - Output: `01.png` (284KB)

4. **Upload & Sync** ✅
   - Drive: Uploaded successfully
   - Sheet Row 6:
     - Topic: Căn Hộ Phú Đông Sky One - Bình Dương
     - Status: Ready
     - Caption: ✅ Có đầy đủ thông tin liên hệ

5. **Verification** ✅
   - ✅ Số điện thoại: 0903.469.888
   - ✅ Địa chỉ: 32 đường 40 . KDC Vạn Phúc , TP Thủ Đức
   - ✅ Zalo: 0903.469.888
   - ✅ Website: thachvuland.com

---

## 📝 TEMPLATES MẪU

### Template 1: Giới Thiệu Dự Án

```javascript
const content = {
  headline: '🏡 [TÊN DỰ ÁN]',
  description: '[Mô tả ngắn gọn về dự án]',
  highlights: [
    '✨ Vị trí: [Mô tả vị trí]',
    '🏗️ Tiến độ: [Thời gian bàn giao]',
    '💰 Giá: [Khoảng giá]',
    '📜 Pháp lý: [Tình trạng pháp lý]'
  ],
  cta: 'Liên hệ ngay để được tư vấn!',
  hashtags: '#BatDongSan #BinhDuong #[TenDuAn] #ThachVuLand'
};
```

### Template 2: Ưu Đãi Đặc Biệt

```javascript
const content = {
  headline: '🎁 ưu đãi đặc biệt - [TÊN DỰ ÁN]',
  description: '[Mô tả ưu đãi]',
  highlights: [
    '💰 Chiết khấu: [%]',
    '🎁 Tặng: [Quà tặng]',
    '⏰ Thời gian: [Deadline]',
    '✨ Điều kiện: [Điều kiện áp dụng]'
  ],
  cta: 'Đặt chỗ ngay để nhận ưu đãi!',
  hashtags: '#UuDai #BatDongSan #[TenDuAn]'
};
```

### Template 3: Tin Tức/Cập Nhật

```javascript
const content = {
  headline: '📰 TIN TỨC BẤT ĐỘNG SẢN',
  description: '[Nội dung tin tức]',
  highlights: [
    '📊 [Thông tin 1]',
    '📈 [Thông tin 2]',
    '💡 [Thông tin 3]'
  ],
  cta: 'Liên hệ để biết thêm chi tiết!',
  hashtags: '#TinTucBDS #BinhDuong #ThachVuLand'
};
```

---

## 🔄 MIGRATION - Cập Nhật Posts Cũ

Nếu có posts cũ cần update thông tin liên hệ:

```bash
# Sử dụng caption-helper để update
cd /Users/admin/automation/brands/thachvuland

# Update từng caption
node caption-helper.js "Caption cũ của bạn"
```

Hoặc update trực tiếp trong Google Sheet:
1. Mở sheet: https://docs.google.com/spreadsheets/d/1SNv1t0h-KRXWQ4xANroW5RQN6zHU57OrrXj_OqzfVsY
2. Copy footer template từ row 6 (Caption column)
3. Paste vào các rows cũ

---

## 📚 FILES CREATED/UPDATED

### Created
- `/brands/thachvuland/caption-helper.js` - Caption generator
- `/scripts/test-thachvuland-with-contact.js` - Test script
- `/scripts/drive-uploader/upload-thachvuland.js` - Upload script
- `/docs/THACHVULAND_CONTACT_UPDATE.md` - This file

### Updated
- `/brands/thachvuland/brand.json` - Added contact section
- `/carousel-generator/content/thachvuland-phu-dong-sky-one.json` - Test content

---

## 💡 BEST PRACTICES

1. **Luôn sử dụng caption-helper** khi tạo content mới
2. **Verify caption** trong Sheet trước khi post
3. **Test workflow end-to-end** với content mẫu trước
4. **Backup brand.json** khi có thay đổi lớn
5. **Update templates** khi có thông tin liên hệ mới

---

## 🎯 KẾT LUẬN

✅ **Thông tin liên hệ** đã được cập nhật toàn bộ
✅ **Caption helper** tự động thêm contact info
✅ **Workflow** đã test thành công end-to-end
✅ **Google Sheet** có caption với thông tin đầy đủ
✅ **Templates** sẵn sàng sử dụng cho posts mới

**Mọi bài đăng từ giờ trở đi sẽ tự động có:**
- 📞 Hotline: 0903.469.888
- 📍 Địa chỉ: 32 đường 40 . KDC Vạn Phúc , TP Thủ Đức
- 💬 Zalo: 0903.469.888
- 🌐 Website: thachvuland.com

---

**Created by**: Claude Code (Antigravity)
**Date**: 2026-01-14
**Version**: 1.0.0

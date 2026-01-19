# Hệ Thống Flexible Content Formats - Hướng Dẫn Sử Dụng

## Tổng Quan

Hệ thống đã được nâng cấp để hỗ trợ nhiều loại format linh hoạt, không còn bị giới hạn ở 7 slides carousel.

## Các Format Được Hỗ Trợ

### 1. Single Post (1 ảnh 1200x1200)
**Sử dụng cho:** Quote, announcement, promotion

```bash
node writer.js "Focus on Progress, Not Perfection" --brand longbest --format single
```

**Kết quả:**
- ✅ 1 ảnh vuông 1200x1200px
- ✅ Nội dung gọn gàng, CTA rõ ràng
- ✅ Nhanh nhất (30 giây vs 2 phút carousel)

### 2. Carousel Mini (3-5 ảnh)
**Sử dụng cho:** Quick tips, listicle ngắn

```bash
node writer.js "5 Công Cụ AI Cần Thiết" --brand longbest --format carousel-mini
```

**Kết quả:**
- ✅ 5 ảnh 1080x1350px
- ✅ Structure: Title → 3 content → CTA
- ✅ Phù hợp "X tips/tools/ways"

### 3. Carousel Standard (7 ảnh) - Current Default
**Sử dụng cho:** Tutorial, guide, educational content

```bash
node writer.js "Complete AI Automation Guide" --brand longbest --format carousel-standard
# Hoặc giữ nguyên command cũ (backward compatible)
node writer.js "Complete AI Automation Guide" --brand longbest
```

**Kết quả:**
- ✅ 7 ảnh 1080x1350px (như cũ)
- ✅ Full content với nhiều chi tiết

### 4. Auto-Detect (Khuyên dùng)
**Hệ thống tự động chọn format phù hợp**

```bash
node writer.js "5 Bí Quyết Học AI" --brand longbest --format auto
```

**AI sẽ tự động:**
- Phát hiện số lượng (5) → Carousel mini 5 slides
- Phát hiện "guide/tutorial" → Carousel standard 7 slides
- Phát hiện quote/short → Single post 1 slide

## Auto-Detection Rules

### Các keyword được detect:

**Tips/Listicle (→ carousel-mini):**
- English: tips, ways, tricks, tools, methods, secrets
- Tiếng Việt: công cụ, bí quyết, cách, mẹo, phương pháp, bước

**Tutorial (→ carousel-standard):**
- how to, guide, tutorial, step by step, learn
- hướng dẫn, cách làm, bí quyết

**Quote/Announcement (→ single):**
- Short content (< 25 words)
- Starts with quotes ("...")
- Keywords: announcement, news, update

## Ví Dụ Thực Tế

### Ví dụ 1: Single Post cho Quote
```bash
node writer.js "Tiến bộ quan trọng hơn hoàn hảo" --brand longbest --format single
```
→ 1 ảnh motivational quote 1200x1200px

### Ví dụ 2: Auto-detect cho Tips
```bash
node writer.js "7 Mẹo Tối Ưu Prompt" --brand longbest --format auto
```
→ AI detect: "7 mẹo" → carousel-standard (vì 7 > 5)

### Ví dụ 3: Force 3 slides
```bash
node writer.js "Top AI Tools 2026" --brand longbest --format carousel-mini --slides 3
```
→ Force exactly 3 slides

### Ví dụ 4: Square format (1:1)
```bash
node writer.js "5 AI Tips" --brand longbest --format carousel-mini --ratio 1:1
```
→ 5 slides với kích thước 1080x1080px thay vì 1080x1350px

## Tham Số CLI

```bash
node writer.js "Topic" [options]

Options:
  --brand <name>      Brand (longbest, thachvuland, queennailbern)
  --format <type>     Format type:
                      - auto (khuyên dùng)
                      - single
                      - carousel-mini
                      - carousel-standard
                      - carousel-long
  --type <type>       Content type (quote, tips, tutorial, etc.)
  --style <style>     Design style (classic, notebook-typography)
  --ratio <ratio>     Aspect ratio (4:5, 1:1) - default: 4:5
  --slides <count>    Force specific slide count
```

## So Sánh Format

| Format | Slides | Kích thước | Thời gian | Use Case |
|--------|--------|------------|-----------|----------|
| Single | 1 | 1200x1200 | ~30s | Quote, announcement |
| Carousel Mini | 3-5 | 1080x1350 | ~1min | Quick tips, listicle |
| Carousel Standard | 7 | 1080x1350 | ~2min | Tutorial, guide (current) |
| Carousel Long | 10+ | 1080x1350 | ~3min | Case study, comprehensive |

## Migration từ Hệ Thống Cũ

### Backward Compatible
✅ Tất cả command cũ vẫn hoạt động bình thường:

```bash
# Command cũ (vẫn work)
node writer.js "AI Tips" --brand longbest

# Tương đương với
node writer.js "AI Tips" --brand longbest --format auto
```

### Nâng cấp dần
```bash
# Thay vì tạo 7 slides cho quote
node writer.js "Focus on Progress" --brand longbest

# Bây giờ tối ưu hơn
node writer.js "Focus on Progress" --brand longbest --format single
```

## Best Practices

### 1. Dùng Auto-Detect
```bash
# ✅ Tốt - để AI chọn format phù hợp
node writer.js "5 AI Tools" --brand longbest --format auto

# ❌ Không cần thiết
node writer.js "5 AI Tools" --brand longbest --format carousel-mini --slides 5
```

### 2. Single cho Content Ngắn
```bash
# ✅ Tốt - 1 ảnh đủ
node writer.js "New Year Offer 50% Off" --brand longbest --format single

# ❌ Lãng phí - 7 ảnh cho 1 announcement
node writer.js "New Year Offer 50% Off" --brand longbest --format carousel-standard
```

### 3. Carousel Mini cho Listicle 3-5
```bash
# ✅ Tốt - vừa đủ
node writer.js "3 Bước Học AI" --brand longbest --format carousel-mini

# ❌ Dài dòng - 7 ảnh cho 3 bước
node writer.js "3 Bước Học AI" --brand longbest --format carousel-standard
```

## Troubleshooting

### Q: Format không đúng như mong đợi?
**A:** Thử force format:
```bash
# Thay vì auto
node writer.js "Topic" --brand longbest --format auto

# Force specific format
node writer.js "Topic" --brand longbest --format single
```

### Q: Muốn bao nhiêu slides cũng được?
**A:** Dùng `--slides`:
```bash
node writer.js "Topic" --brand longbest --format carousel-mini --slides 4
```

### Q: Kích thước ảnh không phù hợp?
**A:** Chọn aspect ratio:
```bash
# Portrait 4:5 (mặc định) - chiếm nhiều màn hình mobile
--ratio 4:5

# Square 1:1 - đơn giản, gọn gàng
--ratio 1:1
```

## Files Được Tạo Mới

```
automation/
├── brands/_templates/
│   └── content-formats.json          # Format configuration
├── scripts/utils/
│   └── format-utils.js                # Format utilities
├── scripts/agent-writer/
│   ├── writer.js                      # Updated với flexible format
│   └── writer.js.backup               # Backup file cũ
└── docs/
    ├── FLEXIBLE_CONTENT_FORMATS.md    # Design doc
    └── USAGE_GUIDE.md                 # File này
```

## Các File Cần Update Tiếp

### Image Generator (Next Step)
`scripts/carousel-generator/generator.js` cần update để:
- Đọc `formatType` và `dimensions` từ JSON
- Hỗ trợ single post template (1 ảnh)
- Hỗ trợ flexible dimensions

### Uploader (Minor Update)
`scripts/drive-uploader/upload.js`:
- Pass format metadata to Google Sheets
- Handle variable image counts

### Daily Agent (Minor Update)
`scripts/daily-agent.js`:
- Pass `--format` parameter through pipeline

## Testing Checklist

- [x] Single post format (1 slide, 1200x1200)
- [x] Carousel mini auto-detect (5 slides from "5 công cụ")
- [x] Carousel standard auto-detect (7 slides)
- [x] Vietnamese keyword detection
- [ ] Image generation for single post
- [ ] Image generation for carousel mini
- [ ] Full pipeline test (writer → generator → uploader)
- [ ] Multi-brand test (longbest, thachvuland, queennailbern)

## Roadmap

### Phase 1: MVP (Done ✅)
- [x] Config system
- [x] Format utilities
- [x] Writer update
- [x] Auto-detection
- [x] Testing

### Phase 2: Image Generator (Next)
- [ ] Update generator.js
- [ ] Single post template
- [ ] Flexible dimensions
- [ ] Testing

### Phase 3: Full Integration
- [ ] Update uploader
- [ ] Update daily-agent
- [ ] End-to-end testing
- [ ] Documentation

### Phase 4: Advanced Features
- [ ] More formats (story, cover, etc.)
- [ ] Template library
- [ ] A/B testing support
- [ ] Analytics-driven format selection

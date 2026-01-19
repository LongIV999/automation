# Hướng dẫn đăng carousel lên Queen Nail Bern

## Đã hoàn thành

✅ Tạo 7 slides carousel chất lượng cao tại: `output/queennail-post-1768284788/`
✅ Slide 01: Canvas-generated artwork (museum quality)
✅ Slides 02-07: Professional Puppeteer rendering
✅ Design philosophy document đã được tạo

## Các file đã sẵn sàng

```
output/queennail-post-1768284788/
├── 01.png - Hero slide (Canvas artwork)
├── 02.png - Mức lương hấp dẫn
├── 03.png - Hỗ trợ toàn diện
├── 04.png - Yêu cầu chuyên môn
├── 05.png - Kỹ thuật bột và gel
├── 06.png - Điều kiện ứng tuyển
├── 07.png - CTA (Call to action)
├── content.json
└── _design-philosophy.md
```

## Caption để đăng

```
💅 Tuyển Dụng Thợ Nail Chuyên Nghiệp - Queen Nail Bern

Hỗ Trợ Toàn Diện:
✨ Hỗ trợ làm giấy tờ lao động hợp pháp tại Thụy Sĩ
✨ Hỗ trợ sắp xếp chỗ ở tiện nghi, gần nơi làm việc
✨ Đào tạo nâng cao kỹ thuật theo xu hướng mới nhất

Địa chỉ: Kramgasse 37, 3011 Bern, Schweiz
Hotline: +41 79 805 00 68
Gửi tin nhắn ngay để đặt lịch trao đổi.

#QueenNailBern #NailSalon #Bern #NailArt #Nagelstudio #BeautyBern
```

## Cách đăng

### Phương pháp 1: Facebook Business Suite (Khuyến nghị)

1. Mở https://business.facebook.com/
2. Chọn Queen Nail Bern page
3. Click "Create Post"
4. Upload 7 ảnh theo thứ tự (01.png → 07.png)
5. Paste caption ở trên
6. Click "Publish"

### Phương pháp 2: Facebook Page trực tiếp

1. Truy cập https://facebook.com/queennailbern
2. Click "Create Post"
3. Click biểu tượng ảnh
4. Chọn multiple photos (Ctrl/Cmd + Click)
5. Upload 7 ảnh
6. Paste caption
7. Post

### Phương pháp 3: Facebook Mobile App

1. Mở Facebook app trên điện thoại
2. Chuyển sang Queen Nail Bern page
3. Tap "Create post"
4. Tap camera icon → Select multiple
5. Chọn 7 ảnh
6. Thêm caption
7. Post

## Lý do không thể post tự động

Facebook Graph API có **duplicate detection** rất mạnh:
- Nó nhận ra content/ảnh tương tự ngay cả khi file khác nhau
- Error "These photos were already posted" xuất hiện
- Để tránh spam, Facebook block duplicate content trong 24-48 giờ

## Giải pháp cho lần sau

### Để post tự động được, có thể:

1. **Đợi 24-48 giờ** sau mỗi post
2. **Thêm unique element** vào mỗi ảnh (timestamp watermark)
3. **Sử dụng Facebook Scheduler** thay vì instant posting
4. **Post qua Meta Business Tools** với scheduling

### Script tự động (đã chuẩn bị)

File `quick-post.js` đã sẵn sàng để post khi:
- Content hoàn toàn mới (không duplicate)
- Hoặc đã qua 48 giờ từ lần post cuối

## Kết quả

Carousel đã được tạo thành công với:
- ✨ Design philosophy: "Welcoming Clarity"
- 🎨 Canvas artwork cho hero slide
- 📱 7 slides tổng cộng, tối ưu cho Instagram/Facebook
- ⏱️ Generation time: ~8.5 seconds
- 📏 Dimensions: 1080x1350 (4:5 ratio)

## Next Steps

1. ✅ **Post carousel** lên Facebook/Instagram (manual)
2. 📊 **Track engagement** sau 24-48 giờ
3. 💬 **Respond to comments** về recruitment
4. 📈 **Analyze performance** và adjust cho lần sau

---

**Note**: Để post tự động trong tương lai, consider sử dụng:
- Meta Business Suite Scheduler
- Buffer hoặc Hootsuite
- Facebook API với sufficient delay between posts

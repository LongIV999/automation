# 📰 News Scraper & Publishing System

Hệ thống tự động quét tin tức bất động sản và xuất bản với phân tích AI.

## 🚀 Quy trình hoạt động

1. **Scraping**: Quét tin từ Cafef và Batdongsan.com.vn.
2. **Analysis**: (Simulated) Thêm phần "Phân tích từ Thạch Vũ".
3. **Publishing**: Cập nhật vào `data/articles.json`.

## 🛠 Hướng dẫn sử dụng

### 1. Cài đặt
```bash
cd scripts/news-scraper
npm install
```

### 2. Quét tin mới
```bash
node scraper.js
```
Kết quả sẽ được lưu vào `scraped_news.json`.

### 3. Xuất bản tin
```bash
node publisher.js
```
Tin sẽ được đẩy vào hồ sơ dữ liệu tại `data/articles.json`.

## ⚙️ Cấu hình

- `scraper.js`: Chứa danh sách các trang web mục tiêu và các selector CSS để lấy dữ liệu.
- `publisher.js`: Chứa logic xử lý nội dung và định dạng bài viết cuối cùng.

## 📅 Lộ trình tích hợp n8n

Bạn có thể tạo một workflow n8n để chạy các lệnh này định kỳ (ví dụ: mỗi 4 tiếng):
- **Cron Node**: 0 */4 * * *
- **Execute Command**: `node /path/to/scraper.js`
- **Execute Command**: `node /path/to/publisher.js`

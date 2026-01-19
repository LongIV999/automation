# Facebook Auto Publisher - Giải Pháp Rate Limit

## 🎯 Vấn đề đã giải quyết

Script này giải quyết **vấn đề rate limit** khi đăng nhiều bài lên Facebook qua n8n:
- ✅ Hỗ trợ đăng **10-20 bài/ngày** an toàn
- ✅ Tự động **rate limiting** để tránh bị Facebook chặn
- ✅ **Queue system** thông minh với retry mechanism
- ✅ Tích hợp **Google Sheets** để quản lý content
- ✅ **Scheduler** tự động chạy theo lịch

## 📊 Giới hạn của Facebook

Facebook Graph API có các giới hạn sau:
- **200 calls/user/hour**
- Khuyến nghị: **Tối đa 25 posts/day** để tránh spam

Script này đã được config an toàn:
- **4 posts/hour** (tránh vượt rate limit)
- **20 posts/day** (phù hợp với yêu cầu 10-20 bài/ngày)
- **15 phút** giữa mỗi bài (tránh spam)

## 🚀 Cài đặt

### 1. Install dependencies

```bash
cd /Users/admin/automation/scripts/facebook-auto-publisher
npm install
```

### 2. Tạo Facebook Access Token

#### Bước 1: Vào Facebook Graph API Explorer
👉 https://developers.facebook.com/tools/explorer/

#### Bước 2: Chọn app và page
- Chọn app của bạn
- Chọn "Get Page Access Token"
- Chọn Facebook Page bạn muốn đăng

#### Bước 3: Cấp quyền (permissions)
Nhấn "Add a permission" và thêm:
- ✅ `pages_show_list`
- ✅ `pages_read_engagement`
- ✅ `pages_manage_posts`

#### Bước 4: Generate Token
- Nhấn "Generate Access Token"
- Copy token (dạng: EAAG...)

#### Bước 5: Lấy Page ID
```bash
# Chạy lệnh này để lấy Page ID
curl "https://graph.facebook.com/v22.0/me?access_token=YOUR_TOKEN"
```

### 3. Config .env file

```bash
cp .env.example .env
nano .env
```

Điền thông tin:
```
FB_PAGE_ID=827345413796018
FB_ACCESS_TOKEN=EAAGxxxxxxxxxxxxx
```

## 📖 Hướng dẫn sử dụng

### Cách 1: Thêm bài thủ công

```bash
# Đăng 1 ảnh
node publisher.js add "Caption của bạn #hashtag" /path/to/image.jpg

# Đăng carousel (nhiều ảnh)
node publisher.js add "Caption carousel #AI #Tech" /path/to/1.jpg /path/to/2.jpg /path/to/3.jpg

# Xử lý queue (đăng bài)
node publisher.js process

# Xem thống kê
node publisher.js stats
```

### Cách 2: Tích hợp Google Sheets (Khuyến nghị)

#### Setup Google Sheets

Tạo sheet với các cột:
| Date | Caption | Drive_Folder_ID | Status | Post_URL |
|------|---------|----------------|--------|----------|
| 2026-01-10 | Caption text | 1AbCd... | Ready | |

#### Sync từ Sheets vào Queue

```bash
# Đọc posts từ Google Sheets và thêm vào queue
node sheets-integration.js

# Xử lý queue
node publisher.js process
```

### Cách 3: Chạy scheduler tự động (Recommended)

Scheduler sẽ tự động:
- Check queue mỗi 20 phút
- Chỉ chạy trong giờ hoạt động (7h-22h)
- Tự động đăng bài khi có posts trong queue

```bash
# Chạy scheduler
node scheduler.js

# Hoặc dùng PM2 để chạy liên tục
npm install -g pm2
pm2 start scheduler.js --name facebook-scheduler
pm2 save
pm2 startup
```

## 🔄 Workflow hoàn chỉnh

### Option A: Tích hợp với automation hiện tại

```bash
# 1. Tạo content bằng daily-agent (như hiện tại)
cd /Users/admin/automation/scripts
node daily-agent.js "Topic của bạn" --brand longbest

# 2. Sync từ Sheets vào queue
cd facebook-auto-publisher
node sheets-integration.js

# 3. Scheduler tự động đăng (đã chạy sẵn ở background)
```

### Option B: Script tự động toàn bộ

Tạo file `auto-workflow.sh`:
```bash
#!/bin/bash

# Tạo content
cd /Users/admin/automation/scripts
node daily-agent.js "$1" --brand longbest

# Sync to queue
cd facebook-auto-publisher
node sheets-integration.js

# Process queue ngay
node publisher.js process
```

Chạy:
```bash
chmod +x auto-workflow.sh
./auto-workflow.sh "5 AI Tools You Must Know"
```

## 📊 Giải thích cơ chế

### Queue System

```
[Google Sheets]
    ↓ (sheets-integration.js)
[Queue File] (queue.json)
    ↓ (publisher.js process)
[Facebook Graph API]
    ↓
[Update Status in Sheets]
```

### Rate Limiting Logic

```javascript
Mỗi lần đăng bài:
1. Check: Đã đăng < 20 bài hôm nay? ✓
2. Check: Đã đăng < 4 bài giờ này? ✓
3. Check: Đã đợi >= 15 phút từ bài trước? ✓
4. → OK, đăng bài
5. → Lưu trạng thái (state.json)
```

### Retry Mechanism

```
Post failed → Retry 1 (sau 5s)
Still failed → Retry 2 (sau 5s)
Still failed → Retry 3 (sau 5s)
Still failed → Mark as "failed"
```

## 📁 Cấu trúc files

```
facebook-auto-publisher/
├── publisher.js           # Main publisher với rate limiting
├── scheduler.js          # Auto scheduler (chạy định kỳ)
├── sheets-integration.js # Sync từ Google Sheets
├── package.json          # Dependencies
├── .env                  # Config (FB token, page ID)
├── queue.json           # Queue data (auto tạo)
├── state.json           # Publishing state (auto tạo)
├── publisher.log        # Logs
└── temp/                # Downloaded images (auto tạo)
```

## 🔧 Tuning Parameters

Sửa trong `publisher.js`:

```javascript
const CONFIG = {
    MIN_DELAY_BETWEEN_POSTS: 15 * 60 * 1000,  // 15 phút → Giảm xuống 10 phút nếu muốn nhanh hơn
    MAX_POSTS_PER_HOUR: 4,                     // 4 bài/giờ → Tăng lên 5-6 nếu cần
    MAX_POSTS_PER_DAY: 20,                     // 20 bài/ngày → Tăng lên 25 tối đa

    MAX_RETRIES: 3,      // Số lần retry
    RETRY_DELAY: 5000,   // Đợi bao lâu trước khi retry
};
```

## ⚠️ Lưu ý quan trọng

### 1. Token Security
- **KHÔNG** commit `.env` file vào git
- Token có thể hết hạn sau 60 ngày (long-lived token)
- Cần refresh token định kỳ

### 2. Rate Limits
- Đừng set quá agressive (giảm delay, tăng posts/hour)
- Facebook có thể ban account nếu spam
- Khuyến nghị: Giữ nguyên config mặc định

### 3. Image Storage
- Images được download vào `temp/` folder
- Cleanup định kỳ để tiết kiệm dung lượng:
  ```bash
  rm -rf temp/*
  ```

### 4. Queue Management
- Queue được lưu trong `queue.json`
- Nếu muốn reset queue:
  ```bash
  rm queue.json state.json
  ```

## 🐛 Troubleshooting

### Lỗi: "FB_ACCESS_TOKEN not set"
**Giải pháp:** Check file `.env` có đúng format và token

### Lỗi: "Rate limit exceeded"
**Giải pháp:** Đợi 1 giờ, hoặc giảm `MAX_POSTS_PER_HOUR`

### Lỗi: "Invalid OAuth access token"
**Giải pháp:** Token hết hạn, generate lại token mới

### Queue không chạy
**Giải pháp:**
```bash
# Check queue status
node publisher.js stats

# Check logs
tail -f publisher.log

# Manual process
node publisher.js process
```

## 📈 So sánh với n8n workflow

| Feature | n8n Workflow | Script này |
|---------|--------------|------------|
| Rate limiting | ❌ Không có | ✅ Có sẵn |
| Retry mechanism | ⚠️ Basic | ✅ Smart retry |
| Queue system | ❌ Không | ✅ Persistent queue |
| Scheduler | ✅ Có | ✅ Có |
| Sheets integration | ✅ Có | ✅ Có |
| Error recovery | ⚠️ Limited | ✅ Full recovery |
| **Posts/day** | **5-10** | **10-20** ✅ |

## 🚀 Next Steps

### 1. Setup cron job (Linux/Mac)
```bash
crontab -e

# Thêm dòng này (chạy mỗi 30 phút)
*/30 * * * * cd /Users/admin/automation/scripts/facebook-auto-publisher && node publisher.js process >> cron.log 2>&1
```

### 2. Setup PM2 (Recommended)
```bash
pm2 start scheduler.js --name fb-scheduler
pm2 startup
pm2 save
```

### 3. Monitor logs
```bash
# Real-time logs
tail -f publisher.log

# PM2 logs
pm2 logs fb-scheduler
```

## 📞 Support

Nếu gặp vấn đề:
1. Check logs: `tail -f publisher.log`
2. Check queue stats: `node publisher.js stats`
3. Verify token: Visit https://developers.facebook.com/tools/debug/accesstoken/

## 📚 References

- [Facebook Graph API Docs](https://developers.facebook.com/docs/graph-api)
- [Rate Limiting Best Practices](https://developers.facebook.com/docs/graph-api/overview/rate-limiting)
- [Page Publishing Guide](https://developers.facebook.com/docs/pages/publishing)

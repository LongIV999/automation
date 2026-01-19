# Facebook Auto Publisher - Quick Start

## ⚡ Cài đặt nhanh (5 phút)

### 1. Install
```bash
cd /Users/admin/automation/scripts/facebook-auto-publisher
npm install
```

### 2. Setup Facebook Token

1. Truy cập: https://developers.facebook.com/tools/explorer/
2. Chọn Page → Generate Access Token
3. Cấp quyền: `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`
4. Copy token

### 3. Config
```bash
cp .env.example .env
nano .env
```

Paste token vào:
```
FB_ACCESS_TOKEN=EAAGxxxxxx...
```

### 4. Test
```bash
# Test đăng 1 bài
node publisher.js add "Test post #AI" /path/to/image.jpg
node publisher.js process
```

## 🎯 Sử dụng hàng ngày

### Option 1: Tự động hoàn toàn
```bash
# Chạy 1 lần, sau đó tự động
pm2 start scheduler.js --name fb-scheduler
pm2 save
```

Xong! Scheduler sẽ:
- Tự động check queue mỗi 20 phút
- Tự động đăng bài khi có content
- Chỉ chạy trong giờ 7h-22h

### Option 2: Workflow script
```bash
./auto-workflow.sh "5 AI Tools for 2026"
```

### Option 3: Thủ công
```bash
# Sync từ Google Sheets
node sheets-integration.js

# Đăng bài
node publisher.js process

# Xem stats
node publisher.js stats
```

## ❓ FAQ

**Q: Đăng được bao nhiêu bài/ngày?**
A: 10-20 bài/ngày, tự động rate limiting

**Q: Token hết hạn phải làm sao?**
A: Generate token mới và cập nhật `.env`

**Q: Queue bị stuck?**
A: `node publisher.js stats` để check, `node publisher.js process` để force chạy

**Q: Muốn đăng nhanh hơn?**
A: Sửa `MIN_DELAY_BETWEEN_POSTS` trong `publisher.js`

## 📊 Monitoring

```bash
# Realtime logs
tail -f publisher.log

# Queue status
node publisher.js stats

# PM2 status
pm2 status
pm2 logs fb-scheduler
```

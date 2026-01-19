# QUICK REFERENCE - Câu Lệnh Thường Dùng

## 🚀 TẠO CONTENT VÀ ĐĂNG BÀI

### Lệnh chính - Full Auto Workflow
```bash
cd /Users/admin/automation/scripts/facebook-auto-publisher
./full-auto-workflow.sh "Topic của bạn"
```

### Ví dụ cụ thể
```bash
# AI Tools
./full-auto-workflow.sh "10 Công Cụ AI Miễn Phí 2026"

# Tutorial
./full-auto-workflow.sh "7 Bước Tạo Video AI Chuyên Nghiệp"

# Tips
./full-auto-workflow.sh "5 Sai Lầm Khi Dùng ChatGPT"

# Marketing
./full-auto-workflow.sh "Chiến Lược Content Marketing 2026"

# Real Estate (Thạch Vũ Land)
./full-auto-workflow.sh "10 Nội Dung Bất Động Sản Thu Hút Khách" thachvuland
```

---

## 📊 MONITORING

### Check status
```bash
# Queue status
node publisher.js stats

# PM2 status
pm2 status

# Realtime logs
pm2 logs fb-scheduler
```

### View logs
```bash
# Publisher logs
tail -f publisher.log

# Scheduler logs
tail -f scheduler.log

# Last 100 lines
pm2 logs fb-scheduler --lines 100
```

---

## ⚙️ QUẢN LÝ SCHEDULER

### Start/Stop
```bash
# Start
pm2 start scheduler.js --name fb-scheduler

# Stop
pm2 stop fb-scheduler

# Restart
pm2 restart fb-scheduler

# Delete
pm2 delete fb-scheduler
```

### Save settings
```bash
# Save process list
pm2 save

# View saved processes
pm2 list
```

---

## 🔧 OPERATIONS

### Sync từ Google Sheets
```bash
node sheets-integration.js
```

### Manual publish
```bash
# Add to queue
node publisher.js add "Caption text" /path/to/img1.jpg /path/to/img2.jpg

# Process queue ngay
node publisher.js process
```

### Reset queue
```bash
rm queue.json state.json
```

---

## 📁 PATHS QUAN TRỌNG

```bash
# Thư mục chính
cd /Users/admin/automation/scripts/facebook-auto-publisher

# View queue
cat queue.json | jq

# View state
cat state.json | jq

# Check logs
ls -lh *.log
```

---

## 🎯 USE CASES PHỔ BIẾN

### 1. Tạo 1 bài mới
```bash
./full-auto-workflow.sh "Your Topic Here"
```

### 2. Tạo nhiều bài (batch)
```bash
./full-auto-workflow.sh "Topic 1"
./full-auto-workflow.sh "Topic 2"
./full-auto-workflow.sh "Topic 3"
```

### 3. Check đã đăng bao nhiêu bài
```bash
node publisher.js stats
```

### 4. Force publish ngay (không đợi scheduler)
```bash
node publisher.js process
```

### 5. Xem bài đã đăng trên Facebook
```
https://facebook.com/827345413796018
```

---

## ⚡ SHORTCUTS

### Alias (thêm vào ~/.zshrc hoặc ~/.bashrc)
```bash
# Facebook publisher aliases
alias fbp='cd /Users/admin/automation/scripts/facebook-auto-publisher'
alias fbcreate='./full-auto-workflow.sh'
alias fbstats='node publisher.js stats'
alias fblogs='pm2 logs fb-scheduler'
alias fbsync='node sheets-integration.js'
```

### Sau khi thêm alias
```bash
source ~/.zshrc  # hoặc ~/.bashrc

# Sử dụng
fbp              # Go to folder
fbcreate "Topic" # Create content
fbstats          # View stats
fblogs           # View logs
```

---

## 🔥 ONE-LINERS

```bash
# Tạo content và check stats
./full-auto-workflow.sh "Topic" && node publisher.js stats

# Monitor realtime
watch -n 10 'node publisher.js stats'

# Check scheduler health
pm2 status fb-scheduler | grep online && echo "✅ Running" || echo "❌ Down"

# Count posts today
cat state.json | jq '.postsToday'
```

---

## 📞 SUPPORT

**Files tài liệu:**
- `README.md` - Hướng dẫn đầy đủ
- `QUICKSTART.md` - Quick start
- `BAO_CAO_KET_QUA.md` - Báo cáo chi tiết
- `SUCCESS.md` - Thông tin hệ thống

**Troubleshooting:**
Xem phần "Troubleshooting" trong BAO_CAO_KET_QUA.md

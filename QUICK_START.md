# 🚀 Daily Content Assistant - Quick Start Guide

## 📋 Tổng Quan

Tool tự động hóa toàn bộ quy trình tạo content cho 3 fanpage:
- **Long Best AI** 🤖 - AI & Technology content
- **Thach Vu Land** 🏠 - Real Estate content  
- **Queen Nail Bern** 💅 - Nail Art content

## 🎯 Cách Sử Dụng

### Method 1: Interactive CLI (Recommended)

```bash
cd /Users/admin/automation
node scripts/daily-content-assistant.js
```

Tool sẽ hỏi 3 câu hỏi:
1. **Chủ đề** - Nhập topic hoặc paste link bài viết
2. **Định dạng** - Chọn format (Single/Carousel Mini/Carousel Standard/Auto)
3. **Fanpage** - Chọn brand để đăng

### Method 2: Command Line

```bash
# Long Best AI
node scripts/daily-agent-monitored.js "AI Tools 2024" --brand longbest

# Thach Vu Land  
node scripts/daily-agent-monitored.js "Căn hộ cao cấp" --brand thachvuland

# Queen Nail Bern
node scripts/daily-agent-monitored.js "Nail Trends" --brand queennailbern
```

### Method 3: Auto Scheduler

```bash
# Start daily scheduler (runs automatically)
node scripts/daily-scheduler.js
```

**Schedule Times:**
- Long Best AI: 9:00 AM daily
- Thach Vu Land: 10:30 AM daily  
- Queen Nail Bern: 2:00 PM daily

## 📊 Monitoring

### Real-time Dashboard
```bash
# Terminal 1 - Start monitor
node scripts/workflow-monitor/monitor.js

# Terminal 2 - Start dashboard server
node scripts/workflow-monitor/server.js

# Open dashboard
open http://localhost:3002
```

### Features:
- ✅ Real-time workflow tracking
- 📊 Success/failure metrics
- ⏱️ Performance analytics
- 🔄 Error recovery suggestions

## 🔧 Cấu Hình

### Environment Variables
```bash
# Claude API
CLAUDE_API_KEY=your_claude_api_key

# Google Drive/Sheets
GOOGLE_DRIVE_CREDENTIALS=path/to/credentials.json

# Facebook Access Tokens
LONGBEST_ACCESS_TOKEN=your_longbest_token
THACHVULAND_ACCESS_TOKEN=your_thachvuland_token
QUEENNAILBERN_ACCESS_TOKEN=your_queennailbern_token

# Facebook Page IDs
LONGBEST_PAGE_ID=your_longbest_page_id
THACHVULAND_PAGE_ID=your_thachvuland_page_id
QUEENNAILBERN_PAGE_ID=your_queennailbern_page_id
```

### Brand Configuration
Mỗi brand có file config tại `brands/{brand}/brand.json`:
- Colors & Typography
- Social media accounts
- Content templates
- Posting schedules

## 📁 File Structure

```
automation/
├── scripts/
│   ├── daily-content-assistant.js     # Interactive CLI tool
│   ├── daily-agent-monitored.js       # Monitored workflow
│   ├── daily-scheduler.js             # Auto scheduler
│   ├── workflow-monitor/              # Monitoring system
│   ├── facebook-auto-publisher/       # Facebook integration
│   └── drive-uploader/                # Google Drive integration
├── brands/                            # Brand configurations
│   ├── longbest-ai/
│   ├── thachvuland/
│   └── queennailbern/
├── output/                            # Generated content
└── data/                              # Analytics database
```

## 🚀 Workflow Pipeline

```
Input Topic → AI Writer → Image Generator → Image Enhancer → Drive Upload → Facebook Publish
     ↓              ↓              ↓              ↓              ↓              ↓
  User Input    Claude API    Puppeteer      Sharp         Google APIs   Facebook API
```

## 📱 Auto-Publish Features

- **Immediate Publish**: Đăng ngay sau khi tạo content
- **Scheduled Publish**: Đăng theo lịch trình
- **Multi-Image Support**: Carousel posts
- **Brand-Specific Captions**: Auto-generate hashtags
- **Error Handling**: Retry failed posts

## 🎨 Content Formats

### Single Post (1 ảnh)
- ⚡ Nhanh nhất
- 📱 Perfect cho quick updates
- 🎯 High engagement

### Carousel Mini (3-5 ảnh)
- 📊 Good for tutorials
- 🔄 Step-by-step content
- 💡 Educational posts

### Carousel Standard (7 ảnh)
- 📚 Comprehensive content
- 🎨 Full storytelling
- 🏆 Maximum engagement

## 📈 Analytics & Reporting

### Database Tracking
- Post performance metrics
- Workflow execution times
- Success/failure rates
- Brand comparisons

### Dashboard Metrics
- Real-time workflow status
- Daily/weekly/monthly stats
- Error tracking
- Performance insights

## 🛠️ Troubleshooting

### Common Issues

**1. Puppeteer Timeout**
```bash
# Use fast mode
node scripts/daily-agent-monitored.js "Topic" --brand longbest --fast
```

**2. Claude API Error**
```bash
# Check API key
echo $CLAUDE_API_KEY
```

**3. Facebook Publish Failed**
```bash
# Test Facebook connection
node scripts/facebook-auto-publisher/test-connection.js
```

**4. Monitor Not Running**
```bash
# Restart monitor
pkill -f monitor.js
node scripts/workflow-monitor/monitor.js &
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=true node scripts/daily-content-assistant.js
```

## 📞 Support

### Logs
- Application logs: `logs/`
- Error logs: `logs/errors.log`
- Workflow logs: `logs/workflows.log`

### Monitoring
- Dashboard: http://localhost:3002
- WebSocket: ws://localhost:3001
- Database: `data/analytics.db`

## 🎉 Success Examples

### Long Best AI
```
Topic: "AI Tools for Business 2024"
Format: Carousel Standard (7 ảnh)
Result: ✅ Published at 9:05 AM
Engagement: 245 likes, 38 shares
```

### Thach Vu Land
```
Topic: "Căn hộ cao cấp Quận 2"
Format: Carousel Mini (5 ảnh)
Result: ✅ Published at 10:35 AM
Engagement: 189 likes, 27 shares
```

### Queen Nail Bern
```
Topic: "Winter Nail Trends 2024"
Format: Single (1 ảnh)
Result: ✅ Published at 2:05 PM
Engagement: 156 likes, 22 shares
```

---

## 🚀 Ready to Start?

1. **Configure environment variables**
2. **Start monitoring dashboard**
3. **Run interactive CLI tool**
4. **Watch your content go live!**

Need help? Check the logs or view the real-time dashboard!
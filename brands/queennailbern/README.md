# Queen Nail Bern - Automation Guide

Hệ thống tự động hóa hoàn chỉnh cho Queen Nail Bern fanpage - từ tạo nội dung đến đăng bài tự động.

---

## 📋 Tổng Quan Hệ Thống

### Quy Trình Tự Động Hóa (5 Bước)

```
1. TOPIC INPUT
   ↓
2. AI CONTENT WRITER (Claude) → Tạo nội dung tiếng Đức
   ↓
3. IMAGE GENERATOR (Puppeteer) → Tạo 7 carousel images
   ↓
4. DRIVE UPLOADER → Upload lên Google Drive + cập nhật Google Sheets
   ↓
5. FACEBOOK AUTO-POST (n8n) → Đăng tự động theo lịch
```

### Tính Năng Chính

✅ **AI Content Generation** - Tạo nội dung tiếng Đức chuyên nghiệp
✅ **Brand-Specific Design** - Thiết kế theo phong cách nail salon (pink/elegant)
✅ **Google Sheets Integration** - Quản lý lịch đăng bài
✅ **Google Drive Storage** - Lưu trữ và chia sẻ images
✅ **Facebook Auto-Posting** - Đăng bài tự động 5x/tuần
✅ **Multi-Brand Support** - Hoạt động song song với Long Best AI & Thach Vu Land

---

## 🚀 Quick Start Guide

### Bước 1: Verify Setup

Chạy test để đảm bảo mọi thứ đã sẵn sàng:

```bash
cd /Users/admin/automation/brands/queennailbern
./test-workflow.sh
```

Kết quả mong đợi: **12/12 tests PASSED** ✅

### Bước 2: Setup Google Sheets

Xem hướng dẫn chi tiết: [`GOOGLE_SHEETS_SETUP.md`](GOOGLE_SHEETS_SETUP.md)

**Tóm tắt:**
1. Tạo Google Sheet mới: "Queen Nail Bern - Content Calendar"
2. Tạo 4 tabs: `Content_Calendar`, `Posts`, `Archive`, `Analytics`
3. Share với service account email
4. Copy Sheet ID vào `brand.json`

### Bước 3: Setup Facebook Integration

Xem hướng dẫn chi tiết: [`FACEBOOK_SETUP.md`](FACEBOOK_SETUP.md)

**Tóm tắt:**
1. Lấy Facebook Page ID
2. Tạo Facebook App
3. Generate Page Access Token
4. Configure n8n workflow
5. Test posting

### Bước 4: Generate Content Đầu Tiên

```bash
cd /Users/admin/automation
node scripts/daily-agent.js "5 Nageltrends für Winter 2026" --brand queennailbern
```

Quá trình này sẽ:
- ✍️ Tạo nội dung tiếng Đức (7 slides)
- 🎨 Generate 7 carousel images (1080x1350px)
- 🪄 Enhance images (sharpen, optimize)
- ☁️ Upload lên Google Drive
- 📊 Update Google Sheets

**Thời gian:** ~2-3 phút

### Bước 5: Schedule Post

1. Mở Google Sheet
2. Vào tab `Content_Calendar`
3. Tìm row vừa tạo
4. Set:
   - **Date:** 2026-01-13
   - **Status:** `scheduled`
5. n8n sẽ tự động đăng vào đúng giờ!

---

## 📅 Lịch Đăng Bài Mặc Định

| Thứ | Giờ (Zurich) | Loại Content | Theme |
|-----|--------------|--------------|-------|
| **Thứ 2** | 10:00 | Nail Designs | "Monday Motivation Nails" |
| **Thứ 3** | 15:00 | Tips & Care | "Tuesday Tips" |
| **Thứ 4** | 10:00 | Nail Designs | "Midweek Glam" |
| **Thứ 5** | 18:00 | Promotions | "Thursday Treats" |
| **Thứ 6** | 12:00 | Customer Reviews | "Friday Features" |

**Tổng:** 5 bài/tuần = 20 bài/tháng

---

## 💡 Content Ideas Library

### Nail Designs (40% nội dung)
```bash
node scripts/daily-agent.js "5 Trendige Nageldesigns für Winter 2026" --brand queennailbern
node scripts/daily-agent.js "French Manicure: Zeitlos & Elegant" --brand queennailbern
node scripts/daily-agent.js "Ombre Nails: Der Farbverlauf-Trend" --brand queennailbern
node scripts/daily-agent.js "Business Nails: Professionell & Stylish" --brand queennailbern
```

### Tips & Care (20% nội dung)
```bash
node scripts/daily-agent.js "7 Tipps für gesunde Nägel im Winter" --brand queennailbern
node scripts/daily-agent.js "Nagelpflege zu Hause: Expertenrat" --brand queennailbern
node scripts/daily-agent.js "Die besten Nagelöle für starke Nägel" --brand queennailbern
```

### Promotions (20% nội dung)
```bash
node scripts/daily-agent.js "Neukunden-Special: 20% Rabatt" --brand queennailbern
node scripts/daily-agent.js "Bring a Friend Aktion" --brand queennailbern
```

### Customer Reviews (20% nội dung)
```bash
node scripts/daily-agent.js "Kundin des Monats: Transformation" --brand queennailbern
node scripts/daily-agent.js "5-Sterne Bewertungen im Spotlight" --brand queennailbern
```

---

## 🎨 Brand Identity

**Colors:**
- Primary: Soft Pink `#E8B4C8`
- Background: Light Blush `#FFF5F8`
- Dark: Deep Purple `#2D1B2E`
- Accent: Rose `#C77D9D`

**Typography:**
- Headlines: Playfair Display (elegant, feminine)
- Body: Montserrat (modern, clean)

**Tone:**
- Professional & friendly
- Elegant but approachable
- German formal "Sie" form
- No emojis in content (clean design)

---

## 📂 File Structure

```
/Users/admin/automation/
├── brands/queennailbern/
│   ├── brand.json                    # Brand configuration
│   ├── content/                      # Generated content files
│   ├── CONTENT_STRATEGY.md           # Content planning guide
│   ├── FACEBOOK_SETUP.md             # FB integration guide
│   ├── GOOGLE_SHEETS_SETUP.md        # Sheets setup guide
│   ├── README.md                     # This file
│   └── test-workflow.sh              # Test script
│
├── context-queennailbern.md          # AI content writer context
│
├── scripts/
│   ├── daily-agent.js                # Main orchestrator
│   ├── agent-writer/
│   │   └── writer.js                 # AI content generator
│   ├── carousel-generator/
│   │   ├── generator.js              # Image generator
│   │   ├── enhancer.js               # Image enhancement
│   │   └── content/                  # Generated JSON files
│   └── drive-uploader/
│       └── upload.js                 # Drive upload + Sheets update
```

---

## 🔧 Advanced Usage

### Generate Batch Content (Tuần 1)

```bash
cd /Users/admin/automation

# Monday
node scripts/daily-agent.js "5 Nageltrends Winter 2026" --brand queennailbern

# Tuesday
node scripts/daily-agent.js "7 Tipps für gesunde Nägel" --brand queennailbern

# Wednesday
node scripts/daily-agent.js "French Manicure Guide" --brand queennailbern

# Thursday
node scripts/daily-agent.js "Neukunden-Angebot 20% Rabatt" --brand queennailbern

# Friday
node scripts/daily-agent.js "Kundin des Monats" --brand queennailbern
```

### Customize Brand Settings

Edit `brands/queennailbern/brand.json`:

```json
{
  "posting": {
    "frequency": "5x/week",
    "schedule": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "bestTimes": {
      "Monday": "10:00",
      "Tuesday": "15:00"
    }
  }
}
```

### Update Content Pillars

```json
{
  "contentPillars": [
    "Nail Designs & Trends",
    "Tips & Care",
    "Promotions & Pricing",
    "Customer Reviews",
    "Behind the Scenes"
  ]
}
```

---

## 📊 Analytics & Monitoring

### View Performance in Google Sheets

1. Open your Google Sheet
2. Go to **Analytics** tab
3. Track metrics:
   - Weekly post count
   - Engagement rates
   - Top performing content types
   - Optimal posting times

### Facebook Insights

Monitor on Facebook Page:
- **Reach:** How many people saw posts
- **Engagement:** Likes, comments, shares
- **Best Time to Post:** When audience is online

### Optimize Based on Data

After 2-4 weeks:
1. Analyze which content types perform best
2. Adjust posting schedule based on engagement
3. Focus on top-performing topics
4. Experiment with new content angles

---

## 🚨 Troubleshooting

### Content Generation Issues

**Problem:** AI Writer fails
```bash
# Check API credentials
cat /Users/admin/automation/.claude/settings.json

# Verify context file exists
ls -la /Users/admin/automation/context-queennailbern.md
```

**Problem:** Wrong language (Vietnamese instead of German)
- Verify context file is loaded correctly
- Check brand parameter: `--brand queennailbern`

### Image Generation Issues

**Problem:** Images not generated
```bash
# Check Puppeteer/Chrome installation
which "Google Chrome"

# Test generator manually
cd scripts/carousel-generator
node generator.js "/path/to/content.json" "./output/test"
```

### Upload Issues

**Problem:** Cannot upload to Google Drive
- Check service account credentials
- Verify Drive API is enabled
- Check folder permissions

**Problem:** Sheets not updating
- Verify Sheet ID in brand.json
- Check sheet is shared with service account
- Verify tab names are exact

### Facebook Posting Issues

**Problem:** Auto-post not working
- Check n8n workflow is active
- Verify Page Access Token is valid
- Check post is in "scheduled" status
- Verify date/time is correct

---

## 🔐 Security Checklist

- [ ] Never commit Facebook tokens to git
- [ ] Store tokens in environment variables
- [ ] Use `.gitignore` for secrets
- [ ] Rotate access tokens periodically
- [ ] Limit API permissions to minimum required
- [ ] Monitor for unauthorized access

---

## 🎯 Roadmap & Future Features

**Phase 1 (Current):** ✅
- Content generation in German
- Carousel image creation
- Google Drive integration
- Google Sheets management
- Facebook auto-posting

**Phase 2 (Next):**
- Analytics dashboard
- A/B testing for content
- Customer review aggregation
- Automated responses to comments
- Instagram integration

**Phase 3 (Future):**
- AI-generated nail design images
- Booking integration
- Multi-language support (German + Vietnamese)
- Video content generation

---

## 📚 Additional Resources

### Documentation Files
- [`CONTENT_STRATEGY.md`](CONTENT_STRATEGY.md) - Content planning & ideas
- [`GOOGLE_SHEETS_SETUP.md`](GOOGLE_SHEETS_SETUP.md) - Sheets setup guide
- [`FACEBOOK_SETUP.md`](FACEBOOK_SETUP.md) - Facebook integration guide

### Related Projects
- Long Best AI automation
- Thach Vu Land automation
- Main project README: `/Users/admin/automation/README.md`

### External Links
- [Facebook Graph API Docs](https://developers.facebook.com/docs/graph-api/)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [n8n Documentation](https://docs.n8n.io/)

---

## ✅ Final Checklist

Before going live with Queen Nail Bern automation:

### Setup
- [ ] Brand configuration created
- [ ] Context file for AI writer ready
- [ ] Google Sheet created and configured
- [ ] Service account has access to Sheet
- [ ] Facebook Page ID obtained
- [ ] Facebook Access Token generated
- [ ] n8n workflow created and tested

### Testing
- [ ] Run `test-workflow.sh` - all tests pass
- [ ] Generate test content successfully
- [ ] Images created correctly
- [ ] Upload to Drive works
- [ ] Sheet updates correctly
- [ ] Test Facebook post works

### Content
- [ ] Week 1 content generated (5 posts)
- [ ] Posts scheduled in Google Sheet
- [ ] Content reviewed and approved
- [ ] Visual quality verified

### Monitoring
- [ ] Analytics tracking setup
- [ ] First auto-post successful
- [ ] Error notifications configured
- [ ] Performance metrics baseline established

---

## 📞 Support

Need help? Check:
1. Individual guide files (GOOGLE_SHEETS_SETUP.md, etc.)
2. Run test script for diagnostics
3. Check logs in `/Users/admin/automation/logs/`
4. Review n8n execution history

---

**🎉 Congratulations! Queen Nail Bern automation is ready to rock! 💅**

Generate beautiful nail content in German, automatically post to Facebook, and watch your engagement grow!

**First command to try:**
```bash
node scripts/daily-agent.js "5 Trendige Nageldesigns für Winter 2026" --brand queennailbern
```

Let the automation begin! 🚀

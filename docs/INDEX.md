# 📑 INDEX - Tìm Thông Tin Nhanh

**Dùng file này để tìm thông tin bạn cần trong dự án**

---

## 🚀 TÔI MUỐN...

### Bắt đầu sử dụng hệ thống
→ Đọc: **[QUICKSTART.md](QUICKSTART.md)**
- Setup trong 10 phút
- Chạy post đầu tiên
- Verify hệ thống hoạt động

---

### Hiểu rõ cách hoạt động của từng bước
→ Đọc: **[HUONG_DAN_CHI_TIET.md](HUONG_DAN_CHI_TIET.md)**
- Giải thích chi tiết 6 bước
- Code breakdown
- Technical details
- Best practices

---

### Reference nhanh khi làm việc
→ Xem: **[CHEAT_SHEET.md](CHEAT_SHEET.md)**
- Quick commands
- JSON template
- Common fixes
- Daily routine

---

### Xem quy trình dưới dạng visual
→ Mở: **[workflow_visualization.html](workflow_visualization.html)** (trong browser)
- Workflow diagram đẹp
- Từng bước có explanation
- Performance metrics
- Tech stack overview

---

### Quản lý workflows và monitoring
→ Đọc: **[WORKFLOW_MANAGEMENT.md](WORKFLOW_MANAGEMENT.md)**
- n8n workflows overview
- Troubleshooting workflows
- Google Sheets structure
- Credentials management

---

### Tìm hiểu brand guidelines
→ Đọc: **[design_philosophy.md](design_philosophy.md)**
- Color palette
- Typography
- Visual identity
- Tone & voice

---

### Research thị trường và strategy
→ Đọc: **[context-longbest.md](context-longbest.md)**
- Market analysis
- Competitor research
- Viral content formulas
- Vietnamese terminology guide

---

## 🛠 TÔI CẦN FIX...

### Lỗi khi generate ảnh
→ Xem: **[scripts/carousel-generator/README.md](scripts/carousel-generator/README.md)**
- Puppeteer setup
- Chrome path configuration
- Image quality issues

---

### Lỗi khi upload Drive
→ Xem: **[scripts/drive-uploader/README.md](scripts/drive-uploader/README.md)**
- OAuth authentication
- Token refresh
- Permission issues

---

### Script tổng hợp không chạy
→ Xem: **[scripts/content-automation/README.md](scripts/content-automation/README.md)**
- create-post.sh troubleshooting
- Bash script debugging
- Path issues

---

### n8n workflow không post
→ Xem: **[WORKFLOW_MANAGEMENT.md](WORKFLOW_MANAGEMENT.md)** → Section "Troubleshooting"
- Workflow not triggering
- Facebook API errors
- Google Sheets connection

---

## 📁 FILE STRUCTURE REFERENCE

```
automation/
├── 📖 README.md                          # Overview tổng quan
├── 📑 INDEX.md                           # File này - Tìm kiếm nhanh
│
├── 🚀 Getting Started
│   ├── QUICKSTART.md                     # Setup 10 phút ⭐
│   ├── HUONG_DAN_CHI_TIET.md            # Deep dive 30 phút 📖
│   ├── CHEAT_SHEET.md                    # Quick reference 📋
│   └── workflow_visualization.html       # Visual diagram 🎨
│
├── 📊 Management
│   ├── WORKFLOW_MANAGEMENT.md            # Quản lý workflows
│   ├── DASHBOARD.md                      # Metrics & monitoring
│   └── CHECKLIST.md                      # Setup verification
│
├── 🎨 Design & Content
│   ├── design_philosophy.md              # Brand guidelines
│   ├── design_carousel.html              # HTML template
│   ├── content_nano_banana.md            # Example content
│   └── context-longbest.md               # Full context & research
│
├── 🔧 Scripts (Main Tools)
│   ├── carousel-generator/               # Generate images
│   │   ├── generator.js                  # Main script
│   │   ├── example-content.json          # Template
│   │   └── README.md                     # Documentation
│   │
│   ├── drive-uploader/                   # Upload to Drive
│   │   ├── upload.js                     # Main script
│   │   ├── setup-auth.js                 # OAuth
│   │   └── README.md                     # Documentation
│   │
│   └── content-automation/               # End-to-end
│       ├── create-post.sh                # ⭐ MAIN SCRIPT
│       ├── content/                      # Your content files
│       └── README.md                     # Documentation
│
├── 🤖 n8n Workflows
│   └── n8n-skill/awesome-n8n-workflows-main/
│       └── workflows/
│           └── facebook-longbest-publisher/  # Main workflow
│               ├── facebook-carousel-workflow.json
│               └── README.md
│
├── 🎯 Claude Skills
│   └── skill/content-research-writer/    # Content writing skill
│
└── 📅 Content Calendar
    └── content-calendar/README.md        # Sheets structure
```

---

## 🎓 LEARNING PATH

### Beginner (Ngày 1)
1. Đọc **README.md** (5 phút) - Overview
2. Làm theo **QUICKSTART.md** (10 phút) - Setup
3. Tạo post đầu tiên (7 phút) - Practice
4. Mở **workflow_visualization.html** (5 phút) - Visual understanding

**Total: 27 phút → Đã có post đầu tiên!**

---

### Intermediate (Tuần 1)
1. Đọc **HUONG_DAN_CHI_TIET.md** (30 phút) - Deep understanding
2. In **CHEAT_SHEET.md** ra (1 phút) - Reference
3. Tạo 5 posts thử nghiệm (30 phút)
4. Monitor performance (10 phút/ngày)

**Total: ~3 giờ → Master quy trình cơ bản**

---

### Advanced (Tuần 2-4)
1. Đọc **WORKFLOW_MANAGEMENT.md** (20 phút) - System architecture
2. Đọc **design_philosophy.md** (15 phút) - Brand consistency
3. Đọc **context-longbest.md** (45 phút) - Strategy & market
4. Customize workflows theo nhu cầu
5. A/B testing content

**Total: ~2 tuần → Expert level**

---

## 🔍 SEARCH BY TOPIC

### Authentication & Security
- **Google OAuth:** `scripts/drive-uploader/README.md`
- **Facebook Token:** `WORKFLOW_MANAGEMENT.md` → "Facebook Graph API"
- **n8n Credentials:** `WORKFLOW_MANAGEMENT.md` → "Security & Credentials"

---

### Content Creation
- **JSON Structure:** `HUONG_DAN_CHI_TIET.md` → "Bước 1"
- **5 Slide Types:** `CHEAT_SHEET.md` → "5 Loại Slides"
- **Content Templates:** `scripts/carousel-generator/example-content.json`
- **Caption Writing:** `HUONG_DAN_CHI_TIET.md` → "Tips Viết Caption"

---

### Design & Branding
- **Color Palette:** `design_philosophy.md` → "Color System"
- **Typography:** `design_philosophy.md` → "Typography"
- **HTML Template:** `design_carousel.html`
- **CSS Customization:** `scripts/carousel-generator/generator.js` → "createSlideHTML"

---

### Automation & Scripts
- **Main Script:** `scripts/content-automation/create-post.sh`
- **Image Generation:** `scripts/carousel-generator/generator.js`
- **Drive Upload:** `scripts/drive-uploader/upload.js`
- **n8n Workflow:** `n8n-skill/.../facebook-longbest-publisher/`

---

### Troubleshooting
- **Quick Fixes:** `CHEAT_SHEET.md` → "Common Issues"
- **Detailed Debug:** `HUONG_DAN_CHI_TIET.md` → "Troubleshooting"
- **Workflow Issues:** `WORKFLOW_MANAGEMENT.md` → "Troubleshooting Workflows"

---

### Performance & Analytics
- **Metrics:** `DASHBOARD.md`
- **Best Practices:** `HUONG_DAN_CHI_TIET.md` → "Optimization Tips"
- **Time Savings:** `README.md` → "Performance Metrics"

---

## 📞 QUICK LINKS

### External Services
- **Google Cloud Console:** https://console.cloud.google.com
- **Facebook Developers:** https://developers.facebook.com
- **Graph API Explorer:** https://developers.facebook.com/tools/explorer
- **Access Token Debug:** https://developers.facebook.com/tools/debug/accesstoken/

### Internal
- **Google Sheets:** [Add your Sheets URL here]
- **Google Drive Folder:** [Add your Drive folder URL here]
- **Facebook Page:** [Add your Page URL here]
- **n8n Dashboard:** http://localhost:5678 (or your n8n URL)

---

## ✅ CHECKLIST NHANH

### First Time Setup
- [ ] Install Node.js (`brew install node`)
- [ ] Install dependencies (`npm install` in both scripts)
- [ ] Setup Google OAuth (`npm run auth` in drive-uploader)
- [ ] Create Google Sheets (Posts tab)
- [ ] Setup n8n workflow (import JSON)
- [ ] Get Facebook Page Access Token
- [ ] Test với 1 post mẫu

### Daily Workflow
- [ ] Tạo content JSON (5 phút)
- [ ] Run `./create-post.sh` (30 giây)
- [ ] Copy Folder ID (auto clipboard)
- [ ] Update Google Sheets (2 phút)
- [ ] Đợi n8n auto-post (tự động)
- [ ] Monitor engagement (5 phút)

### Weekly Review
- [ ] Check performance metrics
- [ ] Analyze top performing content
- [ ] Plan content cho tuần sau
- [ ] Backup workflows & data

---

## 🆘 EMERGENCY CONTACTS

### System Down?
1. Check n8n: `WORKFLOW_MANAGEMENT.md` → "Quick Commands"
2. Re-auth Drive: `scripts/drive-uploader/` → `npm run auth`
3. Check Facebook token: Graph API Explorer

### Need Help?
1. Check **CHEAT_SHEET.md** → "Common Issues"
2. Check **HUONG_DAN_CHI_TIET.md** → "Troubleshooting"
3. Check **WORKFLOW_MANAGEMENT.md** → "Troubleshooting Workflows"

---

## 📊 FILE USAGE FREQUENCY

**Dùng hàng ngày:**
- ⭐⭐⭐⭐⭐ `CHEAT_SHEET.md`
- ⭐⭐⭐⭐⭐ `scripts/content-automation/create-post.sh`
- ⭐⭐⭐⭐ Google Sheets

**Dùng hàng tuần:**
- ⭐⭐⭐ `DASHBOARD.md`
- ⭐⭐⭐ `WORKFLOW_MANAGEMENT.md`

**Dùng khi cần:**
- ⭐⭐ `HUONG_DAN_CHI_TIET.md` (Reference)
- ⭐⭐ `design_philosophy.md` (Khi customize design)
- ⭐ `context-longbest.md` (Strategy planning)

**Dùng 1 lần (Setup):**
- ⭐ `QUICKSTART.md`
- ⭐ `CHECKLIST.md`

---

**Bookmark file này để tìm kiếm nhanh! 🔖**

**Last Updated:** 2026-01-08
**Version:** 1.0.0

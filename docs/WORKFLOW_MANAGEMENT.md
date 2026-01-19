# Hệ Thống Quản Lý Workflows - Long Best AI

## 📋 Tổng Quan Hệ Thống

Hệ thống tự động hóa nội dung AI cho fanpage Long Best AI, bao gồm:
- **Content Creation**: Tạo nội dung carousel từ idea → research → design
- **Image Generation**: Generate ảnh carousel tự động từ HTML template
- **Auto Publishing**: Đăng bài tự động lên Facebook
- **Asset Management**: Quản lý ảnh trên Google Drive

---

## 🗂 Danh Sách Workflows Hiện Tại

### 1. **Facebook Longbest Publisher** ⭐ ACTIVE
**Đường dẫn**: `n8n-skill/awesome-n8n-workflows-main/workflows/facebook-longbest-publisher/`

**Chức năng**:
- Đọc content từ Google Sheets
- Lấy ảnh từ Google Drive folder
- Đăng carousel lên Facebook Page
- Update status về Sheets

**Trigger**: Schedule (15 phút/lần)

**Dependencies**:
- Google Sheets OAuth2 (Posts tab)
- Google Drive OAuth2
- Facebook Graph API (Page Access Token)

**Input Sheet Columns**:
| Column | Description | Example |
|--------|-------------|---------|
| `ID` | Unique post ID | `post_001` |
| `Caption` | Post text | `10 prompt AI hay nhất...` |
| `Drive_Folder_ID` | Folder chứa ảnh | `1AbCdEfG...` |
| `Status` | Trạng thái | `Ready` → `Published` |
| `Post_URL` | Link bài đăng | (Tự động fill) |

**Files**:
- `facebook-carousel-workflow.json` - Main workflow
- `autopost-lbai.json` - Alternative version
- `README.md` - Documentation

---

### 2. **Multi-Language Translator**
**Đường dẫn**: `n8n-skill/awesome-n8n-workflows-main/workflows/multi-language-translator/`

**Chức năng**: Dịch nội dung đa ngôn ngữ

**Files**:
- `multi-language-translator.json`
- `main.py` - Python translation script

---

### 3. **WeChat Daily Report**
**Đường dẫn**: `n8n-skill/awesome-n8n-workflows-main/workflows/wechat-daily-report/`

**Chức năng**: Tạo báo cáo hàng ngày cho WeChat groups

**Files**:
- `wechat-daily-digest-ai-cost-optimized.json`
- `workflow-single-group.json`

---

### 4. **GitHub to Feishu Collector**
**Đường dẫn**: `n8n-skill/awesome-n8n-workflows-main/workflows/github-to-feishu-collector/`

**Chức năng**: Thu thập GitHub repos và gửi lên Feishu
- Bao gồm browser extension để collect

---

### 5. **Nano Banana Workflow** (Potential)
**Đường dẫn**: `n8n-skill/awesome-n8n-workflows-main/workflows/nano-banana/`

**Note**: Cần kiểm tra xem workflow này dùng cho gì

---

## 🎯 Quy Trình Làm Việc Hiện Tại

```
┌─────────────────┐
│  1. Tạo Content │ (Thủ công - Google Sheets)
│  - Viết caption │
│  - Research     │
└────────┬────────┘
         ▼
┌─────────────────┐
│  2. Design      │ (Thủ công - design_carousel.html)
│  - Tạo carousel │
│  - Export ảnh   │
└────────┬────────┘
         ▼
┌─────────────────┐
│  3. Upload      │ (Thủ công - Google Drive)
│  - Tải ảnh lên  │
│  - Tạo folder   │
│  - Copy ID      │
└────────┬────────┘
         ▼
┌─────────────────┐
│  4. Update      │ (Thủ công - Google Sheets)
│  Sheet          │
│  - Paste Folder │
│  - Set "Ready"  │
└────────┬────────┘
         ▼
┌─────────────────┐
│  5. Auto Post   │ ✅ TỰ ĐỘNG (n8n workflow)
│  - n8n đọc      │
│  - Post FB      │
│  - Update URL   │
└─────────────────┘
```

**Vấn đề**: Bước 1-4 đều thủ công → MẤT THỜI GIAN

---

## 🚀 Quy Trình Mục Tiêu (Tự Động Hóa)

```
┌─────────────────┐
│  1. Idea Input  │ ← Nhập idea vào Content Calendar
│  - Topic        │
│  - Keywords     │
│  - Schedule     │
└────────┬────────┘
         ▼
┌─────────────────┐
│  2. Auto        │ ✨ AI Research Agent
│  Research       │ - Claude skill
│  - Find data    │ - Web search
│  - Citations    │ - Write content
└────────┬────────┘
         ▼
┌─────────────────┐
│  3. Auto        │ ✨ Carousel Generator Script
│  Design         │ - Read content
│  - Generate     │ - Fill HTML template
│  - Export PNG   │ - 7 slides
└────────┬────────┘
         ▼
┌─────────────────┐
│  4. Auto        │ ✨ Drive Uploader Workflow
│  Upload         │ - Auto create folder
│  - Numbered     │ - Upload: 01.png, 02.png...
│  - Update Sheet │ - Fill Drive_Folder_ID
└────────┬────────┘
         ▼
┌─────────────────┐
│  5. Auto Post   │ ✅ ĐÃ CÓ (Facebook Publisher)
│  - n8n trigger  │
│  - Post carousel│
│  - Track metrics│
└─────────────────┘
```

---

## 📁 Cấu Trúc Thư Mục

```
automation/
├── README.md                      # Chiến lược content
├── WORKFLOW_MANAGEMENT.md         # File này - Hướng dẫn quản lý
├── design_philosophy.md           # Brand guidelines
├── content_nano_banana.md         # Content plan mẫu
├── design_carousel.html           # Template HTML carousel
│
├── assets/                        # Ảnh, resources
│
├── skill/                         # Claude skills
│   └── content-research-writer/   # Skill viết content
│       ├── SKILL.md
│       └── canvas-design/
│
├── n8n-skill/                     # n8n workflows
│   └── awesome-n8n-workflows-main/
│       └── workflows/
│           ├── facebook-longbest-publisher/  ⭐ MAIN
│           ├── multi-language-translator/
│           ├── wechat-daily-report/
│           ├── github-to-feishu-collector/
│           └── nano-banana/
│
├── scripts/                       # 🆕 Sẽ tạo
│   ├── carousel-generator/        # Generate ảnh từ HTML
│   ├── drive-uploader/            # Upload Drive tự động
│   └── content-automation/        # Orchestrator
│
└── content-calendar/              # 🆕 Sẽ tạo
    ├── calendar-template.xlsx     # Template Google Sheets
    └── README.md
```

---

## 🔧 Hướng Dẫn Quản Lý Workflows

### Kiểm Tra Trạng Thái Workflow

**1. Truy cập n8n Dashboard**
```
http://localhost:5678
# (hoặc URL n8n của bạn)
```

**2. Kiểm tra workflows đang active:**
- Vào **Workflows** tab
- Filter: `Active` workflows
- Check: `facebook-longbest-publisher` có active không

**3. Xem logs:**
- Click vào workflow
- Tab **Executions**
- Xem các lần chạy gần nhất

---

### Troubleshooting Workflows

#### ❌ Workflow không chạy
**Check:**
1. Trigger có active không?
2. Schedule time đúng không?
3. Credentials còn valid không?

**Fix:**
```bash
# Restart n8n
pm2 restart n8n
# hoặc
docker restart n8n-container
```

#### ❌ Google Sheets không đọc được
**Check:**
1. Sheet name = `Posts`?
2. Column names chính xác?
3. OAuth token expired?

**Fix:**
- Vào Credentials → Google Sheets
- Reconnect account
- Test connection

#### ❌ Facebook post failed
**Check:**
1. Page Access Token valid?
2. Token có quyền `pages_manage_posts`?
3. Ảnh format đúng (JPG, PNG)?

**Fix:**
```
https://developers.facebook.com/tools/debug/accesstoken/
# Paste token → Check expiration
# Regenerate nếu cần
```

---

## 📊 Google Sheets Setup

### Tạo Content Calendar Sheet

**Sheet Structure:**

**Tab 1: Content_Calendar**
| Date | Topic | Status | Assigned | Priority |
|------|-------|--------|----------|----------|
| 2026-01-10 | 10 AI Prompts | Planning | Auto | High |
| 2026-01-12 | Nano Banana Guide | Ready | Auto | Medium |

**Tab 2: Posts** (Cho Facebook Publisher)
| ID | Caption | Drive_Folder_ID | Status | Post_URL | Published_Date |
|----|---------|-----------------|--------|----------|----------------|
| post_001 | Check out... | 1AbC... | Published | https://fb... | 2026-01-08 |
| post_002 | 10 prompts... | 1DeF... | Ready |  |  |

**Tab 3: Content_Archive**
| ID | Topic | Views | Likes | Comments | Performance |
|----|-------|-------|-------|----------|-------------|
| post_001 | AI Tips | 5000 | 230 | 45 | ⭐⭐⭐⭐ |

---

## 🎨 Brand Assets

### Color Palette (Anthropic-aligned)
```css
--bg-dark: #141413      /* Background chính */
--bg-light: #faf9f5     /* Background sáng */
--accent-orange: #d97757 /* Primary CTA */
--accent-green: #788c5d  /* Secondary accent */
--text-main: #faf9f5     /* Text chính */
```

### Typography
- **Headlines**: Poppins (Bold, Uppercase)
- **Body**: Lora (Serif, Editorial)
- **Prompts**: Monospace

---

## 🔐 Security & Credentials

### Credentials Cần Có

**1. Google APIs**
- Google Sheets API (OAuth2)
- Google Drive API (OAuth2)
- Scopes: `drive.file`, `spreadsheets`

**2. Facebook**
- Page Access Token
- Permissions: `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`
- Never expire token (select "Never" in expiration)

**3. n8n Environment Variables**
```env
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_password
```

### Backup Credentials
**Location**: Store safely in password manager
- [ ] Google OAuth Client ID/Secret
- [ ] Facebook Page Token
- [ ] n8n Auth credentials

---

## 📈 Monitoring & Analytics

### Metrics để Track

**1. Content Performance**
- Views per post
- Engagement rate (likes, comments, shares)
- CTR on CTAs
- Best performing topics

**2. Automation Health**
- Workflow success rate
- Error count per day
- Average execution time
- Queue length

**3. Efficiency Gains**
- Time saved vs manual process
- Posts per week (before/after automation)
- Error reduction rate

---

## 🆘 Quick Commands

### Restart n8n
```bash
pm2 restart n8n
# hoặc
docker-compose restart n8n
```

### Check n8n logs
```bash
pm2 logs n8n
# hoặc
docker logs n8n-container -f
```

### Backup workflows
```bash
# Export từ n8n UI
Settings → Import/Export → Export All Workflows
# Save vào: automation/backups/workflows-YYYY-MM-DD.json
```

---

## 📝 Next Steps

### Phase 1: Tự Động Hóa Ảnh ✨ PRIORITY
- [ ] Tạo carousel generator script
- [ ] Tạo auto Drive uploader workflow
- [ ] Test end-to-end: content → ảnh → Drive → Facebook

### Phase 2: Content Automation
- [ ] Setup Content Calendar Sheet
- [ ] Tạo AI research agent workflow
- [ ] Tích hợp content-research-writer skill

### Phase 3: Optimization
- [ ] Tạo dashboard giám sát
- [ ] Setup error alerts
- [ ] A/B testing framework

---

## 📞 Support Resources

- **n8n Documentation**: https://docs.n8n.io
- **Facebook Graph API**: https://developers.facebook.com/docs/graph-api
- **Google APIs**: https://console.cloud.google.com

---

**Last Updated**: 2026-01-08
**Version**: 1.0
**Owner**: Long Best AI Team

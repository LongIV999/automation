# 🤖 Long Best AI - Hệ Thống Tự Động Hóa Content

> Workspace tự động hóa quy trình xây dựng fanpage về AI bất động sản

**Tự động hóa end-to-end:** Content Idea → Research → Design Carousel → Upload Drive → Post Facebook

---

## 🚀 Quick Start

```bash
# 1. Setup (chỉ làm 1 lần)
cd scripts/carousel-generator && npm install
cd ../drive-uploader && npm install && npm run auth

# 2. Tạo post mới
cd ../content-automation
./create-post.sh content/your-content.json "2026-01-10_Topic_Name"

# 3. Paste Folder ID vào Google Sheets → Set Status = "Ready"

# 4. n8n tự động đăng Facebook! ✅
```

**⏱ Time:** 30 giây (tự động) + 2 phút (paste vào Sheets)
**📉 Tiết kiệm:** 87% thời gian (từ 55 phút → 7 phút/post)

👉 **[Chi tiết xem QUICKSTART.md](QUICKSTART.md)**

---

## 📚 Tài Liệu Quản Lý

### 🎯 Bắt đầu đây (Đọc theo thứ tự)
1. **[QUICKSTART.md](QUICKSTART.md)** - Setup và tạo post đầu tiên trong 10 phút ⭐ **BẮT ĐẦU ĐÂY**
2. **[HUONG_DAN_CHI_TIET.md](HUONG_DAN_CHI_TIET.md)** - Giải thích chi tiết từng bước (30 phút đọc) 📖 **QUAN TRỌNG**
3. **[CHEAT_SHEET.md](CHEAT_SHEET.md)** - Quick reference cho hàng ngày 📋 **IN RA DÙNG**
4. **[workflow_visualization.html](workflow_visualization.html)** - Visual workflow (Mở trong browser) 🎨

### 🛠 Công cụ & Scripts
- **[Carousel Generator](scripts/carousel-generator/README.md)** - Tạo ảnh carousel tự động
- **[Drive Uploader](scripts/drive-uploader/README.md)** - Upload lên Google Drive
- **[Content Automation](scripts/content-automation/README.md)** - Script end-to-end

### 📅 Planning & Monitoring
- **[WORKFLOW_MANAGEMENT.md](WORKFLOW_MANAGEMENT.md)** - Quản lý toàn bộ workflows
- **[Content Calendar](content-calendar/README.md)** - Hệ thống lập lịch nội dung
- **[DASHBOARD.md](DASHBOARD.md)** - Giám sát performance & metrics

### 🎨 Brand & Strategy
- **[design_philosophy.md](design_philosophy.md)** - Brand guidelines (Anthropic-aligned)
- **[context-longbest.md](context-longbest.md)** - Full context & market research

---

## 🏗 Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────┐
│                    CONTENT CALENDAR                     │
│              (Google Sheets - Planning)                 │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              CONTENT CREATION (Manual)                  │
│   - Brainstorm topic                                    │
│   - Research (content-research-writer skill)            │
│   - Write content JSON                                  │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│          AUTOMATION PIPELINE (create-post.sh)           │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ 1. Carousel Generator (Puppeteer)              │    │
│  │    Input: content.json                         │    │
│  │    Output: 01.png - 07.png                     │    │
│  └─────────────────┬──────────────────────────────┘    │
│                    ▼                                     │
│  ┌────────────────────────────────────────────────┐    │
│  │ 2. Drive Uploader (Google API)                 │    │
│  │    Input: Images directory                     │    │
│  │    Output: Folder ID + Link                    │    │
│  └─────────────────┬──────────────────────────────┘    │
│                    ▼                                     │
│  ┌────────────────────────────────────────────────┐    │
│  │ 3. Manual: Paste to Google Sheets              │    │
│  │    - Add Folder ID                             │    │
│  │    - Write caption                             │    │
│  │    - Set Status = "Ready"                      │    │
│  └─────────────────┬──────────────────────────────┘    │
└────────────────────┼──────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         N8N FACEBOOK PUBLISHER (Automated)              │
│                                                          │
│  - Trigger: Every 15 minutes                            │
│  - Read: Posts with Status = "Ready"                    │
│  - Download: Images from Drive                          │
│  - Post: Carousel to Facebook                           │
│  - Update: Status = "Published", Post URL               │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              MONITORING & ANALYTICS                     │
│   - Track views, engagement                             │
│   - Update Archive tab                                  │
│   - Dashboard metrics                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 📂 Cấu Trúc Thư Mục

```
automation/
├── README.md                          # File này - Overview
├── QUICKSTART.md                      # Hướng dẫn bắt đầu nhanh
├── WORKFLOW_MANAGEMENT.md             # Quản lý workflows
├── DASHBOARD.md                       # Dashboard & monitoring
│
├── design_philosophy.md               # Brand guidelines
├── design_carousel.html               # HTML template carousel
├── content_nano_banana.md             # Content plan mẫu
│
├── assets/                            # Ảnh, resources
│
├── skill/                             # Claude skills
│   └── content-research-writer/       # Skill viết content + research
│
├── n8n-skill/                         # n8n workflows
│   └── awesome-n8n-workflows-main/
│       └── workflows/
│           ├── facebook-longbest-publisher/  ⭐ MAIN workflow
│           ├── multi-language-translator/
│           └── wechat-daily-report/
│
├── scripts/                           # Automation scripts
│   ├── carousel-generator/            # Generate ảnh từ JSON
│   │   ├── generator.js
│   │   ├── example-content.json
│   │   └── output/                    # Generated images
│   │
│   ├── drive-uploader/                # Upload lên Drive
│   │   ├── upload.js
│   │   ├── setup-auth.js
│   │   └── credentials.json           # (gitignored)
│   │
│   └── content-automation/            # End-to-end automation
│       ├── create-post.sh             ⭐ MAIN SCRIPT
│       ├── content/                   # Content JSON files
│       └── README.md
│
└── content-calendar/                  # Google Sheets templates
    └── README.md
```

---

## 🎯 Quy Trình Làm Việc

### Quy Trình Hiện Tại (Semi-Automated)

| Bước | Tác Vụ | Thời Gian | Tool |
|------|--------|-----------|------|
| 1 | Brainstorm topic | 5 phút | Manual |
| 2 | Research + viết content | 10 phút | content-research-writer skill |
| 3 | Tạo JSON file | 2 phút | Manual |
| 4 | **Generate ảnh + Upload** | **30 giây** | **create-post.sh** ✨ |
| 5 | Paste Folder ID + caption | 2 phút | Manual |
| 6 | **n8n auto-post Facebook** | **Tự động** | **n8n workflow** ✅ |

**Total:** ~20 phút (so với 55 phút trước đây)

### Quy Trình Target (Fully Automated)

🎯 **Phase 2 roadmap:**
- Auto-generate content từ topic (AI agent)
- Auto-update Sheets với Folder ID
- Schedule posts tự động

---

# Long Best AI Content Creation Context Skill: Complete Profile

**Visual-first Vietnamese AI education represents a genuine blue ocean opportunity.** With virtually no competition in carousel/infographic content and a $753M market projected to reach $3.4B by 2030, Long Best AI can capture significant market share by combining Anthropic's warm visual identity with proven viral content formulas adapted for Vietnamese learners.

---

## Hayes (@hayesdev_) content analysis

Hayes commands **81.6K followers** while following only 79 accounts—an authority signal that resonates with audiences. His viral success stems from a curator-influencer model rather than original content creation.

### His viral hook formula

The signature pattern **"This [entity] literally dropped [superlative]"** drove his top-performing post to **5.9M views, 149K likes, and 22K retweets**. His posts are ultra-short (1-2 sentences maximum), paired with embedded media that does the heavy lifting.

| Hook Template | Example | Why It Works |
|---------------|---------|--------------|
| Amplification | "This guy literally dropped the best mindset shift you'll ever hear" | Creates urgency + exclusivity |
| Authority Citation | "MIT just published a 26-page report on AI (2025). Hope this is useful." | Leverages institutional credibility |
| Humble CTA | "Hope this is useful" | Non-salesy, service-oriented |

### Key takeaways for Long Best AI
- **Curate, don't just create**: Position as the filter for quality AI content in Vietnamese
- **Keep posts brutally short**: Let embedded visuals/prompts carry the value
- **Use superlative framing sparingly but effectively**: "tốt nhất" (the best), "đáng xem nhất" (most worth watching)
- **Build authority through bio**: Clear credibility statement matters

---

## Top AI prompt creators: Viral patterns decoded

### Creator profiles and metrics

| Creator | Following | Content Focus | Signature Style |
|---------|-----------|---------------|-----------------|
| **@godofprompt** | Multi-platform reach | ChatGPT, Midjourney, DALL-E bundles | Copy-paste ready prompts + before/after visuals |
| **@alliekmiller** | 1.5M+ | AI business applications | Expert authority threads |
| **@heymidjourney** | Growing niche | Midjourney-specific techniques | Image-first with prompt reveals |
| **@mattshumer_** | Forbes 30U30 | LLM automation, agents | Technical demos made accessible |
| **@karpathy** | Massive (ex-Tesla/OpenAI) | Deep AI education | Reference-quality threads |

### The viral content formula

**Five hook structures that consistently perform:**

1. **"Most people don't know"** — "99% of people are sleeping on what [tool] can actually do"
2. **Listicle promise** — "10 ways to use [Tool] that feel like cheating"
3. **Transformation hook** — "I went from [Before] to [After] using this prompt"
4. **"Just released" authority** — "[Tool] just did something wild..."
5. **Contrarian statement** — "AI won't take your job. But [unexpected twist]..."

### Optimal thread architecture

```
Tweet 1: Hook (tension + curiosity)
Tweet 2-3: Setup/Context
Tweet 4-7: Value delivery (prompts/tips)
Tweet 8: Key insight/punchline  
Tweet 9-10: CTA (follow, retweet, share)
```

### Visual formats ranked by engagement

| Format | Engagement Level | Best For |
|--------|------------------|----------|
| **Before/After Split Screen** | Highest | Transformation prompts |
| **Numbered Prompt Carousels** | Very High | Step-by-step tutorials |
| **Threads (7-10 tweets)** | High | How-to guides, frameworks |
| **Grid/Collage Format** | High | Multiple style variations |

### Top viral prompt categories
- Cinematic Y2K/Retro aesthetic
- **Ghibli-style makeovers** (soft watercolor, fantasy)
- Cyberpunk transformations (neon, futuristic)
- Magazine cover edits (high-fashion editorial)
- 3D Pixar cartoon style

---

## Anthropic brand guidelines: Complete specification

### Color palette (exact hex codes)

| Color Name | Hex Code | RGB | Application |
|------------|----------|-----|-------------|
| **Crail** | #C15F3C | 193, 95, 60 | Primary accent—CTAs, highlights, brand marks |
| **Pampas** | #F4F3EE | 244, 243, 238 | Warm cream backgrounds |
| **White** | #FFFFFF | 255, 255, 255 | Clean backgrounds |
| **Cloudy** | #B1ADA1 | 177, 173, 161 | Secondary UI, subtle elements |
| **Black** | #000000 | 0, 0, 0 | Primary text |

**Critical insight:** Anthropic deliberately avoids neon, high-contrast gradients, and tech-industry blues. The warm earth tones communicate trust, calmness, and intellectual depth—differentiating from competitors.

### Typography system

| Usage | Font Family | Characteristics |
|-------|-------------|-----------------|
| **Headlines/Display** | Styrene (Commercial Type) | Geometric sans-serif, technically refined |
| **Body/Editorial** | Tiempos (Klim Type Foundry) | Elegant serif, humanistic warmth |
| **Logo/Custom** | Copernicus (bespoke) | Custom typeface for brand mark |
| **Web Fallback** | ui-serif, Georgia, Cambria, Times New Roman | System fonts |

### Visual identity principles

**Design philosophy: "Do the simple thing that works"**

- Minimalism and precision—embrace negative space
- Function-first UI without losing brand soul
- Modular, grid-based layouts
- Warm, natural photography when showing people
- Abstract motifs representing collaboration (not literal illustrations)
- Subtle gradients capturing AI complexity made comprehensible

### Tone and voice characteristics

| Attribute | Approach |
|-----------|----------|
| Technical depth | Rigorous but accessible |
| Personality | Warm, thoughtful, understated confidence |
| Avoids | Hype, tech-bro language, futuristic clichés |
| Embraces | Transparency, nuance, intellectual honesty |

**Key phrases:** "Helpful, Honest, Harmless" (Claude's HHH framework), "answers with a confident yes, without yelling it"

---

## Vietnamese AI content landscape: Market opportunity analysis

### Current market leaders

| Creator/Org | Platform Reach | Content Focus | Gap Opportunity |
|-------------|----------------|---------------|-----------------|
| **HVMO (Phố Tổng)** | 163K YouTube, 185K TikTok | AI for marketing, video creation | Visual content, beginners |
| **VinAI Research** | YouTube (academic) | Technical ML research | Accessibility |
| **AI for Vietnam** | Enterprise training | Corporate consulting | Consumer content |
| **STEAM for Vietnam** | K-12 education | Teacher training | Adult learners |

### Critical market gaps (Blue ocean opportunities)

**1. Visual Content Format** — VIRTUALLY NO COMPETITION
- Carousel tutorials on Facebook: **zero major Vietnamese creators**
- Infographic prompt guides: **not available in Vietnamese**
- Visual AI tool comparison charts: **missing entirely**

**2. Prompt Engineering in Vietnamese**
- No quality Vietnamese prompt template libraries
- Most content is basic ChatGPT introductions
- Advanced Claude/Anthropic content: **zero dedicated Vietnamese creators**

**3. Beginner-Focused Content**
- Existing content jumps to advanced topics too quickly
- True "AI từ Zero" (AI from zero) series underserved
- Simple Vietnamese without jargon overload needed

**4. Free Quality Resources**
- Market is paywall-dominant
- Free/freemium model offers differentiation opportunity

### Market metrics

| Metric | 2024 Value | 2030 Projection |
|--------|------------|-----------------|
| Vietnam AI Market | **$753.4M** | **$3.4B** (CAGR 28.63%) |
| AI in Education | $24M | $507.8M (CAGR 35.69%) |
| EdTech Market | $1.08B | Growing rapidly |
| Internet Penetration | 79.1% (78.44M users) | Increasing |

**Vietnam ranks 3rd globally in AI trust** (65.6/100) and **5th in AI acceptance** (71.6/100)—an exceptionally receptive audience.

---

## Vietnamese terminology guide

### Language mix recommendation: 70% Vietnamese / 30% English tech terms

| English Term | Vietnamese Adaptation | Usage Note |
|--------------|----------------------|------------|
| AI | AI / Trí tuệ nhân tạo | Both widely accepted |
| Prompt | Prompt / Câu lệnh | "Prompt" preferred by tech-savvy users |
| ChatGPT, Midjourney, Claude | Keep English | Established terms |
| Tutorial | **Hướng dẫn** | Vietnamese preferred |
| Template | Mẫu / Template | Mixed use acceptable |
| Content | Content / Nội dung | Mixed use acceptable |
| Viral | Viral | Keep English |

### Tone recommendations
- Use **"bạn"** (informal you) rather than "quý vị" (formal)
- Include emojis liberally—very common in Vietnamese digital content
- Conversational, friendly tone resonates best
- Frame content around **practical money-making applications**

### Cultural considerations
- **Community-oriented**: Vietnamese value group learning and sharing
- **Respect for expertise**: Build authority through credentials/titles
- **Mobile-first**: 79% penetration, primarily mobile access
- **Price sensitivity**: Free/low-cost content highly valued
- **70% of audience under 35**: Young, tech-curious demographic

---

## Platform strategy for Long Best AI

| Platform | Priority | Content Type | Frequency |
|----------|----------|--------------|-----------|
| **Facebook** | HIGHEST | Carousels, groups, stories | Daily |
| **TikTok** | HIGH | 30-60 sec tutorials, tips | 2-3x daily |
| **Zalo** | HIGH | Community, discussions | Daily |
| **YouTube** | MEDIUM | Deep tutorials, courses | 2x weekly |
| **Instagram** | MEDIUM | Visual guides, reels | Daily |

**Facebook strategy**: Create "Học AI cùng Long Best AI" community group. Carousel tutorials fill a massive gap—this format has virtually no Vietnamese competition.

---

## Visual style guidelines for infographics/carousels

### Recommended color system (Anthropic-aligned)

```
Primary Accent: #C15F3C (Crail) — Use for CTAs, highlights, key points
Background: #F4F3EE (Pampas) — Warm cream for main backgrounds  
Clean Areas: #FFFFFF (White) — Headers, contrast sections
Secondary: #B1ADA1 (Cloudy) — Borders, subtle elements
Text: #000000 (Black) — Primary body text
```

### Carousel design specifications

**Structure for 8-10 slide carousels:**
1. **Slide 1**: Hook + visual preview (thumbnail-worthy)
2. **Slides 2-3**: Problem/context setup
3. **Slides 4-7**: Value delivery (one prompt/tip per slide)
4. **Slide 8-9**: Key insight or transformation result
5. **Slide 10**: CTA + brand mark

**Typography hierarchy:**
- Headlines: Bold sans-serif, 24-32pt
- Body text: Clean sans or serif, 14-18pt
- Prompts/code: Monospace, highlighted background
- Vietnamese readability: Maintain adequate line spacing (1.4-1.6)

**Visual elements:**
- Before/after split screens for transformation content
- Numbered steps with icons
- Screenshot tutorials with annotation overlays
- Clean grid layouts with generous white space
- Subtle gradients (warm tones only, no neon)

### Avoid these elements
- Bright blues, neons, or high-contrast tech gradients
- Overcrowded slides with too much text
- Generic stock imagery
- Overly futuristic/cyberpunk aesthetics (unless demonstrating that prompt style)

---

## Recommended positioning statement

**"Long Best AI — Học AI Dễ Hiểu, Ứng Dụng Ngay"**
*(Long Best AI — Learn AI Simply, Apply Immediately)*

### Five content pillars

1. **Học AI từ Zero** — Beginner journey content
2. **Prompt Mẫu** — Template/prompt libraries in Vietnamese
3. **Công Cụ AI Hay** — Tool reviews and tutorials
4. **AI Cho Công Việc** — Practical workplace applications
5. **Tin AI Mới** — Curated AI news and updates

### Key differentiators
- **Free quality content** (counter paywall-dominant market)
- **Visual-first approach** (carousels, infographics—no competition)
- **Prompt engineering focus** (major underserved gap)
- **Beginner-friendly** (simple Vietnamese, no jargon)
- **Daily practical applications** (not theoretical)

---

## Quick-reference action items

### Immediate opportunities (first 30 days)
1. Launch Facebook carousel tutorial series—zero competition
2. Create Vietnamese prompt template library (ChatGPT, Midjourney)
3. Build Zalo community with 800-1000 initial members
4. Develop 10 before/after transformation posts using trending prompt styles
5. Establish consistent visual identity using Anthropic color palette

### Content hooks to test (Vietnamese adaptations)
- "99% người Việt chưa biết tính năng này của ChatGPT"
- "10 prompt AI giúp bạn tiết kiệm 5 tiếng mỗi tuần"
- "Mình đã thử [công cụ], và đây là kết quả..."
- "MIT vừa công bố báo cáo về AI. Tóm tắt cho bạn đây."

### Posting schedule template
| Day | Content Type |
|-----|--------------|
| Monday | "Hướng dẫn" tutorial thread/carousel |
| Tuesday | Trending style prompt + result |
| Wednesday | Tool tip or hack (single post) |
| Thursday | Transformation carousel (before/after) |
| Friday | Community engagement, Q&A |
| Weekend | Experiment with new prompt styles |

---

## Summary specifications

### Brand colors (copy-paste ready)
```css
--primary-accent: #C15F3C;
--background-warm: #F4F3EE;
--background-clean: #FFFFFF;
--secondary: #B1ADA1;
--text-primary: #000000;
```

### Typography stack
```css
--font-headline: "Styrene", "Helvetica Neue", Arial, sans-serif;
--font-body: "Tiempos", Georgia, "Times New Roman", serif;
--font-fallback: ui-serif, Georgia, Cambria, serif;
```

### Key metrics to target
- Facebook carousel engagement: Aim for 500+ shares per educational post
- Zalo community: 1,000 members in first 60 days
- TikTok: 2-3 posts daily, 10K followers in 90 days
- Prompt library: 100+ Vietnamese prompts in first quarter

This profile provides the complete foundation for Long Best AI's content creation strategy, combining proven viral patterns with a distinctive visual identity and positioning in an underserved market.
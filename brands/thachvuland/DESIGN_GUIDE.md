# 🎨 Thach Vu Land - Design Style Guide

## Brand Identity

**Brand:** Thach Vu Land
**Industry:** Real Estate (Bình Dương, Vietnam)
**Language:** Vietnamese
**Target Audience:** First-time home buyers, investors, industrial workers
**Brand Voice:** Professional, trustworthy, data-driven

---

## Official Design Styles

Thach Vu Land uses **2 official design styles** from the standardized system:

### 1. **INFOGRAPHIC** (Primary Style) 📊

**Use for:**
- Property listings with key data
- Market analysis and trends
- Price comparisons
- Investment opportunity summaries
- Location highlights
- Payment plan breakdowns

**Characteristics:**
- ✅ Data-focused layout
- ✅ Bold numbers (prices, areas, dates)
- ✅ Clear stats presentation
- ✅ Color-coded information
- ✅ Visual hierarchy for quick scanning
- ✅ Professional real estate aesthetic

**Format Type:** `single-post` (1080x1350, 4:5) for 1 slide

**Example JSON Structure:**
```json
{
  "title": "Phú Đông Sky One - Căn Hộ Cao Cấp Bình Dương",
  "topic": "Property Listing",
  "brand": "Thach Vu Land",
  "formatType": "single-post",
  "contentType": "property-listing",
  "designStyle": "infographic",
  "slideCount": 1,
  "dimensions": {
    "width": 1080,
    "height": 1350,
    "aspectRatio": "4:5"
  },
  "slides": [
    {
      "type": "infographic-summary",
      "headline": "PHÚ ĐÔNG SKY ONE",
      "subheadline": "Căn hộ cao cấp tại trung tâm Bình Dương",
      "stats": {
        "Giá khởi điểm": "1.5 TỶ",
        "Diện tích": "50-80 M²",
        "Bàn giao": "Q4/2026",
        "Thanh toán": "20% HĐMB"
      },
      "highlights": [
        "Vị trí vàng - Cách KCN VSIP 2km",
        "Tiện ích nội khu đầy đủ",
        "Sổ hồng riêng từng căn",
        "Hỗ trợ vay 70%, lãi suất 0%",
        "Tặng nội thất 50 triệu"
      ],
      "visual": "Clean infographic layout with property stats and icons"
    }
  ]
}
```

---

### 2. **NOTEBOOK** (Secondary Style) 📓

**Use for:**
- Educational content about real estate investment
- Market trend analysis
- Buyer's guides (first-time buyers)
- Investment strategy explanations
- Real estate terminology guides
- Comparison guides (locations, developers)

**Characteristics:**
- ✅ Clean, professional design
- ✅ Black & white minimalist aesthetic
- ✅ Educational tone
- ✅ Data-backed insights
- ✅ Trust-building content

**Format Type:** `carousel-standard` (1080x1350, 4:5) for 7 slides

**Example JSON Structure:**
```json
{
  "title": "7 Điều Cần Biết Khi Mua Căn Hộ Đầu Tiên",
  "topic": "First-time buyer guide",
  "brand": "Thach Vu Land",
  "formatType": "carousel-standard",
  "contentType": "educational",
  "designStyle": "notebook",
  "slideCount": 7,
  "dimensions": {
    "width": 1080,
    "height": 1350,
    "aspectRatio": "4:5"
  },
  "slides": [
    {
      "type": "title",
      "headline": "7 Điều Cần Biết Khi Mua Căn Hộ Đầu Tiên",
      "subheadline": "Hướng dẫn từ chuyên gia BĐS Bình Dương",
      "content": "Thach Vu Land",
      "visual": "Abstract house/building shapes minimal design"
    },
    {
      "type": "content",
      "headline": "1. Xác Định Ngân Sách Thực Tế",
      "subheadline": "Đừng chỉ nhìn giá niêm yết",
      "content": "Tính toán cả: Phí trước bạ (2%), phí bảo trì (2-3%), nội thất (50-100 triệu), phí pháp lý...",
      "visual": "Budget breakdown chart"
    }
  ]
}
```

---

## Color Palette

```css
/* Primary Colors - Minimal Professional */
--primary: #000000;          /* Black - main color */
--background: #FFFFFF;       /* White - backgrounds */
--text: #000000;             /* Black - text */

/* Accent Colors - Real Estate Trust */
--accent-gold: #D4AF37;      /* Gold - premium properties, highlights */
--accent-green: #2D5F3F;     /* Forest green - growth, investment */
--accent-blue: #1E3A5F;      /* Navy blue - trust, stability */
--accent-gray: #6B6B6B;      /* Gray - secondary info */

/* Status Colors */
--success: #22C55E;          /* Green - available, positive */
--warning: #F59E0B;          /* Orange - limited availability */
--sold: #EF4444;             /* Red - sold out */

/* Usage Guidelines */
- Use black/white as base (70%)
- Add gold for premium/luxury properties
- Use green for investment/ROI content
- Use blue for trust/stability messaging
- Keep it professional and clean
```

---

## Typography

### Fonts

**Headline Font:** Inter (Modern sans-serif)
- Use for: Property names, headlines, prices
- Weights: Medium (500), Bold (700), ExtraBold (800)
- Style: Professional, modern, highly readable

**Body Font:** Inter (Same for consistency)
- Use for: Descriptions, details, contact info
- Weights: Regular (400), Medium (500)
- Style: Clean, trustworthy

**Mono Font:** JetBrains Mono (For data/numbers)
- Use for: Prices, areas, dates, stats
- Weights: Medium (500), Bold (700)
- Style: Technical, precise

### Size Guidelines

```css
/* Infographic Style (Property Listings) */
Property Name:     48px - Main headline
Price:             56px - Bold, prominent
Stats Label:       20px - "Diện tích", "Bàn giao"
Stats Value:       32px - Bold numbers
Highlights:        18px - Bullet points
Contact Info:      16px - Bottom section

/* Notebook Style (Educational) */
h1 (Title):        48px - Main headlines
h1 (Content):      36px - Section titles
h2:                20px - Subsections
Content:           16px - Body text
List Item:         16px - Bullet points
Brand Corner:      14px - Logo text
```

---

## Content Guidelines

### Language

**Primary:** Vietnamese
**Style:** Professional yet approachable

**Tone:**
- Trustworthy advisor (like a knowledgeable consultant)
- Data-driven and factual
- Avoid overhype, focus on real value
- Use clear Vietnamese (avoid English jargon when possible)

### Key Messaging Principles

1. **Data First:** Always lead with numbers (price, area, location)
2. **Value Proposition:** Clear benefits for buyers/investors
3. **Trust Building:** Mention legal status, developer reputation
4. **Call to Action:** Always include contact info and next steps

### Content Structure

**Property Listings (Infographic):**
```
1. Property name + tagline
2. Key stats (4-6 data points)
3. Highlights (5-7 bullet points)
4. Contact information
5. Call to action
```

**Educational Content (Notebook):**
```
1. Title slide (problem/opportunity)
2. Background/context
3. Main points (3-5 slides)
4. Summary/recommendations
5. CTA (contact for consultation)
```

### Content Length

| Format | Headline | Stats | Highlights | Caption |
|--------|----------|-------|------------|---------|
| **Infographic** | 8-12 words | 4-6 items | 5-7 points | 200-300 words |
| **Notebook** | 8-12 words | Varies | 3-5 per slide | 250-350 words |

---

## Visual Style

### Infographic Style Visuals

**Property Listings:**
- Clean, minimal layout
- Focus on data readability
- Use icons for amenities
- Color-code information types
- Professional charts/graphs

**NO photos of properties** (due to copyright/permissions)
- Use abstract representations
- Icon-based amenity displays
- Location maps (simplified)
- Chart-based comparisons

**Example Prompts:**
```
"Clean real estate infographic layout showing property statistics, minimal black and white design with gold accents for premium features, modern professional aesthetic, icons for amenities, data-focused presentation"
```

### Notebook Style Visuals

**Educational Content:**
- Abstract illustrations
- Minimal line art
- Simple diagrams
- Process flows
- Comparison charts

**Example Prompts:**
```
"Abstract minimalist illustration of house/building shapes transforming from simple to detailed, representing real estate investment growth, black and white with subtle gold accents, professional educational aesthetic"
```

---

## Do's and Don'ts

### ✅ DO's

- Lead with clear, accurate data
- Always include pricing (if available)
- Mention legal status (sổ hồng, pháp lý)
- Highlight location advantages
- Include payment plans
- Show ROI potential for investors
- Provide complete contact information
- Be transparent about project status
- Use professional, clean design

### ❌ DON'Ts

- Exaggerate or overpromise
- Use stock photos of generic buildings
- Hide important details (fees, timeline)
- Use pushy sales language
- Create urgency through false scarcity
- Forget contact information
- Use cluttered, busy designs
- Mix too many accent colors
- Copy competitor content

---

## Contact Information Standard

**Always include on every post:**

```
📞 Liên hệ ngay: 0903.469.888
📍 Địa chỉ: 32 đường 40, KDC Vạn Phúc, TP Thủ Đức
💬 Zalo: 0903.469.888
🌐 Website: thachvuland.com
⏰ Giờ làm việc: 8:00 - 18:00 (Thứ 2 - Chủ Nhật)
```

**Tagline:** "Đầu Tư BĐS Bình Dương Uy Tín"

---

## Content Pillars

All content should fall into one of these categories:

1. **Property Listings** (40%) - Infographic
   - New developments
   - Available units
   - Investment opportunities

2. **Market Analysis** (20%) - Infographic
   - Price trends
   - Location comparisons
   - Developer rankings

3. **Buyer Education** (20%) - Notebook
   - First-time buyer guides
   - Investment strategies
   - Legal/financial advice

4. **Location Highlights** (10%) - Infographic
   - Infrastructure development
   - Amenities and facilities
   - Future growth potential

5. **Success Stories** (10%) - Notebook
   - Customer testimonials
   - Investment returns
   - Case studies

---

## Style Selection Guide

| Content Type | Design Style | Format Type | Slide Count |
|--------------|--------------|-------------|-------------|
| Property listing | infographic | single-post | 1 |
| Price comparison | infographic | carousel-compact | 5 |
| Market trends | infographic | carousel-compact | 5 |
| Buyer guide | notebook | carousel-standard | 7 |
| Investment tips | notebook | carousel-standard | 7 |
| Location analysis | infographic | single-post | 1 |

---

## Template Files

Reference these example files:

**Infographic Style:**
- `thachvuland-phu-dong-sky-one.json`
- `thachvuland-setia-edenia-auto.json`

**Notebook Style:**
- `thachvuland-first-time-buyer-guide.json`
- `thachvuland-investment-strategy.json`

---

## Caption Template

**For Property Listings:**

```
🏡 [TÊN DỰ ÁN] - [TAGLINE]

📊 THÔNG TIN DỰ ÁN:
• Giá: [GIÁ]
• Diện tích: [DIỆN TÍCH]
• Bàn giao: [THỜI GIAN]
• Thanh toán: [CHÍNH SÁCH]

✨ ĐIỂM NỔI BẬT:
1️⃣ [HIGHLIGHT 1]
2️⃣ [HIGHLIGHT 2]
3️⃣ [HIGHLIGHT 3]
4️⃣ [HIGHLIGHT 4]
5️⃣ [HIGHLIGHT 5]

💰 ƯU ĐÃI ĐẶC BIỆT:
👉 [OFFER 1]
👉 [OFFER 2]
👉 [OFFER 3]

━━━━━━━━━━━━━━━━━━━━

📞 Liên hệ ngay: 0903.469.888
📍 Địa chỉ: 32 đường 40 . KDC Vạn Phúc , TP Thủ Đức
💬 Zalo: 0903.469.888
🌐 Website: thachvuland.com

⏰ Giờ làm việc: 8:00 - 18:00 (Thứ 2 - Chủ Nhật)

Đầu Tư BĐS Bình Dương Uy Tín

#[ProjectName] #BatDongSanBinhDuong #CanHo #DauTuBDS #ThachVuLand
```

---

## Migration Notes

**Previous Style:** `notebook-lm`
**New Styles:**
- Primary: `infographic` (for property listings)
- Secondary: `notebook` (for educational content)

The NotebookLM-inspired aesthetic is preserved in the `notebook` style for educational content, while property listings now use the more appropriate `infographic` style for data-heavy presentations.

---

**Version:** 1.0
**Last Updated:** 2026-01-17
**Maintained by:** Automation System

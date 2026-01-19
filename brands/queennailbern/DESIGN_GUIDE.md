# 🎨 Queen Nail Bern - Design Style Guide

## Brand Identity

**Brand:** Queen Nail Bern
**Industry:** Premium Nail Salon
**Location:** Bern, Switzerland
**Language:** German (primary), Vietnamese (secondary)
**Target Audience:** Women 18-55 in Bern area

---

## Official Design Styles

Queen Nail Bern uses **2 official design styles** from the standardized system:

### 1. **QUOTE** (Primary Style) ✨

**Use for:**
- Single promotional posts
- Testimonials and customer reviews
- Announcements (new services, hours, holidays)
- Special offers and discounts
- Motivational/inspirational content

**Characteristics:**
- ✅ Minimal, elegant design
- ✅ Large typography with Playfair Display
- ✅ Vibrant gradient background (Pink #F43F5E → Light Pink #FDA4AF → Pale Pink #FFE4E6)
- ✅ Focus on the message/quote
- ✅ Plenty of whitespace

**Format Type:** `single-post` (1200x1200, 1:1)

**Example JSON Structure:**
```json
{
  "title": "Perfect Nails for Winter",
  "topic": "Nail care promotion",
  "brand": "Queen Nail Bern",
  "formatType": "single-post",
  "contentType": "promotion",
  "designStyle": "quote",
  "slideCount": 1,
  "dimensions": {
    "width": 1200,
    "height": 1200,
    "aspectRatio": "1:1"
  },
  "slides": [
    {
      "type": "quote",
      "quote": "Beautiful nails are always in fashion",
      "translation": "Schöne Nägel sind immer in Mode",
      "author": "Queen Nail Bern",
      "title": "Premium Nail Salon",
      "context": "Winter Special Offer",
      "visual": "Elegant nail art photo with soft pink background"
    }
  ]
}
```

---

### 2. **INFOGRAPHIC** (Secondary Style) 📊

**Use for:**
- Nail care tips (5 tips, 7 steps, etc.)
- Trend reports (Top nail designs 2026)
- Price lists and service comparisons
- Before/after showcases
- Educational content about nail health

**Characteristics:**
- ✅ Data-focused layout
- ✅ Numbered lists with icons
- ✅ Color-coded sections
- ✅ Visual hierarchy for information
- ✅ Professional yet approachable

**Format Type:** `carousel-compact` (1080x1350, 4:5) for 3-5 slides

**Example JSON Structure:**
```json
{
  "title": "5 Tipps für gesunde Nägel",
  "topic": "Nail care tips",
  "brand": "Queen Nail Bern",
  "formatType": "carousel-compact",
  "contentType": "tips",
  "designStyle": "infographic",
  "slideCount": 5,
  "dimensions": {
    "width": 1080,
    "height": 1350,
    "aspectRatio": "4:5"
  },
  "slides": [
    {
      "type": "title",
      "headline": "5 Tipps für gesunde Nägel",
      "subheadline": "Von den Experten bei Queen Nail Bern",
      "visual": "Clean title design with nail care icons"
    },
    {
      "type": "content",
      "headline": "Tipp 1: Regelmäßige Pflege",
      "content": "Pflegen Sie Ihre Nägel mindestens einmal pro Woche mit Nagelöl...",
      "visual": "Infographic showing nail care routine"
    },
    {
      "type": "cta",
      "headline": "Jetzt Termin buchen",
      "subheadline": "Queen Nails & Lashes, Kramgasse 37, Bern",
      "content": "Hotline: +41 79 805 00 68"
    }
  ]
}
```

---

## Color Palette

```css
/* Primary Colors - Vibrant Pink Gradient */
--gradient-start: #F43F5E;   /* Vibrant Pink - gradient start */
--gradient-middle: #FDA4AF;  /* Light Pink - gradient midpoint */
--gradient-end: #FFE4E6;     /* Pale Pink - gradient end */
--background: linear-gradient(135deg, #F43F5E 0%, #FDA4AF 50%, #FFE4E6 100%);

/* Text Colors */
--text: #FFFFFF;             /* White - main text for maximum contrast */

/* Usage Guidelines */
- Background Gradient: Slide backgrounds, cards (left-to-right flow)
- Text White: All text content, headers, slide numbers (NOT affected by gradient)
- Color Style: Vibrant pink tones (Pink-Light Pink-Pale Pink) for smooth transitions
- Style: High saturation, dynamic, feminine, modern for social media
```

---

## Typography

### Fonts

**Headline Font:** Playfair Display (Elegant serif)
- Use for: Main headlines, brand name, quotes
- Weights: Regular (400), Bold (700)
- Style: Classic, sophisticated, feminine

**Body Font:** Montserrat (Clean sans-serif)
- Use for: Body text, descriptions, CTAs
- Weights: Regular (400), Medium (500), Bold (700)
- Style: Modern, readable, professional

### Size Guidelines

```css
/* Quote Style */
h1 (Title):        72px - Main headlines
h1 (Content):      56px - Quote text
h2:                36px - Section headers
Subheadline:       28px - Supporting text
Content:           24px - Body text
Brand Corner:      20px - Logo text

/* Infographic Style */
h1 (Title):        56px - Main headlines
h2:                32px - Slide titles
List Item:         26px - Tips/points
Content:           24px - Descriptions
Slide Number:      24px - Page indicators
```

---

## Content Guidelines

### Language

**Primary:** German (for local audience in Bern)
**Secondary:** Vietnamese (for employee recruitment)

**German Style:**
- Formal but friendly ("Sie" form)
- Professional terminology
- Clear, concise sentences
- Focus on quality and service

**Vietnamese Style:**
- Respectful, professional
- Use for recruitment posts
- Include salary and benefits clearly

### Content Length

| Format | Headline | Subheadline | Content | Total Words |
|--------|----------|-------------|---------|-------------|
| **Quote** | 5-8 words | 8-12 words | 15-25 words | ~40 |
| **Infographic** | 5-8 words | 10-15 words | 40-60 words/slide | ~200 total |

---

## Visual Style

### Photography

**Preferred:**
- ✅ Close-up shots of perfectly manicured nails
- ✅ Soft, natural lighting
- ✅ Elegant hands with jewelry
- ✅ Luxurious backgrounds (marble, silk, flowers)
- ✅ Professional salon environment

**Avoid:**
- ❌ Harsh lighting or shadows
- ❌ Cluttered backgrounds
- ❌ DIY/amateur aesthetic
- ❌ Overly filtered or artificial colors

### Visual Prompts Examples

**For Quote Style:**
```
"Professional manicured hands with vibrant pink nail polish, elegant gold jewelry, placed on vibrant gradient background from pink to rose, soft diffused lighting, luxurious beauty salon aesthetic, bright and energetic color palette with pink-rose-red gradient, photorealistic, aspirational mood"
```

**For Infographic Style:**
```
"Clean infographic layout showing 5 nail care steps, numbered from 1-5 with simple line icons, vibrant pink-rose-red gradient background, white text, professional beauty brand aesthetic, minimal design with high energy"
```

---

## Do's and Don'ts

### ✅ DO's

- Use vibrant pink gradient background: Pink #F43F5E → Light Pink #FDA4AF → Pale Pink #FFE4E6
- Keep designs energetic, feminine, and modern
- Include clear contact information (Hotline: +41 79 805 00 68)
- Show high-quality nail work
- Maintain professional tone
- Use white text (#FFFFFF) for maximum contrast - NOT affected by gradient
- Include location (Kramgasse 37, 3011 Bern)

### ❌ DON'Ts

- Apply gradient colors to text (text must remain #FFFFFF)
- Overcrowd designs with too much information
- Use trendy/casual slang
- Show unprofessional nail work
- Forget contact details on CTA slides
- Use overly decorative fonts that are hard to read
- Mix too many design styles in one post

---

## Content Pillars

All content should fall into one of these categories:

1. **Nail Designs & Trends** (30%)
   - Latest nail art trends
   - Seasonal designs
   - Before/after showcases

2. **Tips & Care** (25%)
   - Nail health advice
   - Home care tips
   - Product recommendations

3. **Promotions & Pricing** (20%)
   - Special offers
   - Service packages
   - Seasonal discounts

4. **Customer Reviews** (15%)
   - Testimonials
   - Success stories
   - Customer photos

5. **Behind the Scenes** (10%)
   - Team introductions
   - Salon environment
   - Recruitment posts

---

## Quick Reference Chart

| Content Type | Design Style | Format Type | Slide Count | Dimensions |
|--------------|--------------|-------------|-------------|------------|
| Promotion | quote | single-post | 1 | 1200x1200 |
| Announcement | quote | single-post | 1 | 1200x1200 |
| Testimonial | quote | single-post | 1 | 1200x1200 |
| Tips (5 items) | infographic | carousel-compact | 5 | 1080x1350 |
| Nail trends | infographic | carousel-compact | 5 | 1080x1350 |
| Recruitment | quote | single-post | 1 | 1200x1200 |

---

## Template Files

Reference these example files for structure:

**Quote Style:**
- `queennailbern-wir-suchen-nageldesignerin-singlepost.json`

**Infographic Style:**
- `queennailbern-5-tipps-fur-gesunde-nagel-carouselcompact.json`

---

**Version:** 1.0
**Last Updated:** 2026-01-17
**Maintained by:** Automation System

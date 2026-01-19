# 🎨 Design Styles Reference Guide

## Tổng quan 5 Design Styles

Hệ thống automation hỗ trợ 5 design styles khác nhau, mỗi style phù hợp với loại content và mục đích khác nhau:

| Style | Best For | Characteristics | Example Use Cases |
|-------|----------|-----------------|-------------------|
| **notebook** | Educational, professional content | Clean, minimal, NotebookLM-inspired | GSD Framework, Claude Code tutorials |
| **tutorial** | Step-by-step guides | Numbered steps, annotations, screenshots | Setup guides, how-to content |
| **infographic** | Data-heavy content | Charts, stats, visualizations | Statistics, surveys, rankings |
| **quote** | Inspirational, thought leadership | Minimal, large typography, author focus | Quotes from leaders, key insights |
| **comparison** | Product/tool comparisons | Side-by-side, pros/cons, scores | Tool reviews, before/after |

---

## 1. NOTEBOOK STYLE

### Đặc điểm
- ✅ Clean, minimalist design
- ✅ Warm cream background (#F4F3EE) với subtle dot pattern
- ✅ Professional typography (Poppins + Lora)
- ✅ Abstract SVG illustrations
- ✅ Educational aesthetic (như NotebookLM, Google style)

### Khi nào dùng
- Content giáo dục, hướng dẫn concepts
- Professional knowledge sharing
- Framework explanations
- Technical tutorials

### JSON Structure
```json
{
  "title": "Your Title",
  "topic": "Short description",
  "brand": "Long Best AI",
  "designStyle": "notebook",
  "slides": [
    {
      "type": "title",
      "headline": "Main Headline",
      "subheadline": "Supporting text",
      "content": "Source or context",
      "visual": "Description for SVG generation"
    },
    {
      "type": "content",
      "headline": "Section Title",
      "subheadline": "Brief description",
      "content": "Main content text",
      "visual": "Visual description"
    },
    {
      "type": "list",
      "headline": "List Title",
      "subheadline": "List description",
      "content": [
        "Item 1",
        "Item 2",
        "Item 3"
      ],
      "visual": "Icons or minimal graphics"
    },
    {
      "type": "cta",
      "headline": "Call to Action",
      "subheadline": "Value proposition",
      "content": "Detailed CTA text",
      "visual": "CTA design description"
    }
  ]
}
```

### Visual Guidelines
- **Title slides**: Abstract flow (chaos → order)
- **Content slides**: Diagrams, curves, flowcharts
- **List slides**: Minimal icons, numbered badges
- **CTA slides**: Dark background contrast

### Example Visual Prompts
```
"Abstract flowing shapes transitioning from chaotic lines on left to organized geometric blocks on right, warm cream background with dark green and gray accents, professional minimalist design"

"Professional curve graph showing efficiency decay over time, clean data visualization style with gradient from green to red"
```

---

## 2. TUTORIAL STYLE

### Đặc điểm
- ✅ Step-by-step numbered flow
- ✅ Annotations and pointers
- ✅ Code snippets với syntax highlighting
- ✅ Screenshots hoặc UI mockups
- ✅ Clear instructional hierarchy

### Khi nào dùng
- Installation guides
- Setup tutorials
- Multi-step processes
- Technical how-tos

### JSON Structure
```json
{
  "designStyle": "tutorial",
  "slides": [
    {
      "type": "content",
      "headline": "Bước 1: Setup Environment",
      "subheadline": "Install dependencies",
      "content": "Detailed instructions...",
      "visual": "Terminal screenshot with annotations",
      "steps": [
        "Step detail 1",
        "Step detail 2",
        "Step detail 3"
      ]
    }
  ]
}
```

### Visual Guidelines
- Terminal/code screenshots với highlights
- Numbered annotations (1, 2, 3)
- Before/after comparisons
- Folder structure diagrams

### Tips
- Mỗi slide = 1 step cụ thể
- Bao gồm actual commands hoặc code
- Visual phải rõ ràng, dễ follow
- Sử dụng arrows và labels

---

## 3. INFOGRAPHIC STYLE

### Đặc điểm
- ✅ Data-focused design
- ✅ Charts, graphs, statistics
- ✅ Bold numbers và percentages
- ✅ Color-coded categories
- ✅ Visual hierarchy for data

### Khi nào dùng
- Statistics và survey results
- Rankings và top lists
- Data analysis
- Trend reports

### JSON Structure
```json
{
  "designStyle": "infographic",
  "slides": [
    {
      "type": "stats",
      "headline": "Top 3 AI Tools",
      "subheadline": "Most popular in 2026",
      "stats": [
        {
          "rank": "1",
          "name": "ChatGPT",
          "value": "87%",
          "change": "+12%",
          "description": "Chat and generation"
        }
      ],
      "visual": "Bar chart with growth indicators"
    },
    {
      "type": "insights",
      "headline": "Key Insights",
      "insights": [
        {
          "icon": "📈",
          "title": "Growth trend",
          "value": "+35%",
          "description": "Explanation"
        }
      ]
    }
  ]
}
```

### Visual Guidelines
- **Stats slides**: Bar charts, horizontal comparisons
- **Insights slides**: Card grid với icons
- **Comparison slides**: Donut charts, pie charts
- Use consistent color palette for categories

### Color Usage
- Primary data: #4A7C59 (green)
- Secondary data: #C15F3C (terracotta)
- Neutral: #8A8A8A (gray)
- Positive change: Green
- Negative change: Red

---

## 4. QUOTE STYLE

### Đặc điểm
- ✅ Minimalist design
- ✅ Large, impactful typography
- ✅ Focus on the quote text
- ✅ Author attribution prominent
- ✅ Plenty of whitespace

### Khi nào dùng
- Inspirational quotes
- Thought leadership
- Key insights from experts
- Statement posts

### JSON Structure
```json
{
  "designStyle": "quote",
  "slides": [
    {
      "type": "quote",
      "quote": "The quote text in English",
      "translation": "Bản dịch tiếng Việt",
      "author": "Author Name",
      "title": "Their title/position",
      "context": "Where/when said",
      "visual": "Minimal background design"
    },
    {
      "type": "statement",
      "headline": "Your take on the quotes",
      "subheadline": "Context or connection",
      "content": "Your commentary",
      "visual": "Author collage or themed visual"
    }
  ]
}
```

### Visual Guidelines
- Centered text layout
- 70% text, 30% visual
- Subtle background patterns
- Author photo (optional, subtle)
- Emphasis on typography

### Typography Rules
- Quote text: 56-72px
- Translation: 32-40px (lighter weight)
- Author name: 28px (bold)
- Title: 20px (regular)

---

## 5. COMPARISON STYLE

### Đặc điểm
- ✅ Side-by-side layout
- ✅ Equal visual weight for both sides
- ✅ Pros/cons lists
- ✅ Scoring system
- ✅ Clear verdict/recommendation

### Khi nào dùng
- Tool comparisons
- Product reviews
- Before/after scenarios
- Feature comparisons
- A vs B analyses

### JSON Structure
```json
{
  "designStyle": "comparison",
  "slides": [
    {
      "type": "comparison",
      "category": "Feature Category",
      "leftSide": {
        "tool": "Tool A",
        "score": "9/10",
        "pros": ["Pro 1", "Pro 2"],
        "cons": ["Con 1"]
      },
      "rightSide": {
        "tool": "Tool B",
        "score": "7/10",
        "pros": ["Pro 1"],
        "cons": ["Con 1", "Con 2"]
      },
      "visual": "Side-by-side comparison cards"
    },
    {
      "type": "verdict",
      "headline": "Final Verdict",
      "verdict": {
        "toolA": {
          "bestFor": "Use case description",
          "useCase": ["Case 1", "Case 2"]
        },
        "toolB": {
          "bestFor": "Use case description",
          "useCase": ["Case 1", "Case 2"]
        }
      },
      "recommendation": "Overall recommendation",
      "visual": "Decision tree or recommendation card"
    }
  ]
}
```

### Visual Guidelines
- Perfect 50/50 split vertically
- Color coding: Tool A (blue/left), Tool B (green/right)
- Checkmarks for pros, X marks for cons
- Scores prominently displayed
- Neutral center line separator

### Layout Rules
- Title slide: Both logos visible
- Comparison slides: Category at top, split below
- Verdict slide: Unified recommendation
- CTA slide: Combined offering

---

## 📐 Technical Specifications

### All Styles
- **Dimensions**: 1080 × 1350px (4:5 ratio)
- **DPI**: deviceScaleFactor = 3 (high resolution)
- **Format**: PNG
- **Font loading**: Google Fonts via CDN

### Common Fonts
- **Headline**: Poppins (400, 600, 800)
- **Body**: Lora (400, 600)
- **Mono**: Roboto Mono (for code/badges)

### Color Palette (Long Best AI)
```css
--bg-light: #F4F3EE
--bg-dark: #141413
--primary: #C15F3C (terracotta)
--secondary: #788c5d (olive green)
--accent: #4A7C59 (forest green)
--text-dark: #0A0A0A
--text-gray: #6A6A6A
```

---

## 🚀 Quick Start Guide

### 1. Choose Your Style
Quyết định style dựa trên content type:
- Giáo dục → notebook
- Hướng dẫn → tutorial
- Số liệu → infographic
- Quote → quote
- So sánh → comparison

### 2. Create JSON File
```bash
# Naming convention
scripts/carousel-generator/content/longbest-[style]-[topic-slug].json
```

Examples:
- `longbest-notebook-gsd-framework.json`
- `longbest-tutorial-setup-automation.json`
- `longbest-infographic-ai-tools-2026.json`
- `longbest-quote-ai-leaders.json`
- `longbest-comparison-claude-vs-copilot.json`

### 3. Generate Images
```bash
cd scripts
node carousel-generator/generator-enhanced.js \
  carousel-generator/content/your-file.json \
  ../output/your-output-folder
```

### 4. Verify Output
```bash
open output/your-output-folder
# Should see: 01.png - 07.png + content.json
```

---

## 💡 Pro Tips

### Mixing Styles
Bạn có thể mix styles trong một carousel:
```json
{
  "designStyle": "notebook",
  "slides": [
    {"type": "title", ...},
    {"type": "content", ...},
    {"type": "comparison", ...}, // Comparison slide in notebook style
    {"type": "stats", ...},      // Stats slide in notebook style
    {"type": "cta", ...}
  ]
}
```

### Visual Descriptions
Càng chi tiết càng tốt:
- ✅ "Horizontal bar chart showing percentages, green for positive growth, red for negative, with tool logos on left"
- ❌ "Chart with data"

### Content Length
- Headline: 5-10 words
- Subheadline: 10-15 words
- Content (notebook/tutorial): 40-60 words
- Content (quote): 20-30 words
- List items: 8-12 words each

### Brand Consistency
Luôn set đúng brand trong JSON:
```json
{
  "brand": "Long Best AI",  // Sẽ load đúng colors, fonts
  "designStyle": "notebook"
}
```

---

## 🔍 Troubleshooting

### Issue: Style không render đúng
**Check:**
- `designStyle` field có đúng không? (notebook, tutorial, infographic, quote, comparison)
- `type` của slides có match với style không?

### Issue: Visual không đẹp
**Solutions:**
- Improve visual descriptions với specific details
- Reference examples trong các file mẫu
- Test với variations khác nhau

### Issue: Text bị cắt
**Solutions:**
- Giảm độ dài content
- Adjust font sizes trong generator
- Check viewport dimensions

---

## 📚 Example Files Reference

### Notebook Style
- `longbest-ban-dang-dung-claude-code-sai-cach.json`

### Tutorial Style
- `longbest-tutorial-7-buoc-xay-dung-he-thong-tu-dong-hoa.json`

### Infographic Style
- `longbest-infographic-top-10-ai-tools-2026.json`

### Quote Style
- `longbest-quote-ai-leaders-on-future.json`

### Comparison Style
- `longbest-comparison-claude-code-vs-github-copilot.json`

---

---

## 🏢 Brand-Specific Guidelines

Each brand has preferred design styles based on their industry and content type:

### Queen Nail Bern (Nail Salon)
**Primary Style:** `quote`
**Secondary Style:** `infographic`

**Usage:**
- Use `quote` for: Promotions, testimonials, announcements, single posts
- Use `infographic` for: Nail care tips, trend reports, multi-point content

**See:** `/brands/queennailbern/DESIGN_GUIDE.md` for detailed guidelines

---

### Long Best AI (AI Education)
**Primary Style:** `notebook`
**Secondary Style:** `tutorial`
**Tertiary Style:** `infographic`

**Usage:**
- Use `notebook` for: Educational concepts, frameworks, AI explanations
- Use `tutorial` for: Step-by-step guides, setup instructions, how-tos
- Use `infographic` for: Tool comparisons, statistics, rankings

**See:** `/brands/longbest-ai/DESIGN_GUIDE.md` for detailed guidelines

---

### Thach Vu Land (Real Estate)
**Primary Style:** `infographic`
**Secondary Style:** `notebook`

**Usage:**
- Use `infographic` for: Property listings, market data, price comparisons
- Use `notebook` for: Investment guides, buyer education, market analysis

**See:** `/brands/thachvuland/DESIGN_GUIDE.md` for detailed guidelines

---

## 🔄 Migration Notes

**Previous deprecated styles have been migrated:**

| Old Style | New Style | Affected Brands |
|-----------|-----------|-----------------|
| `notebook-lm` | `notebook` | Long Best AI |
| `notebook-lm` | `infographic` | Thach Vu Land (real estate-specific) |
| `classic` | `quote` | Queen Nail Bern |
| `modern-minimal` | `notebook` | All |
| `head-silhouette` | `infographic` | All |

**Tools:**
- Validate content: `node scripts/carousel-generator/validate-design-styles.js --all`
- Migrate old styles: `node scripts/carousel-generator/migrate-design-styles.js --all`

---

**Version:** 2.0
**Last Updated:** 2026-01-17 (Standardization Complete)
**Created:** 2026-01-12
**Author:** Long Best AI Automation System

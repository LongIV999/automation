# 🎨 Long Best AI - Design Style Guide

## Brand Identity

**Brand:** Long Best AI
**Industry:** AI Education & Tools
**Language:** Vietnamese
**Target Audience:** Vietnamese professionals learning AI, developers, marketers
**Brand Voice:** Educational, approachable, technical but clear

---

## Official Design Styles

Long Best AI uses **3 official design styles** from the standardized system:

### 1. **NOTEBOOK** (Primary Style) 📓

**Use for:**
- Educational content about AI concepts
- Framework explanations (GSD, agentic AI)
- Tool tutorials and guides
- Technical explanations made simple
- Knowledge sharing posts

**Characteristics:**
- ✅ Clean, minimalist NotebookLM-inspired design
- ✅ Black & white typography focus
- ✅ Professional educational aesthetic
- ✅ Abstract SVG illustrations
- ✅ Clear information hierarchy

**Format Type:** `carousel-standard` (1080x1350, 4:5) for 7 slides

**Example JSON Structure:**
```json
{
  "title": "GSD Framework - Tạo Nội Dung AI Chuyên Nghiệp",
  "topic": "AI Content Framework",
  "brand": "Long Best AI",
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
      "headline": "GSD Framework",
      "subheadline": "Goal - Situation - Dialogue",
      "content": "Framework tạo nội dung AI chuyên nghiệp",
      "visual": "Abstract flowing shapes from chaos to order"
    },
    {
      "type": "content",
      "headline": "G - Goal (Mục tiêu)",
      "subheadline": "Xác định rõ ràng bạn muốn gì",
      "content": "Mô tả cụ thể kết quả mong muốn...",
      "visual": "Target icon with arrows"
    }
  ]
}
```

---

### 2. **TUTORIAL** (Secondary Style) 📚

**Use for:**
- Step-by-step installation guides
- Setup instructions (n8n, Claude Code, etc.)
- Multi-step workflows
- Technical how-to content
- Process documentation

**Characteristics:**
- ✅ Numbered step flow
- ✅ Code snippets with syntax highlighting
- ✅ Screenshots and annotations
- ✅ Clear instructional hierarchy
- ✅ Terminal/UI mockups

**Format Type:** `carousel-standard` (1080x1350, 4:5) for 7 slides

**Example JSON Structure:**
```json
{
  "title": "7 Bước Xây Dựng Workflow Automation",
  "topic": "Automation Setup Tutorial",
  "brand": "Long Best AI",
  "formatType": "carousel-standard",
  "contentType": "tutorial",
  "designStyle": "tutorial",
  "slideCount": 7,
  "dimensions": {
    "width": 1080,
    "height": 1350,
    "aspectRatio": "4:5"
  },
  "slides": [
    {
      "type": "title",
      "headline": "7 Bước Xây Dựng Workflow Automation",
      "subheadline": "Từ ý tưởng đến triển khai",
      "visual": "Process flow diagram 1-7"
    },
    {
      "type": "content",
      "headline": "Bước 1: Phân Tích Workflow",
      "subheadline": "Hiểu rõ quy trình hiện tại",
      "content": "• Liệt kê các bước thủ công\n• Xác định bottleneck\n• Tính thời gian mỗi bước",
      "steps": ["Liệt kê", "Xác định", "Tính toán"],
      "visual": "Flowchart with annotations"
    }
  ]
}
```

---

### 3. **INFOGRAPHIC** (Tertiary Style) 📊

**Use for:**
- AI tool comparisons
- Statistics and trends
- Top 10 lists
- Survey results
- Data visualization
- Rankings

**Characteristics:**
- ✅ Data-focused design
- ✅ Charts, graphs, statistics
- ✅ Bold numbers and percentages
- ✅ Color-coded categories
- ✅ Visual hierarchy for data

**Format Type:** `carousel-compact` (1080x1350, 4:5) for 5 slides

**Example JSON Structure:**
```json
{
  "title": "Top 10 AI Tools 2026",
  "topic": "AI Tools Ranking",
  "brand": "Long Best AI",
  "formatType": "carousel-compact",
  "contentType": "list",
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
      "headline": "Top 10 AI Tools 2026",
      "subheadline": "Công cụ AI được sử dụng nhiều nhất",
      "visual": "Trophy icon with rankings"
    },
    {
      "type": "stats",
      "headline": "Top 3 AI Tools",
      "stats": [
        {
          "rank": "1",
          "name": "ChatGPT",
          "value": "87%",
          "change": "+12%",
          "description": "Chat và generation"
        },
        {
          "rank": "2",
          "name": "Claude",
          "value": "76%",
          "change": "+25%",
          "description": "Coding và analysis"
        }
      ]
    }
  ]
}
```

---

## Color Palette

```css
/* Primary Colors - Black & White System */
--primary: #000000;          /* Black - main brand color */
--background: #FFFFFF;       /* White - backgrounds */
--text: #000000;             /* Black - main text */

/* Dark Mode (Optional) */
--background-dark: #000000;  /* Black background */
--text-dark: #FFFFFF;        /* White text */

/* Accent Colors (Use sparingly) */
--accent-green: #4A7C59;     /* Forest green - positive data */
--accent-red: #C15F3C;       /* Terracotta - important highlights */
--accent-gray: #8A8A8A;      /* Gray - secondary info */

/* Usage Guidelines */
- Use black/white as primary
- Add accent colors ONLY for:
  • Data visualization
  • Important metrics
  • CTA buttons
  • Status indicators
- Keep 80% black/white, 20% accent
```

---

## Typography

### Fonts

**Headline Font:** Inter (Modern sans-serif)
- Use for: Headlines, titles, section headers
- Weights: Regular (400), Medium (500), Bold (700)
- Style: Clean, professional, highly readable

**Body Font:** Inter (Same as headline for consistency)
- Use for: Body text, descriptions, lists
- Weights: Regular (400), Medium (500)
- Style: Professional, technical yet approachable

**Mono Font:** JetBrains Mono (Coding font)
- Use for: Code snippets, technical terms, badges
- Weights: Regular (400), Medium (500)
- Style: Developer-friendly, technical

### Size Guidelines

```css
/* Notebook & Tutorial Styles */
h1 (Title):        48px - Main headlines
h1 (Content):      36px - Section titles
h2:                20px - Subsections
Subheadline:       20px - Supporting text
Content:           16px - Body text
List Item:         16px - Bullet points
Prompt Box:        14px - Code/quotes
Slide Number:      14px - Page indicators
Brand Corner:      14px - Logo text

/* Infographic Style */
Stats Number:      56px - Big numbers
Stats Label:       24px - Metric labels
Rank Badge:        32px - Position numbers
```

---

## Content Guidelines

### Language

**Primary:** Vietnamese
**Style:** Educational but conversational

**Tone:**
- Friendly expert (like a knowledgeable friend teaching)
- Technical accuracy with simple explanations
- Use Vietnamese tech terms when clear, English when standard
- Example: "AI Agent" (keep English), "Tự động hóa" (use Vietnamese)

### Content Structure

**Educational Posts (Notebook/Tutorial):**
- Start with problem/pain point
- Explain concept clearly
- Provide actionable steps
- End with next steps

**Data Posts (Infographic):**
- Lead with surprising stat
- Compare and contrast
- Provide context
- End with recommendations

### Content Length

| Format | Headline | Subheadline | Content | Total Words |
|--------|----------|-------------|---------|-------------|
| **Notebook** | 5-10 words | 10-15 words | 40-60 words/slide | ~350 total |
| **Tutorial** | 5-8 words | 8-12 words | 30-50 words/slide | ~280 total |
| **Infographic** | 5-8 words | 8-12 words | 20-30 words/slide | ~180 total |

---

## Visual Style

### Notebook Style Visuals

**Abstract Illustrations:**
- Flowing shapes and curves
- Geometric patterns
- Minimal line art
- SVG-style graphics
- No photos, all abstract

**Color Usage:**
- 90% black/white
- 10% accent for emphasis
- Use gradients sparingly

**Example Prompts:**
```
"Abstract flowing shapes transitioning from chaotic scattered lines on left to organized geometric grid on right, minimalist black and white design with subtle gray gradients, professional educational aesthetic"
```

### Tutorial Style Visuals

**Screenshots & Mockups:**
- Terminal/code screenshots
- UI interface mockups
- Annotated diagrams
- Before/after comparisons
- Numbered step indicators

**Example Prompts:**
```
"Clean terminal screenshot showing npm install command with highlighted output, modern dark theme interface, numbered annotations pointing to key steps, minimalist developer aesthetic"
```

### Infographic Style Visuals

**Data Visualization:**
- Bar charts (horizontal/vertical)
- Pie/donut charts
- Line graphs for trends
- Icon grids
- Comparison cards

**Example Prompts:**
```
"Professional bar chart comparing AI tool adoption rates, horizontal bars in black with percentage labels, clean minimalist design, tools ranked 1-10 with logos, modern infographic style"
```

---

## Do's and Don'ts

### ✅ DO's

- Keep designs clean and minimal
- Use black/white as primary palette
- Explain technical concepts simply
- Include actionable takeaways
- Use Vietnamese naturally (not translated English)
- Show real examples and use cases
- Credit sources when sharing data
- Keep typography crisp and readable

### ❌ DON'Ts

- Use colorful, busy designs
- Mix too many font families
- Use jargon without explanation
- Create content without clear value
- Directly translate English idioms
- Use stock photos with cheesy business people
- Copy competitor content
- Overcomplicate simple concepts

---

## Content Pillars

All content should fall into one of these categories:

1. **Tutorials** (35%)
   - Tool setup guides
   - Workflow tutorials
   - Technical how-tos

2. **Tips & Tricks** (25%)
   - Prompt engineering
   - Productivity hacks
   - Tool comparisons

3. **Case Studies** (15%)
   - Real-world applications
   - Success stories
   - Problem-solving examples

4. **Tool Reviews** (15%)
   - AI tool comparisons
   - Feature analysis
   - Recommendations

5. **News & Updates** (10%)
   - AI industry trends
   - Tool updates
   - Technology news

---

## Style Selection Guide

| Content Type | Design Style | Format Type | Slide Count |
|--------------|--------------|-------------|-------------|
| Concept explanation | notebook | carousel-standard | 7 |
| Framework guide | notebook | carousel-standard | 7 |
| Setup tutorial | tutorial | carousel-standard | 7 |
| Step-by-step guide | tutorial | carousel-standard | 7 |
| Tool comparison | infographic | carousel-compact | 5 |
| Top 10 list | infographic | carousel-compact | 5 |
| Statistics | infographic | carousel-compact | 5 |
| Quick tips (3-5) | infographic | carousel-compact | 5 |

---

## Template Files

Reference these example files:

**Notebook Style:**
- `longbest-ban-dang-dung-claude-code-sai-cach.json`
- `longbest-gsd-framework.json`

**Tutorial Style:**
- `longbest-7-buoc-xay-dung-workflow-automation.json`
- `longbest-setup-n8n-tutorial.json`

**Infographic Style:**
- `longbest-top-10-ai-tools-2026.json`
- `longbest-ai-trends-comparison.json`

---

## Migration Notes

**Previous Style:** `notebook-lm`
**New Style:** `notebook`

All content previously using `notebook-lm` should now use the official `notebook` style. The aesthetic remains the same (black/white, minimal, NotebookLM-inspired), but the naming is now standardized.

---

**Version:** 1.0
**Last Updated:** 2026-01-17
**Maintained by:** Automation System

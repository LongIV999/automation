# Flexible Content Format System - Design Document

## Tổng Quan

Hệ thống content automation hiện tại được thiết kế để tạo carousel 7 ảnh cố định. Tài liệu này đề xuất một hệ thống linh hoạt hơn, cho phép tùy chỉnh số lượng ảnh và format dựa trên loại nội dung.

## Current State Analysis

### Hiện Trạng
- ✅ Hỗ trợ carousel 7 slides (hardcoded trong brand.json: `slideCount: 7`)
- ✅ Có sẵn `designStyle` check trong generator.js (line 57-59)
- ✅ Hỗ trợ `notebook-typography` style cho single image
- ⚠️ AI Writer luôn tạo 7 slides bất kể content type
- ⚠️ Không có template system để định nghĩa các format khác nhau
- ⚠️ Thiếu validation và rules cho số lượng slides

### Key Files
```
scripts/
├── agent-writer/writer.js          # AI content generation
├── carousel-generator/
│   ├── generator.js                # Image generation (có sẵn designStyle check)
│   ├── generator-enhanced.js       # Enhanced version
│   └── typography-config.json      # Typography settings
├── drive-uploader/upload.js        # Upload & Sheets sync
└── daily-agent.js                  # Main orchestrator
```

---

## Proposed Solution: Content Format Templates

### 1. Content Format Types

Định nghĩa các loại format phổ biến trên Facebook:

| Format Type | Image Count | Dimensions | Use Cases |
|-------------|-------------|------------|-----------|
| **single** | 1 | 1200x1200 | Quote, announcement, promotion banner |
| **duo** | 2 | 1080x1350 | Before/after, comparison, two-part story |
| **carousel-mini** | 3-5 | 1080x1350 | Quick tips, short lists, mini tutorial |
| **carousel-standard** | 7 | 1080x1350 | Educational content, detailed guides (hiện tại) |
| **carousel-long** | 10 | 1080x1350 | Comprehensive tutorials, case studies |
| **story** | 1 | 1080x1920 | Facebook story format (9:16) |
| **cover** | 1 | 820x312 | Facebook cover photo |
| **auto** | dynamic | 1080x1350 | Tự động quyết định dựa vào content length |

### 2. Content Type Rules

Mapping giữa content type và recommended format:

```json
{
  "contentTypes": {
    "quote": {
      "defaultFormat": "single",
      "dimensions": { "width": 1200, "height": 1200 },
      "slideCount": 1,
      "description": "Inspirational quotes, testimonials"
    },
    "announcement": {
      "defaultFormat": "single",
      "dimensions": { "width": 1200, "height": 1200 },
      "slideCount": 1,
      "description": "News, updates, promotions"
    },
    "tips": {
      "defaultFormat": "carousel-mini",
      "dimensions": { "width": 1080, "height": 1350 },
      "slideCount": { "min": 3, "max": 5, "default": 5 },
      "description": "Quick tips, life hacks"
    },
    "tutorial": {
      "defaultFormat": "carousel-standard",
      "dimensions": { "width": 1080, "height": 1350 },
      "slideCount": { "min": 5, "max": 10, "default": 7 },
      "description": "Step-by-step guides, how-tos"
    },
    "case-study": {
      "defaultFormat": "carousel-long",
      "dimensions": { "width": 1080, "height": 1350 },
      "slideCount": { "min": 8, "max": 15, "default": 10 },
      "description": "Detailed case studies, success stories"
    },
    "story": {
      "defaultFormat": "story",
      "dimensions": { "width": 1080, "height": 1920 },
      "slideCount": 1,
      "description": "Facebook story format"
    }
  }
}
```

### 3. Implementation Plan

#### Phase 1: Template Configuration System

**File: `brands/_templates/content-formats.json`**
```json
{
  "version": "1.0.0",
  "formats": {
    "single": {
      "name": "Single Image",
      "slideCount": 1,
      "dimensions": { "width": 1200, "height": 1200 },
      "designStyle": "single-post",
      "structure": {
        "slides": [
          { "type": "title-cta", "required": true }
        ]
      }
    },
    "carousel-mini": {
      "name": "Mini Carousel (3-5 slides)",
      "slideCount": { "min": 3, "max": 5, "default": 5 },
      "dimensions": { "width": 1080, "height": 1350 },
      "designStyle": "carousel-compact",
      "structure": {
        "slides": [
          { "type": "title", "required": true },
          { "type": "content", "count": "2-3", "required": true },
          { "type": "cta", "required": true }
        ]
      }
    },
    "carousel-standard": {
      "name": "Standard Carousel (7 slides)",
      "slideCount": 7,
      "dimensions": { "width": 1080, "height": 1350 },
      "designStyle": "carousel-standard",
      "structure": {
        "slides": [
          { "type": "title", "required": true },
          { "type": "content", "count": "4-5", "required": true },
          { "type": "engagement", "required": false },
          { "type": "cta", "required": true }
        ]
      }
    }
  },
  "contentTypeMapping": {
    "quote": "single",
    "announcement": "single",
    "promotion": "single",
    "tips": "carousel-mini",
    "tutorial": "carousel-standard",
    "guide": "carousel-standard",
    "case-study": "carousel-long"
  }
}
```

#### Phase 2: Update Brand Configuration

**Add to `brand.json`:**
```json
{
  "contentFormats": {
    "enabled": true,
    "defaultFormat": "carousel-standard",
    "allowedFormats": ["single", "carousel-mini", "carousel-standard"],
    "autoDetect": true
  },
  "carousel": {
    "defaultSlideWidth": 1080,
    "defaultSlideHeight": 1350,
    "defaultSlideCount": 7,
    "formats": {
      "single": { "width": 1200, "height": 1200 },
      "carousel": { "width": 1080, "height": 1350 },
      "story": { "width": 1080, "height": 1920 }
    }
  }
}
```

#### Phase 3: Update AI Writer

**File: `scripts/agent-writer/writer.js`**

Changes needed:
1. Accept `--format` parameter
2. Load format template from `content-formats.json`
3. Generate appropriate number of slides based on format
4. Include `formatType` and `slideCount` in output JSON

```javascript
// New parameters
const format = getArgValue('--format') || 'auto';
const contentType = getArgValue('--type') || 'tutorial';

// Load format config
const formatConfig = await loadFormatConfig(brand, format, contentType);

// Update prompt to specify slide count
const slideCountInstruction = formatConfig.slideCount.exact
  ? `exactly ${formatConfig.slideCount.exact} slides`
  : `${formatConfig.slideCount.min}-${formatConfig.slideCount.max} slides`;

// Add to output JSON
contentData.formatType = formatConfig.formatType;
contentData.slideCount = formatConfig.slideCount;
contentData.dimensions = formatConfig.dimensions;
```

#### Phase 4: Update Image Generator

**File: `scripts/carousel-generator/generator.js`**

Changes needed:
1. Read `formatType` and `dimensions` from content JSON
2. Set viewport based on format dimensions
3. Support variable slide counts
4. Add templates for each format type

```javascript
// Read format from content
const formatType = contentData.formatType || 'carousel-standard';
const dimensions = contentData.dimensions || { width: 1080, height: 1350 };
const slideCount = contentData.slides.length;

// Set viewport
await page.setViewport({
  width: dimensions.width,
  height: dimensions.height,
  deviceScaleFactor: 3
});

// Load format template
const template = await loadFormatTemplate(formatType);

// Generate slides
for (let i = 0; i < slideCount; i++) {
  // Use format-specific template
  const slideHTML = createSlideHTML(
    contentData.slides[i],
    i + 1,
    contentData,
    template
  );
  // ... rest of generation
}
```

#### Phase 5: Update Uploader & Daily Agent

Minor changes needed to pass format parameters through the pipeline.

---

## Usage Examples

### Example 1: Single Post (Quote)

```bash
node scripts/daily-agent.js "Focus on progress, not perfection" \
  --brand longbest \
  --format single \
  --type quote
```

**Output:** 1 image (1200x1200px) với quote design

### Example 2: Mini Carousel (5 Tips)

```bash
node scripts/daily-agent.js "5 AI Tools Every Marketer Needs" \
  --brand longbest \
  --format carousel-mini \
  --type tips
```

**Output:** 5 images (1080x1350px)
- Slide 1: Title
- Slides 2-4: Each tool (1 per slide)
- Slide 5: CTA

### Example 3: Auto-detect Format

```bash
node scripts/daily-agent.js "Quick Tip: Save 2 hours with this AI trick" \
  --brand longbest \
  --format auto
```

**AI detects:** Short content → `carousel-mini` format → 3 slides

### Example 4: Standard Carousel (Current behavior)

```bash
node scripts/daily-agent.js "Complete Guide to AI Automation" \
  --brand longbest \
  --format carousel-standard
```

**Output:** 7 images (1080x1350px) - same as current system

---

## Content Type Auto-Detection Logic

AI Writer sẽ analyze topic và auto-detect format type:

```javascript
function detectContentType(topic) {
  const topicLower = topic.toLowerCase();

  // Quote detection
  if (topicLower.includes('quote') ||
      topicLower.match(/^["'`]/)) {
    return 'quote';
  }

  // Tips detection (number + tips/ways/tricks)
  if (topicLower.match(/(\d+)\s+(tips|ways|tricks|tools|methods)/)) {
    const count = parseInt(topicLower.match(/\d+/)[0]);
    return count <= 5 ? 'tips' : 'tutorial';
  }

  // Announcement
  if (topicLower.includes('announcement') ||
      topicLower.includes('news') ||
      topicLower.includes('promotion')) {
    return 'announcement';
  }

  // Tutorial/Guide
  if (topicLower.includes('how to') ||
      topicLower.includes('guide') ||
      topicLower.includes('tutorial') ||
      topicLower.includes('step by step')) {
    return 'tutorial';
  }

  // Default
  return 'tutorial';
}

function detectSlideCount(contentType, topic) {
  // Extract number from topic if present
  const match = topic.match(/(\d+)/);
  if (match) {
    const num = parseInt(match[0]);
    // Add 2 for title + CTA slides
    return Math.min(num + 2, 15);
  }

  // Use default from content type
  const defaults = {
    'quote': 1,
    'announcement': 1,
    'tips': 5,
    'tutorial': 7,
    'case-study': 10
  };

  return defaults[contentType] || 7;
}
```

---

## Facebook Image Size Recommendations

### Optimal Sizes for Different Placements

| Placement | Size | Aspect Ratio | Format Type |
|-----------|------|--------------|-------------|
| Feed - Single Image | 1200 x 1200 | 1:1 | `single` |
| Feed - Carousel | 1080 x 1080 | 1:1 | `carousel-*` |
| Feed - Portrait | 1080 x 1350 | 4:5 | `carousel-*` (current) |
| Story | 1080 x 1920 | 9:16 | `story` |
| Cover Photo | 820 x 312 | ~2.6:1 | `cover` |
| Link Preview | 1200 x 630 | 1.91:1 | `link-preview` |

**Recommendation:** Keep 1080x1350 (4:5) as default for carousels (hiện tại đang dùng)

---

## Migration Plan

### Backward Compatibility

1. **Default behavior unchanged:** Nếu không specify format → tạo 7 slides carousel như hiện tại
2. **Existing content:** Old JSON files vẫn work (fallback to 7 slides)
3. **Gradual rollout:** Implement format system nhưng keep default = "carousel-standard"

### Rollout Phases

**Week 1: Foundation**
- [ ] Create `content-formats.json` template
- [ ] Update brand.json schema
- [ ] Add format detection utility functions

**Week 2: AI Writer**
- [ ] Update writer.js to accept format parameters
- [ ] Implement auto-detection logic
- [ ] Test with all brands

**Week 3: Image Generator**
- [ ] Update generator.js for flexible dimensions
- [ ] Create templates for each format type
- [ ] Test rendering quality

**Week 4: Integration**
- [ ] Update daily-agent.js pipeline
- [ ] Update uploader for format metadata
- [ ] End-to-end testing

**Week 5: Documentation & Training**
- [ ] Update all brand guides
- [ ] Create format selection guide
- [ ] Train on when to use each format

---

## Testing Checklist

### Format Types to Test

- [ ] **Single** - Quote post (1200x1200)
- [ ] **Single** - Promotion announcement (1200x1200)
- [ ] **Carousel-mini** - 3 tips (1080x1350)
- [ ] **Carousel-mini** - 5 tools (1080x1350)
- [ ] **Carousel-standard** - 7-slide tutorial (current)
- [ ] **Carousel-long** - 10-slide guide
- [ ] **Auto-detect** - Various topics

### Brands to Test

- [ ] Long Best AI (Vietnamese, AI/Tech content)
- [ ] Thach Vu Land (Vietnamese, Real Estate)
- [ ] Queen Nail Bern (German, Beauty)

### Quality Checks

- [ ] Text readable at all sizes
- [ ] Brand colors preserved
- [ ] Typography scaling correct
- [ ] Images crisp (not pixelated)
- [ ] Upload to Drive successful
- [ ] Google Sheets metadata correct
- [ ] Facebook preview looks good

---

## Expected Benefits

1. **Efficiency** - Single posts take 30 seconds vs 2 minutes for carousel
2. **Flexibility** - Right format for right content type
3. **Quality** - Better designed single images vs stretched carousel content
4. **Engagement** - Format matches audience expectations
5. **Scalability** - Easy to add new formats in future

---

## Future Enhancements

### Phase 2 Features

1. **Video Templates** - Support video + image mix in carousel
2. **Interactive Elements** - Polls, quizzes in specific slides
3. **A/B Testing** - Generate multiple format variants
4. **Analytics-Driven** - Auto-select format based on past performance
5. **Template Library** - Pre-made templates for common scenarios

### Advanced Auto-Detection

```javascript
// ML-based format recommendation
async function recommendFormat(topic, brand, pastPerformance) {
  // Analyze past engagement data
  const topFormats = await analytics.getTopPerformingFormats(brand);

  // Detect content characteristics
  const wordCount = topic.split(' ').length;
  const hasNumber = /\d+/.test(topic);
  const sentiment = await analyzeSentiment(topic);

  // Smart recommendation
  if (wordCount < 5 && sentiment === 'inspirational') {
    return 'single'; // Quote-like
  }

  if (hasNumber && wordCount < 10) {
    return 'carousel-mini'; // Listicle
  }

  return 'carousel-standard'; // Default
}
```

---

## Questions for User

Before implementation, clarify:

1. **Priority formats?** Which formats to implement first?
   - Recommended: Start with `single` and `carousel-mini`

2. **Default behavior?** Should auto-detect be default or keep manual selection?
   - Recommended: Auto-detect with manual override

3. **Dimensions?** Keep 1080x1350 or switch to 1080x1080?
   - Current 4:5 ratio works well on Facebook, recommend keeping it

4. **Template design?** Need designer input for single post templates?
   - Can use simplified carousel design for MVP

---

## Implementation Estimate

**Total effort:** ~3-4 days

- Config & Schema: 0.5 day
- AI Writer updates: 1 day
- Image Generator updates: 1.5 days
- Testing & Documentation: 1 day

**Can be done in parallel tracks to save time.**

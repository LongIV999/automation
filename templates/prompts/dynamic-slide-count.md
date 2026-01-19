# Dynamic Slide Count Logic Template

**Purpose:** AI-powered decision making for optimal carousel slide count based on topic complexity and content type

---

## Slide Count Decision Framework

### Step 1: Analyze Topic Complexity

**System Prompt for Slide Count Determination:**

```markdown
You are a content strategist determining optimal carousel length.

Input Topic: "{topic}"
Content Type: {contentType}
Brand: {brand}

Your task: Analyze the topic and determine the ideal number of slides.

Analysis Framework:
1. Topic Scope: How broad or narrow is the topic?
2. Information Density: How much detail is needed?
3. Audience Familiarity: Is this basic or advanced content?
4. Format Constraints: Platform best practices

Decision Rules:
- Single Point (quote, announcement, simple tip): 1 slide
- Mini Carousel (quick tips, simple comparison): 3-5 slides
- Standard Carousel (tutorial, analysis, tips list): 7-10 slides
- Deep Dive (complex topic, legal guide, full tutorial): 10-15 slides

Output JSON:
{
  "recommendedSlideCount": number,
  "reasoning": "Brief explanation",
  "formatType": "single-post" | "carousel-mini" | "carousel-standard" | "carousel-deep",
  "contentStructure": "Suggested slide breakdown"
}
```

---

## Examples: Topic → Slide Count

### Topic Analysis Examples

**Example 1: Simple Quote**
```json
{
  "topic": "Focus on progress, not perfection",
  "analysis": {
    "recommendedSlideCount": 1,
    "reasoning": "Single inspirational message, no supporting points needed",
    "formatType": "single-post",
    "contentStructure": "1. Quote with visual background"
  }
}
```

**Example 2: Quick Tips**
```json
{
  "topic": "5 ChatGPT shortcuts",
  "analysis": {
    "recommendedSlideCount": 7,
    "reasoning": "5 tips + 1 intro + 1 CTA = 7 slides optimal",
    "formatType": "carousel-standard",
    "contentStructure": "1. Hook | 2-6. One tip each | 7. CTA"
  }
}
```

**Example 3: Tutorial**
```json
{
  "topic": "Cách dùng Midjourney từ A-Z",
  "analysis": {
    "recommendedSlideCount": 12,
    "reasoning": "Complex tutorial requiring context, setup, 8-10 steps, troubleshooting",
    "formatType": "carousel-deep",
    "contentStructure": "1. Title | 2. What is Midjourney | 3. Getting started | 4-10. Key features | 11. Common issues | 12. CTA"
  }
}
```

**Example 4: News Summary**
```json
{
  "topic": "GPT-5 vừa ra mắt",
  "analysis": {
    "recommendedSlideCount": 5,
    "reasoning": "Breaking news: Hook + What happened + Key features + Impact + CTA",
    "formatType": "carousel-mini",
    "contentStructure": "1. Hook | 2. What's new | 3. Top features | 4. Why it matters | 5. CTA"
  }
}
```

**Example 5: Legal Guide**
```json
{
  "topic": "Quy trình 10 bước sang tên sổ đỏ",
  "analysis": {
    "recommendedSlideCount": 12,
    "reasoning": "10 steps explicitly mentioned + intro + CTA",
    "formatType": "carousel-deep",
    "contentStructure": "1. Title/Hook | 2-11. One step per slide | 12. CTA with contact"
  }
}
```

**Example 6: Comparison**
```json
{
  "topic": "ChatGPT vs Claude: So sánh",
  "analysis": {
    "recommendedSlideCount": 8,
    "reasoning": "Comparison needs: Intro + 5 comparison points + Summary + CTA",
    "formatType": "carousel-standard",
    "contentStructure": "1. Title | 2. Overview | 3-7. Comparison slides (price, features, use cases, pros, cons) | 8. CTA"
  }
}
```

---

## Integration into writer.js

### Option 1: Two-Phase Approach (Recommended)

**Phase 1: Determine Slide Count**
```javascript
async function determineSlideCount(topic, contentType, brand) {
  const analysisPrompt = `Analyze topic and determine optimal slide count:

Topic: "${topic}"
Content Type: ${contentType}
Brand: ${brand}

Decision Rules:
- Number explicitly in topic (e.g., "5 tips") → Use that number + 2 (intro + CTA)
- Single concept/quote → 1 slide
- Quick tips/news → 3-5 slides
- Standard tutorial/analysis → 7-10 slides
- Complex guide/legal → 10-15 slides

Output JSON:
{
  "recommendedSlideCount": number,
  "reasoning": string,
  "formatType": "single-post" | "carousel-mini" | "carousel-standard" | "carousel-deep"
}`;

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 500,
    messages: [{ role: 'user', content: analysisPrompt }]
  });

  const analysis = JSON.parse(response.content[0].text.match(/\{[\s\S]*\}/)[0]);
  return analysis;
}
```

**Phase 2: Generate Content with Determined Count**
```javascript
// In writer.js main()
const slideAnalysis = await determineSlideCount(topic, contentType, brand);
console.log(`📊 AI determined: ${slideAnalysis.recommendedSlideCount} slides`);
console.log(`   Reasoning: ${slideAnalysis.reasoning}`);

// Use in content generation
const formatConfig = {
  ...formatConfig,
  slideCount: slideAnalysis.recommendedSlideCount,
  formatType: slideAnalysis.formatType
};
```

---

### Option 2: Pattern Matching (Simple)

```javascript
function estimateSlideCount(topic, contentType) {
  // Extract number from topic if explicitly mentioned
  const numberMatch = topic.match(/(\d+)\s*(cách|tips|bước|điều|lý do)/i);
  if (numberMatch) {
    const explicitCount = parseInt(numberMatch[1]);
    return explicitCount + 2; // Add intro + CTA
  }

  // Pattern-based estimation
  const patterns = {
    // Single concepts
    'quote|câu nói|mindset': 1,
    
    // Mini carousels
    'tin tức|news|vừa ra mắt|new feature': 5,
    
    // Standard carousels
    'tips|tricks|cách|hướng dẫn|tutorial': 8,
    'so sánh|compare|vs': 8,
    
    // Deep dives
    'quy trình|process|từ a-z|toàn tập|complete guide': 12,
    'luật|legal|pháp lý': 10
  };

  for (const [pattern, count] of Object.entries(patterns)) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(topic)) {
      return count;
    }
  }

  // Default based on content type
  const defaults = {
    'quote': 1,
    'news': 5,
    'tips': 8,
    'tutorial': 10,
    'legal': 10,
    'review': 7
  };

  return defaults[contentType] || 7;
}
```

---

## Updated Template Prompts

### Long Best AI Template (Dynamic)

**Old:**
```
Task: Create 7-slide carousel about "{topic}"
```

**New:**
```
Task: Create {slideCount}-slide carousel about "{topic}"

Note: The slide count has been intelligently determined based on:
- Topic complexity: {reasoning}
- Content type: {contentType}
- Optimal structure: {recommendedStructure}

Adapt your content to fill exactly {slideCount} slides effectively.
```

---

### Slide Structure Templates by Count

**1 Slide (Single Post):**
```
Structure: All-in-one
- Combine hook, key message, and soft CTA
- Rich visual, concise text
```

**3-5 Slides (Mini Carousel):**
```
Structure:
1. Hook
2-{count-1}. Core content (keep dense)
{count}. CTA

Keep each slide impactful, no filler.
```

**7-10 Slides (Standard):**
```
Structure:
1. Hook/Title
2-3. Context/Problem (optional, can combine)
4-{count-1}. Value delivery (main content)
{count}. CTA

This is optimal for most carousel content.
```

**10-15 Slides (Deep Dive):**
```
Structure:
1. Title
2. Overview/Context
3-{count-2}. Detailed content (one concept per slide)
{count-1}. Summary/Key Takeaways
{count}. CTA

Use for complex topics that need thorough explanation.
```

---

## Brand-Specific Preferences

### Long Best AI
- Prefer 7-8 slides for tips (Vietnamese users like comprehensive lists)
- Use 1 slide for inspirational quotes
- Use 10+ for tutorials (educational focus)

### Thach Vu Land
- Legal content: Match steps explicitly (e.g., "7 bước" → 9 slides with intro/CTA)
- Market analysis: 6-8 slides (data needs space)
- Reviews: 7 slides (overview, pros, cons, verdict, CTA)

### Queen Nail Bern
- German: Keep concise, 5-7 slides max (Swiss preference for brevity)
- Vietnamese recruitment: 7 slides (detailed job info needed)
- Design trends: 6-7 slides (visual showcase)

---

## Validation Rules

Before finalizing slide count:
- [ ] Minimum 1 slide
- [ ] Maximum 15 slides (platform best practice, engagement drops after)
- [ ] If number in topic (e.g., "5 tips"), verify slideCount ≥ number + 2
- [ ] CTA slide is always included (except single-post format)
- [ ] Content can meaningfully fill all slides (no filler)

---

## Error Handling

```javascript
// Validate slide count is reasonable
function validateSlideCount(count, topic) {
  if (count < 1 || count > 15) {
    console.warn(`⚠️ Unusual slide count: ${count}. Adjusting to safe range.`);
    return Math.max(1, Math.min(15, count));
  }

  // Check for mismatch with explicit numbers in topic
  const numberMatch = topic.match(/(\d+)/);
  if (numberMatch) {
    const topicNumber = parseInt(numberMatch[1]);
    if (count < topicNumber) {
      console.warn(`⚠️ Slide count ${count} < topic number ${topicNumber}. Adjusting.`);
      return topicNumber + 2;
    }
  }

  return count;
}
```

---

## Testing

```bash
# Test dynamic slide count
node writer.js "Focus on progress" --brand longbest
# Expected: 1 slide

node writer.js "5 AI productivity tips" --brand longbest
# Expected: 7 slides (5 + intro + CTA)

node writer.js "Hướng dẫn Midjourney từ A-Z" --brand longbest
# Expected: 10-12 slides (comprehensive tutorial)

node writer.js "Luật Đất đai 2024: 3 thay đổi quan trọng" --brand thachvuland
# Expected: 5 slides (3 + intro + CTA)

node writer.js "Quy trình 7 bước sang tên sổ đỏ" --brand thachvuland
# Expected: 9 slides (7 steps + intro + CTA)
```

---

## Related Files

- [writer.js](file:///Users/admin/automation/scripts/agent-writer/writer.js) - Integration point
- [format-utils.js](file:///Users/admin/automation/scripts/utils/format-utils.js) - Format resolver

---

**Created:** 2026-01-19  
**Version:** 1.0.0

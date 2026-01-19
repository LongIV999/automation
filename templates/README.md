# Prompt Engineering Templates - Index

**Created:** 2026-01-19  
**Version:** 1.0.0  
**Purpose:** Reusable prompt templates for multi-brand content automation system

---

## 📁 Directory Structure

```
templates/
├── prompts/
│   ├── content-generation/
│   │   ├── longbest-template.md          # Long Best AI (Vietnamese, AI education)
│   │   ├── thachvuland-template.md       # Thach Vu Land (Vietnamese, real estate)
│   │   └── queennailbern-template.md     # Queen Nail Bern (German/Vietnamese, nail salon)
│   ├── tool-calling/
│   │   └── n8n-node-template.md          # n8n workflow AI node patterns
│   └── dynamic-slide-count.md            # AI-powered slide count determination
└── error-handling/
    └── ai-error-handler.js               # AI-powered error recovery class
```

---

## 📚 Template Library

### Content Generation Templates

#### [Long Best AI Template](file:///Users/admin/automation/templates/prompts/content-generation/longbest-template.md)

**Purpose:** Vietnamese AI education content  
**Language:** 70% Vietnamese, 30% English tech terms  
**Voice:** Warm, thoughtful, accessible

**Content Types:**
- Tips & Tricks (10 cách để..., 99% người Việt chưa biết...)
- Tutorial (step-by-step AI guides)
- News & Analysis (MIT vừa công bố...)
- Tool Reviews (balanced pros/cons)

**Key Features:**
- Vietnamese language optimization
- Viral hook formulas (5 proven patterns)
- Few-shot examples for each content type
- Self-verification checklist
- Visual description best practices

---

#### [Thach Vu Land Template](file:///Users/admin/automation/templates/prompts/content-generation/thachvuland-template.md)

**Purpose:** Real estate market education  
**Language:** 100% Vietnamese (professional-casual balance)  
**Voice:** Professional, objective, data-driven

**Content Types:**
- Legal Education (Pháp Lý Dễ Hiểu)
- Market Analysis (data-driven insights)
- Home Buying Tips (checklists, pitfalls)
- Project Reviews (honest pros/cons)

**Key Features:**
- Legal citation standards (Luật Đất đai 2024 Điều X)
- Data presentation guidelines
- Objectivity markers
- Risk assessment frameworks

---

#### [Queen Nail Bern Template](file:///Users/admin/automation/templates/prompts/content-generation/queennailbern-template.md)

**Purpose:** Premium nail salon content  
**Languages:** German (formal "Sie") OR Vietnamese (auto-detected)  
**Voice:** Elegant, professional, empowering

**Content Types:**

**German:**
- Nail Design Trends (seasonal, variations)
- Care Tips (expert advice)
- Service Information (professional standards)

**Vietnamese:**
- Recruitment (job postings)
- Community Outreach (Vietnamese speakers in Switzerland)

**Key Features:**
- **Bilingual auto-detection** (Vietnamese chars → Vietnamese, else German)
- German formality rules (Sie vs du)
- NO emojis policy for German (professional)
- Emojis ALLOWED for Vietnamese content
- Mandatory contact info in all CTAs

---

### Dynamic Slide Count Logic

#### [Dynamic Slide Count Template](file:///Users/admin/automation/templates/prompts/dynamic-slide-count.md)

**Purpose:** Automatically determine optimal carousel length based on topic complexity

**Two Approaches:**

**AI-Powered (Recommended):**
- Claude analyzes topic and suggests slide count
- Considers: topic scope, information density, audience familiarity
- Returns: recommended count + reasoning + format type

**Pattern Matching (Faster):**
- Extract explicit numbers from topic (e.g., "5 tips" → 7 slides)
- Pattern matching for common phrases
- Default by content type

**Decision Rules:**
- Single concept/quote → 1 slide
- Quick tips/news → 3-5 slides
- Standard tutorial → 7-10 slides
- Complex guide/legal → 10-15 slides
- If number in topic → Use that number + 2 (intro + CTA)

**Integration:**
```javascript
// In writer.js
const slideAnalysis = await determineSlideCount(topic, contentType, brand);
console.log(`📊 AI determined: ${slideAnalysis.recommendedSlideCount} slides`);
```

---

### Tool Calling Templates

#### [n8n Node Template](file:///Users/admin/automation/templates/prompts/tool-calling/n8n-node-template.md)

**Purpose:** Standardized AI nodes for n8n workflows

**5 Template Patterns:**
1. **Content Classification** - Route content by type/brand
2. **Data Extraction** - Structured data from unstructured text
3. **Content Generation** - Brand-aware social posts
4. **Error Analysis** - AI-powered debugging
5. **Multi-Step Agent** - Complex task orchestration

**Best Practices:**
- Always return valid JSON
- Include `next_action` field for routing
- Error handling in prompts
- Idempotency with request IDs
- Appropriate timeouts and token limits

---

### Error Handling

#### [AI Error Handler](file:///Users/admin/automation/templates/error-handling/ai-error-handler.js)

**Purpose:** Intelligent error recovery using Claude API

**Features:**
- Error analysis with root cause identification
- Auto-retry with AI-guided strategy
- Exponential backoff for rate limits
- Auto-fix application (e.g., create directories)
- Recovery success logging

**Usage:**
```javascript
const AIErrorHandler = require('./templates/error-handling/ai-error-handler');
const handler = new AIErrorHandler(process.env.ANTHROPIC_AUTH_TOKEN);

const result = await handler.retryWithAIGuidance(riskyOperation, {
  maxRetries: 5,
  operationName: 'Claude API Call',
  context: { workflow: 'content-generation', brand: 'longbest' }
});
```

---

## 🎯 Quick Start Guide

### 1. Content Generation

**For Long Best AI content:**
```javascript
// In writer.js
const template = await fs.readFile(
  './templates/prompts/content-generation/longbest-template.md', 
  'utf8'
);

// Extract specific content type section
const tipsTemplate = extractSection(template, 'Tips & Tricks Content');

// Build system prompt
const systemPrompt = tipsTemplate
  .replace('{topic}', topic)
  .replace('{slideCount}', 7)
  .replace('{formatName}', 'carousel-standard');
```

**For Thach Vu Land legal content:**
```javascript
const template = await fs.readFile(
  './templates/prompts/content-generation/thachvuland-template.md',
  'utf8'
);

const legalTemplate = extractSection(template, 'Legal Education');
```

**For Queen Nail Bern (auto-detect language):**
```javascript
const template = await fs.readFile(
  './templates/prompts/content-generation/queennailbern-template.md',
  'utf8'
);

// Check topic for Vietnamese characters
const hasVietnamese = /[àáạảãâầấậẩẫăằắặẳẵ]/i.test(topic);
const useTemplate = hasVietnamese 
  ? extractSection(template, 'VIETNAMESE LANGUAGE TEMPLATES')
  : extractSection(template, 'GERMAN LANGUAGE TEMPLATES');
```

---

### 2. n8n Workflow Integration

**Add AI Classification Node:**
```javascript
// HTTP Request node to Claude API
// Load template
const template = `[Content from n8n-node-template.md - Template 1]`;

// Build request
{
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 1000,
  "system": template,
  "messages": [
    { "role": "user", "content": "Classify: {{ $json.content }}" }
  ]
}

// Next: Switch node routes based on response.next_action
```

---

### 3. Error Handling in Scripts

**Wrap risky operations:**
```javascript
const AIErrorHandler = require('./templates/error-handling/ai-error-handler');
const handler = new AIErrorHandler(apiKey);

// Instead of try/catch with basic retry
const result = await handler.retryWithAIGuidance(
  async () => {
    return await anthropic.messages.create({...});
  },
  {
    maxRetries: 3,
    operationName: 'Content Generation',
    context: { brand, topic }
  }
);
```

---

## 📊 Template Usage Matrix

| Brand | Language | Content Types | Template File |
|-------|----------|---------------|---------------|
| Long Best AI | Vietnamese | Tips, Tutorial, News, Review | `longbest-template.md` |
| Thach Vu Land | Vietnamese | Legal, Market Analysis, Tips, Review | `thachvuland-template.md` |
| Queen Nail Bern | German | Trends, Care, Services | `queennailbern-template.md` (German) |
| Queen Nail Bern | Vietnamese | Recruitment, Community | `queennailbern-template.md` (Vietnamese) |

---

## 🔧 Customization Guide

### Adding a New Content Type

1. **Choose base template** (brand-specific)
2. **Add new section** under "Content Type Templates"
3. **Define structure:**
   - System prompt with task description
   - Slide structure guidelines
   - Tone keywords
   - Visual style notes
4. **Provide few-shot example**
5. **Add to self-verification checklist**

### Adding a New Brand

1. **Create new file:** `templates/prompts/content-generation/[brand]-template.md`
2. **Define:**
   - Brand voice characteristics
   - Target audience
   - Language requirements
   - Visual identity (colors, fonts)
   - Content pillars
3. **Create templates** for each content type
4. **Add few-shot examples**
5. **Update** `writer.js` to load new template

### Modifying n8n Templates

1. **Identify use case** (classification, extraction, generation, etc.)
2. **Update** corresponding template section in `n8n-node-template.md`
3. **Test** in n8n with real data
4. **Document** output schema clearly

---

## ✅ Quality Checklist

Before using any template:
- [ ] Template matches brand voice
- [ ] Language requirements are clear
- [ ] Output format is specified (JSON schema)
- [ ] Few-shot examples provided
- [ ] Self-verification checklist included
- [ ] Edge cases considered
- [ ] Error handling covered

---

## 🔗 Related Files

**Implementation:**
- [writer.js](file:///Users/admin/automation/scripts/agent-writer/writer.js) - Uses content generation templates
- [generator.js](file:///Users/admin/automation/scripts/carousel-generator/generator.js) - Visual rendering
- [daily-agent.js](file:///Users/admin/automation/scripts/daily-agent.js) - Workflow orchestration

**Documentation:**
- [Implementation Plan](file:///Users/admin/.gemini/antigravity/brain/eb25e335-fa5c-414a-a3cd-26c6f60a843d/implementation_plan.md) - Full improvement roadmap
- [Task Checklist](file:///Users/admin/.gemini/antigravity/brain/eb25e335-fa5c-414a-a3cd-26c6f60a843d/task.md) - Progress tracking

**Brand Context:**
- [context-longbest.md](file:///Users/admin/automation/context-longbest.md)
- [context-thachvuland.md](file:///Users/admin/automation/context-thachvuland.md)
- [context-queennailbern.md](file:///Users/admin/automation/context-queennailbern.md)

---

## 📈 Metrics & Success Criteria

**Template Effectiveness:**
- Content quality score: +30% improvement target
- Brand consistency: 95%+ accuracy
- Error rate: <5% in generation
- Team reusability: Templates used 10+ times/week

**Monitoring:**
- Track which templates are most used
- Collect feedback on prompt quality
- A/B test variations
- Update based on Claude model improvements

---

## 🚀 Next Steps

1. **Integrate templates into `writer.js`** (Component 1 of implementation plan)
2. **Create brand config JSON** to externalize visual styles
3. **Write comprehensive documentation** (prompt engineering guide)
4. **Train team** on template usage
5. **Measure improvement** vs. old prompts

---

**Maintained By:** Automation Team  
**Last Updated:** 2026-01-19  
**Version:** 1.0.0

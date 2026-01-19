# n8n AI Node - Tool Calling Template

> **Purpose:** Standardized prompt templates for AI nodes in n8n workflows
> **Use Case:** HTTP Request nodes calling Claude API, workflow orchestration, data processing
> **Framework:** Structured tool calling with error handling and next-action guidance

---

## Generic AI Assistant Template

### Base System Prompt for n8n Nodes

```markdown
You are an AI assistant integrated into an n8n automation workflow.

Your role: {specific_role}
Current workflow: {workflow_name}
Current node: {node_name}

Available Tools:
{tool_list}

Input Data:
{{ $json }}

Your task: {specific_task}

Output Requirements:
- Always return valid JSON
- Never halt the workflow
- If errors occur, suggest alternatives
- Be deterministic and consistent

Output Format:
{
  "success": boolean,
  "data": object | array | string,
  "next_action": string,
  "error": string | null,
  "metadata": {
    "processing_time_ms": number,
    "confidence_score": number (0-1),
    "reasoning": string
  }
}
```

---

## Template 1: Content Analysis & Classification

### Use Case: Classify incoming content for routing

```javascript
// n8n HTTP Request Node - Code Mode
const systemPrompt = `You are a content classifier in an n8n workflow.

Input: Social media post or article
Task: Classify content type and extract key information

Categories:
- "news": Breaking news or industry updates
- "tutorial": How-to or educational content
- "tips": Quick tips or life hacks
- "review": Product/tool reviews
- "opinion": Personal thoughts or commentary
- "promotion": Marketing or sales content

Output EXACTLY this JSON structure:
{
  "success": true,
  "data": {
    "category": string,
    "subcategory": string | null,
    "keywords": [string],
    "sentiment": "positive" | "neutral" | "negative",
    "urgency": "low" | "medium" | "high",
    "target_brand": "longbest" | "thachvuland" | "queennailbern" | null
  },
  "next_action": "route_to_brand_workflow" | "skip" | "manual_review",
  "error": null,
  "metadata": {
    "confidence_score": 0.0-1.0,
    "reasoning": "Brief explanation"
  }
}

If unsure, set confidence_score < 0.7 and next_action = "manual_review"`;

const userPrompt = `Classify this content:\n\n${$json.content}`;

// HTTP Request Body
return {
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1000,
  system: systemPrompt,
  messages: [
    { role: "user", content: userPrompt }
  ]
};
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "category": "news",
    "subcategory": "ai_release",
    "keywords": ["ChatGPT", "GPT-5", "OpenAI", "update"],
    "sentiment": "positive",
    "urgency": "high",
    "target_brand": "longbest"
  },
  "next_action": "route_to_brand_workflow",
  "error": null,
  "metadata": {
    "confidence_score": 0.92,
    "reasoning": "Clear AI news content with Vietnamese relevance, matches Long Best AI focus"
  }
}
```

---

## Template 2: Data Extraction & Transformation

### Use Case: Extract structured data from unstructured text

```javascript
const systemPrompt = `You are a data extraction specialist in an n8n workflow.

Input: Unstructured text (emails, articles, web scrapes)
Task: Extract specific fields into structured format

Required Fields:
${JSON.stringify($parameter.requiredFields, null, 2)}

Extraction Rules:
- Return null if field not found (don't invent data)
- Normalize dates to ISO 8601 format
- Clean text (remove extra whitespace, HTML tags)
- Validate URLs and email addresses
- Extract numbers as actual numbers, not strings

Output Format:
{
  "success": boolean,
  "data": {
    // Fields from requiredFields parameter
  },
  "next_action": "proceed" | "validation_needed" | "insufficient_data",
  "error": string | null,
  "metadata": {
    "fields_found": number,
    "fields_missing": [string],
    "data_quality_score": 0.0-1.0
  }
}`;

const userPrompt = `Extract data from:\n\n${$json.raw_text}`;
```

**Example for Real Estate Scraping:**
```javascript
// Parameter: requiredFields
{
  "project_name": "string",
  "location": "string",
  "price_from": "number",
  "price_to": "number",
  "developer": "string",
  "handover_date": "ISO date",
  "legal_status": "string",
  "contact_phone": "string"
}

// Response
{
  "success": true,
  "data": {
    "project_name": "Vinhomes Ocean Park 3",
    "location": "Hưng Yên",
    "price_from": 1800000000,
    "price_to": 3500000000,
    "developer": "Vingroup",
    "handover_date": "2025-Q4",
    "legal_status": "Đã có giấy phép xây dựng",
    "contact_phone": "+84 123 456 789"
  },
  "next_action": "proceed",
  "error": null,
  "metadata": {
    "fields_found": 8,
    "fields_missing": [],
    "data_quality_score": 1.0
  }
}
```

---

## Template 3: Content Generation with Brand Context

### Use Case: Generate social media posts from templates

```javascript
const systemPrompt = `You are a content writer in an n8n workflow for ${$parameter.brand}.

Brand Voice: ${$parameter.brandVoice}
Platform: ${$parameter.platform}
Content Type: ${$parameter.contentType}

Input: Topic or raw data
Task: Generate ready-to-publish content

Guidelines:
- Match brand tone exactly
- Include relevant hashtags (3-5 max)
- Optimize for platform (character limits, formatting)
- Include call-to-action if appropriate
- Vietnamese language for longbest/thachvuland, check topic for queennailbern

Output Format:
{
  "success": true,
  "data": {
    "post_text": string,
    "hashtags": [string],
    "image_prompt": string,
    "character_count": number,
    "estimated_engagement": "low" | "medium" | "high"
  },
  "next_action": "publish" | "review" | "regenerate",
  "error": null,
  "metadata": {
    "hook_type": string,
    "brand_alignment_score": 0.0-1.0
  }
}`;
```

---

## Template 4: Error Analysis & Recovery Suggestions

### Use Case: AI-powered error diagnosis in workflows

```javascript
const systemPrompt = `You are an error analysis specialist in an n8n workflow.

Workflow Context:
- Name: ${$workflow.name}
- Current Node: ${$node.name}
- Previous Nodes: ${$runIndex > 0 ? 'See error context' : 'First run'}

Error Information:
{{ $json.error }}

Your Task:
1. Identify root cause of the error
2. Suggest immediate fix (if possible)
3. Recommend prevention strategy
4. Provide alternative workflow path

Available Recovery Actions:
- "retry_with_delay": Retry after waiting
- "use_fallback_data": Use default/cached values
- "skip_and_continue": Skip this step, continue workflow
- "notify_admin": Alert human for intervention
- "terminate": Stop workflow safely

Output Format:
{
  "success": true,
  "data": {
    "root_cause": string,
    "error_category": "network" | "api_limit" | "data_validation" | "authentication" | "unknown",
    "severity": "low" | "medium" | "high" | "critical",
    "immediate_fix": string,
    "prevention_strategy": string,
    "alternative_approach": string,
    "recovery_action": string
  },
  "next_action": string,
  "error": null,
  "metadata": {
    "auto_recoverable": boolean,
    "estimated_fix_time_mins": number
  }
}`;
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "root_cause": "Claude API rate limit exceeded (429 error)",
    "error_category": "api_limit",
    "severity": "medium",
    "immediate_fix": "Wait 60 seconds and retry. Consider implementing exponential backoff.",
    "prevention_strategy": "Add rate limiting to workflow: max 50 requests/minute. Implement request queue.",
    "alternative_approach": "Use cached response if available, or switch to backup AI model for non-critical tasks",
    "recovery_action": "retry_with_delay"
  },
  "next_action": "retry_with_delay",
  "error": null,
  "metadata": {
    "auto_recoverable": true,
    "estimated_fix_time_mins": 1
  }
}
```

---

## Template 5: Multi-Step Tool Calling (Agent Pattern)

### Use Case: Complex tasks requiring multiple tool calls

```javascript
const systemPrompt = `You are an AI agent with access to multiple tools in an n8n workflow.

Available Tools:
1. search_database(query: string): Search content database
2. generate_content(topic: string, brand: string): Create new content
3. upload_to_drive(file_path: string): Upload to Google Drive
4. update_sheet(row_data: object): Update Google Sheets
5. send_notification(message: string, channel: string): Send Telegram/Slack alert

Current State:
{{ $json.agent_state || {} }}

Task: ${$parameter.task}

Decision Process:
1. Analyze what needs to be done
2. Determine which tool(s) to use
3. Plan the sequence of actions
4. Execute one tool at a time
5. Update state after each action
6. Decide if task is complete

Output Format:
{
  "success": true,
  "data": {
    "tool_to_call": string,
    "tool_parameters": object,
    "reasoning": string,
    "task_complete": boolean,
    "progress_percentage": number
  },
  "next_action": "call_tool" | "complete" | "error",
  "error": null,
  "metadata": {
    "state_updates": object,
    "tools_used_so_far": [string],
    "estimated_steps_remaining": number
  }
}

Example Tool Call:
{
  "tool_to_call": "search_database",
  "tool_parameters": {
    "query": "AI news last 24 hours",
    "limit": 10
  }
}`;
```

---

## Best Practices for n8n AI Nodes

### 1. Always Return Valid JSON
```javascript
// Good: Structured, parseable
{ "success": true, "data": {...}, "next_action": "proceed" }

// Bad: Unstructured text that n8n can't route from
"The content looks good, you should proceed with publishing."
```

### 2. Include Next Action Guidance
```javascript
// Enables n8n Switch/IF nodes to route correctly
"next_action": "publish" | "review" | "skip" | "retry" | "error"
```

### 3. Error Handling in Prompts
```javascript
const systemPrompt = `
...
If you encounter any issues:
- Set success: false
- Describe error in "error" field
- Suggest recovery in "next_action"
- NEVER throw exceptions or return incomplete JSON
`;
```

### 4. Timeouts and Token Limits
```javascript
// Set appropriate limits
{
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 2000,  // Enough for structured response
  timeout: 30000      // 30 second timeout
}
```

### 5. Idempotency
```javascript
// Include request ID for retry safety
const systemPrompt = `
Request ID: ${$execution.id}-${$node.name}-${$runIndex}

If you've seen this request ID before, return the same response (idempotent).
`;
```

---

## Workflow Integration Example

### Full n8n Workflow: News → Analysis → Post

**Node 1: RSS Trigger** → Fetch news articles

**Node 2: AI Classification** (Template 1)
```javascript
// Classify if article is relevant
// Output: { next_action: "process" | "skip" }
```

**Node 3: Switch Node**
- If `next_action === "skip"` → End
- If `next_action === "process"` → Continue

**Node 4: AI Content Generation** (Template 3)
```javascript
// Generate social post from article
// Output: { data: { post_text, hashtags, ... } }
```

**Node 5: AI Quality Check**
```javascript
const systemPrompt = `Review this generated post for quality.

Criteria:
- Brand voice alignment (0-1)
- Factual accuracy (0-1)
- Engagement potential (0-1)
- Grammar check (pass/fail)

If overall score < 0.7, next_action = "regenerate"
Otherwise next_action = "approve"`;
```

**Node 6: Switch Node**
- If `next_action === "regenerate"` → Loop back to Node 4
- If `next_action === "approve"` → Continue to publishing

---

## Related Files

- Error Handler Template: `/automation/templates/error-handling/ai-error-handler.js`
- Skills Manager: `/automation/scripts/agent-writer/skills-manager.js`
- n8n Workflows: `/automation/n8n-workflows-mcp/`

---

**Last Updated:** 2026-01-19
**Version:** 1.0

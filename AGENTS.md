# Automation Project - Agent Guidelines

## Project Overview

Multi-brand content automation system for Facebook fanpages. Supports multiple brands (Long Best AI, Thach Vu Land) with automated content generation, image creation, and posting workflows.

## Directory Structure

```
automation/
├── brands/               # Multi-brand configurations
│   ├── longbest-ai/     # Brand 1
│   ├── thachvuland/     # Brand 2
│   └── _templates/      # Brand templates
│
├── scripts/
│   ├── agent-writer/    # AI content writer (Claude API)
│   ├── carousel-generator/  # Image generation (Puppeteer)
│   ├── drive-uploader/  # Google Drive & Sheets sync
│   ├── content-generator/   # Content planning
│   ├── analytics/       # Analytics & tracking
│   └── utils/           # Shared utilities
│
├── docs/                # Documentation
├── skill/               # Plugin skills (issue-resolution, planning, etc.)
└── output/              # Generated content output
```

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Package Manager**: npm
- **Image Generation**: Puppeteer + Canvas
- **APIs**: Claude API, Google Drive API, Google Sheets API
- **Automation**: n8n workflows
- **Database**: SQLite (analytics.db)

## Preferred Tools for Agents

### Code Exploration
- **Find definitions**: `mcp__gkg__search_codebase_definitions`
- **Get references**: `mcp__gkg__get_references`
- **Repo overview**: `mcp__gkg__repo_map`

### File Operations
- **Read**: Use `Read` tool
- **Edit**: Use `Edit` tool or `mcp__morph_mcp__edit_file` for complex changes
- **Search**: Use `Grep` with glob patterns

### Testing
```bash
# No automated tests yet - manual testing workflow
node scripts/daily-agent.js "Test Topic" --brand longbest
```

### Build & Deploy
```bash
# No build step required - direct Node.js execution

# Run daily workflow
node scripts/daily-agent.js "Topic" --brand [longbest|thachvuland]

# Process all content
node scripts/process-all.js

# Analytics
node scripts/analytics/dashboard.js
```

## Common Workflows

### 1. Create New Content Post
```bash
cd scripts
node daily-agent.js "AI Tips for Beginners" --brand longbest
```

### 2. Batch Process Content
```bash
cd scripts
node process-all.js
```

### 3. Generate Content Ideas
```bash
cd scripts/content-generator
node planner.js --brand longbest --days 7
```

### 4. View Analytics
```bash
cd scripts/analytics
node dashboard.js
```

## Key Files

- `scripts/daily-agent.js` - Main orchestrator for content pipeline
- `scripts/process-all.js` - Batch processing all pending content
- `brands/*/brand.json` - Brand configuration (colors, typography, social accounts)
- `scripts/utils/logger.js` - Centralized logging
- `scripts/utils/db.js` - Analytics database

## Error Handling

- Errors are logged to `logs/` directory with timestamps
- Telegram notifications configured for critical failures
- Failed content files remain in content/ folder for retry

## Brand Management

Each brand has:
- `brand.json` - Configuration (colors, fonts, social accounts)
- `content/` - Content JSON files
- `output/` - Generated carousel images
- Google Sheets integration for scheduling

## Dependencies to Watch

- `@anthropic-ai/sdk` - Claude API client
- `puppeteer` - Browser automation
- `googleapis` - Google APIs
- `sharp` - Image processing
- `better-sqlite3` - Analytics database

## Development Notes

- All paths should use absolute paths from project root
- Brand detection: JSON `brand` field → lowercase check for "thach vu"
- Image dimensions: 1080x1080 for Instagram/Facebook carousels
- Content format: Slide-based JSON with title, content, cta, tip
- File naming: `{brand}-{topic-slug}.json`

## Plugin Integration Points

### For issue-resolution skill
- Check `scripts/utils/logger.js` for error tracking
- Review `logs/` directory for recent failures
- Database: `data/analytics.db` for workflow failures

### For planning skill
- New features should integrate with `scripts/daily-agent.js` workflow
- Follow multi-brand architecture in `brands/`
- Update `docs/` when adding major features

### For orchestrator skill
- Can parallelize content generation for multiple brands
- File scope: Use brand directories to avoid conflicts
  - Track 1: `brands/longbest-ai/**`
  - Track 2: `brands/thachvuland/**`

### For knowledge skill
- Document changes in `docs/`
- Update this AGENTS.md when architecture changes
- Maintain brand-specific docs in `brands/*/README.md`

## Coding Conventions

- JavaScript (Node.js, CommonJS modules)
- Async/await for asynchronous operations
- Template literals for strings
- Destructuring for cleaner code
- Arrow functions preferred
- Error handling: try/catch with logger

## Contact & Support

This is an automated content system for Vietnamese AI education and real estate brands.
For questions about the codebase, check `docs/` directory.

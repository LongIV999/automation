---
description: Automate content creation and publishing for Thach Vu Land (Real Estate Analysis).
---

1. Run the daily agent orchestrator with your topic and brand flag:
   ```bash
   node scripts/daily-agent.js "Your Topic Name Here" --brand thachvuland
   ```
   *   This will:
       *   Generate content using Claude (based on `context-thachvuland.md`)
       *   Create carousel images using `generator-tvland.js` (Navy/Sage branding)
       *   Upload to Drive and update the Google Sheet

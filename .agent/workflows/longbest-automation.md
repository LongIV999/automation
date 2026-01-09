---
description: Automate content creation and publishing for Long Best AI (Carousel + Post).
---

1. Run the daily agent orchestrator with your topic:
   ```bash
   node scripts/daily-agent.js "Your Topic Name Here"
   ```
   *   This will:
       *   Generate content using Claude (based on `context-longbest.md`)
       *   Create carousel images using `generator.js`
       *   Upload to Drive and update the Google Sheet

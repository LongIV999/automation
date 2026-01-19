# Error Handling & Logging Setup Guide

## ✅ What's Been Implemented

Quick Win #1 is now complete! Your automation system now has:

1. **Centralized Logging** ([`logger.js`](file:///Users/admin/automation/scripts/utils/logger.js))
   - All logs saved to `/Users/admin/automation/logs/`
   - Automatic file rotation (5MB max, 5 files kept)
   - Separate error log for easy debugging
   - Console output in development mode

2. **Telegram Notifications** ([`notifier.js`](file:///Users/admin/automation/scripts/utils/notifier.js))
   - Real-time alerts when workflows fail
   - Success notifications with execution time
   - Includes run ID for tracking

3. **Retry Mechanism** ([`retry.js`](file:///Users/admin/automation/scripts/utils/retry.js))
   - Exponential backoff for transient failures
   - Configurable retry attempts
   - Ready to use in upload/API calls

4. **Enhanced Daily Agent** ([`daily-agent.js`](file:///Users/admin/automation/scripts/daily-agent.js))
   - Logging at every step
   - Unique run ID for each execution
   - Execution time tracking
   - Automatic error notifications

---

## 🔧 Setup Instructions

### Step 1: Create Telegram Bot (Optional but Recommended)

1. Open Telegram and message [@BotFather](https://t.me/BotFather)
2. Send `/newbot` and follow instructions
3. Save the bot token (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
4. Message [@userinfobot](https://t.me/userinfobot) to get your chat ID
5. Add to your environment:

```bash
# Add to /Users/admin/automation/scripts/.env or export in shell
export TELEGRAM_BOT_TOKEN="your_bot_token_here"
export TELEGRAM_CHAT_ID="your_chat_id_here"
```

**Test notification:**
```bash
cd /Users/admin/automation/scripts
node -e "require('./utils/notifier').sendTelegramNotification('Test notification', {test: 'success'})"
```

### Step 2: Test the Logging System

Run a workflow to generate logs:

```bash
cd /Users/admin/automation
node scripts/daily-agent.js "test logging system"
```

Check the logs:

```bash
# View combined log
tail -f logs/combined.log

# View errors only
tail -f logs/error.log

# Search for specific run
grep "run_1767970" logs/combined.log
```

---

## 📊 Log Format

Logs are in JSON format for easy parsing:

```json
{
  "level": "info",
  "message": "Workflow completed successfully",
  "runId": "run_1767970526254",
  "duration": "45230ms",
  "durationSec": "45.23s",
  "topic": "các mẹo ẩn khi sử dụng claude code",
  "brand": "longbest",
  "baseName": "longbest-c-c-m-o-n-khi-s-d-ng-claude-code",
  "service": "automation",
  "timestamp": "2026-01-09T15:11:10.123Z"
}
```

---

## 🔍 Debugging Workflows

### Find all runs for a specific topic:
```bash
grep "các mẹo ẩn" logs/combined.log | jq
```

### Find failed workflows:
```bash
grep "Workflow failed" logs/error.log | jq
```

### Get execution time stats:
```bash
grep "Workflow completed" logs/combined.log | jq -r '.durationSec'
```

---

## 🚀 Next Steps

**Quick Win #2** is ready to implement: Content Review Dashboard

This will give you a web UI to review AI-generated content before it goes live.

**Want to proceed?** The implementation is already planned in [`phase1_quickwins.md`](file:///Users/admin/.gemini/antigravity/brain/c7973f4e-1466-4775-a0aa-6af555f4b8d5/phase1_quickwins.md).

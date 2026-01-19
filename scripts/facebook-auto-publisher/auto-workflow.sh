#!/bin/bash

# Auto Workflow Script
# Tạo content → Sync to queue → Auto publish

set -e  # Exit on error

TOPIC="$1"
BRAND="${2:-longbest}"

if [ -z "$TOPIC" ]; then
    echo "Usage: ./auto-workflow.sh \"Topic Name\" [brand]"
    echo "Example: ./auto-workflow.sh \"5 AI Tools\" longbest"
    exit 1
fi

echo "🚀 Starting Auto Workflow"
echo "Topic: $TOPIC"
echo "Brand: $BRAND"
echo ""

# 1. Generate content
echo "📝 Step 1: Generating content..."
cd /Users/admin/automation/scripts
node daily-agent.js "$TOPIC" --brand "$BRAND"

if [ $? -ne 0 ]; then
    echo "❌ Content generation failed"
    exit 1
fi

echo "✓ Content generated"
echo ""

# 2. Sync to Facebook queue
echo "📥 Step 2: Syncing to Facebook queue..."
cd facebook-auto-publisher
node sheets-integration.js

if [ $? -ne 0 ]; then
    echo "❌ Sync to queue failed"
    exit 1
fi

echo "✓ Synced to queue"
echo ""

# 3. Process queue (optional - scheduler sẽ tự động làm)
read -p "Do you want to publish now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📤 Step 3: Publishing to Facebook..."
    node publisher.js process
    echo "✓ Published"
else
    echo "⏰ Scheduler will publish automatically"
fi

echo ""
echo "✨ Workflow complete!"
echo ""

# Show stats
node publisher.js stats

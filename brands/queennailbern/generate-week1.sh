#!/bin/bash

# Queen Nail Bern - Quick Start Script
# Generate content for Week 1

echo "🚀 QUEEN NAIL BERN - WEEK 1 CONTENT GENERATION"
echo "=============================================="
echo ""

cd /Users/admin/automation

# Week 1 Topics
declare -a topics=(
    "5 Trendige Nageldesigns für Winter 2026"
    "7 Tipps für gesunde Nägel im Winter"
    "French Manicure: Zeitlos und Elegant"
    "Neukunden-Special: 20% Rabatt auf erste Behandlung"
    "Kundin des Monats: Lisa's Nail Transformation"
)

declare -a days=(
    "Monday (10:00)"
    "Tuesday (15:00)"
    "Wednesday (10:00)"
    "Thursday (18:00)"
    "Friday (12:00)"
)

echo "📅 This will generate content for Week 1:"
echo ""

for i in "${!topics[@]}"; do
    echo "  $((i+1)). ${days[$i]}: ${topics[$i]}"
done

echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "Starting content generation..."
echo ""

# Generate each post
for i in "${!topics[@]}"; do
    post_num=$((i+1))
    topic="${topics[$i]}"
    day="${days[$i]}"

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📝 Post $post_num/5: $day"
    echo "Topic: $topic"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    # Run daily agent
    node scripts/daily-agent.js "$topic" --brand queennailbern

    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Post $post_num completed!"
        echo ""
    else
        echo ""
        echo "❌ Post $post_num failed!"
        echo ""
        read -p "Continue with next post? (y/n) " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi

    # Small delay between posts
    if [ $post_num -lt 5 ]; then
        echo "Waiting 5 seconds before next post..."
        sleep 5
        echo ""
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 WEEK 1 CONTENT GENERATION COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Generated 5 posts for Queen Nail Bern"
echo ""
echo "Next steps:"
echo "  1. Open Google Sheet"
echo "  2. Review generated content in Content_Calendar tab"
echo "  3. Set Status = 'scheduled' for posts you want to publish"
echo "  4. Set correct dates (Monday-Friday this week)"
echo "  5. n8n will auto-post at scheduled times"
echo ""
echo "View results:"
echo "  • Google Drive: Check for QUEENNAIL_* folders"
echo "  • Google Sheets: Content_Calendar tab"
echo "  • Local files: scripts/carousel-generator/output/"
echo ""
echo "Test command for single post:"
echo "  node scripts/daily-agent.js \"Your Topic\" --brand queennailbern"
echo ""

#!/bin/bash

###############################################################################
# Create Single Post Image for Facebook
#
# Usage: ./create-single-post.sh "Headline" "Body Text" "CTA" "Topic"
###############################################################################

HEADLINE="$1"
BODY="$2"
CTA="${3:-Xem Ngay}"
TOPIC="${4:-AI}"

if [ -z "$HEADLINE" ]; then
    echo "Usage: ./create-single-post.sh \"Headline\" \"Body Text\" [CTA] [Topic]"
    echo ""
    echo "Example:"
    echo "  ./create-single-post.sh \"5 AI Tools 2026\" \"Công cụ AI miễn phí\" \"Xem Ngay\" \"AI Tools\""
    exit 1
fi

# Generate unique filename
TIMESTAMP=$(date +%s)
INPUT_JSON="/tmp/single-post-${TIMESTAMP}.json"
OUTPUT_IMG="/Users/admin/automation/scripts/content-generator/output/single-post-${TIMESTAMP}.png"

# Create JSON input
cat > "$INPUT_JSON" << EOF
{
  "headline": "$HEADLINE",
  "bodyText": "$BODY",
  "ctaText": "$CTA",
  "topic": "$TOPIC"
}
EOF

# Generate image
cd /Users/admin/automation/scripts/content-generator
node formats/single-post.js "$INPUT_JSON" "$OUTPUT_IMG"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Single post created: $OUTPUT_IMG"
    echo ""

    # Ask if want to add to queue
    read -p "Add to Facebook queue? (y/n) " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd /Users/admin/automation/scripts/facebook-auto-publisher

        CAPTION="$HEADLINE

$BODY

#$TOPIC #LongBestAI #AI"

        node publisher.js add "$CAPTION" "$OUTPUT_IMG"

        echo ""
        node publisher.js stats
    fi

    # Cleanup
    rm "$INPUT_JSON"
else
    echo "❌ Error creating single post"
    exit 1
fi

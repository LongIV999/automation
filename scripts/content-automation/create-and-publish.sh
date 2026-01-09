#!/bin/bash

################################################################################
# LONG BEST AI - Complete Carousel Creation & Publishing Script
#
# Workflow:
# 1. Set typography preset
# 2. Generate carousel images
# 3. Upload to Google Drive
# 4. Auto-update Google Sheets
# 5. (Optional) Auto-delete local images
# 6. n8n auto-publishes to Facebook
#
# Usage: ./create-and-publish.sh <content-file.json> [preset] [--delete]
#
# Examples:
#   ./create-and-publish.sh content/my-post.json
#   ./create-and-publish.sh content/my-post.json readablePreview
#   ./create-and-publish.sh content/my-post.json extraLarge --delete
#   ./create-and-publish.sh content/my-post.json default --delete
################################################################################

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AUTOMATION_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
CAROUSEL_DIR="$AUTOMATION_ROOT/scripts/carousel-generator"
UPLOADER_DIR="$AUTOMATION_ROOT/scripts/drive-uploader"

# Check arguments
if [ -z "$1" ]; then
  echo -e "${RED}❌ Error: Content file required${NC}"
  echo ""
  echo "Usage: $0 <content-file.json> [preset] [--delete]"
  echo ""
  echo "Examples:"
  echo "  $0 content/my-post.json"
  echo "  $0 content/my-post.json readablePreview"
  echo "  $0 content/my-post.json extraLarge --delete"
  echo ""
  echo "Available presets:"
  echo "  - default         (1.0x - chữ nhỏ)"
  echo "  - readablePreview (1.4x - RECOMMENDED cho Facebook)"
  echo "  - extraLarge      (1.6x - chữ rất to)"
  echo ""
  echo "Options:"
  echo "  --delete, -d    Delete local images after upload (saves disk space)"
  echo "  --keep, -k      Keep local images (default)"
  exit 1
fi

CONTENT_FILE="$1"
PRESET="${2:-readablePreview}"  # Default: readablePreview
DELETE_FLAG=""

# Parse delete flag
for arg in "$@"; do
  if [ "$arg" = "--delete" ] || [ "$arg" = "-d" ]; then
    DELETE_FLAG="--delete"
  elif [ "$arg" = "--keep" ] || [ "$arg" = "-k" ]; then
    DELETE_FLAG="--keep"
  fi
done

# Resolve content file path
if [[ "$CONTENT_FILE" != /* ]]; then
  # Relative path
  CONTENT_FILE="$CAROUSEL_DIR/$CONTENT_FILE"
fi

# Check if content file exists
if [ ! -f "$CONTENT_FILE" ]; then
  echo -e "${RED}❌ Content file not found: $CONTENT_FILE${NC}"
  exit 1
fi

BASE_NAME=$(basename "$CONTENT_FILE" .json)

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║        LONG BEST AI - Carousel Auto-Publisher             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${BLUE}📋 Content:${NC} $BASE_NAME"
echo -e "${BLUE}📐 Preset:${NC} $PRESET"
echo ""

# Step 1: Set typography preset
echo -e "${YELLOW}[1/3]${NC} Setting typography preset..."
cd "$CAROUSEL_DIR"
node set-preset.js set "$PRESET"
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Failed to set preset${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Preset set${NC}"
echo ""

# Step 2: Generate carousel
echo -e "${YELLOW}[2/3]${NC} Generating carousel images..."
node generator.js "$CONTENT_FILE"
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Failed to generate carousel${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Carousel generated${NC}"
echo ""

# Step 3: Upload to Drive + Auto-update Sheets
echo -e "${YELLOW}[3/3]${NC} Uploading to Google Drive & updating Sheets..."
cd "$UPLOADER_DIR"
node upload.js "$CAROUSEL_DIR/output/$BASE_NAME" $DELETE_FLAG
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Failed to upload${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Upload completed${NC}"
echo ""

# Success summary
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    ✅ ALL DONE!                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✓ Images generated${NC}"
echo -e "${GREEN}✓ Uploaded to Google Drive${NC}"
echo -e "${GREEN}✓ Google Sheets updated${NC}"
echo ""
echo -e "${BLUE}📊 View Sheet:${NC}"
echo "   https://docs.google.com/spreadsheets/d/1RAHjxLDULl0aRWHSX0aqUh1dqv7li7zwi0DZA6atQj0"
echo ""
echo -e "${BLUE}⏰ Next:${NC}"
echo "   - n8n will auto-publish to Facebook in ~15 minutes"
echo "   - Or manually change Status to 'Ready' in Sheets to publish immediately"
echo ""

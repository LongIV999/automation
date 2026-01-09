#!/bin/bash

###############################################################################
# Long Best AI - Content Automation Script
#
# Tự động hóa hoàn toàn quy trình tạo post:
# Content JSON → Generate Images → Upload Drive → Update Sheets
#
# Usage: ./create-post.sh <content-file.json> [folder-name]
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directories
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
CAROUSEL_GEN="$SCRIPT_DIR/../carousel-generator"
DRIVE_UPLOADER="$SCRIPT_DIR/../drive-uploader"

# Functions
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

log_step() {
    echo ""
    echo -e "${YELLOW}━━━ $1 ━━━${NC}"
}

# Validate arguments
if [ $# -eq 0 ]; then
    echo "Usage: $0 <content-file.json> [folder-name]"
    echo ""
    echo "Examples:"
    echo "  $0 content/post_001.json"
    echo "  $0 content/post_001.json \"2026-01-10_AI_Prompts\""
    exit 1
fi

CONTENT_FILE=$1
FOLDER_NAME=${2:-""}

# Validate content file exists
if [ ! -f "$CONTENT_FILE" ]; then
    log_error "Content file not found: $CONTENT_FILE"
    exit 1
fi

# Generate output directory name
BASENAME=$(basename "$CONTENT_FILE" .json)
OUTPUT_DIR="$CAROUSEL_GEN/output/$BASENAME"

# Auto-generate folder name if not provided
if [ -z "$FOLDER_NAME" ]; then
    DATE=$(date +%Y-%m-%d)
    FOLDER_NAME="${DATE}_${BASENAME}"
    log_info "Auto-generated folder name: $FOLDER_NAME"
fi

###############################################################################
# STEP 1: Generate Carousel Images
###############################################################################

log_step "STEP 1: Generating Carousel Images"

log_info "Content file: $CONTENT_FILE"
log_info "Output directory: $OUTPUT_DIR"

cd "$CAROUSEL_GEN"
node generator.js "$CONTENT_FILE" "$OUTPUT_DIR"

if [ $? -eq 0 ]; then
    log_success "Images generated successfully"
else
    log_error "Failed to generate images"
    exit 1
fi

# Count generated images
IMAGE_COUNT=$(ls "$OUTPUT_DIR"/*.png 2>/dev/null | wc -l)
log_info "Generated $IMAGE_COUNT images"

###############################################################################
# STEP 2: Upload to Google Drive
###############################################################################

log_step "STEP 2: Uploading to Google Drive"

cd "$DRIVE_UPLOADER"

# Check if authenticated
if [ ! -f "token.json" ]; then
    log_error "Google Drive not authenticated!"
    log_info "Please run: cd $DRIVE_UPLOADER && npm run auth"
    exit 1
fi

log_info "Uploading to folder: $FOLDER_NAME"

# Upload and capture output
UPLOAD_OUTPUT=$(JSON_OUTPUT=1 node upload.js "$OUTPUT_DIR" "$FOLDER_NAME" 2>&1)

if [ $? -eq 0 ]; then
    log_success "Upload completed successfully"

    # Parse JSON output to get Folder ID
    FOLDER_ID=$(echo "$UPLOAD_OUTPUT" | grep -o '"folderId": "[^"]*"' | cut -d'"' -f4)
    FOLDER_LINK=$(echo "$UPLOAD_OUTPUT" | grep -o '"folderLink": "[^"]*"' | cut -d'"' -f4)

    if [ -n "$FOLDER_ID" ]; then
        log_success "Folder ID: $FOLDER_ID"
        log_success "Folder Link: $FOLDER_LINK"
    fi
else
    log_error "Upload failed"
    echo "$UPLOAD_OUTPUT"
    exit 1
fi

###############################################################################
# STEP 3: Display Summary
###############################################################################

log_step "SUMMARY"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Post Created Successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📁 Folder Name: $FOLDER_NAME"
echo "🆔 Folder ID:   $FOLDER_ID"
echo "🔗 Folder Link: $FOLDER_LINK"
echo "📸 Images:      $IMAGE_COUNT files"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1. Copy Folder ID: $FOLDER_ID"
echo ""
echo "2. Open Google Sheets (Posts tab)"
echo ""
echo "3. Paste vào cột 'Drive_Folder_ID'"
echo ""
echo "4. Set Status = 'Ready'"
echo ""
echo "5. n8n workflow sẽ tự động đăng lên Facebook!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Optionally copy Folder ID to clipboard (macOS)
if command -v pbcopy &> /dev/null; then
    echo "$FOLDER_ID" | pbcopy
    log_success "Folder ID copied to clipboard!"
fi

log_success "All done! 🎉"

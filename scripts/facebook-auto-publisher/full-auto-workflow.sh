#!/bin/bash

###############################################################################
# AUTO WORKFLOW - Content to Facebook Post
#
# Script tự động hoàn toàn từ content → đăng bài Facebook
#
# Usage:
#   ./full-auto-workflow.sh "Topic Name" [brand]
#
# Example:
#   ./full-auto-workflow.sh "10 AI Tools 2026" longbest
###############################################################################

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Config
TOPIC="$1"
BRAND="${2:-longbest}"
SCRIPTS_DIR="/Users/admin/automation/scripts"
FB_PUBLISHER_DIR="$SCRIPTS_DIR/facebook-auto-publisher"

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

show_banner() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║         AUTO WORKFLOW - Content to Facebook Post          ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Topic: $TOPIC"
    echo "Brand: $BRAND"
    echo ""
}

# Validate input
if [ -z "$TOPIC" ]; then
    log_error "Missing topic argument"
    echo ""
    echo "Usage: ./full-auto-workflow.sh \"Topic Name\" [brand]"
    echo "Example: ./full-auto-workflow.sh \"10 AI Tools 2026\" longbest"
    echo ""
    exit 1
fi

show_banner

# =============================================================================
# STEP 1: Generate Content với Agent Writer
# =============================================================================
log_info "STEP 1/4: Generating content..."
cd "$SCRIPTS_DIR"

if ! node daily-agent.js "$TOPIC" --brand "$BRAND"; then
    log_error "Content generation failed"
    exit 1
fi

log_success "Content generated"
echo ""

# =============================================================================
# STEP 2: Sync to Google Sheets & Facebook Queue
# =============================================================================
log_info "STEP 2/4: Syncing to Google Sheets & Facebook queue..."
cd "$FB_PUBLISHER_DIR"

if ! node sheets-integration.js; then
    log_warning "Sheets sync có lỗi, nhưng tiếp tục..."
fi

log_success "Synced to queue"
echo ""

# =============================================================================
# STEP 3: Check Queue Status
# =============================================================================
log_info "STEP 3/4: Checking queue status..."
cd "$FB_PUBLISHER_DIR"

# Get stats
STATS=$(node publisher.js stats 2>/dev/null)
echo "$STATS"
echo ""

# Parse pending count
PENDING=$(echo "$STATS" | grep -o '"pending": [0-9]*' | grep -o '[0-9]*' || echo "0")

if [ "$PENDING" -eq 0 ]; then
    log_warning "No pending posts in queue"
else
    log_success "Found $PENDING pending posts in queue"
fi

echo ""

# =============================================================================
# STEP 4: Process Queue (Optional)
# =============================================================================
log_info "STEP 4/4: Publishing to Facebook..."

# Check if scheduler is running
if pm2 status fb-scheduler 2>/dev/null | grep -q "online"; then
    log_success "Scheduler is running - posts will be auto-published"
    log_info "You can check progress with: tail -f $FB_PUBLISHER_DIR/publisher.log"
else
    log_warning "Scheduler is not running"
    echo ""
    read -p "Do you want to publish now? (y/n) " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Publishing posts..."
        node publisher.js process
        log_success "Publishing started"
    else
        log_info "Posts will remain in queue"
        log_info "To publish later: cd $FB_PUBLISHER_DIR && node publisher.js process"
    fi
fi

echo ""

# =============================================================================
# Summary
# =============================================================================
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    WORKFLOW COMPLETE!                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
log_success "Content created for: $TOPIC"
log_success "Brand: $BRAND"
log_success "Posts in queue: $PENDING pending"
echo ""

# Show quick commands
echo "📋 Quick Commands:"
echo "  • View queue:      cd $FB_PUBLISHER_DIR && node publisher.js stats"
echo "  • Process now:     cd $FB_PUBLISHER_DIR && node publisher.js process"
echo "  • View logs:       tail -f $FB_PUBLISHER_DIR/publisher.log"
echo "  • Start scheduler: pm2 start $FB_PUBLISHER_DIR/scheduler.js --name fb-scheduler"
echo ""

log_info "Done! 🎉"

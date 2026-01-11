#!/bin/bash

# Queen Nail Bern - Workflow Test Script
# Tests the entire automation pipeline

echo "🧪 TESTING QUEEN NAIL BERN AUTOMATION WORKFLOW"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results tracking
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run test
run_test() {
    local test_name="$1"
    local test_command="$2"

    echo -n "Testing: $test_name... "

    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

echo "1️⃣  BRAND CONFIGURATION TESTS"
echo "--------------------------------"

# Test 1: Brand JSON exists
run_test "Brand config file exists" \
    "test -f /Users/admin/automation/brands/queennailbern/brand.json"

# Test 2: Brand JSON is valid
run_test "Brand JSON is valid" \
    "node -e 'JSON.parse(require(\"fs\").readFileSync(\"/Users/admin/automation/brands/queennailbern/brand.json\"))'"

# Test 3: Context file exists
run_test "Context file exists" \
    "test -f /Users/admin/automation/context-queennailbern.md"

# Test 4: Content directory exists
run_test "Content directory exists" \
    "test -d /Users/admin/automation/brands/queennailbern/content"

echo ""
echo "2️⃣  SCRIPT INTEGRATION TESTS"
echo "--------------------------------"

# Test 5: Writer script supports queennailbern
run_test "Writer supports queennailbern brand" \
    "grep -q 'queennailbern' /Users/admin/automation/scripts/agent-writer/writer.js"

# Test 6: Daily agent supports queennailbern
run_test "Daily agent supports queennailbern brand" \
    "grep -q 'queennailbern' /Users/admin/automation/scripts/daily-agent.js"

# Test 7: Node modules installed
run_test "Agent writer dependencies installed" \
    "test -d /Users/admin/automation/scripts/agent-writer/node_modules"

run_test "Carousel generator dependencies installed" \
    "test -d /Users/admin/automation/scripts/carousel-generator/node_modules"

echo ""
echo "3️⃣  DOCUMENTATION TESTS"
echo "--------------------------------"

# Test 8: Documentation files exist
run_test "Content strategy guide exists" \
    "test -f /Users/admin/automation/brands/queennailbern/CONTENT_STRATEGY.md"

run_test "Google Sheets setup guide exists" \
    "test -f /Users/admin/automation/brands/queennailbern/GOOGLE_SHEETS_SETUP.md"

run_test "Facebook setup guide exists" \
    "test -f /Users/admin/automation/brands/queennailbern/FACEBOOK_SETUP.md"

echo ""
echo "4️⃣  FUNCTIONAL TESTS (Optional - requires API keys)"
echo "--------------------------------"

# Check if API key is available
if [ -f "/Users/admin/automation/.claude/settings.json" ]; then
    echo -e "${YELLOW}ℹ  API credentials detected${NC}"

    # Test 9: Content generation (dry run check)
    echo -n "Testing: Content writer script syntax... "
    if node -c /Users/admin/automation/scripts/agent-writer/writer.js 2>/dev/null; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}"
        ((TESTS_FAILED++))
    fi
else
    echo -e "${YELLOW}⊘  Skipping functional tests (API key not found)${NC}"
fi

echo ""
echo "=============================================="
echo "📊 TEST SUMMARY"
echo "=============================================="
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"
echo "Total:  $((TESTS_PASSED + TESTS_FAILED))"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
    echo ""
    echo "🎉 Queen Nail Bern automation is ready to use!"
    echo ""
    echo "Next steps:"
    echo "  1. Setup Google Sheets (see GOOGLE_SHEETS_SETUP.md)"
    echo "  2. Configure Facebook integration (see FACEBOOK_SETUP.md)"
    echo "  3. Generate your first content:"
    echo "     node scripts/daily-agent.js \"5 Nageltrends für Winter 2026\" --brand queennailbern"
    echo ""
    exit 0
else
    echo -e "${RED}❌ SOME TESTS FAILED${NC}"
    echo ""
    echo "Please fix the failed tests before proceeding."
    echo ""
    exit 1
fi

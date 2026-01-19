#!/bin/bash

# Test Design Styles - Generate samples for all brands

echo "🎨 Testing Design Styles Standardization"
echo "========================================"
echo ""

# Create output directory
OUTPUT_BASE="../../output/design-style-tests"
mkdir -p "$OUTPUT_BASE"

# Test 1: Queen Nail Bern - Quote Style
echo "1️⃣ Testing Queen Nail Bern - Quote Style"
echo "   Input: queennailbern-5-m-o-t-l-ch-nail-nhanh-h-n-singlepost-enhanced.json"
echo "   Style: quote"
node generator.js \
  content/queennailbern-5-m-o-t-l-ch-nail-nhanh-h-n-singlepost-enhanced.json \
  "$OUTPUT_BASE/queennail-quote-test"
echo "   ✅ Generated to: $OUTPUT_BASE/queennail-quote-test"
echo ""

# Test 2: Long Best AI - Notebook Style
echo "2️⃣ Testing Long Best AI - Notebook Style"
echo "   Input: longbest-xay-dung-workflow-automation-trong-7-ngay.json"
echo "   Style: notebook"
node generator.js \
  content/longbest-xay-dung-workflow-automation-trong-7-ngay.json \
  "$OUTPUT_BASE/longbest-notebook-test"
echo "   ✅ Generated to: $OUTPUT_BASE/longbest-notebook-test"
echo ""

# Test 3: Thach Vu Land - Infographic Style
echo "3️⃣ Testing Thach Vu Land - Infographic Style"
echo "   Input: thachvuland-notebook-lm-test.json (migrated to infographic)"
echo "   Style: infographic"
node generator.js \
  content/thachvuland-notebook-lm-test.json \
  "$OUTPUT_BASE/thachvuland-infographic-test"
echo "   ✅ Generated to: $OUTPUT_BASE/thachvuland-infographic-test"
echo ""

# Summary
echo "========================================"
echo "✨ Test Complete!"
echo ""
echo "Generated samples:"
echo "  1. Queen Nail Bern (quote): $OUTPUT_BASE/queennail-quote-test/"
echo "  2. Long Best AI (notebook): $OUTPUT_BASE/longbest-notebook-test/"
echo "  3. Thach Vu Land (infographic): $OUTPUT_BASE/thachvuland-infographic-test/"
echo ""
echo "Open output folder:"
echo "  open $OUTPUT_BASE"

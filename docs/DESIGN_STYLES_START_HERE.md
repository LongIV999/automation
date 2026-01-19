# 🎨 Design Styles - Getting Started

**Quick access to all design style documentation and tools.**

---

## 📖 START HERE

### New to design styles?
→ **Read:** [Quick Reference Guide](DESIGN_STYLES_QUICK_REF.md)

### Need detailed info?
→ **Read:** [Full Design Styles Reference](DESIGN_STYLES_REFERENCE.md)

### Want to know what happened?
→ **Read:** [Migration Report](DESIGN_STYLE_MIGRATION_REPORT.md)

---

## 🏢 BRAND-SPECIFIC GUIDES

Choose your brand to see specific guidelines:

### 🪷 Queen Nail Bern (Nail Salon)
→ **Guide:** `/brands/queennailbern/DESIGN_GUIDE.md`
- Primary: `quote` (promotions, testimonials)
- Secondary: `infographic` (tips, trends)

### 🤖 Long Best AI (AI Education)
→ **Guide:** `/brands/longbest-ai/DESIGN_GUIDE.md`
- Primary: `notebook` (educational content)
- Secondary: `tutorial` (step-by-step guides)
- Tertiary: `infographic` (data, stats)

### 🏢 Thach Vu Land (Real Estate)
→ **Guide:** `/brands/thachvuland/DESIGN_GUIDE.md`
- Primary: `infographic` (property listings)
- Secondary: `notebook` (investment guides)

---

## 🛠️ TOOLS

### Validate Content
```bash
# Single file
node scripts/carousel-generator/validate-design-styles.js content/file.json

# All files
node scripts/carousel-generator/validate-design-styles.js --all
```

### Migrate Old Styles
```bash
# Preview (dry-run)
node scripts/carousel-generator/migrate-design-styles.js --all --dry-run

# Apply migration
node scripts/carousel-generator/migrate-design-styles.js --all
```

### Test Generation
```bash
cd scripts/carousel-generator
./test-design-styles.sh
```

---

## ⚡ QUICK REFERENCE

### 5 Official Design Styles

| Style | Use For | Example |
|-------|---------|---------|
| `notebook` | Education, concepts | AI tutorials, frameworks |
| `tutorial` | Step-by-step | Setup guides, how-tos |
| `infographic` | Data, stats | Listings, rankings, comparisons |
| `quote` | Quotes, promos | Testimonials, announcements |
| `comparison` | A vs B | Tool reviews, before/after |

### Deprecated Styles (DO NOT USE)

| ❌ Old | ✅ New |
|-------|--------|
| `notebook-lm` | `notebook` |
| `classic` | `quote` |
| `modern-minimal` | `notebook` |
| `head-silhouette` | `infographic` |

---

## 📝 CREATING NEW CONTENT

### Step 1: Read Brand Guide
```bash
# Example: Queen Nail Bern
cat brands/queennailbern/DESIGN_GUIDE.md
```

### Step 2: Create JSON File
Use official `designStyle` values only:
```json
{
  "brand": "Queen Nail Bern",
  "designStyle": "quote",
  "formatType": "single-post",
  "dimensions": {
    "width": 1200,
    "height": 1200,
    "aspectRatio": "1:1"
  },
  "slides": [...]
}
```

### Step 3: Validate
```bash
node validate-design-styles.js content/your-file.json
```

### Step 4: Generate
```bash
node generator.js content/your-file.json output/folder
```

---

## 📊 PROJECT STATUS

**Migration:** ✅ Complete (36/48 files migrated)
**Validation:** ✅ All 48 files pass
**Documentation:** ✅ Complete
**Tools:** ✅ Ready to use
**Test Results:** ✅ Verified working

---

## 📚 ALL DOCUMENTATION

### Main Guides
- [Quick Reference](DESIGN_STYLES_QUICK_REF.md) - Fast lookup
- [Full Reference](DESIGN_STYLES_REFERENCE.md) - Complete guide
- [Migration Report](DESIGN_STYLE_MIGRATION_REPORT.md) - What changed
- [Test Results](TEST_RESULTS_DESIGN_STYLES.md) - Verification

### Brand Guides
- [Queen Nail Bern Guide](/brands/queennailbern/DESIGN_GUIDE.md)
- [Long Best AI Guide](/brands/longbest-ai/DESIGN_GUIDE.md)
- [Thach Vu Land Guide](/brands/thachvuland/DESIGN_GUIDE.md)

### Tools & Scripts
- `validate-design-styles.js` - Validation tool
- `migrate-design-styles.js` - Migration tool
- `test-design-styles.sh` - Test suite

---

## ❓ FAQ

**Q: Which design style should I use?**
→ Check your brand's design guide. Each brand has recommended primary/secondary styles.

**Q: Can I still use `notebook-lm`?**
→ No, use `notebook` instead. It's the official standardized name.

**Q: What's the difference between `designStyle` and `formatType`?**
→ `designStyle` = visual style (notebook, quote, etc.)
   `formatType` = format (single-post, carousel-standard, etc.)

**Q: How do I validate my content?**
→ Run: `node validate-design-styles.js content/your-file.json`

**Q: Where are example files?**
→ Check `scripts/carousel-generator/content/` for examples with each style.

---

## 🆘 NEED HELP?

1. Check [Quick Reference](DESIGN_STYLES_QUICK_REF.md) first
2. Read your [Brand Design Guide](/brands/)
3. Look at example files in `/scripts/carousel-generator/content/`
4. Run validation to see specific errors/suggestions

---

**Last Updated:** 2026-01-17
**Version:** 2.0 (Standardized)
**Status:** ✅ Production Ready

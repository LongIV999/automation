# 🎨 Design Styles - Quick Reference

**Last Updated:** 2026-01-17 | **Version:** 2.0

---

## 5 Official Design Styles

| # | Style | Best For | Format |
|---|-------|----------|--------|
| 1️⃣ | **notebook** | Educational, concepts, frameworks | 7 slides (4:5) |
| 2️⃣ | **tutorial** | Step-by-step, how-to guides | 7 slides (4:5) |
| 3️⃣ | **infographic** | Data, stats, rankings, listings | 5 slides or 1 post |
| 4️⃣ | **quote** | Quotes, promotions, announcements | 1 post (1:1) |
| 5️⃣ | **comparison** | A vs B, tool reviews | 5-7 slides (4:5) |

---

## Brand Guidelines (Quick)

### 🪷 Queen Nail Bern
- **Primary:** `quote` (promotions, testimonials)
- **Secondary:** `infographic` (tips, trends)
- **Format:** Mostly `single-post` (1200x1200)

### 🤖 Long Best AI
- **Primary:** `notebook` (education)
- **Secondary:** `tutorial` (how-to)
- **Tertiary:** `infographic` (data)
- **Format:** `carousel-standard` (1080x1350)

### 🏢 Thach Vu Land
- **Primary:** `infographic` (listings)
- **Secondary:** `notebook` (guides)
- **Format:** `single-post` (1080x1350)

---

## Content JSON Template

```json
{
  "title": "Your Content Title",
  "topic": "Brief description",
  "brand": "Queen Nail Bern",
  "formatType": "single-post",
  "contentType": "promotion",
  "designStyle": "quote",
  "slideCount": 1,
  "dimensions": {
    "width": 1200,
    "height": 1200,
    "aspectRatio": "1:1"
  },
  "slides": [ ... ]
}
```

---

## Format Types

| Format | Slides | Dimensions | Ratio | Use Case |
|--------|--------|------------|-------|----------|
| `single-post` | 1 | 1200x1200 | 1:1 | Quick posts |
| `carousel-compact` | 3-5 | 1080x1350 | 4:5 | Short tips |
| `carousel-standard` | 7 | 1080x1350 | 4:5 | Full content |
| `carousel-long` | 8-15 | 1080x1350 | 4:5 | Deep dives |
| `story` | 1 | 1080x1920 | 9:16 | Stories |

---

## Validation & Migration

### Validate Content
```bash
# Single file
node scripts/carousel-generator/validate-design-styles.js content/file.json

# All files
node scripts/carousel-generator/validate-design-styles.js --all
```

### Migrate Old Styles
```bash
# Preview changes (dry-run)
node scripts/carousel-generator/migrate-design-styles.js --all --dry-run

# Apply migration
node scripts/carousel-generator/migrate-design-styles.js --all
```

---

## Deprecated Styles (DO NOT USE)

| ❌ Old | ✅ New | Notes |
|-------|--------|-------|
| `notebook-lm` | `notebook` | Use official name |
| `classic` | `quote` | For minimal posts |
| `modern-minimal` | `notebook` | Use notebook |
| `head-silhouette` | `infographic` | Use infographic |
| `single-post` | — | This is formatType, not designStyle! |
| `carousel-standard` | — | This is formatType, not designStyle! |

---

## Common Mistakes

### ❌ Wrong
```json
{
  "designStyle": "single-post",
  "formatType": "notebook"
}
```

### ✅ Correct
```json
{
  "designStyle": "notebook",
  "formatType": "single-post"
}
```

---

## Full Documentation

- **Main Guide:** `/docs/DESIGN_STYLES_REFERENCE.md`
- **Queen Nail:** `/brands/queennailbern/DESIGN_GUIDE.md`
- **Long Best AI:** `/brands/longbest-ai/DESIGN_GUIDE.md`
- **Thach Vu Land:** `/brands/thachvuland/DESIGN_GUIDE.md`
- **Migration Report:** `/docs/DESIGN_STYLE_MIGRATION_REPORT.md`

---

**Need help?** Check brand-specific design guides for detailed examples!

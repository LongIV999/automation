# Google Sheets Setup for Queen Nail Bern

## 📝 Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: **"Queen Nail Bern - Content Calendar"**

---

## 📋 Step 2: Create Required Tabs

Create 4 tabs with these exact names:

### Tab 1: Content_Calendar
Main content planning and scheduling tab

**Columns:**
| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Date | Day | Topic | Content_Type | Status | Folder_ID | Folder_Link | Image_Count | Posted_At |

**Example Data:**
```
2026-01-13 | Monday    | 5 Trendige Nageldesigns Winter | Nail Designs | scheduled | abc123 | https://drive... | 7 |
2026-01-14 | Tuesday   | 7 Tipps für gesunde Nägel      | Tips & Care  | draft     |        |                  |   |
2026-01-15 | Wednesday | French Manicure Guide          | Nail Designs | pending   |        |                  |   |
```

### Tab 2: Posts
Archive of all published posts

**Columns:**
| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| Post_ID | Date | Topic | Content_Type | Folder_Link | FB_Post_ID | Reach | Engagement | Likes | Comments |

### Tab 3: Archive
Old/completed content for reference

**Columns:**
| A | B | C | D | E | F |
|---|---|---|---|---|---|
| Archived_Date | Original_Date | Topic | Content_Type | Folder_Link | Archive_Reason |

### Tab 4: Analytics
Performance metrics and insights

**Columns:**
| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Week | Content_Type | Posts_Count | Total_Reach | Avg_Engagement | Top_Post | Notes | Action_Items |

---

## 🔧 Step 3: Apply Formatting

### Content_Calendar Tab:
1. **Header Row (Row 1):**
   - Background: #E8B4C8 (pink)
   - Text: Bold, White
   - Freeze row 1

2. **Status Column (E):**
   - Add Data Validation dropdown:
     - `draft`
     - `pending`
     - `scheduled`
     - `published`
     - `archived`

3. **Content_Type Column (D):**
   - Add Data Validation dropdown:
     - `Nail Designs & Trends`
     - `Tips & Care`
     - `Promotions & Pricing`
     - `Customer Reviews`
     - `Behind the Scenes`

4. **Conditional Formatting:**
   - Status = "published" → Green background
   - Status = "scheduled" → Yellow background
   - Status = "draft" → Orange background
   - Status = "pending" → Blue background

### Posts Tab:
- Freeze header row
- Same pink header style
- Auto-sort by Date (newest first)

---

## 🔗 Step 4: Get Sheet ID

1. Open your Google Sheet
2. Look at the URL:
   ```
   https://docs.google.com/spreadsheets/d/1ABC-XYZ123.../edit
                                            ^^^^^^^^^^^^^^^
                                            This is your Sheet ID
   ```
3. Copy the Sheet ID
4. Update `/Users/admin/automation/brands/queennailbern/brand.json`:
   ```json
   "googleSheets": {
     "sheetId": "YOUR_SHEET_ID_HERE",
     ...
   }
   ```

---

## 🔐 Step 5: Share Sheet with Service Account

1. In your Google Sheet, click **Share**
2. Add this email: `automation-service@your-project.iam.gserviceaccount.com`
   (Check `/Users/admin/automation/credentials/google-service-account.json` for exact email)
3. Grant **Editor** access
4. Uncheck "Notify people"
5. Click **Share**

---

## ✅ Step 6: Verify Setup

Run this test command:
```bash
cd /Users/admin/automation/scripts/drive-uploader
node test-sheets.js --brand queennailbern
```

Expected output:
```
✓ Successfully connected to Google Sheets
✓ Found tabs: Content_Calendar, Posts, Archive, Analytics
✓ Sheet is ready!
```

---

## 📊 Weekly Content Planning Template

Copy this into your Content_Calendar tab:

| Date | Day | Topic | Content_Type | Status |
|------|-----|-------|--------------|--------|
| 2026-01-13 | Monday | 5 Trendige Nageldesigns für Winter 2026 | Nail Designs & Trends | draft |
| 2026-01-14 | Tuesday | 7 Tipps für gesunde Nägel im Winter | Tips & Care | draft |
| 2026-01-15 | Wednesday | French Manicure: Zeitlos & Elegant | Nail Designs & Trends | draft |
| 2026-01-16 | Thursday | Neukunden-Special: 20% Rabatt | Promotions & Pricing | draft |
| 2026-01-17 | Friday | Kundin des Monats: Lisa's Story | Customer Reviews | draft |

---

## 🔄 How the Automation Works

1. **You create content:**
   ```bash
   node scripts/daily-agent.js "5 Trendige Nageldesigns" --brand queennailbern
   ```

2. **Script automatically:**
   - Generates carousel images
   - Uploads to Google Drive
   - Updates Content_Calendar tab with:
     - Folder_ID
     - Folder_Link
     - Image_Count
     - Status = "scheduled"

3. **n8n workflow picks up:**
   - Checks Content_Calendar every hour
   - Finds rows with Status = "scheduled" and Date = Today
   - Posts to Facebook automatically
   - Updates Status = "published"
   - Moves data to Posts tab

---

## 🎯 Next Steps

After creating the Sheet:
1. ✅ Copy the Sheet ID to brand.json
2. ✅ Share with service account
3. ✅ Run test script
4. ✅ Add Week 1 content plan
5. ⏳ Setup Facebook integration
6. ⏳ Configure n8n workflow

---

## 📞 Troubleshooting

**Error: "Permission denied"**
- Make sure you shared the Sheet with the service account email
- Grant "Editor" access, not just "Viewer"

**Error: "Tab not found"**
- Check tab names are exact: `Content_Calendar` (with underscore, capital C)
- No extra spaces in tab names

**Error: "Cannot find credentials"**
- Check `/Users/admin/automation/credentials/google-service-account.json` exists
- Make sure GOOGLE_APPLICATION_CREDENTIALS env variable is set

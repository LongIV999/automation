# ✅ THACHVULAND OPTIMIZATION CHECKLIST

## Pre-Flight Checks

### 1. Google Sheet Structure ✅
- [x] Sheet ID: `1SNv1t0h-KRXWQ4xANroW5RQN6zHU57OrrXj_OqzfVsY`
- [x] Tab name: `Post` (gid: 1123323036)
- [x] 17 column headers properly named
- [x] Header row formatted (bold + dark background)
- [x] Header row frozen
- [x] Sample row added for testing

**Verify**: Run `node check-thachvuland-sheet.js`

### 2. Required Columns for n8n ✅
- [x] Column E: `Caption` (for Facebook message)
- [x] Column F: `Drive_Folder_ID` (to list images)
- [x] Column H: `Status` (workflow filter: "Ready")
- [x] Column O: `Post_URL` (updated after post)

### 3. Scripts Updated ✅
- [x] `sheets-updater.js` - Support TVLand fields
- [x] `sync-drive-to-sheet.js` - Auto-classify TVLand folders
- [x] `setup-thachvuland-sheet.js` - Setup script created
- [x] `check-thachvuland-sheet.js` - Check script created
- [x] `test-thachvuland-integration.js` - Test script created

### 4. Brand Config ✅
- [x] File: `brands/thachvuland/brand.json`
- [x] `googleSheets.sheetId` updated
- [x] `googleSheets.tabName` changed from "Posts" → "Post"

### 5. Documentation ✅
- [x] `/docs/THACHVULAND_SHEET_OPTIMIZATION.md` - Full docs
- [x] `/docs/THACHVULAND_OPTIMIZATION_SUMMARY.md` - Summary
- [x] Quick commands: `tvland-commands.sh`

### 6. Integration Tests ✅
All tests passed:
```
✅ Column headers: OK
✅ Sample row: OK
✅ n8n query simulation: OK
✅ Add post function: OK
✅ Data integrity: OK
```

---

## Production Readiness Checklist

### Pre-Production

- [ ] Review n8n workflow `/Users/admin/Downloads/autopost-tvland.json`
- [ ] Import workflow vào n8n instance
- [ ] Update credentials trong n8n:
  - [ ] Google Drive OAuth2 (id: `1YqDYTAoUT0ShbXU`)
  - [ ] Google Sheets OAuth2 (id: `UEq1E8RtTrIXqO4R`)
  - [ ] Facebook Graph API (id: `Y0vjKIVaNhlmIgRy`, name: "TVL")
- [ ] Verify Facebook Page ID: `915248175005876`
- [ ] Test với sample row (Status="Ready")

### Testing Workflow

1. **Prepare Test Data**
   ```bash
   # Open sheet and update sample row
   open "https://docs.google.com/spreadsheets/d/1SNv1t0h-KRXWQ4xANroW5RQN6zHU57OrrXj_OqzfVsY"
   ```
   - [ ] Replace `SAMPLE_FOLDER_ID` with real Drive folder containing images
   - [ ] Verify `Caption` has good content
   - [ ] Ensure `Status` = "Ready"

2. **Trigger Workflow**
   - [ ] Manual trigger in n8n
   - [ ] Or wait for schedule (30 minutes)

3. **Verify Results**
   - [ ] Check n8n execution log (no errors)
   - [ ] `Status` changed to "Done"
   - [ ] `Post_URL` filled with Facebook URL
   - [ ] Post visible on Facebook Page
   - [ ] Images in correct order

### Production Launch

- [ ] Enable schedule trigger (every 30 minutes)
- [ ] Set up monitoring/alerts
- [ ] Document any issues in troubleshooting section

---

## Common Issues & Solutions

### Issue 1: "Unable to parse range: Posts!A1:Z1"
**Cause**: Tab name mismatch
**Solution**: Ensure tab name is "Post" (not "Posts")
**Status**: ✅ Fixed in `sheets-updater.js`

### Issue 2: Workflow không tìm thấy row
**Cause**: Status không exact match "Ready"
**Solution**: Remove any spaces, ensure exact: `"Ready"`
**Prevention**: Data validation rule on Status column

### Issue 3: Drive_Folder_ID invalid
**Cause**: Not a valid folder ID or no permission
**Solution**:
- Copy from URL: `drive.google.com/drive/folders/[ID_HERE]`
- Ensure n8n service account has access

### Issue 4: Caption không hiển thị trên FB
**Cause**: Special characters or encoding
**Solution**: Use UTF-8, test emojis separately

---

## Monitoring

### Key Metrics to Track

1. **Sheet Activity**
   - Rows added per day
   - Status distribution (Draft/Ready/Done)
   - Average time: Ready → Done

2. **n8n Workflow**
   - Execution success rate
   - Average execution time
   - Error frequency

3. **Facebook Posts**
   - Posts published per week
   - Engagement metrics (from `ReachEngagement` column)

### Logs to Check

```bash
# n8n logs
docker logs n8n -f --tail 100

# Local script logs
tail -f /Users/admin/automation/logs/*.log
```

---

## Maintenance Schedule

### Daily
- [ ] Quick visual check of sheet (any errors?)
- [ ] Verify latest posts on Facebook

### Weekly
- [ ] Review n8n execution history
- [ ] Archive old posts (Status="Done" + >30 days)
- [ ] Update content calendar

### Monthly
- [ ] Performance review
- [ ] Update documentation if workflow changes
- [ ] Backup sheet data

---

## Quick Reference

### Important IDs
```
Sheet ID: 1SNv1t0h-KRXWQ4xANroW5RQN6zHU57OrrXj_OqzfVsY
Tab "Post" gid: 1123323036
FB Page ID: 915248175005876
```

### Required Columns (for n8n)
```
E: Caption
F: Drive_Folder_ID
H: Status
O: Post_URL (output)
```

### Status Values
```
Draft  → Content đang chuẩn bị
Ready  → Trigger n8n autopost
Done   → Đã đăng thành công
```

### Commands
```bash
# Setup (first time)
node setup-thachvuland-sheet.js

# Test
node test-thachvuland-integration.js

# Check
node check-thachvuland-sheet.js

# Create content
npm run daily -- thachvuland

# Upload + sync
cd scripts/drive-uploader && npm run upload:tvland
```

---

## Contact & Support

**Documentation**:
- Main: `/docs/THACHVULAND_SHEET_OPTIMIZATION.md`
- Summary: `/docs/THACHVULAND_OPTIMIZATION_SUMMARY.md`

**Scripts Location**: `/scripts/drive-uploader/`

**Created**: 2026-01-14
**Last Updated**: 2026-01-14
**Status**: ✅ PRODUCTION READY

---

**IMPORTANT**: Before going to production, complete all items in "Production Readiness Checklist" above.

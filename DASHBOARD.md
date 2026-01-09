# 📊 Hệ Thống Dashboard & Monitoring

Dashboard để giám sát performance và health của automation system.

---

## 🎯 Metrics Cần Theo Dõi

### 1. Content Performance Metrics

**Facebook Post Analytics:**
- Views (Lượt xem)
- Reach (Охват)
- Engagement Rate (Reactions + Comments + Shares / Reach)
- CTR (Click-through rate)
- Best performing topics

**Tracking location:** Google Sheets → `Archive` tab

### 2. Automation Health Metrics

**Workflow Success Rate:**
- Total posts created
- Successful uploads to Drive
- Failed uploads
- n8n workflow execution success rate

**Tracking location:** Script logs + n8n execution history

### 3. Efficiency Metrics

**Time Savings:**
- Average time per post (Before: 55min → After: 7min)
- Posts per week
- Total time saved

---

## 📈 Google Sheets Dashboard

### Setup Analytics Tab

**Tab: Analytics**

#### Section 1: Overview (Current Month)

| Metric | Formula | Target |
|--------|---------|--------|
| **Total Posts** | `=COUNTA(Archive!A:A)-1` | 20/month |
| **Avg Views** | `=AVERAGE(Archive!E:E)` | 2,000 |
| **Avg Engagement** | `=AVERAGE(Archive!F:F)` | 3% |
| **Best Post** | `=INDEX(Archive!B:B, MATCH(MAX(Archive!E:E), Archive!E:E, 0))` | - |

#### Section 2: Weekly Breakdown

| Week | Posts | Avg Views | Avg Engagement | Status |
|------|-------|-----------|----------------|--------|
| W01  | 5     | 1,850     | 2.8%           | 😐     |
| W02  | 7     | 2,340     | 3.5%           | ✅     |
| W03  | 6     | 2,120     | 3.2%           | ✅     |

**Formula examples:**
```excel
# Week number
=WEEKNUM(Archive!B2)

# Count posts in week
=COUNTIF(Archive!$B:$B, ">="&DATE(2026,1,1))

# Average views for week
=AVERAGEIFS(Archive!E:E, Archive!B:B, ">="&A2, Archive!B:B, "<"&A3)
```

#### Section 3: Content Type Performance

| Type | Count | Avg Views | Avg Engagement | Best Topic |
|------|-------|-----------|----------------|------------|
| Tutorial | 8 | 2,500 | 4.2% | AI Prompts Guide |
| Listicle | 6 | 2,100 | 3.8% | 10 Best Tools |
| Case Study | 4 | 1,800 | 3.1% | Client Success |

#### Section 4: Charts

**Recommended charts:**
1. Line chart: Views over time
2. Bar chart: Engagement by content type
3. Pie chart: Content type distribution

---

## 🔍 n8n Monitoring

### Execution Dashboard

**Location:** n8n UI → Workflows → Facebook Publisher → Executions

**Monitor:**
- [ ] Success rate > 95%
- [ ] Average execution time < 30 seconds
- [ ] Error count per day < 1

### Error Alerts

**Setup webhook notification:**

1. In n8n workflow, add error handling:
   ```
   [Try/Catch Block]
     ↓
   [On Error → Send Notification]
     ↓
   [Slack/Email/Telegram]
   ```

2. Error message format:
   ```
   ⚠️ Workflow Failed!

   Post ID: post_001
   Error: Drive folder not found
   Time: 2026-01-08 14:30

   Action needed: Check Drive_Folder_ID in Sheets
   ```

---

## 📊 Simple HTML Dashboard

### Create Local Dashboard

**File:** `dashboard/index.html`

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Long Best AI - Dashboard</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #141413;
            color: #faf9f5;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            color: #d97757;
        }
        .metrics {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin: 30px 0;
        }
        .metric-card {
            background: rgba(250, 249, 245, 0.05);
            border: 1px solid #d97757;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
        }
        .metric-value {
            font-size: 36px;
            font-weight: bold;
            color: #d97757;
        }
        .metric-label {
            font-size: 14px;
            color: rgba(250, 249, 245, 0.7);
            margin-top: 5px;
        }
        .status-ok { color: #788c5d; }
        .status-warning { color: #f4a261; }
        .status-error { color: #e76f51; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Long Best AI - Dashboard</h1>

        <div class="metrics">
            <div class="metric-card">
                <div class="metric-value" id="total-posts">--</div>
                <div class="metric-label">Total Posts (This Month)</div>
            </div>

            <div class="metric-card">
                <div class="metric-value" id="avg-views">--</div>
                <div class="metric-label">Average Views</div>
            </div>

            <div class="metric-card">
                <div class="metric-value" id="engagement">--</div>
                <div class="metric-label">Engagement Rate</div>
            </div>

            <div class="metric-card">
                <div class="metric-value status-ok" id="automation-health">✅</div>
                <div class="metric-label">Automation Status</div>
            </div>
        </div>

        <h2>Recent Posts</h2>
        <table id="recent-posts" style="width: 100%; color: #faf9f5;">
            <thead>
                <tr style="border-bottom: 2px solid #d97757;">
                    <th>Date</th>
                    <th>Topic</th>
                    <th>Views</th>
                    <th>Engagement</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <!-- Populated by script -->
            </tbody>
        </table>
    </div>

    <script>
        // Fetch data from Google Sheets API
        // (Hoặc manually update với data export)

        // Example manual data
        document.getElementById('total-posts').textContent = '18';
        document.getElementById('avg-views').textContent = '2,340';
        document.getElementById('engagement').textContent = '3.5%';
    </script>
</body>
</html>
```

**Open dashboard:**
```bash
open dashboard/index.html
```

---

## 📝 Daily Checklist

### Morning (9:00 AM)

- [ ] Check n8n workflow status
- [ ] Review posts published yesterday
- [ ] Check error logs
- [ ] Respond to comments

### Midday (12:00 PM)

- [ ] Create 1-2 new posts
- [ ] Update Content Calendar
- [ ] Review engagement on morning posts

### Evening (6:00 PM)

- [ ] Update Analytics tab
- [ ] Plan tomorrow's content
- [ ] Backup important data

---

## 📊 Weekly Report Template

**Google Sheets → New tab: "Weekly_Reports"**

| Week | Start Date | Posts | Total Views | Avg Engagement | Top Post | Notes |
|------|------------|-------|-------------|----------------|----------|-------|
| W01  | 2026-01-01 | 5     | 9,250       | 2.8%           | AI Tips  | Slow start |
| W02  | 2026-01-08 | 7     | 16,380      | 3.5%           | Prompts  | Great! |

**Review questions:**
1. Đã đạt mục tiêu số bài đăng? (Target: 5-7/tuần)
2. Engagement có tăng không?
3. Topic nào perform tốt nhất?
4. Automation có lỗi gì không?
5. Cần adjust strategy gì?

---

## 🎯 Performance Goals (Monthly)

### Content Goals
- [ ] 20 posts minimum
- [ ] Average views > 2,000
- [ ] Engagement rate > 3%
- [ ] 1 viral post (>10K views)

### Automation Goals
- [ ] Success rate > 95%
- [ ] Time saved > 15 hours
- [ ] Zero manual intervention days > 15

### Growth Goals
- [ ] Follower growth > 5%
- [ ] Page likes growth > 3%
- [ ] Comment rate growth > 10%

---

## 🔔 Alert Setup

### Critical Alerts (Immediate action needed)

**Trigger:** Workflow failed 3 times in a row
**Action:** Check n8n logs, fix issue

**Trigger:** Post engagement < 1% for 3 consecutive posts
**Action:** Review content strategy

**Trigger:** Drive storage > 90%
**Action:** Archive old files

### Warning Alerts (Monitor)

**Trigger:** Average views dropped 20%
**Action:** Analyze recent posts, adjust topics

**Trigger:** Execution time > 60 seconds
**Action:** Optimize workflow

---

## 📈 Growth Tracking

**Monthly comparison:**

| Month | Posts | Views | Engagement | Followers | Growth |
|-------|-------|-------|------------|-----------|--------|
| Jan   | 20    | 46K   | 3.5%       | 1,200     | -      |
| Feb   | 25    | 58K   | 4.1%       | 1,450     | +20%   |
| Mar   | 28    | 71K   | 4.8%       | 1,800     | +24%   |

**Goal:** 20% growth month-over-month

---

**Last Updated:** 2026-01-08
**Version:** 1.0

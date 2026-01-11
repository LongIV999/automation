# Facebook Integration Setup for Queen Nail Bern

## 📱 Step 1: Get Facebook Page ID

### Method 1: From Page Settings
1. Go to your Queen Nail Bern Facebook Page
2. Click **Settings** (⚙️ icon)
3. Scroll down to find **Page ID**
4. Copy the Page ID

### Method 2: From Page URL
1. Go to https://www.facebook.com/your-page-name
2. Look at the URL or Page About section
3. The Page ID is a long number (e.g., `123456789012345`)

### Method 3: Using Graph API Explorer
1. Go to [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your Page
3. Query: `me?fields=id,name`
4. Click **Submit**
5. Copy the `id` value

---

## 🔑 Step 2: Create Facebook App (Required for API Access)

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** → **Create App**
3. Select **Business** app type
4. Fill in details:
   - **App Name:** Queen Nail Bern Automation
   - **App Purpose:** Business
   - **Company:** Queen Nail Bern
5. Click **Create App**

---

## 🔐 Step 3: Configure App Permissions

1. In your app dashboard, go to **Settings** → **Basic**
2. Add **App Domain** (optional, can be localhost for testing)
3. Go to **Add Product** → Find **Facebook Login** → Click **Set Up**
4. Enable **Facebook Login**
5. Go to **App Review** → **Permissions and Features**
6. Request these permissions:
   - `pages_manage_posts` (required for posting)
   - `pages_read_engagement` (for analytics)
   - `pages_manage_engagement` (for comments)

---

## 🎫 Step 4: Generate Access Token

### Get Page Access Token:

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from dropdown
3. Click **Generate Access Token**
4. Select permissions:
   - `pages_manage_posts`
   - `pages_read_engagement`
   - `pages_manage_engagement`
5. Authorize
6. Copy the **User Access Token**

### Convert to Long-Lived Page Token:

Run this in terminal (replace values):
```bash
curl -X GET "https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=YOUR_SHORT_LIVED_TOKEN"
```

You'll get a long-lived token (60 days).

### Get Page Token:
```bash
curl -X GET "https://graph.facebook.com/v19.0/me/accounts?access_token=YOUR_LONG_LIVED_USER_TOKEN"
```

Find your Queen Nail Bern page and copy its `access_token`.

**Important:** Page tokens don't expire! Save this token securely.

---

## 🔧 Step 5: Update Queen Nail Bern Configuration

Edit `/Users/admin/automation/brands/queennailbern/brand.json`:

```json
{
  "facebook": {
    "pageId": "YOUR_PAGE_ID_HERE",
    "accessToken": "YOUR_PAGE_ACCESS_TOKEN_HERE",
    "graphApiVersion": "v19.0"
  }
}
```

---

## 🤖 Step 6: Setup n8n Workflow

### Prerequisites:
- n8n installed and running
- Access to n8n web interface

### Create Workflow:

1. **Open n8n** (usually http://localhost:5678)

2. **Create New Workflow** named: `Queen Nail Bern Auto Post`

3. **Add Nodes:**

#### Node 1: Schedule Trigger
- **Type:** Schedule Trigger
- **Interval:** Every hour
- **Timezone:** Europe/Zurich

#### Node 2: Google Sheets (Read)
- **Type:** Google Sheets
- **Operation:** Read
- **Spreadsheet:** Select your Queen Nail Bern Sheet
- **Sheet:** Content_Calendar
- **Range:** A:I (all columns)
- **Filter:**
  - Status = "scheduled"
  - Date = Today

#### Node 3: Function (Check Time)
```javascript
// Check if current time matches scheduled post time
const now = new Date();
const currentHour = now.getHours();
const scheduledTime = parseInt($json.scheduled_time); // e.g., 10 for 10:00

if (currentHour === scheduledTime) {
  return $json;
}
return null;
```

#### Node 4: Google Drive (Get Files)
- **Type:** Google Drive
- **Operation:** Get Files
- **Folder ID:** `{{$json.Folder_ID}}`
- **Return:** File URLs

#### Node 5: HTTP Request (Download Images)
- **Type:** HTTP Request
- **Method:** GET
- **URL:** `{{$json.url}}`
- **Binary:** Yes

#### Node 6: Facebook Graph API (Create Post)
- **Type:** HTTP Request
- **Method:** POST
- **URL:** `https://graph.facebook.com/v19.0/{{YOUR_PAGE_ID}}/photos`
- **Body:**
  ```json
  {
    "url": "{{$json.image_url}}",
    "published": false,
    "access_token": "{{YOUR_PAGE_ACCESS_TOKEN}}"
  }
  ```
- **Note:** Create 7 photo nodes for carousel

#### Node 7: Facebook Graph API (Publish Carousel)
- **Type:** HTTP Request
- **Method:** POST
- **URL:** `https://graph.facebook.com/v19.0/{{YOUR_PAGE_ID}}/feed`
- **Body:**
  ```json
  {
    "message": "{{$json.caption}}",
    "attached_media": [
      {"media_fbid": "{{photo1_id}}"},
      {"media_fbid": "{{photo2_id}}"},
      // ... up to photo7_id
    ],
    "access_token": "{{YOUR_PAGE_ACCESS_TOKEN}}"
  }
  ```

#### Node 8: Google Sheets (Update Status)
- **Type:** Google Sheets
- **Operation:** Update
- **Spreadsheet:** Queen Nail Bern Sheet
- **Sheet:** Content_Calendar
- **Update:** Set Status = "published", Posted_At = NOW()

4. **Activate Workflow**
5. **Test** with a scheduled post

---

## 🔐 Security Best Practices

1. **Never commit tokens to git:**
   ```bash
   echo "brands/queennailbern/secrets.json" >> .gitignore
   ```

2. **Store tokens in environment variables:**
   ```bash
   export QUEEN_NAIL_FB_PAGE_ID="your_page_id"
   export QUEEN_NAIL_FB_ACCESS_TOKEN="your_token"
   ```

3. **Use .env file:**
   ```
   # .env
   QUEEN_NAIL_FB_PAGE_ID=123456789
   QUEEN_NAIL_FB_ACCESS_TOKEN=EAAxxxxx...
   ```

4. **Rotate tokens periodically**

---

## 📊 Test Facebook Posting

### Manual Test:
```bash
curl -X POST "https://graph.facebook.com/v19.0/YOUR_PAGE_ID/photos" \
  -F "url=https://your-image-url.com/image.png" \
  -F "message=Test post from Queen Nail Bern automation 💅" \
  -F "access_token=YOUR_PAGE_ACCESS_TOKEN"
```

### Expected Response:
```json
{
  "id": "PAGE_ID_PHOTO_ID",
  "post_id": "PAGE_ID_POST_ID"
}
```

---

## 🚨 Troubleshooting

### Error: "Invalid OAuth access token"
- Token expired → Generate new token
- Wrong token type → Use **Page Token**, not User Token
- Missing permissions → Re-authorize with correct permissions

### Error: "Requires manage_pages permission"
- App not approved → Request permission approval
- Wrong scope → Check permissions in Graph API Explorer

### Error: "Cannot post to page"
- Not page admin → Verify you're admin of the page
- Page restrictions → Check page settings

### Posts not appearing:
- Check Facebook Page Insights for flagged content
- Verify images are publicly accessible URLs
- Check posting frequency limits (Facebook may throttle)

---

## 📅 Publishing Schedule

The n8n workflow will automatically post according to this schedule:

| Day | Time (Zurich) | Content Type |
|-----|---------------|--------------|
| Monday | 10:00 | Nail Designs |
| Tuesday | 15:00 | Tips & Care |
| Wednesday | 10:00 | Nail Designs |
| Thursday | 18:00 | Promotions |
| Friday | 12:00 | Customer Reviews |

---

## ✅ Verification Checklist

Before going live:

- [ ] Facebook Page ID configured in brand.json
- [ ] Page Access Token generated and stored securely
- [ ] n8n workflow created and tested
- [ ] Google Sheets connected and readable by n8n
- [ ] Test post published successfully
- [ ] Workflow triggered on schedule
- [ ] Status updates working in Google Sheets
- [ ] Analytics tracking enabled

---

## 📞 Support

If you encounter issues:
1. Check n8n execution logs
2. Verify Facebook Graph API Explorer
3. Review Google Sheets permissions
4. Test each component individually

---

## 🎯 Next Steps

After Facebook integration is working:
1. ✅ Generate first week of content
2. ✅ Schedule posts in Google Sheets
3. ✅ Monitor first auto-posts
4. ✅ Optimize posting times based on engagement
5. ✅ Setup Facebook Page Insights in Google Sheets Analytics tab

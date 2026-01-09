# 🏢 Multi-Brand Management System

Quản lý nhiều fanpage/brands trong cùng 1 automation system.

## 📁 Cấu Trúc

```
brands/
├── README.md                    # File này
├── _templates/                  # Templates để tạo brand mới
│   ├── brand-config.template.json
│   ├── n8n-workflow.template.json
│   └── .env.template
│
├── longbest-ai/                 # Brand 1: Long Best AI
│   ├── brand.json              # Brand configuration
│   ├── .env                    # Brand-specific env vars
│   ├── content/                # Content JSON files
│   ├── output/                 # Generated carousel images
│   ├── credentials/            # Facebook credentials (optional)
│   └── n8n-workflow.json       # Auto-generated n8n workflow
│
├── thachvuland/                # Brand 2: Thach Vu Land
│   ├── brand.json
│   ├── .env
│   ├── content/
│   ├── output/
│   ├── credentials/
│   └── n8n-workflow.json
│
└── nano-banana/                # Brand 3: Nano Banana (example)
    └── ...
```

## 🎯 Brand Configuration Schema

Mỗi brand có file `brand.json`:

```json
{
  "brandId": "longbest-ai",
  "name": "Long Best AI",
  "description": "Vietnamese AI education fanpage",

  "colors": {
    "primary": "#C15F3C",
    "background": "#F4F3EE",
    "accent": "#788c5d",
    "text": "#000000"
  },

  "typography": {
    "headline": "Poppins",
    "body": "Lora",
    "sizes": {
      "h1Title": 72,
      "h1Content": 56,
      "h2": 36
    }
  },

  "branding": {
    "logoText": "Long Best AI",
    "tagline": "Học AI Dễ Hiểu, Ứng Dụng Ngay",
    "cornerText": "Long Best AI"
  },

  "googleSheets": {
    "sheetId": "1RAHjxLDULl0aRWHSX0aqUh1dqv7li7zwi0DZA6atQj0",
    "tabName": "Posts",
    "contentCalendarTab": "Content_Calendar",
    "archiveTab": "Archive"
  },

  "googleDrive": {
    "parentFolderId": null,
    "folderPrefix": "LBAI"
  },

  "facebook": {
    "pageId": "YOUR_PAGE_ID",
    "credentialId": "YOUR_N8N_CREDENTIAL_ID"
  },

  "posting": {
    "frequency": "3x/week",
    "schedule": ["Monday", "Wednesday", "Friday"],
    "timezone": "Asia/Ho_Chi_Minh"
  }
}
```

## 🛠 Sử Dụng

### 1️⃣ Tạo Brand Mới

```bash
# Tạo brand mới từ template
./brand-manager.sh create <brand-id> "<Brand Name>"

# Example:
./brand-manager.sh create nano-banana "Nano Banana"
```

### 2️⃣ Nhân Bản Brand

```bash
# Clone cấu hình từ brand có sẵn
./brand-manager.sh clone <source-brand> <new-brand>

# Example: Tạo brand mới từ Long Best AI
./brand-manager.sh clone longbest-ai nano-banana
```

### 3️⃣ List Brands

```bash
./brand-manager.sh list
```

### 4️⃣ Tạo Post Cho Brand

```bash
cd scripts/content-automation

# Tạo post cho specific brand
./create-post.sh --brand longbest-ai content.json "2026-01-10_Topic"

# Hoặc đặt biến môi trường
BRAND=longbest-ai ./create-post.sh content.json "2026-01-10_Topic"
```

### 5️⃣ Generate n8n Workflow

```bash
# Tạo workflow file từ brand config
./brand-manager.sh generate-workflow <brand-id>

# Output: brands/<brand-id>/n8n-workflow.json
# Import file này vào n8n
```

## 🔄 Workflow Update

Khi thêm brand mới:

1. **Create brand** → `./brand-manager.sh create nano-banana "Nano Banana"`
2. **Edit config** → Sửa `brands/nano-banana/brand.json`
3. **Setup Facebook** → Thêm Facebook Page credentials vào n8n
4. **Generate workflow** → `./brand-manager.sh generate-workflow nano-banana`
5. **Import to n8n** → Import `brands/nano-banana/n8n-workflow.json`
6. **Create content** → Tạo content trong `brands/nano-banana/content/`
7. **Run automation** → `./create-post.sh --brand nano-banana ...`

## 📊 Credentials Management

### Google Credentials (Shared)

Google Drive và Sheets dùng chung credentials:

```
scripts/drive-uploader/
├── credentials.json    # Google OAuth credentials
└── token.json         # Access token
```

Tất cả brands dùng chung 1 Google account, phân biệt bằng:
- Drive: Parent folder khác nhau (optional)
- Sheets: Spreadsheet ID khác nhau

### Facebook Credentials (Per-Brand)

Mỗi brand có Facebook Page riêng:

1. Tạo credentials trong n8n UI
2. Copy credential ID
3. Paste vào `brands/<brand-id>/brand.json` → `facebook.credentialId`

## 🎨 Brand Assets

Mỗi brand có thể có assets riêng:

```
brands/<brand-id>/
├── assets/
│   ├── logo.png
│   ├── background-pattern.png
│   └── fonts/
```

Carousel generator sẽ tự động load assets từ brand folder.

## 🔐 Security Notes

**⚠️ IMPORTANT:**

1. **NEVER commit credentials to git**
   - `brands/*/credentials/` → gitignored
   - `brands/*/.env` → gitignored

2. **Backup credentials securely**
   - Lưu offline hoặc password manager
   - Có recovery plan nếu mất credentials

3. **Separate environments**
   - Development vs Production brands
   - Test với sandbox Facebook pages trước

## 📈 Scaling Tips

- Giữ brand configs đơn giản và consistent
- Dùng templates để đảm bảo quality
- Monitor từng brand riêng (separate Sheets tabs)
- Có naming convention rõ ràng (kebab-case brand IDs)

## 🆘 Troubleshooting

**Brand không hoạt động:**
1. Check `brand.json` syntax (valid JSON)
2. Verify Google Sheets ID đúng
3. Verify Facebook credential ID trong n8n
4. Check permissions (Drive folder, Sheets access)

**n8n workflow fails:**
1. Re-import workflow JSON
2. Update credentials trong n8n UI
3. Check Schedule Trigger enabled
4. Test manually trong n8n

---

**Next:** Xem [brand-manager.sh](../brand-manager.sh) để biết cách sử dụng CLI tool.

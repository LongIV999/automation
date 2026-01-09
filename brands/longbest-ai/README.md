# Long Best AI

Vietnamese AI education fanpage

## Setup Steps

1. **Edit brand config**: `brand.json`
   - Update Google Sheets ID
   - Update Facebook Page ID
   - Customize colors, fonts, branding

2. **Setup Facebook credentials trong n8n**
   - Add Facebook Graph API credentials
   - Copy credential ID
   - Paste vào `brand.json` → `facebook.credentialId`

3. **Generate n8n workflow**:
   ```bash
   cd /Users/admin/automation
   ./brand-manager.sh generate-workflow longbest-ai
   ```

4. **Import workflow vào n8n**:
   - Open n8n UI
   - Import `n8n-workflow.json`
   - Activate workflow

5. **Create first post**:
   ```bash
   cd scripts/content-automation
   ./create-post.sh --brand longbest-ai content.json "2026-01-10_Topic"
   ```

## Brand Config

- **Brand ID**: longbest-ai
- **Name**: Long Best AI
- **Created**: 2026-01-09T07:08:43Z

## Directories

- `content/` - Content JSON files
- `output/` - Generated carousel images
- `credentials/` - Facebook credentials (gitignored)
- `assets/` - Brand-specific assets (logos, fonts, etc.)

## Quick Commands

```bash
# Tạo post
./create-post.sh --brand longbest-ai content.json "Folder_Name"

# Generate workflow
./brand-manager.sh generate-workflow longbest-ai

# Validate config
./brand-manager.sh validate longbest-ai
```

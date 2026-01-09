#!/bin/bash

###############################################################################
# Brand Manager CLI
#
# Quản lý nhiều brands/fanpages trong cùng 1 automation system
#
# Usage:
#   ./brand-manager.sh create <brand-id> "<Brand Name>"
#   ./brand-manager.sh clone <source-brand> <new-brand>
#   ./brand-manager.sh list
#   ./brand-manager.sh info <brand-id>
#   ./brand-manager.sh generate-workflow <brand-id>
#   ./brand-manager.sh validate <brand-id>
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Directories
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BRANDS_DIR="$SCRIPT_DIR/brands"
TEMPLATES_DIR="$BRANDS_DIR/_templates"

# Functions
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_step() {
    echo ""
    echo -e "${CYAN}━━━ $1 ━━━${NC}"
}

# Validate brand ID format
validate_brand_id() {
    local brand_id=$1
    if [[ ! $brand_id =~ ^[a-z0-9-]+$ ]]; then
        log_error "Brand ID phải là lowercase, chỉ chứa: a-z, 0-9, dấu gạch ngang (-)."
        log_info "Ví dụ hợp lệ: longbest-ai, nano-banana, thachvuland"
        exit 1
    fi
}

# Check if brand exists
brand_exists() {
    local brand_id=$1
    if [ -d "$BRANDS_DIR/$brand_id" ]; then
        return 0
    else
        return 1
    fi
}

###############################################################################
# Command: create
# Tạo brand mới từ template
###############################################################################
cmd_create() {
    if [ $# -lt 2 ]; then
        echo "Usage: $0 create <brand-id> \"<Brand Name>\" [description]"
        echo ""
        echo "Example:"
        echo "  $0 create nano-banana \"Nano Banana\" \"AI Content Creator\""
        exit 1
    fi

    local brand_id=$1
    local brand_name=$2
    local description=${3:-"$brand_name fanpage"}

    validate_brand_id "$brand_id"

    if brand_exists "$brand_id"; then
        log_error "Brand '$brand_id' đã tồn tại!"
        log_info "Dùng 'clone' để nhân bản brand có sẵn."
        exit 1
    fi

    log_step "Creating brand: $brand_name"

    local brand_dir="$BRANDS_DIR/$brand_id"
    mkdir -p "$brand_dir"

    # Create directory structure
    log_info "Tạo cấu trúc thư mục..."
    mkdir -p "$brand_dir/content"
    mkdir -p "$brand_dir/output"
    mkdir -p "$brand_dir/credentials"
    mkdir -p "$brand_dir/assets"

    # Generate brand.json from template
    log_info "Tạo brand config..."
    local created_at=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local folder_prefix=$(echo "$brand_id" | tr '[:lower:]' '[:upper:]' | sed 's/-//g')

    cat "$TEMPLATES_DIR/brand-config.template.json" | \
        sed "s/{{BRAND_ID}}/$brand_id/g" | \
        sed "s/{{BRAND_NAME}}/$brand_name/g" | \
        sed "s/{{BRAND_DESCRIPTION}}/$description/g" | \
        sed "s/{{BRAND_TAGLINE}}/Your tagline here/g" | \
        sed "s/{{SHEETS_ID}}/YOUR_GOOGLE_SHEETS_ID/g" | \
        sed "s/{{FOLDER_PREFIX}}/$folder_prefix/g" | \
        sed "s/{{FACEBOOK_PAGE_ID}}/YOUR_FACEBOOK_PAGE_ID/g" | \
        sed "s/{{N8N_FACEBOOK_CREDENTIAL_ID}}/YOUR_N8N_CREDENTIAL_ID/g" | \
        sed "s/{{CREATED_AT}}/$created_at/g" \
        > "$brand_dir/brand.json"

    # Generate .env from template
    log_info "Tạo .env file..."
    cat "$TEMPLATES_DIR/.env.template" | \
        sed "s/{{BRAND_ID}}/$brand_id/g" | \
        sed "s/{{BRAND_NAME}}/$brand_name/g" | \
        sed "s/{{SHEETS_ID}}/YOUR_GOOGLE_SHEETS_ID/g" | \
        sed "s/{{FACEBOOK_PAGE_ID}}/YOUR_FACEBOOK_PAGE_ID/g" | \
        sed "s/{{N8N_WORKFLOW_ID}}/AUTO_GENERATED/g" \
        > "$brand_dir/.env"

    # Create README
    log_info "Tạo README..."
    cat > "$brand_dir/README.md" <<EOF
# $brand_name

$description

## Setup Steps

1. **Edit brand config**: \`brand.json\`
   - Update Google Sheets ID
   - Update Facebook Page ID
   - Customize colors, fonts, branding

2. **Setup Facebook credentials trong n8n**
   - Add Facebook Graph API credentials
   - Copy credential ID
   - Paste vào \`brand.json\` → \`facebook.credentialId\`

3. **Generate n8n workflow**:
   \`\`\`bash
   cd $SCRIPT_DIR
   ./brand-manager.sh generate-workflow $brand_id
   \`\`\`

4. **Import workflow vào n8n**:
   - Open n8n UI
   - Import \`n8n-workflow.json\`
   - Activate workflow

5. **Create first post**:
   \`\`\`bash
   cd scripts/content-automation
   ./create-post.sh --brand $brand_id content.json "2026-01-10_Topic"
   \`\`\`

## Brand Config

- **Brand ID**: $brand_id
- **Name**: $brand_name
- **Created**: $created_at

## Directories

- \`content/\` - Content JSON files
- \`output/\` - Generated carousel images
- \`credentials/\` - Facebook credentials (gitignored)
- \`assets/\` - Brand-specific assets (logos, fonts, etc.)

## Quick Commands

\`\`\`bash
# Tạo post
./create-post.sh --brand $brand_id content.json "Folder_Name"

# Generate workflow
./brand-manager.sh generate-workflow $brand_id

# Validate config
./brand-manager.sh validate $brand_id
\`\`\`
EOF

    log_success "Brand '$brand_id' created successfully!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}Next Steps:${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. Edit config:"
    echo -e "   ${YELLOW}nano $brand_dir/brand.json${NC}"
    echo ""
    echo "2. Update these values:"
    echo "   - googleSheets.sheetId"
    echo "   - facebook.pageId"
    echo "   - facebook.credentialId (from n8n)"
    echo ""
    echo "3. Generate n8n workflow:"
    echo -e "   ${YELLOW}./brand-manager.sh generate-workflow $brand_id${NC}"
    echo ""
    echo "4. Import workflow to n8n and activate"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

###############################################################################
# Command: clone
# Nhân bản brand từ brand có sẵn
###############################################################################
cmd_clone() {
    if [ $# -lt 2 ]; then
        echo "Usage: $0 clone <source-brand> <new-brand-id> [\"New Brand Name\"]"
        echo ""
        echo "Example:"
        echo "  $0 clone longbest-ai nano-banana \"Nano Banana\""
        exit 1
    fi

    local source_brand=$1
    local new_brand_id=$2
    local new_brand_name=${3:-$(echo "$new_brand_id" | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g')}

    validate_brand_id "$new_brand_id"

    if ! brand_exists "$source_brand"; then
        log_error "Source brand '$source_brand' không tồn tại!"
        exit 1
    fi

    if brand_exists "$new_brand_id"; then
        log_error "Brand '$new_brand_id' đã tồn tại!"
        exit 1
    fi

    log_step "Cloning: $source_brand → $new_brand_id"

    local source_dir="$BRANDS_DIR/$source_brand"
    local new_dir="$BRANDS_DIR/$new_brand_id"

    # Copy entire directory
    log_info "Copying brand directory..."
    cp -r "$source_dir" "$new_dir"

    # Clear output directory
    rm -rf "$new_dir/output"/*
    rm -rf "$new_dir/credentials"/*

    # Update brand.json
    log_info "Updating brand config..."
    local created_at=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    if command -v jq &> /dev/null; then
        # Use jq if available
        jq --arg id "$new_brand_id" \
           --arg name "$new_brand_name" \
           --arg created "$created_at" \
           '.brandId = $id | .name = $name | .branding.logoText = $name | .branding.cornerText = $name | .metadata.createdAt = $created' \
           "$new_dir/brand.json" > "$new_dir/brand.json.tmp" && \
           mv "$new_dir/brand.json.tmp" "$new_dir/brand.json"
    else
        # Fallback to sed
        sed -i.bak "s/\"brandId\": \"$source_brand\"/\"brandId\": \"$new_brand_id\"/" "$new_dir/brand.json"
        sed -i.bak "s/\"name\": \".*\"/\"name\": \"$new_brand_name\"/" "$new_dir/brand.json"
        rm "$new_dir/brand.json.bak"
    fi

    # Update .env
    log_info "Updating .env..."
    sed -i.bak "s/BRAND_ID=$source_brand/BRAND_ID=$new_brand_id/" "$new_dir/.env"
    sed -i.bak "s/BRAND_NAME=.*/BRAND_NAME=$new_brand_name/" "$new_dir/.env"
    rm "$new_dir/.env.bak"

    # Update README
    log_info "Updating README..."
    sed -i.bak "s/$source_brand/$new_brand_id/g" "$new_dir/README.md"
    rm "$new_dir/README.md.bak"

    log_success "Brand cloned: $source_brand → $new_brand_id"
    echo ""
    log_warning "IMPORTANT: Update these values manually:"
    echo "  - googleSheets.sheetId (in brand.json)"
    echo "  - facebook.pageId (in brand.json)"
    echo "  - facebook.credentialId (in brand.json)"
    echo ""
    log_info "Edit config: nano $new_dir/brand.json"
}

###############################################################################
# Command: list
# Hiển thị tất cả brands
###############################################################################
cmd_list() {
    log_step "All Brands"

    if [ ! -d "$BRANDS_DIR" ]; then
        log_error "Brands directory not found!"
        exit 1
    fi

    local count=0
    echo ""
    printf "%-20s %-30s %-40s\n" "BRAND ID" "NAME" "DESCRIPTION"
    echo "────────────────────────────────────────────────────────────────────────────────────"

    for brand_dir in "$BRANDS_DIR"/*; do
        if [ -d "$brand_dir" ] && [ "$(basename "$brand_dir")" != "_templates" ]; then
            local brand_id=$(basename "$brand_dir")
            local config_file="$brand_dir/brand.json"

            if [ -f "$config_file" ]; then
                if command -v jq &> /dev/null; then
                    local name=$(jq -r '.name' "$config_file")
                    local desc=$(jq -r '.description' "$config_file")
                else
                    local name=$(grep '"name"' "$config_file" | head -1 | sed 's/.*: "\(.*\)".*/\1/')
                    local desc=$(grep '"description"' "$config_file" | head -1 | sed 's/.*: "\(.*\)".*/\1/')
                fi

                printf "%-20s %-30s %-40s\n" "$brand_id" "$name" "$desc"
                ((count++))
            fi
        fi
    done

    echo ""
    log_success "Total: $count brands"
}

###############################################################################
# Command: info
# Hiển thị chi tiết 1 brand
###############################################################################
cmd_info() {
    if [ $# -lt 1 ]; then
        echo "Usage: $0 info <brand-id>"
        exit 1
    fi

    local brand_id=$1

    if ! brand_exists "$brand_id"; then
        log_error "Brand '$brand_id' không tồn tại!"
        exit 1
    fi

    local brand_dir="$BRANDS_DIR/$brand_id"
    local config_file="$brand_dir/brand.json"

    log_step "Brand Info: $brand_id"

    if command -v jq &> /dev/null; then
        echo ""
        echo -e "${CYAN}Basic Info:${NC}"
        jq -r '"  Name: " + .name' "$config_file"
        jq -r '"  Description: " + .description' "$config_file"
        jq -r '"  Created: " + .metadata.createdAt' "$config_file"

        echo ""
        echo -e "${CYAN}Colors:${NC}"
        jq -r '"  Primary: " + .colors.primary' "$config_file"
        jq -r '"  Background: " + .colors.background' "$config_file"
        jq -r '"  Accent: " + .colors.accent' "$config_file"

        echo ""
        echo -e "${CYAN}Google Sheets:${NC}"
        jq -r '"  Sheet ID: " + .googleSheets.sheetId' "$config_file"
        jq -r '"  Tab Name: " + .googleSheets.tabName' "$config_file"

        echo ""
        echo -e "${CYAN}Facebook:${NC}"
        jq -r '"  Page ID: " + .facebook.pageId' "$config_file"
        jq -r '"  Credential ID: " + .facebook.credentialId' "$config_file"

        echo ""
        echo -e "${CYAN}Files:${NC}"
    else
        cat "$config_file"
        echo ""
    fi

    # Count content files
    local content_count=$(find "$brand_dir/content" -name "*.json" 2>/dev/null | wc -l)
    local output_count=$(find "$brand_dir/output" -type d -mindepth 1 2>/dev/null | wc -l)

    echo "  Content files: $content_count"
    echo "  Output folders: $output_count"

    echo ""
    echo -e "${CYAN}Directory:${NC}"
    echo "  $brand_dir"
}

###############################################################################
# Command: validate
# Validate brand config
###############################################################################
cmd_validate() {
    if [ $# -lt 1 ]; then
        echo "Usage: $0 validate <brand-id>"
        exit 1
    fi

    local brand_id=$1

    if ! brand_exists "$brand_id"; then
        log_error "Brand '$brand_id' không tồn tại!"
        exit 1
    fi

    local brand_dir="$BRANDS_DIR/$brand_id"
    local config_file="$brand_dir/brand.json"

    log_step "Validating: $brand_id"

    local errors=0

    # Check JSON syntax
    echo -n "  Checking JSON syntax... "
    if command -v jq &> /dev/null; then
        if jq empty "$config_file" 2>/dev/null; then
            echo -e "${GREEN}✓${NC}"
        else
            echo -e "${RED}✗${NC}"
            log_error "Invalid JSON syntax!"
            ((errors++))
        fi
    else
        echo -e "${YELLOW}⊘ (jq not installed)${NC}"
    fi

    # Check required fields
    echo -n "  Checking required fields... "
    local required_fields=("brandId" "name" "googleSheets.sheetId" "facebook.pageId")
    local missing_fields=0

    if command -v jq &> /dev/null; then
        for field in "${required_fields[@]}"; do
            local value=$(jq -r ".$field" "$config_file" 2>/dev/null)
            if [ "$value" == "null" ] || [ -z "$value" ] || [[ "$value" == *"YOUR_"* ]]; then
                ((missing_fields++))
            fi
        done

        if [ $missing_fields -eq 0 ]; then
            echo -e "${GREEN}✓${NC}"
        else
            echo -e "${RED}✗ ($missing_fields missing)${NC}"
            ((errors++))
        fi
    else
        echo -e "${YELLOW}⊘ (jq not installed)${NC}"
    fi

    # Check directories
    echo -n "  Checking directories... "
    local required_dirs=("content" "output" "credentials" "assets")
    local missing_dirs=0

    for dir in "${required_dirs[@]}"; do
        if [ ! -d "$brand_dir/$dir" ]; then
            ((missing_dirs++))
        fi
    done

    if [ $missing_dirs -eq 0 ]; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${YELLOW}⚠ ($missing_dirs missing)${NC}"
    fi

    echo ""

    if [ $errors -eq 0 ]; then
        log_success "Validation passed!"
    else
        log_error "Validation failed with $errors errors"
        exit 1
    fi
}

###############################################################################
# Command: generate-workflow
# Tạo n8n workflow từ brand config
###############################################################################
cmd_generate_workflow() {
    if [ $# -lt 1 ]; then
        echo "Usage: $0 generate-workflow <brand-id>"
        exit 1
    fi

    local brand_id=$1

    if ! brand_exists "$brand_id"; then
        log_error "Brand '$brand_id' không tồn tại!"
        exit 1
    fi

    local brand_dir="$BRANDS_DIR/$brand_id"
    local config_file="$brand_dir/brand.json"

    log_step "Generating n8n workflow for: $brand_id"

    # Check if we have a workflow generator script
    local generator_script="$SCRIPT_DIR/scripts/n8n-workflow-generator.js"

    if [ ! -f "$generator_script" ]; then
        log_warning "n8n workflow generator chưa có!"
        log_info "Đang tạo workflow generator..."

        # Will create this in next step
        log_error "Please run: node scripts/n8n-workflow-generator.js $brand_id"
        exit 1
    fi

    # Generate workflow
    node "$generator_script" "$brand_id"

    if [ $? -eq 0 ]; then
        log_success "Workflow generated: $brand_dir/n8n-workflow.json"
        echo ""
        log_info "Import file này vào n8n UI để sử dụng"
    else
        log_error "Failed to generate workflow"
        exit 1
    fi
}

###############################################################################
# Main
###############################################################################

# Show help if no arguments
if [ $# -eq 0 ]; then
    echo "Brand Manager CLI - Multi-brand automation system"
    echo ""
    echo "Usage: $0 <command> [arguments]"
    echo ""
    echo "Commands:"
    echo "  create <brand-id> \"<name>\" [desc]  - Tạo brand mới"
    echo "  clone <source> <new-id> [\"name\"]   - Nhân bản brand"
    echo "  list                                - List tất cả brands"
    echo "  info <brand-id>                     - Hiển thị chi tiết brand"
    echo "  validate <brand-id>                 - Validate brand config"
    echo "  generate-workflow <brand-id>        - Tạo n8n workflow"
    echo ""
    echo "Examples:"
    echo "  $0 create nano-banana \"Nano Banana\""
    echo "  $0 clone longbest-ai nano-banana"
    echo "  $0 list"
    echo "  $0 info longbest-ai"
    echo ""
    echo "Documentation: brands/README.md"
    exit 0
fi

# Parse command
COMMAND=$1
shift

case $COMMAND in
    create)
        cmd_create "$@"
        ;;
    clone)
        cmd_clone "$@"
        ;;
    list)
        cmd_list "$@"
        ;;
    info)
        cmd_info "$@"
        ;;
    validate)
        cmd_validate "$@"
        ;;
    generate-workflow)
        cmd_generate_workflow "$@"
        ;;
    *)
        log_error "Unknown command: $COMMAND"
        echo ""
        echo "Run '$0' without arguments to see help"
        exit 1
        ;;
esac

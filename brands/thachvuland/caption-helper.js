/**
 * Caption Generator cho Thach Vu Land
 * Tự động thêm thông tin liên hệ vào mọi caption
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Load brand config
 */
async function loadBrandConfig() {
  const configPath = path.join(__dirname, '../../brands/thachvuland/brand.json');
  const config = JSON.parse(await fs.readFile(configPath, 'utf-8'));
  return config;
}

/**
 * Generate contact footer
 */
function generateContactFooter(brandConfig) {
  const { contact, branding } = brandConfig;

  return `
━━━━━━━━━━━━━━━━━━━━

📞 Liên hệ ngay: ${contact.hotline}
📍 Địa chỉ: ${contact.fullAddress}
💬 Zalo: ${contact.zalo}
🌐 Website: ${branding.website}

⏰ Giờ làm việc: ${contact.workingHours}

${branding.tagline}
`.trim();
}

/**
 * Add contact info to caption
 */
function addContactToCaption(caption, brandConfig) {
  // Remove existing contact info if any
  const cleanCaption = caption
    .replace(/━━━━━━━━━━━━━━━━━━━━[\s\S]*$/m, '')
    .replace(/📞 Liên hệ.*$/m, '')
    .replace(/📍 Địa chỉ.*$/m, '')
    .trim();

  // Add new contact footer
  const footer = generateContactFooter(brandConfig);

  return `${cleanCaption}\n\n${footer}`;
}

/**
 * Generate caption with contact info
 */
async function generateCaption(content, options = {}) {
  const brandConfig = await loadBrandConfig();

  let caption = '';

  // Add main content
  if (typeof content === 'string') {
    caption = content;
  } else if (content.headline || content.description) {
    caption = `${content.headline || ''}\n\n${content.description || ''}`.trim();
  }

  // Add highlights if provided
  if (content.highlights && Array.isArray(content.highlights)) {
    caption += '\n\n' + content.highlights.join('\n');
  }

  // Add CTA if provided
  if (content.cta) {
    caption += `\n\n👉 ${content.cta}`;
  }

  // Add hashtags if provided
  if (content.hashtags) {
    const hashtags = Array.isArray(content.hashtags)
      ? content.hashtags.join(' ')
      : content.hashtags;
    caption += `\n\n${hashtags}`;
  }

  // Add contact info (unless explicitly disabled)
  if (options.includeContact !== false) {
    caption = addContactToCaption(caption, brandConfig);
  }

  return caption;
}

/**
 * Update existing caption with contact info
 */
async function updateCaptionWithContact(existingCaption) {
  const brandConfig = await loadBrandConfig();
  return addContactToCaption(existingCaption, brandConfig);
}

/**
 * Get contact info only
 */
async function getContactInfo() {
  const brandConfig = await loadBrandConfig();
  return generateContactFooter(brandConfig);
}

module.exports = {
  generateCaption,
  updateCaptionWithContact,
  getContactInfo,
  addContactToCaption,
  loadBrandConfig
};

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node caption-helper.js "Your caption text"');
    console.log('  node caption-helper.js --contact-only');
    process.exit(0);
  }

  if (args[0] === '--contact-only') {
    getContactInfo().then(info => {
      console.log(info);
    });
  } else {
    const caption = args[0];
    updateCaptionWithContact(caption).then(result => {
      console.log(result);
    });
  }
}

/**
 * Brand Configuration Loader
 *
 * Load brand config từ brands/<brand-id>/brand.json
 * Sử dụng trong carousel generator, drive uploader, etc.
 */

const fs = require('fs').promises;
const path = require('path');

const BRANDS_DIR = path.join(__dirname, '../../brands');

/**
 * Load brand configuration
 * @param {string} brandId - Brand ID (e.g., 'longbest-ai')
 * @returns {Object} Brand configuration
 */
async function loadBrandConfig(brandId) {
  const brandDir = path.join(BRANDS_DIR, brandId);
  const configPath = path.join(brandDir, 'brand.json');

  try {
    const configData = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configData);

    // Validate required fields
    if (!config.brandId || !config.name) {
      throw new Error(`Invalid brand config: missing required fields`);
    }

    // Add computed paths
    config._paths = {
      brandDir,
      configPath,
      contentDir: path.join(brandDir, 'content'),
      outputDir: path.join(brandDir, 'output'),
      assetsDir: path.join(brandDir, 'assets'),
      credentialsDir: path.join(brandDir, 'credentials')
    };

    return config;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Brand '${brandId}' not found at: ${brandDir}`);
    }
    throw new Error(`Failed to load brand config: ${error.message}`);
  }
}

/**
 * List all available brands
 * @returns {Array} Array of brand configs
 */
async function listBrands() {
  try {
    const entries = await fs.readdir(BRANDS_DIR, { withFileTypes: true });
    const brands = [];

    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== '_templates') {
        try {
          const config = await loadBrandConfig(entry.name);
          brands.push({
            id: config.brandId,
            name: config.name,
            description: config.description
          });
        } catch (error) {
          // Skip invalid brands
          console.warn(`⚠️  Skipping invalid brand: ${entry.name}`);
        }
      }
    }

    return brands;
  } catch (error) {
    throw new Error(`Failed to list brands: ${error.message}`);
  }
}

/**
 * Get brand from environment variable or argument
 * Priority: CLI arg > BRAND env var > default
 * @param {string} cliArg - Brand from CLI argument
 * @param {string} defaultBrand - Default brand if none specified
 * @returns {string} Brand ID
 */
function getBrandId(cliArg = null, defaultBrand = null) {
  return cliArg || process.env.BRAND || defaultBrand;
}

/**
 * Get brand-specific output directory
 * @param {Object} brandConfig - Brand configuration
 * @param {string} subdir - Subdirectory (optional)
 * @returns {string} Output directory path
 */
function getBrandOutputDir(brandConfig, subdir = '') {
  return path.join(brandConfig._paths.outputDir, subdir);
}

/**
 * Get brand-specific content directory
 * @param {Object} brandConfig - Brand configuration
 * @returns {string} Content directory path
 */
function getBrandContentDir(brandConfig) {
  return brandConfig._paths.contentDir;
}

/**
 * Apply brand colors to CSS
 * @param {Object} brandConfig - Brand configuration
 * @returns {string} CSS variables string
 */
function getBrandCSSVariables(brandConfig) {
  const colors = brandConfig.colors || {};

  return `
    --primary: ${colors.primary || '#C15F3C'};
    --background: ${colors.background || '#F4F3EE'};
    --background-dark: ${colors.backgroundDark || '#141413'};
    --accent: ${colors.accent || '#788c5d'};
    --text-main: ${colors.text || '#faf9f5'};
    --text-dark: ${colors.textDark || '#000000'};
  `.trim();
}

/**
 * Get brand typography config
 * @param {Object} brandConfig - Brand configuration
 * @returns {Object} Typography configuration
 */
function getBrandTypography(brandConfig) {
  const typo = brandConfig.typography || {};

  return {
    headline: typo.headline || 'Poppins',
    body: typo.body || 'Lora',
    sizes: typo.sizes || {
      h1Title: 72,
      h1Content: 56,
      h2: 36,
      subheadline: 28,
      content: 24,
      listItem: 26,
      promptBox: 22,
      slideNumber: 24,
      brandCorner: 20
    }
  };
}

/**
 * Get brand corner text
 * @param {Object} brandConfig - Brand configuration
 * @returns {string} Corner text
 */
function getBrandCornerText(brandConfig) {
  return brandConfig.branding?.cornerText || brandConfig.name;
}

/**
 * Get carousel dimensions
 * @param {Object} brandConfig - Brand configuration
 * @returns {Object} {width, height}
 */
function getCarouselDimensions(brandConfig) {
  const carousel = brandConfig.carousel || {};

  return {
    width: carousel.slideWidth || 1080,
    height: carousel.slideHeight || 1350
  };
}

module.exports = {
  loadBrandConfig,
  listBrands,
  getBrandId,
  getBrandOutputDir,
  getBrandContentDir,
  getBrandCSSVariables,
  getBrandTypography,
  getBrandCornerText,
  getCarouselDimensions
};

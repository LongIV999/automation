/**
 * Long Best AI - Carousel Image Generator
 *
 * Tự động tạo ảnh carousel từ content data
 * Input: JSON content file
 * Output: 7 PNG images (01.png - 07.png)
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Cấu hình
const CONFIG = {
  slideWidth: 1080,
  slideHeight: 1350, // 4:5 ratio for Facebook
  outputDir: './output',
  templatePath: '../../design_carousel.html',
  typographyConfigPath: './typography-config.json',
  timeout: 60000 // 60 seconds
};

// Load typography config (global variable will be set in main)
let TYPOGRAPHY_CONFIG = null;

/**
 * Generate carousel images from content
 * @param {Object} contentData - Content for carousel
 * @param {string} outputPath - Output directory
 */
async function generateCarousel(contentData, outputPath = CONFIG.outputDir) {
  console.log('🚀 Starting carousel generation...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });

  try {
    const page = await browser.newPage();

    // Set viewport size
    await page.setViewport({
      width: CONFIG.slideWidth,
      height: CONFIG.slideHeight,
      deviceScaleFactor: 2 // Retina quality
    });

    // Set default timeout
    await page.setDefaultNavigationTimeout(CONFIG.timeout);

    // Create output directory
    await fs.mkdir(outputPath, { recursive: true });

    // Generate each slide
    for (let i = 0; i < contentData.slides.length; i++) {
      const slideNum = String(i + 1).padStart(2, '0');
      console.log(`📸 Generating slide ${slideNum}...`);

      // Create HTML for this slide
      const slideHTML = createSlideHTML(contentData.slides[i], i + 1, contentData);

      // Load HTML
      await page.setContent(slideHTML, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });

      // Wait for fonts to load
      await page.evaluateHandle('document.fonts.ready');

      // Small delay to ensure rendering is complete
      await page.waitForTimeout(500);

      // Screenshot
      const outputFile = path.join(outputPath, `${slideNum}.png`);
      await page.screenshot({
        path: outputFile,
        type: 'png',
        clip: {
          x: 0,
          y: 0,
          width: CONFIG.slideWidth,
          height: CONFIG.slideHeight
        }
      });

      console.log(`✅ Slide ${slideNum} saved: ${outputFile}`);
    }

    console.log('🎉 All slides generated successfully!');
    return true;

  } catch (error) {
    console.error('❌ Error generating carousel:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

/**
 * Create HTML for a single slide
 */
function createSlideHTML(slideData, slideNumber, globalData) {
  const { type, headline, subheadline, content, visual } = slideData;

  // Base template
  const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slide ${slideNumber}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;600&family=Poppins:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-dark: #141413;
            --bg-light: #faf9f5;
            --accent-orange: #d97757;
            --accent-green: #788c5d;
            --text-main: #faf9f5;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            width: 1080px;
            height: 1350px;
            background-color: var(--bg-dark);
            color: var(--text-main);
            font-family: 'Lora', serif;
            overflow: hidden;
            position: relative;
        }
        .slide {
            width: 100%;
            height: 100%;
            padding: 60px;
            display: flex;
            flex-direction: column;
            justify-content: ${type === 'title' ? 'center' : 'flex-start'};
            position: relative;
        }

        /* Glass overlay effect */
        .glass-overlay {
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            border: 2px solid rgba(250, 249, 245, 0.1);
            border-radius: 12px;
            pointer-events: none;
        }

        /* Slide number */
        .slide-number {
            position: absolute;
            top: 40px;
            right: 40px;
            font-family: 'Poppins', sans-serif;
            font-size: ${getFontSize('slideNumber', '24px')};
            font-weight: 600;
            color: var(--accent-orange);
            background: rgba(217, 119, 87, 0.1);
            padding: 8px 20px;
            border-radius: 20px;
            z-index: 100;
        }

        /* Brand corner */
        .brand-corner {
            position: absolute;
            bottom: 40px;
            left: 40px;
            font-family: 'Poppins', sans-serif;
            font-size: ${getFontSize('brandCorner', '20px')};
            font-weight: 600;
            color: var(--accent-green);
            z-index: 100;
        }

        /* Typography */
        h1 {
            font-family: 'Poppins', sans-serif;
            font-size: ${type === 'title' ? getFontSize('h1Title', '72px') : getFontSize('h1Content', '56px')};
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: var(--text-main);
        }

        h2 {
            font-family: 'Poppins', sans-serif;
            font-size: ${getFontSize('h2', '36px')};
            font-weight: 600;
            margin-bottom: 20px;
            color: var(--accent-orange);
        }

        .subheadline {
            font-size: ${getFontSize('subheadline', '28px')};
            color: rgba(250, 249, 245, 0.8);
            margin-bottom: 40px;
            line-height: 1.4;
        }

        .content {
            font-size: ${getFontSize('content', '24px')};
            line-height: 1.8;
            color: var(--text-main);
        }

        /* Content list */
        ul {
            list-style: none;
            margin: 20px 0;
        }

        li {
            font-size: ${getFontSize('listItem', '26px')};
            line-height: 1.6;
            margin-bottom: 20px;
            padding-left: 40px;
            position: relative;
        }

        li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: var(--accent-green);
            font-weight: bold;
            font-size: 32px;
        }

        /* Prompt box */
        .prompt-box {
            background: rgba(250, 249, 245, 0.05);
            border-left: 4px solid var(--accent-orange);
            padding: 30px;
            margin: 30px 0;
            font-family: 'Courier New', monospace;
            font-size: ${getFontSize('promptBox', '22px')};
            line-height: 1.6;
            border-radius: 8px;
        }

        /* CTA section */
        .cta {
            background: linear-gradient(135deg, var(--accent-orange), var(--accent-green));
            padding: 40px;
            border-radius: 16px;
            text-align: center;
            margin-top: auto;
        }

        .cta h2 {
            color: var(--bg-dark);
            margin-bottom: 15px;
        }

        .cta p {
            color: var(--bg-dark);
            font-size: 24px;
            font-weight: 600;
        }

        /* Highlight accent */
        .highlight {
            color: var(--accent-orange);
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="slide">
        <div class="glass-overlay"></div>
        <div class="slide-number">${slideNumber}/7</div>

        ${renderSlideContent(type, { headline, subheadline, content, visual })}

        <div class="brand-corner">Long Best AI</div>
    </div>
</body>
</html>
  `;

  return html;
}

/**
 * Render slide content based on type
 */
function renderSlideContent(type, data) {
  const { headline, subheadline, content } = data;

  switch (type) {
    case 'title':
      return `
        <h1>${headline}</h1>
        ${subheadline ? `<p class="subheadline">${subheadline}</p>` : ''}
      `;

    case 'content':
      return `
        <h2>${headline}</h2>
        <div class="content">${formatContent(content)}</div>
      `;

    case 'list':
      return `
        <h2>${headline}</h2>
        <ul>${content.map(item => `<li>${item}</li>`).join('')}</ul>
      `;

    case 'prompt':
      return `
        <h2>${headline}</h2>
        ${subheadline ? `<p class="subheadline">${subheadline}</p>` : ''}
        <div class="prompt-box">${content}</div>
      `;

    case 'cta':
      return `
        <div class="cta">
          <h2>${headline}</h2>
          <p>${content}</p>
        </div>
      `;

    default:
      return `<div class="content">${content}</div>`;
  }
}

/**
 * Format content text (preserve line breaks, etc.)
 */
function formatContent(content) {
  if (Array.isArray(content)) {
    return content.join('<br><br>');
  }
  return content.replace(/\n/g, '<br>');
}

/**
 * Load typography configuration
 */
async function loadTypographyConfig() {
  try {
    const configPath = path.join(__dirname, CONFIG.typographyConfigPath);
    const rawData = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(rawData);

    // Apply preset multiplier if specified
    const preset = config.presets[config.currentPreset];
    if (preset && preset.multiplier !== 1.0) {
      const multiplier = preset.multiplier;
      Object.keys(config.fontSizes).forEach(key => {
        const original = config.fontSizes[key].value;
        config.fontSizes[key].value = Math.round(original * multiplier);
      });
    }

    return config;
  } catch (error) {
    console.warn('⚠️  Could not load typography config, using defaults');
    return null;
  }
}

/**
 * Get font size from config or use default
 */
function getFontSize(key, defaultValue) {
  if (TYPOGRAPHY_CONFIG && TYPOGRAPHY_CONFIG.fontSizes[key]) {
    return `${TYPOGRAPHY_CONFIG.fontSizes[key].value}px`;
  }
  return defaultValue;
}

/**
 * Load content from JSON file
 */
async function loadContentFromFile(filePath) {
  const rawData = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(rawData);
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node generator.js <content-file.json> [output-dir]');
    console.log('Example: node generator.js content/post_001.json output/post_001');
    process.exit(1);
  }

  const contentFile = args[0];
  const outputDir = args[1] || path.join(CONFIG.outputDir, path.basename(contentFile, '.json'));

  try {
    // Load typography config first
    console.log('📐 Loading typography configuration...');
    TYPOGRAPHY_CONFIG = await loadTypographyConfig();

    if (TYPOGRAPHY_CONFIG) {
      const preset = TYPOGRAPHY_CONFIG.currentPreset;
      console.log(`✓ Typography loaded: ${preset} (${TYPOGRAPHY_CONFIG.presets[preset].description})`);
    }

    // Load content
    const contentData = await loadContentFromFile(contentFile);

    // Generate carousel
    await generateCarousel(contentData, outputDir);

    console.log(`\n✨ Success! Images saved to: ${outputDir}`);

  } catch (error) {
    console.error('\n❌ Failed to generate carousel:', error.message);
    process.exit(1);
  }
}

// Export for use as module
module.exports = { generateCarousel, createSlideHTML };

// Run if called directly
if (require.main === module) {
  main();
}

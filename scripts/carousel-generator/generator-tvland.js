/**
 * Thach Vu Land - Carousel Image Generator
 *
 * Tự động tạo ảnh carousel từ content data (Real Estate Theme)
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
    console.log('🚀 Starting Thach Vu Land carousel generation...');

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
            deviceScaleFactor: 3 // Higher density for crispness
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
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            /* Thach Vu Land Colors */
            --primary-navy: #0A2540;
            --secondary-sage: #4A7C59;
            --accent-terracotta: #C15F3C;
            --bg-white-smoke: #F5F7FA;
            --text-dark: #1A202C;
            --text-light: #FFFFFF;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            width: 1080px;
            height: 1350px;
            background-color: var(--bg-white-smoke);
            color: var(--text-dark);
            font-family: 'Inter', sans-serif; /* Modern sans-serif body */
            overflow: hidden;
            position: relative;
        }
        .slide {
            width: 100%;
            height: 100%;
            padding: 80px 60px; /* More padding top */
            display: flex;
            flex-direction: column;
            justify-content: ${type === 'title' || slideNumber >= 2 ? 'center' : 'flex-start'};
            position: relative;
            background-image: 
                radial-gradient(circle at 10% 10%, rgba(74, 124, 89, 0.05) 0%, transparent 40%),
                radial-gradient(circle at 90% 90%, rgba(10, 37, 64, 0.05) 0%, transparent 40%);
        }

        /* Border frame */
        .slide::after {
            content: '';
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            border: 2px solid rgba(10, 37, 64, 0.1);
            border-radius: 12px;
            pointer-events: none;
        }

        /* Slide number */
        .slide-number {
            position: absolute;
            top: 40px;
            right: 40px;
            font-family: 'Inter', sans-serif;
            font-size: ${getFontSize('slideNumber', '24px')};
            font-weight: 600;
            color: var(--primary-navy);
            background: rgba(10, 37, 64, 0.05);
            padding: 8px 20px;
            border-radius: 20px;
            z-index: 100;
        }

        /* Brand corner */
        .brand-corner {
            position: absolute;
            bottom: 40px;
            left: 40px;
            font-family: 'Merriweather', serif;
            font-size: ${getFontSize('brandCorner', '24px')};
            font-weight: 900;
            color: var(--primary-navy);
            z-index: 100;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .brand-corner::before {
            content: '';
            display: block;
            width: 8px;
            height: 8px;
            background-color: var(--accent-terracotta);
            border-radius: 50%;
        }

        /* Typography */
        h1 {
            font-family: 'Merriweather', serif; /* Serif headlines */
            font-size: ${type === 'title' ? getFontSize('h1Title', '72px') : getFontSize('h1Content', '64px')};
            font-weight: 900;
            line-height: 1.2;
            margin-bottom: 40px;
            color: var(--primary-navy);
            letter-spacing: -0.5px;
        }

        h2 {
            font-family: 'Merriweather', serif;
            font-size: ${getFontSize('h2', '42px')};
            font-weight: 700;
            margin-bottom: 30px;
            color: var(--secondary-sage);
        }

        .subheadline {
            font-size: ${getFontSize('subheadline', '32px')};
            color: #4A5568; /* Softer gray */
            margin-bottom: 50px;
            line-height: 1.5;
            font-weight: 400;
        }

        .content {
            font-size: ${getFontSize('content', '28px')};
            line-height: 1.8;
            color: var(--text-dark);
        }

        /* Content list */
        ul {
            list-style: none;
            margin: 30px 0;
        }

        li {
            font-size: ${getFontSize('listItem', '28px')};
            line-height: 1.6;
            margin-bottom: 24px;
            padding-left: 50px;
            position: relative;
        }

        li::before {
             content: ''; /* Removed default bullet per user request */
        }
        
        /* Box for quotes or emphasis */
        .emphasis-box {
            background-color: white;
            border-left: 6px solid var(--secondary-sage);
            padding: 40px;
            margin: 30px 0;
            border-radius: 0 8px 8px 0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        
        .emphasis-box p {
             font-family: 'Merriweather', serif;
             font-style: italic;
             font-size: 32px;
             color: var(--primary-navy);
        }

        /* CTA section */
        .cta {
            background-color: var(--primary-navy);
            padding: 60px;
            border-radius: 16px;
            text-align: center;
            margin-top: auto;
            color: white;
        }

        .cta h2 {
            color: white;
            margin-bottom: 20px;
        }

        .cta p {
            color: #E2E8F0;
            font-size: 28px;
            font-weight: 500;
        }

        /* Highlight accent */
        .highlight {
            color: var(--accent-terracotta);
            font-weight: 700;
        }
    </style>
</head>
<body>
    <div class="slide">
        <div class="slide-number">${slideNumber}/7</div>

        ${renderSlideContent(type, { headline, subheadline, content, visual })}

        <div class="brand-corner">Thach Vu Land</div>
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

        case 'quote': // New type for Real Estate quotes/stats
            return `
        <h2>${headline}</h2>
        <div class="emphasis-box">
            <p>"${content}"</p>
        </div>
        ${subheadline ? `<p class="subheadline" style="text-align: right; margin-top: 20px;">— ${subheadline}</p>` : ''}
       `;

        case 'list':
            return `
        <h2>${headline}</h2>
        <ul>${content.map(item => `<li>${item}</li>`).join('')}</ul>
      `;

        case 'stats': // New type for lists with numbers
            return `
        <h2>${headline}</h2>
        <div class="content" style="display: grid; grid-template-columns: 1fr; gap: 20px;">
            ${formatStats(content)}
        </div>
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
 * Format stats specific content
 */
function formatStats(content) {
    // If content is array, map it. If string, just return.
    if (Array.isArray(content)) {
        return content.map(item => `<div style="background: white; padding: 20px; border-radius: 8px; font-weight: bold;">${item}</div>`).join('');
    }
    return content;
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
        console.log('Usage: node generator-tvland.js <content-file.json> [output-dir]');
        console.log('Example: node generator-tvland.js content/post_001.json output/post_001');
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

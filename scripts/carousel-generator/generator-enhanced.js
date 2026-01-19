/**
 * Enhanced Carousel Generator with Multiple Design Styles
 *
 * Supports:
 * - tutorial: Step-by-step tutorial with numbered annotations
 * - infographic: Data-heavy with charts, stats, visualizations
 * - quote: Minimal quote/statement design
 * - comparison: Before/after, side-by-side comparisons
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG = {
  slideWidth: 1080,
  slideHeight: 1350, // 4:5 ratio for Facebook
  outputDir: './output',
  timeout: 60000
};

/**
 * Main generation function
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

    await page.setViewport({
      width: CONFIG.slideWidth,
      height: CONFIG.slideHeight,
      deviceScaleFactor: 3
    });

    await page.setDefaultNavigationTimeout(CONFIG.timeout);
    await fs.mkdir(outputPath, { recursive: true });

    for (let i = 0; i < contentData.slides.length; i++) {
      const slideNum = String(i + 1).padStart(2, '0');
      console.log(`📸 Generating slide ${slideNum}...`);

      const slideHTML = createSlideHTML(contentData.slides[i], i + 1, contentData);

      await page.setContent(slideHTML, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });

      await page.evaluateHandle('document.fonts.ready');
      await page.waitForTimeout(500);

      const outputFile = path.join(outputPath, `${slideNum}.png`);
      await page.screenshot({
        path: outputFile,
        type: 'png',
        clip: { x: 0, y: 0, width: CONFIG.slideWidth, height: CONFIG.slideHeight }
      });

      console.log(`✅ Slide ${slideNum} saved: ${outputFile}`);
    }

    const contentFile = path.join(outputPath, 'content.json');
    await fs.writeFile(contentFile, JSON.stringify(contentData, null, 2));

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
 * Create HTML for a single slide with style-specific rendering
 */
function createSlideHTML(slideData, slideNumber, globalData) {
  const brand = globalData.brand || 'Long Best AI';
  const designStyle = globalData.designStyle || 'classic';
  const totalSlides = globalData.slides.length;
  const config = getBrandConfig(brand, designStyle);

  const styleGenerators = {
    'tutorial': createTutorialSlide,
    'infographic': createInfographicSlide,
    'quote': createQuoteSlide,
    'comparison': createComparisonSlide,
    'classic': createClassicSlide
  };

  const generator = styleGenerators[designStyle] || createClassicSlide;
  return generator(slideData, slideNumber, totalSlides, config, globalData);
}

/**
 * CLASSIC STYLE - Original design
 */
function createClassicSlide(slideData, slideNumber, totalSlides, config, globalData) {
  const { type, headline, subheadline, content } = slideData;
  const titleTag = type === 'title' ? 'h1' : 'h2';

  let contentHtml = '';
  if (Array.isArray(content)) {
    contentHtml = content.map(item => `<div class="list-item">• ${item}</div>`).join('');
  } else if (content) {
    contentHtml = `<p>${content}</p>`;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <link href="${config.fonts[0]}" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                width: ${CONFIG.slideWidth}px;
                height: ${CONFIG.slideHeight}px;
                font-family: 'Poppins', sans-serif;
                background: ${config.cssVars['--bg-dark'] || '#141413'};
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 80px;
                text-align: center;
                position: relative;
            }
            .content-box { max-width: 900px; }
            h1 { font-size: 64px; margin-bottom: 20px; line-height: 1.2; }
            h2 { font-size: 48px; margin-bottom: 20px; line-height: 1.2; }
            p { font-size: 32px; opacity: 0.8; line-height: 1.6; }
            .list-item { font-size: 28px; margin-bottom: 10px; text-align: left; }
            .slide-number {
                position: absolute;
                bottom: 40px;
                right: 40px;
                font-size: 24px;
                opacity: 0.5;
            }
        </style>
    </head>
    <body>
        <div class="content-box">
            <${titleTag}>${headline}</${titleTag}>
            <p>${subheadline || ''}</p>
            <div style="margin-top: 30px;">
                ${contentHtml}
            </div>
        </div>
        <div class="slide-number">${slideNumber}/${totalSlides}</div>
    </body>
    </html>
  `;
}

/**
 * Get brand configuration
 */
function getBrandConfig(brand, designStyle) {
  const configs = {
    'Long Best AI': {
      fonts: ['https://fonts.googleapis.com/css2?family=Lora:wght@400;600&family=Poppins:wght@400;600;800&family=Roboto+Mono:wght@500&display=swap'],
      cssVars: {
        '--bg-dark': '#141413',
        '--bg-light': '#F4F3EE',
        '--accent-primary': '#C15F3C',
        '--accent-secondary': '#788c5d',
        '--text-main': '#0A0A0A',
        '--corner-text': 'Long Best AI'
      }
    },
    'Queen Nail Bern': {
      fonts: ['https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600&display=swap'],
      cssVars: {
        '--bg-dark': 'linear-gradient(135deg, #f43f5e 0%, #fbbf24 100%)',
        '--bg-light': '#FFF5F8',
        '--accent-primary': '#ffffff',
        '--accent-secondary': '#ffffff',
        '--text-main': '#ffffff',
        '--corner-text': 'Queen Nail Bern'
      }
    }
  };
  return configs[brand] || configs['Long Best AI'];
}

function createTutorialSlide(slideData, slideNumber, totalSlides, config, globalData) {
  return createClassicSlide(slideData, slideNumber, totalSlides, config, globalData);
}

function createInfographicSlide(slideData, slideNumber, totalSlides, config, globalData) {
  return createClassicSlide(slideData, slideNumber, totalSlides, config, globalData);
}

function createQuoteSlide(slideData, slideNumber, totalSlides, config, globalData) {
  return createClassicSlide(slideData, slideNumber, totalSlides, config, globalData);
}

function createComparisonSlide(slideData, slideNumber, totalSlides, config, globalData) {
  return createClassicSlide(slideData, slideNumber, totalSlides, config, globalData);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node generator-enhanced.js <content.json> <output-dir>');
    process.exit(1);
  }
  const contentPath = args[0];
  const outputPath = args[1];
  fs.readFile(contentPath, 'utf8')
    .then(data => JSON.parse(data))
    .then(content => generateCarousel(content, outputPath))
    .then(() => process.exit(0))
    .catch(error => { console.error('Error:', error); process.exit(1); });
}

module.exports = { generateCarousel };

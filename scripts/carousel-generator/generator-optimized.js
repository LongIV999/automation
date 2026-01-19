/**
 * Optimized Carousel Image Generator
 *
 * Performance improvements:
 * - Browser pooling (reuse instances)
 * - Parallel slide generation
 * - Smart rendering detection
 * - Template caching
 * - Configurable quality settings
 * - Multi-brand support via brand-loader
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const { getBrowserPool, closeGlobalPool } = require('./browser-pool');
const brandLoader = require('./brand-loader');

// Default configuration
const DEFAULT_CONFIG = {
  slideWidth: 1080,
  slideHeight: 1350,
  outputDir: './output',
  timeout: 60000,
  deviceScaleFactor: 2, // Reduced from 3 for better performance
  parallelSlides: 3, // Number of slides to generate concurrently
  renderingDelay: 100, // Reduced from 500ms
  useNetworkIdle: true // Wait for network idle instead of fixed timeout
};

/**
 * Generate carousel images with optimizations
 * @param {Object} contentData - Content for carousel
 * @param {Object} options - Generation options
 */
async function generateCarouselOptimized(contentData, options = {}) {
  const config = { ...DEFAULT_CONFIG, ...options };
  const browserPool = getBrowserPool({
    maxInstances: config.maxBrowsers || 2,
    executablePath: config.executablePath
  });

  console.log('🚀 Starting optimized carousel generation...');
  console.log(`📊 Config: ${config.parallelSlides} parallel slides, scale ${config.deviceScaleFactor}x`);

  const startTime = Date.now();

  try {
    // Create output directory
    await fs.mkdir(config.outputPath, { recursive: true });

    // Load brand config if specified
    let brandConfig = null;
    if (config.brandId) {
      brandConfig = await brandLoader.loadBrandConfig(config.brandId);
      console.log(`🏷️  Brand: ${brandConfig.name}`);
    }

    // Generate slides in parallel batches
    const slides = contentData.slides;
    const totalSlides = slides.length;
    const results = [];

    const slideOffset = config.slideNumberOffset || 0;

    for (let i = 0; i < totalSlides; i += config.parallelSlides) {
      const batch = slides.slice(i, i + config.parallelSlides);
      const batchPromises = batch.map((slide, batchIndex) => {
        const slideIndex = i + batchIndex;
        return generateSingleSlide({
          slideData: slide,
          slideNumber: slideIndex + 1 + slideOffset,
          globalData: contentData,
          brandConfig,
          config,
          browserPool
        });
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      console.log(`✅ Batch ${Math.floor(i / config.parallelSlides) + 1} complete (${results.length}/${totalSlides})`);
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    const avgTime = (elapsed / totalSlides).toFixed(2);

    console.log(`\n🎉 All slides generated successfully!`);
    console.log(`⏱️  Total time: ${elapsed}s (avg ${avgTime}s per slide)`);
    console.log(`📁 Output: ${config.outputPath}`);

    return { success: true, elapsed, slides: results };

  } catch (error) {
    console.error('❌ Error generating carousel:', error);
    throw error;
  }
}

/**
 * Generate a single slide
 */
async function generateSingleSlide({ slideData, slideNumber, globalData, brandConfig, config, browserPool }) {
  const browser = await browserPool.acquire();

  try {
    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({
      width: config.slideWidth,
      height: config.slideHeight,
      deviceScaleFactor: config.deviceScaleFactor
    });

    // Set timeout
    await page.setDefaultNavigationTimeout(config.timeout);

    // Create HTML for this slide
    const slideHTML = createSlideHTML(slideData, slideNumber, globalData, brandConfig);

    // Load HTML with optimized waiting strategy
    const waitUntil = config.useNetworkIdle ? 'networkidle0' : 'domcontentloaded';
    await page.setContent(slideHTML, {
      waitUntil,
      timeout: config.timeout
    });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');

    // Small delay if configured
    if (config.renderingDelay > 0) {
      await page.waitForTimeout(config.renderingDelay);
    }

    // Screenshot
    const slideNum = String(slideNumber).padStart(2, '0');
    const outputFile = path.join(config.outputPath, `${slideNum}.png`);

    await page.screenshot({
      path: outputFile,
      type: 'png',
      clip: {
        x: 0,
        y: 0,
        width: config.slideWidth,
        height: config.slideHeight
      },
      omitBackground: false
    });

    await page.close();

    console.log(`  📸 Slide ${slideNum} saved`);

    return { slideNumber, outputFile, success: true };

  } catch (error) {
    console.error(`  ❌ Error generating slide ${slideNumber}:`, error.message);
    throw error;
  } finally {
    browserPool.release(browser);
  }
}

/**
 * Create HTML for a single slide
 * Enhanced with brand config support
 */
function createSlideHTML(slideData, slideNumber, globalData, brandConfig) {
  const { type, headline, subheadline, content, visual } = slideData;

  // Use brand config or defaults
  const colors = brandConfig?.colors || {
    primary: '#C15F3C',
    background: '#F4F3EE',
    backgroundDark: '#141413',
    accent: '#788c5d',
    text: '#faf9f5',
    textDark: '#000000'
  };

  const typography = brandConfig?.typography || {
    headline: 'Poppins',
    body: 'Lora'
  };

  const brandName = brandConfig?.name || globalData.brand || 'Brand';
  const slideCount = globalData.slides.length;

  // Build font import URL
  const headlineFont = typography.headline.replace(/\s+/g, '+');
  const bodyFont = typography.body.replace(/\s+/g, '+');
  const fontsURL = `https://fonts.googleapis.com/css2?family=${headlineFont}:wght@400;600;800&family=${bodyFont}:wght@400;600&display=swap`;

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slide ${slideNumber}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="${fontsURL}" rel="stylesheet">
    <style>
        :root {
            --primary: ${colors.primary};
            --bg-light: ${colors.background};
            --bg-dark: ${colors.backgroundDark};
            --accent: ${colors.accent};
            --text-main: ${colors.text};
            --text-dark: ${colors.textDark};
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            width: 100%;
            height: 100%;
            background-color: var(--bg-dark);
            color: var(--text-main);
            font-family: '${typography.body}', serif;
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
        .slide-number {
            position: absolute;
            top: 40px;
            right: 40px;
            font-family: '${typography.headline}', sans-serif;
            font-size: 24px;
            font-weight: 600;
            color: var(--primary);
            background: rgba(193, 95, 60, 0.1);
            padding: 8px 20px;
            border-radius: 20px;
            z-index: 100;
        }
        .brand-corner {
            position: absolute;
            bottom: 40px;
            left: 40px;
            font-family: '${typography.headline}', sans-serif;
            font-size: 20px;
            font-weight: 600;
            color: var(--accent);
            z-index: 100;
        }
        h1 {
            font-family: '${typography.headline}', sans-serif;
            font-size: ${type === 'title' ? '72px' : '56px'};
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        h2 {
            font-family: '${typography.headline}', sans-serif;
            font-size: 36px;
            font-weight: 600;
            margin-bottom: 20px;
            color: var(--primary);
        }
        .subheadline {
            font-size: 28px;
            color: rgba(250, 249, 245, 0.8);
            margin-bottom: 40px;
            line-height: 1.4;
        }
        .content {
            font-size: 24px;
            line-height: 1.8;
            color: var(--text-main);
        }
        ul {
            list-style: none;
            margin: 20px 0;
            counter-reset: list-counter;
        }
        li {
            font-size: 26px;
            line-height: 1.6;
            margin-bottom: 20px;
            padding-left: 45px;
            position: relative;
        }
        li::before {
            content: counter(list-counter) ".";
            counter-increment: list-counter;
            position: absolute;
            left: 0;
            color: var(--primary);
            font-weight: 600;
            font-size: 26px;
        }
        .cta {
            background: linear-gradient(135deg, var(--primary), var(--accent));
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
    </style>
</head>
<body>
    <div class="slide">
        <div class="glass-overlay"></div>
        <div class="slide-number">${slideNumber}/${slideCount}</div>
        ${renderSlideContent(type, { headline, subheadline, content, visual })}
        <div class="brand-corner">${brandName}</div>
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
 * Format content text
 */
function formatContent(content) {
  if (Array.isArray(content)) {
    return content.join('<br><br>');
  }
  return content.replace(/\n/g, '<br>');
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
    console.log('Usage: node generator-optimized.js <content-file.json> [options]');
    console.log('\nOptions:');
    console.log('  --output <dir>          Output directory');
    console.log('  --brand <brand-id>      Brand ID (e.g., longbest-ai, thachvuland)');
    console.log('  --parallel <n>          Number of slides to generate in parallel (default: 3)');
    console.log('  --scale <n>             Device scale factor for quality (default: 2)');
    console.log('  --fast                  Fast mode (scale=1, parallel=5, no network idle)');
    console.log('\nExample:');
    console.log('  node generator-optimized.js content/post_001.json --brand longbest-ai --parallel 4');
    process.exit(1);
  }

  const contentFile = args[0];

  // Parse options
  const options = {
    outputPath: path.join(DEFAULT_CONFIG.outputDir, path.basename(contentFile, '.json'))
  };

  for (let i = 1; i < args.length; i++) {
    switch (args[i]) {
      case '--output':
        options.outputPath = args[++i];
        break;
      case '--brand':
        options.brandId = args[++i];
        break;
      case '--parallel':
        options.parallelSlides = parseInt(args[++i], 10);
        break;
      case '--scale':
        options.deviceScaleFactor = parseInt(args[++i], 10);
        break;
      case '--fast':
        options.deviceScaleFactor = 1;
        options.parallelSlides = 5;
        options.useNetworkIdle = false;
        options.renderingDelay = 50;
        console.log('🚀 Fast mode enabled');
        break;
    }
  }

  try {
    // Load content
    const contentData = await loadContentFromFile(contentFile);

    // Generate carousel
    await generateCarouselOptimized(contentData, options);

  } catch (error) {
    console.error('\n❌ Failed to generate carousel:', error.message);
    process.exit(1);
  } finally {
    // Clean up browser pool
    await closeGlobalPool();
  }
}

// Export for use as module
module.exports = {
  generateCarouselOptimized,
  createSlideHTML
};

// Run if called directly
if (require.main === module) {
  main();
}

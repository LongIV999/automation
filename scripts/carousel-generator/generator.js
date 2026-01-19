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

// Load brand configurations
let BRAND_STYLES = null;
async function loadBrandStyles() {
  if (!BRAND_STYLES) {
    const configPath = path.resolve(__dirname, '../../config/brand-styles.json');
    const configData = await fs.readFile(configPath, 'utf8');
    BRAND_STYLES = JSON.parse(configData);
  }
  return BRAND_STYLES;
}

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
async function generateCarousel(contentData, outputPath = CONFIG.outputDir, options = {}) {
  // Load brand styles
  await loadBrandStyles();
  // Extract format configuration from content
  const formatType = contentData.formatType || 'carousel-standard';
  const slideCount = contentData.slideCount || contentData.slides.length;
  const dimensions = contentData.dimensions || {
    width: CONFIG.slideWidth,
    height: CONFIG.slideHeight
  };

  console.log('🚀 Starting image generation...');
  console.log(`📊 Format: ${formatType}`);
  console.log(`📐 Dimensions: ${dimensions.width}x${dimensions.height}`);
  console.log(`📸 Slides: ${slideCount}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });

  try {
    const page = await browser.newPage();

    // Set viewport size from content config
    await page.setViewport({
      width: dimensions.width,
      height: dimensions.height,
      deviceScaleFactor: 3 // Higher density for crispness
    });

    // Set default timeout
    await page.setDefaultNavigationTimeout(CONFIG.timeout);

    // Create output directory
    await fs.mkdir(outputPath, { recursive: true });

    // Check for single-post formats
    if (formatType === 'single-post' || slideCount === 1) {
      return await generateSinglePost(contentData, outputPath, page, dimensions, options);
    }


    // Infographic carousel mode - use infographic style for all slides
    if (contentData.designStyle === 'infographic') {
      return await generateInfographicCarousel(contentData, outputPath, page, dimensions, options);
    }

    // Generate each slide
    for (let i = 0; i < slideCount; i++) {
      const slideNum = String(i + 1).padStart(2, '0');
      console.log(`📸 Generating slide ${slideNum}...`);

      // Create HTML for this slide
      const slideHTML = createSlideHTML(contentData.slides[i], i + 1, contentData, slideCount, dimensions, options);

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
          width: dimensions.width,
          height: dimensions.height
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
 * Generate a single post image (new flexible format)
 * @param {Object} contentData - Content data
 * @param {string} outputPath - Output directory
 * @param {Object} page - Puppeteer page instance
 * @param {Object} dimensions - Image dimensions
 */
async function generateSinglePost(contentData, outputPath, page, dimensions, options = {}) {
  console.log('✨ Generating single post format...');

  const slide = contentData.slides[0];
  const brand = contentData.brand || 'Long Best AI';

  // Create single post HTML
  let html;
  if (contentData.designStyle === 'head-silhouette') {
    html = createHeadSilhouetteHTML(contentData, dimensions, options);
  } else if (contentData.designStyle === 'infographic') {
    // Infographic Data-Card Style
    html = createInfographicDataCardHTML(slide, brand, contentData, dimensions);
  } else {
    html = createSinglePostHTML_New(slide, brand, contentData, dimensions, options);
  }

  await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluateHandle('document.fonts.ready');
  await page.waitForTimeout(500);

  // Output file
  await fs.mkdir(outputPath, { recursive: true });
  const outputFile = path.join(outputPath, '01.png');

  await page.screenshot({
    path: outputFile,
    type: 'png',
    clip: {
      x: 0,
      y: 0,
      width: dimensions.width,
      height: dimensions.height
    }
  });

  console.log(`✅ Single post saved: ${outputFile}`);
  return true;
}

/**
 * Create HTML for new single post format
 */
function createSinglePostHTML_New(slide, brand, globalData, dimensions, options = {}) {
  const { headline, subheadline, content } = slide;

  // Brand-specific styling
  let primaryColor = '#d97757';
  let secondaryColor = '#788c5d';
  let bgColor = '#141413';
  let textColor = '#faf9f5';
  let fontHeadline = "'Poppins', sans-serif";
  let fontBody = "'Lora', serif";

  if (brand.includes('Queen') || brand.includes('Nail')) {
    primaryColor = '#ffffff';
    secondaryColor = '#ffffff';
    bgColor = 'linear-gradient(135deg, #f43f5e 0%, #fbbf24 100%)';
    textColor = '#ffffff';
    fontHeadline = "'Playfair Display', serif";
    fontBody = "'Montserrat', sans-serif";
  }

  const fonts = brand.includes('Queen')
    ? 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700\u0026family=Montserrat:wght@300;400;600\u0026display=swap'
    : 'https://fonts.googleapis.com/css2?family=Lora:wght@400;600\u0026family=Poppins:wght@400;600;800\u0026display=swap';

  // Format content list if array
  let contentHTML = '';
  if (Array.isArray(content)) {
    contentHTML = content.map((item, idx) => `
      <div class="content-item">
        <span class="number">${idx + 1}</span>
        <span>${item}</span>
      </div>
    `).join('');
  } else {
    contentHTML = `<p class="main-content">${content.replace(/\n/g, '<br>')}</p>`;
  }

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link href="${fonts}" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            width: ${dimensions.width}px;
            height: ${dimensions.height}px;
            background: ${bgColor};
            font-family: ${fontBody};
            color: ${textColor};
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 60px;
            position: relative;
            overflow: hidden;
        }

        /* Background decoration */
        body::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -30%;
            width: 800px;
            height: 800px;
            background: radial-gradient(circle, ${primaryColor}15, transparent);
            border-radius: 50%;
        }

        .container {
            max-width: 900px;
            text-align: center;
            position: relative;
            z-index: 1;
        }

        h1 {
            font-family: ${fontHeadline};
            font-size: 72px;
            font-weight: 800;
            line-height: 1.1;
            margin-bottom: 30px;
            color: ${textColor};
            ${brand.includes('Queen') ? 'font-style: italic;' : 'text-transform: uppercase; letter-spacing: 2px;'}
        }

        .subheadline {
            font-size: 32px;
            color: ${primaryColor};
            margin-bottom: 50px;
            font-weight: 600;
        }

        .content-list {
            text-align: left;
            max-width: 800px;
            margin: 0 auto 50px;
        }

        .content-item {
            display: flex;
            align-items: flex-start;
            gap: 20px;
            margin-bottom: 25px;
            font-size: 26px;
            line-height: 1.6;
        }

        .number {
            background: ${primaryColor};
            color: ${bgColor};
            min-width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 20px;
            flex-shrink: 0;
        }

        .main-content {
            font-size: 32px;
            line-height: 1.8;
            margin-bottom: 40px;
        }

        .cta-box {
            background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
            padding: 35px 50px;
            border-radius: 20px;
            margin-top: 50px;
            color: ${bgColor};
            font-size: 26px;
            font-weight: 600;
        }

        .brand-badge {
            position: absolute;
            bottom: 50px;
            right: 60px;
            font-family: ${fontHeadline};
            font-size: 22px;
            color: ${secondaryColor};
            opacity: 0.8;
        }
        
        ${options.bgOnly ? 'h1, .subheadline, .content-list, .main-content, .cta-box { opacity: 0; }' : ''}
    </style>
</head>
<body>
    <div class="container">
        <h1>${headline}</h1>
        ${subheadline ? `<div class="subheadline">${subheadline}</div>` : ''}

        ${Array.isArray(content) ? `<div class="content-list">${contentHTML}</div>` : contentHTML}

        ${slide.type === 'title-cta' ? `<div class="cta-box">Nhắn tin ngay để tìm hiểu thêm</div>` : ''}
    </div>

    <div class="brand-badge">${brand}</div>
</body>
</html>
  `;
}



/**
 * Create HTML for a single slide
 * @param {Object} slideData - Slide data
 * @param {number} slideNumber - Slide number (1-indexed)
 * @param {Object} globalData - Global content data
 * @param {number} totalSlides - Total slide count
 * @param {Object} dimensions - Image dimensions
 */
function createSlideHTML(slideData, slideNumber, globalData, totalSlides = 7, dimensions = { width: 1080, height: 1350 }, options = {}) {
  const { type, headline, subheadline, content, visual } = slideData;
  const brand = globalData.brand || 'Long Best AI';
  const designStyle = globalData.designStyle || 'classic';
  const bgOnly = options.bgOnly || false;
  // Hide main text elements but keep structure/numbers/decorations if possible, or just blank them
  const hideTextCSS = bgOnly ? `
    h1, .content-card p, .content-card li, .cta-box h2, .cta-box p, .slide > p, .glass-overlay h1, .glass-overlay p 
    { opacity: 0 !important; }
    /* Keep numbers visible? User said 'only background', usually implies no text. 
       If they add text, they probably don't want numbers pre-rendered. 
       But for lists, numbers might be part of design. 
       Let's hide everything textual. 
    */
    .slide-number { opacity: 0; } 
    .brand-corner { opacity: 0; }
  ` : '';

  // Brand Configurations
  const BRAND_CONFIGS = {
    'Queen Nail Bern': {
      fonts: [
        'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600&display=swap'
      ],
      cssVars: {
        '--bg-dark': 'linear-gradient(135deg, #f43f5e 0%, #fbbf24 100%)', // Vibrant Pink-Yellow Gradient
        '--bg-light': '#FFF5F8',
        '--accent-primary': '#ffffff',  // White for contrast
        '--accent-secondary': '#ffffff',
        '--text-main': '#ffffff',
        '--text-highlight': '#ffffff',
        '--font-headline': "'Playfair Display', serif",
        '--font-body': "'Montserrat', sans-serif",
        '--corner-text': 'Queen Nail Bern'
      },
      styles: `
        .slide-number {
            background: rgba(232, 180, 200, 0.1);
            color: var(--accent-primary);
            font-family: var(--font-headline);
            font-style: italic;
        }
        .brand-corner {
            color: var(--accent-secondary);
            font-family: var(--font-headline);
            letter-spacing: 1px;
        }
        h1 { text-transform: none; font-style: italic; }
        .prompt-box { border-left: 4px solid var(--accent-primary); background: rgba(255, 245, 248, 0.05); }
        li::before { color: var(--accent-primary); }
      `
    },
    'Long Best AI': {
      fonts: [
        'https://fonts.googleapis.com/css2?family=Lora:wght@400;600&family=Poppins:wght@400;600;800&display=swap'
      ],
      cssVars: {
        '--bg-dark': '#141413',
        '--bg-light': '#faf9f5',
        '--accent-primary': '#d97757',  // Orange
        '--accent-secondary': '#788c5d', // Green
        '--text-main': '#faf9f5',
        '--text-highlight': '#d97757',
        '--font-headline': "'Poppins', sans-serif",
        '--font-body': "'Lora', serif",
        '--corner-text': 'Long Best AI'
      },
      styles: `
        .slide-number {
            background: rgba(217, 119, 87, 0.1);
            color: var(--accent-primary);
            font-family: var(--font-headline);
        }
        .brand-corner {
            color: var(--accent-secondary);
            font-family: var(--font-headline);
        }
        h1 { text-transform: uppercase; letter-spacing: 2px; }
        .prompt-box { border-left: 4px solid var(--accent-primary); background: rgba(250, 249, 245, 0.05); }
        li::before { color: var(--accent-primary); }
      `
    }
  };

  // Fallback to Long Best if brand not found or generic
  let config = BRAND_CONFIGS['Long Best AI'];
  if (brand.includes('Queen') || brand.includes('Nail')) {
    config = BRAND_CONFIGS['Queen Nail Bern'];
  } else if (brand.includes('Thach')) {
    // Thach Vu Land logic
  }




  // Base template
  const html = `
    < !DOCTYPE html >
      <html lang="vi">
        <head>
          <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Slide ${slideNumber}</title>
              <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                  ${config.fonts.map(url => `<link href="${url}" rel="stylesheet">`).join('\n')}
                  <style>
                    :root {
                      --bg - dark: ${config.cssVars['--bg-dark']};
                    --bg-light: ${config.cssVars['--bg-light']};
                    --accent-primary: ${config.cssVars['--accent-primary']};
                    --accent-secondary: ${config.cssVars['--accent-secondary']};
                    --text-main: ${config.cssVars['--text-main']};
                    --text-highlight: ${config.cssVars['--text-highlight']};
                    --font-headline: ${config.cssVars['--font-headline']};
                    --font-body: ${config.cssVars['--font-body']};
        }
                    * {
                      margin: 0;
                    padding: 0;
                    box-sizing: border-box;
        }
                    body {
                      width: ${dimensions.width}px;
                    height: ${dimensions.height}px;
                    background: var(--bg-dark);
                    color: var(--text-main);
                    font-family: var(--font-body);
                    overflow: hidden;
                    position: relative;
        }
                    .slide {
                      width: 100%;
                    height: 100%;
                    padding: 60px;
                    display: flex;
                    flex-direction: column;
                    justify-content: ${type === 'title' || slideNumber >= 2 ? 'center' : 'flex-start'};
                    position: relative;
        }

                    /* Glass overlay effect */
                    .glass-overlay {
                      position: absolute;
                    top: 20px;
                    left: 20px;
                    right: 20px;
                    bottom: 20px;
                    border: 2px solid rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    pointer-events: none;
        }

                    /* Slide number */
                    .slide-number {
                      position: absolute;
                    top: 40px;
                    right: 40px;
                    font-size: ${getFontSize('slideNumber', '24px')};
                    font-weight: 600;
                    padding: 8px 20px;
                    border-radius: 20px;
                    z-index: 100;
        }

                    /* Brand corner */
                    .brand-corner {
                      position: absolute;
                    bottom: 40px;
                    left: 40px;
                    font-size: ${getFontSize('brandCorner', '20px')};
                    font-weight: 600;
                    z-index: 100;
        }

                    /* Typography */
                    h1 {
                      font - family: var(--font-headline);
                    font-size: ${type === 'title' ? getFontSize('h1Title', '72px') : getFontSize('h1Content', '56px')};
                    font-weight: 800;
                    line-height: 1.2;
                    margin-bottom: 30px;
                    color: var(--text-main);
        }

                    h2 {
                      font - family: var(--font-headline);
                    font-size: ${getFontSize('h2', '36px')};
                    font-weight: 600;
                    margin-bottom: 20px;
                    color: var(--accent-primary);
        }

                    .subheadline {
                      font - size: ${getFontSize('subheadline', '28px')};
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 40px;
                    line-height: 1.4;
        }

                    .content {
                      font - size: ${getFontSize('content', '24px')};
                    line-height: 1.8;
                    color: var(--text-main);
        }

                    /* Content list */
                    ul {
                      list - style: none;
                    margin: 20px 0;
                    counter-reset: list-counter; /* Initialize counter */
        }

                    li {
                      font - size: ${getFontSize('listItem', '26px')};
                    line-height: 1.6;
                    margin-bottom: 20px;
                    padding-left: 45px; /* More space for numbers */
                    position: relative;
        }

                    li::before {
                      content: counter(list-counter) "."; /* Use number */
                    counter-increment: list-counter; /* Increment counter */
                    position: absolute;
                    left: 0;
                    font-weight: 600;
                    font-size: ${getFontSize('listItem', '26px')};
        }

                    /* Prompt box */
                    .prompt-box {
                      padding: 30px;
                    margin: 30px 0;
                    font-family: 'Courier New', monospace;
                    font-size: ${getFontSize('promptBox', '22px')};
                    line-height: 1.6;
                    border-radius: 8px;
        }

                    /* CTA section */
                    .cta {
                      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
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
                      color: var(--accent-primary);
                    font-weight: 600;
        }

                    /* Custom Brand Styles */
                    ${config.styles}

        /* NEW LAYOUTS: Comparison */
                    .comparison-container {
                      display: flex;
                    gap: 40px;
                    width: 100%;
                    margin-top: 20px;
        }
                    .comp-column {
                      flex: 1;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 20px;
                    padding: 30px;
        }
                    .comp-header {
                      font - family: var(--font-headline);
                    font-size: 32px;
                    color: var(--accent-primary);
                    text-align: center;
                    margin-bottom: 30px;
                    padding-bottom: 15px;
                    border-bottom: 2px solid var(--accent-secondary);
        }
                    .comp-item {
                      font - size: 24px;
                    margin-bottom: 20px;
                    line-height: 1.5;
                    padding-bottom: 15px;
                    border-bottom: 1px dashed rgba(255,255,255,0.1);
        }
                    .comp-item:last-child {border - bottom: none; }

                    /* NEW LAYOUTS: Process */
                    .process-container {
                      display: flex;
                    flex-direction: column;
                    gap: 25px;
                    margin-top: 20px;
        }
                    .process-step {
                      display: flex;
                    gap: 25px;
                    background: rgba(255,255,255,0.03);
                    padding: 25px;
                    border-radius: 16px;
                    align-items: flex-start;
                    border-left: 4px solid var(--accent-primary);
        }
                    .step-number {
                      font - family: var(--font-headline);
                    font-size: 48px;
                    font-weight: 800;
                    color: var(--accent-secondary);
                    opacity: 0.8;
                    line-height: 1;
                    min-width: 60px;
        }
                    .step-content h3 {
                      font - family: var(--font-headline);
                    font-size: 28px;
                    color: var(--accent-primary);
                    margin-bottom: 8px;
        }
                    .step-content p {
                      font - size: 22px;
                    line-height: 1.5;
        }

                    ${hideTextCSS}
                  </style>
                </head>
                <body>
                  <div class="slide">
                    <div class="glass-overlay"></div>
                    <div class="slide-number">${slideNumber}/${totalSlides}</div>

                    ${renderSlideContent(type, slideData)}

                    <div class="brand-corner">${config.cssVars['--corner-text']}</div>
        </div>
                  </div >
                </body >
              </html >
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
  < h1 > ${headline}</h1 >
    ${subheadline ? `<p class="subheadline">${subheadline}</p>` : ''}
`;

    case 'content':
      return `
  < h2 > ${headline}</h2 >
    <div class="content">${formatContent(content)}</div>
`;

    case 'list':
      return `
  < h2 > ${headline}</h2 >
    <ul>${content.map(item => `<li>${item}</li>`).join('')}</ul>
`;

    case 'prompt':
      return `
  < h2 > ${headline}</h2 >
    ${subheadline ? `<p class="subheadline">${subheadline}</p>` : ''}
<div class="prompt-box">${content}</div>
`;

    case 'cta':
      return `
  < div class="cta" >
    <h2>${headline}</h2>
                ${data.visual ? `<img src="${data.visual}" class="cta-image" style="width:100%; height:300px; object-fit:cover; border-radius:12px; margin-bottom:20px;"/>` : ''}
<p>${formatContent(content)}</p>
              </div >
  `;

    case 'comparison':
      return `
              ${headline ? `<h2>${headline}</h2>` : ''}
<div class="comparison-container">
  <div class="comp-column">
    <div class="comp-header">${data.leftTitle || 'Option A'}</div>
    ${data.items.map(item => `
                        <div class="comp-item">${item.left}</div>
                    `).join('')}
  </div>
  <div class="comp-column">
    <div class="comp-header">${data.rightTitle || 'Option B'}</div>
    ${data.items.map(item => `
                        <div class="comp-item">${item.right}</div>
                    `).join('')}
  </div>
</div>
`;

    case 'process':
      return `
              ${headline ? `<h2>${headline}</h2>` : ''}
<div class="process-container">
  ${data.steps.map(step => `
                    <div class="process-step">
                        <div class="step-number">${String(step.number).padStart(2, '0')}</div>
                        <div class="step-content">
                            <h3>${step.title}</h3>
                            <p>${step.desc}</p>
                        </div>
                    </div>
                `).join('')}
</div>
`;

    default:
      return `< div class="content" > ${content}</div > `;
  }
}

/**
 * Format content text (preserve line breaks, etc.)
 */
function formatContent(content) {
  if (Array.isArray(content)) {
    return content.join('<br><br>');
  }

  // Replace emoji bullets with simple dashes
  let cleaned = content; // Removed emoji replacement logic per user request

  return cleaned.replace(/\n/g, '<br>');
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
    return `${TYPOGRAPHY_CONFIG.fontSizes[key].value} px`;
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

    // Check for bg-only flag
    const bgOnly = args.includes('--bg-only');
    if (bgOnly) console.log('👻 Background-only mode detected (No Text)');

    // Generate carousel
    await generateCarousel(contentData, outputDir, { bgOnly });

    // Copy content.json to output directory for metadata/publishing
    const destinationPath = path.join(outputDir, 'content.json');
    await fs.copyFile(contentFile, destinationPath);
    console.log(`✓ Copied content.json to ${outputDir} `);

    console.log(`\n✨ Success! Images saved to: ${outputDir} `);

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

/**
 * Create HTML for Head Silhouette Infographic Style
 */
function createHeadSilhouetteHTML(data, dimensions, options = {}) {
  const { topic, slides } = data;
  const slide = slides[0];
  const bgOnly = options.bgOnly;
  const extraCSS = bgOnly ? `
h1, .subtitle, .segment h3, .segment p, .tools, .big - number { opacity: 0!important; }
` : '';

  // Colors for segments
  const colors = [
    '#BDD7EE', // s1 - Blue
    '#A9D18E', // s2 - Green
    '#F8CBAD', // s3 - Red/Pink tone
    '#FFE699', // s4 - Yellow
    '#C5E0B4', // s5 - Mint
    '#DEEBF7'  // s6 - Light Purple
  ];

  // Parse content items
  let items = [];
  if (Array.isArray(slide.content)) {
    items = slide.content.map(item => {
      // Expect format: "Title: Description (Tools: ...)"
      // Or simple string
      const titleMatch = item.match(/^([^:]+):/);
      const title = titleMatch ? titleMatch[1].trim() : item;

      const toolsMatch = item.match(/\(Tools: (.*)\)/i);
      const tools = toolsMatch ? toolsMatch[1].trim() : '';

      let desc = item.replace(title + ':', '').replace(/\(Tools: .*\)/i, '').trim();
      if (!titleMatch) desc = '';

      return { title, desc, tools };
    });
  }

  // Ensure 6 items
  while (items.length < 6) {
    items.push({ title: 'Slot ' + (items.length + 1), desc: 'Content pending...', tools: '' });
  }

  return `
  < !DOCTYPE html >
    <html>
      <head>
        <meta charset="UTF-8">
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet">
            <style>
              :root {
                --color - 1: ${colors[0]};
              --color-2: ${colors[1]};
              --color-3: ${colors[2]};
              --color-4: ${colors[3]};
              --color-5: ${colors[4]};
              --color-6: ${colors[5]};
              --text-dark: #0A3D23;
        }

              * {margin: 0; padding: 0; box-sizing: border-box; }

              body {
                width: ${dimensions.width}px;
              height: ${dimensions.height}px;
              background: white;
              font-family: 'Poppins', sans-serif;
              color: black;
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 40px;
              overflow: hidden;
        }

              .header {
                text - align: center;
              margin-bottom: 20px;
              position: relative;
              z-index: 10;
        }

              .big-number {
                font - size: 280px;
              font-weight: 800;
              line-height: 0.8;
              color: #0A3D23;
              position: absolute;
              left: -200px;
              top: -20px;
        }

              .title-group {margin - left: 20px; }

              h1 {
                font - size: 80px;
              font-weight: 800;
              color: #0A3D23;
              text-transform: uppercase;
              letter-spacing: 2px;
              line-height: 1;
        }

              .subtitle {
                font - size: 45px;
              font-weight: 800;
              color: #0A3D23;
              text-transform: uppercase;
        }

              .silhouette-container {
                position: relative;
              width: 800px;
              height: 950px;
              margin-top: 20px;
        }

              .segment {
                position: absolute;
              z-index: 2;
              padding: 20px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              text-align: center;
        }

              .s1 {top: 0%; left: 0%; width: 100%; height: 25%; background: var(--color-1); border-radius: 400px 400px 20px 20px; clip-path: ellipse(50% 100% at 50% 100%); }
              .s2 {top: 26%; left: 0%; width: 49%; height: 25%; background: var(--color-2); border-radius: 20px; }
              .s3 {top: 26%; right: 0%; width: 49%; height: 25%; background: var(--color-3); border-radius: 20px; }
              .s4 {top: 52%; left: 10%; width: 45%; height: 20%; background: var(--color-4); border-radius: 20px; }
              .s5 {top: 52%; right: 0%; width: 43%; height: 25%; background: var(--color-5); border-radius: 20px; }
              .s6 {bottom: 0%; left: 20%; width: 60%; height: 25%; background: var(--color-6); border-radius: 20px 20px 400px 400px; }

              .segment h3 {font - size: 28px; font-weight: 800; margin-bottom: 5px; }
              .segment p {font - size: 18px; line-height: 1.2; font-weight: 600; margin-bottom: 5px; }
              .tools {font - size: 16px; font-weight: 800; display: flex; align-items: center; gap: 5px; color: #333; }

              .avatar-circle {
                position: absolute;
              top: 45%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 120px;
              height: 120px;
              background: white;
              border-radius: 50%;
              border: 8px solid #8CCB9F;
              z-index: 10;
              overflow: hidden;
        }
              .avatar-circle img {width: 100%; height: 100%; object-fit: cover; }
              ${extraCSS}
            </style>
          </head>
          <body>
            <div class="header">
              <div class="big-number">6</div>
              <div class="title-group">
                <h1>${topic.replace(/Start.*Top/i, 'TOP').split(' ').slice(0, 3).join(' ') || 'TOP AI SKILL'}</h1>
                <div class="subtitle">FOR SUCCESS IN 2026</div>
              </div>
            </div>

            <div class="silhouette-container">
              <!-- Segment 1 -->
              <div class="segment s1">
                <h3>1. ${items[0].title}</h3>
                <p>${items[0].desc}</p>
                ${items[0].tools ? `<div class="tools">Tools: ${items[0].tools}</div>` : ''}
              </div>

              <!-- Segment 2 -->
              <div class="segment s2" style="height: 30%; top: 22%; left: 5%; width: 40%; border-radius: 50% 0 0 50%;">
                <h3>2. ${items[1].title}</h3>
                <p>${items[1].desc}</p>
                ${items[1].tools ? `<div class="tools">Tools: ${items[1].tools}</div>` : ''}
              </div>

              <!-- Segment 3 -->
              <div class="segment s3" style="height: 35%; top: 22%; right: 5%; width: 45%; border-radius: 0 50% 50% 0%;">
                <h3>3. ${items[2].title}</h3>
                <p>${items[2].desc}</p>
                ${items[2].tools ? `<div class="tools">Tools: ${items[2].tools}</div>` : ''}
              </div>

              <!-- Segment 4 -->
              <div class="segment s4" style="top: 53%; left: 10%; width: 45%; border-radius: 50% 0 0 50%;">
                <h3>4. ${items[3].title}</h3>
                <p>${items[3].desc}</p>
                ${items[3].tools ? `<div class="tools">Tools: ${items[3].tools}</div>` : ''}
              </div>

              <!-- Segment 5 -->
              <div class="segment s5" style="top: 58%; right: 5%; width: 40%; border-radius: 0 30% 60% 0%;">
                <h3>5. ${items[4].title}</h3>
                <p>${items[4].desc}</p>
                ${items[4].tools ? `<div class="tools">Tools: ${items[4].tools}</div>` : ''}
              </div>

              <!-- Segment 6 -->
              <div class="segment s6" style="bottom: 5%; left: 25%; width: 55%; border-radius: 0 0 50% 50%;">
                <h3>6. ${items[5].title}</h3>
                <p>${items[5].desc}</p>
                ${items[5].tools ? `<div class="tools">Tools: ${items[5].tools}</div>` : ''}
              </div>

              <div class="avatar-circle">
                <img src="https://ca.slack-edge.com/T0266FRGM-U0266FRGQ-g6b0b2b8b9b0-512" alt="Avatar">
              </div>
            </div>
          </body>
        </html>
        `;
}

/**
 * Generate Infographic Carousel - Multiple slides with infographic style
 */
async function generateInfographicCarousel(contentData, outputPath, page, dimensions, options = {}) {
  console.log('✨ Generating infographic carousel...');

  const slides = contentData.slides;
  const brand = contentData.brand || 'Long Best AI';
  const slideCount = slides.length;

  for (let i = 0; i < slideCount; i++) {
    const slideNum = String(i + 1).padStart(2, '0');
    console.log(`📸 Generating infographic slide ${slideNum}...`);

    const html = createInfographicSlideHTML(slides[i], i + 1, slideCount, brand, contentData, dimensions);

    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.evaluateHandle('document.fonts.ready');
    await page.waitForTimeout(500);

    const outputFile = path.join(outputPath, `${slideNum}.png`);
    await page.screenshot({
      path: outputFile,
      type: 'png',
      clip: { x: 0, y: 0, width: dimensions.width, height: dimensions.height }
    });

    console.log(`✅ Slide ${slideNum} saved: ${outputFile}`);
  }

  console.log('🎉 Infographic carousel generated successfully!');
  return true;
}

/**
 * Create HTML for individual infographic slide based on slide type
 */
function createInfographicSlideHTML(slide, slideNumber, totalSlides, brand, globalData, dimensions) {
  const slideType = slide.type || 'content';

  // Brand-specific colors
  const brandColors = {
    'Long Best AI': {
      headerBg: '#000000',
      headerText: '#FFFFFF',
      accentColor: '#d97757',
      footerBg: '#000000',
      footerText: '#FFFFFF',
      bodyBg: '#F5F5F0',
      numberBg: '#000000'
    },
    'Thach Vu Land': {
      headerBg: '#000000',
      headerText: '#FFFFFF',
      accentColor: '#000000',
      footerBg: '#000000',
      footerText: '#FFFFFF',
      bodyBg: '#F5F5F0',
      numberBg: '#000000'
    },
    'Queen Nail Bern': {
      headerBg: '#8B2252',
      headerText: '#FFFFFF',
      accentColor: '#E91E63',
      footerBg: '#8B2252',
      footerText: '#FFFFFF',
      bodyBg: 'linear-gradient(135deg, #FFF5F8 0%, #FFB6D9 50%, #FF69B4 100%)',
      numberBg: '#8B2252'
    }
  };

  let colors = brandColors['Long Best AI'];
  if (brand.includes('Thach')) {
    colors = brandColors['Thach Vu Land'];
  } else if (brand.includes('Queen') || brand.includes('Nail')) {
    colors = brandColors['Queen Nail Bern'];
  }

  // Generate content based on slide type
  let contentHTML = '';

  switch (slideType) {
    case 'title':
      contentHTML = generateTitleSlideContent(slide, colors);
      break;
    case 'list':
      contentHTML = generateListSlideContent(slide, colors);
      break;
    case 'comparison':
      contentHTML = generateComparisonSlideContent(slide, colors);
      break;
    case 'process':
      contentHTML = generateProcessSlideContent(slide, colors);
      break;
    case 'cta':
      contentHTML = generateCtaSlideContent(slide, colors, brand);
      break;
    default: // 'content'
      contentHTML = generateContentSlideContent(slide, colors);
  }

  // Footer contact based on brand
  let footerContact = brand.toUpperCase();
  if (brand.includes('Queen') || brand.includes('Nail')) {
    footerContact = 'QUEENNAILBERN.COM';
  } else if (brand.includes('Thach')) {
    footerContact = 'THACHVULAND.COM';
  } else if (brand.includes('Long')) {
    footerContact = 'LONG BEST AI';
  }

  return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
              <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
                <style>
                  * {margin: 0; padding: 0; box-sizing: border-box; }

                  body {
                    width: ${dimensions.width}px;
                  height: ${dimensions.height}px;
                  background: ${colors.bodyBg};
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                  color: #000000;
                  display: flex;
                  flex-direction: column;
                  overflow: hidden;
        }

                  .header {
                    background: ${colors.headerBg};
                  color: ${colors.headerText};
                  padding: 30px 50px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
        }

                  .brand-label {
                    font - size: 14px;
                  font-weight: 600;
                  letter-spacing: 2px;
                  text-transform: uppercase;
        }

                  .slide-indicator {
                    font - size: 14px;
                  font-weight: 500;
                  opacity: 0.8;
        }

                  .content {
                    flex: 1;
                  padding: 50px;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
        }

                  .headline {
                    font - size: 52px;
                  font-weight: 900;
                  line-height: 1.1;
                  margin-bottom: 24px;
                  letter-spacing: -1px;
                  color: #000;
        }

                  .subheadline {
                    font - size: 22px;
                  font-weight: 400;
                  color: #444;
                  line-height: 1.5;
                  margin-bottom: 40px;
        }

                  .paragraph {
                    font - size: 20px;
                  line-height: 1.7;
                  color: #333;
        }

                  .numbered-list {
                    list - style: none;
                  display: flex;
                  flex-direction: column;
                  gap: 24px;
        }

                  .list-item {
                    display: flex;
                  align-items: flex-start;
                  gap: 20px;
                  font-size: 20px;
                  line-height: 1.5;
        }

                  .number {
                    background: ${colors.numberBg};
                  color: white;
                  min-width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: 700;
                  font-size: 18px;
                  flex-shrink: 0;
        }

                  .list-content {
                    flex: 1;
        }

                  .list-title {
                    font - weight: 700;
                  color: #000;
                  margin-bottom: 4px;
        }

                  .list-desc {
                    color: #555;
                  font-size: 18px;
        }

                  /* Comparison styles */
                  .comparison-grid {
                    display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 30px;
                  margin-top: 30px;
        }

                  .comparison-column {
                    background: white;
                  border-radius: 12px;
                  padding: 30px;
                  border: 2px solid #E0E0E0;
        }

                  .comparison-column.left {
                    border - color: #ff6b6b;
        }

                  .comparison-column.right {
                    border - color: #51cf66;
        }

                  .column-title {
                    font - size: 20px;
                  font-weight: 700;
                  margin-bottom: 20px;
                  padding-bottom: 15px;
                  border-bottom: 2px solid currentColor;
        }

                  .comparison-column.left .column-title {color: #ff6b6b; }
                  .comparison-column.right .column-title {color: #51cf66; }

                  .comparison-items {
                    display: flex;
                  flex-direction: column;
                  gap: 16px;
        }

                  .comparison-item {
                    font - size: 17px;
                  line-height: 1.5;
        }

                  /* Process/Steps styles */
                  .steps-container {
                    display: flex;
                  flex-direction: column;
                  gap: 30px;
                  margin-top: 30px;
        }

                  .step-item {
                    display: flex;
                  align-items: flex-start;
                  gap: 24px;
                  background: white;
                  padding: 24px 30px;
                  border-radius: 12px;
                  border-left: 4px solid ${colors.accentColor};
        }

                  .step-number {
                    background: ${colors.numberBg};
                  color: white;
                  min-width: 48px;
                  height: 48px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: 800;
                  font-size: 20px;
                  flex-shrink: 0;
        }

                  .step-content h3 {
                    font - size: 22px;
                  font-weight: 700;
                  margin-bottom: 8px;
        }

                  .step-content p {
                    font - size: 17px;
                  color: #555;
                  line-height: 1.5;
        }

                  /* CTA styles */
                  .cta-container {
                    text - align: center;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  gap: 30px;
        }

                  .cta-headline {
                    font - size: 56px;
                  font-weight: 900;
                  line-height: 1.1;
                  color: #000;
        }

                  .cta-subheadline {
                    font - size: 22px;
                  color: #444;
                  max-width: 800px;
                  line-height: 1.6;
        }

                  .cta-button {
                    background: ${colors.numberBg};
                  color: white;
                  padding: 20px 50px;
                  border-radius: 50px;
                  font-size: 20px;
                  font-weight: 700;
                  margin-top: 20px;
        }

                  .footer {
                    background: ${colors.footerBg};
                  color: ${colors.footerText};
                  padding: 24px 50px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
        }

                  .footer-contact {
                    font - size: 16px;
                  font-weight: 600;
                  letter-spacing: 1px;
        }

                  .footer-page {
                    font - size: 14px;
                  opacity: 0.8;
        }

                  /* Stats grid for title slides */
                  .stats-grid {
                    display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 20px;
                  margin-top: 40px;
        }

                  .stat-box {
                    background: white;
                  border: 2px solid #E0E0E0;
                  padding: 24px;
                  border-radius: 10px;
        }

                  .stat-label {
                    font - size: 13px;
                  font-weight: 600;
                  letter-spacing: 1px;
                  text-transform: uppercase;
                  color: #666;
                  margin-bottom: 8px;
        }

                  .stat-value {
                    font - size: 32px;
                  font-weight: 800;
                  color: #000;
        }
                </style>
              </head>
              <body>
                <div class="header">
                  <div class="brand-label">${brand.toUpperCase()}</div>
                  <div class="slide-indicator">${slideNumber}/${totalSlides}</div>
                </div>

                <div class="content">
                  ${contentHTML}
                </div>

                <div class="footer">
                  <div class="footer-contact">${footerContact}</div>
                  <div class="footer-page">Slide ${slideNumber} of ${totalSlides}</div>
                </div>
              </body>
            </html>
            `;
}

// Helper functions for slide content generation
function generateTitleSlideContent(slide, colors) {
  let statsHTML = '';
  if (slide.stats && Array.isArray(slide.stats)) {
    statsHTML = `<div class="stats-grid">${slide.stats.map(stat => `
      <div class="stat-box">
        <div class="stat-label">${stat.label}</div>
        <div class="stat-value">${stat.value}</div>
      </div>
    `).join('')}</div>`;
  }

  return `
            <h1 class="headline">${slide.headline || ''}</h1>
            <p class="subheadline">${slide.subheadline || ''}</p>
            ${statsHTML}
            `;
}

function generateContentSlideContent(slide, colors) {
  const content = typeof slide.content === 'string' ? slide.content :
    (Array.isArray(slide.content) ? slide.content.join('<br><br>') : '');

  return `
              <h1 class="headline">${slide.headline || ''}</h1>
              <p class="paragraph">${content}</p>
              `;
}

function generateListSlideContent(slide, colors) {
  const items = Array.isArray(slide.content) ? slide.content : [];

  const listHTML = items.map((item, idx) => {
    // Parse item - could be "Title - Description" or just text
    const parts = item.split(' - ');
    const title = parts[0];
    const desc = parts.length > 1 ? parts.slice(1).join(' - ') : '';

    return `
              <li class="list-item">
                <div class="number">${idx + 1}</div>
                <div class="list-content">
                  <div class="list-title">${title}</div>
                  ${desc ? `<div class="list-desc">${desc}</div>` : ''}
                </div>
              </li>
              `;
  }).join('');

  return `
              <h1 class="headline">${slide.headline || ''}</h1>
              <ul class="numbered-list">${listHTML}</ul>
              `;
}

function generateComparisonSlideContent(slide, colors) {
  const items = slide.items || [];

  const leftItems = items.map(item => `<div class="comparison-item">${item.left}</div>`).join('');
  const rightItems = items.map(item => `<div class="comparison-item">${item.right}</div>`).join('');

  return `
              <h1 class="headline">${slide.headline || ''}</h1>
              <div class="comparison-grid">
                <div class="comparison-column left">
                  <div class="column-title">${slide.leftTitle || 'Không có'}</div>
                  <div class="comparison-items">${leftItems}</div>
                </div>
                <div class="comparison-column right">
                  <div class="column-title">${slide.rightTitle || 'Có'}</div>
                  <div class="comparison-items">${rightItems}</div>
                </div>
              </div>
              `;
}

function generateProcessSlideContent(slide, colors) {
  const steps = slide.steps || [];

  const stepsHTML = steps.map(step => `
              <div class="step-item">
                <div class="step-number">${step.number}</div>
                <div class="step-content">
                  <h3>${step.title}</h3>
                  <p>${step.desc || ''}</p>
                </div>
              </div>
              `).join('');

  return `
              <h1 class="headline">${slide.headline || ''}</h1>
              <div class="steps-container">${stepsHTML}</div>
              `;
}

function generateCtaSlideContent(slide, colors, brand) {
  return `
              <div class="cta-container">
                <h1 class="cta-headline">${slide.headline || ''}</h1>
                <p class="cta-subheadline">${slide.subheadline || ''}</p>
                <div class="cta-button">${slide.content || 'Liên hệ ngay'}</div>
              </div>
              `;
}


/**
 * Create HTML for Infographic Data-Card Style
 * Professional real estate / data presentation style
 */
function createInfographicDataCardHTML(slide, brand, globalData, dimensions) {
  const { headline, subheadline, content } = slide;

  // Brand-specific colors
  const brandColors = {
    'Thach Vu Land': {
      headerBg: '#000000',
      headerText: '#FFFFFF',
      accentColor: '#000000',
      footerBg: '#000000',
      footerText: '#FFFFFF'
    },
    'Long Best AI': {
      headerBg: '#141413',
      headerText: '#faf9f5',
      accentColor: '#d97757',
      footerBg: '#141413',
      footerText: '#faf9f5'
    },
    'Queen Nail Bern': {
      headerBg: '#8B2252',
      headerText: '#FFFFFF',
      accentColor: '#E91E63',
      footerBg: '#8B2252',
      footerText: '#FFFFFF',
      bodyBg: 'linear-gradient(135deg, #FFF5F8 0%, #FFB6D9 50%, #FF69B4 100%)'
    }
  };

  // Get brand config or default to Thach Vu Land
  let colors = brandColors['Thach Vu Land'];
  if (brand.includes('Long Best')) {
    colors = brandColors['Long Best AI'];
  } else if (brand.includes('Queen') || brand.includes('Nail')) {
    colors = brandColors['Queen Nail Bern'];
  }

  // Parse stats from slide data
  let statsHTML = '';
  if (slide.stats && Array.isArray(slide.stats)) {
    statsHTML = slide.stats.map(stat => `
      <div class="stat-box">
        <div class="stat-label">${stat.label}</div>
        <div class="stat-value">${stat.value}</div>
      </div>
    `).join('');
  } else {
    // Default stats if not provided
    statsHTML = `
      <div class="stat-box">
        <div class="stat-label">METRIC 1</div>
        <div class="stat-value">--</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">METRIC 2</div>
        <div class="stat-value">--</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">METRIC 3</div>
        <div class="stat-value">--</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">METRIC 4</div>
        <div class="stat-value">--</div>
      </div>
    `;
  }

  // Parse highlights from content
  let highlightsHTML = '';
  let highlightsTitle = 'ĐIỂM NỔI BẬT';

  if (Array.isArray(content)) {
    highlightsHTML = content.slice(0, 5).map((item, idx) => `
      <li class="highlight-item">
        <div class="highlight-number">${idx + 1}</div>
        <div>${item}</div>
      </li>
    `).join('');
  } else if (slide.highlights && Array.isArray(slide.highlights)) {
    highlightsHTML = slide.highlights.slice(0, 5).map((item, idx) => `
      <li class="highlight-item">
        <div class="highlight-number">${idx + 1}</div>
        <div>${item}</div>
      </li>
    `).join('');
  }

  // Footer info
  const footerInfo = slide.footer || globalData.footer || 'Thông tin dự án';

  // Brand-specific contact info
  let footerContact = '';
  if (brand.includes('Queen') || brand.includes('Nail')) {
    footerContact = `
      <div class="contact-item">
        <span>+41 79 805 00 68</span>
      </div>
      <div class="contact-item">
        <span>QUEENNAILBERN.COM</span>
      </div>
    `;
  } else if (brand.includes('Thach')) {
    footerContact = `
      <div class="contact-item">
        <span>0903.469.888</span>
      </div>
      <div class="contact-item">
        <span>THACHVULAND.COM</span>
      </div>
    `;
  } else {
    footerContact = `
      <div class="contact-item">
        <span>${brand.toUpperCase()}</span>
      </div>
    `;
  }

  return `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="UTF-8">
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
                      <style>
                        * {
                          margin: 0;
                        padding: 0;
                        box-sizing: border-box;
        }

                        body {
                          width: ${dimensions.width}px;
                        height: ${dimensions.height}px;
                        background: ${colors.bodyBg || '#F5F5F0'};
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                        color: #000000;
                        display: flex;
                        flex-direction: column;
                        overflow: hidden;
        }

                        /* Header Section */
                        .header {
                          background: ${colors.headerBg};
                        color: ${colors.headerText};
                        padding: 40px 50px;
                        min-height: 160px;
        }

                        .brand-label {
                          font - size: 14px;
                        font-weight: 500;
                        letter-spacing: 2px;
                        text-transform: uppercase;
                        opacity: 0.8;
                        margin-bottom: 12px;
        }

                        .main-title {
                          font - size: 48px;
                        font-weight: 800;
                        line-height: 1.1;
                        margin-bottom: 8px;
                        letter-spacing: -0.5px;
        }

                        .subtitle {
                          font - size: 18px;
                        font-weight: 400;
                        opacity: 0.9;
                        line-height: 1.4;
        }

                        /* Main Content */
                        .content {
                          flex: 1;
                        padding: 50px;
                        display: flex;
                        flex-direction: column;
                        gap: 40px;
        }

                        /* Stats Grid */
                        .stats-grid {
                          display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 20px;
        }

                        .stat-box {
                          background: white;
                        border: 2px solid #E0E0E0;
                        padding: 30px;
                        border-radius: 8px;
                        transition: all 0.2s;
        }

                        .stat-box:hover {
                          border - color: ${colors.accentColor};
                        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

                        .stat-label {
                          font - size: 13px;
                        font-weight: 600;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                        color: #666;
                        margin-bottom: 8px;
        }

                        .stat-value {
                          font - size: 36px;
                        font-weight: 800;
                        color: #000;
                        letter-spacing: -0.5px;
        }

                        /* Highlights Section */
                        .highlights-section {
                          flex: 1;
        }

                        .section-title {
                          font - size: 14px;
                        font-weight: 700;
                        letter-spacing: 2px;
                        text-transform: uppercase;
                        margin-bottom: 20px;
                        padding-bottom: 12px;
                        border-bottom: 2px solid #E0E0E0;
        }

                        .highlights-list {
                          list - style: none;
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
        }

                        .highlight-item {
                          display: flex;
                        align-items: flex-start;
                        gap: 16px;
                        font-size: 16px;
                        line-height: 1.6;
                        color: #333;
        }

                        .highlight-number {
                          background: #000;
                        color: white;
                        min-width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: 700;
                        font-size: 14px;
                        flex-shrink: 0;
        }

                        /* Footer */
                        .footer {
                          background: ${colors.footerBg};
                        color: ${colors.footerText};
                        padding: 30px 50px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
        }

                        .footer-info {
                          font - size: 14px;
                        line-height: 1.6;
        }

                        .footer-contact {
                          display: flex;
                        gap: 30px;
                        font-size: 14px;
                        font-weight: 600;
        }

                        .contact-item {
                          display: flex;
                        align-items: center;
                        gap: 8px;
        }

                        .contact-icon {
                          font - size: 16px;
        }
                      </style>
                    </head>
                    <body>
                      <!-- Header -->
                      <div class="header">
                        <div class="brand-label">${brand.toUpperCase()}</div>
                        <h1 class="main-title">${headline}</h1>
                        <p class="subtitle">${subheadline || ''}</p>
                      </div>

                      <!-- Main Content -->
                      <div class="content">
                        <!-- Stats Grid -->
                        <div class="stats-grid">
                          ${statsHTML}
                        </div>

                        <!-- Highlights -->
                        <div class="highlights-section">
                          <h2 class="section-title">${highlightsTitle}</h2>
                          <ul class="highlights-list">
                            ${highlightsHTML}
                          </ul>
                        </div>
                      </div>

                      <!-- Footer -->
                      <div class="footer">
                        <div class="footer-info">${footerInfo}</div>
                        <div class="footer-contact">
                          ${footerContact}
                        </div>
                      </div>
                    </body>
                  </html>
                  `;
}



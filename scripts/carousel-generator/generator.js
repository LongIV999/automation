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
      deviceScaleFactor: 3 // Higher density for crispness
    });

    // Set default timeout
    await page.setDefaultNavigationTimeout(CONFIG.timeout);

    // Create output directory
    await fs.mkdir(outputPath, { recursive: true });

    // Check for single-post style
    if (contentData.designStyle === 'notebook-typography') {
      return await generateSingleImage(contentData, outputPath);
    }

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
 * Generate a single summarized image (Infographic/Typography style)
 */
async function generateSingleImage(contentData, outputPath) {
  console.log('🚀 Starting single-post generation (Typography Style)...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });

  try {
    const page = await browser.newPage();

    // Set viewport to Infographic size (Long Vertical)
    // 1080px width, dynamic height strategy or fixed tall aspect
    const width = 1080;
    const height = 1920; // 9:16 Story/Infographic ratio

    await page.setViewport({
      width: width,
      height: height,
      deviceScaleFactor: 2
    });

    const html = createSinglePostHTML(contentData);

    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.evaluateHandle('document.fonts.ready');

    // Output file
    await fs.mkdir(outputPath, { recursive: true });
    const outputFile = path.join(outputPath, '01.png');

    await page.screenshot({
      path: outputFile,
      type: 'png',
      fullPage: true // Capture full height if it exceeds viewport
    });

    console.log(`✅ Single post saved: ${outputFile}`);
    return true;

  } catch (error) {
    console.error('❌ Error generating single post:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

/**
 * Create HTML for Single Post Typography Style
 */
function createSinglePostHTML(data) {
  const { brand, topic, slides } = data;

  // Extract sections
  const titleSlide = slides.find(s => s.type === 'title') || slides[0];
  const contentSlides = slides.filter(s => s.type === 'content' || s.type === 'list' || s.type === 'prompt');
  const ctaSlide = slides.find(s => s.type === 'cta') || slides[slides.length - 1];

  // CSS Variables for NotebookLM Style
  const cssVars = {
    '--bg-color': '#F0F2F5',
    '--card-bg': '#ffffff',
    '--primary': '#1A73E8',
    '--text-dark': '#202124',
    '--text-gray': '#5f6368',
    '--font-main': "'Roboto', sans-serif",
    '--font-mono': "'Roboto Mono', monospace"
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&family=Roboto+Mono:wght@500&display=swap" rel="stylesheet">
        <style>
            body {
                margin: 0;
                padding: 0;
                background-color: ${cssVars['--bg-color']};
                font-family: ${cssVars['--font-main']};
                color: ${cssVars['--text-dark']};
                width: 1080px;
                box-sizing: border-box;
                background-image: radial-gradient(#E5E7EB 2px, transparent 2px);
                background-size: 30px 30px;
                padding: 60px;
            }

            .container {
                display: flex;
                flex-direction: column;
                gap: 40px;
            }

            /* Header Section */
            .header-card {
                background: linear-gradient(135deg, white 0%, #F8F9FA 100%);
                padding: 60px;
                border-radius: 32px;
                border: 1px solid rgba(0,0,0,0.05);
                box-shadow: 0 4px 20px rgba(0,0,0,0.03);
            }

            .brand-badge {
                font-family: ${cssVars['--font-mono']};
                color: ${cssVars['--text-gray']};
                font-size: 20px;
                letter-spacing: 1px;
                text-transform: uppercase;
                margin-bottom: 24px;
                display: block;
            }

            h1 {
                font-size: 72px;
                line-height: 1.1;
                margin: 0 0 24px 0;
                color: ${cssVars['--primary']}; 
                background: linear-gradient(45deg, #1A73E8, #4285F4);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .subtitle {
                font-size: 32px;
                color: ${cssVars['--text-gray']};
                line-height: 1.5;
            }

            /* Main Content Grid */
            .content-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 30px;
            }

            .section-card {
                background: white;
                padding: 50px;
                border-radius: 24px;
                border: 1px solid rgba(0,0,0,0.05);
                box-shadow: 0 2px 8px rgba(0,0,0,0.02);
            }

            h2 {
                font-size: 40px;
                margin: 0 0 30px 0;
                color: ${cssVars['--text-dark']};
                border-bottom: 2px solid ${cssVars['--bg-color']};
                padding-bottom: 20px;
            }

            p {
                font-size: 28px;
                line-height: 1.6;
                color: #3C4043;
                margin: 0;
            }

            ul {
                margin: 0;
                padding-left: 0;
                list-style: none;
            }

            li {
                font-size: 28px;
                margin-bottom: 24px;
                padding-left: 40px;
                position: relative;
                color: #3C4043;
            }

            li::before {
                content: "•";
                color: ${cssVars['--primary']};
                font-size: 40px;
                position: absolute;
                left: 0;
                top: -10px;
            }

            /* CTA Section */
            .cta-card {
                background: ${cssVars['--text-dark']};
                color: white;
                padding: 60px;
                border-radius: 32px;
                text-align: center;
                margin-top: 20px;
            }

            .cta-card h2 {
                color: white;
                border-bottom: none;
            }

            .cta-card p {
                color: #E8EAED;
            }

        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header-card">
                <span class="brand-badge">${brand} • Notebook Source</span>
                <h1>${titleSlide.headline}</h1>
                <div class="subtitle">${titleSlide.subheadline}</div>
            </div>

            <!-- Content -->
            <div class="content-grid">
                ${contentSlides.map(slide => `
                    <div class="section-card">
                        <h2>${slide.headline}</h2>
                        ${Array.isArray(slide.content)
      ? `<ul>${slide.content.map(item => `<li>${item}</li>`).join('')}</ul>`
      : `<p>${slide.content}</p>`
    }
                    </div>
                `).join('')}
            </div>

            <!-- Footer / CTA -->
            <div class="cta-card">
                <h2>${ctaSlide.headline}</h2>
                <p>${ctaSlide.content.replace(/\n/g, '<br>')}</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

/**
 * Create HTML for a single slide
 */
function createSlideHTML(slideData, slideNumber, globalData) {
  const { type, headline, subheadline, content, visual } = slideData;
  const brand = globalData.brand || 'Long Best AI';
  const designStyle = globalData.designStyle || 'classic';

  // Brand Configurations
  const BRAND_CONFIGS = {
    'Queen Nail Bern': {
      fonts: [
        'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600&display=swap'
      ],
      cssVars: {
        '--bg-dark': '#2D1B2E',         // Deep Purple
        '--bg-light': '#FFF5F8',        // Light Blush
        '--accent-primary': '#E8B4C8',  // Soft Pink
        '--accent-secondary': '#C77D9D', // Rose
        '--text-main': '#FFF5F8',       // Light text on dark bg
        '--text-highlight': '#E8B4C8',
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

  // NotebookLM Style Override
  if (designStyle === 'notebook') {
    config = {
      ...config,
      fonts: ['https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Roboto+Mono:wght@400;500&display=swap'],
      cssVars: {
        '--bg-dark': '#F0F2F5',          // Light Gray (Canvas)
        '--bg-light': '#FFFFFF',         // White (Card)
        '--accent-primary': '#1A73E8',   // Google Blue
        '--accent-secondary': '#FBBC04', // Google Yellow
        '--text-main': '#202124',        // Google Dark Gray
        '--text-highlight': '#1A73E8',
        '--font-headline': "'Roboto', sans-serif",
        '--font-body': "'Roboto', sans-serif",
        '--corner-text': brand
      },
      styles: `
            body { font-family: 'Roboto', sans-serif; letter-spacing: -0.01em; }
            .slide { padding: 40px; background-image: radial-gradient(#E5E7EB 1px, transparent 1px); background-size: 20px 20px; }
            .glass-overlay { display: none; }
            
            .content-card {
                background: white;
                border-radius: 24px;
                padding: 40px 50px;
                height: 100%;
                display: flex;
                flex-direction: column;
                box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.05);
                position: relative;
                border: 1px solid rgba(0,0,0,0.03);
            }

            .source-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                font-family: 'Roboto Mono', monospace;
                font-size: 13px;
                color: #5F6368;
                background: #F1F3F4;
                padding: 6px 12px;
                border-radius: 8px;
                margin-bottom: 24px;
                width: fit-content;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                font-weight: 500;
            }
            .source-badge::before {
                content: '';
                display: block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #34A853; /* Green dot */
            }

            h1 { 
                font-family: 'Roboto', sans-serif;
                color: #202124;
                text-transform: none; 
                letter-spacing: -0.03em;
                font-size: 68px;
                line-height: 1.1;
                margin-top: auto;
                margin-bottom: auto;
                font-weight: 500;
            }
            
            h2 {
                color: #202124;
                font-size: 36px;
                letter-spacing: -0.01em;
                margin-bottom: 24px;
                font-weight: 500;
            }

            .subheadline {
                color: #5F6368;
                font-size: 28px;
                font-weight: 400;
                line-height: 1.5;
            }

            .content {
                color: #3C4043;
                font-size: 26px;
                line-height: 1.6;
            }

            ul { margin: 0; padding: 0; }
            li {
                padding-left: 0;
                margin-bottom: 20px;
                display: flex;
                align-items: flex-start;
                gap: 16px;
                color: #3C4043;
            }
            li::before {
                position: static;
                content: counter(list-counter);
                background: #E8F0FE;
                color: #1967D2;
                min-width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                font-size: 15px;
                font-weight: 700;
                margin-top: 3px;
            }

            .prompt-box {
                background: #FEF7E0;
                border: none;
                border-radius: 12px;
                color: #3C4043;
                padding: 30px;
                font-family: 'Roboto', sans-serif;
            }
            
            .cta {
                background: #F8F9FA;
                border: 2px solid #E8F0FE;
                box-shadow: none;
            }
            .cta h2 { color: #1967D2; }
            .cta p { color: #3C4043; font-size: 24px; }

            .audio-footer {
                background: #F1F3F4;
                border-radius: 100px;
                height: 44px;
                display: flex;
                align-items: center;
                padding: 0 6px;
                gap: 12px;
                width: fit-content;
                margin-top: auto;
            }
            .play-btn {
                width: 32px;
                height: 32px;
                background: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }
            .play-icon {
                width: 0; 
                height: 0; 
                border-top: 5px solid transparent;
                border-bottom: 5px solid transparent;
                border-left: 8px solid #3C4043;
                margin-left: 2px;
            }
            .waveform {
                display: flex;
                align-items: center;
                gap: 3px;
                height: 16px;
                padding-right: 12px;
            }
            .bar { width: 3px; background: #BDC1C6; border-radius: 2px; }
            
            .slide-number {
                top: auto;
                bottom: 40px;
                right: 40px;
                background: transparent;
                color: #9AA0A6;
                font-size: 14px;
                padding: 0;
            }
            
            .brand-corner { display: none; }
          `
    };
  }

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
    ${config.fonts.map(url => `<link href="${url}" rel="stylesheet">`).join('\n')}
    <style>
        :root {
            --bg-dark: ${config.cssVars['--bg-dark']};
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
            width: 1080px;
            height: 1350px;
            background-color: var(--bg-dark);
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
            font-family: var(--font-headline);
            font-size: ${type === 'title' ? getFontSize('h1Title', '72px') : getFontSize('h1Content', '56px')};
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 30px;
            color: var(--text-main);
        }

        h2 {
            font-family: var(--font-headline);
            font-size: ${getFontSize('h2', '36px')};
            font-weight: 600;
            margin-bottom: 20px;
            color: var(--accent-primary);
        }

        .subheadline {
            font-size: ${getFontSize('subheadline', '28px')};
            color: rgba(255, 255, 255, 0.8);
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
            counter-reset: list-counter; /* Initialize counter */
        }

        li {
            font-size: ${getFontSize('listItem', '26px')};
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

    </style>
</head>
<body>
    <div class="slide">
        ${designStyle === 'notebook' ? `
        <div class="content-card">
            <div class="source-badge">Source: ${brand}</div>
            <div style="flex-grow:1; display:flex; flex-direction:column; justify-content:${type === 'title' ? 'center' : 'flex-start'}">
                ${renderSlideContent(type, { headline, subheadline, content, visual })}
            </div>
            <div class="audio-footer">
                <div class="play-btn"><div class="play-icon"></div></div>
                <div class="waveform">
                   <div class="bar" style="height:40%"></div><div class="bar" style="height:70%"></div><div class="bar" style="height:50%"></div><div class="bar" style="height:80%"></div><div class="bar" style="height:60%"></div>
                </div>
            </div>
        </div>
        <div class="slide-number">${slideNumber}/7</div>
        ` : `
        <div class="glass-overlay"></div>
        <div class="slide-number">${slideNumber}/7</div>

        ${renderSlideContent(type, { headline, subheadline, content, visual })}

        <div class="brand-corner">${config.cssVars['--corner-text']}</div>
        `}
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
          ${data.visual ? `<img src="${data.visual}" class="cta-image" style="width:100%; height:300px; object-fit:cover; border-radius:12px; margin-bottom:20px;"/>` : ''}
          <p>${formatContent(content)}</p>
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

    // Copy content.json to output directory for metadata/publishing
    const destinationPath = path.join(outputDir, 'content.json');
    await fs.copyFile(contentFile, destinationPath);
    console.log(`✓ Copied content.json to ${outputDir}`);

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

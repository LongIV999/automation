/**
 * Single Image Post Generator (1080x1080)
 * 
 * Generates single-image posts for tips, announcements, quotes
 * Uses Long Best AI brand styling
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Load brand config
const BRAND = require('../brand-config.json');

// Embedded HTML Generator Function for NotebookLM style
function createNotebookLMHTML(slide, brand, globalData, dimensions) {
    const { headline, subheadline, content, highlights, stats } = slide;
    const contact = globalData.contact || {};
    const branding = globalData.branding || {};

    // Generate stats HTML
    let statsHTML = '';
    if (stats) {
        const statEntries = Object.entries(stats);
        statsHTML = `
      <div class="stats-grid">
        ${statEntries.map(([label, value]) => `
          <div class="stat-box">
            <div class="stat-label">${label}</div>
            <div class="stat-value">${value}</div>
          </div>
        `).join('')}
      </div>
    `;
    }

    // Generate highlights HTML
    let highlightsHTML = '';
    if (highlights && Array.isArray(highlights)) {
        highlightsHTML = `
      <div class="highlights-section">
        <div class="section-title">Điểm Nổi Bật</div>
        ${highlights.map((item, idx) => `
          <div class="highlight-item">
            <div class="highlight-marker">${idx + 1}</div>
            <div class="highlight-text">${item}</div>
          </div>
        `).join('')}
      </div>
    `;
    }

    // Content box
    let contentHTML = '';
    if (content) {
        contentHTML = `
      <div class="info-box">
        <div class="info-title">Thông Tin Chi Tiết</div>
        <div class="info-content">${content}</div>
      </div>
    `;
    }

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            width: ${dimensions.width}px;
            height: ${dimensions.height}px;
            background: #FFF5F8; /* --background */
            font-family: 'Inter', sans-serif;
            color: #2D1B2E; /* --text-dark */
            padding: 0;
            margin: 0;
            overflow: hidden;
            position: relative;
        }

        /* Header Section */
        .header {
            background: #E8B4C8; /* --primary */
            color: #FFFFFF; /* --text-light */
            padding: 40px 50px;
            border-bottom: 4px solid #E8B4C8;
        }

        .brand-tag {
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
            opacity: 0.7;
            margin-bottom: 15px;
        }

        .headline {
            font-size: 48px;
            font-weight: 800;
            line-height: 1.1;
            letter-spacing: -1px;
            margin-bottom: 15px;
        }

        .subheadline {
            font-size: 20px;
            font-weight: 400;
            opacity: 0.8;
            line-height: 1.4;
        }

        /* Content Section */
        .content-area {
            padding: 50px;
            background: #FFF5F8; /* --background */
            height: calc(${dimensions.height}px - 250px);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
            margin-bottom: 35px;
        }

        .stat-box {
            border: 2px solid #2D1B2E; /* --text-dark */
            padding: 20px 25px;
            background: #FFF5F8; /* --background */
        }

        .stat-label {
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 8px;
            opacity: 0.6;
        }

        .stat-value {
            font-size: 32px;
            font-weight: 800;
            line-height: 1;
            color: #C77D9D; /* --accent */
        }

        /* Highlights List */
        .highlights-section {
            margin-bottom: 35px;
        }

        .section-title {
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #2D1B2E; /* --text-dark */
        }

        .highlight-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 16px;
            font-size: 15px;
            line-height: 1.6;
        }

        .highlight-marker {
            width: 24px;
            height: 24px;
            background: #C77D9D; /* --accent */
            color: #FFFFFF; /* --text-light */
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 700;
            margin-right: 15px;
            flex-shrink: 0;
        }

        .highlight-text {
            flex: 1;
            padding-top: 2px;
        }

        /* Info Box */
        .info-box {
            background: #E8B4C8; /* --primary */
            color: #FFFFFF; /* --text-light */
            padding: 25px 30px;
            margin-bottom: 25px;
        }

        .info-title {
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 12px;
            opacity: 0.7;
        }

        .info-content {
            font-size: 24px;
            line-height: 1.5;
            font-weight: 500;
        }

        /* Footer Section */
        .footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: #E8B4C8; /* --primary */
            color: #FFFFFF; /* --text-light */
            padding: 20px 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .footer-contact {
            display: flex;
            gap: 35px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            font-weight: 600;
        }

        .footer-brand {
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 2px;
        }

        /* Decorative Elements */
        .corner-marker {
            position: absolute;
            width: 35px;
            height: 35px;
            border: 3px solid #2D1B2E; /* --text-dark */
            z-index: 10;
        }

        .corner-marker.top-left {
            top: 35px;
            left: 35px;
            border-right: none;
            border-bottom: none;
        }

        .corner-marker.bottom-right {
            bottom: 100px;
            right: 35px;
            border-left: none;
            border-top: none;
        }
    </style>
</head>
<body>
    <div class="corner-marker top-left"></div>
    <div class="corner-marker bottom-right"></div>

    <!-- Header -->
    <div class="header">
        <div class="brand-tag">${branding.cornerText || 'QUEEN NAILS'}</div>
        <div class="headline">${headline || 'Headline Here'}</div>
        ${subheadline ? `<div class="subheadline">${subheadline}</div>` : ''}
    </div>

    <!-- Content Area -->
    <div class="content-area">
        ${statsHTML}
        ${highlightsHTML}
        ${contentHTML}
    </div>

    <!-- Footer -->
    <div class="footer">
        <div class="footer-contact">
            <div>👑 ${contact.hotline || 'Nail Art Tips'}</div>
            <div>💅 ${contact.address || 'Bern Beauty'}</div>
        </div>
        <div class="footer-brand">${branding.website?.toUpperCase() || '@QUEENNAILSBERN'}</div>
    </div>
</body>
</html>
  `;
}

/**
 * Generate a single image post
 * @param {Object} data - Content data
 * @param {string} data.headline - Main headline text
 * @param {string} data.bodyText - Optional body text
 * @param {string} data.ctaText - Optional CTA button text
 * @param {string} data.topic - Optional topic tag
 * @param {string} outputPath - Output file path
 */
async function generateSinglePost(data, outputPath) {
    console.log('🎨 Generating Single Image Post...');

    // Load template
    const templatePath = path.join(__dirname, '../templates/single-post.html');
    let html = await fs.readFile(templatePath, 'utf-8');

    // Calculate headline size based on length
    let headlineSize = '64px';
    if (data.headline.length > 50) headlineSize = '52px';
    if (data.headline.length > 80) headlineSize = '44px';
    if (data.headline.length > 100) headlineSize = '38px';

    // Configure Brand
    let config = { ...BRAND }; // Clone default
    if (data.brand === 'queennailbern') {
        // Use NotebookLM style for queennailbern
        return generateNotebookLMPost(data, outputPath);
    }

    // Replace placeholders
    const replacements = {
        '{{background}}': config.colors.background,
        '{{accent}}': config.colors.accent,
        '{{text}}': config.colors.text,
        '{{textMuted}}': config.colors.textMuted,
        '{{secondary}}': config.colors.secondary,
        '{{headlineSize}}': headlineSize,
        '{{logoIcon}}': config.logo.icon,
        '{{brandName}}': config.brand,
        '{{headline}}': data.headline,
        '{{bodyText}}': data.bodyText || '',
        '{{ctaText}}': data.ctaText || '',
        '{{topic}}': data.topic || '',
        '{{watermark}}': config.watermark
    };

    for (const [key, value] of Object.entries(replacements)) {
        html = html.replace(new RegExp(key, 'g'), value);
    }

    // Handle conditional blocks
    if (!data.bodyText) {
        html = html.replace(/{{#if bodyText}}[\s\S]*?{{\/if}}/g, '');
    } else {
        html = html.replace(/{{#if bodyText}}/g, '').replace(/{{\/if}}/g, '');
    }

    if (!data.ctaText) {
        html = html.replace(/{{#if ctaText}}[\s\S]*?{{\/if}}/g, '');
    } else {
        html = html.replace(/{{#if ctaText}}/g, '').replace(/{{\/if}}/g, '');
    }

    if (!data.topic) {
        html = html.replace(/{{#if topic}}[\s\S]*?{{\/if}}/g, '');
    } else {
        html = html.replace(/{{#if topic}}/g, '').replace(/{{\/if}}/g, '');
    }

    // Launch browser and render
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({
            width: BRAND.dimensions.single.width,
            height: BRAND.dimensions.single.height,
            deviceScaleFactor: 2
        });

        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Ensure output directory exists
        await fs.mkdir(path.dirname(outputPath), { recursive: true });

        await page.screenshot({
            path: outputPath,
            type: 'png'
        });

        console.log(`✅ Single post saved: ${outputPath}`);
        return outputPath;

    } finally {
        await browser.close();
    }
}

// CLI usage
async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        // Demo mode
        const demoData = {
            headline: '5 Cách Sử Dụng Claude AI Hiệu Quả Nhất',
            bodyText: 'Khám phá những mẹo giúp bạn tận dụng tối đa sức mạnh của AI trong công việc hàng ngày.',
            ctaText: 'Xem Ngay',
            topic: 'AI Tips'
        };

        const outputPath = path.join(__dirname, '../output/demo-single-post.png');
        await generateSinglePost(demoData, outputPath);
        return;
    }

    // Parse JSON input
    try {
        const jsonPath = args[0];
        const outputPath = args[1] || path.join(__dirname, '../output/single-post.png');
        const data = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
        await generateSinglePost(data, outputPath);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\nUsage: node single-post.js [input.json] [output.png]');
        console.log('Or run without args for demo mode');
        process.exit(1);
    }
}

/**
 * Generate a NotebookLM style post
 * @param {Object} data - Content data
 * @param {string} outputPath - Output file path
 */
async function generateNotebookLMPost(data, outputPath) {
    console.log('🎨 Generating NotebookLM Style Post for Queen Nail Bern...');

    // Prepare data for template
    const slide = {
        headline: data.headline,
        subheadline: data.topic, // Use topic as subheadline
        content: data.bodyText,
        highlights: data.highlights || [], // Optional
        stats: data.stats || {} // Optional
    };

    const globalData = {
        branding: {
            cornerText: "QUEEN NAILS",
            website: "@queennailsbern"
        },
        contact: {
            hotline: "Nail Art Tips",
            address: "Bern Beauty"
        }
    };

    const dimensions = { width: 1080, height: 1080 }; // Square for FB

    const html = createNotebookLMHTML(slide, 'queennailbern', globalData, dimensions);

    // Launch browser and render
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({
            width: dimensions.width,
            height: dimensions.height,
            deviceScaleFactor: 2
        });

        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Ensure output directory exists
        await fs.mkdir(path.dirname(outputPath), { recursive: true });

        await page.screenshot({
            path: outputPath,
            type: 'png'
        });

        console.log(`✅ NotebookLM post saved: ${outputPath}`);
        return outputPath;

    } finally {
        await browser.close();
    }
}

module.exports = { generateSinglePost };

if (require.main === module) {
    main();
}

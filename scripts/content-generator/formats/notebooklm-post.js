/**
 * NotebookLM Style Post Generator
 * Based on scripts/carousel-generator/createNotebookLMHTML.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Embedded HTML Generator Function
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
            background: #FFFFFF;
            font-family: 'Inter', sans-serif;
            color: #000000;
            padding: 0;
            margin: 0;
            overflow: hidden;
            position: relative;
        }

        /* Header Section */
        .header {
            background: #000000;
            color: #FFFFFF;
            padding: 40px 50px;
            border-bottom: 4px solid #000000;
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
            background: #FFFFFF;
            height: calc(${dimensions.height}px - 250px);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center; /* Center content vertically */
        }

        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
            margin-bottom: 35px;
        }

        .stat-box {
            border: 2px solid #000000;
            padding: 20px 25px;
            background: #FFFFFF;
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
            color: #000000;
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
            border-bottom: 2px solid #000000;
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
            background: #000000;
            color: #FFFFFF;
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
            background: #000000;
            color: #FFFFFF;
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
            font-size: 24px; /* Increased font size */
            line-height: 1.5;
            font-weight: 500;
        }

        /* Footer Section */
        .footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: #000000;
            color: #FFFFFF;
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
            border: 3px solid #000000;
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
        <div class="brand-tag">${branding.cornerText || 'LONGBEST AI'}</div>
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
            <div>🤖 ${contact.hotline || 'Veo 4 Update'}</div>
            <div>⚡ ${contact.address || 'Powered by Google DeepMind'}</div>
        </div>
        <div class="footer-brand">${branding.website?.toUpperCase() || 'LONGBEST.AI'}</div>
    </div>
</body>
</html>
  `;
}

/**
 * Generate a NotebookLM style post
 * @param {Object} data - Content data
 * @param {string} outputPath - Output file path
 */
async function generateNotebookLMPost(data, outputPath) {
    // console.log('🎨 Generating NotebookLM Style Post...');

    // Prepare data for template
    const slide = {
        headline: data.headline,
        subheadline: data.topic, // Use topic as subheadline
        content: data.bodyText,
        // highlights: ["Feature 1", "Feature 2"], // Optional: Add highlights if data has them
        // stats: { "Speed": "2x", "Res": "4K" }   // Optional: Add stats if available
    };

    const globalData = {
        branding: {
            cornerText: "LONGBEST AI",
            website: "LONGBEST.AI"
        },
        contact: {
            hotline: "AI Video Generation",
            address: "Veo 4 Preview"
        }
    };

    const dimensions = { width: 1080, height: 1080 }; // Square for FB

    const html = createNotebookLMHTML(slide, 'longbest', globalData, dimensions);

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

        // console.log(`✅ Saved: ${outputPath}`);
        return outputPath;

    } finally {
        await browser.close();
    }
}

module.exports = { generateNotebookLMPost };

/**
 * Infographic Generator (1080x1920)
 * 
 * Generates data visualizations, stats, comparisons
 * Uses Long Best AI brand styling
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const BRAND = require('../brand-config.json');

/**
 * Generate an infographic
 * @param {Object} data - Content data
 * @param {string} data.title - Main title
 * @param {string} data.subtitle - Optional subtitle
 * @param {Array} data.stats - Array of stat objects [{icon, value, label, desc}]
 * @param {string} data.insight - Optional key insight text
 * @param {string} data.topic - Optional topic tag
 * @param {string} data.source - Optional source citation
 * @param {string} outputPath - Output file path
 */
async function generateInfographic(data, outputPath, options = {}) {

    const isFeed = options.mode === 'feed';
    const isNotebook = options.mode === 'notebook';
    const noHeader = options.noHeader;
    console.log(`🎨 Generating Infographic (${options.mode || 'Story 9:16'})...`);

    const templatePath = path.join(__dirname, '../templates/infographic.html');
    let html = await fs.readFile(templatePath, 'utf-8');

    // Generate stats HTML (no icons, larger text)
    const statsHtml = (data.stats || []).map(stat => `
        <div class="stat-item">
            <div class="stat-content">
                <div class="stat-value">${stat.value}</div>
                <div class="stat-label">${stat.label}</div>
                ${stat.desc ? `<div class="stat-desc">${stat.desc}</div>` : ''}
            </div>
        </div>
    `).join('');

    // Configure Brand
    let config = { ...BRAND }; // Clone default
    if (data.brand === 'queennailbern') {
        config.colors = {
            accent: "#C77D9D", // Rose
            accentHover: "#E8B4C8",
            background: "#2D1B2E", // Deep Purple
            backgroundAlt: "#FFF5F8",
            text: "#FFF5F8", // Light text
            textMuted: "#E8B4C8", // Pink text
            secondary: "#C77D9D",
            success: "#4CAF50",
            error: "#E53935"
        };
        config.brand = "Queen Nail Bern";
        config.logo = { text: "Queen Nail Bern", icon: "👑" };
        config.watermark = "@QueenNailBern";

        // Font Replacement Logic (in HTML)
        html = html.replace(
            '<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap" rel="stylesheet">',
            '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Montserrat:wght@400;700&display=swap" rel="stylesheet">'
        );
        html = html.replace(/font-family: 'Roboto'/g, "font-family: 'Playfair Display'");
        html = html.replace(/font-family: Georgia/g, "font-family: 'Montserrat'");
    }

    // Configure Notebook Style Override
    if (isNotebook) {
        config.colors = {
            accent: "#1A73E8", // Google Blue
            accentHover: "#1557B0",
            background: "#F0F2F5", // Light Gray Canvas
            backgroundAlt: "#FFFFFF",
            text: "#202124", // Dark Gray
            textMuted: "#5F6368",
            secondary: "#1A73E8",
            success: "#34A853", // Google Green
            error: "#EA4335"
        };
        // Use Roboto for everything in Notebook style
        html = html.replace(
            '<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap" rel="stylesheet">',
            '<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet">'
        );
        html = html.replace(/font-family: 'Playfair Display'/g, "font-family: 'Roboto', sans-serif");
        html = html.replace(/font-family: 'Montserrat'/g, "font-family: 'Roboto', sans-serif");
    }

    const replacements = {
        '{{background}}': config.colors.background,
        '{{accent}}': config.colors.accent,
        '{{text}}': config.colors.text,
        '{{textMuted}}': config.colors.textMuted,
        '{{secondary}}': config.colors.secondary,
        '{{logoIcon}}': config.logo.icon,
        '{{brandName}}': config.brand,
        '{{title}}': data.title,
        '{{subtitle}}': data.subtitle || '',
        '{{stats}}': statsHtml,
        '{{insight}}': data.insight || '',
        '{{topic}}': data.topic || '',
        '{{source}}': data.source || '',
        '{{watermark}}': config.watermark
    };

    for (const [key, value] of Object.entries(replacements)) {
        html = html.replace(new RegExp(key, 'g'), value);
    }

    // Apply Mode-specific Styles
    if (isFeed || isNotebook) {
        // Feed Mode (1080x1350) - Compact Styles
        const feedHeight = 1350;
        let compactStyles = `
            body { 
                height: ${feedHeight}px !important; 
                padding: 60px !important; 
            }
            .header { margin-bottom: 40px !important; }
            .title { font-size: 56px !important; margin-bottom: 20px !important; }
            .subtitle { font-size: 32px !important; }
            .stats-grid { gap: 20px !important; margin-bottom: 40px !important; }
            .stat-item { padding: 24px 40px !important; }
            .stat-value { font-size: 56px !important; margin-bottom: 8px !important; }
            .stat-label { font-size: 32px !important; }
            .stat-desc { font-size: 24px !important; }
            .insight-box { padding: 40px !important; margin-bottom: 40px !important; }
            .insight-text { font-size: 32px !important; }
            .logo-text { font-size: 28px !important; }
            .topic-tag { font-size: 20px !important; padding: 10px 24px !important; }
        `;

        if (isNotebook) {
            compactStyles += `
                body {
                    background-color: #F0F2F5 !important;
                    background-image: radial-gradient(#E5E7EB 1px, transparent 1px) !important; 
                    background-size: 20px 20px !important;
                }
                /* Use a wrapper if possible, or just style the contents to look "on paper" */
                /* Converting the main containers to look like parts of a document */
                
                .accent-bar { display: none !important; }

                /* Header becomes the top of the document */
                .header { 
                    background: white;
                    padding: 40px;
                    border-radius: 24px 24px 0 0;
                    margin-bottom: 0 !important;
                    border: 1px solid rgba(0,0,0,0.05);
                    border-bottom: none;
                }
                
                .title-section {
                    background: white;
                    padding: 0 40px 40px 40px;
                    margin-bottom: 0 !important;
                    text-align: left !important;
                    border-left: 1px solid rgba(0,0,0,0.05);
                    border-right: 1px solid rgba(0,0,0,0.05);
                }
                .title {
                    font-family: 'Roboto', sans-serif !important;
                    letter-spacing: -0.02em;
                    color: #202124 !important;
                }
                
                /* Stats Grid becomes list of items */
                .stats-grid {
                    background: white;
                    padding: 0 40px 40px 40px;
                    margin-bottom: 0 !important;
                    gap: 0 !important;
                    border-left: 1px solid rgba(0,0,0,0.05);
                    border-right: 1px solid rgba(0,0,0,0.05);
                }
                .stat-item {
                    box-shadow: none !important;
                    border-radius: 0 !important;
                    padding: 24px 0 !important;
                    border-left: none !important;
                    border-bottom: 1px solid #F1F3F4;
                }
                .stat-value { color: #1A73E8 !important; }
                
                /* Insight Box becomes a Note */
                .insight-box {
                    background: white !important;
                    padding: 40px !important;
                    margin-bottom: 0 !important;
                    border-radius: 0 0 24px 24px !important;
                    color: #3C4043 !important;
                    border: 1px solid rgba(0,0,0,0.05);
                    border-top: none;
                }
                .insight-label { 
                    color: #5F6368 !important; 
                    font-family: 'Roboto Mono', monospace !important;
                    font-size: 14px !important;
                }
                .insight-text {
                    font-family: 'Roboto', sans-serif !important;
                    background: #FEF7E0;
                    padding: 20px;
                    border-radius: 12px;
                    font-size: 24px !important;
                }

                .topic-tag {
                    background: #F1F3F4 !important;
                    color: #5F6368 !important;
                    font-family: 'Roboto Mono', monospace !important;
                    border-radius: 8px !important;
                    text-transform: uppercase;
                    font-size: 16px !important;
                }
                
                .footer {
                    padding-top: 20px !important;
                    border-top: none !important;
                }
                .watermark {
                    font-family: 'Roboto Mono', monospace !important;
                    font-size: 20px !important;
                    color: #9AA0A6 !important;
                }
            `;
        }

        if (noHeader) {
            compactStyles += `
            .header, .title-section { display: none !important; }
            .stats-grid { margin-top: 40px !important; }
            `;
        }

        html = html.replace('</style>', `${compactStyles}</style>`);
        html = html.replace('height: 1920px', `height: ${feedHeight}px`);
    }

    // Handle conditionals
    const conditionals = ['topic', 'subtitle', 'insight', 'source'];
    conditionals.forEach(field => {
        if (!data[field]) {
            html = html.replace(new RegExp(`{{#if ${field}}}[\\s\\S]*?{{/if}}`, 'g'), '');
        } else {
            html = html.replace(new RegExp(`{{#if ${field}}}`, 'g'), '').replace(/{{\/if}}/g, '');
        }
    });

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        const height = (isFeed || isNotebook) ? 1350 : BRAND.dimensions.infographic.height;

        await page.setViewport({
            width: BRAND.dimensions.infographic.width,
            height: height,
            deviceScaleFactor: 2
        });

        await page.setContent(html, { waitUntil: 'networkidle0' });
        await fs.mkdir(path.dirname(outputPath), { recursive: true });

        await page.screenshot({ path: outputPath, type: 'png' });
        console.log(`✅ Infographic saved: ${outputPath}`);
        return outputPath;

    } finally {
        await browser.close();
    }
}

async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        const demoData = {
            title: 'Thị Trường AI Việt Nam 2024',
            subtitle: 'Những con số ấn tượng',
            topic: 'AI Market',
            stats: [
                { icon: '💰', value: '$753M', label: 'Quy mô thị trường', desc: 'Năm 2024' },
                { icon: '📈', value: '28.6%', label: 'Tốc độ tăng trưởng', desc: 'CAGR đến 2030' },
                { icon: '👥', value: '78.4M', label: 'Người dùng Internet', desc: '79% dân số' },
                { icon: '🏆', value: 'Top 3', label: 'Xếp hạng tin tưởng AI', desc: 'Toàn cầu' }
            ],
            insight: 'Việt Nam đang là một trong những thị trường AI tiềm năng nhất Đông Nam Á với tỷ lệ chấp nhận công nghệ cao.',
            source: 'Statista, 2024'
        };

        const outputPath = path.join(__dirname, '../output/demo-infographic.png');
        await generateInfographic(demoData, outputPath);
        return;
    }

    try {
        const jsonPath = args[0];
        const outputPath = args[1] || path.join(__dirname, '../output/infographic.png');
        const isFeed = args.includes('--feed');
        const isNotebook = args.includes('--notebook');
        const noHeader = args.includes('--no-header');

        const mode = isNotebook ? 'notebook' : (isFeed ? 'feed' : 'story');

        const data = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
        await generateInfographic(data, outputPath, { mode: mode, noHeader: noHeader });
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

module.exports = { generateInfographic };

if (require.main === module) {
    main();
}

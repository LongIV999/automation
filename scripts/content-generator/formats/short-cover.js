/**
 * Short-form Cover Generator (1080x1920)
 * 
 * Generates covers for Reels, Shorts, TikTok videos
 * Uses Long Best AI brand styling
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const BRAND = require('../brand-config.json');

/**
 * Generate a short-form video cover
 * @param {Object} data - Content data
 * @param {string} data.headline - Main headline
 * @param {string} data.subheadline - Optional subheadline
 * @param {string} data.topic - Optional topic tag
 * @param {string} data.duration - Optional duration (e.g., "30s")
 * @param {boolean} data.showPlay - Show play button (default: true)
 * @param {string} outputPath - Output file path
 */
async function generateShortCover(data, outputPath) {
    console.log('🎨 Generating Short-form Cover...');

    const templatePath = path.join(__dirname, '../templates/short-cover.html');
    let html = await fs.readFile(templatePath, 'utf-8');

    // Calculate headline size
    let headlineSize = '72px';
    if (data.headline.length > 40) headlineSize = '64px';
    if (data.headline.length > 60) headlineSize = '56px';
    if (data.headline.length > 80) headlineSize = '48px';

    const replacements = {
        '{{background}}': BRAND.colors.background,
        '{{accent}}': BRAND.colors.accent,
        '{{text}}': BRAND.colors.text,
        '{{textMuted}}': BRAND.colors.textMuted,
        '{{secondary}}': BRAND.colors.secondary,
        '{{headlineSize}}': headlineSize,
        '{{logoIcon}}': BRAND.logo.icon,
        '{{brandName}}': BRAND.brand,
        '{{headline}}': data.headline,
        '{{subheadline}}': data.subheadline || '',
        '{{topic}}': data.topic || '',
        '{{duration}}': data.duration || '',
        '{{watermark}}': BRAND.watermark
    };

    for (const [key, value] of Object.entries(replacements)) {
        html = html.replace(new RegExp(key, 'g'), value);
    }

    // Handle conditionals
    const conditionals = ['topic', 'subheadline', 'duration'];
    conditionals.forEach(field => {
        if (!data[field]) {
            html = html.replace(new RegExp(`{{#if ${field}}}[\\s\\S]*?{{/if}}`, 'g'), '');
        } else {
            html = html.replace(new RegExp(`{{#if ${field}}}`, 'g'), '').replace(/{{\/if}}/g, '');
        }
    });

    // Show play by default
    if (data.showPlay !== false) {
        html = html.replace(/{{#if showPlay}}/g, '').replace(/{{\/if}}/g, '');
    } else {
        html = html.replace(/{{#if showPlay}}[\s\S]*?{{\/if}}/g, '');
    }

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({
            width: BRAND.dimensions.shortform.width,
            height: BRAND.dimensions.shortform.height,
            deviceScaleFactor: 2
        });

        await page.setContent(html, { waitUntil: 'networkidle0' });
        await fs.mkdir(path.dirname(outputPath), { recursive: true });

        await page.screenshot({ path: outputPath, type: 'png' });
        console.log(`✅ Short cover saved: ${outputPath}`);
        return outputPath;

    } finally {
        await browser.close();
    }
}

async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        const demoData = {
            headline: '3 Công Cụ AI Miễn Phí Thay Đổi Cách Bạn Làm Việc',
            subheadline: 'Số 2 sẽ khiến bạn bất ngờ!',
            topic: 'AI Tools',
            duration: '45s',
            showPlay: true
        };

        const outputPath = path.join(__dirname, '../output/demo-short-cover.png');
        await generateShortCover(demoData, outputPath);
        return;
    }

    try {
        const jsonPath = args[0];
        const outputPath = args[1] || path.join(__dirname, '../output/short-cover.png');
        const data = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
        await generateShortCover(data, outputPath);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

module.exports = { generateShortCover };

if (require.main === module) {
    main();
}

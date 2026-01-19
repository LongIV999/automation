/**
 * Quote Card Generator (1080x1350)
 * 
 * Generates elegant quote cards for inspiration, insights
 * Uses Long Best AI brand styling
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Load brand config
const BRAND = require('../brand-config.json');

/**
 * Generate a quote card
 * @param {Object} data - Content data
 * @param {string} data.quoteText - The quote text
 * @param {string} data.author - Author name
 * @param {string} data.authorTitle - Optional author title/role
 * @param {string} data.topic - Optional topic tag
 * @param {string} outputPath - Output file path
 */
async function generateQuoteCard(data, outputPath) {
    console.log('🎨 Generating Quote Card...');

    // Load template
    const templatePath = path.join(__dirname, '../templates/quote-card.html');
    let html = await fs.readFile(templatePath, 'utf-8');

    // Calculate quote size based on length
    let quoteSize = '48px';
    if (data.quoteText.length > 100) quoteSize = '42px';
    if (data.quoteText.length > 150) quoteSize = '36px';
    if (data.quoteText.length > 200) quoteSize = '32px';

    // Replace placeholders
    const replacements = {
        '{{background}}': BRAND.colors.background,
        '{{accent}}': BRAND.colors.accent,
        '{{text}}': BRAND.colors.text,
        '{{secondary}}': BRAND.colors.secondary,
        '{{quoteSize}}': quoteSize,
        '{{logoIcon}}': BRAND.logo.icon,
        '{{brandName}}': BRAND.brand,
        '{{quoteText}}': data.quoteText,
        '{{author}}': data.author,
        '{{authorTitle}}': data.authorTitle || '',
        '{{topic}}': data.topic || '',
        '{{watermark}}': BRAND.watermark
    };

    for (const [key, value] of Object.entries(replacements)) {
        html = html.replace(new RegExp(key, 'g'), value);
    }

    // Handle conditional blocks
    if (!data.authorTitle) {
        html = html.replace(/{{#if authorTitle}}[\s\S]*?{{\/if}}/g, '');
    } else {
        html = html.replace(/{{#if authorTitle}}/g, '').replace(/{{\/if}}/g, '');
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
            width: BRAND.dimensions.quote.width,
            height: BRAND.dimensions.quote.height,
            deviceScaleFactor: 2
        });

        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Ensure output directory exists
        await fs.mkdir(path.dirname(outputPath), { recursive: true });

        await page.screenshot({
            path: outputPath,
            type: 'png'
        });

        console.log(`✅ Quote card saved: ${outputPath}`);
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
            quoteText: 'AI không thay thế con người. AI làm mạnh thêm sức mạnh của những người biết sử dụng nó.',
            author: 'Sam Altman',
            authorTitle: 'CEO OpenAI',
            topic: 'AI Insights'
        };

        const outputPath = path.join(__dirname, '../output/demo-quote-card.png');
        await generateQuoteCard(demoData, outputPath);
        return;
    }

    try {
        const jsonPath = args[0];
        const outputPath = args[1] || path.join(__dirname, '../output/quote-card.png');
        const data = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
        await generateQuoteCard(data, outputPath);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

module.exports = { generateQuoteCard };

if (require.main === module) {
    main();
}

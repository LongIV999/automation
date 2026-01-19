const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;

async function snapshot() {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 2 });

    const filePath = 'file://' + path.resolve('scripts/carousel-generator/templates/custom-styles/head-silhouette.html');
    await page.goto(filePath, { waitUntil: 'networkidle0' });

    const outputDir = 'output/infographic-custom';
    await fs.mkdir(outputDir, { recursive: true });
    await page.screenshot({ path: path.join(outputDir, '01.png') });

    console.log('Snapshot saved to output/infographic-custom/01.png');
    await browser.close();
}

snapshot();

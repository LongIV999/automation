/**
 * Image Enhancer Utility
 * 
 * Follows the guidelines from: skill/content-research-writer/image-enhancer/SKILL.md
 * Uses Puppeteer to re-render images with better quality and sharpening filters.
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function enhanceImagesInDirectory(directory) {
    console.log(`\n✨ Enhancing images in: ${directory}`);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox'],
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    });

    try {
        const page = await browser.newPage();
        const files = await fs.readdir(directory);
        const images = files.filter(f => f.match(/\.(png|jpg|jpeg)$/i) && !f.includes('-enhanced'));

        for (const file of images) {
            const filePath = path.join(directory, file);
            const outputPath = path.join(directory, file.replace(/\.(png|jpg|jpeg)$/i, '-enhanced.png'));

            console.log(`🪄  Processing ${file}...`);

            // Read image as base64
            const data = await fs.readFile(filePath);
            const base64 = data.toString('base64');
            const mimeType = file.endsWith('.png') ? 'image/png' : 'image/jpeg';

            // HTML to process the image
            const html = `
                <!DOCTYPE html>
                <html>
                <style>
                    body { margin: 0; padding: 0; background: transparent; overflow: hidden; }
                    img { 
                        display: block; 
                        width: 100%; 
                        height: auto;
                        filter: contrast(1.05) brightness(1.02) saturate(1.05);
                        image-rendering: -webkit-optimize-contrast;
                    }
                </style>
                <body>
                    <img src="data:${mimeType};base64,${base64}" />
                </body>
                </html>
            `;

            // Get image dimensions
            await page.setContent(html);
            const dimensions = await page.evaluate(() => {
                const img = document.querySelector('img');
                return {
                    width: img.naturalWidth,
                    height: img.naturalHeight
                };
            });

            await page.setViewport({
                width: dimensions.width,
                height: dimensions.height,
                deviceScaleFactor: 2 // Boost detail
            });

            await page.screenshot({
                path: outputPath,
                type: 'png',
                omitBackground: true
            });

            // Replace original with enhanced
            await fs.rename(outputPath, filePath);
            console.log(`✅ ${file} enhanced and overriden.`);
        }

    } catch (error) {
        console.error('❌ Error enhancing images:', error);
    } finally {
        await browser.close();
    }
}

if (require.main === module) {
    const dir = process.argv[2];
    if (!dir) {
        console.error('Usage: node enhancer.js <directory>');
        process.exit(1);
    }
    enhanceImagesInDirectory(dir);
}

module.exports = { enhanceImagesInDirectory };

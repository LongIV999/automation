const puppeteer = require('puppeteer');
(async () => {
    try {
        console.log('Launching browser...');
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox'],
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
        });
        console.log('Browser launched!');
        const page = await browser.newPage();
        await page.goto('https://example.com');
        console.log('Title:', await page.title());
        await browser.close();
        console.log('Browser closed!');
    } catch (err) {
        console.error('Error:', err);
    }
})();

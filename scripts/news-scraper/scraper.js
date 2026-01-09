const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const CONFIG = {
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    targets: [
        {
            name: 'cafef',
            url: 'https://cafef.vn/bat-dong-san.chn',
            selector: '.tlitem',
            map: {
                title: 'h3 a',
                link: 'h3 a',
                excerpt: '.sapo',
                image: 'img'
            }
        },
        {
            name: 'batdongsan',
            url: 'https://batdongsan.com.vn/tin-thi-truong',
            selector: '.re__article-item',
            map: {
                title: '.re__article-item-title a',
                link: '.re__article-item-title a',
                excerpt: '.re__article-item-description',
                image: 'img'
            }
        }
    ],
    outputFile: path.join(__dirname, 'scraped_news.json')
};

async function scrapeNews() {
    console.log('🚀 Starting news scraping...');
    const browser = await puppeteer.launch({
        headless: 'new',
        executablePath: CONFIG.executablePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const results = [];

    try {
        const page = await browser.newPage();
        // Set a realistic user agent
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        for (const target of CONFIG.targets) {
            console.log(`📡 Scraping ${target.name}...`);
            try {
                await page.goto(target.url, { waitUntil: 'networkidle2', timeout: 60000 });

                const newsItems = await page.evaluate((target) => {
                    const items = Array.from(document.querySelectorAll(target.selector));
                    return items.slice(0, 5).map(item => {
                        const titleEl = item.querySelector(target.map.title);
                        const excerptEl = item.querySelector(target.map.excerpt);
                        const imgEl = item.querySelector(target.map.image);

                        return {
                            source: target.name,
                            title: titleEl ? titleEl.innerText.trim() : '',
                            link: titleEl ? (titleEl.href.startsWith('http') ? titleEl.href : window.location.origin + titleEl.getAttribute('href')) : '',
                            excerpt: excerptEl ? excerptEl.innerText.trim() : '',
                            image: imgEl ? imgEl.src : '',
                            scrapedAt: new Date().toISOString()
                        };
                    });
                }, target);

                results.push(...newsItems);
                console.log(`✅ Found ${newsItems.length} items from ${target.name}`);
            } catch (err) {
                console.error(`❌ Failed to scrape ${target.name}:`, err.message);
            }
        }

        await fs.writeFile(CONFIG.outputFile, JSON.stringify(results, null, 2));
        console.log(`🎉 Scraping complete! Saved to ${CONFIG.outputFile}`);

    } catch (error) {
        console.error('❌ Error during scraping:', error);
    } finally {
        await browser.close();
    }
}

if (require.main === module) {
    scrapeNews();
}

module.exports = scrapeNews;

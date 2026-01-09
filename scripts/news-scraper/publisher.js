const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const DATA_DIR = path.join(__dirname, '../../data');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');
const SCRAPED_FILE = path.join(__dirname, 'scraped_news.json');

async function publishNews() {
    console.log('📝 Starting news processing and publishing...');

    try {
        // Ensure data directory exists
        await fs.mkdir(DATA_DIR, { recursive: true });

        // Read scraped news
        const rawData = await fs.readFile(SCRAPED_FILE, 'utf-8');
        const newsItems = JSON.parse(rawData);

        // Load existing articles
        let existingArticles = [];
        try {
            const existingData = await fs.readFile(ARTICLES_FILE, 'utf-8');
            existingArticles = JSON.parse(existingData);
        } catch (e) {
            console.log('Creating new articles.json');
        }

        const publishedCount = 0;
        const newArticles = [];

        for (const item of newsItems) {
            // Check if already exists (by link)
            if (existingArticles.some(a => a.link === item.link)) {
                continue;
            }

            console.log(`✨ Processing article: ${item.title}`);

            // SIMULATED AI ANALYSIS (Thach Vu Analysis)
            // In a real scenario, this would call Anthropic/OpenAI API
            const analysis = `Phân tích từ Thạch Vũ: Đây là một thông tin quan trọng cho thị trường bất động sản. Việc ${item.title.toLowerCase()} cho thấy xu hướng dịch chuyển dòng vốn đang rõ nét hơn. Nhà đầu tư nên chú ý đến khu vực này.`;

            const article = {
                id: `news_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                title: item.title,
                original_link: item.link,
                excerpt: item.excerpt,
                image: item.image,
                analysis: analysis,
                content: item.excerpt + "\n\n" + analysis,
                published_at: new Date().toISOString(),
                source: item.source,
                status: 'published'
            };

            newArticles.push(article);
        }

        if (newArticles.length > 0) {
            const updatedArticles = [...newArticles, ...existingArticles].slice(0, 100); // Keep last 100
            await fs.writeFile(ARTICLES_FILE, JSON.stringify(updatedArticles, null, 2));
            console.log(`✅ Successfully published ${newArticles.length} new articles to data/articles.json`);
        } else {
            console.log('ℹ No new articles to publish.');
        }

        // Trigger generate_data.py if it exists (simulated)
        const generateScript = path.join(__dirname, '../generate_data.py');
        try {
            await fs.access(generateScript);
            console.log('🔄 Triggering generate_data.py...');
            // exec('python3 ' + generateScript)
        } catch (e) {
            console.log('ℹ generate_data.py not found, skipping sync.');
        }

    } catch (error) {
        console.error('❌ Error during publishing:', error);
    }
}

if (require.main === module) {
    publishNews();
}

module.exports = publishNews;

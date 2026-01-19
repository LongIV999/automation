const fs = require('fs');
const path = require('path');
const { generateNotebookLMPost } = require('./formats/notebooklm-post');

const outputDir = path.join(__dirname, '../../output/queennailbern-posts-new');

// Queen Nail Bern posts với màu pink theme theo website queennailsbern.com
const posts = [
    {
        headline: "✨ Winter Nail Trends 2024",
        bodyText: "Khám phá xu hướng nail mùa đông 2024 tại Queen Nail Bern! Từ màu nude pastel đến dark tones sang trọng, chúng tôi mang đến những thiết kế mới nhất cho bạn.",
        ctaText: "Đặt lịch ngay",
        topic: "WINTER TRENDS",
        colors: {
            primary: "#FF69B4", // Hot Pink
            secondary: "#FFB6C1", // Light Pink  
            accent: "#FF1493"   // Deep Pink
        }
    },
    {
        headline: "🌸 Pink Valentine Collection",
        bodyText: "Tôn vinh ngày Valentine với bộ sưu tập nail hồng bừng sáng! Màu pink ngọt ngào, thiết kế lãng mạn cho ngày đặc biệt của bạn.",
        ctaText: "Booking ngay",
        topic: "VALENTINE SPECIAL",
        colors: {
            primary: "#FFC0CB", // Pink
            secondary: "#FFDAB9", // Peach Puff
            accent: "#FF69B4"   // Hot Pink
        }
    },
    {
        headline: "💅 Gel Nails Premium Quality",
        bodyText: "Gel nails chất lượng cao tại Queen Nail Bern! Bền màu, không móng, giữ được từ 3-4 tuần. Đầu tư cho vẻ đẹp của bạn!",
        ctaText: "Thử ngay",
        topic: "PREMIUM SERVICE",
        colors: {
            primary: "#FFB6C1", // Light Pink
            secondary: "#FFF0F5", // Lavender Blush
            accent: "#C71585"   // Medium Violet Red
        }
    },
    {
        headline: "👑 Queen Treatment Package",
        bodyText: "Gói chăm sóc toàn diện từ Queen Nail Bern! Manicure + pedicure + gel nails trong một buổi. Giảm 10% cho khách hàng mới!",
        ctaText: "Liên hệ",
        topic: "SPECIAL OFFER",
        colors: {
            primary: "#FF69B4", // Hot Pink
            secondary: "#FFE4E1", // Misty Rose
            accent: "#DB7093"   // Pale Violet Red
        }
    },
    {
        headline: "💖 Lash Extension Artistry",
        bodyText: "Nối mi chuyên nghệ nghệ tại Queen Nail Bern! Từ classic đến volume, tạo đôi mắt to tròn, cuốn hút tự nhiên.",
        ctaText: "Đặt lịch",
        topic: "LASH SERVICE",
        colors: {
            primary: "#FFB6C1", // Light Pink
            secondary: "#F0E68C", // Khaki
            accent: "#FF69B4"   // Hot Pink
        }
    },
    {
        headline: "🌸 Spring Blossom Nails 2025",
        bodyText: "Chào đón mùa xuân với bộ sưu tập nail hoa nở rộ! Thiết kế tinh tế, màu sắc tươi sáng, mang lại vẻ đẹp tự nhiên và quyến rũ.",
        ctaText: "Xem bộ sưu tập",
        topic: "SPRING COLLECTION",
        colors: {
            primary: "#FF69B4", // Hot Pink
            secondary: "#98FB98", // Pale Green
            accent: "#FFD700"   // Gold
        }
    },
    {
        headline: "💅 French Manicure Elegance",
        bodyText: "French manicure cổ điển với twist hiện đại tại Queen Nail Bern! Đường viền tinh xảo, màu nude sang trọng, phù hợp mọi dịp.",
        ctaText: "Đặt lịch French",
        topic: "FRENCH MANICURE",
        colors: {
            primary: "#F5F5DC", // Beige
            secondary: "#FFF8DC", // Cream
            accent: "#C0C0C0"   // Silver
        }
    },
    {
        headline: "🎨 Nail Art for Beginners",
        bodyText: "Học vẽ nail art dễ dàng tại Queen Nail Bern! Từ những mẫu cơ bản đến phức tạp, đội ngũ chuyên nghiệp hướng dẫn từng bước.",
        ctaText: "Tham gia workshop",
        topic: "NAIL ART TUTORIAL",
        colors: {
            primary: "#FFB6C1", // Light Pink
            secondary: "#E6E6FA", // Lavender
            accent: "#FF4500"   // Orange Red
        }
    },
    {
        headline: "💎 Luxury Spa Treatments",
        bodyText: "Trải nghiệm spa chăm sóc móng cao cấp! Paraffin wax, massage tay chân, dưỡng chất chuyên sâu cho làn da mịn màng.",
        ctaText: "Đặt gói spa",
        topic: "LUXURY SPA",
        colors: {
            primary: "#FFDAB9", // Peach Puff
            secondary: "#F0E68C", // Khaki
            accent: "#DDA0DD"   // Plum
        }
    },
    {
        headline: "🌈 Rainbow Summer Nails",
        bodyText: "Mùa hè rực rỡ với nail cầu vồng đầy màu sắc! Thiết kế vui tươi, năng động, thể hiện cá tính của bạn.",
        ctaText: "Tạo nail cầu vồng",
        topic: "SUMMER RAINBOW",
        colors: {
            primary: "#FF0000", // Red
            secondary: "#FFA500", // Orange
            accent: "#FFFF00"   // Yellow
        }
    }
];

// Custom màu hồng cho Queen Nail Bern theo website
const QUEENNAIL_PINK_THEME = {
    background: '#FFF0F5', // Lavender Blush
    primary: '#FF69B4',    // Hot Pink  
    secondary: '#FFB6C1',  // Light Pink
    accent: '#FF1493',     // Deep Pink
    text: '#8B0000',       // Dark Red (để tương phản với nền hồng)
    gradient: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)'
};

async function generateQueenNailPost(post, outputPath) {
    try {
        // Tạo HTML content với pink theme
        const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.headline}</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Montserrat', sans-serif;
            background: ${QUEENNAIL_PINK_THEME.background};
            color: ${QUEENNAIL_PINK_THEME.text};
            overflow: hidden;
        }
        
        .container {
            width: 1080px;
            height: 1080px;
            margin: 0;
            padding: 60px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #FFE4E1 0%, #FFB6C1 50%, #FF69B4 100%);
            position: relative;
            overflow: hidden;
        }
        
        .container::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 20px 20px;
            animation: float 20s linear infinite;
        }
        
        .content {
            text-align: center;
            z-index: 1;
            max-width: 90%;
        }
        
        .topic {
            font-family: 'Montserrat', sans-serif;
            font-size: 24px;
            font-weight: 600;
            color: #8B0000;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 2px;
            background: rgba(255, 255, 255, 0.7);
            padding: 8px 20px;
            border-radius: 30px;
            display: inline-block;
            backdrop-filter: blur(10px);
        }
        
        .headline {
            font-family: 'Playfair Display', serif;
            font-size: 64px;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 30px;
            color: #8B0000;
            text-shadow: 2px 2px 4px rgba(139, 0, 0, 0.1);
        }
        
        .body {
            font-family: 'Montserrat', sans-serif;
            font-size: 20px;
            line-height: 1.6;
            margin-bottom: 40px;
            color: #8B0000;
            background: rgba(255, 255, 255, 0.8);
            padding: 25px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        
        .cta {
            font-family: 'Montserrat', sans-serif;
            font-size: 24px;
            font-weight: 600;
            background: #FF1493;
            color: white;
            padding: 15px 40px;
            border-radius: 50px;
            text-decoration: none;
            display: inline-block;
            box-shadow: 0 10px 30px rgba(255, 20, 147, 0.3);
            transition: all 0.3s ease;
            border: 3px solid white;
        }
        
        .cta:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(255, 20, 147, 0.4);
            background: #FF69B4;
        }
        
        .decorator {
            position: absolute;
            font-size: 120px;
            opacity: 0.1;
            z-index: 0;
        }
        
        .decorator-1 {
            top: 50px;
            left: 50px;
        }
        
        .decorator-2 {
            bottom: 50px;
            right: 50px;
        }
        
        .logo {
            position: absolute;
            bottom: 30px;
            font-family: 'Playfair Display', serif;
            font-size: 18px;
            color: #8B0000;
            font-weight: 700;
        }
        
        @keyframes float {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Additional pink elements */
        .sparkle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
            animation: twinkle 3s infinite;
        }
        
        @keyframes twinkle {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="decorator decorator-1">💅</div>
        <div class="decorator decorator-2">💖</div>
        
        <!-- Sparkles -->
        <div class="sparkle" style="top: 20%; left: 15%; animation-delay: 0s;"></div>
        <div class="sparkle" style="top: 30%; right: 20%; animation-delay: 1s;"></div>
        <div class="sparkle" style="bottom: 25%; left: 25%; animation-delay: 2s;"></div>
        <div class="sparkle" style="top: 60%; right: 30%; animation-delay: 1.5s;"></div>
        
        <div class="content">
            <div class="topic">${post.topic}</div>
            <h1 class="headline">${post.headline}</h1>
            <div class="body">${post.bodyText}</div>
            <div class="cta">${post.ctaText}</div>
        </div>
        
        <div class="logo">Queen Nail Bern 💅</div>
    </div>
</body>
</html>
        `;
        
        // Ghi HTML content vào file để debug
        const htmlPath = outputPath.replace('.png', '.html');
        fs.writeFileSync(htmlPath, htmlContent);
        
        // Generate image từ HTML
        const puppeteer = require('puppeteer');
        const browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        await page.setViewport({ width: 1080, height: 1080 });
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        await page.screenshot({
            path: outputPath,
            type: 'png',
            fullPage: false
        });
        
        await browser.close();
        
        // Clean up HTML file
        fs.unlinkSync(htmlPath);
        
        console.log(`✅ Generated Queen Nail Bern post: ${post.headline}`);
        
    } catch (error) {
        console.error(`❌ Error generating post: ${post.headline}`, error);
        throw error;
    }
}

async function runQueenNailGeneration() {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`🌸 Starting Queen Nail Bern batch generation with pink theme...`);
    console.log(`📁 Output directory: ${outputDir}`);
    console.log(`📋 Generating ${posts.length} posts...\n`);

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        const filename = `queennailbern-${i + 1}-${post.headline.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
        const outputPath = path.join(outputDir, filename);

        console.log(`📸 Generating post ${i + 1}/${posts.length}: ${post.headline}`);
        
        try {
            await generateQueenNailPost(post, outputPath);
            console.log(`✅ Saved to: ${outputPath}`);
        } catch (error) {
            console.error(`❌ Error generating post ${i + 1}:`, error);
        }
        
        // Thêm delay giữa các posts để tránh quá tải
        if (i < posts.length - 1) {
            console.log(`⏳ Waiting 2 seconds before next post...\n`);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    console.log(`\n🎉 Queen Nail Bern batch generation complete!`);
    console.log(`📂 All files saved to: ${outputDir}`);
    console.log(`🌸 Pink theme applied from queennailsbern.com inspiration\n`);
    
    // List generated files
    const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.png'));
    console.log(`📸 Generated ${files.length} images:`);
    files.forEach(file => console.log(`   - ${file}`));
}

// Run the generation
if (require.main === module) {
    runQueenNailGeneration().catch(error => {
        console.error('❌ Batch generation failed:', error);
        process.exit(1);
    });
}

module.exports = { generateQueenNailPost, runQueenNailGeneration, posts, QUEENNAIL_PINK_THEME };
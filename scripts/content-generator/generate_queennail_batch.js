const fs = require('fs');
const path = require('path');
const { generateSinglePost } = require('./formats/single-post');

const outputDir = path.join(__dirname, '../../output/queennail-recruitment');

const commonBody = "Gia nhập đội ngũ Queen Nail Bern – Salon chuyên nghiệp tại trung tâm thủ đô Bern, Thụy Sĩ.";
const commonCTA = "Inbox/Hotline: +41 79 805 00 68";

const posts = [
    {
        headline: "THU NHẬP 5.500 - 6.000 CHF",
        bodyText: "Mức lương hấp dẫn tùy theo năng lực. Cơ hội làm việc tại thủ đô Bern với thu nhập ổn định và cao.",
        ctaText: "Ứng tuyển ngay",
        topic: "CƠ HỘI NGHỀ NGHIỆP",
        brand: "queennailbern"
    },
    {
        headline: "TUYỂN DỤNG TẠI BERN",
        bodyText: "Queen Nails & Lashes tìm kiếm cộng sự tài năng. Làm việc tại Kramgasse 37, 3011 Bern.",
        ctaText: "Hotline: 079 805 00 68",
        topic: "RECRUITMENT",
        brand: "queennailbern"
    },
    {
        headline: "HỖ TRỢ CHỖ Ở & GIẤY TỜ",
        bodyText: "Chúng tôi hỗ trợ hoàn thiện thủ tục pháp lý và sắp xếp chỗ ở tiện nghi cho nhân viên ở xa.",
        ctaText: "Gia nhập ngay",
        topic: "ĐÃI NGỘ TỐT",
        brand: "queennailbern"
    },
    {
        headline: "MÔI TRƯỜNG CHUYÊN NGHIỆP",
        bodyText: "Salon sang trọng, thiết bị hiện đại, lượng khách ổn định. Nơi lý tưởng để phát triển nghề nghiệp lâu dài.",
        ctaText: "Gửi hồ sơ ngay",
        topic: "QUEEN NAIL BERN",
        brand: "queennailbern"
    },
    {
        headline: "YÊU CẦU: THÀNH THẠO BỘT & GEL",
        bodyText: "Tìm kiếm ứng viên tỉ mỉ, có trách nhiệm, thành thạo kỹ thuật Acrylic và Gel.",
        ctaText: "Liên hệ ngay",
        topic: "KỸ NĂNG",
        brand: "queennailbern"
    }
];

async function runsearch() {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        const filename = `queennail-recruit-${i + 1}.png`;
        const outputPath = path.join(outputDir, filename);

        console.log(`Generating post ${i + 1}: ${post.headline}`);
        try {
            await generateSinglePost(post, outputPath);
            console.log(`Saved to: ${outputPath}`);
        } catch (error) {
            console.error(`Error generating post ${i + 1}:`, error);
        }
    }
    console.log("Batch generation complete!");
}

runsearch();

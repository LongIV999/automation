const fs = require('fs');
const path = require('path');
const { generateSinglePost } = require('./formats/single-post'); // Adjust path as needed

const outputDir = path.join(__dirname, '../../output/veo4-posts'); // /Users/admin/automation/output/veo4-posts

const posts = [
    {
        headline: "Veo 4: Chất lượng video 4K siêu thực",
        bodyText: "Tạo video độ phân giải cao với chi tiết sắc nét chưa từng có. Veo 4 nâng tầm chất lượng hình ảnh, đáp ứng tiêu chuẩn điện ảnh chuyên nghiệp.",
        ctaText: "Trải nghiệm ngay",
        topic: "AI Video"
    },
    {
        headline: "Hiểu ngữ cảnh chính xác tuyệt đối",
        bodyText: "Veo 4 không chỉ hiểu prompt, mà còn nắm bắt được ý đồ nghệ thuật của bạn. Mọi chuyển động, ánh sáng đều được tái hiện đúng như tưởng tượng.",
        ctaText: "Khám phá",
        topic: "New Features"
    },
    {
        headline: "Tốc độ tạo video nhanh gấp 2 lần",
        bodyText: "Tiết kiệm thời gian quý báu với khả năng render siêu tốc. Veo 4 giúp bạn hiện thực hóa ý tưởng chỉ trong tích tắc.",
        ctaText: "Thử ngay",
        topic: "Performance"
    },
    {
        headline: "Chỉnh sửa video bằng ngôn ngữ tự nhiên",
        bodyText: "Không cần kỹ năng dựng phim phức tạp. Chỉ cần ra lệnh bằng văn bản, Veo 4 sẽ tự động cắt ghép, thêm hiệu ứng theo ý muốn.",
        ctaText: "Xem demo",
        topic: "Editing"
    },
    {
        headline: "Video dài hơn, câu chuyện trọn vẹn hơn",
        bodyText: "Vượt qua giới hạn độ dài cũ. Veo 4 cho phép tạo các video clip dài hơn, giúp bạn kể câu chuyện của mình một cách liền mạch và đầy đủ.",
        ctaText: "Sáng tạo ngay",
        topic: "Update"
    }
];

async function runsearch() {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        const filename = `veo4-post-${i + 1}.png`;
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

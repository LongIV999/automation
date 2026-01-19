const fs = require('fs');
const path = require('path');
const { generateNotebookLMPost } = require('./formats/notebooklm-post');

const outputDir = path.join(__dirname, '../../output/veo4-posts-notebooklm'); // distinct folder

const posts = [
    {
        headline: "Veo 4: 4K Cinema Quality",
        bodyText: "Tạo video độ phân giải cao với chi tiết sắc nét chưa từng có. Veo 4 nâng tầm chất lượng hình ảnh, đáp ứng tiêu chuẩn điện ảnh.",
        ctaText: "Trải nghiệm ngay",
        topic: "AI VIDEO GENERATION"
    },
    {
        headline: "Context Awareness",
        bodyText: "Veo 4 không chỉ hiểu prompt, mà còn nắm bắt được ý đồ nghệ thuật. Mọi chuyển động, ánh sáng đều được tái hiện đúng như tưởng tượng.",
        ctaText: "Khám phá",
        topic: "SMARTER AI MODEL"
    },
    {
        headline: "2x Generation Speed",
        bodyText: "Tiết kiệm thời gian quý báu với khả năng render siêu tốc. Veo 4 giúp bạn hiện thực hóa ý tưởng chỉ trong tích tắc.",
        ctaText: "Thử ngay",
        topic: "PERFORMANCE UPDATE"
    },
    {
        headline: "Natural Language Edit",
        bodyText: "Không cần kỹ năng dựng phim phức tạp. Chỉ cần ra lệnh bằng văn bản, Veo 4 sẽ tự động cắt ghép, thêm hiệu ứng theo ý muốn.",
        ctaText: "Xem demo",
        topic: "EDITING WORKFLOW"
    },
    {
        headline: "Long-form Storytelling",
        bodyText: "Vượt qua giới hạn độ dài cũ. Veo 4 cho phép tạo các video clip dài hơn, giúp bạn kể câu chuyện của mình một cách liền mạch.",
        ctaText: "Sáng tạo ngay",
        topic: "CONTENT CREATION"
    }
];

async function runsearch() {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        const filename = `veo4-notebooklm-post-${i + 1}.png`;
        const outputPath = path.join(outputDir, filename);

        console.log(`Generating post ${i + 1}: ${post.headline}`);
        try {
            await generateNotebookLMPost(post, outputPath);
            console.log(`Saved to: ${outputPath}`);
        } catch (error) {
            console.error(`Error generating post ${i + 1}:`, error);
        }
    }
    console.log("Batch generation complete!");
}

runsearch();

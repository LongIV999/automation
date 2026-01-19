const fs = require('fs');
const path = require('path');
const { generateQuoteCard } = require('./formats/quote-card');

const outputDir = path.join(__dirname, '../../output/claude-code-2025');

const quotes = [
    {
        quoteText: "Claude Code 2025 không chỉ viết mã, nó kiến tạo phần mềm. Từ ý tưởng sơ khởi đến sản phẩm hoàn thiện chỉ trong một câu lệnh.",
        author: "Long Best AI",
        authorTitle: "Tech Insights",
        topic: "Autonomous Coding"
    },
    {
        quoteText: "Khả năng thấu hiểu ngữ cảnh vô hạn (Infinite Context) giúp Claude Code 'hồi sinh' và tối ưu hóa các hệ thống legacy phức tạp nhất trong tích tắc.",
        author: "Long Best AI",
        authorTitle: "Tech Insights",
        topic: "Legacy Modernization"
    },
    {
        quoteText: "Lập trình cặp cùng Claude Code mang lại cảm giác như có một kỹ sư Senior ngồi ngay bên cạnh, dự đoán và hoàn thiện logic của bạn theo thời gian thực.",
        author: "Long Best AI",
        authorTitle: "Tech Insights",
        topic: "Real-time Collaboration"
    },
    {
        quoteText: "Với kiến trúc Self-Healing, Claude Code tự động phát hiện lỗ hổng và vá lỗi bảo mật ngay khi chúng xuất hiện, đảm bảo an toàn tuyệt đối.",
        author: "Long Best AI",
        authorTitle: "Tech Insights",
        topic: "Security First"
    },
    {
        quoteText: "Chỉ cần vẽ sơ đồ trên bảng trắng, Claude Code sẽ chuyển đổi nó thành kiến trúc Microservices hoàn chỉnh. Sức mạnh Multimodal chưa từng có.",
        author: "Long Best AI",
        authorTitle: "Tech Insights",
        topic: "Multimodal Engineering"
    }
];

async function generateBatch() {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`Starting generation for ${quotes.length} cards...`);

    for (let i = 0; i < quotes.length; i++) {
        const item = quotes[i];
        const filename = `claude-code-2025-${i + 1}.png`;
        const outputPath = path.join(outputDir, filename);

        console.log(`Generating card ${i + 1}: ${item.topic}`);
        try {
            await generateQuoteCard(item, outputPath);
            console.log(`Saved to: ${outputPath}`);
        } catch (error) {
            console.error(`Error generating card ${i + 1}:`, error);
        }
    }
    console.log("Creation complete! Check the output directory.");
}

generateBatch();

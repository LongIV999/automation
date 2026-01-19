const fs = require('fs');
const path = require('path');
const { generateSinglePost } = require('./formats/single-post');

const outputDir = path.join(__dirname, '../../output/opencode-models');

const posts = [
    {
        headline: "Đa Mô Hình: Sức Mạnh 'Hợp Thể' Trong OpenCode",
        bodyText: "Tại sao phải chọn một khi bạn có thể dùng tất cả? OpenCode cho phép kết hợp Claude 3.5 Sonnet để code logic phức tạp và GPT-4o để sáng tạo nội dung, tối ưu hóa mọi khía cạnh của dự án.",
        ctaText: "Thử ngay",
        topic: "Multi-Model Mastery"
    },
    {
        headline: "Local LLMs: Code Riêng Tư Tuyệt Đối",
        bodyText: "Bảo mật mã nguồn tối đa bằng cách chạy models cục bộ qua Ollama ngay trong OpenCode. Sử dụng Llama 3 hoặc DeepSeek Coder mà không cần gửi một dòng code nào ra internet.",
        ctaText: "Khám phá",
        topic: "Privacy First"
    },
    {
        headline: "OpenCode Zen: Sự Lựa Chọn Của Chuyên Gia",
        bodyText: "Bạn bị choáng ngợp bởi hàng trăm models? Chế độ 'Zen' cung cấp danh sách models được đội ngũ OpenCode tinh chọn và kiểm thử kỹ lưỡng, đảm bảo hiệu năng cao nhất cho từng tác vụ.",
        ctaText: "Tìm hiểu thêm",
        topic: "OpenCode Zen"
    },
    {
        headline: "Tối Ưu Chi Phí Với Các 'Tiểu Model'",
        bodyText: "Không phải task nào cũng cần 'siêu trí tuệ'. Chuyển đổi linh hoạt sang GPT-4o Mini hoặc Claude Haiku cho các tác vụ đơn giản như fix bug nhỏ hay viết docs để tiết kiệm chi phí vận hành.",
        ctaText: "Xem chi tiết",
        topic: "Cost Efficiency"
    },
    {
        headline: "Gemini 1.5 Pro: Bộ Nhớ Siêu Phàm",
        bodyText: "Với cửa sổ ngữ cảnh khổng lồ, Gemini 1.5 Pro trong OpenCode có thể 'đọc' và hiểu toàn bộ repository của bạn cùng lúc. Tạm biệt nỗi lo quên context khi dự án phình to.",
        ctaText: "Trải nghiệm",
        topic: "Infinite Context"
    }
];

async function generateBatch() {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`Starting generation for ${posts.length} posts...`);

    for (let i = 0; i < posts.length; i++) {
        const item = posts[i];
        const filename = `opencode-model-${i + 1}.png`;
        const outputPath = path.join(outputDir, filename);

        console.log(`Generating post ${i + 1}: ${item.topic}`);
        try {
            await generateSinglePost(item, outputPath);
            console.log(`Saved to: ${outputPath}`);
        } catch (error) {
            console.error(`Error generating post ${i + 1}:`, error);
        }
    }
    console.log("Creation complete! Check the output directory.");
}

generateBatch();

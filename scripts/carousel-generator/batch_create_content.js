
const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, 'content');

if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir);
}

const topics = [
    {
        filename: 'nano-banana-portrait-prompts.json',
        data: {
            title: "Top 7 Nano Banana Prompts Cho Portrait Photography",
            author: "Nano Banana",
            slides: [
                { type: "title", headline: "Top 7 Nano Banana Prompts", subheadline: "Tuyệt kĩ chụp ảnh chân dung AI siêu thực" },
                { type: "content", headline: "1. Cinematic Lighting", subheadline: "Ánh sáng điện ảnh", content: "Prompt: 'Hyper-realistic portrait, cinematic lighting, dramatic shadows, 8k resolution, detailed texture.'\nKết quả: Ảnh có chiều sâu, ánh sáng ấn tượng như phim." },
                { type: "content", headline: "2. Studio Headshot", subheadline: "Chân dung Studio", content: "Prompt: 'Professional headshot, studio lighting, neutral background, sharp focus, high definition.'\nKết quả: Ảnh profile chuyên nghiệp, sắc nét." },
                { type: "content", headline: "3. Outdoor Natural", subheadline: "Ánh sáng tự nhiên", content: "Prompt: 'Portrait of a woman in a park, golden hour sunlight, bokeh background, natural smile, candid style.'\nKết quả: Ảnh tươi sáng, tự nhiên, nền xóa phông đẹp." },
                { type: "content", headline: "4. Cyberpunk Style", subheadline: "Phong cách tương lai", content: "Prompt: 'Cyberpunk portrait, neon lights, futuristic fashion, glowing accessories, rainy city background.'\nKết quả: Ảnh phong cách Sci-fi, màu sắc neon nổi bật." },
                { type: "content", headline: "5. Vintage Film", subheadline: "Màu phim cổ điển", content: "Prompt: 'Vintage film portrait, grain texture, faded colors, nostalgic vibe, 1980s fashion.'\nKết quả: Ảnh mang hoài niệm, màu retro." },
                { type: "list", headline: "Mẹo Tối Ưu Prompt", content: ["Thêm từ khóa ánh sáng (lighting)", "Chỉ định rõ góc máy (angle)", "Mô tả chi tiết trang phục (clothing)", "Sử dụng tỉ lệ khung hình phù hợp (--ar)"] },
                { type: "cta", headline: "Thử Ngay!", content: "Follow Nano Banana để cập nhật thêm nhiều prompt xịn sò!" }
            ]
        }
    },
    {
        filename: 'product-photos-nano-banana.json',
        data: {
            title: "Tạo Product Photos Chuyên Nghiệp Với Nano Banana",
            author: "Nano Banana",
            slides: [
                { type: "title", headline: "Product Photos Đỉnh Cao", subheadline: "Chụp ảnh sản phẩm không cần Studio với Nano Banana" },
                { type: "content", headline: "Tại sao dùng AI?", subheadline: "Tiết kiệm chi phí & thời gian", content: "Không cần thuê studio, nhiếp ảnh gia hay mua thiết bị đắt tiền. Chỉ cần Nano Banana và ý tưởng của bạn." },
                { type: "content", headline: "Bước 1: Chuẩn bị", subheadline: "Hình ảnh gốc", content: "Chụp ảnh sản phẩm rõ nét trên nền trắng hoặc tách nền sẵn. Đảm bảo ánh sáng đều." },
                { type: "content", headline: "Bước 2: Viết Prompt", subheadline: "Mô tả bối cảnh", content: "Ví dụ: 'Product photography of a perfume bottle on a marble table, surrounded by flowers, soft sunlight, elegant atmosphere.'" },
                { type: "content", headline: "Bước 3: Inpainting/Editing", subheadline: "Chỉnh sửa chi tiết", content: "Sử dụng tính năng Inpainting để thay đổi nền hoặc thêm bớt chi tiết nhỏ cho hoàn hảo." },
                { type: "list", headline: "Lợi ích", content: ["Tốc độ cực nhanh", "Đa dạng bối cảnh", "Chi phí thấp", "Chất lượng cao 4K"] },
                { type: "cta", headline: "Bắt đầu ngay!", content: "Tạo bộ ảnh sản phẩm đầu tiên của bạn với Nano Banana hôm nay!" }
            ]
        }
    },
    {
        filename: 'nano-banana-vs-midjourney.json',
        data: {
            title: "Nano Banana vs MidJourney: So Sánh Chi Tiết",
            author: "Top Review",
            slides: [
                { type: "title", headline: "Nano Banana vs MidJourney", subheadline: "Đại chiến AI tạo ảnh: Ai là vua?" },
                { type: "content", headline: "Khả năng tạo ảnh", subheadline: "Chất lượng & Phong cách", content: "MidJourney: Nghệ thuật, bay bổng, trừu tượng tốt.\nNano Banana: Chân thực, bám sát prompt, tối ưu cho thương mại." },
                { type: "content", headline: "Dễ sử dụng", subheadline: "Thân thiện người dùng", content: "MidJourney: Cần dùng Discord, lệnh phức tạp.\nNano Banana: Giao diện Web/App trực quan, dễ thao tác." },
                { type: "content", headline: "Tốc độ & Chi phí", subheadline: "Hiệu quả đầu tư", content: "MidJourney: Gói tháng khá cao, tốc độ trung bình.\nNano Banana: Chi phí linh hoạt, tốc độ render nhanh." },
                { type: "list", headline: "Nên chọn cái nào?", content: ["Chọn MidJourney nếu làm Art/Concept", "Chọn Nano Banana nếu làm MarCom/Product", "Cả hai đều mạnh mẽ theo cách riêng"] },
                { type: "cta", headline: "Bạn chọn team nào?", content: "Comment bên dưới để chia sẻ ý kiến của bạn nhé!" }
            ]
        }
    },
    {
        filename: 'fashion-photography-ai-2026.json',
        data: {
            title: "Fashion Photography AI: Xu Hướng 2026",
            author: "Trend Hunter",
            slides: [
                { type: "title", headline: "Fashion AI 2026", subheadline: "Tương lai nhiếp ảnh thời trang" },
                { type: "content", headline: "Siêu Thực (Hyper-realism)", subheadline: "Thật hơn cả thật", content: "AI tạo ra người mẫu ảo không thể phân biệt với người thật, da dẻ, tóc tai hoàn hảo." },
                { type: "content", headline: "Cá Nhân Hóa", subheadline: "Thời trang theo yêu cầu", content: "Khách hàng có thể 'mặc thử' đồ online trên chính avatar AI của mình trước khi mua." },
                { type: "content", headline: "Bối Cảnh Vô Hạn", subheadline: "Sáng tạo không giới hạn", content: "Chụp ảnh tại sao Hỏa hay dưới đáy đại dương chỉ trong 1 nốt nhạc." },
                { type: "list", headline: "Cơ hội cho Brand", content: ["Giảm chi phí Lookbook", "Tăng trải nghiệm khách hàng", "Thử nghiệm mẫu thiết kế nhanh"] },
                { type: "cta", headline: "Bắt kịp xu hướng", content: "Đừng bỏ lỡ làn sóng AI trong thời trang!" }
            ]
        }
    },
    {
        filename: 'ai-image-gen-workflow.json',
        data: {
            title: "Behind The Scenes: AI Image Generation Workflow",
            author: "AI Expert",
            slides: [
                { type: "title", headline: "Quy Trình Tạo Ảnh AI", subheadline: "Từ ý tưởng đến tác phẩm hoàn chỉnh" },
                { type: "content", headline: "1. Brainstorming", subheadline: "Lên ý tưởng", content: "Xác định chủ đề, phong cách, màu sắc, bố cục mong muốn." },
                { type: "content", headline: "2. Prompting", subheadline: "Viết lệnh", content: "Chuyển ý tưởng thành ngôn ngữ mà AI hiểu. Sử dụng cấu trúc: Chủ ngữ + Hành động + Bối cảnh + Phong cách." },
                { type: "content", headline: "3. Generating", subheadline: "Tạo ảnh thô", content: "Chạy thử nhiều phiên bản (variations) để chọn ra bố cục tốt nhất." },
                { type: "content", headline: "4. Upscaling & Editing", subheadline: "Hậu kỳ", content: "Tăng độ phân giải, sửa lỗi nhỏ bằng photoshop hoặc công cụ AI inpainting." },
                { type: "list", headline: "Công cụ khuyên dùng", content: ["ChatGPT (Brainstorm)", "Nano Banana / MidJourney (Gen)", "Photoshop (Edit)"] },
                { type: "cta", headline: "Thử ngay!", content: "Tự xây dựng workflow của riêng bạn ngay hôm nay." }
            ]
        }
    },
    {
        filename: 'intro-ai-content-strategy.json',
        data: {
            title: "Từ 0 Đến 10K Followers: Chiến Lược AI Content",
            author: "Growth Master",
            slides: [
                { type: "title", headline: "0 - 10K Followers", subheadline: "Chiến lược tăng trưởng bằng AI Content" },
                { type: "content", headline: "Tại sao dùng AI?", subheadline: "Scale số lượng & chất lượng", content: "Sản xuất nội dung đều đặn mỗi ngày mà không bị kiệt sức (burnout)." },
                { type: "content", headline: "Giai đoạn 1: Số lượng", subheadline: "Phủ sóng", content: "Dùng AI tạo 3-5 bài/ngày. Test nhiều chủ đề khác nhau để tìm 'Long mạch'." },
                { type: "content", headline: "Giai đoạn 2: Chất lượng", subheadline: "Đào sâu", content: "Khi tìm được chủ đề win, dùng AI để research sâu hơn, tạo content giá trị cao." },
                { type: "content", headline: "Giai đoạn 3: Tự động hóa", subheadline: "Rảnh tay", content: "Setup workflow tự động đăng bài, tự động trả lời comment." },
                { type: "list", headline: "Key Metrics", content: ["Consistency (Đều đặn)", "Value (Giá trị)", "Engagement (Tương tác)"] },
                { type: "cta", headline: "Tham gia thử thách", content: "Bắt đầu hành trình 30 ngày xây kênh cùng AI!" }
            ]
        }
    },
    {
        filename: 'roi-ai-automation.json',
        data: {
            title: "ROI Từ AI Automation: Tính Toán Chi Tiết",
            author: "Biz Analyst",
            slides: [
                { type: "title", headline: "ROI Của AI Automation", subheadline: "Đầu tư vào AI lãi lời ra sao?" },
                { type: "content", headline: "Chi phí đầu tư", subheadline: "Công cụ & Setup", content: "- Tool AI (ChatGPT, MidJourney...): ~$50/tháng\n- Công cụ Automation (N8N, Make): ~$20/tháng\n- Tổng: ~$70/tháng" },
                { type: "content", headline: "Tiết kiệm chi phí", subheadline: "Nhân sự & Thời gian", content: "- Thay thế 1 Content Writer ($300)\n- Thay thế 1 Designer cơ bản ($300)\n- Tiết kiệm 40h làm việc/tháng" },
                { type: "content", headline: "Tăng doanh thu", subheadline: "Hiệu quả công việc", content: "Content nhiều hơn -> Reach cao hơn -> Khách hàng nhiều hơn. Tăng tỉ lệ chuyển đổi nhờ phản hồi nhanh." },
                { type: "list", headline: "Kết luận", content: ["ROI > 1000%", "Thu hồi vốn ngay tháng đầu", "Lợi thế cạnh tranh lớn"] },
                { type: "cta", headline: "Đầu tư ngay", content: "Đừng để đối thủ vượt mặt bạn!" }
            ]
        }
    },
    {
        filename: 'setup-n8n-15min.json',
        data: {
            title: "Setup N8N Automation Trong 15 Phút",
            author: "Tech Guide",
            slides: [
                { type: "title", headline: "Setup N8N: 15 Phút", subheadline: "Tự động hóa workflow cực dễ" },
                { type: "content", headline: "Bước 1: Cài đặt", subheadline: "Docker hoặc Cloud", content: "Cách nhanh nhất: Đăng ký n8n.cloud (có free trial). Hoặc chạy lệnh Docker 1 dòng trên máy cá nhân." },
                { type: "content", headline: "Bước 2: Kết nối App", subheadline: "Credentials", content: "Kết nối Google Sheets, Telegram, Facebook... qua OAuth hoặc API Key." },
                { type: "content", headline: "Bước 3: Vẽ Workflow", subheadline: "Kéo thả", content: "Kéo các node vào canvas. Nối chúng lại với nhau theo logic mong muốn (Ví dụ: Khi có tin nhắn -> Gửi vào Sheet)." },
                { type: "content", headline: "Bước 4: Test & Active", subheadline: "Chạy thử", content: "Bấm 'Execute Workflow' để test. Nếu ổn, bật switch 'Active' lên." },
                { type: "list", headline: "Mẹo nhỏ", content: ["Dùng Template có sẵn", "Xem log thường xuyên", "Bắt đầu từ cái đơn giản"] },
                { type: "cta", headline: "Làm ngay đi!", content: "Tự động hóa việc chán ngắt để làm việc lớn hơn." }
            ]
        }
    },
    {
        filename: 'google-sheets-ai-automation.json',
        data: {
            title: "Google Sheets + AI: Tự Động Hóa Toàn Bộ",
            author: "Sheet Master",
            slides: [
                { type: "title", headline: "Google Sheets + AI", subheadline: "Biến bảng tính thành cỗ máy thông minh" },
                { type: "content", headline: "1. AI Formula", subheadline: "Hàm AI", content: "Dùng các add-on như GPT for Sheets. Viết hàm =GPT(\"Viết email chào hàng cho khách này\", A2) ngay trong ô." },
                { type: "content", headline: "2. Phân loại dữ liệu", subheadline: "Tự động tag", content: "Tự động phân loại feedback khách hàng (Tích cực/Tiêu cực) hàng loạt." },
                { type: "content", headline: "3. Clean Data", subheadline: "Làm sạch", content: "AI tự động sửa lỗi chính tả, chuẩn hóa định dạng số điện thoại, địa chỉ." },
                { type: "content", headline: "4. Tự động báo cáo", subheadline: "Insights", content: "AI tóm tắt số liệu, tìm xu hướng và viết nhận xét báo cáo hàng tuần." },
                { type: "list", headline: "Công cụ", content: ["App Script", "GPT for Sheets", "N8N integration"] },
                { type: "cta", headline: "Tối ưu ngay", content: "Đừng lãng phí thời gian copy-paste nữa!" }
            ]
        }
    },
    {
        filename: 'facebook-auto-posting-workflow.json',
        data: {
            title: "Facebook Auto-Posting: Complete Workflow",
            author: "Social Bot",
            slides: [
                { type: "title", headline: "Facebook Auto-Posting", subheadline: "Workflow đăng bài tự động từ A-Z" },
                { type: "content", headline: "Mô hình chung", subheadline: "Flow dữ liệu", content: "Content Plan (Sheets) -> Trigger (N8N) -> Get Image (Drive) -> Post (FB API) -> Update Status (Sheets)." },
                { type: "content", headline: "Bước 1: Content Plan", subheadline: "Google Sheets", content: "Lên lịch bài viết: Caption, Link ảnh, Giờ đăng." },
                { type: "content", headline: "Bước 2: N8N Trigger", subheadline: "Cron Job", content: "N8N check Sheet mỗi 15 phút. Lấy bài có giờ đăng <= giờ hiện tại và chưa đăng." },
                { type: "content", headline: "Bước 3: Đăng bài", subheadline: "API Facebook", content: "Node HTTP Request gọi API Graph Facebook để upload ảnh và đăng status." },
                { type: "content", headline: "Bước 4: Cập nhật", subheadline: "Done", content: "N8N quay lại Sheet đánh dấu bài đó là 'Đã đăng'." },
                { type: "list", headline: "Lưu ý", content: ["Token Facebook 60 ngày", "Kích thước ảnh chuẩn", "Hạn chế spam"] },
                { type: "cta", headline: "Setup ngay", content: "Để Fanpage luôn sống động 24/7." }
            ]
        }
    },
    {
        filename: '5-mistakes-automation.json',
        data: {
            title: "5 Sai Lầm Khi Tự Động Hóa Content",
            author: "Auto Expert",
            slides: [
                { type: "title", headline: "5 Sai Lầm Automation", subheadline: "Cẩn thận kẻo 'nghiệp quật'" },
                { type: "content", headline: "1. Spam vô tội vạ", subheadline: "Số lượng > Chất lượng", content: "Đăng quá nhiều bài rác khiến khán giả unfollow." },
                { type: "content", headline: "2. Thiếu kiểm soát", subheadline: "Bỏ mặc AI", content: "Không review nội dung AI tạo ra, dính lỗi ngớ ngẩn hoặc thông tin sai lệch." },
                { type: "content", headline: "3. Bỏ qua tương tác", subheadline: "Vô cảm", content: "Chỉ đăng mà không reply comment, không tương tác lại với cộng đồng." },
                { type: "content", headline: "4. Phụ thuộc tool", subheadline: "Mất gốc", content: "Khi tool lỗi hoặc đổi thuật toán, hệ thống sụp đổ vì không biết làm thủ công." },
                { type: "content", headline: "5. Lộ liễu", subheadline: "Robot voice", content: "Để nguyên văn phong của AI (kiểu 'Là một mô hình ngôn ngữ...'), mất tính người." },
                { type: "list", headline: "Lời khuyên", content: ["Review trước khi post", "Giữ tương tác thật", "Update kiến thức"] },
                { type: "cta", headline: "Làm đúng ngay", content: "Automation là đòn bẩy, không phải thay thế hoàn toàn." }
            ]
        }
    },
    {
        filename: 'carousel-design-principles.json',
        data: {
            title: "Carousel Design: 7 Nguyên Tắc Vàng",
            author: "Design Pro",
            slides: [
                { type: "title", headline: "Carousel Design", subheadline: "7 Nguyên tắc thiết kế triệu view" },
                { type: "content", headline: "1. AIDA", subheadline: "Cấu trúc", content: "Attention (Bìa) -> Interest (Nội dung) -> Desire (Lợi ích) -> Action (Kêu gọi)." },
                { type: "content", headline: "2. Tương phản", subheadline: "Contrast", content: "Sử dụng màu sắc tương phản mạnh giữa chữ và nền để dễ đọc." },
                { type: "content", headline: "3. Ít chữ", subheadline: "Less is more", content: "Mỗi slide chỉ nên có 1 ý chính. Dùng font to, rõ ràng." },
                { type: "content", headline: "4. Visual hấp dẫn", subheadline: "Hình ảnh", content: "Dùng hình ảnh minh họa chất lượng cao, icon trực quan." },
                { type: "content", headline: "5. Nhất quán", subheadline: "Thương hiệu", content: "Màu sắc, font chữ, phong cách phải đồng bộ xuyên suốt." },
                { type: "list", headline: "Checklist", content: ["Dễ đọc trên mobile?", "Bìa có gây tò mò?", "CTA rõ ràng chưa?"] },
                { type: "cta", headline: "Thực hành ngay", content: "Thiết kế carousel tiếp theo của bạn theo 7 nguyên tắc này." }
            ]
        }
    },
    {
        filename: 'viral-caption-formula.json',
        data: {
            title: "Viết Caption Viral: Công Thức 4 Bước",
            author: "Copywriter AI",
            slides: [
                { type: "title", headline: "Caption Viral", subheadline: "Công thức viết là dính" },
                { type: "content", headline: "1. Hook (Móc câu)", subheadline: "3 giây đầu tiên", content: "Giật tít gây sốc, câu hỏi gợi tò mò hoặc nghịch lý. Ví dụ: 'Đừng mua nhà nếu chưa biết điều này...'" },
                { type: "content", headline: "2. Story (Câu chuyện)", subheadline: "Kết nối cảm xúc", content: "Kể một câu chuyện ngắn, relatable (liên quan) đến vấn đề của người đọc." },
                { type: "content", headline: "3. Value (Giá trị)", subheadline: "Giải pháp", content: "Chia sẻ kiến thức, mẹo, hoặc giải pháp cụ thể cho vấn đề đã nêu." },
                { type: "content", headline: "4. CTA (Kêu gọi)", subheadline: "Hành động", content: "Kêu gọi like, share, lưu lại hoặc comment ý kiến." },
                { type: "list", headline: "Lưu ý", content: ["Dùng icon hợp lý", "Ngắt dòng dễ đọc", "Tone giọng phù hợp"] },
                { type: "cta", headline: "Thử viết ngay", content: "Áp dụng công thức này cho bài post tiếp theo!" }
            ]
        }
    },
    {
        filename: 'best-time-to-post-2026.json',
        data: {
            title: "Best Time To Post: Data-Driven Analysis 2026",
            author: "Data Guru",
            slides: [
                { type: "title", headline: "Giờ Vàng Đăng Bài 2026", subheadline: "Phân tích từ dữ liệu lớn" },
                { type: "content", headline: "Facebook", subheadline: "Thứ 4 & Thứ 6", content: "Khung giờ vàng: 11h - 13h (Nghỉ trưa) và 19h - 21h (Giải trí tối)." },
                { type: "content", headline: "Instagram", subheadline: "Cuối tuần", content: "Thứ 7 & CN hoạt động mạnh. Giờ đẹp: 9h sáng và 8h tối." },
                { type: "content", headline: "LinkedIn", subheadline: "Giờ hành chính", content: "Thứ 3 - Thứ 5. Giờ đẹp: 8h - 10h sáng và 16h - 18h chiều." },
                { type: "content", headline: "TikTok", subheadline: "Khuya & Sáng sớm", content: "Khung giờ lạ: 6h - 7h sáng và 22h - 24h đêm." },
                { type: "list", headline: "Tuy nhiên", content: ["Phụ thuộc vào tệp fan của bạn", "Nên test A/B testing", "Chất lượng > Thời điểm"] },
                { type: "cta", headline: "Check Insight ngay", content: "Xem lại lịch sử page của bạn để tìm giờ vàng riêng." }
            ]
        }
    },
    {
        filename: 'hashtag-strategy-10x-reach.json',
        data: {
            title: "Hashtag Strategy: Tăng Reach 10X",
            author: "Seo Master",
            slides: [
                { type: "title", headline: "Chiến lược Hashtag", subheadline: "Hack reach hiệu quả" },
                { type: "content", headline: "Công thức 3-3-3", subheadline: "Phân bổ hợp lý", content: "- 3 Hashtag Lớn (>1M bài): Để lấy fame chung.\n- 3 Hashtag Trung bình (100k-500k): Dễ cạnh tranh hơn.\n- 3 Hashtag Ngách (<50k): Tiếp cận đúng khách mục tiêu." },
                { type: "content", headline: "Từ khóa liên quan", subheadline: "Relevant", content: "Dùng hashtag đúng nội dung ảnh/bài viết. Đừng dùng #foryou #fyp vô nghĩa nếu không phải TikTok." },
                { type: "content", headline: "Tạo Hashtag riêng", subheadline: "Branding", content: "Tạo hashtag thương hiệu (VD: #LongBestAI) để lưu trữ và xây cộng đồng." },
                { type: "list", headline: "Tool tìm Hashtag", content: ["Best-hashtags.com", "Inflact", "Keyword Tool"] },
                { type: "cta", headline: "Tối ưu ngay", content: "Cập nhật bộ hashtag mới cho bài viết sắp tới." }
            ]
        }
    },
    {
        filename: 'chatgpt-tips-beginners.json',
        data: {
            title: "5 Mẹo ChatGPT Cho Người Mới Bắt Đầu",
            author: "AI Trainer",
            slides: [
                { type: "title", headline: "5 Mẹo ChatGPT", subheadline: "Dành cho người mới bắt đầu (Newbie)" },
                { type: "content", headline: "1. Đóng vai", subheadline: "Roleplay", content: "Prompt: 'Hãy đóng vai chuyên gia Marketing 10 năm kinh nghiệm, tư vấn cho tôi về...'" },
                { type: "content", headline: "2. Cung cấp bối cảnh", subheadline: "Context", content: "Đừng hỏi trổng. Hãy nói rõ bạn là ai, mục đích là gì, viết cho ai đọc." },
                { type: "content", headline: "3. Chia nhỏ vấn đề", subheadline: "Step by step", content: "Đừng bắt nó làm luận văn 1 lúc. Hãy hỏi từng ý nhỏ, từng chương một." },
                { type: "content", headline: "4. Yêu cầu định dạng", subheadline: "Format", content: "Yêu cầu rõ đầu ra: Bảng, list markdown, code block, hay đoạn văn ngắn." },
                { type: "content", headline: "5. Feedback lại", subheadline: "Học hỏi", content: "Nếu chưa ưng, hãy bảo nó sửa: 'Viết lại giọng văn vui vẻ hơn', 'Ngắn gọn hơn'." },
                { type: "list", headline: "Hãy thử ngay", content: ["Đóng vai", "Thêm context", "Feedback liên tục"] },
                { type: "cta", headline: "Follow Long Best AI", content: "Để học thêm nhiều mẹo AI hay ho!" }
            ]
        }
    },
    {
        filename: 'prompt-engineering-101.json',
        data: {
            title: "Prompt Engineering 101: Viết Prompt Hiệu Quả",
            author: "Prompt Engineer",
            slides: [
                { type: "title", headline: "Prompt Engineering 101", subheadline: "Nghệ thuật giao tiếp với AI" },
                { type: "content", headline: "Cấu trúc chuẩn", subheadline: "Framework", content: "Instruction (Lệnh) + Context (Bối cảnh) + Input Data (Dữ liệu) + Output Indicator (Định dạng đầu ra)." },
                { type: "content", headline: "Rõ ràng & Cụ thể", subheadline: "Be Specific", content: "Thay vì 'Viết bài hay', hãy nói 'Viết bài blog 500 từ về SEO, giọng văn chuyên nghiệp'." },
                { type: "content", headline: "Few-Shot Prompting", subheadline: "Cho ví dụ", content: "Cung cấp 1-2 ví dụ mẫu về input và output mong muốn để AI học theo." },
                { type: "content", headline: "Chain of Thought", subheadline: "Tư duy", content: "Yêu cầu AI 'Hãy suy nghĩ từng bước' (Let's think step by step) để giải quyết vấn đề logic." },
                { type: "list", headline: "Công cụ hỗ trợ", content: ["OpenAI Playground", "Anthropic Console", "Prompt Library"] },
                { type: "cta", headline: "Luyện tập ngay", content: "Viết prompt tốt hơn mỗi ngày để làm chủ AI." }
            ]
        }
    }
];

topics.forEach(topic => {
    fs.writeFileSync(path.join(contentDir, topic.filename), JSON.stringify(topic.data, null, 2));
    console.log(`Created ${topic.filename}`);
});

console.log('All content files created successfully.');

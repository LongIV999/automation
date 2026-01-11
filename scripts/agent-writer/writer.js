const fs = require('fs').promises;
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

// Load settings from .claude/settings.json
async function loadSettings() {
    try {
        // Adjust path to point to .claude relative to scripts/agent-writer
        const settingsPath = path.resolve(__dirname, '../../.claude/settings.json');
        const data = await fs.readFile(settingsPath, 'utf8');
        const settings = JSON.parse(data);
        return settings.env || {};
    } catch (e) {
        console.warn("⚠️ Could not load settings from .claude/settings.json, falling back to process.env");
        return process.env;
    }
}

async function main() {
    const env = await loadSettings();

    const apiKey = env.ANTHROPIC_AUTH_TOKEN || process.env.ANTHROPIC_AUTH_TOKEN;
    const baseURL = env.ANTHROPIC_BASE_URL || process.env.ANTHROPIC_BASE_URL;
    const model = env.ANTHROPIC_DEFAULT_SONNET_MODEL || 'claude-3-sonnet-20240229';

    if (!apiKey) {
        console.error("❌ ANTHROPIC_AUTH_TOKEN not found.");
        process.exit(1);
    }

    const anthropic = new Anthropic({
        apiKey: apiKey,
        baseURL: baseURL
    });

    // Get topic and brand from args
    const args = process.argv.slice(2);
    const brandArgIndex = args.indexOf('--brand');
    let brand = 'longbest'; // default
    let topic = '';

    if (brandArgIndex !== -1) {
        brand = args[brandArgIndex + 1];
        // Remove brand flag and value to get topic
        const newArgs = [...args];
        newArgs.splice(brandArgIndex, 2);
        topic = newArgs.join(' ').replace(/^"|"$/g, '');
    } else {
        topic = args.join(' ').replace(/^"|"$/g, '');
    }

    if (!topic) {
        console.log("Usage: node writer.js \"Topic Name\" [--brand name]");
        console.log("Supported brands: longbest, thachvuland, queennailbern");
        process.exit(1);
    }

    // Determine context file path
    let contextFile = 'context-longbest.md';
    if (brand === 'thachvuland') {
        contextFile = 'context-thachvuland.md';
    } else if (brand === 'queennailbern') {
        contextFile = 'context-queennailbern.md';
    }

    const contextPath = path.resolve(__dirname, '../../', contextFile);

    console.log(`🧠 Agent generating content for brand: "${brand}"`);
    console.log(`📚 Reading context from: ${contextFile}`);
    console.log(`📝 Topic: "${topic}"`);

    let contextContent = '';
    try {
        contextContent = await fs.readFile(contextPath, 'utf8');
    } catch (err) {
        console.error(`❌ Could not read context file: ${contextPath}`);
        process.exit(1);
    }

    // Determine brand display name and language
    let brandDisplayName = 'Long Best AI';
    let contentLanguage = 'Vietnamese';
    let ctaGuidelines = 'Quảng cáo giải pháp tạo Video & Ảnh AI chuyên nghiệp với Veo 3 và Nano Banana Pro. Call to Action (CTA): Nhắn tin (ib) ngay để nhận bản dùng thử trước khi mua.';

    // Helper to detect Vietnamese characters
    const hasVietnamese = (text) => {
        const viRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
        return viRegex.test(text);
    };

    if (brand === 'thachvuland') {
        brandDisplayName = 'Thach Vu Land';
    } else if (brand === 'queennailbern') {
        brandDisplayName = 'Queen Nail Bern';
        contentLanguage = 'German';
        ctaGuidelines = 'Professional call to action encouraging customers to book an appointment. Example: "Buchen Sie Ihren Termin" with contact/booking information.';

        // Override language if topic is in Vietnamese or explicitly requested
        if (hasVietnamese(topic) || topic.toLowerCase().includes('tiếng việt')) {
            console.log("🇻🇳 Detect Vietnamese request for Queen Nail Bern. Switching language...");
            contentLanguage = 'Vietnamese';
            ctaGuidelines = 'Kêu gọi hành động chuyên nghiệp (CTA) bằng tiếng Việt cho tiệm nail. Nội dung bắt buộc bao gồm: 👑 Queen Nails & Lashes | Kramgasse 37, 3011 Bern, Schweiz 🇨🇭. Địa chỉ: Kramgasse 37, 3011 Bern. Hotline: +41 79 805 00 68. Ví dụ: "Nhắn tin ngay hoặc gọi hotline để đặt lịch/ứng tuyển".';
        }
    }

    // Get style arg
    const styleArgIndex = args.indexOf('--style');
    let designStyle = 'classic';
    if (styleArgIndex !== -1) {
        designStyle = args[styleArgIndex + 1];
    }

    const systemPrompt = `
You are an expert Content Creator for ${brandDisplayName}.
Your task is to generate a carousel slide deck content in JSON format for the given topic, strictly following the brand guidelines provided in the Context below.

=== CONTEXT START ===
${contextContent}
=== CONTEXT END ===

The output MUST be a valid JSON object matching the following structure exactly:

{
  "title": "String",
  "topic": "String",
  "brand": "${brandDisplayName}",
  "designStyle": "${designStyle}",
  "slides": [
    {
      "type": "title | content | prompt | list | cta",
      "headline": "String",
      "subheadline": "String (optional)",
      "content": "String or Array of Strings for list type",
      "visual": "String (description for image generation)"
    }
  ]
}

Rules:
1. Create exactly 7 slides.
2. Slide 1 must be type 'title' (Hook).
3. Slide 7 must be type 'cta'.
   - ${ctaGuidelines}
4. Content should be in ${contentLanguage}.
5. DO NOT use any emojis or icons in the text content. Keep it clean and professional.
6. Tone: Follow the Tone & Voice defined in the Context.
7. For 'prompt' type slides (if applicable), the content is the prompt itself.
`;

    try {
        const msg = await anthropic.messages.create({
            model: model,
            max_tokens: 4000,
            system: systemPrompt,
            messages: [
                { role: "user", content: `Create content for topic: ${topic}` }
            ]
        });

        // Extract JSON from response
        const textResponse = msg.content[0].text;
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("No JSON found in response");
        }

        const contentJson = JSON.parse(jsonMatch[0]);

        // Save to file
        const safeTopic = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const filename = `${brand}-${safeTopic}-style-${designStyle}.json`;
        const outputPath = path.resolve(__dirname, '../carousel-generator/content', filename);

        // Ensure directory exists
        await fs.mkdir(path.dirname(outputPath), { recursive: true });

        await fs.writeFile(outputPath, JSON.stringify(contentJson, null, 2));

        console.log(`✅ Content generated successfully!`);
        console.log(`📂 Saved to: ${outputPath}`);
        console.log(`JSON_OUTPUT_FILE: ${outputPath}`);

    } catch (error) {
        console.error("❌ Error generating content:", error);
    }
}

main();

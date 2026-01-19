const fs = require('fs').promises;
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const SkillsManager = require('./skills-manager');
const formatUtils = require('../utils/format-utils');
const { determineSlideCount } = require('./slide-count-analyzer');

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

    // Parse command line arguments
    const args = process.argv.slice(2);

    // Helper to get argument value
    const getArgValue = (flag) => {
        const idx = args.indexOf(flag);
        return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : null;
    };

    // Extract all flags
    const brand = getArgValue('--brand') || 'longbest';
    const formatName = getArgValue('--format') || 'auto';
    const contentType = getArgValue('--type') || null;
    const aspectRatio = getArgValue('--ratio') || '4:5';
    const designStyle = getArgValue('--style') || 'classic';
    const explicitSlideCount = getArgValue('--slides');
    const useSkills = !args.includes('--no-skills'); // Default: true
    const researchFirst = args.includes('--research'); // Optional: research trends first

    // Get topic (remove all flags)
    const topicArgs = args.filter((arg, i) => {
        if (arg.startsWith('--')) return false;
        if (i > 0 && args[i - 1].startsWith('--')) return false;
        return true;
    });
    const topic = topicArgs.join(' ').replace(/^\"|\"$/g, '');

    if (!topic) {
        console.log("Usage: node writer.js \"Topic Name\" [options]");
        console.log("\nOptions:");
        console.log("  --brand <name>     Brand name (longbest, thachvuland, queennailbern)");
        console.log("  --format <type>    Format type (auto, single, carousel-mini, carousel-standard)");
        console.log("  --type <type>      Content type (quote, tips, tutorial, etc.)");
        console.log("  --style <style>    Design style (classic, notebook-typography, etc.)");
        console.log("  --ratio <ratio>    Aspect ratio (4:5, 1:1) - default: 4:5");
        console.log("  --slides <count>   Force specific slide count");
        console.log("  --research         Research trends before generating content");
        console.log("  --no-skills        Disable Claude Skills enhancement");
        console.log("\nExamples:");
        console.log("  node writer.js \"5 AI Tips\" --brand longbest --format auto");
        console.log("  node writer.js \"Focus on Progress\" --brand longbest --format single");
        console.log("  node writer.js \"AI Trends 2026\" --brand longbest --research");
        process.exit(1);
    }

    // Resolve format configuration
    let formatConfig = await formatUtils.resolveFormat(brand, formatName, topic, {
        contentType,
        aspectRatio,
        slideCount: explicitSlideCount ? parseInt(explicitSlideCount) : null
    });

    // Dynamic slide count determination (if not explicitly set)
    if (!explicitSlideCount) {
        console.log(`\n🎯 Analyzing optimal slide count...`);
        const slideAnalysis = await determineSlideCount(
            topic,
            formatConfig.contentType,
            brand,
            anthropic, // Pass anthropic client for AI analysis
            model
        );

        // Update format config with determined slide count
        formatConfig.slideCount = slideAnalysis.recommendedSlideCount;
        formatConfig.formatType = slideAnalysis.formatType || formatConfig.formatType;

        console.log(`   Method: ${slideAnalysis.method}`);
        console.log(`   Reasoning: ${slideAnalysis.reasoning}`);
        if (slideAnalysis.contentStructure) {
            console.log(`   Structure: ${slideAnalysis.contentStructure}`);
        }
    }

    console.log(`\n🧠 Agent generating content for brand: "${brand}"`);
    console.log(`📊 Format: ${formatConfig.formatName} (${formatConfig.contentType})`);
    console.log(`📐 Dimensions: ${formatConfig.dimensions.width}x${formatConfig.dimensions.height}`);
    console.log(`📸 Slides: ${formatConfig.slideCount}${explicitSlideCount ? ' (explicit)' : ' (auto-determined)'}`);
    console.log(`📝 Topic: "${topic}"`);

    // Determine context file path
    let contextFile = 'context-longbest.md';
    if (brand === 'thachvuland') {
        contextFile = 'context-thachvuland.md';
    } else if (brand === 'queennailbern') {
        contextFile = 'context-queennailbern.md';
    }

    const contextPath = path.resolve(__dirname, '../../', contextFile);
    console.log(`📚 Reading context from: ${contextFile}`);

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

    // Build slide structure instruction based on format
    let slideStructure = '';
    if (formatConfig.slideCount === 1) {
        slideStructure = `
1. Create exactly 1 slide combining title, main content, and CTA.
2. The slide must be type 'title-cta' (combined single image).
3. Include all key information in one visually appealing design.
   - ${ctaGuidelines}
`;
    } else if (formatConfig.slideCount <= 5) {
        slideStructure = `
1. Create exactly ${formatConfig.slideCount} slides.
2. Slide 1 must be type 'title' (Hook).
3. Slides 2-${formatConfig.slideCount - 1} should be type 'content' or 'list' (Value).
4. Slide ${formatConfig.slideCount} must be type 'cta'.
   - ${ctaGuidelines}
`;
    } else {
        slideStructure = `
1. Create exactly ${formatConfig.slideCount} slides.
2. Slide 1 must be type 'title' (Hook).
3. Slides 2-${formatConfig.slideCount - 1} should be type 'content', 'list', or 'prompt' (Value).
4. Slide ${formatConfig.slideCount} must be type 'cta'.
   - ${ctaGuidelines}
`;
    }

    const systemPrompt = `
You are an expert Content Creator for ${brandDisplayName}.
Your task is to generate ${formatConfig.slideCount === 1 ? 'a single post' : 'a carousel slide deck'} content in JSON format for the given topic, strictly following the brand guidelines provided in the Context below.

=== CONTEXT START ===
${contextContent}
=== CONTEXT END ===

The output MUST be a valid JSON object matching the following structure exactly:

{
  "title": "String",
  "topic": "String",
  "brand": "${brandDisplayName}",
  "formatType": "${formatConfig.formatName}",
  "contentType": "${formatConfig.contentType}",
  "slideCount": ${formatConfig.slideCount},
  "dimensions": {
    "width": ${formatConfig.dimensions.width},
    "height": ${formatConfig.dimensions.height}
  },
  "designStyle": "${designStyle}",
  "slides": [
    {
      "type": "title | content | prompt | list | cta | title-cta | comparison | process",
      "headline": "String",
      "subheadline": "String (optional)",
      "content": "String or Array of Strings for list type",
      "visual": "String (description for image generation)",
      
      // For type 'comparison':
      "leftTitle": "String (e.g. Traditional)",
      "rightTitle": "String (e.g. AI Way)",
      "items": [
        { "left": "String", "right": "String" }
      ],

      // For type 'process':
      "steps": [
        { "number": Number, "title": "String", "desc": "String" }
      ]
    }
  ]
}

Rules:
${slideStructure}
4. Content should be in ${contentLanguage}.
5. **Use 'comparison' visualization when contrasting two ideas (e.g., Old vs New).**
6. **Use 'process' visualization when explaining steps or a workflow.**
7. DO NOT use any emojis or icons in the text content. Keep it clean and professional.
8. Tone: Follow the Tone & Voice defined in the Context.
9. For 'prompt' type slides (if applicable), the content is the prompt itself.
10. The "visual" field should describe what image/graphic should be shown on that slide.

    ${designStyle === 'head-silhouette' ? `
    SPECIAL RULE FOR 'head-silhouette' STYLE:
    - You MUST generate exactly 6 main points/skills.
    - The content MUST be wrapped in a single slide of type 'content' or 'list'.
    - The 'content' field should be an Array of 6 strings, or an Array of objects with { "title": "...", "description": "...", "tools": "..." } if possible. 
    - Ideally, provide an array of strings formatted as "Title: Description (Tools: Tool1, Tool2)".
    ` : ''}
    
`;

    try {
        let finalSystemPrompt = systemPrompt;
        let finalTopic = topic;

        // PHASE 1: Trend Research (if --research flag)
        if (researchFirst && useSkills) {
            console.log('🔍 Step 1/3: Researching trends...');
            const skillsManager = new SkillsManager(apiKey, baseURL, model);

            try {
                const trendData = await skillsManager.huntTrends(topic, 'Vietnam');
                console.log('✅ Trends found:', trendData.viralAngles?.slice(0, 3) || 'No specific angles');

                // Enhance topic with trend insights
                if (trendData.viralAngles && trendData.viralAngles.length > 0) {
                    finalTopic = `${topic}\n\nViral Angles to consider:\n${trendData.viralAngles.slice(0, 3).join('\n')}`;
                }
            } catch (error) {
                console.warn('⚠️  Trend research failed, proceeding with original topic');
            }
        }

        // PHASE 2: Generate Content (Claude API)
        console.log(`🧠 Step ${researchFirst ? '2/3' : '1/2'}: Generating content...`);

        const msg = await anthropic.messages.create({
            model: model,
            max_tokens: 4000,
            system: finalSystemPrompt,
            messages: [
                { role: "user", content: `Create content for topic: ${finalTopic}` }
            ]
        });

        // Extract JSON from response
        const textResponse = msg.content[0].text;
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("No JSON found in response");
        }

        let contentJson = JSON.parse(jsonMatch[0]);

        // PHASE 3: Enhance with Skills (if enabled)
        if (useSkills) {
            console.log(`🎨 Step ${researchFirst ? '3/3' : '2/2'}: Enhancing with Skills...`);
            const skillsManager = new SkillsManager(apiKey, baseURL, model);

            try {
                // Enhance captions for viral potential
                const viralEnhancement = await skillsManager.enhanceCaption(
                    topic,
                    contentJson.contentType || 'tips',
                    brand
                );

                // Apply viral hooks to title slide if available
                if (viralEnhancement.hook) {
                    const titleSlide = contentJson.slides.find(s => s.type === 'title');
                    if (titleSlide) {
                        titleSlide.headline = viralEnhancement.hook + ' ' + titleSlide.headline;
                    }
                }

                // Generate enhanced visual prompts
                const visualPrompts = await skillsManager.generateVisualPrompts(
                    contentJson.slides,
                    designStyle
                );

                // Apply visual prompts to slides
                if (visualPrompts.prompts) {
                    contentJson.slides.forEach((slide, idx) => {
                        if (visualPrompts.prompts[idx]) {
                            slide.visual = visualPrompts.prompts[idx];
                        }
                    });
                }

                console.log('✅ Skills enhancement completed');

            } catch (error) {
                console.warn('⚠️  Skills enhancement failed, using base content');
            }
        }

        // Ensure format metadata
        contentJson.formatType = formatConfig.formatName;
        contentJson.contentType = formatConfig.contentType;
        contentJson.slideCount = formatConfig.slideCount;
        contentJson.dimensions = formatConfig.dimensions;
        contentJson.designStyle = designStyle;
        contentJson.skillsEnhanced = useSkills; // Track if skills were used

        // Save to file
        const safeTopic = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50);
        const formatSlug = formatConfig.formatName.replace(/-/g, '');
        const skillsTag = useSkills ? 'enhanced' : 'base';
        const filename = `${brand}-${safeTopic}-${formatSlug}-${skillsTag}.json`;
        const outputPath = path.resolve(__dirname, '../carousel-generator/content', filename);

        // Ensure directory exists
        await fs.mkdir(path.dirname(outputPath), { recursive: true });

        await fs.writeFile(outputPath, JSON.stringify(contentJson, null, 2));

        console.log(`✅ Content generated successfully!`);
        console.log(`📂 Saved to: ${outputPath}`);
        console.log(`📊 Format: ${contentJson.formatType} | ${contentJson.slideCount} slides | ${contentJson.dimensions.width}x${contentJson.dimensions.height}`);
        console.log(`🎨 Skills: ${useSkills ? 'ENABLED ✨' : 'Disabled'}`);
        console.log(`JSON_OUTPUT_FILE: ${outputPath}`);

    } catch (error) {
        console.error("❌ Error generating content:", error);
        process.exit(1);
    }
}

main();

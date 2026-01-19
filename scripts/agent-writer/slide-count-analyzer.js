/**
 * Dynamic Slide Count Determination
 * 
 * Automatically determines optimal carousel slide count based on topic complexity
 * Uses pattern matching and AI analysis to suggest appropriate slide count
 */

const Anthropic = require('@anthropic-ai/sdk');

/**
 * Determine optimal slide count for topic
 * @param {string} topic - Content topic
 * @param {string} contentType - Type of content (tips, tutorial, news, etc.)
 * @param {string} brand - Brand name
 * @param {Object} anthropic - Anthropic client instance (optional, for AI analysis)
 * @param {string} model - Claude model to use (optional)
 * @returns {Promise<Object>} Analysis with recommendedSlideCount, reasoning, formatType
 */
async function determineSlideCount(topic, contentType, brand, anthropic = null, model = 'claude-3-5-sonnet-20241022') {
    // Quick pattern matching first
    const patternResult = estimateSlideCountByPattern(topic, contentType, brand);

    // If high confidence from pattern matching, return immediately
    if (patternResult.confidence >= 0.9) {
        console.log(`📊 Slide count: ${patternResult.slideCount} (pattern matching, high confidence)`);
        return {
            recommendedSlideCount: patternResult.slideCount,
            reasoning: patternResult.reasoning,
            formatType: patternResult.formatType,
            method: 'pattern',
            confidence: patternResult.confidence
        };
    }

    // Use AI analysis for complex cases
    if (anthropic) {
        try {
            const aiResult = await analyzeSlideCountWithAI(topic, contentType, brand, anthropic, model);
            console.log(`📊 Slide count: ${aiResult.recommendedSlideCount} (AI analysis)`);
            return {
                ...aiResult,
                method: 'ai',
                confidence: 0.95
            };
        } catch (error) {
            console.warn('⚠️  AI analysis failed, using pattern matching:', error.message);
        }
    }

    // Fallback to pattern matching
    console.log(`📊 Slide count: ${patternResult.slideCount} (pattern matching fallback)`);
    return {
        recommendedSlideCount: patternResult.slideCount,
        reasoning: patternResult.reasoning,
        formatType: patternResult.formatType,
        method: 'pattern',
        confidence: patternResult.confidence
    };
}

/**
 * Pattern-based slide count estimation (fast, no API call)
 */
function estimateSlideCountByPattern(topic, contentType, brand) {
    const topicLower = topic.toLowerCase();

    // Extract explicit number from topic (e.g., "5 tips", "10 cách")
    const numberMatch = topic.match(/(\d+)\s*(cách|tips|bước|điều|lý do|ways|steps|reasons|points|tricks)/i);
    if (numberMatch) {
        const explicitCount = parseInt(numberMatch[1]);
        const slideCount = explicitCount + 2; // Add intro + CTA
        return {
            slideCount: validateSlideCount(slideCount, topic),
            reasoning: `Topic explicitly mentions ${explicitCount} items, adding intro + CTA`,
            formatType: slideCount <= 5 ? 'carousel-mini' : 'carousel-standard',
            confidence: 1.0
        };
    }

    // Single concept patterns (1 slide)
    const singlePatterns = [
        /^(focus on|remember|dont forget|never)/i,
        /quote|câu nói|mindset/i,
        /announcement|thông báo/i
    ];
    for (const pattern of singlePatterns) {
        if (pattern.test(topicLower)) {
            return {
                slideCount: 1,
                reasoning: 'Single concept/quote format',
                formatType: 'single-post',
                confidence: 0.95
            };
        }
    }

    // Mini carousel patterns (3-5 slides)
    const miniPatterns = {
        'news|tin tức|vừa ra mắt|just released|new feature': 5,
        'quick tips|nhanh|summary|tóm tắt': 5,
        'announcement|giới thiệu|introducing': 4
    };
    for (const [pattern, count] of Object.entries(miniPatterns)) {
        if (new RegExp(pattern, 'i').test(topicLower)) {
            return {
                slideCount: count,
                reasoning: `News/quick format typically needs ${count} slides`,
                formatType: 'carousel-mini',
                confidence: 0.85
            };
        }
    }

    // Deep dive patterns (10-15 slides)
    const deepPatterns = {
        'từ a[- ]?z|complete guide|toàn tập|comprehensive': 12,
        'quy trình|process|workflow|step[- ]?by[- ]?step': 10,
        'luật|legal|pháp lý|law': 10,
        'hướng dẫn chi tiết|detailed tutorial|in-depth': 12
    };
    for (const [pattern, count] of Object.entries(deepPatterns)) {
        if (new RegExp(pattern, 'i').test(topicLower)) {
            return {
                slideCount: count,
                reasoning: `Complex topic requiring detailed breakdown`,
                formatType: 'carousel-deep',
                confidence: 0.85
            };
        }
    }

    // Standard patterns (7-8 slides)
    const standardPatterns = {
        'tips|tricks|hacks|cách': 8,
        'so sánh|compare|vs': 8,
        'review|đánh giá': 7,
        'hướng dẫn|tutorial|how to': 8
    };
    for (const [pattern, count] of Object.entries(standardPatterns)) {
        if (new RegExp(pattern, 'i').test(topicLower)) {
            return {
                slideCount: count,
                reasoning: `Standard ${pattern} format works well with ${count} slides`,
                formatType: 'carousel-standard',
                confidence: 0.8
            };
        }
    }

    // Content type defaults
    const typeDefaults = {
        'quote': { count: 1, format: 'single-post' },
        'news': { count: 5, format: 'carousel-mini' },
        'tips': { count: 8, format: 'carousel-standard' },
        'tutorial': { count: 10, format: 'carousel-standard' },
        'legal': { count: 10, format: 'carousel-deep' },
        'review': { count: 7, format: 'carousel-standard' },
        'comparison': { count: 8, format: 'carousel-standard' }
    };

    const defaultConfig = typeDefaults[contentType] || { count: 7, format: 'carousel-standard' };

    return {
        slideCount: defaultConfig.count,
        reasoning: `Default for ${contentType} content type`,
        formatType: defaultConfig.format,
        confidence: 0.6
    };
}

/**
 * AI-powered slide count analysis (slower, more accurate for complex topics)
 */
async function analyzeSlideCountWithAI(topic, contentType, brand, anthropic, model) {
    const analysisPrompt = `Analyze this topic and determine optimal carousel slide count.

Topic: "${topic}"
Content Type: ${contentType}
Brand: ${brand}

Decision Rules:
1. If number explicitly in topic (e.g., "5 tips", "10 bước") → Use that number + 2 (intro + CTA)
2. Single concept/quote/announcement → 1 slide
3. Quick tips/news/summary → 3-5 slides
4. Standard tutorial/tips/comparison → 7-10 slides
5. Complex guide/legal/detailed tutorial → 10-15 slides

Consider:
- Topic scope (broad vs narrow)
- Information density needed
- Platform best practices (engagement drops after 15 slides)

Output EXACTLY this JSON:
{
  "recommendedSlideCount": <number 1-15>,
  "reasoning": "<brief explanation>",
  "formatType": "single-post" | "carousel-mini" | "carousel-standard" | "carousel-deep",
  "contentStructure": "<suggested slide breakdown>"
}`;

    const response = await anthropic.messages.create({
        model: model,
        max_tokens: 500,
        messages: [{ role: 'user', content: analysisPrompt }]
    });

    const textResponse = response.content[0].text;
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
        throw new Error('No JSON in AI response');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Validate and adjust if needed
    analysis.recommendedSlideCount = validateSlideCount(analysis.recommendedSlideCount, topic);

    return analysis;
}

/**
 * Validate and adjust slide count to safe range
 */
function validateSlideCount(count, topic) {

    // Ensure within platform limits
    if (count < 1) return 1;
    if (count > 15) return 15;

    // Check for mismatch with explicit numbers in topic (excluding years)
    const numberMatches = topic.match(/\d+/g);
    if (numberMatches) {
        // Filter out years (2000-2099 range) and very large numbers
        const relevantNumbers = numberMatches
            .map(n => parseInt(n))
            .filter(n => n < 100 && n > 0);  // Only consider 1-99 as potential item counts

        if (relevantNumbers.length > 0) {
            const topicNumber = Math.max(...relevantNumbers);
            if (count < topicNumber && topicNumber <= 15) {
                console.warn(`⚠️  Adjusting slide count from ${count} to ${topicNumber + 2} (topic mentions ${topicNumber} items)`);
                return Math.min(topicNumber + 2, 15);
            }
        }
    }

    return count;
}

module.exports = {
    determineSlideCount,
    estimateSlideCountByPattern,
    analyzeSlideCountWithAI,
    validateSlideCount
};

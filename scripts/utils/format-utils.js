/**
 * Content Format Utilities
 *
 * Helper functions for flexible content format system
 */

const fs = require('fs').promises;
const path = require('path');

// Cache for format config
let formatConfigCache = null;

/**
 * Load content format configuration
 */
async function loadFormatConfig() {
    if (formatConfigCache) {
        return formatConfigCache;
    }

    const configPath = path.resolve(__dirname, '../../brands/_templates/content-formats.json');
    const data = await fs.readFile(configPath, 'utf8');
    formatConfigCache = JSON.parse(data);
    return formatConfigCache;
}

/**
 * Get format configuration by name
 * @param {string} formatName - Format name (e.g., 'single', 'carousel-mini')
 * @returns {Object} Format configuration
 */
async function getFormat(formatName) {
    const config = await loadFormatConfig();

    if (!config.formats[formatName]) {
        throw new Error(`Unknown format: ${formatName}. Available: ${Object.keys(config.formats).join(', ')}`);
    }

    return config.formats[formatName];
}

/**
 * Detect content type from topic
 * @param {string} topic - Content topic/title
 * @returns {string} Detected content type
 */
function detectContentType(topic) {
    const topicLower = topic.toLowerCase();
    const config = formatConfigCache;

    if (!config) {
        return 'tutorial'; // Default fallback
    }

    const rules = config.autoDetectionRules;

    // Check quote pattern
    if (rules.quote.patterns.some(pattern => new RegExp(pattern).test(topic))) {
        return 'quote';
    }

    // Check for quotes by word count
    const wordCount = topic.split(/\s+/).length;
    if (rules.quote.keywords.some(kw => topicLower.includes(kw)) && wordCount <= rules.quote.maxWords) {
        return 'quote';
    }

    // Check announcement
    if (rules.announcement.keywords.some(kw => topicLower.includes(kw)) && wordCount <= rules.announcement.maxWords) {
        return 'announcement';
    }

    // Check tips pattern (e.g., "5 Tips for...")
    // Also check for Vietnamese patterns like "5 công cụ", "7 bí quyết"
    const tipsKeywords = ['tips', 'ways', 'tricks', 'tools', 'methods', 'secrets',
                          'công cụ', 'bí quyết', 'cách', 'mẹo', 'phương pháp', 'bước'];

    const numMatch = topicLower.match(/(\d+)/);
    if (numMatch) {
        const num = parseInt(numMatch[0]);
        const hasKeyword = tipsKeywords.some(kw => topicLower.includes(kw));

        if (hasKeyword && num >= rules.tips.countRange[0] && num <= rules.tips.countRange[1]) {
            return 'tips';
        }
    }

    // Also check English patterns
    for (const pattern of rules.tips.patterns) {
        const match = topicLower.match(new RegExp(pattern));
        if (match) {
            const num = parseInt(topicLower.match(/\d+/)[0]);
            if (num >= rules.tips.countRange[0] && num <= rules.tips.countRange[1]) {
                return 'tips';
            }
        }
    }

    // Check tutorial pattern
    if (rules.tutorial.keywords.some(kw => topicLower.includes(kw))) {
        return 'tutorial';
    }

    // Check comprehensive guide
    for (const pattern of rules.comprehensive.patterns) {
        if (topicLower.includes(pattern)) {
            return 'comprehensive';
        }
    }

    // Default
    return 'tutorial';
}

/**
 * Detect recommended slide count from topic
 * @param {string} topic - Content topic
 * @param {string} contentType - Content type (optional)
 * @returns {number} Recommended slide count
 */
function detectSlideCount(topic, contentType = null) {
    // Extract number from topic if present (e.g., "5 Tips" -> 5)
    const match = topic.match(/(\d+)/);
    let baseCount = null;

    if (match) {
        baseCount = parseInt(match[0]);
    }

    // If no content type provided, detect it
    if (!contentType) {
        contentType = detectContentType(topic);
    }

    // Get format for content type
    const formatName = formatConfigCache?.contentTypeMapping[contentType] || 'carousel-standard';
    const format = formatConfigCache?.formats[formatName];

    if (!format) {
        return 7; // Default fallback
    }

    // If format has fixed slide count
    if (typeof format.slideCount === 'number') {
        return format.slideCount;
    }

    // If format has variable count
    if (baseCount) {
        // Add 2 for title + CTA slides
        const totalCount = baseCount + 2;
        // Constrain to format min/max
        return Math.max(
            format.slideCount.min,
            Math.min(format.slideCount.max, totalCount)
        );
    }

    // Use default from format
    return format.slideCount.default || 7;
}

/**
 * Get format by content type
 * @param {string} contentType - Content type
 * @returns {Promise<Object>} Format configuration
 */
async function getFormatByContentType(contentType) {
    const config = await loadFormatConfig();
    const formatName = config.contentTypeMapping[contentType] || 'carousel-standard';
    return getFormat(formatName);
}

/**
 * Auto-detect format from topic
 * @param {string} topic - Content topic
 * @returns {Promise<Object>} Detected format with metadata
 */
async function autoDetectFormat(topic) {
    await loadFormatConfig(); // Ensure config is loaded

    const contentType = detectContentType(topic);
    const slideCount = detectSlideCount(topic, contentType);
    const format = await getFormatByContentType(contentType);

    return {
        contentType,
        formatName: format.designStyle,
        slideCount,
        dimensions: format.dimensions,
        format
    };
}

/**
 * Get format configuration for CLI parameters
 * @param {string} brand - Brand name
 * @param {string} formatName - Format name or 'auto'
 * @param {string} topic - Content topic
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Format configuration
 */
async function resolveFormat(brand, formatName, topic, options = {}) {
    await loadFormatConfig();

    // Auto-detect format
    if (formatName === 'auto') {
        return await autoDetectFormat(topic);
    }

    // Explicit format specified
    const format = await getFormat(formatName);
    let slideCount = options.slideCount;

    // If no explicit slide count, use format default
    if (!slideCount) {
        if (typeof format.slideCount === 'number') {
            slideCount = format.slideCount;
        } else {
            // Try to detect from topic
            slideCount = detectSlideCount(topic, options.contentType);
        }
    }

    // Apply dimension overrides
    let dimensions = { ...format.dimensions };
    if (options.aspectRatio === '1:1' && format.dimensions.alternative) {
        dimensions = { ...format.dimensions.alternative };
    }

    return {
        contentType: options.contentType || detectContentType(topic),
        formatName: format.designStyle,
        slideCount,
        dimensions,
        format
    };
}

/**
 * Validate format configuration
 * @param {Object} formatConfig - Format configuration to validate
 * @returns {boolean} True if valid
 * @throws {Error} If invalid
 */
function validateFormat(formatConfig) {
    if (!formatConfig.slideCount || formatConfig.slideCount < 1) {
        throw new Error('Invalid slide count');
    }

    if (!formatConfig.dimensions || !formatConfig.dimensions.width || !formatConfig.dimensions.height) {
        throw new Error('Invalid dimensions');
    }

    return true;
}

/**
 * Get all available formats
 * @returns {Promise<Array>} List of format names
 */
async function getAvailableFormats() {
    const config = await loadFormatConfig();
    return Object.keys(config.formats);
}

/**
 * Get format info for CLI help text
 * @returns {Promise<string>} Formatted help text
 */
async function getFormatHelpText() {
    const config = await loadFormatConfig();
    const formats = config.formats;

    let help = 'Available formats:\n';
    for (const [name, format] of Object.entries(formats)) {
        const count = typeof format.slideCount === 'number'
            ? format.slideCount
            : `${format.slideCount.min}-${format.slideCount.max}`;
        const dims = `${format.dimensions.width}x${format.dimensions.height}`;
        help += `  ${name.padEnd(20)} - ${count} slides (${dims}) - ${format.description}\n`;
    }

    return help;
}

module.exports = {
    loadFormatConfig,
    getFormat,
    detectContentType,
    detectSlideCount,
    getFormatByContentType,
    autoDetectFormat,
    resolveFormat,
    validateFormat,
    getAvailableFormats,
    getFormatHelpText
};

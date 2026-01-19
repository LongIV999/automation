/**
 * Skills Manager - Claude Skills Integration
 * 
 * Provides access to Claude Skills for content enhancement:
 * - ai-news-hunter: Trend research
 * - viral-script-writer: Caption optimization
 * - nano-banana: Visual prompts
 * - content-repurposer: Multi-platform adaptation
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs').promises;
const path = require('path');

class SkillsManager {
    constructor(apiKey, baseURL) {
        this.client = new Anthropic({
            apiKey: apiKey,
            baseURL: baseURL
        });
        this.model = 'claude-sonnet-4-20250514';
    }

    /**
     * Execute a Claude Skill
     * @param {string} skillPath - Path to skill markdown file
     * @param {Object} params - Parameters for the skill
     * @returns {Promise<Object>} - Skill execution result
     */
    async executeSkill(skillPath, params) {
        try {
            // Read skill instructions
            const skillContent = await fs.readFile(skillPath, 'utf-8');

            // Build prompt with skill + params
            const prompt = this.buildSkillPrompt(skillContent, params);

            // Execute via Claude API
            const response = await this.client.messages.create({
                model: this.model,
                max_tokens: 4000,
                messages: [
                    { role: 'user', content: prompt }
                ]
            });

            return this.parseSkillOutput(response.content[0].text);

        } catch (error) {
            console.error(`❌ Skill execution failed: ${path.basename(skillPath)}`, error.message);
            throw error;
        }
    }

    /**
     * Build prompt combining skill instructions + user params
     */
    buildSkillPrompt(skillContent, params) {
        let prompt = skillContent + '\n\n---\n\n';
        prompt += `USER INPUT:\n${JSON.stringify(params, null, 2)}`;
        return prompt;
    }

    /**
     * Parse skill output (JSON or text)
     */
    parseSkillOutput(text) {
        // Try JSON first
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            } catch (e) {
                // Not valid JSON, return as text
            }
        }

        return { rawText: text };
    }

    /**
     * SKILL: AI News Hunter - Trend Research
     */
    async huntTrends(topic, market = 'Vietnam') {
        const skillPath = path.join(__dirname, '../../../.claude/skills/ai-news-hunter--trend-detector/SKILL.md');

        return await this.executeSkill(skillPath, {
            query: topic,
            market: market,
            focus: 'viral_angles'
        });
    }

    /**
     * SKILL: Viral Script Writer - Caption Enhancement
     */
    async enhanceCaption(topic, contentType, brand) {
        const skillPath = path.join(__dirname, '../../../.claude/skills/viral-script-writer/SKILL.md');

        return await this.executeSkill(skillPath, {
            topic: topic,
            contentType: contentType,
            brand: brand,
            platform: 'Facebook',
            maxLength: 300
        });
    }

    /**
     * SKILL: Nano Banana - Visual Prompts
     */
    async generateVisualPrompts(slides, style = 'minimalist') {
        const skillPath = path.join(__dirname, '../../../.claude/skills/nano-banana/SKILL.md');

        return await this.executeSkill(skillPath, {
            slides: slides,
            style: style,
            aspectRatio: '4:5'
        });
    }

    /**
     * SKILL: Content Repurposer - Multi-platform
     */
    async repurposeContent(content, platforms = ['Facebook', 'Instagram']) {
        const skillPath = path.join(__dirname, '../../../.claude/skills/content-repurposer/SKILL.md');

        return await this.executeSkill(skillPath, {
            sourceContent: content,
            targetPlatforms: platforms
        });
    }
}

module.exports = SkillsManager;
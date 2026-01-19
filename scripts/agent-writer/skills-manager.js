/**
 * Skills Manager - Claude Skills Integration v3
 * Optimized for available skills in /Users/admin/automation/.claude/skills/
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs').promises;
const path = require('path');

class SkillsManager {
    constructor(apiKey, baseURL, model) {
        this.client = new Anthropic({
            apiKey: apiKey,
            baseURL: baseURL
        });
        this.model = model || 'claude-3-5-sonnet-20240620';

        // Primary skill to use (the one you have)
        this.primarySkillPath = path.join(
            __dirname,
            '../../.claude/skills/content-research-writer/SKILL.md'
        );
    }

    /**
     * Execute a Claude Skill with enhanced error handling
     */
    async executeSkill(skillPath, params, taskType = 'general') {
        try {
            // Check if skill exists
            try {
                await fs.access(skillPath);
            } catch {
                console.warn(`⚠️  Skill not found: ${path.basename(skillPath)}`);
                return {
                    _skillNotFound: true,
                    _skillPath: skillPath,
                    _taskType: taskType
                };
            }

            // Read skill instructions
            const skillContent = await fs.readFile(skillPath, 'utf-8');

            // Build enhanced prompt with task context
            const prompt = this.buildEnhancedPrompt(skillContent, params, taskType);

            console.log(`  → Executing skill: ${path.basename(skillPath)} [${taskType}]`);

            // Execute via Claude API
            const response = await this.client.messages.create({
                model: this.model,
                max_tokens: 4000,
                messages: [
                    { role: 'user', content: prompt }
                ]
            });

            const result = this.parseSkillOutput(response.content[0].text);
            console.log(`  ✓ Skill completed`);

            return result;

        } catch (error) {
            console.error(`  ✗ Skill error: ${error.message}`);
            return {
                _skillError: true,
                _errorMessage: error.message,
                _taskType: taskType
            };
        }
    }

    /**
     * Build enhanced prompt with task-specific instructions
     */
    buildEnhancedPrompt(skillContent, params, taskType) {
        let prompt = `# TASK TYPE: ${taskType}\n\n`;
        prompt += skillContent + '\n\n';
        prompt += `---\n\n`;
        prompt += `USER INPUT:\n${JSON.stringify(params, null, 2)}\n\n`;

        // Add task-specific guidance
        prompt += this.getTaskGuidance(taskType);

        return prompt;
    }

    /**
     * Get task-specific guidance
     */
    getTaskGuidance(taskType) {
        const guidance = {
            'trend-research': `
## EXPECTED OUTPUT (JSON):
{
  "viralAngles": ["angle 1", "angle 2", "angle 3"],
  "keyInsights": ["insight 1", "insight 2"],
  "recommendedHooks": ["hook 1", "hook 2"]
}`,

            'caption-enhancement': `
## EXPECTED OUTPUT (JSON):
{
  "hook": "Opening hook (5-10 words)",
  "enhancedCaption": "Full caption text",
  "cta": "Call to action",
  "hashtags": ["#tag1", "#tag2"]
}`,

            'visual-prompts': `
## EXPECTED OUTPUT (JSON):
{
  "prompts": [
    "Detailed image prompt for slide 1",
    "Detailed image prompt for slide 2",
    ...
  ]
}`,

            'content-repurpose': `
## EXPECTED OUTPUT (JSON):
{
  "Facebook": "Facebook version",
  "Instagram": "Instagram version",
  "Twitter": "Twitter version"
}`
        };

        return guidance[taskType] || '';
    }

    /**
     * Parse skill output (JSON or text)
     */
    parseSkillOutput(text) {
        // Try to extract JSON from markdown code blocks
        const codeBlockMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/);
        if (codeBlockMatch) {
            try {
                return JSON.parse(codeBlockMatch[1]);
            } catch (e) {
                // Continue to next extraction method
            }
        }

        // Try to find raw JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            } catch (e) {
                // Not valid JSON
            }
        }

        // Fallback: return as text
        return { rawText: text };
    }

    /**
     * SKILL: Trend Research
     * Uses content-research-writer with trend-focused instructions
     */
    async huntTrends(topic, market = 'Vietnam') {
        const result = await this.executeSkill(
            this.primarySkillPath,
            {
                task: 'Research current trends and viral angles',
                topic: topic,
                market: market,
                outputFormat: 'JSON with viralAngles array',
                requirements: [
                    'Identify 3-5 viral angles for this topic',
                    'Focus on emotional hooks and curiosity gaps',
                    'Consider current events and cultural context',
                    'Return as JSON: { viralAngles: [...], keyInsights: [...] }'
                ]
            },
            'trend-research'
        );

        // Handle missing skill gracefully
        if (result._skillNotFound || result._skillError) {
            return {
                viralAngles: [],
                keyInsights: [`Original topic: ${topic}`],
                _fallback: true
            };
        }

        return result;
    }

    /**
     * SKILL: Caption Enhancement
     * Uses content-research-writer for viral caption writing
     */
    async enhanceCaption(topic, contentType, brand) {
        const result = await this.executeSkill(
            this.primarySkillPath,
            {
                task: 'Create viral caption with hook',
                topic: topic,
                contentType: contentType,
                brand: brand,
                platform: 'Facebook',
                maxLength: 300,
                requirements: [
                    'Create attention-grabbing opening hook (5-10 words)',
                    'Use curiosity gaps and pattern interrupts',
                    'Include clear call-to-action',
                    'Return as JSON: { hook: "...", enhancedCaption: "...", cta: "..." }'
                ]
            },
            'caption-enhancement'
        );

        if (result._skillNotFound || result._skillError) {
            return {
                hook: null,
                enhancedCaption: null,
                _fallback: true
            };
        }

        return result;
    }

    /**
     * SKILL: Visual Prompts Generation
     * Uses content-research-writer for image prompt creation
     */
    async generateVisualPrompts(slides, style = 'minimalist') {
        const result = await this.executeSkill(
            this.primarySkillPath,
            {
                task: 'Generate visual image prompts',
                slides: slides.map((s, i) => ({
                    slideNumber: i + 1,
                    type: s.type,
                    headline: s.headline,
                    content: Array.isArray(s.content) ? s.content.join('; ') : s.content
                })),
                style: style,
                aspectRatio: '4:5',
                requirements: [
                    'Create detailed image generation prompts for each slide',
                    'Match the visual style and brand aesthetic',
                    'Include composition, colors, mood, and key elements',
                    'Return as JSON: { prompts: ["prompt1", "prompt2", ...] }'
                ]
            },
            'visual-prompts'
        );

        if (result._skillNotFound || result._skillError) {
            return {
                prompts: slides.map(() => null),
                _fallback: true
            };
        }

        return result;
    }

    /**
     * SKILL: Content Repurposing
     * Uses content-research-writer for multi-platform adaptation
     */
    async repurposeContent(content, platforms = ['Facebook', 'Instagram']) {
        const result = await this.executeSkill(
            this.primarySkillPath,
            {
                task: 'Adapt content for multiple platforms',
                sourceContent: content,
                targetPlatforms: platforms,
                requirements: [
                    'Adapt tone and format for each platform',
                    'Optimize for platform-specific best practices',
                    'Maintain core message while adjusting style',
                    'Return as JSON: { "Facebook": "...", "Instagram": "..." }'
                ]
            },
            'content-repurpose'
        );

        if (result._skillNotFound || result._skillError) {
            return platforms.reduce((acc, platform) => {
                acc[platform] = content;
                return acc;
            }, { _fallback: true });
        }

        return result;
    }
}

module.exports = SkillsManager;
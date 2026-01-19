/**
 * Skill Integrator - Helper for integrating skills into workflows
 * Provides a unified interface to use skills from the skill/ directory
 */

const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');

class SkillIntegrator {
    constructor() {
        this.skills = new Map();
        this.skillsPath = path.join(__dirname, '../../skill');
    }

    /**
     * Load a skill by name
     * @param {string} skillName - Name of the skill (e.g., 'orchestrator', 'content-research-writer')
     */
    async loadSkill(skillName) {
        if (this.skills.has(skillName)) {
            return this.skills.get(skillName);
        }

        try {
            const skillPath = path.join(this.skillsPath, skillName, 'SKILL.md');
            const skillContent = await fs.readFile(skillPath, 'utf-8');
            
            // Parse skill metadata
            const skill = {
                name: skillName,
                content: skillContent,
                instructions: this.extractInstructions(skillContent),
                templates: await this.loadSkillTemplates(skillName),
                examples: await this.loadSkillExamples(skillName)
            };

            this.skills.set(skillName, skill);
            logger.info(`Loaded skill: ${skillName}`);
            
            return skill;
        } catch (error) {
            logger.error(`Failed to load skill: ${skillName}`, error);
            throw error;
        }
    }

    /**
     * Execute a skill-based task
     * @param {string} skillName - Name of the skill
     * @param {object} context - Context for skill execution
     */
    async executeSkill(skillName, context) {
        const skill = await this.loadSkill(skillName);
        
        switch (skillName) {
            case 'orchestrator':
                return this.executeOrchestrator(skill, context);
            case 'content-research-writer':
                return this.executeContentWriter(skill, context);
            case 'planning':
                return this.executePlanning(skill, context);
            case 'issue-resolution':
                return this.executeIssueResolution(skill, context);
            default:
                throw new Error(`Unknown skill: ${skillName}`);
        }
    }

    /**
     * Execute orchestrator skill for multi-agent coordination
     */
    async executeOrchestrator(skill, context) {
        const { tasks, brand, parallel = false } = context;
        
        logger.info('Executing orchestrator skill', { tasks: tasks.length, brand, parallel });

        // Create worker agents based on tasks
        const workers = tasks.map((task, index) => ({
            id: `worker_${index}`,
            task,
            status: 'pending',
            result: null
        }));

        if (parallel) {
            // Execute tasks in parallel
            const promises = workers.map(async (worker) => {
                try {
                    worker.status = 'running';
                    worker.result = await this.executeTask(worker.task, brand);
                    worker.status = 'completed';
                } catch (error) {
                    worker.status = 'failed';
                    worker.error = error.message;
                }
                return worker;
            });

            await Promise.all(promises);
        } else {
            // Execute tasks sequentially
            for (const worker of workers) {
                try {
                    worker.status = 'running';
                    worker.result = await this.executeTask(worker.task, brand);
                    worker.status = 'completed';
                } catch (error) {
                    worker.status = 'failed';
                    worker.error = error.message;
                    break; // Stop on first error in sequential mode
                }
            }
        }

        return {
            workers,
            summary: this.generateOrchestratorSummary(workers)
        };
    }

    /**
     * Execute content research and writer skill
     */
    async executeContentWriter(skill, context) {
        const { topic, brand, format = 'carousel' } = context;
        
        logger.info('Executing content writer skill', { topic, brand, format });

        // Load brand configuration
        const brandConfig = await this.loadBrandConfig(brand);
        
        // Generate content using skill templates
        const contentStructure = this.generateContentStructure(topic, brandConfig, format);
        
        return {
            content: contentStructure,
            metadata: {
                brand,
                format,
                generatedAt: new Date().toISOString()
            }
        };
    }

    /**
     * Execute planning skill
     */
    async executePlanning(skill, context) {
        const { requirement, scope } = context;
        
        logger.info('Executing planning skill', { requirement, scope });

        // Load planning templates
        const templates = skill.templates;
        
        // Generate execution plan
        const plan = {
            requirement,
            scope,
            steps: this.generatePlanSteps(requirement, templates),
            dependencies: this.analyzeDependencies(requirement),
            estimatedDuration: this.estimateDuration(requirement)
        };

        return plan;
    }

    /**
     * Execute issue resolution skill
     */
    async executeIssueResolution(skill, context) {
        const { error, workflow, runId } = context;
        
        logger.info('Executing issue resolution skill', { error, workflow, runId });

        // Analyze error
        const analysis = {
            errorType: this.classifyError(error),
            possibleCauses: this.analyzeCauses(error, workflow),
            suggestedFixes: this.generateFixes(error, workflow),
            preventionMeasures: this.generatePreventionMeasures(error)
        };

        return analysis;
    }

    // Helper methods
    extractInstructions(content) {
        const instructionMatch = content.match(/## Instructions([\s\S]*?)##/);
        return instructionMatch ? instructionMatch[1].trim() : '';
    }

    async loadSkillTemplates(skillName) {
        try {
            const templatePath = path.join(this.skillsPath, skillName, 'reference', 'templates.md');
            return await fs.readFile(templatePath, 'utf-8');
        } catch {
            return null;
        }
    }

    async loadSkillExamples(skillName) {
        try {
            const examplesPath = path.join(this.skillsPath, skillName, 'reference', 'examples.md');
            return await fs.readFile(examplesPath, 'utf-8');
        } catch {
            return null;
        }
    }

    async loadBrandConfig(brand) {
        const configPath = path.join(__dirname, '../../brands', brand, 'brand.json');
        const configContent = await fs.readFile(configPath, 'utf-8');
        return JSON.parse(configContent);
    }

    async executeTask(task, brand) {
        // Simulate task execution
        // In real implementation, this would call actual task runners
        return {
            task,
            result: `Completed: ${task}`,
            timestamp: new Date().toISOString()
        };
    }

    generateContentStructure(topic, brandConfig, format) {
        // Generate content structure based on format
        const baseStructure = {
            title: topic,
            brand: brandConfig.name,
            format,
            style: brandConfig.style || {},
            slides: []
        };

        // Add format-specific structure
        switch (format) {
            case 'carousel':
                baseStructure.slides = this.generateCarouselSlides(topic, brandConfig);
                break;
            case 'single-post':
                baseStructure.content = this.generateSinglePost(topic, brandConfig);
                break;
            default:
                break;
        }

        return baseStructure;
    }

    generateCarouselSlides(topic, brandConfig) {
        // Generate carousel slides based on topic
        return [
            {
                type: 'title',
                content: topic,
                backgroundColor: brandConfig.colors?.primary || '#000'
            },
            // Add more slides based on content
        ];
    }

    generateSinglePost(topic, brandConfig) {
        return {
            headline: topic,
            body: `Content about ${topic}`,
            cta: brandConfig.defaultCTA || 'Learn More'
        };
    }

    generateOrchestratorSummary(workers) {
        const completed = workers.filter(w => w.status === 'completed').length;
        const failed = workers.filter(w => w.status === 'failed').length;
        
        return {
            total: workers.length,
            completed,
            failed,
            successRate: completed / workers.length
        };
    }

    generatePlanSteps(requirement, templates) {
        // Generate execution steps based on requirement
        return [
            { step: 1, action: 'Analyze requirement', duration: '10m' },
            { step: 2, action: 'Setup environment', duration: '15m' },
            { step: 3, action: 'Implement solution', duration: '1h' },
            { step: 4, action: 'Test and validate', duration: '30m' }
        ];
    }

    analyzeDependencies(requirement) {
        // Analyze dependencies for the requirement
        return {
            tools: ['Node.js', 'npm'],
            apis: ['Claude API', 'Google APIs'],
            skills: ['orchestrator', 'content-writer']
        };
    }

    estimateDuration(requirement) {
        // Estimate duration based on requirement complexity
        return '2-3 hours';
    }

    classifyError(error) {
        if (error.includes('API')) return 'api_error';
        if (error.includes('file')) return 'file_error';
        if (error.includes('network')) return 'network_error';
        return 'unknown_error';
    }

    analyzeCauses(error, workflow) {
        // Analyze possible causes based on error and workflow
        return [
            'API rate limit exceeded',
            'Invalid credentials',
            'Network connectivity issue'
        ];
    }

    generateFixes(error, workflow) {
        // Generate suggested fixes
        return [
            'Check API credentials in .env file',
            'Implement retry logic with exponential backoff',
            'Verify network connectivity'
        ];
    }

    generatePreventionMeasures(error) {
        // Generate prevention measures
        return [
            'Add input validation',
            'Implement proper error handling',
            'Add monitoring and alerts'
        ];
    }
}

// Singleton instance
const skillIntegrator = new SkillIntegrator();

module.exports = skillIntegrator;
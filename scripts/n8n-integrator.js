/**
 * n8n Workflow Integrator
 * Bridges Node.js scripts with n8n workflows via webhooks and Google Sheets
 */

const axios = require('axios');
const logger = require('./utils/logger');
const monitor = require('./workflow-monitor/monitor');
const skillIntegrator = require('./utils/skill-integrator');

class N8nIntegrator {
    constructor(config = {}) {
        this.webhookBaseUrl = config.webhookUrl || process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook';
        this.apiKey = config.apiKey || process.env.N8N_API_KEY;
    }

    /**
     * Trigger n8n workflow via webhook
     * @param {string} workflowId - n8n workflow ID or webhook path
     * @param {object} data - Data to send to workflow
     */
    async triggerWorkflow(workflowId, data = {}) {
        const runId = `n8n_${Date.now()}`;
        const webhookUrl = `${this.webhookBaseUrl}/${workflowId}`;

        logger.info(`Triggering n8n workflow: ${workflowId}`, { runId, data });

        // Start monitoring
        const workflow = monitor.startWorkflow(runId, data.brand || 'unknown', 'n8n-workflow', {
            n8nWorkflowId: workflowId,
            webhookUrl
        });

        try {
            monitor.updateStep(runId, 'webhook-trigger', 'running');

            const response = await axios.post(webhookUrl, {
                ...data,
                metadata: {
                    triggeredBy: 'node-script',
                    timestamp: new Date().toISOString(),
                    runId
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
                },
                timeout: 300000 // 5 minutes timeout
            });

            monitor.updateStep(runId, 'webhook-trigger', 'completed');
            monitor.completeWorkflow(runId, true);

            logger.info(`n8n workflow completed: ${workflowId}`, { 
                runId, 
                status: response.status,
                data: response.data 
            });

            return {
                success: true,
                runId,
                response: response.data
            };

        } catch (error) {
            monitor.updateStep(runId, 'webhook-trigger', 'failed');
            monitor.completeWorkflow(runId, false, error.message);

            logger.error(`n8n workflow failed: ${workflowId}`, {
                runId,
                error: error.message,
                response: error.response?.data
            });

            throw error;
        }
    }

    /**
     * Create integrated workflow combining Node.js scripts and n8n
     */
    async createIntegratedWorkflow(config) {
        const { name, steps, brand } = config;
        const workflowRunId = `integrated_${Date.now()}`;

        logger.info(`Starting integrated workflow: ${name}`, { workflowRunId, brand });

        const results = [];

        for (const step of steps) {
            try {
                let result;

                switch (step.type) {
                    case 'script':
                        result = await this.runNodeScript(step, workflowRunId);
                        break;
                    case 'n8n':
                        result = await this.triggerWorkflow(step.workflowId, {
                            ...step.data,
                            brand,
                            parentRunId: workflowRunId
                        });
                        break;
                    case 'skill':
                        result = await skillIntegrator.executeSkill(step.skillName, {
                            ...step.context,
                            brand,
                            runId: workflowRunId
                        });
                        break;
                    default:
                        throw new Error(`Unknown step type: ${step.type}`);
                }

                results.push({
                    step: step.name,
                    type: step.type,
                    success: true,
                    result
                });

            } catch (error) {
                results.push({
                    step: step.name,
                    type: step.type,
                    success: false,
                    error: error.message
                });

                if (!step.continueOnError) {
                    break;
                }
            }
        }

        return {
            workflowRunId,
            name,
            results,
            success: results.every(r => r.success)
        };
    }

    /**
     * Run Node.js script as part of integrated workflow
     */
    async runNodeScript(step, parentRunId) {
        const { command, args = [], cwd } = step;
        const { exec } = require('child_process');
        const util = require('util');
        const execPromise = util.promisify(exec);

        logger.info(`Running Node script: ${command}`, { parentRunId, args });

        const fullCommand = `node ${command} ${args.join(' ')}`;
        const { stdout, stderr } = await execPromise(fullCommand, { cwd });

        return {
            stdout: stdout.trim(),
            stderr: stderr.trim()
        };
    }

    /**
     * Setup webhook endpoint for n8n callbacks
     */
    setupWebhookEndpoint(app, path = '/webhook/n8n-callback') {
        app.post(path, (req, res) => {
            const { runId, status, data } = req.body;

            logger.info('Received n8n callback', { runId, status });

            // Update monitor if we have an active workflow
            if (runId && monitor.activeWorkflows.has(runId)) {
                if (status === 'completed') {
                    monitor.completeWorkflow(runId, true);
                } else if (status === 'failed') {
                    monitor.completeWorkflow(runId, false, data?.error);
                }
            }

            res.json({ received: true });
        });

        logger.info(`n8n callback endpoint setup at: ${path}`);
    }
}

// Example usage functions

/**
 * Example: Trigger content publishing workflow
 */
async function publishContent(brand, postId) {
    const integrator = new N8nIntegrator();
    
    return await integrator.triggerWorkflow('publish-content', {
        brand,
        postId,
        action: 'publish'
    });
}

/**
 * Example: Create full content pipeline with n8n integration
 */
async function createContentPipeline(topic, brand) {
    const integrator = new N8nIntegrator();
    
    const workflowConfig = {
        name: 'Full Content Pipeline',
        brand,
        steps: [
            {
                name: 'Generate Content',
                type: 'skill',
                skillName: 'content-research-writer',
                context: { topic, format: 'carousel' }
            },
            {
                name: 'Create Images',
                type: 'script',
                command: 'scripts/carousel-generator/generator-optimized.js',
                args: [],
                cwd: process.cwd()
            },
            {
                name: 'Upload to Drive',
                type: 'script',
                command: 'scripts/drive-uploader/upload.js',
                args: ['--brand', brand],
                cwd: process.cwd()
            },
            {
                name: 'Schedule Publishing',
                type: 'n8n',
                workflowId: 'schedule-post',
                data: {
                    scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                }
            }
        ]
    };

    return await integrator.createIntegratedWorkflow(workflowConfig);
}

module.exports = {
    N8nIntegrator,
    publishContent,
    createContentPipeline
};
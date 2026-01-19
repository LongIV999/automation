/**
 * AI-Powered Error Handler for Automation Workflows
 * 
 * Intelligently analyzes errors and suggests/implements recovery strategies
 * using Claude API for context-aware debugging
 * 
 * @module AIErrorHandler
 * @version 1.0.0
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs').promises;
const path = require('path');

class AIErrorHandler {
    /**
     * Initialize AI Error Handler
     * @param {string} apiKey - Anthropic API key
     * @param {string} baseURL - Optional custom API endpoint
     * @param {string} model - Claude model to use
     */
    constructor(apiKey, baseURL = null, model = 'claude-3-5-sonnet-20241022') {
        this.anthropic = new Anthropic({
            apiKey: apiKey,
            ...(baseURL && { baseURL })
        });
        this.model = model;
        this.errorHistory = [];
        this.recoveryStrategies = new Map();
    }

    /**
     * Analyze error and suggest recovery strategy
     * @param {Error} error - The error object
     * @param {Object} context - Additional context about where error occurred
     * @returns {Promise<Object>} Analysis and recovery suggestions
     */
    async analyzeAndSuggestFix(error, context = {}) {
        const errorContext = {
            message: error.message,
            name: error.name,
            stack: error.stack?.split('\n').slice(0, 10), // First 10 lines
            timestamp: new Date().toISOString(),
            ...context
        };

        // Log to error history
        this.errorHistory.push(errorContext);

        const systemPrompt = `You are a debugging assistant специалizing in Node.js automation workflows.

Your task: Analyze errors and provide actionable recovery strategies.

System Context:
- Platform: n8n workflow automation + Node.js scripts
- Tech Stack: Puppeteer, Claude API, Google APIs, Facebook Graph API
- Common Issues: Rate limits, network timeouts, JSON parsing, authentication failures

Analysis Framework:
1. Identify root cause (not just symptoms)
2. Categorize error type
3. Assess severity and business impact
4. Suggest immediate fix
5. Provide code example if applicable
6. Recommend long-term prevention
7. Offer alternative approach if original can't be fixed

Output MUST be valid JSON matching this schema:
{
  "rootCause": "Clear explanation of what actually went wrong",
  "errorCategory": "network" | "api_limit" | "authentication" | "data_validation" | "timeout" | "file_system" | "unknown",
  "severity": "low" | "medium" | "high" | "critical",
  "businessImpact": "Description of how this affects workflow/users",
  "immediateFix": "Step-by-step fix to resolve now",
  "codeExample": "Working code snippet (if applicable)",
  "prevention": "How to prevent this in future",
  "alternativeApproach": "Different way to achieve same goal",
  "autoRecoverable": boolean,
  "estimatedFixTime": "X minutes" | "X hours",
  "relatedErrors": ["Similar errors that might occur"]
}`;

        const userPrompt = `Analyze this error:

${JSON.stringify(errorContext, null, 2)}

Provide analysis and recovery strategy.`;

        try {
            const response = await this.anthropic.messages.create({
                model: this.model,
                max_tokens: 3000,
                system: systemPrompt,
                messages: [
                    { role: 'user', content: userPrompt }
                ]
            });

            const textResponse = response.content[0].text;
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);

            if (!jsonMatch) {
                throw new Error('No valid JSON in AI response');
            }

            const analysis = JSON.parse(jsonMatch[0]);

            // Cache this recovery strategy
            const errorSignature = this.getErrorSignature(error);
            this.recoveryStrategies.set(errorSignature, analysis);

            return analysis;

        } catch (aiError) {
            // Fallback if AI analysis fails
            console.error('AI analysis failed:', aiError.message);
            return this.getFallbackAnalysis(error, context);
        }
    }

    /**
     * Retry operation with AI-guided strategy
     * @param {Function} operation - Async function to retry
     * @param {Object} options - Retry options
     * @returns {Promise<any>} Result of successful operation
     */
    async retryWithAIGuidance(operation, options = {}) {
        const {
            maxRetries = 3,
            baseDelay = 1000,
            exponentialBackoff = true,
            operationName = 'operation',
            context = {}
        } = options;

        let lastError;
        let lastAnalysis;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`\n🔄 Attempt ${attempt}/${maxRetries}: ${operationName}`);

                // Execute operation
                const result = await operation();

                // Success
                console.log(`✅ ${operationName} succeeded on attempt ${attempt}`);
                if (attempt > 1) {
                    // Log recovery success
                    await this.logRecoverySuccess(operationName, attempt, lastAnalysis);
                }

                return result;

            } catch (error) {
                lastError = error;
                console.error(`❌ Attempt ${attempt} failed:`, error.message);

                if (attempt < maxRetries) {
                    // Analyze error with AI
                    console.log('🤖 Analyzing error with AI...');
                    lastAnalysis = await this.analyzeAndSuggestFix(error, {
                        attempt,
                        operationName,
                        ...context
                    });

                    console.log(`\n📊 AI Analysis:`);
                    console.log(`   Root Cause: ${lastAnalysis.rootCause}`);
                    console.log(`   Category: ${lastAnalysis.errorCategory}`);
                    console.log(`   Severity: ${lastAnalysis.severity}`);
                    console.log(`   Fix: ${lastAnalysis.immediateFix}`);

                    // Determine wait time
                    let waitTime;
                    if (lastAnalysis.errorCategory === 'api_limit') {
                        waitTime = 60000; // 1 minute for rate limits
                    } else if (lastAnalysis.errorCategory === 'network') {
                        waitTime = exponentialBackoff
                            ? Math.pow(2, attempt) * baseDelay
                            : baseDelay;
                    } else {
                        waitTime = baseDelay;
                    }

                    // If error is not auto-recoverable, log and fail fast
                    if (!lastAnalysis.autoRecoverable && lastAnalysis.severity === 'critical') {
                        console.error('⚠️  Critical error that cannot auto-recover');
                        throw lastError;
                    }

                    console.log(`⏳ Waiting ${waitTime}ms before retry...`);
                    await this.sleep(waitTime);

                    // Apply suggested fixes if possible
                    await this.applyAutoFixes(lastAnalysis, context);

                } else {
                    // Max retries reached
                    console.error(`\n💥 All ${maxRetries} attempts failed`);

                    if (lastAnalysis) {
                        console.log('\n📋 Final Analysis:');
                        console.log(`   Alternative: ${lastAnalysis.alternativeApproach}`);
                        console.log(`   Prevention: ${lastAnalysis.prevention}`);
                    }
                }
            }
        }

        // All retries exhausted
        throw new Error(
            `${operationName} failed after ${maxRetries} attempts. ` +
            `Last error: ${lastError.message}. ` +
            (lastAnalysis ? `AI suggestion: ${lastAnalysis.alternativeApproach}` : '')
        );
    }

    /**
     * Apply automatic fixes based on AI analysis
     * @param {Object} analysis - AI error analysis
     * @param {Object} context - Workflow context
     */
    async applyAutoFixes(analysis, context) {
        // Example auto-fixes that can be applied programmatically

        if (analysis.errorCategory === 'timeout') {
            // Could increase timeout in context
            if (context.timeout) {
                context.timeout = Math.min(context.timeout * 1.5, 120000);
                console.log(`   🔧 Auto-fix: Increased timeout to ${context.timeout}ms`);
            }
        }

        if (analysis.errorCategory === 'file_system') {
            // Could ensure directories exist
            if (context.outputPath) {
                try {
                    await fs.mkdir(path.dirname(context.outputPath), { recursive: true });
                    console.log(`   🔧 Auto-fix: Created directory structure`);
                } catch (e) {
                    // Ignore if already exists
                }
            }
        }

        // Add more auto-fixes as needed
    }

    /**
     * Get error signature for caching
     * @param {Error} error
     * @returns {string} Unique error signature
     */
    getErrorSignature(error) {
        return `${error.name}:${error.message.substring(0, 100)}`;
    }

    /**
     * Get fallback analysis when AI fails
     * @param {Error} error
     * @param {Object} context
     * @returns {Object} Basic error analysis
     */
    getFallbackAnalysis(error, context) {
        return {
            rootCause: error.message,
            errorCategory: 'unknown',
            severity: 'medium',
            businessImpact: 'Workflow interrupted',
            immediateFix: 'Check error logs and retry manually',
            codeExample: '',
            prevention: 'Implement better error handling',
            alternativeApproach: 'Review workflow logic',
            autoRecoverable: false,
            estimatedFixTime: '15 minutes',
            relatedErrors: []
        };
    }

    /**
     * Log successful recovery for learning
     * @param {string} operationName
     * @param {number} successAttempt
     * @param {Object} analysis
     */
    async logRecoverySuccess(operationName, successAttempt, analysis) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            operation: operationName,
            attemptsNeeded: successAttempt,
            errorCategory: analysis?.errorCategory,
            recoveryStrategy: analysis?.immediateFix
        };

        // Could write to file or database
        console.log('\n✨ Recovery successful:', logEntry);
    }

    /**
     * Get error history for analysis
     * @param {number} limit - Max number of errors to return
     * @returns {Array} Recent errors
     */
    getErrorHistory(limit = 10) {
        return this.errorHistory.slice(-limit);
    }

    /**
     * Utility: Sleep function
     * @param {number} ms - Milliseconds to sleep
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export
module.exports = AIErrorHandler;

// Example Usage
if (require.main === module) {
    async function demo() {
        // Initialize
        const apiKey = process.env.ANTHROPIC_AUTH_TOKEN;
        const handler = new AIErrorHandler(apiKey);

        // Example operation that might fail
        const riskyOperation = async () => {
            const random = Math.random();
            if (random < 0.6) {
                throw new Error('API rate limit exceeded (429)');
            }
            return { success: true, data: 'Operation completed' };
        };

        try {
            const result = await handler.retryWithAIGuidance(riskyOperation, {
                maxRetries: 5,
                operationName: 'Claude API Call',
                context: {
                    workflow: 'content-generation',
                    brand: 'longbest'
                }
            });

            console.log('\n🎉 Final result:', result);

        } catch (error) {
            console.error('\n💥 Operation ultimately failed:', error.message);

            // Get AI analysis
            const analysis = await handler.analyzeAndSuggestFix(error, {
                workflow: 'content-generation'
            });

            console.log('\n📋 Detailed Analysis:');
            console.log(JSON.stringify(analysis, null, 2));
        }
    }

    // Run demo
    demo().catch(console.error);
}

/**
 * Daily Agent Orchestrator
 * 
 * Coordinates the entire content production pipeline:
 * 1. Writer (Claude API) -> Creates content JSON
 * 2. Generator (Puppeteer) -> Creates images from JSON
 * 3. Uploader (Drive API) -> Uploads images and updates Sheet
 * 
 * Usage: node daily-agent.js "Topic Name"
 */

const { exec } = require('child_process');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);
const logger = require('./utils/logger');
const { sendTelegramNotification, sendSuccessNotification } = require('./utils/notifier');
const analytics = require('./utils/db');
const AIErrorHandler = require('../templates/error-handling/ai-error-handler');

// Initialize AI Error Handler (will load API key from settings)
let errorHandler = null;
async function getErrorHandler() {
    if (!errorHandler) {
        const apiKey = process.env.ANTHROPIC_AUTH_TOKEN;
        if (apiKey) {
            errorHandler = new AIErrorHandler(apiKey);
            logger.info('AI Error Handler initialized');
        }
    }
    return errorHandler;
}

async function runCommand(command, cwd, context = {}) {
    logger.debug(`Running command: ${command}`, { cwd });
    console.log(`\n▶️  Running: ${command}`);

    const handler = await getErrorHandler();

    // If AI error handler available, use it with retry logic
    if (handler) {
        return await handler.retryWithAIGuidance(
            async () => {
                const { stdout, stderr } = await execPromise(command, { cwd });
                console.log(stdout.trim());
                if (stderr && stderr.length < 2000) {
                    console.error(stderr.trim());
                }
                return stdout;
            },
            {
                maxRetries: 3,
                operationName: `Command: ${command.substring(0, 50)}...`,
                context: { command, cwd, ...context }
            }
        );
    }

    // Fallback to basic execution if no AI handler
    try {
        const { stdout, stderr } = await execPromise(command, { cwd });
        console.log(stdout.trim());
        if (stderr && stderr.length < 2000) {
            console.error(stderr.trim());
        }
        return stdout;
    } catch (error) {
        logger.error(`Command failed: ${command}`, {
            cwd,
            error: error.message,
            stdout: error.stdout,
            stderr: error.stderr
        });
        console.error(`❌ Command failed: ${command}`);
        console.error(error.stdout);
        console.error(error.stderr);
        throw error;
    }
}

async function main() {
    const startTime = Date.now();
    const runId = `run_${Date.now()}`;

    // Parse args
    const args = process.argv.slice(2);

    // Helper to get value for flag
    const getArgValue = (flag) => {
        const idx = args.indexOf(flag);
        return idx !== -1 ? args[idx + 1] : null;
    };

    const brand = getArgValue('--brand') || 'longbest';
    const style = getArgValue('--style') || 'classic'; // New style arg
    const format = getArgValue('--format') || 'auto'; // NEW: Format parameter
    const contentType = getArgValue('--type') || null; // NEW: Content type
    const bgOnly = args.includes('--bg-only'); // NEW: Background only mode
    const autoPublish = args.includes('--auto-publish'); // New publish flag

    // Get topic (remove flags)
    const topicArgs = args.filter((arg, i) => {
        if (arg.startsWith('--')) return false;
        if (i > 0 && args[i - 1].startsWith('--')) return false;
        return true;
    });
    const topic = topicArgs.join(' ').replace(/^"|"$/g, '');

    if (!topic) {
        console.error("❌ Please provide a topic.");
        console.log("Usage: node daily-agent.js \"Your Topic Here\" [options]");
        console.log("\nOptions:");
        console.log("  --brand <name>     Brand (longbest, thachvuland, queennailbern)");
        console.log("  --format <type>    Format (auto, single, carousel-mini, carousel-standard)");
        console.log("  --type <type>      Content type (quote, tips, tutorial, etc.)");
        console.log("  --style <style>    Design style (classic, notebook)");
        console.log("  --auto-publish     Auto-publish after generation");
        console.log("\nExamples:");
        console.log("  node daily-agent.js \"5 AI Tips\" --brand longbest --format auto");
        console.log("  node daily-agent.js \"Quote\" --brand longbest --format single");
        process.exit(1);
    }

    logger.info('Starting daily agent workflow', {
        runId,
        topic,
        brand,
        style,
        format,
        contentType,
        autoPublish
    });

    // Track workflow start in analytics
    analytics.startWorkflow(runId, brand, topic);

    const rootDir = __dirname;

    try {
        // ---------------------------------------------------------
        // 1. Agent Writer
        // ---------------------------------------------------------
        console.log("\n🤖 === STEP 1: CONTENT WRITING (AGENT) ===");
        logger.info('Step 1: Content writing started', { runId, topic, brand, format });

        // Build writer command with format parameters
        let writerCmd = `node writer.js "${topic}" --brand ${brand} --style ${style} --format ${format}`;
        if (contentType) {
            writerCmd += ` --type ${contentType}`;
        }

        const writerOutput = await runCommand(writerCmd, path.join(rootDir, 'agent-writer'));

        // Parse output path
        const match = writerOutput.match(/JSON_OUTPUT_FILE: (.*)/);
        if (!match) {
            const error = new Error("Could not find output file from writer");
            logger.error('Writer output parsing failed', { runId, writerOutput });
            throw error;
        }
        const jsonPath = match[1].trim();
        const baseName = path.basename(jsonPath, '.json');

        logger.info('Step 1: Content writing completed', {
            runId,
            outputFile: jsonPath,
            baseName
        });
        console.log(`✓ Content ready: ${jsonPath}`);

        // ---------------------------------------------------------
        // 2. Image Generator
        // ---------------------------------------------------------
        console.log("\n🎨 === STEP 2: IMAGE GENERATION ===");
        logger.info('Step 2: Image generation started', { runId, baseName });

        // Output dir
        const outputDir = path.join(rootDir, 'carousel-generator/output', baseName);

        // Run generator
        let generatorScript = 'generator.js';
        if (brand === 'thachvuland') {
            generatorScript = 'generator-tvland.js';
        } else if (brand === 'queennailbern') {
            generatorScript = 'generator.js'; // Use default for now, can customize later
        }

        // Note: generator.js takes content file and output dir
        // We run from carousel-generator dir to handle relative assets/templates correctly
        let genCmd = `node ${generatorScript} "${jsonPath}" "${outputDir}"`;
        if (bgOnly) genCmd += ' --bg-only';

        await runCommand(genCmd, path.join(rootDir, 'carousel-generator'));

        logger.info('Step 2: Image generation completed', {
            runId,
            outputDir,
            generatorScript
        });
        console.log(`✓ Images generated: ${outputDir}`);

        // ---------------------------------------------------------
        // 2.5 Image Enhancer (New)
        // ---------------------------------------------------------
        console.log("\n🪄  === STEP 2.5: IMAGE ENHANCEMENT ===");
        logger.info('Step 2.5: Image enhancement started', { runId });

        await runCommand(`node enhancer.js "${outputDir}"`, path.join(rootDir, 'carousel-generator'));

        logger.info('Step 2.5: Image enhancement completed', { runId });
        console.log(`✓ Images enhanced and sharpened`);

        // ---------------------------------------------------------
        // 3. Drive Uploader (Always Sync)
        // ---------------------------------------------------------
        console.log("\n☁️  === STEP 3: UPLOAD & SYNC ===");
        logger.info('Step 3: Upload & sync started', { runId, brand });

        // Run upload.js with JSON_OUTPUT enabled for tracking
        const uploadOutput = await runCommand(`JSON_OUTPUT=1 node upload.js "${outputDir}" --brand ${brand} --topic "${topic}"`, path.join(rootDir, 'drive-uploader'));

        // Try to parse JSON output for analytics
        try {
            const lines = uploadOutput.split('\n');
            const jsonLine = lines.find(line => line.trim().startsWith('{'));
            if (jsonLine) {
                const uploadResult = JSON.parse(jsonLine);
                analytics.trackPost(
                    uploadResult.folderId,
                    brand,
                    topic,
                    null, // title logic inside trackPost
                    uploadResult.folderId,
                    uploadResult.folderLink,
                    uploadResult.uploadedCount
                );
            }
        } catch (e) {
            logger.warn('Could not parse upload output for analytics', { error: e.message });
        }

        logger.info('Step 3: Upload & sync completed', { runId });

        // ---------------------------------------------------------
        // 4. Auto Publish (Bypass)
        // ---------------------------------------------------------
        if (autoPublish) {
            console.log("\n🚀 === STEP 4: AUTO PUBLISH (FACEBOOK) ===");
            await runCommand(`node publish-post.js "${outputDir}" ${brand}`, rootDir);
            console.log("✓ Published to Facebook successfully.");
        }

        // ---------------------------------------------------------
        // Finish
        // ---------------------------------------------------------
        const duration = Date.now() - startTime;
        const durationSec = (duration / 1000).toFixed(2);

        console.log("\n✨✨✨ AGENT WORKFLOW COMPLETE! ✨✨✨");
        console.log(`Topic: ${topic}`);
        console.log("Status: Ready for n8n to pick up from Google Sheets.");

        logger.info('Workflow completed successfully', {
            runId,
            duration: `${duration}ms`,
            durationSec: `${durationSec}s`,
            topic,
            brand,
            baseName
        });

        // Track success in analytics
        analytics.completeWorkflow(runId, duration);

        // Send success notification
        await sendSuccessNotification('Daily agent workflow completed', {
            topic,
            brand,
            duration: `${durationSec}s`,
            runId
        });

    } catch (error) {
        const duration = Date.now() - startTime;
        const durationSec = (duration / 1000).toFixed(2);

        console.error("\n❌ AGENT PROCESS FAILED");

        logger.error('Workflow failed', {
            runId,
            error: error.message,
            stack: error.stack,
            topic,
            brand,
            duration: `${duration}ms`
        });

        // Track failure in analytics
        analytics.failWorkflow(runId, duration, error.message);

        // Send error notification
        await sendTelegramNotification('Daily agent workflow failed', {
            topic,
            brand,
            error: error.message,
            duration: `${durationSec}s`,
            runId
        });

        // Error already logged in runCommand
        process.exit(1);
    }
}

main();

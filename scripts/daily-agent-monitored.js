/**
 * Daily Agent with Integrated Monitoring
 * Enhanced version with workflow monitoring and skill integration
 */

const { exec } = require('child_process');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);
const logger = require('./utils/logger');
const { sendTelegramNotification, sendSuccessNotification } = require('./utils/notifier');
const analytics = require('./utils/db-wrapper');
const monitor = require('./workflow-monitor/monitor');

async function runCommand(command, cwd, stepName) {
    logger.debug(`Running command: ${command}`, { cwd });
    console.log(`\n▶️  Running: ${command}`);
    
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
    const topic = args[0];
    const brandIndex = args.indexOf('--brand');
    const brand = brandIndex > -1 ? args[brandIndex + 1] : 'longbest';
    
    if (!topic || topic === '--brand') {
        console.error('❌ Usage: node daily-agent.js "Topic Name" [--brand brandname]');
        console.error('Available brands: longbest, thachvuland');
        process.exit(1);
    }

    console.log(`\n🚀 Starting Daily Content Pipeline`);
    console.log(`📝 Topic: ${topic}`);
    console.log(`🏷️  Brand: ${brand}`);
    console.log(`🔢 Run ID: ${runId}\n`);

    // Start workflow monitoring
    const workflow = monitor.startWorkflow(runId, brand, 'daily-content', {
        topic,
        startTime: new Date().toISOString()
    });

    try {
        // Track in database
        analytics.trackWorkflowRun(runId, brand, topic, 'started');

        // Step 1: Writer - Generate content
        console.log('\n📝 Step 1/4: Generating content with AI Writer...');
        monitor.updateStep(runId, 'ai-writer', 'running');
        
        const writerDir = path.join(__dirname, 'agent-writer');
        await runCommand(`node writer.js "${topic}" --brand ${brand}`, writerDir, 'writer');
        
        monitor.updateStep(runId, 'ai-writer', 'completed');
        console.log('✅ Content generation complete!');

        // Step 2: Generator - Create images
        console.log('\n🎨 Step 2/4: Creating carousel images...');
        monitor.updateStep(runId, 'image-generator', 'running');
        
        const generatorDir = path.join(__dirname, 'carousel-generator');
        // Get the latest content file
        const contentFile = `content/${brand}-${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-carouselstandard.json`;
        // Map brand names to folder names
        const brandFolder = brand === 'longbest' ? 'longbest-ai' : brand;
        const generatorCommand = brand === 'thachvuland' 
            ? `node generator-tvland.js ${contentFile}`
            : `node generator-optimized.js ${contentFile} --brand ${brandFolder}`;
        await runCommand(generatorCommand, generatorDir, 'generator');
        
        monitor.updateStep(runId, 'image-generator', 'completed');
        console.log('✅ Image generation complete!');

        // Step 3: Enhancer - Optimize images
        console.log('\n✨ Step 3/4: Enhancing images...');
        monitor.updateStep(runId, 'image-enhancer', 'running');
        
        await runCommand(`node enhancer.js`, generatorDir, 'enhancer');
        
        monitor.updateStep(runId, 'image-enhancer', 'completed');
        console.log('✅ Image enhancement complete!');

        // Step 4: Uploader - Upload to Drive & Sheets
        console.log('\n☁️  Step 4/4: Uploading to Google Drive...');
        monitor.updateStep(runId, 'drive-uploader', 'running');
        
        const uploaderDir = path.join(__dirname, 'drive-uploader');
        const uploadCommand = brand === 'thachvuland'
            ? `node upload-thachvuland.js`
            : `node upload.js`;
        await runCommand(uploadCommand, uploaderDir, 'uploader');
        
        monitor.updateStep(runId, 'drive-uploader', 'completed');
        console.log('✅ Upload complete!');

        // Success tracking
        const duration = (Date.now() - startTime) / 1000;
        analytics.trackWorkflowRun(runId, brand, topic, 'completed', null, {
            duration,
            steps: 4
        });

        monitor.completeWorkflow(runId, true);

        // Send success notification
        await sendSuccessNotification(
            `✅ Content Pipeline Success!\n` +
            `📝 Topic: ${topic}\n` +
            `🏷️ Brand: ${brand}\n` +
            `⏱️ Duration: ${duration.toFixed(1)}s\n` +
            `🆔 Run ID: ${runId}`
        );

        console.log(`\n✅ Pipeline completed successfully in ${duration.toFixed(1)} seconds!`);
        console.log(`📊 View results in Google Sheets for ${brand}`);

    } catch (error) {
        // Error handling with monitoring
        const duration = (Date.now() - startTime) / 1000;
        
        monitor.completeWorkflow(runId, false, error.message);
        
        analytics.trackWorkflowRun(runId, brand, topic, 'failed', error.message, {
            duration,
            errorStep: 'unknown' // Monitor client doesn't expose activeWorkflows
        });

        await sendTelegramNotification(
            `❌ Content Pipeline Failed!\n` +
            `📝 Topic: ${topic}\n` +
            `🏷️ Brand: ${brand}\n` +
            `❌ Error: ${error.message}\n` +
            `⏱️ Duration: ${duration.toFixed(1)}s\n` +
            `🆔 Run ID: ${runId}`
        );

        console.error('\n❌ Pipeline failed!');
        console.error(error);
        process.exit(1);
    }
}

// Run main function
if (require.main === module) {
    main();
}

module.exports = { main };
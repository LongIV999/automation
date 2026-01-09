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

async function runCommand(command, cwd) {
    console.log(`\n▶️  Running: ${command}`);
    try {
        const { stdout, stderr } = await execPromise(command, { cwd });
        // Log output but trim huge whitespace
        console.log(stdout.trim());
        if (stderr && stderr.length < 2000) {
            // Only log stderr if it's not just progress bars or warnings
            console.error(stderr.trim());
        }
        return stdout;
    } catch (error) {
        console.error(`❌ Command failed: ${command}`);
        console.error(error.stdout);
        console.error(error.stderr);
        throw error;
    }
}

async function main() {
    // Parse args
    const args = process.argv.slice(2);
    const brandArgIndex = args.indexOf('--brand');
    let brand = 'longbest'; // default
    let topic = '';

    if (brandArgIndex !== -1) {
        brand = args[brandArgIndex + 1];
        // Remove brand flag and value to get topic
        const newArgs = [...args];
        newArgs.splice(brandArgIndex, 2);
        topic = newArgs.join(' ').replace(/^"|"$/g, '');
    } else {
        topic = args.join(' ').replace(/^"|"$/g, '');
    }

    if (!topic) {
        console.error("❌ Please provide a topic.");
        console.log("Usage: node daily-agent.js \"Your Topic Here\" [--brand name]");
        console.log("Supported brands: longbest, thachvuland");
        process.exit(1);
    }

    const rootDir = __dirname;

    try {
        // ---------------------------------------------------------
        // 1. Agent Writer
        // ---------------------------------------------------------
        console.log("\n🤖 === STEP 1: CONTENT WRITING (AGENT) ===");
        const writerOutput = await runCommand(`node writer.js "${topic}" --brand ${brand}`, path.join(rootDir, 'agent-writer'));

        // Parse output path
        const match = writerOutput.match(/JSON_OUTPUT_FILE: (.*)/);
        if (!match) throw new Error("Could not find output file from writer");
        const jsonPath = match[1].trim();
        const baseName = path.basename(jsonPath, '.json');

        console.log(`✓ Content ready: ${jsonPath}`);

        // ---------------------------------------------------------
        // 2. Image Generator
        // ---------------------------------------------------------
        console.log("\n🎨 === STEP 2: IMAGE GENERATION ===");
        // Output dir
        const outputDir = path.join(rootDir, 'carousel-generator/output', baseName);

        // Run generator
        let generatorScript = 'generator.js';
        if (brand === 'thachvuland') {
            generatorScript = 'generator-tvland.js';
        }

        // Note: generator.js takes content file and output dir
        // We run from carousel-generator dir to handle relative assets/templates correctly
        await runCommand(`node ${generatorScript} "${jsonPath}" "${outputDir}"`, path.join(rootDir, 'carousel-generator'));

        console.log(`✓ Images generated: ${outputDir}`);

        // ---------------------------------------------------------
        // 2.5 Image Enhancer (New)
        // ---------------------------------------------------------
        console.log("\n🪄  === STEP 2.5: IMAGE ENHANCEMENT ===");
        await runCommand(`node enhancer.js "${outputDir}"`, path.join(rootDir, 'carousel-generator'));

        console.log(`✓ Images enhanced and sharpened`);

        // ---------------------------------------------------------
        // 3. Drive Uploader
        // ---------------------------------------------------------
        console.log("\n☁️  === STEP 3: UPLOAD & SYNC ===");
        // Run upload.js
        // We run from drive-uploader dir to handle credentials/tokens correctly
        await runCommand(`node upload.js "${outputDir}" --brand ${brand}`, path.join(rootDir, 'drive-uploader'));

        // ---------------------------------------------------------
        // Finish
        // ---------------------------------------------------------
        console.log("\n✨✨✨ AGENT WORKFLOW COMPLETE! ✨✨✨");
        console.log(`Topic: ${topic}`);
        console.log("Status: Ready for n8n to pick up from Google Sheets.");

    } catch (error) {
        console.error("\n❌ AGENT PROCESS FAILED");
        // Error already logged in runCommand
        process.exit(1);
    }
}

main();

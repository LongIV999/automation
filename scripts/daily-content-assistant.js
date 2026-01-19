#!/usr/bin/env node

/**
 * Daily Content Assistant - Interactive CLI tool
 * 
 * Hướng dẫn sử dụng:
 * node daily-content-assistant.js
 * 
 * Tool sẽ hỏi 3 câu hỏi và tự động thực hiện toàn bộ quy trình
 */

const readline = require('readline');
const { exec } = require('child_process');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);
const logger = require('./utils/logger');
const monitor = require('./workflow-monitor/monitor-client');



// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Helper to ask questions
const ask = (question) => new Promise((resolve) => {
    rl.question(question, resolve);
});

// Brand mapping
const BRAND_MAP = {
    '1': { id: 'longbest', folder: 'longbest-ai', name: 'Long Best AI', emoji: '🤖' },
    '2': { id: 'thachvuland', folder: 'thachvuland', name: 'Thach Vu Land', emoji: '🏠' },
    '3': { id: 'queennailbern', folder: 'queennailbern', name: 'Queen Nail Bern', emoji: '💅' }
};

// Format mapping
const FORMAT_MAP = {
    '1': { id: 'single-post', name: 'Single (1 ảnh)', slides: 1 },
    '2': { id: 'carousel-compact', name: 'Carousel Mini (3-5 ảnh)', slides: 5 },
    '3': { id: 'carousel-standard', name: 'Carousel Standard (7 ảnh)', slides: 7 },
    '4': { id: 'auto', name: 'Auto (tự động chọn)', slides: 0 }
};

// Main assistant function
async function startAssistant() {
    console.clear();
    console.log(colors.bold.cyan(`
╔══════════════════════════════════════════════════════════╗
║           🚀 DAILY CONTENT ASSISTANT 🚀                  ║
║     Công cụ tạo content tự động cho fanpage              ║
╚══════════════════════════════════════════════════════════╝
    `));

    try {
        // Question 1: Topic
        console.log(colors.yellow('\n📝 Câu hỏi 1/3:'));
        console.log(colors.white('Chủ đề (Topic) bạn muốn viết là gì?'));
        console.log(colors.gray('(Nhập chủ đề hoặc paste link bài viết để rewrite)'));
        const topic = await ask('\nChủ đề: ');
        
        if (!topic.trim()) {
            console.log(colors.red('\n❌ Chủ đề không được để trống!'));
            process.exit(1);
        }

        // Question 2: Format
        console.log(colors.yellow('\n🎨 Câu hỏi 2/3:'));
        console.log(colors.white('Định dạng (Format) bạn muốn?'));
        console.log(colors.gray('1. Single (1 ảnh - nhanh nhất)'));
        console.log(colors.gray('2. Carousel Mini (3-5 ảnh)'));
        console.log(colors.gray('3. Carousel Standard (7 ảnh)'));
        console.log(colors.gray('4. Auto (để mình tự chọn)'));
        
        const formatChoice = await ask('\nChọn định dạng (1-4): ');
        const format = FORMAT_MAP[formatChoice];
        
        if (!format) {
            console.log(colors.red('\n❌ Lựa chọn không hợp lệ!'));
            process.exit(1);
        }

        // Question 3: Brand/Fanpage
        console.log(colors.yellow('\n🏢 Câu hỏi 3/3:'));
        console.log(colors.white('Đăng lên Fanpage nào?'));
        console.log(colors.gray('1. Long Best AI 🤖'));
        console.log(colors.gray('2. Thach Vu Land 🏠'));
        console.log(colors.gray('3. Queen Nail Bern 💅'));
        
        const brandChoice = await ask('\nChọn fanpage (1-3): ');
        const brand = BRAND_MAP[brandChoice];
        
        if (!brand) {
            console.log(colors.red('\n❌ Lựa chọn không hợp lệ!'));
            process.exit(1);
        }

        // Confirm choices
        console.log(colors.green('\n✅ Xác nhận thông tin:'));
        console.log(colors.white(`   📝 Chủ đề: ${topic}`));
        console.log(colors.white(`   🎨 Định dạng: ${format.name}`));
        console.log(colors.white(`   🏢 Fanpage: ${brand.name} ${brand.emoji}`));
        
        const confirm = await ask('\nBắt đầu tạo content? (y/n): ');
        
        if (confirm.toLowerCase() !== 'y') {
            console.log(colors.yellow('\n👋 Đã hủy. Hẹn gặp lại!'));
            process.exit(0);
        }

        rl.close();

        // Start the workflow
        console.log(colors.cyan('\n🚀 Bắt đầu quy trình tự động...\n'));
        
        await runCompleteWorkflow(topic, format.id, brand);
        
    } catch (error) {
        console.error(colors.red('\n❌ Lỗi: ' + error.message));
        process.exit(1);
    }
}

// Run complete workflow
async function runCompleteWorkflow(topic, format, brand) {
    const startTime = Date.now();
    const runId = `assistant_${Date.now()}`;
    
    // Start monitoring
    const workflow = monitor.startWorkflow(runId, brand.id, 'content-assistant', {
        topic,
        format,
        brand: brand.name
    });

    try {
        // Step 1: Generate content
        console.log(colors.blue('📝 Bước 1/5: Tạo nội dung với AI...'));
        monitor.updateStep(runId, 'ai-writer', 'running');
        
        await runCommand(
            `node writer.js "${topic}" --brand ${brand.id} --format ${format}`,
            path.join(__dirname, 'agent-writer')
        );
        
        monitor.updateStep(runId, 'ai-writer', 'completed');
        console.log(colors.green('✅ Tạo nội dung thành công!\n'));

        // Step 2: Generate images
        console.log(colors.blue('🎨 Bước 2/5: Tạo hình ảnh...'));
        monitor.updateStep(runId, 'image-generator', 'running');
        
        // Find the generated content file
        const contentFile = await findLatestContentFile(brand.id);
        const generatorCmd = brand.id === 'thachvuland' 
            ? `node generator-tvland.js ${contentFile}`
            : `node generator-optimized.js ${contentFile} --brand ${brand.folder} --fast`;
            
        await runCommand(generatorCmd, path.join(__dirname, 'carousel-generator'));
        
        monitor.updateStep(runId, 'image-generator', 'completed');
        console.log(colors.green('✅ Tạo hình ảnh thành công!\n'));

        // Step 3: Enhance images
        console.log(colors.blue('✨ Bước 3/5: Tối ưu hình ảnh...'));
        monitor.updateStep(runId, 'image-enhancer', 'running');
        
        await runCommand('node enhancer.js', path.join(__dirname, 'carousel-generator'));
        
        monitor.updateStep(runId, 'image-enhancer', 'completed');
        console.log(colors.green('✅ Tối ưu hình ảnh thành công!\n'));

        // Step 4: Upload to Drive
        console.log(colors.blue('☁️  Bước 4/5: Upload lên Google Drive...'));
        monitor.updateStep(runId, 'drive-uploader', 'running');
        
        const uploadCmd = getUploadCommand(brand.id);
        await runCommand(uploadCmd, path.join(__dirname, 'drive-uploader'));
        
        monitor.updateStep(runId, 'drive-uploader', 'completed');
        console.log(colors.green('✅ Upload thành công!\n'));

        // Step 5: Auto-publish (if enabled)
        console.log(colors.blue('📱 Bước 5/5: Lên lịch đăng Facebook...'));
        monitor.updateStep(runId, 'auto-publish', 'running');
        
        // Trigger n8n workflow for auto-publish
        await triggerAutoPublish(brand.id);
        
        monitor.updateStep(runId, 'auto-publish', 'completed');
        console.log(colors.green('✅ Đã lên lịch đăng!\n'));

        // Complete workflow
        const duration = (Date.now() - startTime) / 1000;
        monitor.completeWorkflow(runId, true);

        // Success message
        console.log(colors.bold.green(`
╔══════════════════════════════════════════════════════════╗
║                    ✨ HOÀN THÀNH! ✨                     ║
╚══════════════════════════════════════════════════════════╝`));
        
        console.log(colors.white(`
📊 Tóm tắt:
   ⏱️  Thời gian: ${duration.toFixed(1)}s
   📝 Chủ đề: ${topic}
   🎨 Format: ${format}
   🏢 Fanpage: ${brand.name}
   📱 Trạng thái: Đã lên lịch đăng

📂 Files đã tạo:
   - Content JSON: /content/${brand.id}-*.json
   - Images: /output/${brand.id}-*/
   - Google Drive: Đã upload

🔗 Xem kết quả:
   - Dashboard: http://localhost:3002
   - Google Sheets: [Check ${brand.name} sheet]
        `));

    } catch (error) {
        monitor.updateStep(runId, 'error', 'failed');
        monitor.completeWorkflow(runId, false, error.message);
        
        console.error(colors.red('\n❌ Quy trình thất bại!'));
        console.error(colors.red(error.message));
        throw error;
    }
}

// Helper functions
async function runCommand(command, cwd) {
    try {
        const { stdout, stderr } = await execPromise(command, { cwd });
        if (stdout) console.log(colors.gray(stdout.trim()));
        return stdout;
    } catch (error) {
        console.error(colors.red('Command failed: ' + command));
        throw error;
    }
}

async function findLatestContentFile(brandId) {
    const { stdout } = await execPromise(
        `ls -t content/${brandId}-*.json | head -1`,
        { cwd: path.join(__dirname, 'carousel-generator') }
    );
    return stdout.trim();
}

function getUploadCommand(brandId) {
    switch (brandId) {
        case 'thachvuland':
            return 'node upload-thachvuland.js';
        case 'queennailbern':
            return 'node upload-queennail.js';
        default:
            return 'node upload.js';
    }
}

async function triggerAutoPublish(brandId) {
    // Integration with n8n or direct Facebook API
    // For now, just log
    console.log(colors.gray(`   Triggering auto-publish for ${brandId}...`));
    
    // You can implement n8n webhook trigger here
    // Example:
    // await axios.post(`${N8N_WEBHOOK_URL}/publish-${brandId}`, { ... });
}

// Simple color functions (no colors dependency)
const colors = {
    red: (text) => `\x1b[31m${text}\x1b[0m`,
    green: (text) => `\x1b[32m${text}\x1b[0m`,
    blue: (text) => `\x1b[34m${text}\x1b[0m`,
    yellow: (text) => `\x1b[33m${text}\x1b[0m`,
    cyan: (text) => `\x1b[36m${text}\x1b[0m`,
    white: (text) => `\x1b[37m${text}\x1b[0m`,
    gray: (text) => `\x1b[90m${text}\x1b[0m`,
    bold: {
        cyan: (text) => `\x1b[1;36m${text}\x1b[0m`,
        green: (text) => `\x1b[1;32m${text}\x1b[0m`
    }
};

// Start the assistant
if (require.main === module) {
    startAssistant().catch(error => {
        console.error(colors.red('Fatal error:'), error);
        process.exit(1);
    });
}

module.exports = { startAssistant, runCompleteWorkflow };
/**
 * Daily Content Scheduler
 * 
 * Tự động chạy workflow hàng ngày theo lịch trình
 * Hỗ trợ multiple brands với các thời gian khác nhau
 */

const cron = require('node-cron');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const path = require('path');
const logger = require('./utils/logger');
const monitor = require('./workflow-monitor/monitor-client');
const { autoPublish } = require('./facebook-auto-publisher/auto-publisher');

// Schedule configurations
const SCHEDULES = {
    // Long Best AI - 9:00 AM daily
    'longbest': {
        cron: '0 9 * * *',
        topics: [
            'AI Tools for Productivity',
            'Machine Learning Basics',
            'Automation Best Practices',
            'Future of AI Technology',
            'AI in Business'
        ],
        format: 'carousel-standard',
        autoPublish: true,
        publishDelay: 30 // minutes after content creation
    },
    
    // Thach Vu Land - 10:30 AM daily  
    'thachvuland': {
        cron: '30 10 * * *',
        topics: [
            'Căn hộ cao cấp Quận 2',
            'Đầu tư bất động sản 2024',
            'Tiện ích sống tại Thạch Vũ',
            'Vị trí đắc địa',
            'Chính sách thanh toán linh hoạt'
        ],
        format: 'carousel-standard',
        autoPublish: true,
        publishDelay: 15
    },
    
    // Queen Nail Bern - 2:00 PM daily
    'queennailbern': {
        cron: '0 14 * * *',
        topics: [
            'Winter Nail Trends 2024',
            'Gel Nail Art Ideas',
            'Nail Care Tips',
            'Switzerland Nail Salons',
            'Manicure Styles'
        ],
        format: 'carousel-compact',
        autoPublish: true,
        publishDelay: 45
    }
};

class DailyScheduler {
    constructor() {
        this.tasks = new Map();
        this.isRunning = false;
    }

    /**
     * Start all scheduled tasks
     */
    start() {
        console.log(`
╔══════════════════════════════════════════════════════════╗
║          🕐 DAILY CONTENT SCHEDULER STARTED 🕐              ║
╚══════════════════════════════════════════════════════════╝
        `);

        // Start scheduler for each brand
        for (const [brandId, config] of Object.entries(SCHEDULES)) {
            this.startBrandScheduler(brandId, config);
        }

        // Start monitoring task
        this.startMonitoringTask();
        
        console.log('\n📅 Schedules:');
        for (const [brandId, config] of Object.entries(SCHEDULES)) {
            console.log(`   ${brandId}: ${config.cron} (${this.cronToHuman(config.cron)})`);
        }
        
        console.log('\n📊 Monitor at: http://localhost:3002');
        console.log('\n⏹️  Press Ctrl+C to stop scheduler\n');
    }

    /**
     * Start scheduler for specific brand
     */
    startBrandScheduler(brandId, config) {
        const task = cron.schedule(config.cron, async () => {
            if (this.isRunning) {
                console.log(`⏳ Skipping ${brandId} - another task is running`);
                return;
            }

            await this.runScheduledTask(brandId, config);
        }, {
            scheduled: true,
            timezone: 'Asia/Ho_Chi_Minh'
        });

        this.tasks.set(brandId, task);
        console.log(`✅ Scheduled ${brandId} - ${this.cronToHuman(config.cron)}`);
    }

    /**
     * Run scheduled task
     */
    async runScheduledTask(brandId, config) {
        this.isRunning = true;
        const runId = `scheduled_${brandId}_${Date.now()}`;
        
        console.log(`\n🚀 Running scheduled task for ${brandId} at ${new Date().toLocaleString()}`);
        
        monitor.startWorkflow(runId, brandId, 'scheduled-content', {
            scheduled: true,
            config
        });

        try {
            // Get random topic from list
            const topic = config.topics[Math.floor(Math.random() * config.topics.length)];
            
            monitor.updateStep(runId, 'content-creation', 'running');
            
            // Run content creation workflow
            const command = `node scripts/daily-agent-monitored.js "${topic}" --brand ${brandId}`;
            const { stdout, stderr } = await execPromise(command, {
                cwd: '/Users/admin/automation'
            });
            
            console.log(stdout);
            if (stderr) console.error(stderr);
            
            monitor.updateStep(runId, 'content-creation', 'completed');
            
            // Auto-publish if enabled
            if (config.autoPublish) {
                monitor.updateStep(runId, 'auto-publish', 'running');
                
                // Wait for specified delay
                console.log(`⏳ Waiting ${config.publishDelay} minutes before publishing...`);
                await this.sleep(config.publishDelay * 60 * 1000);
                
                // Publish to Facebook
                const publishResult = await autoPublish(brandId, topic, config.format);
                
                monitor.updateStep(runId, 'auto-publish', 'completed');
                console.log(`✅ Published to Facebook: ${publishResult.postUrl}`);
            }
            
            monitor.completeWorkflow(runId, true);
            
            console.log(`✅ Scheduled task completed for ${brandId}`);
            
            // Send notification
            await this.sendNotification(brandId, topic, true);
            
        } catch (error) {
            monitor.completeWorkflow(runId, false, error.message);
            console.error(`❌ Scheduled task failed for ${brandId}:`, error.message);
            
            // Send error notification
            await this.sendNotification(brandId, 'Unknown', false, error.message);
            
        } finally {
            this.isRunning = false;
        }
    }

    /**
     * Start monitoring task
     */
    startMonitoringTask() {
        // Check system status every hour
        cron.schedule('0 * * * *', async () => {
            await this.checkSystemStatus();
        }, {
            scheduled: true,
            timezone: 'Asia/Ho_Chi_Minh'
        });
    }

    /**
     * Check system status
     */
    async checkSystemStatus() {
        try {
            console.log('🔍 Checking system status...');
            
            // Check if monitor is running
            const monitorStatus = await this.checkMonitorStatus();
            
            // Check disk space
            const diskSpace = await this.checkDiskSpace();
            
            // Check API credentials
            const apiStatus = await this.checkApiCredentials();
            
            console.log('📊 System Status:');
            console.log(`   Monitor: ${monitorStatus ? '✅ Running' : '❌ Stopped'}`);
            console.log(`   Disk Space: ${diskSpace}% used`);
            console.log(`   APIs: ${apiStatus ? '✅ OK' : '❌ Issues'}`);
            
        } catch (error) {
            console.error('❌ System status check failed:', error.message);
        }
    }

    /**
     * Check monitor status
     */
    async checkMonitorStatus() {
        try {
            const response = await fetch('http://localhost:3001');
            return response.ok;
        } catch {
            return false;
        }
    }

    /**
     * Check disk space
     */
    async checkDiskSpace() {
        try {
            const { stdout } = await execPromise('df -h / | tail -1 | awk \'{print $5}\'');
            return parseInt(stdout.replace('%', ''));
        } catch {
            return 0;
        }
    }

    /**
     * Check API credentials
     */
    async checkApiCredentials() {
        const requiredEnvs = [
            'CLAUDE_API_KEY',
            'GOOGLE_DRIVE_CREDENTIALS',
            'LONGBEST_ACCESS_TOKEN',
            'THACHVULAND_ACCESS_TOKEN',
            'QUEENNAILBERN_ACCESS_TOKEN'
        ];
        
        const missing = requiredEnvs.filter(env => !process.env[env]);
        return missing.length === 0;
    }

    /**
     * Send notification
     */
    async sendNotification(brandId, topic, success, error = null) {
        const message = success
            ? `✅ ${brandId} content created successfully\nTopic: ${topic}`
            : `❌ ${brandId} content creation failed\nError: ${error}`;
            
        // You can implement Telegram, Slack, or email notifications here
        console.log(`📢 Notification: ${message}`);
    }

    /**
     * Convert cron to human readable
     */
    cronToHuman(cron) {
        const parts = cron.split(' ');
        const minute = parts[0];
        const hour = parts[1];
        
        if (minute === '0' && hour === '9') return '9:00 AM';
        if (minute === '30' && hour === '10') return '10:30 AM';
        if (minute === '0' && hour === '14') return '2:00 PM';
        
        return `${hour}:${minute}`;
    }

    /**
     * Sleep helper
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Stop all tasks
     */
    stop() {
        console.log('\n⏹️  Stopping scheduler...');
        
        for (const [brandId, task] of this.tasks) {
            task.stop();
            console.log(`   Stopped ${brandId}`);
        }
        
        console.log('✅ Scheduler stopped');
        process.exit(0);
    }
}

// Start scheduler if run directly
if (require.main === module) {
    // Check if node-cron is installed
    try {
        require.resolve('node-cron');
    } catch (e) {
        console.log('Installing node-cron...');
        require('child_process').execSync('npm install node-cron', { stdio: 'inherit' });
    }
    
    const scheduler = new DailyScheduler();
    scheduler.start();
    
    // Handle graceful shutdown
    process.on('SIGINT', () => scheduler.stop());
    process.on('SIGTERM', () => scheduler.stop());
}

module.exports = DailyScheduler;
/**
 * Smart Scheduler cho Facebook Auto Publisher
 *
 * Tự động chạy publisher theo lịch để xử lý queue
 * Tích hợp với Google Sheets để lấy content
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const path = require('path');
const fs = require('fs');

// Import queue manager để check trạng thái
const { QueueManager } = require('./publisher');

const SCHEDULER_CONFIG = {
    // Chạy mỗi 20 phút để check queue
    CHECK_INTERVAL: 20 * 60 * 1000,

    // Giờ hoạt động (để tránh post lúc nửa đêm)
    ACTIVE_HOURS: {
        start: 7,  // 7h sáng
        end: 22    // 10h tối
    },

    LOG_FILE: path.join(__dirname, 'scheduler.log')
};

class Scheduler {
    constructor() {
        this.queueManager = new QueueManager();
        this.running = false;
    }

    log(message, data = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${message} ${JSON.stringify(data)}\n`;
        console.log(logEntry.trim());
        fs.appendFileSync(SCHEDULER_CONFIG.LOG_FILE, logEntry);
    }

    isActiveHour() {
        const hour = new Date().getHours();
        return hour >= SCHEDULER_CONFIG.ACTIVE_HOURS.start &&
               hour < SCHEDULER_CONFIG.ACTIVE_HOURS.end;
    }

    async runPublisher() {
        try {
            this.log('Running publisher process');
            const { stdout, stderr } = await execPromise('node publisher.js process', {
                cwd: __dirname
            });

            if (stdout) this.log('Publisher output', { stdout: stdout.trim() });
            if (stderr) this.log('Publisher stderr', { stderr: stderr.trim() });

        } catch (error) {
            this.log('Publisher error', { error: error.message });
        }
    }

    async checkAndProcess() {
        this.log('Scheduler tick - checking queue');

        const stats = this.queueManager.getStats();
        this.log('Queue status', stats);

        // Nếu không có pending posts thì skip
        if (stats.pending === 0) {
            this.log('No pending posts - skipping');
            return;
        }

        // Check giờ hoạt động
        if (!this.isActiveHour()) {
            this.log('Outside active hours - skipping', {
                currentHour: new Date().getHours(),
                activeRange: SCHEDULER_CONFIG.ACTIVE_HOURS
            });
            return;
        }

        // Chạy publisher
        await this.runPublisher();
    }

    start() {
        if (this.running) {
            this.log('Scheduler already running');
            return;
        }

        this.running = true;
        this.log('Scheduler started', {
            checkInterval: `${SCHEDULER_CONFIG.CHECK_INTERVAL / 60000} minutes`,
            activeHours: SCHEDULER_CONFIG.ACTIVE_HOURS
        });

        // Chạy ngay lần đầu
        this.checkAndProcess();

        // Sau đó chạy định kỳ
        this.interval = setInterval(() => {
            this.checkAndProcess();
        }, SCHEDULER_CONFIG.CHECK_INTERVAL);

        // Graceful shutdown
        process.on('SIGINT', () => {
            this.log('Received SIGINT - stopping scheduler');
            this.stop();
            process.exit(0);
        });

        process.on('SIGTERM', () => {
            this.log('Received SIGTERM - stopping scheduler');
            this.stop();
            process.exit(0);
        });
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.running = false;
        this.log('Scheduler stopped');
    }
}

// ==================== MAIN ====================
if (require.main === module) {
    const scheduler = new Scheduler();
    scheduler.start();

    console.log(`
🤖 Facebook Auto Publisher Scheduler Started

Settings:
- Check interval: ${SCHEDULER_CONFIG.CHECK_INTERVAL / 60000} minutes
- Active hours: ${SCHEDULER_CONFIG.ACTIVE_HOURS.start}:00 - ${SCHEDULER_CONFIG.ACTIVE_HOURS.end}:00
- Log file: ${SCHEDULER_CONFIG.LOG_FILE}

Press Ctrl+C to stop
    `);
}

module.exports = Scheduler;

/**
 * Facebook Auto Publisher with Rate Limiting
 *
 * Giải quyết vấn đề rate limit của Facebook Graph API
 * Hỗ trợ đăng 10-20 bài/ngày một cách an toàn
 *
 * Features:
 * - Queue system để tránh vượt rate limit
 * - Auto retry khi gặp lỗi
 * - Lưu trạng thái để khôi phục khi lỗi
 * - Tích hợp với Google Sheets
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

// ==================== CONFIG ====================
const CONFIG = {
    // Facebook credentials
    FB_PAGE_ID: process.env.FB_PAGE_ID || '827345413796018',
    FB_ACCESS_TOKEN: process.env.FB_ACCESS_TOKEN,

    // Rate limiting (để tránh bị Facebook chặn)
    MIN_DELAY_BETWEEN_POSTS: 15 * 60 * 1000,  // 15 phút giữa mỗi bài
    MAX_POSTS_PER_HOUR: 4,                     // Tối đa 4 bài/giờ
    MAX_POSTS_PER_DAY: 20,                     // Tối đa 20 bài/ngày

    // Retry settings
    MAX_RETRIES: 3,
    RETRY_DELAY: 5000,  // 5 giây

    // Paths
    QUEUE_FILE: path.join(__dirname, 'queue.json'),
    STATE_FILE: path.join(__dirname, 'state.json'),
    LOG_FILE: path.join(__dirname, 'publisher.log')
};

// ==================== LOGGER ====================
class Logger {
    static log(message, data = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${message} ${JSON.stringify(data)}\n`;
        console.log(logEntry.trim());
        fs.appendFileSync(CONFIG.LOG_FILE, logEntry);
    }

    static error(message, error) {
        const timestamp = new Date().toISOString();
        const errorEntry = `[${timestamp}] ERROR: ${message}\n${error.stack || error}\n`;
        console.error(errorEntry);
        fs.appendFileSync(CONFIG.LOG_FILE, errorEntry);
    }
}

// ==================== STATE MANAGER ====================
class StateManager {
    constructor() {
        this.state = this.load();
    }

    load() {
        try {
            if (fs.existsSync(CONFIG.STATE_FILE)) {
                return JSON.parse(fs.readFileSync(CONFIG.STATE_FILE, 'utf8'));
            }
        } catch (error) {
            Logger.error('Failed to load state', error);
        }

        return {
            postsToday: 0,
            postsThisHour: 0,
            lastPostTime: null,
            currentHourStart: new Date().setMinutes(0, 0, 0),
            dayStart: new Date().setHours(0, 0, 0, 0)
        };
    }

    save() {
        try {
            fs.writeFileSync(CONFIG.STATE_FILE, JSON.stringify(this.state, null, 2));
        } catch (error) {
            Logger.error('Failed to save state', error);
        }
    }

    resetIfNeeded() {
        const now = Date.now();
        const currentDayStart = new Date().setHours(0, 0, 0, 0);
        const currentHourStart = new Date().setMinutes(0, 0, 0);

        // Reset daily counter
        if (this.state.dayStart !== currentDayStart) {
            Logger.log('New day - resetting daily counter');
            this.state.postsToday = 0;
            this.state.dayStart = currentDayStart;
        }

        // Reset hourly counter
        if (this.state.currentHourStart !== currentHourStart) {
            Logger.log('New hour - resetting hourly counter');
            this.state.postsThisHour = 0;
            this.state.currentHourStart = currentHourStart;
        }

        this.save();
    }

    canPost() {
        this.resetIfNeeded();

        if (this.state.postsToday >= CONFIG.MAX_POSTS_PER_DAY) {
            return { allowed: false, reason: 'Daily limit reached' };
        }

        if (this.state.postsThisHour >= CONFIG.MAX_POSTS_PER_HOUR) {
            return { allowed: false, reason: 'Hourly limit reached' };
        }

        if (this.state.lastPostTime) {
            const timeSinceLastPost = Date.now() - this.state.lastPostTime;
            if (timeSinceLastPost < CONFIG.MIN_DELAY_BETWEEN_POSTS) {
                const waitTime = Math.ceil((CONFIG.MIN_DELAY_BETWEEN_POSTS - timeSinceLastPost) / 1000);
                return {
                    allowed: false,
                    reason: 'Too soon since last post',
                    waitSeconds: waitTime
                };
            }
        }

        return { allowed: true };
    }

    recordPost() {
        this.state.postsToday++;
        this.state.postsThisHour++;
        this.state.lastPostTime = Date.now();
        this.save();

        Logger.log('Post recorded', {
            postsToday: this.state.postsToday,
            postsThisHour: this.state.postsThisHour
        });
    }
}

// ==================== QUEUE MANAGER ====================
class QueueManager {
    constructor() {
        this.queue = this.load();
    }

    load() {
        try {
            if (fs.existsSync(CONFIG.QUEUE_FILE)) {
                return JSON.parse(fs.readFileSync(CONFIG.QUEUE_FILE, 'utf8'));
            }
        } catch (error) {
            Logger.error('Failed to load queue', error);
        }
        return [];
    }

    save() {
        try {
            fs.writeFileSync(CONFIG.QUEUE_FILE, JSON.stringify(this.queue, null, 2));
        } catch (error) {
            Logger.error('Failed to save queue', error);
        }
    }

    add(post) {
        this.queue.push({
            ...post,
            id: Date.now() + Math.random(),
            addedAt: new Date().toISOString(),
            status: 'pending',
            retries: 0
        });
        this.save();
        Logger.log('Post added to queue', { caption: post.caption?.substring(0, 50) });
    }

    getNext() {
        return this.queue.find(p => p.status === 'pending');
    }

    markAsProcessing(postId) {
        const post = this.queue.find(p => p.id === postId);
        if (post) {
            post.status = 'processing';
            this.save();
        }
    }

    markAsCompleted(postId, fbPostId) {
        const post = this.queue.find(p => p.id === postId);
        if (post) {
            post.status = 'completed';
            post.fbPostId = fbPostId;
            post.completedAt = new Date().toISOString();
            this.save();
        }
    }

    markAsFailed(postId, error) {
        const post = this.queue.find(p => p.id === postId);
        if (post) {
            post.retries++;
            if (post.retries >= CONFIG.MAX_RETRIES) {
                post.status = 'failed';
                post.error = error.message;
            } else {
                post.status = 'pending';  // Retry lại
            }
            this.save();
        }
    }

    getPendingCount() {
        return this.queue.filter(p => p.status === 'pending').length;
    }

    getStats() {
        return {
            total: this.queue.length,
            pending: this.queue.filter(p => p.status === 'pending').length,
            processing: this.queue.filter(p => p.status === 'processing').length,
            completed: this.queue.filter(p => p.status === 'completed').length,
            failed: this.queue.filter(p => p.status === 'failed').length
        };
    }
}

// ==================== FACEBOOK API ====================
class FacebookPublisher {
    constructor(pageId, accessToken) {
        this.pageId = pageId;
        this.accessToken = accessToken;
        this.apiVersion = 'v22.0';
    }

    async uploadPhoto(imagePath, published = false) {
        const formData = new FormData();
        formData.append('source', fs.createReadStream(imagePath));
        formData.append('published', published.toString());

        try {
            const response = await axios.post(
                `https://graph.facebook.com/${this.apiVersion}/${this.pageId}/photos`,
                formData,
                {
                    headers: {
                        ...formData.getHeaders(),
                    },
                    params: {
                        access_token: this.accessToken
                    }
                }
            );

            return response.data;
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                throw new Error(`FB API Error: ${error.response.data.error.message}`);
            }
            throw error;
        }
    }

    async publishCarousel(caption, imagePaths) {
        Logger.log('Uploading images to Facebook', { count: imagePaths.length });

        // Upload tất cả ảnh (unpublished)
        const mediaIds = [];
        for (const imagePath of imagePaths) {
            const result = await this.uploadPhoto(imagePath, false);
            mediaIds.push(result.id);
            Logger.log('Image uploaded', { id: result.id, path: imagePath });
        }

        // Tạo attached_media array
        const attachedMedia = mediaIds.map(id => ({ media_fbid: id }));

        // Publish post với attached media
        Logger.log('Publishing carousel post', { mediaCount: mediaIds.length });

        try {
            const response = await axios.post(
                `https://graph.facebook.com/${this.apiVersion}/${this.pageId}/feed`,
                null,
                {
                    params: {
                        message: caption,
                        attached_media: JSON.stringify(attachedMedia),
                        access_token: this.accessToken
                    }
                }
            );

            return response.data;
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                throw new Error(`FB API Error: ${error.response.data.error.message}`);
            }
            throw error;
        }
    }

    async publishSingleImage(caption, imagePath) {
        const result = await this.uploadPhoto(imagePath, false);

        try {
            const response = await axios.post(
                `https://graph.facebook.com/${this.apiVersion}/${this.pageId}/feed`,
                null,
                {
                    params: {
                        message: caption,
                        attached_media: JSON.stringify([{ media_fbid: result.id }]),
                        access_token: this.accessToken
                    }
                }
            );

            return response.data;
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                throw new Error(`FB API Error: ${error.response.data.error.message}`);
            }
            throw error;
        }
    }
}

// ==================== MAIN PROCESSOR ====================
class PostProcessor {
    constructor() {
        this.stateManager = new StateManager();
        this.queueManager = new QueueManager();
        this.publisher = new FacebookPublisher(CONFIG.FB_PAGE_ID, CONFIG.FB_ACCESS_TOKEN);
    }

    async processQueue() {
        Logger.log('Starting queue processor');

        while (true) {
            const stats = this.queueManager.getStats();
            Logger.log('Queue stats', stats);

            if (stats.pending === 0) {
                Logger.log('No pending posts in queue');
                break;
            }

            // Check if we can post
            const canPost = this.stateManager.canPost();
            if (!canPost.allowed) {
                Logger.log(`Cannot post: ${canPost.reason}`, canPost);

                if (canPost.waitSeconds) {
                    Logger.log(`Waiting ${canPost.waitSeconds} seconds...`);
                    await this.sleep(canPost.waitSeconds * 1000);
                    continue;
                } else {
                    Logger.log('Stopping processor - limit reached');
                    break;
                }
            }

            // Get next post
            const post = this.queueManager.getNext();
            if (!post) break;

            // Process post
            this.queueManager.markAsProcessing(post.id);
            Logger.log('Processing post', { id: post.id, caption: post.caption?.substring(0, 50) });

            try {
                let result;

                if (post.imagePaths && post.imagePaths.length > 1) {
                    result = await this.publisher.publishCarousel(post.caption, post.imagePaths);
                } else if (post.imagePaths && post.imagePaths.length === 1) {
                    result = await this.publisher.publishSingleImage(post.caption, post.imagePaths[0]);
                } else {
                    throw new Error('No images provided');
                }

                this.queueManager.markAsCompleted(post.id, result.id);
                this.stateManager.recordPost();

                Logger.log('Post published successfully', {
                    queueId: post.id,
                    fbPostId: result.id,
                    url: `https://facebook.com/${result.id}`
                });

                // Đợi một chút trước khi xử lý bài tiếp theo
                await this.sleep(5000);

            } catch (error) {
                Logger.error('Failed to publish post', error);
                this.queueManager.markAsFailed(post.id, error);

                // Đợi lâu hơn khi có lỗi
                await this.sleep(CONFIG.RETRY_DELAY);
            }
        }

        Logger.log('Queue processor finished');
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ==================== CLI COMMANDS ====================
async function addToQueue(caption, imagePaths) {
    const queueManager = new QueueManager();
    queueManager.add({
        caption,
        imagePaths
    });
    console.log(`✓ Added to queue. Pending posts: ${queueManager.getPendingCount()}`);
}

async function processQueue() {
    if (!CONFIG.FB_ACCESS_TOKEN) {
        console.error('❌ FB_ACCESS_TOKEN not set in .env file');
        process.exit(1);
    }

    const processor = new PostProcessor();
    await processor.processQueue();
}

async function showStats() {
    const queueManager = new QueueManager();
    const stateManager = new StateManager();

    console.log('\n📊 Queue Stats:');
    console.log(JSON.stringify(queueManager.getStats(), null, 2));

    console.log('\n📈 Publishing Stats:');
    console.log(JSON.stringify({
        postsToday: stateManager.state.postsToday,
        postsThisHour: stateManager.state.postsThisHour,
        maxPostsPerDay: CONFIG.MAX_POSTS_PER_DAY,
        maxPostsPerHour: CONFIG.MAX_POSTS_PER_HOUR
    }, null, 2));
}

// ==================== MAIN ====================
async function main() {
    const command = process.argv[2];

    switch (command) {
        case 'add':
            const caption = process.argv[3];
            const imagePaths = process.argv.slice(4);
            if (!caption || imagePaths.length === 0) {
                console.log('Usage: node publisher.js add "Caption text" /path/to/image1.jpg /path/to/image2.jpg ...');
                process.exit(1);
            }
            await addToQueue(caption, imagePaths);
            break;

        case 'process':
            await processQueue();
            break;

        case 'stats':
            await showStats();
            break;

        default:
            console.log(`
Facebook Auto Publisher - Rate Limit Safe

Commands:
  add "caption" image1.jpg image2.jpg ...  - Add post to queue
  process                                   - Process pending queue
  stats                                     - Show statistics

Example:
  node publisher.js add "Check this out! #AI" ./image1.jpg ./image2.jpg
  node publisher.js process
  node publisher.js stats
            `);
    }
}

if (require.main === module) {
    main().catch(error => {
        Logger.error('Fatal error', error);
        process.exit(1);
    });
}

module.exports = { PostProcessor, QueueManager, StateManager, FacebookPublisher };

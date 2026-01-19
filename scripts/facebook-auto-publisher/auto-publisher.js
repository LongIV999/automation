/**
 * Facebook Auto-Publisher
 * 
 * Tự động đăng content lên fanpage sau khi hoàn thành workflow
 * Hỗ trợ cả 3 brands: Long Best AI, Thach Vu Land, Queen Nail Bern
 */

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const logger = require('../utils/logger');
const monitor = require('../workflow-monitor/monitor-client');

// Brand configurations
const BRAND_CONFIGS = {
    'longbest': {
        pageId: process.env.LONGBEST_PAGE_ID || '1234567890',
        accessToken: process.env.LONGBEST_ACCESS_TOKEN,
        pageName: 'Long Best AI',
        emoji: '🤖'
    },
    'thachvuland': {
        pageId: process.env.THACHVULAND_PAGE_ID || '0987654321',
        accessToken: process.env.THACHVULAND_ACCESS_TOKEN,
        pageName: 'Thach Vu Land',
        emoji: '🏠'
    },
    'queennailbern': {
        pageId: process.env.QUEENNAILBERN_PAGE_ID || '1122334455',
        accessToken: process.env.QUEENNAILBERN_ACCESS_TOKEN,
        pageName: 'Queen Nail Bern',
        emoji: '💅'
    }
};

class FacebookAutoPublisher {
    constructor(brandId) {
        this.config = BRAND_CONFIGS[brandId];
        if (!this.config) {
            throw new Error(`Brand ${brandId} not configured`);
        }
    }

    /**
     * Đăng bài lên fanpage
     */
    async publishContent(contentData, imageUrls) {
        const runId = `fb_publish_${Date.now()}`;
        
        monitor.startWorkflow(runId, this.config.pageName, 'facebook-publish', {
            brand: this.config.pageName,
            imageCount: imageUrls.length
        });

        try {
            monitor.updateStep(runId, 'prepare-content', 'running');
            
            // Chuẩn bị caption
            const caption = this.prepareCaption(contentData);
            
            monitor.updateStep(runId, 'prepare-content', 'completed');
            monitor.updateStep(runId, 'upload-images', 'running');

            // Upload images và tạo post
            const postResult = await this.createFacebookPost(caption, imageUrls);
            
            monitor.updateStep(runId, 'upload-images', 'completed');
            monitor.updateStep(runId, 'publish-post', 'running');

            // Đăng bài
            const publishedPost = await this.publishPost(postResult);
            
            monitor.updateStep(runId, 'publish-post', 'completed');
            monitor.completeWorkflow(runId, true);

            logger.info('Facebook post published successfully', {
                brand: this.config.pageName,
                postId: publishedPost.id,
                imageCount: imageUrls.length
            });

            return {
                success: true,
                postId: publishedPost.id,
                postUrl: `https://facebook.com/${publishedPost.id}`,
                publishedAt: new Date().toISOString()
            };

        } catch (error) {
            monitor.completeWorkflow(runId, false, error.message);
            logger.error('Facebook publish failed', error);
            throw error;
        }
    }

    /**
     * Chuẩn bị caption với brand style
     */
    prepareCaption(contentData) {
        const { title, content, cta, hashtags } = contentData;
        
        let caption = `${this.config.emoji} ${title}\n\n`;
        
        if (content) {
            caption += `${content}\n\n`;
        }
        
        if (cta) {
            caption += `${cta}\n\n`;
        }
        
        // Add brand-specific hashtags
        const brandHashtags = this.getBrandHashtags();
        const allHashtags = hashtags ? `${hashtags} ${brandHashtags}` : brandHashtags;
        
        caption += `#${allHashtags.replace(/#/g, ' #').trim()}`;
        
        return caption;
    }

    /**
     * Lấy hashtags theo brand
     */
    getBrandHashtags() {
        switch (this.config.pageName) {
            case 'Long Best AI':
                return 'longbestai #aitools #automation #technology';
            case 'Thach Vu Land':
                return 'thachvuland #realestate #nhadat #canho';
            case 'Queen Nail Bern':
                return 'queennailbern #nailart #nailsalon #switzerland';
            default:
                return 'contentmarketing';
        }
    }

    /**
     * Upload images lên Facebook
     */
    async uploadImages(imageUrls) {
        const uploadedImages = [];
        
        for (const imageUrl of imageUrls) {
            try {
                // Download image from Google Drive
                const imageBuffer = await this.downloadImage(imageUrl);
                
                // Upload to Facebook
                const uploadResponse = await axios.post(
                    `https://graph.facebook.com/v18.0/${this.config.pageId}/photos`,
                    {
                        source: imageBuffer,
                        published: false
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${this.config.accessToken}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                
                uploadedImages.push(uploadResponse.data.id);
                
            } catch (error) {
                logger.error('Failed to upload image', error);
                // Continue with other images
            }
        }
        
        return uploadedImages;
    }

    /**
     * Download image từ URL
     */
    async downloadImage(imageUrl) {
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer'
        });
        return response.data;
    }

    /**
     * Tạo Facebook post với images
     */
    async createFacebookPost(caption, imageUrls) {
        const uploadedImages = await this.uploadImages(imageUrls);
        
        const postData = {
            message: caption,
            attached_media: uploadedImages.map(id => ({ media_fbid: id }))
        };
        
        const response = await axios.post(
            `https://graph.facebook.com/v18.0/${this.config.pageId}/feed`,
            postData,
            {
                headers: {
                    'Authorization': `Bearer ${this.config.accessToken}`
                }
            }
        );
        
        return response.data;
    }

    /**
     * Publish post (nếu chưa publish)
     */
    async publishPost(postData) {
        // Post đã được publish trong createFacebookPost
        return postData;
    }

    /**
     * Lên lịch đăng bài
     */
    async schedulePost(contentData, imageUrls, scheduledTime) {
        const runId = `fb_schedule_${Date.now()}`;
        
        monitor.startWorkflow(runId, this.config.pageName, 'facebook-schedule', {
            brand: this.config.pageName,
            scheduledTime
        });

        try {
            const caption = this.prepareCaption(contentData);
            const uploadedImages = await this.uploadImages(imageUrls);
            
            const scheduleData = {
                message: caption,
                attached_media: uploadedImages.map(id => ({ media_fbid: id })),
                published: false,
                scheduled_publish_time: Math.floor(new Date(scheduledTime).getTime() / 1000)
            };
            
            const response = await axios.post(
                `https://graph.facebook.com/v18.0/${this.config.pageId}/feed`,
                scheduleData,
                {
                    headers: {
                        'Authorization': `Bearer ${this.config.accessToken}`
                    }
                }
            );
            
            monitor.completeWorkflow(runId, true);
            
            return {
                success: true,
                postId: response.data.id,
                scheduledTime,
                status: 'scheduled'
            };
            
        } catch (error) {
            monitor.completeWorkflow(runId, false, error.message);
            throw error;
        }
    }
}

/**
 * Auto-publish function cho integration
 */
async function autoPublish(brandId, topic, format = 'carousel') {
    try {
        console.log(`🚀 Starting auto-publish for ${brandId}...`);
        
        // Get latest content
        const contentData = await getLatestContent(brandId);
        const imageUrls = await getLatestImageUrls(brandId);
        
        // Create publisher
        const publisher = new FacebookAutoPublisher(brandId);
        
        // Publish immediately
        const result = await publisher.publishContent(contentData, imageUrls);
        
        console.log(`✅ Published to ${BRAND_CONFIGS[brandId].pageName}`);
        console.log(`📱 Post URL: ${result.postUrl}`);
        
        return result;
        
    } catch (error) {
        console.error(`❌ Auto-publish failed for ${brandId}:`, error.message);
        throw error;
    }
}

/**
 * Lấy content mới nhất
 */
async function getLatestContent(brandId) {
    const contentDir = path.join(__dirname, '../../output');
    const folders = await fs.readdir(contentDir);
    const brandFolders = folders.filter(f => f.startsWith(`${brandId}-`));
    
    if (brandFolders.length === 0) {
        throw new Error(`No content found for ${brandId}`);
    }
    
    const latestFolder = brandFolders.sort().reverse()[0];
    const contentPath = path.join(contentDir, latestFolder, 'content.json');
    
    return JSON.parse(await fs.readFile(contentPath, 'utf8'));
}

/**
 * Lấy URLs của ảnh mới nhất
 */
async function getLatestImageUrls(brandId) {
    const contentDir = path.join(__dirname, '../../output');
    const folders = await fs.readdir(contentDir);
    const brandFolders = folders.filter(f => f.startsWith(`${brandId}-`));
    
    const latestFolder = brandFolders.sort().reverse()[0];
    const folderPath = path.join(contentDir, latestFolder);
    
    const files = await fs.readdir(folderPath);
    const imageFiles = files.filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
    
    // Return placeholder URLs - in real implementation, these would be Google Drive URLs
    return imageFiles.map(file => `file://${path.join(folderPath, file)}`);
}

// Export functions
module.exports = {
    FacebookAutoPublisher,
    autoPublish,
    getLatestContent,
    getLatestImageUrls
};

// Run if called directly
if (require.main === module) {
    const brandId = process.argv[2];
    if (!brandId) {
        console.log('Usage: node auto-publisher.js <brand-id>');
        console.log('Available brands: longbest, thachvuland, queennailbern');
        process.exit(1);
    }
    
    autoPublish(brandId).catch(console.error);
}
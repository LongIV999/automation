/**
 * Content Review Dashboard - Server
 * 
 * Web UI để review AI-generated content trước khi publish
 * Features:
 * - View pending content
 * - Approve/Reject workflow
 * - Edit content inline
 * - Preview generated images
 */

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Try to load logger, fallback if not available
let logger;
try {
    logger = require('../utils/logger');
} catch (e) {
    logger = {
        info: console.log,
        warn: console.warn,
        error: console.error,
        debug: console.log
    };
}

const app = express();
const PORT = process.env.REVIEW_PORT || 3000;

// Paths
const CONTENT_DIR = path.join(__dirname, '../carousel-generator/content');
const OUTPUT_DIR = path.join(__dirname, '../carousel-generator/output');
const ARCHIVE_DIR = path.join(__dirname, '../carousel-generator/archive');
const REJECTED_DIR = path.join(__dirname, '../carousel-generator/rejected');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve generated images
app.use('/images', express.static(OUTPUT_DIR));

// API: Get pending reviews
app.get('/api/pending', async (req, res) => {
    try {
        await fs.mkdir(CONTENT_DIR, { recursive: true });
        const files = await fs.readdir(CONTENT_DIR);
        const jsonFiles = files.filter(f => f.endsWith('.json'));

        const pending = [];
        for (const file of jsonFiles) {
            try {
                const filePath = path.join(CONTENT_DIR, file);
                const content = JSON.parse(await fs.readFile(filePath, 'utf-8'));
                const stats = await fs.stat(filePath);

                // Check if images exist
                const baseName = path.basename(file, '.json');
                const imagesDir = path.join(OUTPUT_DIR, baseName);
                let hasImages = false;
                let imageCount = 0;

                try {
                    const images = await fs.readdir(imagesDir);
                    imageCount = images.filter(f => f.endsWith('.png')).length;
                    hasImages = imageCount > 0;
                } catch (e) {
                    // Images not generated yet
                }

                pending.push({
                    id: file,
                    baseName,
                    ...content,
                    createdAt: stats.mtime,
                    hasImages,
                    imageCount
                });
            } catch (e) {
                logger.warn(`Failed to parse ${file}`, { error: e.message });
            }
        }

        // Sort by creation date, newest first
        pending.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(pending);
    } catch (error) {
        logger.error('Error fetching pending reviews', { error: error.message });
        res.status(500).json({ error: error.message });
    }
});

// API: Get single content item
app.get('/api/content/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const filePath = path.join(CONTENT_DIR, id);
        const content = JSON.parse(await fs.readFile(filePath, 'utf-8'));
        res.json(content);
    } catch (error) {
        logger.error('Error fetching content', { error: error.message });
        res.status(500).json({ error: error.message });
    }
});

// API: Update content
app.put('/api/content/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const newContent = req.body;
        const filePath = path.join(CONTENT_DIR, id);

        await fs.writeFile(filePath, JSON.stringify(newContent, null, 2));
        logger.info('Content updated', { id });

        res.json({ success: true });
    } catch (error) {
        logger.error('Error updating content', { error: error.message });
        res.status(500).json({ error: error.message });
    }
});

// API: Generate images for content
app.post('/api/generate/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const baseName = path.basename(id, '.json');
        const contentPath = path.join(CONTENT_DIR, id);
        const outputDir = path.join(OUTPUT_DIR, baseName);

        // Detect brand
        const content = JSON.parse(await fs.readFile(contentPath, 'utf-8'));
        const brandRaw = content.brand || 'Long Best AI';
        const brand = brandRaw.toLowerCase().includes('thach vu') ? 'thachvuland' : 'longbest';

        let generatorScript = 'generator.js';
        if (brand === 'thachvuland') {
            generatorScript = 'generator-tvland.js';
        }

        logger.info('Generating images', { id, brand, generatorScript });

        // Run generator
        const generatorDir = path.join(__dirname, '../carousel-generator');
        await execPromise(`node ${generatorScript} "${contentPath}" "${outputDir}"`, { cwd: generatorDir });

        // Run enhancer
        await execPromise(`node enhancer.js "${outputDir}"`, { cwd: generatorDir });

        logger.info('Images generated successfully', { id, outputDir });
        res.json({ success: true, outputDir });
    } catch (error) {
        logger.error('Error generating images', { error: error.message });
        res.status(500).json({ error: error.message });
    }
});

// API: Approve and publish
app.post('/api/approve/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const baseName = path.basename(id, '.json');
        const contentPath = path.join(CONTENT_DIR, id);
        const outputDir = path.join(OUTPUT_DIR, baseName);

        // Detect brand
        const content = JSON.parse(await fs.readFile(contentPath, 'utf-8'));
        const brandRaw = content.brand || 'Long Best AI';
        const brand = brandRaw.toLowerCase().includes('thach vu') ? 'thachvuland' : 'longbest';

        logger.info('Publishing content', { id, brand });

        // Run uploader
        const uploaderDir = path.join(__dirname, '../drive-uploader');
        await execPromise(`node upload.js "${outputDir}" --brand ${brand}`, { cwd: uploaderDir });

        // Move content to archive
        await fs.mkdir(ARCHIVE_DIR, { recursive: true });
        await fs.rename(contentPath, path.join(ARCHIVE_DIR, id));

        logger.info('Content published and archived', { id });
        res.json({ success: true, message: 'Published successfully!' });
    } catch (error) {
        logger.error('Error publishing content', { error: error.message });
        res.status(500).json({ error: error.message });
    }
});

// API: Reject content
app.post('/api/reject/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        logger.info('Content rejected', { id, reason });

        const contentPath = path.join(CONTENT_DIR, id);

        // Move to rejected folder
        await fs.mkdir(REJECTED_DIR, { recursive: true });
        await fs.rename(contentPath, path.join(REJECTED_DIR, id));

        res.json({ success: true });
    } catch (error) {
        logger.error('Error rejecting content', { error: error.message });
        res.status(500).json({ error: error.message });
    }
});

// API: Get images for content
app.get('/api/images/:baseName', async (req, res) => {
    try {
        const { baseName } = req.params;
        const imagesDir = path.join(OUTPUT_DIR, baseName);

        const files = await fs.readdir(imagesDir);
        const images = files
            .filter(f => f.endsWith('.png'))
            .sort()
            .map(f => `/images/${baseName}/${f}`);

        res.json(images);
    } catch (error) {
        res.json([]);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🎨 Content Review Dashboard`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`\nPress Ctrl+C to stop\n`);
    logger.info('Review dashboard started', { port: PORT });
});

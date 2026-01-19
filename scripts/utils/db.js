/**
 * Database Module - SQLite Analytics Storage
 * 
 * Stores post data and metrics for performance tracking
 */

const Database = require('better-sqlite3');
const path = require('path');

// Try to load logger
let logger;
try {
    logger = require('./logger');
} catch (e) {
    logger = {
        info: console.log,
        error: console.error,
        warn: console.warn
    };
}

// Database path
const DB_PATH = path.join(__dirname, '../../data/analytics.db');

// Initialize database
const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
    -- Posts table: stores all generated posts
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id TEXT UNIQUE,
        brand TEXT NOT NULL,
        topic TEXT,
        title TEXT,
        folder_id TEXT,
        folder_link TEXT,
        slide_count INTEGER DEFAULT 7,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        published_at DATETIME,
        status TEXT DEFAULT 'pending'
    );

    -- Metrics table: stores Facebook engagement metrics
    CREATE TABLE IF NOT EXISTS metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id TEXT NOT NULL,
        fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        likes INTEGER DEFAULT 0,
        comments INTEGER DEFAULT 0,
        shares INTEGER DEFAULT 0,
        reach INTEGER DEFAULT 0,
        impressions INTEGER DEFAULT 0,
        FOREIGN KEY (post_id) REFERENCES posts(post_id)
    );

    -- Workflow runs table: stores execution data
    CREATE TABLE IF NOT EXISTS workflow_runs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        run_id TEXT UNIQUE,
        brand TEXT,
        topic TEXT,
        started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        finished_at DATETIME,
        duration_ms INTEGER,
        status TEXT DEFAULT 'running',
        error_message TEXT
    );

    -- Create indexes for faster queries
    CREATE INDEX IF NOT EXISTS idx_posts_brand ON posts(brand);
    CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
    CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at);
    CREATE INDEX IF NOT EXISTS idx_metrics_post_id ON metrics(post_id);
    CREATE INDEX IF NOT EXISTS idx_workflow_runs_status ON workflow_runs(status);
`);

logger.info('Analytics database initialized', { path: DB_PATH });

// Helper functions
const queries = {
    // Posts
    insertPost: db.prepare(`
        INSERT OR REPLACE INTO posts (post_id, brand, topic, title, folder_id, folder_link, slide_count, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `),

    updatePostStatus: db.prepare(`
        UPDATE posts SET status = ?, published_at = CURRENT_TIMESTAMP WHERE post_id = ?
    `),

    getPostsByBrand: db.prepare(`
        SELECT * FROM posts WHERE brand = ? ORDER BY created_at DESC LIMIT ?
    `),

    getRecentPosts: db.prepare(`
        SELECT * FROM posts ORDER BY created_at DESC LIMIT ?
    `),

    getPublishedPosts: db.prepare(`
        SELECT * FROM posts WHERE status = 'published' ORDER BY published_at DESC LIMIT ?
    `),

    // Metrics
    insertMetrics: db.prepare(`
        INSERT INTO metrics (post_id, likes, comments, shares, reach, impressions)
        VALUES (?, ?, ?, ?, ?, ?)
    `),

    getLatestMetrics: db.prepare(`
        SELECT * FROM metrics WHERE post_id = ? ORDER BY fetched_at DESC LIMIT 1
    `),

    // Workflow runs
    insertWorkflowRun: db.prepare(`
        INSERT INTO workflow_runs (run_id, brand, topic, status)
        VALUES (?, ?, ?, 'running')
    `),

    completeWorkflowRun: db.prepare(`
        UPDATE workflow_runs 
        SET finished_at = CURRENT_TIMESTAMP, 
            duration_ms = ?, 
            status = ?
        WHERE run_id = ?
    `),

    failWorkflowRun: db.prepare(`
        UPDATE workflow_runs 
        SET finished_at = CURRENT_TIMESTAMP,
            duration_ms = ?,
            status = 'failed',
            error_message = ?
        WHERE run_id = ?
    `),

    getWorkflowStats: db.prepare(`
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as success,
            SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
            AVG(duration_ms) as avg_duration_ms
        FROM workflow_runs
        WHERE started_at > datetime('now', '-7 days')
    `)
};

// Export functions
module.exports = {
    db,
    queries,

    // Post tracking
    trackPost(postId, brand, topic, title, folderId, folderLink, slideCount = 7) {
        try {
            queries.insertPost.run(postId, brand, topic, title, folderId, folderLink, slideCount, 'pending');
            logger.info('Post tracked', { postId, brand, topic });
        } catch (error) {
            logger.error('Error tracking post', { error: error.message, postId });
        }
    },

    publishPost(postId) {
        try {
            queries.updatePostStatus.run('published', postId);
            logger.info('Post published', { postId });
        } catch (error) {
            logger.error('Error updating post status', { error: error.message, postId });
        }
    },

    // Metrics
    addMetrics(postId, metrics) {
        try {
            queries.insertMetrics.run(
                postId,
                metrics.likes || 0,
                metrics.comments || 0,
                metrics.shares || 0,
                metrics.reach || 0,
                metrics.impressions || 0
            );
            logger.info('Metrics added', { postId, ...metrics });
        } catch (error) {
            logger.error('Error adding metrics', { error: error.message, postId });
        }
    },

    // Workflow tracking
    startWorkflow(runId, brand, topic) {
        try {
            queries.insertWorkflowRun.run(runId, brand, topic);
        } catch (error) {
            logger.error('Error starting workflow tracking', { error: error.message, runId });
        }
    },

    completeWorkflow(runId, durationMs) {
        try {
            queries.completeWorkflowRun.run(durationMs, 'completed', runId);
        } catch (error) {
            logger.error('Error completing workflow tracking', { error: error.message, runId });
        }
    },

    failWorkflow(runId, durationMs, errorMessage) {
        try {
            queries.failWorkflowRun.run(durationMs, errorMessage, runId);
        } catch (error) {
            logger.error('Error recording workflow failure', { error: error.message, runId });
        }
    },

    // Reports
    getWorkflowStats() {
        return queries.getWorkflowStats.get();
    },

    getRecentPosts(limit = 10) {
        return queries.getRecentPosts.all(limit);
    },

    getTopPerformingPosts(limit = 10) {
        const stmt = db.prepare(`
            SELECT 
                p.post_id,
                p.brand,
                p.topic,
                p.title,
                p.published_at,
                MAX(m.likes) as likes,
                MAX(m.comments) as comments,
                MAX(m.shares) as shares,
                (MAX(m.likes) + MAX(m.comments) * 2 + MAX(m.shares) * 3) as engagement_score
            FROM posts p
            LEFT JOIN metrics m ON p.post_id = m.post_id
            WHERE p.status = 'published'
            GROUP BY p.post_id
            ORDER BY engagement_score DESC
            LIMIT ?
        `);
        return stmt.all(limit);
    },

    getDailyStats(days = 7) {
        const stmt = db.prepare(`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as posts_created,
                SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as posts_published
            FROM posts
            WHERE created_at > datetime('now', '-' || ? || ' days')
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        `);
        return stmt.all(days);
    }
};

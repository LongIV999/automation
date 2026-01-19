#!/usr/bin/env node
/**
 * Analytics Report Generator
 * 
 * Generates performance reports for content posts
 */

const path = require('path');

// Add parent to module path for sibling imports
const dbModule = require('../utils/db');

// Colors for terminal
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};

function printHeader(text) {
    console.log(`\n${colors.bright}${colors.cyan}${'═'.repeat(60)}${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}  ${text}${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}${'═'.repeat(60)}${colors.reset}\n`);
}

function printSection(text) {
    console.log(`\n${colors.bright}${colors.blue}▶ ${text}${colors.reset}`);
    console.log(`${'─'.repeat(50)}`);
}

function formatNumber(num) {
    if (num === null || num === undefined) return '0';
    return num.toLocaleString();
}

function formatDuration(ms) {
    if (!ms) return 'N/A';
    const seconds = Math.round(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
}

function generateReport() {
    printHeader('📊 AUTOMATION ANALYTICS REPORT');
    console.log(`Generated: ${new Date().toLocaleString('vi-VN')}`);

    // Workflow Stats
    printSection('Workflow Performance (Last 7 Days)');
    const workflowStats = dbModule.getWorkflowStats();

    if (workflowStats) {
        const successRate = workflowStats.total > 0
            ? ((workflowStats.success / workflowStats.total) * 100).toFixed(1)
            : 0;

        console.log(`  Total Runs:     ${colors.bright}${formatNumber(workflowStats.total)}${colors.reset}`);
        console.log(`  Success:        ${colors.green}${formatNumber(workflowStats.success)}${colors.reset}`);
        console.log(`  Failed:         ${colors.red}${formatNumber(workflowStats.failed)}${colors.reset}`);
        console.log(`  Success Rate:   ${successRate >= 90 ? colors.green : colors.yellow}${successRate}%${colors.reset}`);
        console.log(`  Avg Duration:   ${formatDuration(workflowStats.avg_duration_ms)}`);
    } else {
        console.log('  No workflow data available yet.');
    }

    // Recent Posts
    printSection('Recent Posts');
    const recentPosts = dbModule.getRecentPosts(5);

    if (recentPosts.length > 0) {
        recentPosts.forEach((post, i) => {
            const status = post.status === 'published'
                ? `${colors.green}✓ Published${colors.reset}`
                : `${colors.yellow}○ Pending${colors.reset}`;
            console.log(`  ${i + 1}. [${post.brand}] ${post.title || post.topic}`);
            console.log(`     Status: ${status} | Created: ${new Date(post.created_at).toLocaleDateString('vi-VN')}`);
        });
    } else {
        console.log('  No posts tracked yet.');
    }

    // Top Performing Posts
    printSection('Top Performing Posts (by Engagement)');
    const topPosts = dbModule.getTopPerformingPosts(5);

    if (topPosts.length > 0 && topPosts[0].engagement_score > 0) {
        topPosts.forEach((post, i) => {
            console.log(`  ${i + 1}. ${post.title || post.topic}`);
            console.log(`     👍 ${formatNumber(post.likes)} | 💬 ${formatNumber(post.comments)} | 🔄 ${formatNumber(post.shares)}`);
            console.log(`     Score: ${colors.bright}${formatNumber(post.engagement_score)}${colors.reset}`);
        });
    } else {
        console.log('  No engagement data available yet.');
        console.log('  (Metrics will appear after fetching from Facebook)');
    }

    // Daily Stats
    printSection('Daily Content Creation');
    const dailyStats = dbModule.getDailyStats(7);

    if (dailyStats.length > 0) {
        dailyStats.forEach(day => {
            const bar = '█'.repeat(Math.min(day.posts_created * 2, 20));
            console.log(`  ${day.date}: ${colors.blue}${bar}${colors.reset} ${day.posts_created} created, ${day.posts_published} published`);
        });
    } else {
        console.log('  No daily data available yet.');
    }

    // Summary
    printSection('Summary');
    const totalPosts = dbModule.db.prepare(`SELECT COUNT(*) as count FROM posts`).get();
    const publishedPosts = dbModule.db.prepare(`SELECT COUNT(*) as count FROM posts WHERE status = 'published'`).get();

    console.log(`  Total Posts Created:   ${colors.bright}${formatNumber(totalPosts.count)}${colors.reset}`);
    console.log(`  Published:             ${colors.green}${formatNumber(publishedPosts.count)}${colors.reset}`);
    console.log(`  Pending:               ${colors.yellow}${formatNumber(totalPosts.count - publishedPosts.count)}${colors.reset}`);

    console.log(`\n${colors.cyan}${'─'.repeat(60)}${colors.reset}`);
    console.log(`${colors.bright}Report complete!${colors.reset}\n`);
}

// Run if called directly
if (require.main === module) {
    generateReport();
}

module.exports = { generateReport };

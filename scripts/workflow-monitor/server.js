/**
 * HTTP Server with API for Content Automation Dashboard
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const logger = require('../utils/logger');

const PORT = 3002;

// Parse JSON body
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (error) {
                reject(error);
            }
        });
        req.on('error', reject);
    });
}

// Handle API requests
async function handleApiRequest(req, res, pathname) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (pathname === '/api/create-content' && req.method === 'POST') {
        try {
            const data = await parseBody(req);
            const { brand, topic, format, style, research } = data;

            if (!brand || !topic) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Missing required fields' }));
                return;
            }

            logger.info('Creating content workflow', { brand, topic, format, style, research });

            // Build command arguments
            const args = [topic, '--brand', brand];

            if (format && format !== 'auto') {
                args.push('--format', format);
            }

            if (style) {
                args.push('--style', style);
            }

            if (research) {
                args.push('--research');
            }

            // Execute daily-agent.js in background
            const dailyAgentPath = path.join(__dirname, '..', 'daily-agent.js');
            const process = spawn('node', [dailyAgentPath, ...args], {
                detached: true,
                stdio: 'ignore',
                cwd: path.join(__dirname, '..')
            });

            process.unref();

            logger.info('Workflow started', {
                pid: process.pid,
                brand,
                topic,
                command: `node daily-agent.js ${args.join(' ')}`
            });

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                message: 'Workflow started successfully',
                workflowId: `${brand}-${Date.now()}`,
                pid: process.pid
            }));

        } catch (error) {
            logger.error('API error', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: error.message
            }));
        }
        return;
    }

    // Unknown API endpoint
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Not found' }));
}

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // API routes
    if (pathname.startsWith('/api/')) {
        await handleApiRequest(req, res, pathname);
        return;
    }

    // Serve dashboard
    if (pathname === '/' || pathname === '/dashboard.html') {
        const dashboardPath = path.join(__dirname, 'dashboard.html');
        fs.readFile(dashboardPath, 'utf8', (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading dashboard');
                logger.error('Error loading dashboard', err);
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
        return;
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
});

server.listen(PORT, () => {
    logger.info(`Dashboard server running at http://localhost:${PORT}`);
    console.log(`\n📊 Content Automation Dashboard: http://localhost:${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/create-content\n`);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, closing server');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});

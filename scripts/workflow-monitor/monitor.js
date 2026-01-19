/**
 * Workflow Monitor - Central monitoring system
 * Tracks all workflow executions, integrates with existing analytics.db
 */

const EventEmitter = require('events');
const { db } = require('../utils/db'); // Destructure to get db instance
const logger = require('../utils/logger');
const { sendTelegramNotification } = require('../utils/notifier');
const WebSocket = require('ws');

class WorkflowMonitor extends EventEmitter {
    constructor() {
        super();
        this.activeWorkflows = new Map();
        this.metrics = {
            total: 0,
            success: 0,
            failed: 0,
            running: 0
        };
        this.setupWebSocket();
        this.setupDatabase();
    }

    setupWebSocket() {
        // WebSocket server for real-time dashboard
        this.wss = new WebSocket.Server({ port: 3001 });
        
        this.wss.on('connection', (ws) => {
            logger.info('Dashboard connected');
            // Send current state
            ws.send(JSON.stringify({
                type: 'state',
                workflows: Array.from(this.activeWorkflows.values()),
                metrics: this.metrics
            }));

            // Keep connection alive
            const interval = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.ping();
                }
            }, 30000);

            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    this.handleClientMessage(data);
                } catch (error) {
                    logger.error('Invalid message from client', error);
                }
            });

            ws.on('close', () => {
                clearInterval(interval);
                logger.info('Dashboard disconnected');
            });
        });
    }

    setupDatabase() {
        // Create monitoring table if not exists
        try {
            const createTableStmt = db.prepare(`
                CREATE TABLE IF NOT EXISTS workflow_monitor (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    workflow_id TEXT UNIQUE,
                    brand TEXT,
                    type TEXT,
                    status TEXT,
                    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    completed_at DATETIME,
                    duration_seconds INTEGER,
                    steps_completed TEXT,
                    error TEXT,
                    metadata TEXT
                )
            `);
            createTableStmt.run();
        } catch (error) {
            logger.error('Failed to create workflow_monitor table', error);
        }
    }

    startWorkflow(workflowId, brand, type, metadata = {}) {
        const workflow = {
            id: workflowId,
            brand,
            type,
            status: 'running',
            startedAt: new Date(),
            steps: [],
            metadata
        };

        this.activeWorkflows.set(workflowId, workflow);
        this.metrics.running++;
        this.metrics.total++;

        // Insert to database
        const stmt = db.prepare(`
            INSERT INTO workflow_monitor (workflow_id, brand, type, status, metadata)
            VALUES (?, ?, ?, ?, ?)
        `);
        stmt.run(workflowId, brand, type, 'running', JSON.stringify(metadata));

        this.broadcast({
            type: 'workflow:start',
            workflow
        });

        logger.info(`Workflow started: ${workflowId}`, { brand, type });
        return workflow;
    }

    updateStep(workflowId, step, status, details = {}) {
        const workflow = this.activeWorkflows.get(workflowId);
        if (!workflow) return;

        const stepData = {
            name: step,
            status,
            timestamp: new Date(),
            details
        };

        workflow.steps.push(stepData);
        workflow.currentStep = step;

        this.broadcast({
            type: 'workflow:step',
            workflowId,
            step: stepData
        });

        logger.debug(`Workflow ${workflowId} - Step: ${step} - Status: ${status}`);
    }

    completeWorkflow(workflowId, success = true, error = null) {
        const workflow = this.activeWorkflows.get(workflowId);
        if (!workflow) return;

        workflow.status = success ? 'completed' : 'failed';
        workflow.completedAt = new Date();
        workflow.duration = Math.round((workflow.completedAt - workflow.startedAt) / 1000);

        // Update metrics
        this.metrics.running--;
        if (success) {
            this.metrics.success++;
        } else {
            this.metrics.failed++;
        }

        // Update database
        const stmt = db.prepare(`
            UPDATE workflow_monitor 
            SET status = ?, completed_at = ?, duration_seconds = ?, 
                steps_completed = ?, error = ?
            WHERE workflow_id = ?
        `);
        stmt.run(
            workflow.status,
            workflow.completedAt.toISOString(),
            workflow.duration,
            JSON.stringify(workflow.steps),
            error,
            workflowId
        );

        this.broadcast({
            type: 'workflow:complete',
            workflow
        });

        // Send notification for failures
        if (!success) {
            sendTelegramNotification(
                `❌ Workflow Failed\n` +
                `ID: ${workflowId}\n` +
                `Brand: ${workflow.brand}\n` +
                `Type: ${workflow.type}\n` +
                `Error: ${error}`
            );
        }

        logger.info(`Workflow completed: ${workflowId}`, {
            success,
            duration: workflow.duration,
            error
        });

        // Clean up after 5 minutes
        setTimeout(() => {
            this.activeWorkflows.delete(workflowId);
        }, 5 * 60 * 1000);
    }

    broadcast(data) {
        const message = JSON.stringify(data);
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    getWorkflowStats(brand = null, days = 7) {
        const query = brand 
            ? `SELECT * FROM workflow_monitor WHERE brand = ? AND started_at > datetime('now', '-${days} days')`
            : `SELECT * FROM workflow_monitor WHERE started_at > datetime('now', '-${days} days')`;
        
        const stmt = db.prepare(query);
        const results = brand ? stmt.all(brand) : stmt.all();

        return {
            totalRuns: results.length,
            successRate: results.filter(r => r.status === 'completed').length / results.length,
            avgDuration: results.reduce((acc, r) => acc + (r.duration_seconds || 0), 0) / results.length,
            byType: this.groupBy(results, 'type'),
            byBrand: this.groupBy(results, 'brand')
        };
    }

    groupBy(array, key) {
        return array.reduce((acc, item) => {
            const group = item[key];
            if (!acc[group]) acc[group] = [];
            acc[group].push(item);
            return acc;
        }, {});
    }

    handleClientMessage(data) {
        switch (data.action) {
            case 'startWorkflow':
                this.startWorkflow(data.workflowId, data.brand, data.type, data.metadata);
                break;
            case 'updateStep':
                this.updateStep(data.workflowId, data.step, data.status, data.details);
                break;
            case 'completeWorkflow':
                this.completeWorkflow(data.workflowId, data.success, data.error);
                break;
            default:
                logger.warn('Unknown action from client', data.action);
        }
    }
}

// Singleton instance
let monitor;

// Only create instance if running as standalone
if (require.main === module) {
    monitor = new WorkflowMonitor();
    console.log('\n📊 Workflow Monitor running on ws://localhost:3001');
    console.log('📈 Dashboard available at http://localhost:3002\n');
} else {
    // When imported as module, create a client that connects to existing monitor
    const MonitorClient = require('./monitor-client');
    monitor = new MonitorClient();
}

module.exports = monitor;
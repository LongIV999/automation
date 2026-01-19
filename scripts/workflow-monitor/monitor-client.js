/**
 * Monitor Client - Connects to running monitor server
 * Used when monitor is imported as a module
 */

const WebSocket = require('ws');
const logger = require('../utils/logger');

class MonitorClient {
    constructor() {
        this.ws = null;
        this.connected = false;
        this.pendingMessages = [];
        this.connect();
    }

    connect() {
        try {
            this.ws = new WebSocket('ws://localhost:3001');
            
            this.ws.on('open', () => {
                this.connected = true;
                logger.debug('Connected to monitor server');
                
                // Send any pending messages
                while (this.pendingMessages.length > 0) {
                    const message = this.pendingMessages.shift();
                    this.ws.send(JSON.stringify(message));
                }
            });

            this.ws.on('close', () => {
                this.connected = false;
                logger.debug('Disconnected from monitor server');
                // Try to reconnect after 5 seconds
                setTimeout(() => this.connect(), 5000);
            });

            this.ws.on('error', (error) => {
                // Silently handle connection errors
                // Monitor server might not be running
            });
        } catch (error) {
            // If connection fails, workflow continues without monitoring
            logger.debug('Monitor server not available');
        }
    }

    sendMessage(message) {
        if (this.connected && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            // Queue message for when connection is established
            this.pendingMessages.push(message);
        }
    }

    startWorkflow(workflowId, brand, type, metadata = {}) {
        this.sendMessage({
            action: 'startWorkflow',
            workflowId,
            brand,
            type,
            metadata
        });
        
        // Return workflow object for compatibility
        return {
            id: workflowId,
            brand,
            type,
            status: 'running',
            startedAt: new Date(),
            steps: [],
            metadata
        };
    }

    updateStep(workflowId, step, status, details = {}) {
        this.sendMessage({
            action: 'updateStep',
            workflowId,
            step,
            status,
            details
        });
    }

    completeWorkflow(workflowId, success = true, error = null) {
        this.sendMessage({
            action: 'completeWorkflow',
            workflowId,
            success,
            error
        });
    }

    // Stub for compatibility
    getWorkflowStats(brand = null, days = 7) {
        logger.debug('Stats not available in client mode');
        return {
            totalRuns: 0,
            successRate: 0,
            avgDuration: 0,
            byType: {},
            byBrand: {}
        };
    }
}

module.exports = MonitorClient;
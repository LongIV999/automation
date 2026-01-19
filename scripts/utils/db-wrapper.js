/**
 * Database wrapper to match the expected API in daily-agent-monitored.js
 */

const db = require('./db');

// Wrapper for analytics compatibility
const analytics = {
    trackWorkflowRun(runId, brand, topic, status, error = null, metadata = {}) {
        switch (status) {
            case 'started':
                db.startWorkflow(runId, brand, topic);
                break;
            case 'completed':
                if (metadata.duration) {
                    db.completeWorkflow(runId, metadata.duration * 1000);
                }
                break;
            case 'failed':
                if (metadata.duration) {
                    db.failWorkflow(runId, metadata.duration * 1000, error);
                }
                break;
        }
    },
    
    // Re-export other functions
    ...db
};

module.exports = analytics;
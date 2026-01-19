// Advanced Error Handling and Monitoring for n8n Workflow
// This script provides comprehensive error handling, logging, and status tracking

const WorkflowMonitor = {
  // Error classification system
  errorTypes: {
    FACEBOOK_API: 'facebook_api_error',
    GOOGLE_DRIVE: 'google_drive_error', 
    GOOGLE_SHEETS: 'google_sheets_error',
    DATA_VALIDATION: 'data_validation_error',
    NETWORK: 'network_error',
    AUTHENTICATION: 'authentication_error',
    RATE_LIMIT: 'rate_limit_error',
    UNKNOWN: 'unknown_error'
  },

  // Classify error type
  classifyError: function(error) {
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('facebook') || message.includes('graph api')) {
      return this.errorTypes.FACEBOOK_API;
    }
    if (message.includes('drive') || message.includes('google drive')) {
      return this.errorTypes.GOOGLE_DRIVE;
    }
    if (message.includes('sheet') || message.includes('google sheets')) {
      return this.errorTypes.GOOGLE_SHEETS;
    }
    if (message.includes('network') || message.includes('timeout')) {
      return this.errorTypes.NETWORK;
    }
    if (message.includes('auth') || message.includes('credential')) {
      return this.errorTypes.AUTHENTICATION;
    }
    if (message.includes('rate limit') || message.includes('too many requests')) {
      return this.errorTypes.RATE_LIMIT;
    }
    
    return this.errorTypes.UNKNOWN;
  },

  // Create detailed error report
  createErrorReport: function(error, context = {}) {
    return {
      error_id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      error_type: this.classifyError(error),
      message: error.message || 'Unknown error occurred',
      stack: error.stack || '',
      context: {
        node_name: context.nodeName || 'unknown',
        workflow_id: context.workflowId || 'autopost_queennail_optimized',
        execution_id: context.executionId || 'unknown',
        post_data: context.postData || {},
        additional_info: context.additionalInfo || {}
      },
      severity: this.determineSeverity(error),
      recovery_action: this.suggestRecoveryAction(error)
    };
  },

  // Generate unique error ID
  generateErrorId: function() {
    return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Determine error severity
  determineSeverity: function(error) {
    const criticalKeywords = ['authentication', 'credential', 'permission denied'];
    const warningKeywords = ['rate limit', 'timeout', 'network'];
    
    const message = error.message?.toLowerCase() || '';
    
    if (criticalKeywords.some(keyword => message.includes(keyword))) {
      return 'critical';
    }
    if (warningKeywords.some(keyword => message.includes(keyword))) {
      return 'warning';
    }
    
    return 'error';
  },

  // Suggest recovery action
  suggestRecoveryAction: function(error) {
    const errorType = this.classifyError(error);
    
    const actions = {
      [this.errorTypes.FACEBOOK_API]: 'Check Facebook API credentials and permissions',
      [this.errorTypes.GOOGLE_DRIVE]: 'Verify Google Drive access and file permissions',
      [this.errorTypes.GOOGLE_SHEETS]: 'Check Google Sheets API access and spreadsheet permissions',
      [this.errorTypes.NETWORK]: 'Check internet connection and retry operation',
      [this.errorTypes.AUTHENTICATION]: 'Re-authenticate with affected service',
      [this.errorTypes.RATE_LIMIT]: 'Wait before retrying or reduce request frequency',
      [this.errorTypes.DATA_VALIDATION]: 'Validate input data format and required fields',
      [this.errorTypes.UNKNOWN]: 'Investigate error logs and contact support if needed'
    };
    
    return actions[errorType] || actions[this.errorTypes.UNKNOWN];
  },

  // Log error to multiple destinations
  logError: async function(errorReport, logDestinations = ['console', 'sheet']) {
    // Always log to console
    console.error('Workflow Error:', JSON.stringify(errorReport, null, 2));
    
    // Log to Google Sheets if available
    if (logDestinations.includes('sheet')) {
      try {
        await this.logToSheet(errorReport);
      } catch (sheetError) {
        console.error('Failed to log error to sheet:', sheetError);
      }
    }
    
    // Additional logging can be added here (e.g., external monitoring services)
  },

  // Log error to Google Sheets
  logToSheet: async function(errorReport) {
    // This would be integrated with the Google Sheets node in n8n
    const errorLogData = {
      Error_ID: errorReport.error_id,
      Timestamp: errorReport.timestamp,
      Error_Type: errorReport.error_type,
      Message: errorReport.message,
      Node_Name: errorReport.context.node_name,
      Severity: errorReport.severity,
      Recovery_Action: errorReport.recovery_action,
      Context: JSON.stringify(errorReport.context),
      Resolved: false
    };
    
    return errorLogData;
  },

  // Track workflow performance metrics
  trackPerformance: function(nodeName, startTime, endTime, additionalMetrics = {}) {
    const duration = endTime - startTime;
    
    return {
      node_name: nodeName,
      start_time: startTime,
      end_time: endTime,
      duration_ms: duration,
      success: !additionalMetrics.error,
      additional_metrics: additionalMetrics
    };
  },

  // Generate workflow summary
  generateWorkflowSummary: function(performanceData, errors) {
    const totalNodes = performanceData.length;
    const successfulNodes = performanceData.filter(p => p.success).length;
    const totalDuration = performanceData.reduce((sum, p) => sum + p.duration_ms, 0);
    
    return {
      workflow_name: 'autopost_queennail_optimized',
      execution_time: new Date().toISOString(),
      total_nodes: totalNodes,
      successful_nodes: successfulNodes,
      failed_nodes: totalNodes - successfulNodes,
      success_rate: totalNodes > 0 ? (successfulNodes / totalNodes * 100).toFixed(2) : 0,
      total_duration_ms: totalDuration,
      average_node_duration_ms: totalNodes > 0 ? Math.round(totalDuration / totalNodes) : 0,
      errors: errors || [],
      performance_breakdown: performanceData
    };
  },

  // Health check for workflow dependencies
  performHealthCheck: async function() {
    const healthStatus = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      checks: {}
    };
    
    // Check each dependency
    const checks = [
      { name: 'Facebook API', check: this.checkFacebookAPI },
      { name: 'Google Drive', check: this.checkGoogleDrive },
      { name: 'Google Sheets', check: this.checkGoogleSheets }
    ];
    
    for (const check of checks) {
      try {
        await check.check();
        healthStatus.checks[check.name] = { status: 'ok', message: 'Connection successful' };
      } catch (error) {
        healthStatus.checks[check.name] = { status: 'error', message: error.message };
        healthStatus.status = 'degraded';
      }
    }
    
    return healthStatus;
  },

  // Mock health check methods (these would be actual API calls in production)
  checkFacebookAPI: async function() {
    // Simulate Facebook API health check
    return Promise.resolve();
  },

  checkGoogleDrive: async function() {
    // Simulate Google Drive health check
    return Promise.resolve();
  },

  checkGoogleSheets: async function() {
    // Simulate Google Sheets health check
    return Promise.resolve();
  }
};

// Export for use in n8n Code nodes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WorkflowMonitor;
}
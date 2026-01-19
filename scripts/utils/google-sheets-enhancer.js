// Enhanced Google Sheets Integration for n8n Workflow
// This script handles direct content transmission to Google Sheets with proper error handling

const GoogleSheetsEnhancer = {
  // Prepare data for Google Sheets update
  prepareSheetData: function(postData, facebookResponse, status = 'Done') {
    const timestamp = new Date().toISOString();
    
    return {
      Status: status,
      Post_URL: facebookResponse.post_url || `https://www.facebook.com/${facebookResponse.id}`,
      Post_ID: facebookResponse.id || '',
      Published_Date: timestamp,
      Drive_Folder_ID: postData.Drive_Folder_ID || '',
      Topic: postData.Topic || '',
      Images_Count: postData.Images_Count || 0,
      Keywords: postData.Keywords || '',
      Target_Audience: postData.Target_Audience || '',
      Priority: postData.Priority || '',
      Research_Notes: postData.Research_Notes || '',
      Type: postData.Type || '',
      Group_ID: postData.Group_ID || '',
      Processing_Time: timestamp,
      Workflow_Version: 'optimized-v1'
    };
  },

  // Update Google Sheets with retry logic
  updateSheetWithRetry: async function(sheetNode, data, maxRetries = 3) {
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        const result = await sheetNode.execute(data);
        return { success: true, data: result };
      } catch (error) {
        attempt++;
        console.log(`Sheet update attempt ${attempt} failed:`, error.message);
        
        if (attempt === maxRetries) {
          throw new Error(`Failed to update sheet after ${maxRetries} attempts: ${error.message}`);
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  },

  // Handle error logging to Google Sheets
  logErrorToSheet: async function(sheetNode, errorData, originalPostData) {
    const errorRecord = {
      Status: 'Error',
      Error_Message: errorData.message || 'Unknown error',
      Error_Time: new Date().toISOString(),
      Topic: originalPostData.Topic || '',
      Drive_Folder_ID: originalPostData.Drive_Folder_ID || '',
      Error_Details: JSON.stringify(errorData),
      Workflow_Version: 'optimized-v1'
    };
    
    try {
      await this.updateSheetWithRetry(sheetNode, errorRecord);
      console.log('Error logged to sheet successfully');
    } catch (logError) {
      console.error('Failed to log error to sheet:', logError);
    }
  },

  // Validate post data before processing
  validatePostData: function(postData) {
    const required = ['Topic', 'Caption'];
    const missing = required.filter(field => !postData[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
    
    return true;
  },

  // Sanitize content for Facebook
  sanitizeContent: function(content) {
    if (!content) return '';
    
    // Remove any potential problematic characters
    return content
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .replace(/[\uFFFE\uFFFF]/g, '') // Remove byte order mark characters
      .trim();
  },

  // Generate comprehensive status report
  generateStatusReport: function(workflowData) {
    return {
      workflow_name: 'autopost_queennail_optimized',
      execution_time: new Date().toISOString(),
      posts_processed: workflowData.posts_processed || 0,
      posts_successful: workflowData.successful_posts || 0,
      posts_failed: workflowData.failed_posts || 0,
      errors_encountered: workflowData.errors || [],
      performance_metrics: {
        total_execution_time: workflowData.total_time || 0,
        average_post_time: workflowData.average_post_time || 0,
        sheet_update_time: workflowData.sheet_update_time || 0
      },
      next_run_schedule: this.calculateNextRun()
    };
  },

  // Calculate next scheduled run time
  calculateNextRun: function() {
    const now = new Date();
    const nextRun = new Date(now.getTime() + (3 * 60 * 60 * 1000)); // Add 3 hours
    return nextRun.toISOString();
  }
};

// Export for use in n8n Code nodes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GoogleSheetsEnhancer;
}
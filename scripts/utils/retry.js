const logger = require('./logger');

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {Object} options - Retry options
 * @returns {Promise} Result of the function
 */
async function retryWithBackoff(fn, options = {}) {
    const {
        maxRetries = 3,
        initialDelay = 1000,
        maxDelay = 10000,
        backoffMultiplier = 2,
        onRetry = null
    } = options;

    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            if (attempt === maxRetries) {
                logger.error('Max retries reached', {
                    attempts: attempt + 1,
                    error: error.message
                });
                throw error;
            }

            const delay = Math.min(
                initialDelay * Math.pow(backoffMultiplier, attempt),
                maxDelay
            );

            logger.warn('Retry attempt', {
                attempt: attempt + 1,
                maxRetries,
                delay: `${delay}ms`,
                error: error.message
            });

            if (onRetry) {
                await onRetry(attempt, error);
            }

            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}

module.exports = { retryWithBackoff };

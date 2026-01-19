/**
 * Browser Pool - Reusable Puppeteer instances
 *
 * Maintains a pool of browser instances to avoid repeated launch/close cycles
 * Significantly improves performance for batch carousel generation
 */

const puppeteer = require('puppeteer');

class BrowserPool {
  constructor(options = {}) {
    this.maxInstances = options.maxInstances || 2;
    this.pool = [];
    this.inUse = new Set();
    this.launchOptions = {
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // Reduce memory usage
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ],
      executablePath: options.executablePath || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    };
  }

  /**
   * Acquire a browser instance from the pool
   */
  async acquire() {
    // Check for available instance
    const available = this.pool.find(b => !this.inUse.has(b));

    if (available) {
      this.inUse.add(available);
      return available;
    }

    // Create new instance if under limit
    if (this.pool.length < this.maxInstances) {
      const browser = await puppeteer.launch(this.launchOptions);
      this.pool.push(browser);
      this.inUse.add(browser);
      return browser;
    }

    // Wait for instance to become available
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const available = this.pool.find(b => !this.inUse.has(b));
        if (available) {
          clearInterval(interval);
          this.inUse.add(available);
          resolve(available);
        }
      }, 100);
    });
  }

  /**
   * Release a browser instance back to the pool
   */
  release(browser) {
    this.inUse.delete(browser);
  }

  /**
   * Close all browser instances and clear pool
   */
  async closeAll() {
    await Promise.all(this.pool.map(browser => browser.close()));
    this.pool = [];
    this.inUse.clear();
  }

  /**
   * Get pool statistics
   */
  getStats() {
    return {
      total: this.pool.length,
      inUse: this.inUse.size,
      available: this.pool.length - this.inUse.size
    };
  }
}

// Singleton instance
let globalPool = null;

/**
 * Get or create global browser pool
 */
function getBrowserPool(options) {
  if (!globalPool) {
    globalPool = new BrowserPool(options);
  }
  return globalPool;
}

/**
 * Close global browser pool
 */
async function closeGlobalPool() {
  if (globalPool) {
    await globalPool.closeAll();
    globalPool = null;
  }
}

module.exports = {
  BrowserPool,
  getBrowserPool,
  closeGlobalPool
};

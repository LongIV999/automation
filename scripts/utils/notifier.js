const logger = require('./logger');

/**
 * Send error notification via Telegram
 * Setup: Create bot via @BotFather, get token and chat_id
 */
async function sendTelegramNotification(message, metadata = {}) {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        logger.warn('Telegram credentials not configured, skipping notification');
        return;
    }

    const text = `
🚨 *Automation Error*

*Message:* ${message}

*Details:*
${Object.entries(metadata).map(([k, v]) => `• ${k}: ${v}`).join('\n')}

*Time:* ${new Date().toLocaleString('vi-VN')}
  `.trim();

    try {
        const response = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: text,
                    parse_mode: 'Markdown'
                })
            }
        );

        if (!response.ok) {
            logger.error('Failed to send Telegram notification', {
                status: response.status
            });
        }
    } catch (error) {
        logger.error('Error sending Telegram notification', {
            error: error.message
        });
    }
}

/**
 * Send success notification via Telegram
 */
async function sendSuccessNotification(message, metadata = {}) {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        return;
    }

    const text = `
✅ *Automation Success*

*Message:* ${message}

*Details:*
${Object.entries(metadata).map(([k, v]) => `• ${k}: ${v}`).join('\n')}

*Time:* ${new Date().toLocaleString('vi-VN')}
  `.trim();

    try {
        await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: text,
                    parse_mode: 'Markdown'
                })
            }
        );
    } catch (error) {
        logger.error('Error sending success notification', {
            error: error.message
        });
    }
}

module.exports = {
    sendTelegramNotification,
    sendSuccessNotification
};

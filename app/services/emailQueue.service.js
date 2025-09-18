const mailService = require("./mail.services");

/**
 * Rate-limited email queue for Resend API
 * Handles Resend's 2 requests/second rate limit
 */
class EmailQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.lastEmailTime = 0;
    this.minInterval = 500; // 500ms between emails (2 per second)
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second
    this.stats = {
      sent: 0,
      failed: 0,
      retried: 0,
    };
  }

  /**
   * Add email to queue
   * @param {Object} emailData - Email data object
   * @param {string} emailData.to - Recipient email
   * @param {string} emailData.subject - Email subject
   * @param {string} emailData.template - Email template name
   * @param {Object} emailData.data - Template data
   * @param {number} emailData.retryCount - Current retry count (internal)
   */
  add(emailData) {
    const emailWithRetry = {
      ...emailData,
      retryCount: emailData.retryCount || 0,
      id: emailData.id || this.generateId(),
      timestamp: Date.now(),
    };

    this.queue.push(emailWithRetry);
    console.log(
      `Email queued: ${emailWithRetry.to} (Queue size: ${this.queue.length})`
    );
    this.process();
  }

  /**
   * Process email queue with rate limiting
   */
  async process() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    console.log(`Processing email queue (${this.queue.length} emails)`);

    while (this.queue.length > 0) {
      const emailData = this.queue.shift();

      try {
        // Ensure minimum interval between emails
        const now = Date.now();
        const timeSinceLastEmail = now - this.lastEmailTime;

        if (timeSinceLastEmail < this.minInterval) {
          const delay = this.minInterval - timeSinceLastEmail;
          console.log(`Rate limiting: waiting ${delay}ms before next email`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }

        // Send email
        await mailService.sendMail(
          emailData.to,
          emailData.subject,
          emailData.template,
          emailData.data
        );

        this.lastEmailTime = Date.now();
        this.stats.sent++;
        console.log(
          `✅ Email sent successfully to ${emailData.to} (${this.stats.sent} total sent)`
        );
      } catch (error) {
        console.error(`❌ Email failed for ${emailData.to}:`, error.message);
        this.stats.failed++;

        // Retry logic for rate limit errors
        if (this.shouldRetry(error, emailData.retryCount)) {
          emailData.retryCount++;
          this.stats.retried++;

          console.log(
            `🔄 Retrying email for ${emailData.to} (attempt ${emailData.retryCount}/${this.maxRetries})`
          );

          // Add back to queue with delay
          setTimeout(() => {
            this.queue.unshift(emailData); // Add back to front of queue
            this.process();
          }, this.retryDelay);
        } else {
          console.error(
            `💀 Email permanently failed for ${emailData.to} after ${emailData.retryCount} retries`
          );
        }
      }
    }

    this.processing = false;
    console.log(
      `Email queue processing complete. Stats: ${JSON.stringify(this.stats)}`
    );
  }

  /**
   * Check if email should be retried
   * @param {Error} error - The error that occurred
   * @param {number} retryCount - Current retry count
   * @returns {boolean} - Whether to retry
   */
  shouldRetry(error, retryCount) {
    if (retryCount >= this.maxRetries) return false;

    // Retry on rate limit errors
    if (
      error.message?.toLowerCase().includes("rate limit") ||
      error.status === 429 ||
      error.message?.toLowerCase().includes("too many requests")
    ) {
      return true;
    }

    // Retry on temporary network errors
    if (
      error.code === "ECONNRESET" ||
      error.code === "ETIMEDOUT" ||
      error.message?.toLowerCase().includes("timeout")
    ) {
      return true;
    }

    return false;
  }

  /**
   * Generate unique ID for email tracking
   * @returns {string} - Unique ID
   */
  generateId() {
    return `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get queue statistics
   * @returns {Object} - Queue statistics
   */
  getStats() {
    return {
      ...this.stats,
      queueSize: this.queue.length,
      isProcessing: this.processing,
    };
  }

  /**
   * Clear queue (emergency use)
   */
  clear() {
    this.queue = [];
    console.log("Email queue cleared");
  }
}

// Export singleton instance
module.exports = new EmailQueue();

const emailQueue = require("../services/emailQueue.service");

/**
 * Get email queue statistics
 * Useful for monitoring email sending status
 */
const getEmailQueueStats = async (req, res) => {
  try {
    const stats = emailQueue.getStats();
    res.jsonSuccess(200, "Email queue statistics retrieved", stats);
  } catch (error) {
    res.jsonFailed(500, "Failed to get email queue statistics", error);
  }
};

/**
 * Clear email queue (emergency use)
 * Only for admin users
 */
const clearEmailQueue = async (req, res) => {
  try {
    emailQueue.clear();
    res.jsonSuccess(200, "Email queue cleared successfully");
  } catch (error) {
    res.jsonFailed(500, "Failed to clear email queue", error);
  }
};

module.exports = {
  getEmailQueueStats,
  clearEmailQueue,
};

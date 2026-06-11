/**
 * Cycle Helpers - Enterprise Billing Feature
 *
 * Provides flexible billing cycle functionality with:
 * - Custom start dates per workspace
 * - Configurable cycle durations (1, 2, 3, 4, 6, 12 months)
 * - Guaranteed return to original start date after 12 months
 * - Upgrade support (start date reset)
 */

const { countMessagesInDateRange, countMessagesForCurrentMonth } = require("./index");

/**
 * Adds months to a date with correct clamping.
 * Guarantees: After 12 months, always returns to original day.
 *
 * @param {Date} date - Starting date
 * @param {number} months - Number of months to add (1, 2, 3, 4, 6, 12)
 * @returns {Date} - New date
 *
 * Examples:
 *   31.01 + 1 month = 28.02 (Feb has 28 days)
 *   31.01 + 2 months = 31.03 (Mar has 31)
 *   31.01 + 12 months = 31.01 (Exact!)
 */
function addMonths(date, months) {
  const inputDate = date instanceof Date ? date : new Date(date);
  const originalDay = inputDate.getDate();
  const result = new Date(inputDate);
  result.setMonth(result.getMonth() + months);

  // If day overflowed (e.g., 31 → 3), correct to last day of target month
  if (result.getDate() !== originalDay) {
    result.setDate(0); // Last day of previous month
  }

  return result;
}

/**
 * Calculates all cycle information for a workspace.
 *
 * @param {Object} workspace - Workspace with cycleStartDate, cycleDurationMonths, messagesLimit
 * @param {Date|null} simulateDate - Optional: Simulated "today" for testing
 * @returns {Object} - Cycle information
 */
function getCycleInfo(workspace, simulateDate = null) {
  const now = simulateDate ? new Date(simulateDate) : new Date();
  const startDate = new Date(workspace.cycleStartDate);
  const durationMonths = workspace.cycleDurationMonths || 1;

  // Find current cycle
  let cycleStart = new Date(startDate);
  let cycleNumber = 1;

  // Iterate through cycles until we find the current one
  while (addMonths(cycleStart, durationMonths) <= now) {
    cycleStart = addMonths(cycleStart, durationMonths);
    cycleNumber++;
  }

  // Calculate cycle end (last day of cycle)
  const nextReset = addMonths(cycleStart, durationMonths);
  const cycleEnd = new Date(nextReset);
  cycleEnd.setDate(cycleEnd.getDate() - 1);

  // Calculate days remaining
  const daysRemaining = Math.ceil((nextReset - now) / (1000 * 60 * 60 * 24));

  return {
    cycleStartDate: workspace.cycleStartDate,
    cycleDurationMonths: durationMonths,
    currentCycleStart: cycleStart,
    currentCycleEnd: cycleEnd,
    nextReset: nextReset,
    daysRemaining: daysRemaining,
    cycleNumber: cycleNumber,
    originalDay: startDate.getDate(),
    messagesLimit: workspace.messagesLimit
  };
}

/**
 * Gets cycle info with message count for API responses.
 *
 * @param {Object} workspace - Workspace object
 * @param {Date|null} simulateDate - Optional: Simulated date for testing
 * @returns {Promise<Object>} - Cycle info with message count
 */
async function getCycleInfoWithMessageCount(workspace, simulateDate = null) {
  const cycleInfo = getCycleInfo(workspace, simulateDate);
  const countBreakdown = await countMessagesForCurrentCycle(workspace, simulateDate);
  const messageCount = countBreakdown.total;

  return {
    ...cycleInfo,
    messageCount,
    adjustmentsTotal: countBreakdown.adjustmentsTotal,
    messagesRemaining: workspace.messagesLimit
      ? Math.max(0, workspace.messagesLimit - messageCount)
      : null,
    contingent: `${messageCount}/${workspace.messagesLimit ?? 'Unlimited'}`
  };
}

/**
 * Counts messages in the current cycle (replaces countMessagesForCurrentMonth for cycle-enabled workspaces).
 * Includes manual quota adjustments (see countMessagesInDateRange).
 *
 * @param {Object} workspace - Workspace object
 * @param {Date|null} simulateDate - Optional: Simulated date for testing
 * @returns {Promise<import("./index").MessageCountBreakdown>} - Message count breakdown
 */
async function countMessagesForCurrentCycle(workspace, simulateDate = null) {
  // Fallback to monthly if no cycle fields set
  if (!workspace.cycleStartDate) {
    return await countMessagesForCurrentMonth(workspace);
  }

  const cycleInfo = getCycleInfo(workspace, simulateDate);
  return await countMessagesInDateRange(
    workspace,
    cycleInfo.currentCycleStart,
    cycleInfo.currentCycleEnd
  );
}

/**
 * Checks if a workspace has reached its message limit for the current cycle.
 *
 * @param {Object} workspace - Workspace object
 * @param {Date|null} simulateDate - Optional: Simulated date for testing
 * @returns {Promise<boolean>} - True if limit reached
 */
async function isCycleLimitReached(workspace, simulateDate = null) {
  if (!workspace.messagesLimit) {
    return false; // No limit set
  }

  const { total } = await countMessagesForCurrentCycle(workspace, simulateDate);
  return total >= workspace.messagesLimit;
}

/**
 * Formats the next reset date for display.
 *
 * @param {Object} workspace - Workspace object
 * @param {string} locale - Locale for formatting (default: 'de-DE')
 * @param {Date|null} simulateDate - Optional: Simulated date for testing
 * @returns {string} - Formatted date string
 */
function formatNextResetDate(workspace, locale = 'de-DE', simulateDate = null) {
  if (!workspace.cycleStartDate) {
    // Fallback: Next month start
    const now = simulateDate ? new Date(simulateDate) : new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  const cycleInfo = getCycleInfo(workspace, simulateDate);
  return cycleInfo.nextReset.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Validates cycle duration is a divisor of 12 (guarantees yearly consistency).
 *
 * @param {number} months - Proposed cycle duration
 * @returns {boolean} - True if valid
 */
function isValidCycleDuration(months) {
  const validDurations = [1, 2, 3, 4, 6, 12];
  return validDurations.includes(months);
}

/**
 * Gets available cycle duration options for UI.
 *
 * @returns {Array<Object>} - Array of {value, label} objects
 */
function getCycleDurationOptions() {
  return [
    { value: 1, label: '1 Monat' },
    { value: 2, label: '2 Monate' },
    { value: 3, label: '3 Monate (Quartal)' },
    { value: 4, label: '4 Monate' },
    { value: 6, label: '6 Monate (Halbjahr)' },
    { value: 12, label: '12 Monate (Jahr)' }
  ];
}

module.exports = {
  addMonths,
  getCycleInfo,
  getCycleInfoWithMessageCount,
  countMessagesForCurrentCycle,
  isCycleLimitReached,
  formatNextResetDate,
  isValidCycleDuration,
  getCycleDurationOptions
};

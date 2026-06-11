const prisma = require("../utils/prisma");

/**
 * @typedef {Object} WorkspaceMessageAdjustment
 * @property {number} id
 * @property {number} workspaceId
 * @property {number} amount - >0 consumes quota (deduction), <0 credits quota back
 * @property {string|null} reason
 * @property {Date} createdAt
 */

// Enterprise Billing: manual bookings against a workspace's message contingent.
// Adjustments are counted inside the billing window (cycle or calendar month)
// alongside real chats, so they expire automatically on cycle reset.
const WorkspaceMessageAdjustments = {
  // Hard sanity cap to protect against fat-finger bookings via API.
  MAX_ABS_AMOUNT: 1_000_000,
  MAX_REASON_LENGTH: 500,

  /**
   * Creates a new quota adjustment booking.
   * @param {Object} params
   * @param {number} params.workspaceId
   * @param {number} params.amount - Integer != 0; positive = deduct, negative = credit
   * @param {string|null} [params.reason] - Optional audit note (max 500 chars)
   * @returns {Promise<{adjustment: WorkspaceMessageAdjustment|null, message: string|null}>}
   */
  new: async function ({ workspaceId, amount, reason = null }) {
    try {
      if (!Number.isInteger(amount) || amount === 0)
        return {
          adjustment: null,
          message: "amount must be a non-zero integer.",
        };
      if (Math.abs(amount) > this.MAX_ABS_AMOUNT)
        return {
          adjustment: null,
          message: `amount must be between -${this.MAX_ABS_AMOUNT} and ${this.MAX_ABS_AMOUNT}.`,
        };
      if (reason !== null && typeof reason !== "string")
        return { adjustment: null, message: "reason must be a string." };
      if (reason && reason.length > this.MAX_REASON_LENGTH)
        return {
          adjustment: null,
          message: `reason must be at most ${this.MAX_REASON_LENGTH} characters.`,
        };

      const adjustment = await prisma.workspace_message_adjustments.create({
        data: {
          workspaceId: Number(workspaceId),
          amount,
          reason: reason || null,
        },
      });
      return { adjustment, message: null };
    } catch (error) {
      console.error(error.message);
      return { adjustment: null, message: error.message };
    }
  },

  /**
   * Sums adjustment amounts for a workspace within a date range.
   * Returns 0 on any failure — billing counting must never break chats,
   * even if the table is missing (degrades to plain chat counting).
   * @param {number} workspaceId
   * @param {Date} startDate - inclusive
   * @param {Date} endDate - inclusive
   * @returns {Promise<number>}
   */
  sumForWorkspaceInDateRange: async function (workspaceId, startDate, endDate) {
    return await this.sumAmount({
      workspaceId: Number(workspaceId),
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    });
  },

  /**
   * Lists adjustments, newest first.
   * @param {Object} clause - Prisma where clause
   * @param {number|null} [limit]
   * @param {number|null} [offset]
   * @returns {Promise<WorkspaceMessageAdjustment[]>}
   */
  where: async function (clause = {}, limit = null, offset = null) {
    try {
      const adjustments = await prisma.workspace_message_adjustments.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(offset !== null ? { skip: offset } : {}),
        orderBy: { createdAt: "desc" },
      });
      return adjustments;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  count: async function (clause = {}) {
    try {
      return await prisma.workspace_message_adjustments.count({
        where: clause,
      });
    } catch (error) {
      console.error(error.message);
      return 0;
    }
  },

  /**
   * Sums adjustment amounts matching a clause. Returns 0 on failure.
   * @param {Object} clause - Prisma where clause
   * @returns {Promise<number>}
   */
  sumAmount: async function (clause = {}) {
    try {
      const result = await prisma.workspace_message_adjustments.aggregate({
        _sum: { amount: true },
        where: clause,
      });
      return result?._sum?.amount ?? 0;
    } catch (error) {
      console.error(error.message);
      return 0;
    }
  },
};

module.exports = { WorkspaceMessageAdjustments };

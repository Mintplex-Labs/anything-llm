const crypto = require("crypto");
const {
  ExternalCommunicationConnector,
} = require("../../../models/externalCommunicationConnector");
const { markdownToTelegram } = require("./format");

/**
 * The maximum number of pending pairings to allow.
 * This is to prevent abuse and ensure the bot is not responding to too many requests.
 * @type {number}
 */
const MAX_PENDING_PAIRINGS = 10;

/**
 * Generate a random 6-digit pairing code.
 * @returns {string}
 */
function generatePairingCode() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, "0");
}

/**
 * Enforce the max pending pairings cap using LIFO (evict oldest first).
 * @param {Map} pendingPairings
 */
function enforcePendingCap(pendingPairings) {
  if (pendingPairings.size < MAX_PENDING_PAIRINGS) return;

  // Sort by requestedAt ascending (oldest first) and remove excess
  const entries = [...pendingPairings.entries()].sort(
    (a, b) => new Date(a[1].requestedAt) - new Date(b[1].requestedAt)
  );

  const toRemove = entries.length - MAX_PENDING_PAIRINGS + 1;
  for (let i = 0; i < toRemove; i++) {
    pendingPairings.delete(entries[i][0]);
  }
}

/**
 * Check if a chat ID is in the approved users list.
 * Handles both legacy string format and new object format.
 * @param {Array} approvedUsers
 * @param {number|string} chatId
 * @returns {boolean}
 */
function isVerified(approvedUsers, chatId) {
  return (approvedUsers || []).some(
    (u) => (typeof u === "string" ? u : u.chatId) === String(chatId)
  );
}

/**
 * Send a pairing request message to an unverified user.
 * @param {TelegramBot} bot
 * @param {object} msg - Telegram message object
 * @param {Map} pendingPairings
 */
async function sendPairingRequest(bot, msg, pendingPairings) {
  const chatId = msg.chat.id;
  const firstName = msg.from?.first_name || "Unknown";
  const username = msg.from?.username || null;

  // Reuse existing code if the user already has a pending request
  const existing = pendingPairings.get(chatId);
  const code = existing?.code || generatePairingCode();

  // Enforce cap before adding new entries (not for existing users)
  if (!existing) enforcePendingCap(pendingPairings);

  pendingPairings.set(chatId, {
    code,
    telegramUsername: username,
    firstName,
    requestedAt: existing?.requestedAt || new Date().toISOString(),
  });

  const formattedMessage = markdownToTelegram(
    `You need to be **approved** before using this bot.

Your pairing code is: <code>${code}</code>

In AnythingLLM, go to Settings → Connections → Telegram and approve your request.

Make sure the pairing code shown here matches what is displayed in the settings page.

This ensures no one else is trying to connect on your behalf.`,
    { escapeHtml: false }
  );

  await bot.sendMessage(chatId, formattedMessage, { parse_mode: "HTML" });
}

/**
 * Approve a pending user by their chat ID.
 * @param {TelegramBot|null} bot
 * @param {string|number} chatId
 * @param {object} config - Current connector config (mutated in place)
 * @param {Map} pendingPairings
 */
async function approveUser(bot, chatId, config, pendingPairings) {
  const approved = config.approved_users || [];
  const alreadyApproved = isVerified(approved, chatId);

  if (!alreadyApproved) {
    const pending = pendingPairings.get(Number(chatId));
    approved.push({
      chatId: String(chatId),
      username: pending?.telegramUsername || null,
      firstName: pending?.firstName || null,
    });
    config.approved_users = approved;
    await ExternalCommunicationConnector.updateConfig("telegram", {
      approved_users: approved,
    });
  }
  pendingPairings.delete(Number(chatId));

  if (bot) {
    try {
      await bot.sendMessage(
        chatId,
        "You've been approved! Send a message to start chatting."
      );
    } catch {
      // User may have blocked bot
    }
  }
}

/**
 * Deny a pending user by their chat ID.
 * @param {TelegramBot|null} bot
 * @param {string|number} chatId
 * @param {Map} pendingPairings
 */
async function denyUser(bot, chatId, pendingPairings) {
  pendingPairings.delete(Number(chatId));

  if (bot) {
    try {
      await bot.sendMessage(chatId, "Your access request was denied.");
    } catch {
      // User may have blocked bot
    }
  }
}

/**
 * Revoke an already-approved user.
 * @param {string|number} chatId
 * @param {object} config - Current connector config (mutated in place)
 */
async function revokeUser(chatId, config) {
  const approved = (config.approved_users || []).filter(
    (u) => (typeof u === "string" ? u : u.chatId) !== String(chatId)
  );
  config.approved_users = approved;
  await ExternalCommunicationConnector.updateConfig("telegram", {
    approved_users: approved,
  });
}

module.exports = {
  MAX_PENDING_PAIRINGS,
  isVerified,
  sendPairingRequest,
  approveUser,
  denyUser,
  revokeUser,
};

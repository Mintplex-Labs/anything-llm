/**
 * Handle tool approval callback from an inline keyboard button.
 * This handler requires access to the pending tool approvals map from TelegramBotService.
 *
 * @param {object} params
 * @param {import("../../commands/index").BotContext} params.ctx
 * @param {number} params.chatId
 * @param {{id: string}} params.query
 * @param {string} params.data
 * @param {Map} params.pendingToolApprovals - Map of pending tool approval requests
 * @param {Function} [params.log] - Logging function (falls back to ctx.log)
 */
async function handleToolApproval({
  ctx,
  chatId,
  query,
  data,
  pendingToolApprovals,
  log,
} = {}) {
  const _log = log || ctx.log;
  _log(`Tool approval callback received: ${data}`);

  try {
    const parts = data.split(":");
    if (parts.length !== 3) {
      _log(`Invalid callback data format: ${data}`);
      await ctx.bot.answerCallbackQuery(query.id, {
        text: "Invalid request format.",
      });
      return;
    }

    const action = parts[1]; // "approve" or "deny"
    const requestId = parts[2];

    const pending = pendingToolApprovals.get(requestId);
    if (!pending) {
      _log(`No pending approval found for requestId: ${requestId}`);
      await ctx.bot.answerCallbackQuery(query.id, {
        text: "This approval request has expired.",
      });
      return;
    }

    const { worker, messageId, skillName } = pending;
    const approved = action === "approve";

    _log(`Processing ${approved ? "approval" : "denial"} for ${skillName}`);

    // Send response back to worker (Bree workers use send(), raw worker_threads use postMessage())
    try {
      const response = {
        type: "toolApprovalResponse",
        requestId,
        approved,
      };

      if (worker && typeof worker.send === "function") {
        worker.send(response);
        _log(
          `Sent tool approval response to worker via send(): ${approved ? "approved" : "denied"}`
        );
      } else if (worker && typeof worker.postMessage === "function") {
        worker.postMessage(response);
        _log(
          `Sent tool approval response to worker via postMessage(): ${approved ? "approved" : "denied"}`
        );
      } else {
        _log(
          `Worker not available to send approval response (send: ${typeof worker?.send}, postMessage: ${typeof worker?.postMessage})`
        );
      }
    } catch (err) {
      _log(`Failed to send approval response: ${err.message}`);
    }

    pendingToolApprovals.delete(requestId);

    // Update the message to show the result
    const resultText = approved
      ? `✅ <b>${skillName}</b> was approved.`
      : `❌ <b>${skillName}</b> was denied.`;

    await ctx.bot
      .editMessageText(resultText, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: "HTML",
      })
      .catch((err) => _log(`Failed to edit message: ${err.message}`));

    await ctx.bot.answerCallbackQuery(query.id, {
      text: approved ? "Approved!" : "Denied.",
    });
  } catch (error) {
    _log(`Error handling tool approval callback: ${error.message}`);
    await ctx.bot.answerCallbackQuery(query.id, {
      text: "Something went wrong.",
    });
  }
}

module.exports = { handleToolApproval };

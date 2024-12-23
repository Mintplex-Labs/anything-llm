/**
 * A simple middleware that validates that the chat history is viewable.
 * via the `DISABLE_VIEW_CHAT_HISTORY` environment variable being set AT ALL.
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 * @param {NextFunction} next - The next function.
 */
function chatHistoryViewable(_request, response, next) {
  if ("DISABLE_VIEW_CHAT_HISTORY" in process.env)
    return response
      .status(422)
      .send("This feature has been disabled by the administrator.");
  next();
}

module.exports = {
  chatHistoryViewable,
};

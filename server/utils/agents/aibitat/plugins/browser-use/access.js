/**
 * Who may see what of Browser Use (enforced in endpoints/browserUse.js):
 *   - a session's trace: the user who ran it, and admins unless DISABLE_VIEW_CHAT_HISTORY is set
 *   - every session's history, clearing it, and the saved profiles: admins only
 * Managers get nothing beyond what a default user gets. In single-user mode there is one person,
 * so everything is theirs.
 */
const BrowserUseAccess = {
  /** DISABLE_VIEW_CHAT_HISTORY hides chat history from admins - other people's browser sessions too. */
  get historyHidden() {
    return "DISABLE_VIEW_CHAT_HISTORY" in process.env;
  },

  /**
   * @param {{userId?: number|null}|null} trace
   * @param {{id: number, role: string}|null} user - the signed-in user (null in single-user mode)
   * @param {boolean} multiUserMode
   * @returns {boolean}
   */
  canReadTrace(trace, user, multiUserMode) {
    if (!trace) return false;
    if (!multiUserMode) return true;
    if (!user) return false;
    if ((trace.userId ?? null) === user.id) return true;
    return user.role === "admin" && !BrowserUseAccess.historyHidden;
  },
};

module.exports = { BrowserUseAccess };

function userScopedChatClause(clause = {}, user = null) {
  return {
    ...clause,
    user_id: user?.id ?? null,
  };
}

module.exports = { userScopedChatClause };

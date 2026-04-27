const {
  userScopedChatClause,
} = require("../../../../utils/helpers/chat/userScopedChatClause");

describe("userScopedChatClause", () => {
  it("uses the signed-in user id when present", () => {
    expect(userScopedChatClause({ workspaceId: 1 }, { id: 7 })).toEqual({
      workspaceId: 1,
      user_id: 7,
    });
  });

  it("keeps chat lookups scoped to null-user chats when the session has no user", () => {
    expect(userScopedChatClause({ workspaceId: 1 }, null)).toEqual({
      workspaceId: 1,
      user_id: null,
    });
  });

  it("does not allow undefined to override the chat ownership filter", () => {
    expect(userScopedChatClause({ workspaceId: 1 }, {})).toEqual({
      workspaceId: 1,
      user_id: null,
    });
  });

  it("preserves thread filters while normalizing missing users to null", () => {
    expect(
      userScopedChatClause({ workspaceId: 1, thread_id: 3 }, undefined)
    ).toEqual({
      workspaceId: 1,
      thread_id: 3,
      user_id: null,
    });
  });

  it("preserves fork filters while normalizing missing users to null", () => {
    expect(
      userScopedChatClause(
        { workspaceId: 1, include: true, api_session_id: null },
        null
      )
    ).toEqual({
      workspaceId: 1,
      include: true,
      api_session_id: null,
      user_id: null,
    });
  });
});

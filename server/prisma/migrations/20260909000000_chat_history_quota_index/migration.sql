-- Keep partitioned history in chat-ID order and cover the per-user quota count.
CREATE INDEX "workspace_chats_user_history_quota_idx" ON "workspace_chats"("user_id", "workspaceId", "thread_id", "api_session_id", "include", "id", "createdAt");

-- Truncate tables and reset ID sequences
TRUNCATE TABLE
  api_keys,
  system_settings,
  cache_data,
  event_logs,
  document_vectors,
  welcome_messages
RESTART IDENTITY CASCADE;

-- Truncate tables with dependencies and reset ID sequences
TRUNCATE TABLE
  recovery_codes,
  password_reset_tokens
RESTART IDENTITY CASCADE;

-- Truncate tables with more complex dependencies and reset ID sequences
TRUNCATE TABLE
  workspace_suggested_messages,
  workspace_chats,
  workspace_threads
RESTART IDENTITY CASCADE;

-- Finally, truncate tables with the most dependencies and reset ID sequences
TRUNCATE TABLE
  document_sync_executions,
  document_sync_queues,
  workspace_documents,
  workspace_agent_invocations,
  workspace_users,
  workspaces,
  embed_chats,
  embed_configs,
  slash_command_presets
RESTART IDENTITY CASCADE;

-- Truncate the last remaining table and reset ID sequence
TRUNCATE TABLE users RESTART IDENTITY CASCADE;
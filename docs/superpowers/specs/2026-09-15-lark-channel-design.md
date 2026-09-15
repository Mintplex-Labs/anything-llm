# Lark and Feishu Channel Design

Date: 2026-09-15
Status: Approved design, pending implementation plan

## Summary

Add a first-class Lark/Feishu messaging channel to AnythingLLM. The channel will connect from the existing Node server through the official `@larksuiteoapi/node-sdk` high-level Channel API using a WebSocket long connection. It will support direct messages and group messages that explicitly mention the bot, administrator-approved user pairing, per-user workspace and thread selection, streaming replies, images, and common document attachments.

The implementation will also introduce a small platform-neutral chat orchestration boundary shared by Telegram and Lark. Platform adapters will remain responsible for authentication, event normalization, formatting, and transport. This keeps future Slack, Discord, and Teams integrations from duplicating the AnythingLLM chat and workspace-routing logic.

## Goals

- Support both international Lark and China-region Feishu self-built applications.
- Work with a local Docker deployment without a public webhook URL.
- Receive direct messages and group messages that mention the bot.
- Require administrator approval before a Lark/Feishu user can access AnythingLLM.
- Preserve a separate active workspace and thread for each approved user.
- Support text, image, and common document messages.
- Stream model responses when supported and fall back to chunked text.
- Recover the connection and approved-user state after a server restart.
- Establish a reusable core for future external messaging channels.

## Non-goals

- Webhook transport in the first release.
- Handling group messages that do not mention the bot.
- Voice transcription or synthesized voice replies.
- Lark marketplace/ISV applications and multi-tenant installation.
- Full parity with every Telegram-only command or presentation detail.
- Changing AnythingLLM's database schema for connector-specific fields.

## Chosen Approach

Use `@larksuiteoapi/node-sdk` and its `createLarkChannel` API. The official Channel abstraction already provides WebSocket lifecycle management, automatic reconnects, inbound message normalization, mention policy, safety controls, outbound streaming, media handling, and Lark/Feishu domain selection.

Alternatives considered:

1. `WSClient` plus `EventDispatcher`: offers lower-level control but requires local implementations of normalization, message safety, media handling, retries, and streaming.
2. Webhook events: simpler process lifecycle but requires a public HTTPS endpoint, which conflicts with the local Docker deployment.

Webhook transport remains a future extension behind the same service interface.

## Architecture

### Lark platform adapter

Create `server/utils/larkChannel/` with a singleton `LarkChannelService` and focused helpers for configuration, message normalization, pairing, commands, formatting, and attachments.

`LarkChannelService` will:

- Construct the official Channel with the selected `domain` (`Lark` or `Feishu`).
- Use WebSocket transport and wait for a successful connection handshake.
- Register normalized message, reconnect, reconnected, and error handlers.
- Ignore bot-authored events and deduplicate by message ID.
- Enforce direct-message and group-mention policy.
- Convert inbound Lark events into the shared channel message contract.
- Convert shared reply events into Lark cards, text messages, and attachments.
- Stop cleanly on disconnect or server shutdown.
- Restore an active connector from persisted configuration during server boot.

### Shared external-channel chat handler

Create a platform-neutral `server/utils/externalChannels/` layer. It will own behavior that is independent of Telegram, Lark, or future transports:

- Approved-user lookup and active user state.
- Workspace and thread resolution.
- Chat and agent invocation.
- Per-conversation serialization and cancellation.
- Commands for workspace/thread selection, new thread, reset, status, and help.
- Normalized attachment handoff to existing AnythingLLM ingestion helpers.
- Stable error categories returned to platform adapters.

Telegram will be migrated incrementally to the shared boundary only where its behavior can be preserved. The Lark work must not regress existing Telegram behavior.

### Management API

Add `server/endpoints/lark.js`, registered by `server/index.js`, with single-user/admin-protected endpoints patterned after Telegram:

- `GET /lark/config`
- `POST /lark/connect`
- `POST /lark/disconnect`
- `GET /lark/status`
- `GET /lark/pending-users`
- `GET /lark/approved-users`
- `POST /lark/approve-user`
- `POST /lark/deny-user`
- `POST /lark/revoke-user`
- `POST /lark/update-config`

`connect` validates required fields, creates the SDK Channel, completes the WebSocket handshake, resolves the bot identity, and only then persists an active configuration. API responses never return the plaintext app secret.

### Frontend

Add a Lark/Feishu settings page under `frontend/src/pages/GeneralSettings/Connections/Lark/`, a client model under `frontend/src/models/lark.js`, a route at `/settings/external-connections/lark`, a Channels sidebar entry, a path helper, and localized strings.

The page will provide:

- Platform selector: Lark or Feishu.
- App ID and App Secret fields.
- Default workspace selector.
- Connect, reconnect, and disconnect actions.
- Connected bot identity and selected platform.
- Connection state: connected, reconnecting, or failed, including the latest safe error summary.
- Pending and approved user lists with approve, deny, and revoke controls.
- Attachment size limit using the current AnythingLLM limit as its default.

## Persistence and Secrets

Extend `ExternalCommunicationConnector.supportedTypes` to include `lark`. Store connector-specific state in the existing JSON `config` column, avoiding a schema migration.

The stored configuration will contain:

```json
{
  "platform": "lark|feishu",
  "app_id": "cli_...",
  "app_secret": "enc:...",
  "bot_name": "AnythingLLM",
  "bot_open_id": "ou_...",
  "default_workspace": "workspace-slug",
  "approved_users": [
    {
      "open_id": "ou_...",
      "name": "Display name",
      "active_workspace": "workspace-slug",
      "active_thread": "thread-slug-or-null"
    }
  ],
  "attachment_size_limit": null,
  "active": true
}
```

`attachment_size_limit: null` means inherit AnythingLLM's existing upload limit. Pending pairing requests remain in memory and expire. Approved users and their routing state persist. Extract Telegram's existing `EncryptionManager` wrapper into a shared external-channel credential helper while preserving compatibility with existing `enc:` Telegram values.

The App Secret is accepted only on connect/reconnect and is always masked in reads. Logs must not contain the secret, file contents, complete user messages, or raw API responses that may include credentials.

## Message and Pairing Flow

### Inbound policy

1. The SDK receives and normalizes an `im.message.receive_v1` event.
2. The adapter rejects stale, duplicate, or bot-authored messages.
3. Direct messages continue. Group messages continue only when the bot is explicitly mentioned; mention placeholders are removed from the prompt.
4. The adapter identifies the user by immutable `open_id`, not display name.
5. Unapproved direct-message users receive a short-lived pairing code and cannot invoke a workspace. In a group, an unapproved user is told to open a direct chat with the bot; pairing codes are never posted into the group.
6. Approved users are routed to their saved workspace/thread or to the configured default workspace.
7. The shared handler processes a command or invokes AnythingLLM chat/agent behavior.
8. The adapter replies to the original message. In groups this keeps the response associated with the triggering message.

### Approval

Pending requests show platform, display name, open ID suffix, pairing code, and expiry in the settings page. An administrator compares the displayed code with the code shown to the user, then approves or rejects the request. Revocation removes the user from persisted configuration and invalidates their active state immediately.

### Commands

The first release supports:

- `/workspace` to list or select an accessible workspace.
- `/thread` to list or select a thread in the active workspace.
- `/new` to create and select a new thread.
- `/reset` to reset the active conversation.
- `/status` to show the active workspace, thread, and model.
- `/help` to show available commands.

Interactive cards may enhance selection where supported, but every operation must retain a text-command fallback.

## Responses and Formatting

Prefer the SDK's streaming reply capability. Stream throttling will avoid excessive card updates. If streaming cards fail or the tenant lacks required card permissions, the adapter will send bounded text chunks instead.

Markdown is converted into Lark-compatible rich text with safe escaping. Unsupported constructs degrade to readable plain text. Group responses reply to the source message and do not create unsolicited top-level chatter.

The channel exposes cancellation to the shared handler. If an invocation is cancelled or superseded, any live streaming card is finalized with a concise status.

## Images and Documents

Supported inbound media for the first release:

- Images supported by the existing chat attachment flow.
- PDF, plain text, Markdown, Word, and other document types already accepted by AnythingLLM's collector.

The adapter downloads media through the official SDK, validates declared and detected type, applies the configured size limit, writes to a scoped temporary directory, and hands a normalized attachment to existing ingestion utilities. Temporary files are removed on success, failure, cancellation, and process cleanup.

Unsupported type, oversize file, download failure, and ingestion failure each produce a short user-facing error without exposing internal paths or stack traces. Voice and video messages are explicitly rejected with a supported-types hint in the first release.

## Reliability and Error Handling

- The SDK owns WebSocket reconnect behavior and emits state changes consumed by `LarkChannelService`.
- Startup failures are isolated so AnythingLLM can boot even if the channel cannot connect.
- Invalid credentials or permission errors stop repeated connection attempts and mark the connector failed.
- Transient network failures remain eligible for SDK reconnect behavior.
- Each chat is processed serially; different chats may run concurrently.
- Event deduplication prevents Lark retry delivery from generating duplicate model calls.
- Slow model work is detached from the event acknowledgement path.
- A failure in one message or attachment does not stop the channel.
- Status includes the last safe error category and timestamp for diagnosis.

## Required Lark/Feishu Application Capabilities

The setup UI and documentation will tell administrators to create a self-built application, enable bot capability, select long-connection event delivery, and subscribe to `im.message.receive_v1`.

The exact permission list will be derived from the APIs used during implementation and kept minimal. It will cover receiving direct and mentioned group messages, sending messages as the bot, reading required user identity fields, and downloading message resources. Optional card permissions will be documented separately from permissions required for the text fallback.

## Testing

### Unit tests

- Lark/Feishu domain selection.
- Direct-message and group-mention filtering.
- Mention removal and normalized prompt construction.
- Message ID deduplication and stale-event rejection.
- Pairing creation, expiry, approval, denial, and revocation.
- Per-user workspace/thread state.
- Command parsing and error responses.
- Markdown/rich-text conversion and chunking fallback.
- Attachment type, size, cleanup, and failure behavior.
- Secret encryption, masking, and backwards-compatible Telegram decryption.

### Service and endpoint tests

- Mock Channel connection, bot identity, message, reconnect, and disconnect events.
- Verify configuration is persisted only after a successful handshake.
- Verify boot restoration and non-fatal boot failure.
- Verify authentication and single-user/admin protection on every management endpoint.
- Verify API responses never expose the App Secret.
- Verify Telegram behavior remains unchanged after shared-helper extraction.

### Frontend tests

- Platform selection and required-field validation.
- Secret masking and reconnect behavior.
- Connection-state rendering.
- Pending/approved user actions.
- Error and loading states.

### Local integration verification

Build a local AnythingLLM Docker image and replace the current container while preserving `/Users/harry/Lab/anything-llm-data`. With user-supplied test application credentials, verify:

1. Lark direct-message pairing, approval, chat, and streaming reply.
2. Lark group mention response and non-mention ignore behavior.
3. Workspace/thread switching.
4. Image and document handling.
5. Restart restoration and automatic reconnect.
6. Repeat the relevant connection and message checks against Feishu.

Integration tests requiring real credentials remain manual and are not run until the user provides those credentials through the local settings UI.

## Deployment

Add the SDK dependency to `server/package.json` and update the lockfile. The Docker build must include it without a separate service or exposed port. After automated tests pass, build a local image from `/Users/harry/Lab/anything-llm`, stop the current `anythingllm` container, and start the new image with the existing data mount and port. Verify health, the new settings route, and existing data before declaring deployment complete.

## Future Extensions

- Optional webhook transport behind the service interface.
- Voice transcription and synthesized replies.
- Lark interactive-card actions for richer workspace/thread selection.
- Shared connector abstractions for Slack, Discord, Teams, and other channels.
- Database-backed pending approvals and distributed deduplication for multi-instance deployments.

## References

- Official Node SDK: https://github.com/larksuite/node-sdk
- Official Channel module: https://github.com/larksuite/node-sdk/blob/main/docs/channel.md
- Official Chinese Channel documentation: https://github.com/larksuite/node-sdk/blob/main/docs/channel.zh.md

# Lark and Feishu Channel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a first-class Lark/Feishu channel that connects over WebSocket, requires administrator-approved pairing, routes each approved user to an AnythingLLM workspace/thread, and handles text, image, and document messages.

**Architecture:** Wrap `@larksuiteoapi/node-sdk`'s high-level Channel API in a singleton platform adapter and move the reusable connector credentials, access state, and chat orchestration behind `server/utils/externalChannels/`. Preserve Telegram behavior through a transport adapter while adding Lark-specific configuration, endpoints, boot restoration, and a React settings page.

**Tech Stack:** Node.js 18+, CommonJS, Express, Prisma JSON connector config, Jest 29, React 18, Vite 4, Vitest 1, Testing Library, `@larksuiteoapi/node-sdk` 1.74.0, Docker.

**Spec:** `docs/superpowers/specs/2026-09-15-lark-channel-design.md`

## Global Constraints

- Support both `lark.Domain.Lark` and `lark.Domain.Feishu` through one implementation.
- Use WebSocket long connection only; do not expose a webhook route or new port.
- Accept direct messages and group messages that explicitly mention the bot; ignore other group messages.
- Require administrator approval before any workspace or thread data is available.
- Identify users by immutable Lark/Feishu `open_id`, never by display name.
- Never log or return plaintext `app_secret`, complete message bodies, file contents, or sensitive SDK responses.
- Preserve the existing Telegram channel's behavior and stored `enc:` bot tokens.
- Store Lark state in the existing `external_communication_connectors.config` JSON column; do not add a Prisma migration.
- Support text, image, PDF, plain text, Markdown, and Word-compatible documents; explicitly reject voice and video in the first release.
- Use AnythingLLM's upload limit when `attachment_size_limit` is `null`.
- Real Lark/Feishu credentials are entered only through the local settings UI and are not committed or printed.
- Pin Yarn Classic with `"packageManager": "yarn@1.22.22"` in the root `package.json`; run every Yarn command through Corepack.

---

## File Structure

### Shared server code

- `server/utils/externalChannels/credentials.js`: encrypt and decrypt connector secrets.
- `server/utils/externalChannels/access.js`: pending pairing lifecycle and approved-user persistence.
- `server/utils/externalChannels/state.js`: per-user workspace/thread state.
- `server/utils/externalChannels/messageQueue.js`: keyed serial execution and cancellation-safe cleanup.
- `server/utils/externalChannels/chat/index.js`: platform-neutral chat/agent entry point.
- `server/utils/externalChannels/chat/transport.js`: documented transport contract and validation.
- `server/jobs/handle-external-channel-chat.js`: background chat worker emitting normalized IPC events.

### Lark server code

- `server/utils/larkChannel/index.js`: singleton SDK lifecycle and message dispatch.
- `server/utils/larkChannel/config.js`: domain mapping and safe status serialization.
- `server/utils/larkChannel/transport.js`: Lark implementation of the shared reply transport.
- `server/utils/larkChannel/commands.js`: text command parsing and responses.
- `server/utils/larkChannel/attachments.js`: SDK resource download, validation, normalization, and cleanup.
- `server/endpoints/lark.js`: protected management API.

### Telegram compatibility code

- `server/utils/telegramBot/utils/index.js`: import shared credential helpers.
- `server/utils/telegramBot/chat/stream.js`: delegate platform-neutral chat work.
- `server/utils/telegramBot/chat/agent.js`: delegate platform-neutral agent work.
- `server/jobs/handle-telegram-chat.js`: wrap the shared job protocol.

### Frontend code

- `frontend/src/models/lark.js`: Lark management API client.
- `frontend/src/pages/GeneralSettings/Connections/Lark/index.jsx`: page state and layout.
- `frontend/src/pages/GeneralSettings/Connections/Lark/SetupView/index.jsx`: connect form.
- `frontend/src/pages/GeneralSettings/Connections/Lark/ConnectedView/index.jsx`: status, reconnect, and disconnect.
- `frontend/src/pages/GeneralSettings/Connections/Lark/UsersSection/index.jsx`: pending and approved users.
- `frontend/src/pages/GeneralSettings/Connections/Lark/components/PlatformSelector.jsx`: Lark/Feishu selector.
- `frontend/src/components/SettingsSidebar/index.jsx`: channel navigation entry.
- `frontend/src/utils/paths.js`: Lark settings route helper.
- `frontend/src/main.jsx`: lazy route.
- `frontend/src/locales/en/common.js`: English strings.
- `frontend/src/locales/zh/common.js`: Chinese strings.
- Other locale files are structurally normalized to `null` values by the repository script and fall back to English.

### Documentation

- `docs/channels/lark.md`: local setup guide for Lark and Feishu administrators.

---

### Task 1: Shared connector credentials and connector type

**Files:**
- Modify: `package.json`
- Create: `server/utils/externalChannels/credentials.js`
- Create: `server/__tests__/utils/externalChannels/credentials.test.js`
- Modify: `server/utils/telegramBot/utils/index.js`
- Modify: `server/models/externalCommunicationConnector.js`

**Interfaces:**
- Produces: `encryptConnectorSecret(secret: string): string|null`
- Produces: `decryptConnectorSecret(value: string): string|null`
- Produces: `ExternalCommunicationConnector.supportedTypes` containing `telegram` and `lark`
- Preserves: `encryptToken` and `decryptToken` Telegram exports as aliases

- [ ] **Step 1: Pin Yarn Classic and install existing dependencies**

Add `"packageManager": "yarn@1.22.22"` after the root `devDependencies` object, then run:

```bash
corepack yarn install --frozen-lockfile
cd server && corepack yarn install --frozen-lockfile
cd ../frontend && corepack yarn install --frozen-lockfile
```

Expected: all three installs exit zero without changing any lockfile.

- [ ] **Step 2: Write failing credential and connector-type tests**

```js
const {
  encryptConnectorSecret,
  decryptConnectorSecret,
} = require("../../../utils/externalChannels/credentials");
const {
  ExternalCommunicationConnector,
} = require("../../../models/externalCommunicationConnector");

describe("external channel credentials", () => {
  test("round-trips an encrypted secret", () => {
    const stored = encryptConnectorSecret("secret-value");
    expect(stored).toMatch(/^enc:/);
    expect(stored).not.toContain("secret-value");
    expect(decryptConnectorSecret(stored)).toBe("secret-value");
  });

  test("accepts legacy plaintext values", () => {
    expect(decryptConnectorSecret("legacy-token")).toBe("legacy-token");
  });

  test("supports Telegram and Lark connector records", () => {
    expect(ExternalCommunicationConnector.supportedTypes).toEqual(
      expect.arrayContaining(["telegram", "lark"])
    );
  });
});
```

- [ ] **Step 3: Run the test and confirm the missing module/export failure**

Run: `corepack yarn jest server/__tests__/utils/externalChannels/credentials.test.js --runInBand`

Expected: FAIL because `server/utils/externalChannels/credentials.js` and `supportedTypes` export do not exist.

- [ ] **Step 4: Add the shared implementation and Telegram aliases**

```js
const { EncryptionManager } = require("../EncryptionManager");
const ENCRYPTED_PREFIX = "enc:";

function encryptConnectorSecret(secret) {
  if (!secret) return null;
  const encrypted = new EncryptionManager().encrypt(secret);
  return encrypted ? `${ENCRYPTED_PREFIX}${encrypted}` : null;
}

function decryptConnectorSecret(value) {
  if (!value) return null;
  if (!value.startsWith(ENCRYPTED_PREFIX)) return value;
  return new EncryptionManager().decrypt(value.slice(ENCRYPTED_PREFIX.length));
}

module.exports = { encryptConnectorSecret, decryptConnectorSecret };
```

In `telegramBot/utils/index.js`, replace the local encryption functions with imports and export aliases:

```js
const {
  encryptConnectorSecret,
  decryptConnectorSecret,
} = require("../../externalChannels/credentials");

const encryptToken = encryptConnectorSecret;
const decryptToken = decryptConnectorSecret;
```

Expose `supportedTypes` on `ExternalCommunicationConnector` and set it to `Object.freeze(["telegram", "lark"])`.

- [ ] **Step 5: Run focused tests and Telegram format regression tests**

Run: `corepack yarn jest server/__tests__/utils/externalChannels/credentials.test.js server/__tests__/utils/telegramBot/format.test.js --runInBand`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add package.json server/utils/externalChannels/credentials.js server/__tests__/utils/externalChannels/credentials.test.js server/utils/telegramBot/utils/index.js server/models/externalCommunicationConnector.js
git commit -m "refactor: share external channel credentials"
```

### Task 2: Shared pairing and per-user state

**Files:**
- Create: `server/utils/externalChannels/access.js`
- Create: `server/utils/externalChannels/state.js`
- Create: `server/__tests__/utils/externalChannels/access.test.js`
- Create: `server/__tests__/utils/externalChannels/state.test.js`

**Interfaces:**
- Produces: `PairingAccess({ connectorType, pendingPairings, ttlMs, now })`
- Produces methods: `request(user)`, `listPending()`, `isApproved(config, userId)`, `approve(config, userId)`, `deny(userId)`, `revoke(config, userId)`
- Produces: `ChannelStateStore({ connectorType, config })`
- Produces methods: `get(userId)`, `set(userId, updates)`
- Approved user shape: `{ open_id, name, platform, active_workspace, active_thread }`

- [ ] **Step 1: Write failing pairing tests**

```js
const { PairingAccess } = require("../../../utils/externalChannels/access");

describe("PairingAccess", () => {
  test("reuses an unexpired six-digit code and expires old requests", () => {
    let now = 1_000;
    const access = new PairingAccess({
      connectorType: "lark",
      ttlMs: 60_000,
      now: () => now,
    });
    const first = access.request({ userId: "ou_1", name: "Ada", platform: "lark" });
    expect(first.code).toMatch(/^\d{6}$/);
    expect(access.request({ userId: "ou_1", name: "Ada", platform: "lark" }).code).toBe(first.code);
    now = 61_001;
    expect(access.listPending()).toEqual([]);
  });

  test("approves, denies, and revokes by immutable user id", async () => {
    const access = new PairingAccess({ connectorType: "lark" });
    const config = { approved_users: [] };
    access.request({ userId: "ou_1", name: "Ada", platform: "feishu" });
    const approved = await access.approve(config, "ou_1");
    expect(approved.open_id).toBe("ou_1");
    expect(access.isApproved(config, "ou_1")).toBe(true);
    await access.revoke(config, "ou_1");
    expect(access.isApproved(config, "ou_1")).toBe(false);
  });
});
```

Mock `ExternalCommunicationConnector.updateConfig` so tests assert the exact `approved_users` payload without writing the database.

- [ ] **Step 2: Write failing state tests**

```js
const { ChannelStateStore } = require("../../../utils/externalChannels/state");

test("persists a separate workspace and thread for each approved user", async () => {
  const config = {
    default_workspace: "general",
    approved_users: [
      { open_id: "ou_1", name: "Ada" },
      { open_id: "ou_2", name: "Lin" },
    ],
  };
  const store = new ChannelStateStore({ connectorType: "lark", config });
  await store.set("ou_1", { workspaceSlug: "research", threadSlug: "paper" });
  expect(store.get("ou_1")).toEqual({ workspaceSlug: "research", threadSlug: "paper" });
  expect(store.get("ou_2")).toEqual({ workspaceSlug: "general", threadSlug: null });
});
```

- [ ] **Step 3: Run both tests and confirm missing-class failures**

Run: `corepack yarn jest server/__tests__/utils/externalChannels/access.test.js server/__tests__/utils/externalChannels/state.test.js --runInBand`

Expected: FAIL because `PairingAccess` and `ChannelStateStore` do not exist.

- [ ] **Step 4: Implement access and state with injected time and persisted updates**

Use `crypto.randomInt(0, 1_000_000)` padded to six digits, a default TTL of ten minutes, and a maximum of ten pending requests. `listPending()` must purge expired entries and return safe copies. `approve` must fail with `{ error: "Pairing request expired" }` when no live request exists. `set` must reject unknown users and persist `approved_users` through `ExternalCommunicationConnector.updateConfig(connectorType, { approved_users })`.

```js
class ChannelStateStore {
  constructor({ connectorType, config }) {
    this.connectorType = connectorType;
    this.config = config;
  }

  get(userId) {
    const user = (this.config.approved_users || []).find(
      (item) => item.open_id === String(userId)
    );
    if (!user) return null;
    return {
      workspaceSlug: user.active_workspace || this.config.default_workspace,
      threadSlug: user.active_thread || null,
    };
  }

  async set(userId, updates) {
    const user = (this.config.approved_users || []).find(
      (item) => item.open_id === String(userId)
    );
    if (!user) throw new Error("User is not approved");
    if (Object.hasOwn(updates, "workspaceSlug")) user.active_workspace = updates.workspaceSlug;
    if (Object.hasOwn(updates, "threadSlug")) user.active_thread = updates.threadSlug;
    await ExternalCommunicationConnector.updateConfig(this.connectorType, {
      approved_users: this.config.approved_users,
    });
    return this.get(userId);
  }
}
```

- [ ] **Step 5: Run focused tests**

Run: `corepack yarn jest server/__tests__/utils/externalChannels/access.test.js server/__tests__/utils/externalChannels/state.test.js --runInBand`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add server/utils/externalChannels/access.js server/utils/externalChannels/state.js server/__tests__/utils/externalChannels/access.test.js server/__tests__/utils/externalChannels/state.test.js
git commit -m "feat: add external channel access state"
```

### Task 3: Platform-neutral chat worker and transport contract

**Files:**
- Create: `server/utils/externalChannels/chat/transport.js`
- Create: `server/utils/externalChannels/chat/index.js`
- Create: `server/jobs/handle-external-channel-chat.js`
- Create: `server/__tests__/utils/externalChannels/chat.test.js`
- Modify: `server/utils/telegramBot/chat/stream.js`
- Modify: `server/utils/telegramBot/chat/agent.js`
- Modify: `server/jobs/handle-telegram-chat.js`

**Interfaces:**
- Consumes: `{ workspaceSlug, threadSlug, message, attachments, conversationId }`
- Produces IPC events: `ready`, `textChunk`, `status`, `artifact`, `toolApprovalRequest`, `closeInvocation`, `complete`, `failed`
- Produces: `ExternalChannelChatRunner.run(payload, transport)` and `abort(conversationId)`
- Transport methods: `start()`, `append(text)`, `status(text)`, `artifact(file)`, `complete(result)`, `fail(message)`, `requestToolApproval(request)`

- [ ] **Step 1: Write failing contract tests**

```js
const {
  assertChannelTransport,
  createBufferedTransport,
} = require("../../../utils/externalChannels/chat/transport");

test("rejects a transport missing required methods", () => {
  expect(() => assertChannelTransport({ append() {} })).toThrow(
    "Invalid external channel transport: start"
  );
});

test("buffers ordered output events", async () => {
  const transport = createBufferedTransport();
  await transport.start();
  await transport.append("hel");
  await transport.append("lo");
  await transport.complete({ text: "hello", sources: [] });
  expect(transport.events).toEqual([
    { type: "start" },
    { type: "textChunk", text: "hel" },
    { type: "textChunk", text: "lo" },
    { type: "complete", result: { text: "hello", sources: [] } },
  ]);
});
```

- [ ] **Step 2: Run the contract test and confirm the missing module failure**

Run: `corepack yarn jest server/__tests__/utils/externalChannels/chat.test.js --runInBand`

Expected: FAIL because the transport module does not exist.

- [ ] **Step 3: Implement and test the transport contract**

Implement `REQUIRED_TRANSPORT_METHODS` as an immutable array and validate each method. `createBufferedTransport` is test-only support exported from the same small module; it records serializable events and never performs I/O.

Run: `corepack yarn jest server/__tests__/utils/externalChannels/chat.test.js --runInBand`

Expected: PASS.

- [ ] **Step 4: Add a failing worker-protocol test**

Mock `BackgroundService.bree` and assert that `ExternalChannelChatRunner.run` creates a uniquely named `handle-external-channel-chat` worker, forwards every IPC event to the transport in order, sends a tool approval response back to the worker, removes the Bree job on exit, and records the worker by `conversationId` for `abort`.

```js
await runner.run(
  {
    conversationId: "lark:oc_1:ou_1",
    workspaceSlug: "general",
    threadSlug: null,
    message: "hello",
    attachments: [],
  },
  transport
);
expect(transport.events.map((event) => event.type)).toEqual([
  "start",
  "textChunk",
  "complete",
]);
```

- [ ] **Step 5: Move platform-neutral RAG and agent work behind IPC**

Move the current workspace lookup, history, retrieval, LLM streaming, agent invocation, persistence, sources, metrics, and tool-approval request generation from the Telegram-specific worker into `handle-external-channel-chat.js`. It must emit normalized events and never import either Telegram or Lark SDKs.

`ExternalChannelChatRunner` maps worker messages to transport methods:

```js
const EVENT_METHODS = {
  ready: "start",
  textChunk: "append",
  status: "status",
  artifact: "artifact",
  complete: "complete",
  failed: "fail",
};
```

Retain `closeInvocation` and `toolApprovalRequest` as control events. Persist the chat once, inside the shared worker, after a successful completion.

- [ ] **Step 6: Adapt Telegram without changing its user-visible behavior**

Create a Telegram transport object in `handle-telegram-chat.js` whose methods call the existing `sendMessage`, `editMessageText`, formatting, file, voice, and inline-keyboard helpers. Keep Telegram's existing command and polling layers unchanged. Delete only duplicated chat/agent pipeline code after its behavior is covered by tests.

- [ ] **Step 7: Run chat, agent, and Telegram regressions**

Run: `corepack yarn jest server/__tests__/utils/externalChannels/chat.test.js server/__tests__/utils/chats server/__tests__/utils/agents server/__tests__/utils/telegramBot --runInBand`

Expected: PASS with no leaked worker handles.

- [ ] **Step 8: Commit**

```bash
git add server/utils/externalChannels/chat server/jobs/handle-external-channel-chat.js server/__tests__/utils/externalChannels/chat.test.js server/utils/telegramBot/chat server/jobs/handle-telegram-chat.js
git commit -m "refactor: share external channel chat pipeline"
```

### Task 4: Lark configuration and SDK lifecycle

**Files:**
- Modify: `server/package.json`
- Modify: `server/yarn.lock`
- Create: `server/utils/larkChannel/config.js`
- Create: `server/utils/larkChannel/index.js`
- Create: `server/__tests__/utils/larkChannel/config.test.js`
- Create: `server/__tests__/utils/larkChannel/service.test.js`

**Interfaces:**
- Consumes: SDK `createLarkChannel`, `Domain.Lark`, `Domain.Feishu`, `LoggerLevel`
- Produces: `domainForPlatform(platform)`
- Produces: `safeLarkConfig(connector, service)`
- Produces: singleton `LarkChannelService` with `start(config)`, `stop()`, `status`, `bootIfActive()`, and event registration

- [ ] **Step 1: Install the pinned-compatible SDK**

Run: `cd server && corepack yarn add --exact @larksuiteoapi/node-sdk@1.74.0`

Expected: `server/package.json` and `server/yarn.lock` contain version `1.74.0`.

- [ ] **Step 2: Write failing domain and masking tests**

```js
const {
  domainForPlatform,
  safeLarkConfig,
} = require("../../../utils/larkChannel/config");

test.each(["lark", "feishu"])("maps %s to an SDK domain", (platform) => {
  expect(domainForPlatform(platform)).toBeDefined();
});

test("never serializes app_secret", () => {
  const result = safeLarkConfig({
    active: true,
    config: { platform: "lark", app_id: "cli_1", app_secret: "enc:cipher" },
  });
  expect(result.app_id).toBe("cli_1");
  expect(JSON.stringify(result)).not.toContain("app_secret");
  expect(result.has_app_secret).toBe(true);
});
```

- [ ] **Step 3: Run the config tests and confirm failure**

Run: `corepack yarn jest server/__tests__/utils/larkChannel/config.test.js --runInBand`

Expected: FAIL because the config module does not exist.

- [ ] **Step 4: Implement strict platform mapping and safe serialization**

`domainForPlatform` accepts only `lark` and `feishu`; invalid input throws `Unsupported Lark platform`. `safeLarkConfig` returns platform, app ID, masked-secret presence, bot identity, default workspace, attachment limit, active state, runtime connection state, and the last sanitized error category/timestamp.

- [ ] **Step 5: Write failing service lifecycle tests with a mocked SDK Channel**

Assert:

1. `start` decrypts no values itself and passes plaintext credentials plus the mapped domain into `createLarkChannel`.
2. Policy equals `{ requireMention: true, dmMode: "open", respondToMentionAll: false }`.
3. `connect()` must resolve before `start()` reports connected.
4. `reconnecting`, `reconnected`, and `error` update the safe runtime status.
5. `stop()` disconnects once and clears in-memory state.
6. A `permission_denied` connect failure is sanitized and not retried by AnythingLLM.

- [ ] **Step 6: Implement the singleton lifecycle**

```js
const channel = createLarkChannel({
  appId: config.app_id,
  appSecret: config.app_secret,
  domain: domainForPlatform(config.platform),
  transport: "websocket",
  loggerLevel: LoggerLevel.warn,
  policy: {
    requireMention: true,
    dmMode: "open",
    respondToMentionAll: false,
  },
  includeRawInMessage: false,
});
```

Do not register message handling until Task 6; expose a private registration method that Task 6 fills. Log only error codes and timestamps.

- [ ] **Step 7: Run lifecycle tests and server lint**

Run: `corepack yarn jest server/__tests__/utils/larkChannel/config.test.js server/__tests__/utils/larkChannel/service.test.js --runInBand`

Run: `cd server && corepack yarn lint:check`

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add server/package.json server/yarn.lock server/utils/larkChannel/config.js server/utils/larkChannel/index.js server/__tests__/utils/larkChannel/config.test.js server/__tests__/utils/larkChannel/service.test.js
git commit -m "feat: add Lark channel lifecycle"
```

### Task 5: Lark commands and reply transport

**Files:**
- Create: `server/utils/larkChannel/commands.js`
- Create: `server/utils/larkChannel/transport.js`
- Create: `server/__tests__/utils/larkChannel/commands.test.js`
- Create: `server/__tests__/utils/larkChannel/transport.test.js`

**Interfaces:**
- Consumes: `ChannelStateStore`, AnythingLLM `Workspace`, `WorkspaceThread`, shared transport contract
- Produces: `parseLarkCommand(text)`
- Produces: `handleLarkCommand({ command, args, userId, chatId, stateStore, channel })`
- Produces: `createLarkTransport({ channel, message, onToolApproval })`

- [ ] **Step 1: Write failing command-parser tests**

```js
const { parseLarkCommand } = require("../../../utils/larkChannel/commands");

test.each([
  ["/workspace research", { name: "workspace", args: "research" }],
  ["/thread paper", { name: "thread", args: "paper" }],
  ["/new quarterly notes", { name: "new", args: "quarterly notes" }],
  ["/reset", { name: "reset", args: "" }],
  ["/status", { name: "status", args: "" }],
  ["/help", { name: "help", args: "" }],
])("parses %s", (input, expected) => {
  expect(parseLarkCommand(input)).toEqual(expected);
});

test("returns null for normal chat text", () => {
  expect(parseLarkCommand("explain this document")).toBeNull();
});
```

- [ ] **Step 2: Run the parser test and confirm failure**

Run: `corepack yarn jest server/__tests__/utils/larkChannel/commands.test.js --runInBand`

Expected: FAIL because the command module does not exist.

- [ ] **Step 3: Implement parser and command handlers**

Commands use exact workspace/thread slugs when arguments are provided. Without arguments, `/workspace` and `/thread` return a numbered text list plus usage syntax. `/new` creates a thread in the active workspace and selects it. `/reset` calls the existing chat-history reset helper for the active workspace/thread. `/status` returns workspace name, thread name, and resolved model. `/help` lists all six commands.

- [ ] **Step 4: Write failing Lark transport tests**

Mock `channel.stream` and `channel.send`. Assert that `start` opens one stream tied to `message.messageId`, `append` feeds ordered chunks, `complete` closes the stream, group replies use `replyTo`, and a `permission_denied` or card-format error falls back to bounded Markdown/text sends.

```js
const transport = createLarkTransport({ channel, message });
await transport.start();
await transport.append("hello");
await transport.complete({ text: "hello", sources: [] });
expect(channel.stream).toHaveBeenCalledWith(
  "oc_1",
  expect.any(Object),
  expect.objectContaining({ replyTo: "om_1" })
);
```

- [ ] **Step 5: Implement the transport using SDK `stream` and `send`**

The transport buffers chunks through an async generator consumed by `channel.stream`. When streaming is unavailable, split Markdown on paragraph boundaries below the SDK-safe message size and send sequential replies. Tool approval requests use a Lark card only when `onToolApproval` is provided; otherwise deny safely and tell the user to retry in the web UI.

- [ ] **Step 6: Run focused tests**

Run: `corepack yarn jest server/__tests__/utils/larkChannel/commands.test.js server/__tests__/utils/larkChannel/transport.test.js --runInBand`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add server/utils/larkChannel/commands.js server/utils/larkChannel/transport.js server/__tests__/utils/larkChannel/commands.test.js server/__tests__/utils/larkChannel/transport.test.js
git commit -m "feat: add Lark commands and replies"
```

### Task 6: Lark inbound messages, pairing, and attachments

**Files:**
- Create: `server/utils/larkChannel/attachments.js`
- Create: `server/__tests__/utils/larkChannel/attachments.test.js`
- Modify: `server/utils/larkChannel/index.js`
- Modify: `server/__tests__/utils/larkChannel/service.test.js`

**Interfaces:**
- Consumes: SDK `NormalizedMessage.resources`, `downloadResource(fileKey, type)`
- Produces: `normalizeLarkAttachments({ channel, resources, sizeLimit })`
- Produces normalized attachments: `{ name, mime, contentString }`
- Consumes: `PairingAccess`, `ChannelStateStore`, `ExternalChannelChatRunner`, Lark command and transport modules

- [ ] **Step 1: Write failing attachment tests**

Use in-memory Buffers and injected temporary-directory helpers. Cover JPEG, PNG, PDF, TXT, Markdown, DOC, and DOCX. Assert that audio/video/sticker resources are rejected, oversize resources are rejected before ingestion, names are sanitized, and cleanup runs on success and error.

```js
const result = await normalizeLarkAttachments({
  channel,
  resources: [{ type: "file", fileKey: "file_1", fileName: "notes.md" }],
  sizeLimit: 1024,
});
expect(result.attachments[0]).toMatchObject({
  name: "notes.md",
  mime: "text/markdown",
});
expect(Buffer.from(result.attachments[0].contentString, "base64").toString()).toBe("notes");
```

- [ ] **Step 2: Run attachment tests and confirm failure**

Run: `corepack yarn jest server/__tests__/utils/larkChannel/attachments.test.js --runInBand`

Expected: FAIL because the attachment module does not exist.

- [ ] **Step 3: Implement resource validation and normalization**

Use `channel.downloadResource(resource.fileKey, resource.type)`, MIME detection already available in the server, and the existing AnythingLLM attachment shape. `sizeLimit === null` resolves to the server's current upload limit. Do not fetch arbitrary URLs. Always remove scoped temporary files in `finally`.

- [ ] **Step 4: Add failing inbound-message service tests**

Simulate normalized SDK messages and assert:

1. Direct unapproved user receives a pairing code.
2. Unapproved group user receives only a direct-chat instruction, never the code.
3. Approved direct user reaches `ExternalChannelChatRunner`.
4. Approved group mention reaches the runner with the bot mention removed.
5. Non-mention group, duplicate, stale, and bot-authored messages do not invoke the runner.
6. Commands do not invoke the model.
7. Per-chat queue ordering is preserved.

- [ ] **Step 5: Register the production message handler**

Create `PairingAccess` and `ChannelStateStore` when the service starts. Use the SDK policy for the first group-mention gate and retain an explicit `message.chatType === "group" && !message.mentionedBot` guard as defense in depth. Build the conversation key as `${platform}:${chatId}:${senderId}` and call the shared runner through `createLarkTransport`.

- [ ] **Step 6: Run Lark and shared-channel tests**

Run: `corepack yarn jest server/__tests__/utils/larkChannel server/__tests__/utils/externalChannels --runInBand`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add server/utils/larkChannel/index.js server/utils/larkChannel/attachments.js server/__tests__/utils/larkChannel/service.test.js server/__tests__/utils/larkChannel/attachments.test.js
git commit -m "feat: handle Lark messages and files"
```

### Task 7: Protected Lark management API and boot restoration

**Files:**
- Create: `server/endpoints/lark.js`
- Create: `server/__tests__/endpoints/lark.test.js`
- Modify: `server/index.js`
- Modify: `server/utils/boot/index.js`
- Create: `server/__tests__/utils/boot/larkChannel.test.js`

**Interfaces:**
- Consumes: `LarkChannelService`, `ExternalCommunicationConnector`, shared secret helpers, `validatedRequest`, `isSingleUserMode`
- Produces: management endpoints defined in the design spec
- Produces: exported handlers `getLarkConfig`, `connectLark`, `disconnectLark`, `getLarkStatus`, `getPendingLarkUsers`, `getApprovedLarkUsers`, `approveLarkUser`, `denyLarkUser`, `revokeLarkUser`, and `updateLarkConfig`
- Produces: non-fatal `LarkChannelService.bootIfActive()` call in HTTP and HTTPS boot paths

- [ ] **Step 1: Write failing endpoint tests**

Export each route handler alongside `larkEndpoints`. Call those handlers directly with request objects and response stubs, while mocking service/model dependencies. Use a fake Express app to assert middleware and route registration. Verify validation, role middleware presence, successful connect, failed connect without persistence, safe config/status reads, approve/deny/revoke behavior, reconnect preserving approved users, and disconnect deletion.

```js
expect(connectResponse.body).toEqual({
  success: true,
  config: expect.objectContaining({
    platform: "feishu",
    app_id: "cli_1",
    has_app_secret: true,
    connected: true,
  }),
});
expect(JSON.stringify(connectResponse.body)).not.toContain("app-secret");
```

- [ ] **Step 2: Run endpoint tests and confirm missing route failure**

Run: `corepack yarn jest server/__tests__/endpoints/lark.test.js --runInBand`

Expected: FAIL because `larkEndpoints` does not exist.

- [ ] **Step 3: Implement endpoints and register them**

Validate `platform`, non-empty `app_id`, non-empty `app_secret`, existing default workspace, and a positive or `null` attachment limit. On connect, call `service.start` with plaintext credentials, then persist the encrypted secret only after the handshake resolves. On reconnect with a masked/omitted secret, decrypt and reuse the stored value. Every response passes through `safeLarkConfig`.

- [ ] **Step 4: Write failing boot tests**

Assert that active valid configuration is decrypted and started once, inactive or incomplete configuration is skipped, multi-user mode causes connector cleanup consistent with Telegram, and startup failure is logged without rejecting the main boot callback.

- [ ] **Step 5: Implement and register boot restoration**

Call `await LarkChannelService.bootIfActive()` immediately after Telegram boot in both HTTP and HTTPS paths. `bootIfActive` catches its own errors and stores a safe failed state.

- [ ] **Step 6: Run endpoint, boot, and server lint checks**

Run: `corepack yarn jest server/__tests__/endpoints/lark.test.js server/__tests__/utils/boot/larkChannel.test.js --runInBand`

Run: `cd server && corepack yarn lint:check`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add server/endpoints/lark.js server/__tests__/endpoints/lark.test.js server/index.js server/utils/boot/index.js server/__tests__/utils/boot/larkChannel.test.js
git commit -m "feat: add Lark channel management API"
```

### Task 8: Frontend API client, route, and navigation

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/yarn.lock`
- Create: `frontend/vitest.config.js`
- Create: `frontend/src/test/setup.js`
- Create: `frontend/src/models/lark.js`
- Create: `frontend/src/models/lark.test.js`
- Modify: `frontend/src/utils/paths.js`
- Modify: `frontend/src/main.jsx`
- Modify: `frontend/src/components/SettingsSidebar/index.jsx`

**Interfaces:**
- Produces: `Lark.getConfig`, `connect`, `disconnect`, `status`, `getPendingUsers`, `getApprovedUsers`, `approveUser`, `denyUser`, `revokeUser`, `updateConfig`
- Produces: `paths.settings.lark()` returning `/settings/external-connections/lark`
- Produces: lazy admin route and Channels sidebar entry

- [ ] **Step 1: Add a compatible frontend test harness**

Run: `cd frontend && corepack yarn add --dev vitest@^1.6.0 @testing-library/react@^14.3.1 @testing-library/jest-dom@^6.6.3 jsdom@^24.1.3`

Add script `"test": "vitest run"`, configure `environment: "jsdom"`, reuse Vite's `@` alias, and import `@testing-library/jest-dom/vitest` from `src/test/setup.js`.

- [ ] **Step 2: Write failing API-client tests**

Mock `fetch` and verify every method's URL, HTTP verb, headers, body, and safe failure return. The connect payload is exact:

```js
{
  platform: "lark",
  app_id: "cli_1",
  app_secret: "secret",
  default_workspace: "general",
  attachment_size_limit: null
}
```

- [ ] **Step 3: Run the client tests and confirm failure**

Run: `cd frontend && corepack yarn test src/models/lark.test.js`

Expected: FAIL because `src/models/lark.js` does not exist.

- [ ] **Step 4: Implement the API client and navigation wiring**

Follow `frontend/src/models/telegram.js` response shapes but keep all Lark field names from Task 7. Add `paths.settings.lark`, a lazy `AdminRoute`, and a non-multi-user Channels child entry labelled through `settings.available-channels.lark`.

- [ ] **Step 5: Run client tests, lint, and build**

Run: `cd frontend && corepack yarn test src/models/lark.test.js && corepack yarn lint:check && corepack yarn build`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add frontend/package.json frontend/yarn.lock frontend/vitest.config.js frontend/src/test/setup.js frontend/src/models/lark.js frontend/src/models/lark.test.js frontend/src/utils/paths.js frontend/src/main.jsx frontend/src/components/SettingsSidebar/index.jsx
git commit -m "feat: wire Lark channel settings route"
```

### Task 9: Lark settings UI and user approval views

**Files:**
- Create: `frontend/src/pages/GeneralSettings/Connections/Lark/index.jsx`
- Create: `frontend/src/pages/GeneralSettings/Connections/Lark/index.test.jsx`
- Create: `frontend/src/pages/GeneralSettings/Connections/Lark/SetupView/index.jsx`
- Create: `frontend/src/pages/GeneralSettings/Connections/Lark/ConnectedView/index.jsx`
- Create: `frontend/src/pages/GeneralSettings/Connections/Lark/UsersSection/index.jsx`
- Create: `frontend/src/pages/GeneralSettings/Connections/Lark/components/PlatformSelector.jsx`

**Interfaces:**
- Consumes: frontend `Lark` API client, `Admin.workspaces`, sidebar/layout patterns, i18n keys
- Produces: setup, connected, reconnecting, failed, pending-user, and approved-user UI states

- [ ] **Step 1: Write failing page-state tests**

Mock `Lark` and `System`. Verify:

1. No config renders platform, App ID, App Secret, workspace, and connect controls.
2. Lark and Feishu selections remain explicit in the submitted payload.
3. Connected config shows masked secret presence, bot name, platform, workspace, and status.
4. Reconnect does not require retyping App Secret when `has_app_secret` is true.
5. Pending users show name, platform, open-ID suffix, pairing code, and expiry.
6. Approve, deny, and revoke call the matching API once and refresh lists.
7. Multi-user mode redirects home.

```jsx
render(<LarkSettings />);
await user.selectOptions(screen.getByLabelText("Platform"), "feishu");
await user.type(screen.getByLabelText("App ID"), "cli_1");
await user.type(screen.getByLabelText("App Secret"), "secret");
await user.click(screen.getByRole("button", { name: "Connect" }));
expect(Lark.connect).toHaveBeenCalledWith(
  expect.objectContaining({ platform: "feishu", app_id: "cli_1" })
);
```

- [ ] **Step 2: Run the page tests and confirm failure**

Run: `cd frontend && corepack yarn test src/pages/GeneralSettings/Connections/Lark/index.test.jsx`

Expected: FAIL because the page does not exist.

- [ ] **Step 3: Implement setup and connected views**

Follow the existing Telegram page layout and visual tokens. Keep App Secret in React state only until submission. Clear it immediately after the request completes. Disable connect while required fields are missing or a request is active. Show server-sanitized error text in a toast and an inline status block.

- [ ] **Step 4: Implement user lists and polling**

While connected, refresh connection status and user lists every five seconds. Stop timers on unmount. Disable the clicked approval action until its request resolves. Render only the final six characters of `open_id`.

- [ ] **Step 5: Run page tests, frontend lint, and build**

Run: `cd frontend && corepack yarn test src/pages/GeneralSettings/Connections/Lark/index.test.jsx && corepack yarn lint:check && corepack yarn build`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/pages/GeneralSettings/Connections/Lark
git commit -m "feat: add Lark channel settings UI"
```

### Task 10: Localized copy and setup documentation

**Files:**
- Modify: `frontend/src/locales/en/common.js`
- Modify: `frontend/src/locales/zh/common.js`
- Modify: all non-English locale `common.js` files through `normalizeEn.mjs`
- Create: `docs/channels/lark.md`
- Create: `server/__tests__/utils/larkChannel/documentation.test.js`

**Interfaces:**
- Produces: `settings.available-channels.lark` and `lark.*` translation trees
- Produces: local setup guide covering both Lark and Feishu consoles

- [ ] **Step 1: Write English and Chinese translation trees**

Add `settings.available-channels.lark` as `"Lark / Feishu"` in English and `"Lark / 飞书"` in Chinese. Add the following `lark` object to both locale files, translating the values but preserving every key:

```js
lark: {
  title: "Lark / Feishu Bot",
  description: "Connect AnythingLLM to Lark or Feishu with a WebSocket bot.",
  "view-documentation": "View documentation",
  platform: {
    label: "Platform",
    lark: "Lark",
    feishu: "Feishu",
  },
  setup: {
    "app-id": "App ID",
    "app-secret": "App Secret",
    workspace: "Default workspace",
    "attachment-limit": "Attachment size limit (MB)",
    "inherit-limit": "Use AnythingLLM default",
    connect: "Connect",
    connecting: "Connecting...",
    "secret-help": "The App Secret is encrypted before it is stored.",
  },
  status: {
    connected: "Connected",
    reconnecting: "Reconnecting",
    failed: "Connection failed",
    platform: "Platform",
    bot: "Bot",
    workspace: "Default workspace",
    "last-error": "Last error",
    reconnect: "Reconnect",
    disconnect: "Disconnect",
    disconnecting: "Disconnecting...",
  },
  users: {
    title: "User access",
    pending: "Pending approval",
    approved: "Approved users",
    "empty-pending": "No pending users.",
    "empty-approved": "No approved users.",
    approve: "Approve",
    deny: "Deny",
    revoke: "Revoke",
    "pairing-code": "Pairing code",
    expires: "Expires",
    "open-id": "Open ID",
  },
  permissions: {
    title: "Required application setup",
    events: "Enable WebSocket events and subscribe to im.message.receive_v1.",
    scopes: "Grant message receive, send-as-bot, user identity, and message resource permissions.",
  },
  toast: {
    connected: "Lark channel connected.",
    "connect-failed": "Could not connect the Lark channel.",
    disconnected: "Lark channel disconnected.",
    "disconnect-failed": "Could not disconnect the Lark channel.",
    approved: "User approved.",
    denied: "User denied.",
    revoked: "User access revoked.",
    "user-action-failed": "Could not update user access.",
  },
},
```

Use this exact Chinese value tree in `zh/common.js`; preserve the same keys as English:

```js
lark: {
  title: "Lark / 飞书机器人",
  description: "通过 WebSocket 机器人将 AnythingLLM 连接到 Lark 或飞书。",
  "view-documentation": "查看文档",
  platform: {
    label: "平台",
    lark: "Lark",
    feishu: "飞书",
  },
  setup: {
    "app-id": "App ID",
    "app-secret": "App Secret",
    workspace: "默认工作区",
    "attachment-limit": "附件大小限制（MB）",
    "inherit-limit": "使用 AnythingLLM 默认值",
    connect: "连接",
    connecting: "正在连接...",
    "secret-help": "App Secret 在保存前会被加密。",
  },
  status: {
    connected: "已连接",
    reconnecting: "正在重新连接",
    failed: "连接失败",
    platform: "平台",
    bot: "机器人",
    workspace: "默认工作区",
    "last-error": "最近错误",
    reconnect: "重新连接",
    disconnect: "断开连接",
    disconnecting: "正在断开...",
  },
  users: {
    title: "用户访问权限",
    pending: "待审批",
    approved: "已批准用户",
    "empty-pending": "暂无待审批用户。",
    "empty-approved": "暂无已批准用户。",
    approve: "批准",
    deny: "拒绝",
    revoke: "撤销",
    "pairing-code": "配对码",
    expires: "到期时间",
    "open-id": "Open ID",
  },
  permissions: {
    title: "应用必需配置",
    events: "启用 WebSocket 事件并订阅 im.message.receive_v1。",
    scopes: "授予接收消息、机器人发送消息、用户身份和消息资源权限。",
  },
  toast: {
    connected: "Lark 频道已连接。",
    "connect-failed": "无法连接 Lark 频道。",
    disconnected: "Lark 频道已断开。",
    "disconnect-failed": "无法断开 Lark 频道。",
    approved: "用户已批准。",
    denied: "用户已拒绝。",
    revoked: "用户访问权限已撤销。",
    "user-action-failed": "无法更新用户访问权限。",
  },
},
```

Other locales receive `null` through normalization and fall back to English.

- [ ] **Step 2: Normalize and verify locale structures**

Run: `corepack yarn translations:normalize`

Run: `corepack yarn translations:verify`

Expected: all 31 locale files match the English schema; untranslated new values are `null` and use the English fallback.

- [ ] **Step 3: Write a failing documentation-content test**

```js
const fs = require("fs");

test("documents both platforms and required long-connection setup", () => {
  const text = fs.readFileSync(
    "docs/channels/lark.md",
    "utf8"
  );
  expect(text).toContain("open.larksuite.com");
  expect(text).toContain("open.feishu.cn");
  expect(text).toContain("im.message.receive_v1");
  expect(text).toContain("WebSocket");
  expect(text).toContain("im:message:send_as_bot");
});
```

- [ ] **Step 4: Run the documentation test and confirm failure**

Run: `corepack yarn jest server/__tests__/utils/larkChannel/documentation.test.js --runInBand`

Expected: FAIL because the guide does not exist.

- [ ] **Step 5: Write the local setup guide**

Document creation of a self-built bot application, platform selection, App ID/App Secret retrieval, bot capability, WebSocket long-connection event delivery, `im.message.receive_v1`, direct-message and group-mention receiving permissions, `im:message:send_as_bot`, resource-download permission, app publication/tenant installation, AnythingLLM connection, user pairing, and troubleshooting safe error categories. Link each platform's official console and SDK Channel documentation.

- [ ] **Step 6: Run documentation, translation, lint, and build checks**

Run: `corepack yarn jest server/__tests__/utils/larkChannel/documentation.test.js --runInBand`

Run: `corepack yarn translations:verify`

Run: `cd frontend && corepack yarn lint:check && corepack yarn build`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/locales docs/channels/lark.md server/__tests__/utils/larkChannel/documentation.test.js
git commit -m "docs: add Lark channel setup guide"
```

### Task 11: Full regression, local Docker image, and deployment handoff

**Files:**
- No source files are planned in this task. A failure returns to the task that owns the affected file, where the test/fix/commit cycle is repeated before this task restarts.
- Preserve: `/Users/harry/Lab/anything-llm-data`

**Interfaces:**
- Consumes: completed server and frontend implementation
- Produces: tested local image `anythingllm-lark:local`
- Produces: healthy `anythingllm` container on `http://localhost:3001`

- [ ] **Step 1: Run the complete automated suite**

Run: `corepack yarn test --runInBand`

Run: `cd server && corepack yarn lint:check`

Run: `cd frontend && corepack yarn test && corepack yarn lint:check && corepack yarn build`

Run: `corepack yarn translations:verify`

Expected: all tests pass, both linters exit zero, the production frontend build succeeds, and translation schemas match.

- [ ] **Step 2: Inspect the final diff for secrets and scope**

Run: `git diff --check 9ef2e28d..HEAD`

Run: `if git grep -nE 'app_secret[[:space:]]*[:=][[:space:]]*"[^$][^"]+"' -- ':!docs/superpowers' ':!server/__tests__' ':!frontend/src/**/*.test.*'; then exit 1; else echo 'No hard-coded App Secret found'; fi`

Expected: no whitespace errors and no real credentials. Review `git status --short` and every changed path; remove unrelated edits.

- [ ] **Step 3: Build the local Docker image from source**

Run: `touch server/storage/anythingllm.db`

Run: `cp -n docker/.env.example docker/.env`

Run: `docker build -t anythingllm-lark:local -f docker/Dockerfile .`

Expected: build exits zero and `docker image inspect anythingllm-lark:local` succeeds.

- [ ] **Step 4: Replace the current container while preserving data**

First record the exact current mount and restart policy:

Run: `docker inspect anythingllm --format '{{json .Mounts}} {{json .HostConfig.RestartPolicy}}'`

Then stop and rename the current container for a recoverable rollback:

```bash
if docker ps -a --format '{{.Names}}' | rg -q '^anythingllm-official-backup$'; then
  echo 'Backup container name already exists'
  exit 1
fi
docker stop anythingllm
docker rename anythingllm anythingllm-official-backup
docker run -d --name anythingllm --restart unless-stopped -p 3001:3001 --cap-add SYS_ADMIN -v /Users/harry/Lab/anything-llm-data:/app/server/storage -v /Users/harry/Lab/anything-llm-data/.env:/app/server/.env -e STORAGE_DIR=/app/server/storage anythingllm-lark:local
```

Do not delete `anythingllm-official-backup` until the user confirms the new deployment.

- [ ] **Step 5: Verify local health and UI**

Run: `docker inspect --format 'status={{.State.Status}} health={{.State.Health.Status}}' anythingllm`

Run: `curl -fsS http://127.0.0.1:3001/ -o /tmp/anythingllm-lark-index.html -w '%{http_code}\n'`

Run: `docker logs --since 5m anythingllm 2>&1 | tail -n 200`

Expected: running, healthy, HTTP 200, no startup exception, and a Lark/Feishu entry visible under Channels.

- [ ] **Step 6: Perform credential-gated manual integration checks**

Ask the user to enter a test Lark or Feishu App ID/App Secret in the local settings UI. Verify connection, direct-message pairing, admin approval, direct chat, group mention, non-mention ignore, workspace/thread commands, image, document, and container restart recovery. Repeat the connection and core message checks for the second platform when its credentials are available.

- [ ] **Step 7: Report the verified deployment and rollback path**

This task creates no commit. If an earlier check required a source fix, return to that task, add its exact listed files, rerun its focused test and the complete suite, and create the commit there before restarting Task 11.

Report that rollback is available with:

```bash
docker stop anythingllm
docker rename anythingllm anythingllm-lark-failed
docker rename anythingllm-official-backup anythingllm
docker start anythingllm
```

Do not run the rollback unless verification fails or the user requests it.

---

## Final Acceptance Checklist

- [ ] Lark and Feishu both map to the correct official SDK domain.
- [ ] The server uses WebSocket transport and opens no new public port.
- [ ] Direct messages and group mentions are handled; non-mentions are ignored.
- [ ] Unapproved users cannot access workspace names, threads, documents, or model output.
- [ ] Group pairing codes are never exposed in group chat.
- [ ] Approved users retain independent workspace/thread state across restart.
- [ ] Text, images, and supported documents reach the existing AnythingLLM chat flow.
- [ ] Voice, video, unsupported, and oversize attachments receive explicit safe errors.
- [ ] Streaming replies fall back safely to bounded text.
- [ ] App Secret is encrypted at rest, masked in the UI, and absent from logs/responses.
- [ ] Existing Telegram tests and behavior remain intact.
- [ ] Full Jest, Vitest, lint, build, translation, Docker health, and HTTP checks pass.
- [ ] The original official container remains available for rollback until user acceptance.

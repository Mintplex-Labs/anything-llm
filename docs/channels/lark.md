# Connect AnythingLLM to Lark or Feishu

AnythingLLM connects to a Lark or Feishu self-built application through the
official Node SDK's WebSocket long connection. The connection is outbound from
AnythingLLM, so a local or Docker installation does not need a public webhook
URL or an additional inbound port.

Use the developer console for the platform that hosts your tenant:

- Lark: [Lark Developer Console](https://open.larksuite.com/app)
- Feishu: [Feishu Developer Console](https://open.feishu.cn/app)

Do not mix platforms. Credentials created at `open.larksuite.com` must use the
Lark platform option in AnythingLLM; credentials created at `open.feishu.cn`
must use Feishu.

## 1. Create the application and bot

1. In the appropriate developer console, create a self-built (custom/internal)
   application for your organization.
2. Open the application's credentials or basic information page and copy its
   **App ID** and **App Secret**. Keep the App Secret private. Enter it only in
   the AnythingLLM settings page; do not put it in source control or logs.
3. Add and enable the **Bot** application capability. Choose the bot name and
   icon that users should see.

## 2. Grant the application permissions

Under the application's permissions page, grant these application/tenant
permissions. Console display names can change, so search by scope identifier.

| Scope | Purpose |
| --- | --- |
| `im:message.p2p_msg:readonly` | Receive direct messages sent to the bot. |
| `im:message.group_at_msg:readonly` | Receive group messages that explicitly mention the bot. |
| `im:message:send_as_bot` | Send AnythingLLM replies as the bot. |
| `im:resource` | Download images and files attached to received messages. |
| `contact:user.base:readonly` | Read the basic user identity used for a display name. |

AnythingLLM deliberately responds only to direct messages and explicit group
mentions. It does not need the broader permission to read every group message.
If your tenant asks for approval of any scope, have a tenant administrator
approve it before testing.

Incremental card updates may require the console's message-update permission
(`im:message:update`). The channel retains a plain-text fallback when a richer
card update is unavailable.

## 3. Configure WebSocket event delivery

1. Open **Events & Callbacks** or **Event Subscriptions** in the application.
2. Select **Long connection** / **WebSocket** as the event delivery method. Do
   not select webhook delivery and do not configure a request URL.
3. Add the `im.message.receive_v1` event (Receive message) using application
   identity. Accept any prompt to grant the direct-message and group-mention
   receive permissions listed above.

The AnythingLLM server must be running and able to reach the platform over the
internet when you connect it. The official SDK establishes and maintains the
WebSocket connection. See the official Channel references for the transport
and lifecycle details:

- [Lark SDK Channel documentation](https://github.com/larksuite/node-sdk/blob/main/docs/channel.md)
- [飞书 SDK Channel 文档](https://github.com/larksuite/node-sdk/blob/main/docs/channel.zh.md)
- [Lark receive-message event](https://open.larksuite.com/document/server-docs/im-v1/message/events/receive)
- [飞书接收消息事件](https://open.feishu.cn/document/server-docs/im-v1/message/events/receive)

## 4. Publish and make the bot available

Create and publish an application version containing the bot capability,
permissions, and event subscription. Complete the tenant review or admin
approval required by your organization, then install or enable the application
for the intended users. Add the bot to each group where it should answer.

Changes to permissions or event subscriptions may not affect the installed
application until a new version is published and approved.

## 5. Connect AnythingLLM

1. In AnythingLLM, create at least one workspace.
2. Open **Settings > Channels > Lark / Feishu**.
3. Select the same platform as the developer console used above.
4. Enter the App ID and App Secret, choose a default workspace, and optionally
   set an attachment-size limit. Leave the limit blank to inherit the
   AnythingLLM upload limit.
5. Select **Connect**. AnythingLLM encrypts the App Secret before storing it and
   reports the bot identity only after the WebSocket handshake succeeds.

## 6. Pair users

1. A user sends the bot a direct message. The bot returns a short-lived pairing
   code but does not expose workspace data or run a model yet.
2. In the Lark / Feishu settings page, compare the user's code with the entry
   under **Pending approval**, then approve or deny it. Match both the code and
   the displayed user details before approving.
3. After approval, the user can chat in a direct message. In a group, the user
   must explicitly `@` mention the bot. Pairing codes are never posted into a
   group.
4. Revoking the user in AnythingLLM removes access immediately.

## Troubleshooting

- **Connection failed / not connected:** verify that Lark versus Feishu is
  selected correctly, re-copy the App ID and App Secret, confirm outbound
  internet access, and reconnect. Credentials from one platform do not work on
  the other.
- **Permission denied:** confirm every scope above is approved in the tenant,
  the bot capability is enabled, and the latest application version is
  published and installed.
- **Direct messages or group mentions do not arrive:** confirm WebSocket long
  connection delivery and the `im.message.receive_v1` subscription. Check the
  corresponding direct-message or group-mention permission and make sure the
  bot is available to the user or added to the group.
- **Reconnecting:** transient network interruptions are retried by the SDK.
  Keep the AnythingLLM server running and check firewall or proxy access to the
  selected platform.
- **Rate limited / send timeout:** wait briefly and retry. Persistent failures
  usually indicate tenant limits or network reachability.
- **Attachment upload/download failed:** verify `im:resource`, the file type,
  and the configured size limit. AnythingLLM accepts supported images and
  documents; voice, video, and legacy `.doc` files are not supported by this
  channel.
- **Format error / target revoked:** the channel falls back to safe text when it
  can. Retry from a current message if the original reply target was deleted or
  is no longer available.

AnythingLLM exposes only safe error categories in this page. Raw platform
responses, message contents, App Secrets, internal paths, and stack traces are
intentionally omitted.

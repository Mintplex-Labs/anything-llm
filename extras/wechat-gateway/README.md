# AnythingLLM WeChat Gateway Example

This is a minimal external Gateway example for forwarding WeChat text messages
to AnythingLLM. It does not implement the real WeChat protocol, QR login,
message polling, hooks, media downloads, or credential storage.

The intended flow is:

```text
WeChat / Clawbot / OpenClaw plugin
-> this Gateway
-> AnythingLLM /api/wechat/webhook
-> wechat Workspace + fixed wxid thread
-> reply
-> Gateway sends the reply back to WeChat
```

## 1. Start AnythingLLM

Run AnythingLLM normally, with the server available at:

```text
http://localhost:3001
```

The webhook endpoint used by this example is:

```text
POST http://localhost:3001/api/wechat/webhook
```

## 2. Configure Advanced Gateway

Open AnythingLLM and go to:

```text
Settings -> Channels -> Advanced Gateway Connector
```

Set:

- Enable Advanced Gateway Connector: on
- Gateway URL: `http://localhost:8787`
- API Secret: choose a strong shared secret

The same API Secret must be used as `ANYTHINGLLM_GATEWAY_SECRET` in this
Gateway. AnythingLLM stores the secret encrypted and only uses it to verify
HMAC signatures from the external Gateway.

You also need a working LLM Provider configured in AnythingLLM before the
webhook can return a real AI reply. If the provider or provider API key is not
configured, AnythingLLM will return:

```json
{
  "success": false,
  "error": "llm_provider_not_configured",
  "reply": null
}
```

AnythingLLM does not store WeChat login state, cookies, tokens, local WeChat
credentials, images, voice messages, or files. Real WeChat login and message
send/receive must stay inside your external Gateway, Clawbot, or OpenClaw
WeChat plugin.

## 3. Start This Gateway

```bash
cd extras/wechat-gateway
cp .env.example .env
```

Edit `.env`:

```env
ANYTHINGLLM_BASE_URL=http://localhost:3001
ANYTHINGLLM_GATEWAY_SECRET=your-secret
GATEWAY_PORT=8787
```

Then run:

```bash
npm install
npm start
```

## 4. Test With curl

```bash
curl -X POST http://localhost:8787/mock/wechat/message \
  -H "Content-Type: application/json" \
  -d '{"wxid":"test_user_001","nickname":"测试用户","content":"你好，介绍一下你自己"}'
```

Expected result:

- Gateway receives the mock WeChat text message.
- Gateway signs and forwards the request to AnythingLLM.
- AnythingLLM creates or reuses the `wechat` Workspace.
- AnythingLLM creates or reuses the `WeChat - 测试用户` thread.
- AnythingLLM returns a reply.
- curl prints:

```json
{
  "success": true,
  "reply": "AnythingLLM 回复内容"
}
```

The mock endpoint rejects bad input before forwarding:

- missing or empty `wxid`
- missing or empty `content`
- `content` longer than 8000 characters

## 5. HMAC Notes

AnythingLLM verifies every webhook request with HMAC-SHA256.

The Gateway signs:

```text
HMAC_SHA256(secret, `${timestamp}.${rawBody}`)
```

Important:

- `timestamp` must be generated once and reused for the JSON payload,
  `x-anythingllm-gateway-timestamp` header, and signature input.
- `rawBody` must be the exact JSON string sent as the HTTP request body.
- If you sign one string but send a different body, AnythingLLM returns
  `unauthorized`.
- AnythingLLM accepts timestamps only within a 5 minute window.

## 6. Real Clawbot / OpenClaw Integration

Do not put WeChat protocol code into AnythingLLM. Keep real WeChat login,
message listening, and sending inside your external plugin or Gateway.

Pseudo-code:

```js
async function onWechatTextMessage(msg) {
  const response = await forwardToAnythingLLM({
    wxid: msg.wxid,
    nickname: msg.nickname,
    content: msg.text,
  });

  if (response.success) {
    await sendWechatMessage(msg.wxid, response.reply);
  }
}
```

Media messages are intentionally out of scope for this phase. A future Gateway
can download WeChat media and pass a `media_url`, base64 attachment, or external
object storage reference to AnythingLLM after the media pipeline is designed.

/* eslint-env jest */
// Regression tests for https://github.com/Mintplex-Labs/anything-llm/issues/6659
// The gmail-send-email approval request must carry the message content and
// extra recipients — not just to/subject/attachmentCount — so the approver
// can see what they are approving.

jest.mock("../../../../../utils/agents/aibitat/plugins/gmail/lib.js", () => ({
  sendEmail: jest.fn(async () => ({ success: true })),
  prepareAttachment: jest.fn(),
  MAX_TOTAL_ATTACHMENT_SIZE: 20 * 1024 * 1024,
}));
jest.mock("../../../../../utils/helpers", () => ({
  humanFileSize: jest.fn(() => "1 KB"),
}));

const {
  GmailSendEmail,
} = require("../../../../../utils/agents/aibitat/plugins/gmail/send/gmail-send-email.js");

function setupPlugin() {
  const requests = [];
  const aibitat = {
    introspect: jest.fn(),
    handlerProps: { log: jest.fn() },
    requestToolApproval: jest.fn(async (req) => {
      requests.push(req);
      return { approved: true };
    }),
    function: (config) => (aibitat._fn = config),
  };
  GmailSendEmail.plugin.call(GmailSendEmail).setup(aibitat);
  const handler = aibitat._fn.handler.bind(aibitat._fn);
  return { handler, requests };
}

describe("gmail-send-email approval payload", () => {
  test("includes body, cc, bcc, htmlBody and replyTo", async () => {
    const { handler, requests } = setupPlugin();
    const result = await handler({
      to: "boss@example.com",
      subject: "Quarterly numbers",
      body: "Here are the numbers...",
      cc: "cfo@example.com",
      bcc: "secret@example.com",
      htmlBody: "<p>Here are the numbers...</p>",
      replyTo: "me@example.com",
    });
    expect(result).toMatch(/Successfully sent email/);
    expect(requests).toHaveLength(1);
    expect(requests[0].payload).toEqual({
      to: "boss@example.com",
      subject: "Quarterly numbers",
      body: "Here are the numbers...",
      cc: "cfo@example.com",
      bcc: "secret@example.com",
      htmlBody: "<p>Here are the numbers...</p>",
      replyTo: "me@example.com",
      attachmentCount: 0,
    });
  });

  test("omits optional recipients when not provided", async () => {
    const { handler, requests } = setupPlugin();
    await handler({
      to: "boss@example.com",
      subject: "Quarterly numbers",
      body: "Here are the numbers...",
    });
    expect(requests).toHaveLength(1);
    expect(requests[0].payload).toEqual({
      to: "boss@example.com",
      subject: "Quarterly numbers",
      body: "Here are the numbers...",
      attachmentCount: 0,
    });
    expect(requests[0].payload).not.toHaveProperty("cc");
    expect(requests[0].payload).not.toHaveProperty("bcc");
  });
});

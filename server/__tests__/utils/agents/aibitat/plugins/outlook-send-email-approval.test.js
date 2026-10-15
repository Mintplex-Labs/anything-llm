/* eslint-env jest */
// Regression tests for https://github.com/Mintplex-Labs/anything-llm/issues/6659
// The outlook-send-email approval request must carry the message content and
// extra recipients — not just to/subject/attachmentCount — so the approver
// can see what they are approving.

jest.mock("../../../../../utils/agents/aibitat/plugins/outlook/lib.js", () => ({
  prepareAttachmentsWithValidation: jest.fn(async () => ({
    success: true,
    attachments: [],
    summaries: [],
  })),
  handleSkillError: jest.fn(),
  sendEmail: jest.fn(async () => ({ success: true })),
  replyToMessage: jest.fn(async () => ({ success: true })),
}));

const {
  OutlookSendEmail,
} = require("../../../../../utils/agents/aibitat/plugins/outlook/send/outlook-send-email.js");

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
  OutlookSendEmail.plugin.call(OutlookSendEmail).setup(aibitat);
  const handler = aibitat._fn.handler.bind(aibitat._fn);
  return { handler, requests };
}

describe("outlook-send-email approval payload", () => {
  test("new email includes body, cc and bcc", async () => {
    const { handler, requests } = setupPlugin();
    await handler({
      to: "boss@example.com",
      subject: "Quarterly numbers",
      body: "Here are the numbers...",
      cc: "cfo@example.com",
      bcc: "secret@example.com",
      isHtml: false,
      attachments: [],
    });
    expect(requests).toHaveLength(1);
    expect(requests[0].payload).toEqual({
      to: "boss@example.com",
      subject: "Quarterly numbers",
      body: "Here are the numbers...",
      cc: "cfo@example.com",
      bcc: "secret@example.com",
      attachmentCount: 0,
    });
  });

  test("reply includes the reply body", async () => {
    const { handler, requests } = setupPlugin();
    await handler({
      replyToMessageId: "msg-123",
      replyAll: false,
      body: "Thanks, confirmed.",
    });
    expect(requests).toHaveLength(1);
    expect(requests[0].payload).toEqual({
      replyToMessageId: "msg-123",
      replyAll: false,
      body: "Thanks, confirmed.",
    });
  });
});

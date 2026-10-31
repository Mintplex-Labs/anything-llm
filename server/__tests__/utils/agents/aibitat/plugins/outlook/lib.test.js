/* eslint-env jest */
const {
  OutlookBridge,
  mapGraphMessage,
} = require("../../../../../../utils/agents/aibitat/plugins/outlook/lib.js");
const {
  OutlookReadThread,
} = require("../../../../../../utils/agents/aibitat/plugins/outlook/search/outlook-read-thread.js");

const outlookLib = require("../../../../../../utils/agents/aibitat/plugins/outlook/lib.js");

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Outlook message permalinks", () => {
  test("maps the Graph webLink without changing the URL", () => {
    const webLink =
      "https://outlook.office.com/mail/deeplink/read/AAMkAG...-__";

    expect(mapGraphMessage({ id: "message-id", webLink }).webLink).toBe(
      webLink
    );
  });

  test("uses the newest message webLink as the thread permalink", async () => {
    const bridge = new OutlookBridge();
    bridge.request = jest.fn().mockResolvedValue({
      success: true,
      data: {
        value: [
          {
            id: "newer-message",
            subject: "Thread subject",
            receivedDateTime: "2026-10-30T12:00:00Z",
            webLink: "https://outlook.office.com/mail/deeplink/read/newer-__",
          },
          {
            id: "older-message",
            subject: "Thread subject",
            receivedDateTime: "2026-10-30T10:00:00Z",
            webLink: "https://outlook.office.com/mail/deeplink/read/older-__",
          },
        ],
      },
    });

    const result = await bridge.readThread("conversation-id");

    expect(bridge.request).toHaveBeenCalledWith(
      expect.stringContaining(
        "$select=id,subject,from,toRecipients,ccRecipients,receivedDateTime,isRead,hasAttachments,body,webLink,attachments"
      )
    );
    expect(result.data.permalink).toBe(
      "https://outlook.office.com/mail/deeplink/read/newer-__"
    );
  });

  test("uses the Graph permalink as the thread citation source", async () => {
    const registration = jest.fn();
    OutlookReadThread.plugin().setup({ function: registration });
    const [{ handler }] = registration.mock.calls.map(
      ([definition]) => definition
    );
    const addCitation = jest.fn();
    jest.spyOn(outlookLib, "readThread").mockResolvedValue({
      success: true,
      data: {
        conversationId: "conversation-id",
        subject: "Thread subject",
        messageCount: 1,
        permalink: "https://outlook.office.com/mail/deeplink/read/message-__",
        messages: [
          {
            id: "message-id",
            fromName: "Sender",
            from: "sender@example.com",
            to: "recipient@example.com",
            subject: "Thread subject",
            isRead: true,
            date: "2026-10-30T12:00:00Z",
            body: "Message body",
            bodyType: "text",
          },
        ],
      },
    });

    await handler.call(
      {
        caller: "test",
        super: {
          handlerProps: { log: jest.fn() },
          introspect: jest.fn(),
          addCitation,
        },
      },
      { conversationId: "conversation-id" }
    );

    expect(addCitation).toHaveBeenCalledWith(
      expect.objectContaining({
        chunkSource:
          "outlook-thread://https://outlook.office.com/mail/deeplink/read/message-__",
      })
    );
  });
});

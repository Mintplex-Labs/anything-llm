/* eslint-env jest */
// `utils/http` reaches the auth stack on require; this suite exercises none of it.
jest.mock("jsonwebtoken", () => ({}));

const {
  OutlookBridge,
} = require("../../../../../../utils/agents/aibitat/plugins/outlook/lib.js");

function graphMessage(n) {
  return {
    id: `m${n}`,
    conversationId: "CONV1",
    subject: n === 1 ? "Budget" : "RE: Budget",
    from: { emailAddress: { address: `p${n}@example.com`, name: `P${n}` } },
    toRecipients: [],
    ccRecipients: [],
    receivedDateTime: new Date(Date.UTC(2026, 10, n)).toISOString(),
    isRead: true,
    hasAttachments: false,
    body: { contentType: "text", content: `message ${n}` },
    attachments: [],
  };
}

describe("OutlookBridge.readThread", () => {
  test("follows @odata.nextLink so threads longer than one page are read in full", async () => {
    // Graph pages /me/messages 10 at a time by default, newest first.
    const newestFirst = Array.from({ length: 14 }, (_, i) =>
      graphMessage(14 - i)
    );
    const nextLink =
      "https://graph.microsoft.com/v1.0/me/messages?$skip=10&page=2";
    const bridge = new OutlookBridge();
    bridge.request = jest.fn(async (endpoint) =>
      endpoint === nextLink
        ? { success: true, data: { value: newestFirst.slice(10) } }
        : {
            success: true,
            data: {
              value: newestFirst.slice(0, 10),
              "@odata.nextLink": nextLink,
            },
          }
    );

    const result = await bridge.readThread("CONV1");

    expect(bridge.request).toHaveBeenCalledTimes(2);
    expect(bridge.request).toHaveBeenLastCalledWith(nextLink);
    expect(result.success).toBe(true);
    expect(result.data.messageCount).toBe(14);
    expect(result.data.subject).toBe("Budget");
    expect(result.data.messages.map((m) => m.id)).toEqual(
      Array.from({ length: 14 }, (_, i) => `m${i + 1}`)
    );
  });

  test("returns the request error when a later page fails", async () => {
    const bridge = new OutlookBridge();
    bridge.request = jest
      .fn()
      .mockResolvedValueOnce({
        success: true,
        data: { value: [graphMessage(2)], "@odata.nextLink": "next" },
      })
      .mockResolvedValueOnce({ success: false, error: "throttled" });

    const result = await bridge.readThread("CONV1");

    expect(result).toEqual({ success: false, error: "throttled" });
  });
});

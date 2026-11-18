/* eslint-env jest */
jest.mock("../../../../../../models/systemSettings", () => ({
  SystemSettings: {},
}));
jest.mock("../../../../../../utils/collectorApi", () => ({
  CollectorApi: jest.fn(),
}));

const outlookLib = require("../../../../../../utils/agents/aibitat/plugins/outlook/lib.js");
const { parseEmailRecipients } = outlookLib;

const recipient = (address) => ({ emailAddress: { address } });

describe("parseEmailRecipients", () => {
  test("splits a comma-separated list", () => {
    expect(parseEmailRecipients("a@example.com, b@example.com")).toEqual([
      recipient("a@example.com"),
      recipient("b@example.com"),
    ]);
  });

  test("splits a semicolon-separated list the way Outlook writes it", () => {
    expect(parseEmailRecipients("a@example.com; b@example.com")).toEqual([
      recipient("a@example.com"),
      recipient("b@example.com"),
    ]);
  });

  test("drops empty entries from trailing or doubled separators", () => {
    expect(parseEmailRecipients("a@example.com, ,b@example.com;")).toEqual([
      recipient("a@example.com"),
      recipient("b@example.com"),
    ]);
  });

  test("returns no recipients for an empty or separator-only string", () => {
    expect(parseEmailRecipients("")).toEqual([]);
    expect(parseEmailRecipients(" , ; ")).toEqual([]);
  });
});

describe("OutlookBridge.sendEmail recipients", () => {
  afterEach(() => jest.restoreAllMocks());

  test("sends one Graph recipient per address in to, cc and bcc", async () => {
    const request = jest
      .spyOn(outlookLib, "request")
      .mockResolvedValue({ success: true });

    await outlookLib.sendEmail("a@example.com; b@example.com", "Hi", "Body", {
      cc: "c@example.com,",
      bcc: "d@example.com; e@example.com",
    });

    const { message } = JSON.parse(request.mock.calls[0][1].body);
    expect(message.toRecipients).toEqual([
      recipient("a@example.com"),
      recipient("b@example.com"),
    ]);
    expect(message.ccRecipients).toEqual([recipient("c@example.com")]);
    expect(message.bccRecipients).toEqual([
      recipient("d@example.com"),
      recipient("e@example.com"),
    ]);
  });
});

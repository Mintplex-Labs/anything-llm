const {
  ExternalCommunicationConnector,
} = require("../../models/externalCommunicationConnector");

describe("ExternalCommunicationConnector", () => {
  it("supports Telegram, WeChat, and Advanced Gateway connector types", () => {
    expect(ExternalCommunicationConnector.supportedTypes).toEqual(
      expect.arrayContaining(["telegram", "wechat", "advanced_gateway"])
    );
  });

  it("rejects unsupported connector types before persistence", async () => {
    const result = await ExternalCommunicationConnector.upsert("unsupported", {});

    expect(result.connector).toBeNull();
    expect(result.error).toBe("Unsupported connector type: unsupported");
  });
});

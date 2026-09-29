const mockBoot = jest.fn();
jest.mock("../../../utils/MCP", () =>
  jest.fn().mockImplementation(() => ({ bootMCPServers: mockBoot }))
);

const bootMCPServers = require("../../../utils/boot/bootMCPServers");

describe("bootMCPServers (server boot step)", () => {
  beforeEach(() => {
    mockBoot.mockReset();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("boots the MCP servers", async () => {
    mockBoot.mockResolvedValue({});
    await bootMCPServers();
    expect(mockBoot).toHaveBeenCalledTimes(1);
  });

  it("does not reject when booting throws, so server boot is never interrupted", async () => {
    mockBoot.mockRejectedValue(new Error("boom"));
    await expect(bootMCPServers()).resolves.toBeUndefined();
    expect(console.error).toHaveBeenCalled();
  });
});

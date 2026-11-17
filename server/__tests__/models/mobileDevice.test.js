const mockPrisma = {
  desktop_mobile_devices: {
    findFirst: jest.fn(),
    update: jest.fn(),
  },
};
jest.mock("../../utils/prisma", () => mockPrisma);

const { MobileDevice } = require("../../models/mobileDevice");

describe("MobileDevice.get", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns the device row when found", async () => {
    const row = { id: 1, deviceName: "Pixel-8", approved: false };
    mockPrisma.desktop_mobile_devices.findFirst.mockResolvedValue(row);
    await expect(MobileDevice.get({ id: 1 })).resolves.toBe(row);
  });

  it("returns null when the device is not found", async () => {
    mockPrisma.desktop_mobile_devices.findFirst.mockResolvedValue(null);
    await expect(MobileDevice.get({ id: 999 })).resolves.toBeNull();
  });

  it("returns null instead of [] when the query throws", async () => {
    mockPrisma.desktop_mobile_devices.findFirst.mockRejectedValue(
      new Error("DB down")
    );
    await expect(MobileDevice.get({ id: 1 })).resolves.toBeNull();
  });
});

describe("MobileDevice.update", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns 'Device not found' when get fails instead of passing [] past the guard", async () => {
    mockPrisma.desktop_mobile_devices.findFirst.mockRejectedValue(
      new Error("DB down")
    );
    const result = await MobileDevice.update(1, { approved: true });
    expect(result).toEqual({ device: null, error: "Device not found" });
    expect(mockPrisma.desktop_mobile_devices.update).not.toHaveBeenCalled();
  });

  it("returns 'Device not found' when the device does not exist", async () => {
    mockPrisma.desktop_mobile_devices.findFirst.mockResolvedValue(null);
    const result = await MobileDevice.update(999, { approved: true });
    expect(result).toEqual({ device: null, error: "Device not found" });
    expect(mockPrisma.desktop_mobile_devices.update).not.toHaveBeenCalled();
  });

  it("applies a valid update to the found device", async () => {
    mockPrisma.desktop_mobile_devices.findFirst.mockResolvedValue({
      id: 1,
      approved: false,
    });
    mockPrisma.desktop_mobile_devices.update.mockResolvedValue({
      id: 1,
      approved: true,
    });
    const result = await MobileDevice.update(1, { approved: true });
    expect(result.device).toEqual({ id: 1, approved: true });
    expect(result.error).toBeNull();
  });

  it("returns the device unchanged when updates contain no writable keys", async () => {
    const row = { id: 1, approved: false };
    mockPrisma.desktop_mobile_devices.findFirst.mockResolvedValue(row);
    const result = await MobileDevice.update(1, { approve: true });
    expect(result.device).toBe(row);
    expect(result.error).toBeNull();
    expect(mockPrisma.desktop_mobile_devices.update).not.toHaveBeenCalled();
  });
});
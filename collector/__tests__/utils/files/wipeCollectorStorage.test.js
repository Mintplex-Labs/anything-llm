process.env.STORAGE_DIR = "test-storage"; // needed for tests to run
const fs = require("fs");
const { wipeCollectorStorage } = require("../../../utils/files");

describe("wipeCollectorStorage", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("resolves without throwing when the hotdir does not exist", async () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(false);
    jest
      .spyOn(fs, "readdir")
      .mockImplementation((dir, cb) =>
        setImmediate(() => cb(new Error("ENOENT"), undefined))
      );
    const rmSync = jest.spyOn(fs, "rmSync").mockImplementation(() => {});
    await expect(wipeCollectorStorage()).resolves.toBeUndefined();
    expect(rmSync).not.toHaveBeenCalled();
  });

  it("resolves without throwing when a directory cannot be read", async () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest
      .spyOn(fs, "readdir")
      .mockImplementation((dir, cb) =>
        setImmediate(() => cb(new Error("ENOENT"), undefined))
      );
    const rmSync = jest.spyOn(fs, "rmSync").mockImplementation(() => {});
    await expect(wipeCollectorStorage()).resolves.toBeUndefined();
    expect(rmSync).not.toHaveBeenCalled();
  });
});

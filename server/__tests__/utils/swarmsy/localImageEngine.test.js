const {
  COMFYUI_REACHABLE_MESSAGE,
  COMFYUI_UNREACHABLE_MESSAGE,
  DEFAULT_LOCAL_IMAGE_ENGINE_URL,
  detectLocalImageEngine,
  resolveLocalImageEngineUrl,
} = require("../../../utils/swarmsy/localImageEngine");

describe("local image engine detection", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    delete process.env.SWARMSY_LOCAL_COMFYUI_URL;
    delete process.env.COMFYUI_BASE_URL;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("returns unavailable when ComfyUI is unreachable", async () => {
    const fetchImpl = jest.fn().mockRejectedValue(new Error("ECONNREFUSED"));

    const status = await detectLocalImageEngine({ fetchImpl });

    expect(fetchImpl).toHaveBeenCalledWith(DEFAULT_LOCAL_IMAGE_ENGINE_URL, {
      method: "GET",
      redirect: "manual",
      signal: expect.any(AbortSignal),
    });
    expect(status).toEqual({
      success: true,
      mode: "local_user",
      available: false,
      engine: "comfyui",
      url: DEFAULT_LOCAL_IMAGE_ENGINE_URL,
      message: COMFYUI_UNREACHABLE_MESSAGE,
    });
  });

  it("returns available when ComfyUI is reachable", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({ ok: true, status: 200 });

    const status = await detectLocalImageEngine({ fetchImpl });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(status).toEqual({
      success: true,
      mode: "local_user",
      available: true,
      engine: "comfyui",
      url: DEFAULT_LOCAL_IMAGE_ENGINE_URL,
      message: COMFYUI_REACHABLE_MESSAGE,
    });
  });

  it("includes HTTP status when ComfyUI returns a non-OK response", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({ ok: false, status: 404 });

    const status = await detectLocalImageEngine({ fetchImpl });

    expect(status).toEqual({
      success: true,
      mode: "local_user",
      available: false,
      engine: "comfyui",
      url: DEFAULT_LOCAL_IMAGE_ENGINE_URL,
      message:
        "ComfyUI returned HTTP 404. Check the configured image engine URL.",
    });
  });

  it("includes safe unexpected exception details without exposing stack traces", async () => {
    const fetchImpl = jest
      .fn()
      .mockRejectedValue(new Error("TLS handshake failed"));

    const status = await detectLocalImageEngine({ fetchImpl });

    expect(status.message).toBe(
      "Failed to detect ComfyUI: TLS handshake failed"
    );
    expect(status.message).not.toContain(" at ");
    expect(status.available).toBe(false);
  });

  it("does not submit a generation job during readiness checks", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({ ok: true, status: 200 });

    await detectLocalImageEngine({ fetchImpl });

    expect(fetchImpl).toHaveBeenCalledWith(DEFAULT_LOCAL_IMAGE_ENGINE_URL, {
      method: "GET",
      redirect: "manual",
      signal: expect.any(AbortSignal),
    });
    expect(fetchImpl).not.toHaveBeenCalledWith(
      expect.stringContaining("/prompt"),
      expect.objectContaining({ method: "POST" })
    );
  });

  it("uses configured ComfyUI URL without requiring API keys", async () => {
    process.env.SWARMSY_LOCAL_COMFYUI_URL = "http://127.0.0.1:8188/";
    const fetchImpl = jest.fn().mockResolvedValue({ ok: true, status: 200 });

    const status = await detectLocalImageEngine({ fetchImpl });

    expect(status.url).toBe("http://127.0.0.1:8188");
    expect(fetchImpl.mock.calls[0][1]).not.toHaveProperty("headers");
  });

  it("resolves default and configured image engine URLs", () => {
    expect(resolveLocalImageEngineUrl()).toBe(DEFAULT_LOCAL_IMAGE_ENGINE_URL);
    process.env.COMFYUI_BASE_URL = "http://comfy.local:8188/";
    expect(resolveLocalImageEngineUrl()).toBe("http://comfy.local:8188");
  });
});

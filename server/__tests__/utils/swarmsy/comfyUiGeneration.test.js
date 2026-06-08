const {
  DEFAULT_POLL_REQUEST_TIMEOUT_MS,
  generateComfyUiImage,
  isLocalComfyUiUrl,
  resolveWorkflowPayload,
} = require("../../../utils/swarmsy/comfyUiGeneration");

function jsonResponse({
  ok = true,
  status = 200,
  body = {},
  headers = {},
  responseBody,
} = {}) {
  return {
    ok,
    status,
    body: responseBody,
    headers: { get: (name) => headers[name] || headers[name.toLowerCase()] },
    json: jest.fn().mockResolvedValue(body),
  };
}

function mockSuccessfulComfyUiFetch() {
  return jest
    .fn()
    .mockResolvedValueOnce(jsonResponse())
    .mockResolvedValueOnce(
      jsonResponse({ body: { prompt_id: "abc-123", number: 1 } })
    )
    .mockResolvedValueOnce(
      jsonResponse({
        body: {
          "abc-123": {
            outputs: {
              "9": {
                images: [
                  {
                    filename: "swarmsy.png",
                    subfolder: "",
                    type: "output",
                  },
                ],
              },
            },
          },
        },
      })
    )
    .mockResolvedValueOnce(
      jsonResponse({ headers: { "content-type": "image/png" } })
    );
}

function submittedWorkflow(fetchImpl) {
  return JSON.parse(fetchImpl.mock.calls[1][1].body).prompt;
}

describe("ComfyUI local generation", () => {
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

  it("rejects missing prompt before calling ComfyUI", async () => {
    const fetchImpl = jest.fn();

    const result = await generateComfyUiImage({ fetchImpl });

    expect(fetchImpl).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      mode: "local_user",
      engine: "comfyui",
      status: "invalid_request",
      message: "Prompt is required for local ComfyUI image generation.",
    });
  });

  it("returns unavailable when ComfyUI is unreachable", async () => {
    const fetchImpl = jest.fn().mockRejectedValue(new Error("ECONNREFUSED"));

    const result = await generateComfyUiImage({
      prompt: "high contrast stencil street art",
      workflowJson: { "1": { inputs: { text: "{{prompt}}" } } },
      fetchImpl,
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchImpl).toHaveBeenCalledWith("http://localhost:8188", {
      method: "GET",
      redirect: "manual",
      signal: expect.any(AbortSignal),
    });
    expect(result).toEqual({
      success: false,
      mode: "local_user",
      engine: "comfyui",
      status: "unavailable",
      url: "http://localhost:8188",
      message:
        "ComfyUI is not reachable. Start ComfyUI locally before image generation.",
    });
  });

  it("preserves specific readiness failure messages during generation", async () => {
    const fetchImpl = jest
      .fn()
      .mockResolvedValue(jsonResponse({ ok: false, status: 404 }));

    const result = await generateComfyUiImage({
      prompt: "poster art",
      workflowJson: { "1": { inputs: { text: "{{prompt}}" } } },
      fetchImpl,
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      success: false,
      mode: "local_user",
      engine: "comfyui",
      status: "unavailable",
      url: "http://localhost:8188",
      message:
        "ComfyUI returned HTTP 404. Check the configured image engine URL.",
    });
  });

  it("uses the generic unavailable message when no fetch/readiness detail exists", async () => {
    const result = await generateComfyUiImage({
      prompt: "poster art",
      workflowJson: { "1": { inputs: { text: "{{prompt}}" } } },
      fetchImpl: null,
    });

    expect(result).toEqual({
      success: false,
      mode: "local_user",
      engine: "comfyui",
      status: "unavailable",
      url: "http://localhost:8188",
      message:
        "ComfyUI is not connected. Start your local image engine before image generation.",
    });
  });

  it("requires object-shaped workflow JSON and does not auto-select or download models", async () => {
    const fetchImpl = jest.fn().mockResolvedValue(jsonResponse());

    const result = await generateComfyUiImage({
      prompt: "poster art",
      workflow: "default",
      fetchImpl,
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchImpl).not.toHaveBeenCalledWith(
      expect.stringContaining("/prompt"),
      expect.any(Object)
    );
    expect(result).toMatchObject({
      success: false,
      status: "invalid_request",
      message:
        "ComfyUI generation requires a user-provided workflow JSON object for this MVP.",
    });
  });

  it("hydrates workflow string leaves safely without reparsing JSON text", () => {
    const workflowJson = {
      "1": {
        inputs: {
          text: "{{prompt}}",
          negative: "{{negativePrompt}}",
          width: "{{width}}",
          height: "{{height}}",
          seed: "{{seed}}",
          label: "poster {{width}}x{{height}} seed {{seed}}: {{prompt}}",
          unchangedNumber: 7,
          unchangedBoolean: true,
          unchangedNull: null,
          array: ["{{prompt}}", "keep me", 99],
        },
      },
    };

    const result = resolveWorkflowPayload({
      workflowJson,
      prompt:
        'a sign reading "HIVE" with \\slashes\nnew line and literal {{seed}} graffiti',
      negativePrompt: 'bad "letters"\nlow quality',
      seed: 123456,
      size: "768x512",
    });

    expect(result.error).toBeUndefined();
    expect(result.workflow["1"].inputs).toEqual({
      text: 'a sign reading "HIVE" with \\slashes\nnew line and literal {{seed}} graffiti',
      negative: 'bad "letters"\nlow quality',
      width: 768,
      height: 512,
      seed: 123456,
      label:
        'poster 768x512 seed 123456: a sign reading "HIVE" with \\slashes\nnew line and literal {{seed}} graffiti',
      unchangedNumber: 7,
      unchangedBoolean: true,
      unchangedNull: null,
      array: [
        'a sign reading "HIVE" with \\slashes\nnew line and literal {{seed}} graffiti',
        "keep me",
        99,
      ],
    });
  });

  it("keeps whole width height and seed placeholders numeric", () => {
    const result = resolveWorkflowPayload({
      workflowJson: {
        inputs: {
          width: "{{width}}",
          height: "{{height}}",
          seed: "{{seed}}",
        },
      },
      prompt: "poster",
      negativePrompt: "",
      seed: 42,
      size: "640x384",
    });

    expect(result.workflow.inputs).toEqual({
      width: 640,
      height: 384,
      seed: 42,
    });
    expect(typeof result.workflow.inputs.width).toBe("number");
    expect(typeof result.workflow.inputs.height).toBe("number");
    expect(typeof result.workflow.inputs.seed).toBe("number");
  });

  it("returns invalid_request for non-object workflowJson", async () => {
    const fetchImpl = jest.fn().mockResolvedValue(jsonResponse());

    const result = await generateComfyUiImage({
      prompt: "poster art",
      workflowJson: ["not", "an", "object"],
      fetchImpl,
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchImpl).not.toHaveBeenCalledWith(
      expect.stringContaining("/prompt"),
      expect.any(Object)
    );
    expect(result).toMatchObject({
      success: false,
      status: "invalid_request",
      message:
        "ComfyUI generation requires a user-provided workflow JSON object for this MVP.",
    });
  });

  it("does not follow ComfyUI redirects during prompt submission", async () => {
    const fetchImpl = jest
      .fn()
      .mockResolvedValueOnce(jsonResponse())
      .mockResolvedValueOnce(jsonResponse({ ok: false, status: 302 }));

    const result = await generateComfyUiImage({
      prompt: "poster art",
      workflowJson: { "1": { inputs: { text: "{{prompt}}" } } },
      fetchImpl,
    });

    expect(fetchImpl).toHaveBeenNthCalledWith(
      2,
      "http://localhost:8188/prompt",
      expect.objectContaining({ redirect: "manual" })
    );
    expect(result).toMatchObject({
      success: false,
      status: "failed",
      message: "ComfyUI generation request returned HTTP 302.",
    });
  });

  it("handles ComfyUI non-OK generation response clearly", async () => {
    const fetchImpl = jest
      .fn()
      .mockResolvedValueOnce(jsonResponse())
      .mockResolvedValueOnce(jsonResponse({ ok: false, status: 500 }));

    const result = await generateComfyUiImage({
      prompt: "poster art",
      workflowJson: { "1": { inputs: { text: "{{prompt}}" } } },
      fetchImpl,
    });

    expect(result).toMatchObject({
      success: false,
      status: "failed",
      message: "ComfyUI generation request returned HTTP 500.",
    });
  });

  it("returns normalized image metadata after mocked ComfyUI generation succeeds", async () => {
    const fetchImpl = mockSuccessfulComfyUiFetch();

    const result = await generateComfyUiImage({
      prompt: "high contrast stencil street art",
      negativePrompt: "blurry, low quality",
      size: "1024x1024",
      seed: 123456,
      workflow: { "1": { inputs: { text: "{{prompt}}", seed: "{{seed}}" } } },
      fetchImpl,
      pollIntervalMs: 0,
      now: () => new Date("2026-06-05T00:00:00.000Z"),
    });

    expect(fetchImpl).toHaveBeenNthCalledWith(1, "http://localhost:8188", {
      method: "GET",
      redirect: "manual",
      signal: expect.any(AbortSignal),
    });
    expect(fetchImpl).toHaveBeenNthCalledWith(
      2,
      "http://localhost:8188/prompt",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: fetchImpl.mock.calls[1][1].body,
        redirect: "manual",
        signal: expect.any(AbortSignal),
      }
    );
    expect(fetchImpl.mock.calls[1][1].body).toContain(
      "high contrast stencil street art"
    );
    expect(fetchImpl.mock.calls[1][1].body).toContain("123456");
    expect(fetchImpl).toHaveBeenNthCalledWith(
      3,
      "http://localhost:8188/history/abc-123",
      { method: "GET", redirect: "manual", signal: expect.any(AbortSignal) }
    );
    expect(fetchImpl).toHaveBeenNthCalledWith(
      4,
      "http://localhost:8188/view?filename=swarmsy.png&type=output",
      { method: "GET", redirect: "manual", signal: expect.any(AbortSignal) }
    );
    expect(result).toEqual({
      success: true,
      mode: "local_user",
      engine: "comfyui",
      status: "completed",
      image: {
        filename: "swarmsy.png",
        subfolder: "",
        type: "output",
        url: "http://localhost:8188/view?filename=swarmsy.png&type=output",
        mimeType: "image/png",
      },
      metadata: {
        prompt: "high contrast stencil street art",
        negativePrompt: "blurry, low quality",
        seed: 123456,
        size: "1024x1024",
        workflow: "user_supplied",
        promptId: "abc-123",
        createdAt: "2026-06-05T00:00:00.000Z",
      },
    });
  });

  it("reports user_supplied metadata when workflowJson has no explicit label", async () => {
    const fetchImpl = mockSuccessfulComfyUiFetch();

    const result = await generateComfyUiImage({
      prompt: 'a sign reading "HIVE"',
      workflowJson: {
        "1": {
          inputs: {
            text: "{{prompt}}",
            width: "{{width}}",
            height: "{{height}}",
            seed: "{{seed}}",
          },
        },
      },
      seed: 999,
      size: "512x512",
      fetchImpl,
      pollIntervalMs: 0,
      now: () => new Date("2026-06-05T00:00:00.000Z"),
    });

    expect(result.success).toBe(true);
    expect(result.metadata.workflow).toBe("user_supplied");
    expect(submittedWorkflow(fetchImpl)["1"].inputs).toEqual({
      text: 'a sign reading "HIVE"',
      width: 512,
      height: 512,
      seed: 999,
    });
  });

  it("keeps explicit workflow labels in success metadata", async () => {
    const fetchImpl = mockSuccessfulComfyUiFetch();

    const result = await generateComfyUiImage({
      prompt: "street poster",
      workflow: "street-art-workflow-v1",
      workflowJson: { "1": { inputs: { text: "{{prompt}}" } } },
      fetchImpl,
      pollIntervalMs: 0,
      now: () => new Date("2026-06-05T00:00:00.000Z"),
    });

    expect(result.success).toBe(true);
    expect(result.metadata.workflow).toBe("street-art-workflow-v1");
  });

  it("caps per-poll history request timeout", async () => {
    const setTimeoutSpy = jest.spyOn(global, "setTimeout");
    const fetchImpl = mockSuccessfulComfyUiFetch();

    try {
      await generateComfyUiImage({
        prompt: "street poster",
        workflowJson: { "1": { inputs: { text: "{{prompt}}" } } },
        fetchImpl,
        pollIntervalMs: 0,
        timeoutMs: 10_000,
      });

      expect(setTimeoutSpy.mock.calls.map(([, delay]) => delay)).toContain(
        DEFAULT_POLL_REQUEST_TIMEOUT_MS
      );
    } finally {
      setTimeoutSpy.mockRestore();
    }
  });

  it("returns a clear failure when max poll attempts are exhausted", async () => {
    const fetchImpl = jest
      .fn()
      .mockResolvedValueOnce(jsonResponse())
      .mockResolvedValueOnce(
        jsonResponse({ body: { prompt_id: "abc-123", number: 1 } })
      )
      .mockResolvedValue(
        jsonResponse({ body: { "abc-123": { outputs: {} } } })
      );

    const result = await generateComfyUiImage({
      prompt: "street poster",
      workflowJson: { "1": { inputs: { text: "{{prompt}}" } } },
      fetchImpl,
      pollIntervalMs: 0,
      maxPollAttempts: 2,
    });

    expect(fetchImpl).toHaveBeenCalledTimes(4);
    expect(result).toMatchObject({
      success: false,
      status: "failed",
      message: "ComfyUI generation did not finish before the polling timeout.",
    });
  });

  it("cancels the image response body after successful retrieval", async () => {
    const cancel = jest.fn().mockResolvedValue(undefined);
    const fetchImpl = jest
      .fn()
      .mockResolvedValueOnce(jsonResponse())
      .mockResolvedValueOnce(
        jsonResponse({ body: { prompt_id: "abc-123", number: 1 } })
      )
      .mockResolvedValueOnce(
        jsonResponse({
          body: {
            "abc-123": {
              outputs: {
                "9": {
                  images: [{ filename: "swarmsy.png", type: "output" }],
                },
              },
            },
          },
        })
      )
      .mockResolvedValueOnce(
        jsonResponse({
          headers: { "content-type": "image/png" },
          responseBody: { cancel },
        })
      );

    const result = await generateComfyUiImage({
      prompt: "street poster",
      workflowJson: { "1": { inputs: { text: "{{prompt}}" } } },
      fetchImpl,
      pollIntervalMs: 0,
    });

    expect(result.success).toBe(true);
    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it("does not require an image response body cancel method", async () => {
    const fetchImpl = mockSuccessfulComfyUiFetch();

    const result = await generateComfyUiImage({
      prompt: "street poster",
      workflowJson: { "1": { inputs: { text: "{{prompt}}" } } },
      fetchImpl,
      pollIntervalMs: 0,
    });

    expect(result.success).toBe(true);
  });

  it("blocks non-local image engine URLs so online APIs are not called", async () => {
    const fetchImpl = jest.fn();

    const result = await generateComfyUiImage({
      prompt: "poster art",
      workflowJson: { "1": {} },
      url: "https://api.example.com/comfy",
      fetchImpl,
    });

    expect(fetchImpl).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      success: false,
      status: "blocked",
      message:
        "ComfyUI generation is local-only. Configure a local ComfyUI URL.",
    });
  });

  it("uses COMFYUI_BASE_URL service URLs for hosted generation without allowing public URLs", async () => {
    process.env.COMFYUI_BASE_URL = "http://comfyui:8188/";
    const fetchImpl = mockSuccessfulComfyUiFetch();

    const result = await generateComfyUiImage({
      prompt: "hosted server poster",
      workflowJson: { "1": { inputs: { text: "{{prompt}}" } } },
      fetchImpl,
      pollIntervalMs: 0,
    });

    expect(result.success).toBe(true);
    expect(fetchImpl.mock.calls[0][0]).toBe("http://comfyui:8188");
    expect(fetchImpl.mock.calls[1][0]).toBe("http://comfyui:8188/prompt");
  });

  it("allows only local/private ComfyUI URLs", () => {
    expect(isLocalComfyUiUrl("http://localhost:8188")).toBe(true);
    expect(isLocalComfyUiUrl("http://127.0.0.1:8188")).toBe(true);
    expect(isLocalComfyUiUrl("http://10.0.0.2:8188")).toBe(true);
    expect(isLocalComfyUiUrl("http://192.168.1.50:8188")).toBe(true);
    expect(isLocalComfyUiUrl("http://172.16.0.5:8188")).toBe(true);
    expect(isLocalComfyUiUrl("http://172.31.255.255:8188")).toBe(true);
    expect(isLocalComfyUiUrl("http://[::1]:8188")).toBe(true);
    expect(isLocalComfyUiUrl("http://host.docker.internal:8188")).toBe(true);
    expect(isLocalComfyUiUrl("http://comfyui:8188")).toBe(true);
    expect(isLocalComfyUiUrl("http://comfy.local:8188")).toBe(false);
    expect(isLocalComfyUiUrl("http://0.0.0.0:8188")).toBe(false);
    expect(isLocalComfyUiUrl("http://127.0.0.2:8188")).toBe(false);
    expect(isLocalComfyUiUrl("https://10.evil.com")).toBe(false);
    expect(isLocalComfyUiUrl("https://192.168.attacker.tld")).toBe(false);
    expect(isLocalComfyUiUrl("https://172.16.evil.com")).toBe(false);
    expect(isLocalComfyUiUrl("https://example.com")).toBe(false);
    expect(isLocalComfyUiUrl("https://8.8.8.8:8188")).toBe(false);
    expect(isLocalComfyUiUrl("https://api.openai.com/v1/images")).toBe(false);
  });
});

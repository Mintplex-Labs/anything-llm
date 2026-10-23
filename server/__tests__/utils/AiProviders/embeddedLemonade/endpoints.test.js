let mockEnabled = true;
jest.mock("../../../../utils/AiProviders/embeddedLemonade/config", () => ({
  ...jest.requireActual(
    "../../../../utils/AiProviders/embeddedLemonade/config"
  ),
  isEnabled: () => mockEnabled,
}));

const {
  embeddedLemonadeEndpoints,
} = require("../../../../utils/AiProviders/embeddedLemonade/endpoints");
const {
  EmbeddedLemonadeLLM,
} = require("../../../../utils/AiProviders/embeddedLemonade");
const {
  EmbeddedLemonadeEngine,
} = require("../../../../utils/AiProviders/embeddedLemonade/engine");

/** Registers the endpoints on a fake app and returns each route's final handler, keyed "<METHOD> <path>". */
function registerRoutes() {
  const routes = {};
  const app = {};
  for (const method of ["get", "post", "delete"])
    app[method] = (route, _middleware, handler) =>
      (routes[`${method.toUpperCase()} ${route}`] = handler);
  embeddedLemonadeEndpoints(app);
  return routes;
}

function mockResponse() {
  const response = {
    statusCode: 200,
    body: null,
    events: [],
    ended: false,
    writeHead: jest.fn(),
    write: jest.fn((chunk) => {
      const [, event, data] = chunk.match(/^event: (.*)\ndata: (.*)\n\n$/);
      response.events.push({ event, data: JSON.parse(data) });
    }),
    end: jest.fn(() => (response.ended = true)),
    status: jest.fn((code) => {
      response.statusCode = code;
      return response;
    }),
    json: jest.fn((body) => {
      response.body = body;
      return response;
    }),
  };
  return response;
}

/** pullModel that waits until its signal is aborted (or `finish` is called). */
function mockPendingPull() {
  const pulls = [];
  jest
    .spyOn(EmbeddedLemonadeLLM, "pullModel")
    .mockImplementation((modelName, { signal, onProgress }) => {
      return new Promise((resolve, reject) => {
        pulls.push({
          modelName,
          signal,
          onProgress,
          finish: () => resolve({ modelId: modelName }),
        });
        signal.addEventListener("abort", () =>
          reject(new DOMException("aborted", "AbortError"))
        );
      });
    });
  return pulls;
}

const tick = () => new Promise((r) => setImmediate(r));

beforeEach(() => {
  mockEnabled = true;
  jest
    .spyOn(EmbeddedLemonadeEngine, "prepareInBackground")
    .mockImplementation();
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("embeddedLemonadeEndpoints", () => {
  it("registers nothing and starts nothing when the engine is not enabled", () => {
    mockEnabled = false;
    expect(registerRoutes()).toEqual({});
    expect(EmbeddedLemonadeEngine.prepareInBackground).not.toHaveBeenCalled();
  });

  it("starts preparing the engine when it registers", () => {
    const routes = registerRoutes();
    expect(Object.keys(routes).sort()).toEqual([
      "DELETE /utils/embedded-lemonade/download-model",
      "DELETE /utils/embedded-lemonade/remove-model",
      "GET /utils/embedded-lemonade/recommendations",
      "GET /utils/embedded-lemonade/status",
      "POST /utils/embedded-lemonade/download-model",
    ]);
    expect(EmbeddedLemonadeEngine.prepareInBackground).toHaveBeenCalledTimes(1);
  });
});

describe("download-model", () => {
  const DOWNLOAD = "POST /utils/embedded-lemonade/download-model";
  const CANCEL = "DELETE /utils/embedded-lemonade/download-model";

  it("streams progress, deduplicated, then done", async () => {
    const routes = registerRoutes();
    const pulls = mockPendingPull();
    const response = mockResponse();
    const done = routes[DOWNLOAD]({ body: { modelName: "a" } }, response);
    await tick();
    pulls[0].onProgress(10, "Downloading a.gguf");
    pulls[0].onProgress(10, "Downloading a.gguf");
    pulls[0].onProgress(11, "Downloading a.gguf");
    pulls[0].finish();
    await done;

    expect(response.writeHead).toHaveBeenCalledWith(200, expect.any(Object));
    expect(response.events).toEqual([
      {
        event: "progress",
        data: { percentage: 10, status: "Downloading a.gguf" },
      },
      {
        event: "progress",
        data: { percentage: 11, status: "Downloading a.gguf" },
      },
      { event: "done", data: { done: true, modelId: "a" } },
    ]);
    expect(response.ended).toBe(true);
  });

  it("refuses a second download instead of cancelling the first", async () => {
    const routes = registerRoutes();
    const pulls = mockPendingPull();
    const first = mockResponse();
    const firstDone = routes[DOWNLOAD]({ body: { modelName: "a" } }, first);
    await tick();

    const second = mockResponse();
    await routes[DOWNLOAD]({ body: { modelName: "b" } }, second);
    expect(second.statusCode).toBe(409);
    expect(second.body).toEqual({
      error:
        "Another model is already downloading. Wait for it to finish or cancel it.",
    });
    expect(second.writeHead).not.toHaveBeenCalled();
    expect(pulls).toHaveLength(1);
    expect(pulls[0].signal.aborted).toBe(false);

    pulls[0].finish();
    await firstDone;
    expect(first.events.at(-1).event).toBe("done");
  });

  it("allows a new download once the previous one finishes", async () => {
    const routes = registerRoutes();
    const pulls = mockPendingPull();
    const first = routes[DOWNLOAD](
      { body: { modelName: "a" } },
      mockResponse()
    );
    await tick();
    pulls[0].finish();
    await first;

    const second = mockResponse();
    const secondDone = routes[DOWNLOAD]({ body: { modelName: "b" } }, second);
    await tick();
    expect(pulls).toHaveLength(2);
    pulls[1].finish();
    await secondDone;
    expect(second.events.at(-1)).toEqual({
      event: "done",
      data: { done: true, modelId: "b" },
    });
  });

  it("cancels the download in flight", async () => {
    const routes = registerRoutes();
    mockPendingPull();
    const response = mockResponse();
    const done = routes[DOWNLOAD]({ body: { modelName: "a" } }, response);
    await tick();

    const cancel = mockResponse();
    await routes[CANCEL]({}, cancel);
    await done;
    expect(cancel.body).toEqual({ success: true });
    expect(response.events).toEqual([
      { event: "error", data: { error: "Download cancelled." } },
    ]);
    expect(console.error).not.toHaveBeenCalled();
  });

  it("reports a failed download and frees the slot", async () => {
    const routes = registerRoutes();
    jest
      .spyOn(EmbeddedLemonadeLLM, "pullModel")
      .mockRejectedValueOnce(new Error("disk full"));
    const response = mockResponse();
    await routes[DOWNLOAD]({ body: { modelName: "a" } }, response);
    expect(response.events).toEqual([
      { event: "error", data: { error: "disk full" } },
    ]);

    const pulls = mockPendingPull();
    const next = routes[DOWNLOAD]({ body: { modelName: "b" } }, mockResponse());
    await tick();
    expect(pulls).toHaveLength(1);
    pulls[0].finish();
    await next;
  });

  it("is a no-op to cancel when nothing is downloading", async () => {
    const routes = registerRoutes();
    const cancel = mockResponse();
    await routes[CANCEL]({}, cancel);
    expect(cancel.body).toEqual({ success: true });
  });
});

describe("remove-model", () => {
  const REMOVE = "DELETE /utils/embedded-lemonade/remove-model";

  it("removes the model", async () => {
    const routes = registerRoutes();
    const remove = jest
      .spyOn(EmbeddedLemonadeLLM, "deleteModel")
      .mockResolvedValue(true);
    const response = mockResponse();
    await routes[REMOVE](
      { body: JSON.stringify({ modelName: "a" }) },
      response
    );
    expect(remove).toHaveBeenCalledWith("a");
    expect(response.body).toEqual({ success: true, error: null });
  });

  it("returns lemond's error", async () => {
    const routes = registerRoutes();
    jest
      .spyOn(EmbeddedLemonadeLLM, "deleteModel")
      .mockRejectedValue(new Error("in use"));
    const response = mockResponse();
    await routes[REMOVE]({ body: { modelName: "a" } }, response);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ success: false, error: "in use" });
  });
});

describe("status and recommendations", () => {
  it("returns the engine status", async () => {
    const routes = registerRoutes();
    EmbeddedLemonadeEngine.status = {
      state: "installing",
      message: "Downloading",
      progress: 40,
    };
    const response = mockResponse();
    await routes["GET /utils/embedded-lemonade/status"]({}, response);
    expect(response.body).toEqual({
      state: "installing",
      message: "Downloading",
      progress: 40,
    });
  });

  it("returns no recommendations when the models cannot be listed", async () => {
    const routes = registerRoutes();
    jest
      .spyOn(EmbeddedLemonadeLLM, "availableModels")
      .mockRejectedValue(new Error("boom"));
    const response = mockResponse();
    await routes["GET /utils/embedded-lemonade/recommendations"]({}, response);
    expect(response.body).toEqual({ recommendations: [] });
  });
});

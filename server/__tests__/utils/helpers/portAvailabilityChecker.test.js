/* eslint-env jest */

const net = require("net");
const os = require("os");

jest.mock("../../../models/telemetry", () => ({ Telemetry: {} }));
jest.mock("../../../models/eventLogs", () => ({
  EventLogs: { logEvent: jest.fn() },
}));
jest.mock("../../../utils/vectorStore/resetAllVectorStores", () => ({
  resetAllVectorStores: jest.fn(),
}));

const {
  getLocalHosts,
} = require("../../../utils/helpers/portAvailabilityChecker");
const { updateENV } = require("../../../utils/helpers/updateENV");

const ORIGINAL_ENV = process.env;
const networkAddresses = Object.values(os.networkInterfaces())
  .flat()
  .map(({ address }) => address);
const hasIPv6Loopback = networkAddresses.includes("::1");

function getFreePort(host) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);
    server.listen({ port: 0, host }, () => {
      const { port } = server.address();
      server.close((error) => (error ? reject(error) : resolve(port)));
    });
  });
}

function listenOnRandomPort(host) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);
    server.listen({ port: 0, host }, () => resolve(server));
  });
}

function closeServer(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    ANYTHING_LLM_RUNTIME: "docker",
    NODE_ENV: "test",
    OLLAMA_BASE_PATH: "unchanged",
  };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
});

describe("getLocalHosts", () => {
  it("includes localhost without changing interface addresses", () => {
    const localHosts = getLocalHosts();

    expect(localHosts).toContain("localhost");
    expect(localHosts).toEqual(expect.arrayContaining(networkAddresses));
    expect(localHosts.some((host) => host?.startsWith("127."))).toBe(true);
  });
});

describe("updateENV docker loopback validation", () => {
  async function expectLoopbackError(host) {
    const port = await getFreePort(host);
    const { error } = await updateENV({
      OllamaLLMBasePath: `http://${host.includes(":") ? `[${host}]` : host}:${port}`,
    });

    expect(error).toContain("loopback address");
    expect(process.env.OLLAMA_BASE_PATH).toBe("unchanged");
  }

  it("rejects localhost", async () => {
    const port = await getFreePort("127.0.0.1");
    const { error } = await updateENV({
      OllamaLLMBasePath: `http://localhost:${port}`,
    });

    expect(error).toContain("loopback address");
    expect(process.env.OLLAMA_BASE_PATH).toBe("unchanged");
  });

  it("accepts localhost when a service listens on IPv4 loopback", async () => {
    const server = await listenOnRandomPort("127.0.0.1");

    try {
      const { port } = server.address();
      const url = `http://localhost:${port}`;
      const { error } = await updateENV({ OllamaLLMBasePath: url });

      expect(error).toBe(false);
      expect(process.env.OLLAMA_BASE_PATH).toBe(url);
    } finally {
      await closeServer(server);
    }
  });

  (hasIPv6Loopback ? it : it.skip)(
    "accepts localhost when a service listens on IPv6 loopback",
    async () => {
      const server = await listenOnRandomPort("::1");

      try {
        const { port } = server.address();
        const url = `http://localhost:${port}`;
        const { error } = await updateENV({ OllamaLLMBasePath: url });

        expect(error).toBe(false);
        expect(process.env.OLLAMA_BASE_PATH).toBe(url);
      } finally {
        await closeServer(server);
      }
    }
  );

  it("continues to reject IPv4 loopback", async () => {
    await expectLoopbackError("127.0.0.1");
  });

  (hasIPv6Loopback ? it : it.skip)("rejects IPv6 loopback", async () => {
    await expectLoopbackError("::1");
  });

  it("does not report a loopback error for a non-loopback host", async () => {
    const url = "http://host.docker.internal:11434";
    const { error } = await updateENV({ OllamaLLMBasePath: url });

    expect(error).toBe(false);
    expect(process.env.OLLAMA_BASE_PATH).toBe(url);
  });
});

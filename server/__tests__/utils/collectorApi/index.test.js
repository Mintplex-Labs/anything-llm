/* eslint-env jest */
const { CollectorApi } = require("../../../utils/collectorApi");

describe("CollectorApi endpoint", () => {
  const originalPort = process.env.COLLECTOR_PORT;

  afterEach(() => {
    if (originalPort === undefined) delete process.env.COLLECTOR_PORT;
    else process.env.COLLECTOR_PORT = originalPort;
  });

  test("fetches the collector on loopback, not the 0.0.0.0 bind address", () => {
    delete process.env.COLLECTOR_PORT;
    const api = new CollectorApi();
    expect(new URL(api.endpoint).hostname).toBe("127.0.0.1");
    expect(api.endpoint).toBe(
      `http://127.0.0.1:${CollectorApi.DEFAULT_COLLECTOR_PORT}`
    );
  });

  test("keeps an explicit COLLECTOR_PORT on the loopback host", () => {
    process.env.COLLECTOR_PORT = "8899";
    const api = new CollectorApi();
    expect(api.endpoint).toBe("http://127.0.0.1:8899");
  });
});

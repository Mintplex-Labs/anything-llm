/* eslint-env jest */

const {
  getFetchWithCustomTimeout,
} = require("../../../../utils/AiProviders/helpers");

describe("getFetchWithCustomTimeout", () => {
  let slog;
  let originalFetch;

  beforeEach(() => {
    slog = jest.fn();
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test("returns the global fetch when value is undefined", () => {
    expect(getFetchWithCustomTimeout(undefined, slog)).toBe(global.fetch);
    expect(slog).toHaveBeenCalledTimes(1);
    expect(slog.mock.calls[0][0]).toMatch(/falling back to default fetch/i);
  });

  test("returns the global fetch when value is null", () => {
    expect(getFetchWithCustomTimeout(null, slog)).toBe(global.fetch);
    expect(slog).toHaveBeenCalledTimes(1);
  });

  test("returns the global fetch when value is empty string", () => {
    expect(getFetchWithCustomTimeout("", slog)).toBe(global.fetch);
    expect(slog).toHaveBeenCalledTimes(1);
  });

  test("returns the global fetch when value is non-numeric", () => {
    expect(getFetchWithCustomTimeout("abc", slog)).toBe(global.fetch);
    const logMessages = slog.mock.calls.map((c) => c[0]);
    expect(logMessages).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/Error parsing response timeout value/i),
        expect.stringMatching(/falling back to default fetch/i),
      ])
    );
  });

  test("returns the global fetch when value is zero", () => {
    expect(getFetchWithCustomTimeout("0", slog)).toBe(global.fetch);
    const logMessages = slog.mock.calls.map((c) => c[0]);
    expect(logMessages).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/Error parsing response timeout value/i),
        expect.stringMatching(/falling back to default fetch/i),
      ])
    );
  });

  test("returns the global fetch when value is negative", () => {
    expect(getFetchWithCustomTimeout("-1", slog)).toBe(global.fetch);
    const logMessages = slog.mock.calls.map((c) => c[0]);
    expect(logMessages).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/Error parsing response timeout value/i),
        expect.stringMatching(/falling back to default fetch/i),
      ])
    );
  });

  test("returns a wrapper fetch when given a valid positive integer", () => {
    const wrapped = getFetchWithCustomTimeout("60000", slog);
    expect(typeof wrapped).toBe("function");
    expect(wrapped).not.toBe(global.fetch);
    expect(slog).toHaveBeenCalledTimes(1);
    expect(slog.mock.calls[0][0]).toMatch(/Applying custom fetch/i);
  });

  test("wrapper fetch calls global fetch with an undici Agent dispatcher", async () => {
    const fetchMock = jest.fn().mockResolvedValue("ok");
    global.fetch = fetchMock;

    const wrapped = getFetchWithCustomTimeout("60000", slog);
    await wrapped("https://example.com", { method: "POST" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [input, init] = fetchMock.mock.calls[0];
    expect(input).toBe("https://example.com");
    expect(init.method).toBe("POST");

    const { Agent } = require("undici");
    expect(init.dispatcher).toBeInstanceOf(Agent);
  });

  test("wrapper fetch agent sets both headersTimeout and bodyTimeout", async () => {
    const fetchMock = jest.fn().mockResolvedValue("ok");
    global.fetch = fetchMock;

    const undici = require("undici");
    const OriginalAgent = undici.Agent;
    const observed = [];
    undici.Agent = function MockAgent(opts) {
      observed.push(opts);
      return new OriginalAgent(opts);
    };

    try {
      const wrapped = getFetchWithCustomTimeout("60000", slog);
      await wrapped("https://example.com");

      expect(observed).toHaveLength(1);
      expect(observed[0]).toEqual({
        headersTimeout: 60000,
        bodyTimeout: 60000,
      });
    } finally {
      undici.Agent = OriginalAgent;
    }
  });

  test("wrapper fetch works when no init is provided", async () => {
    const fetchMock = jest.fn().mockResolvedValue("ok");
    global.fetch = fetchMock;

    const wrapped = getFetchWithCustomTimeout("60000", slog);
    await wrapped("https://example.com");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0];
    expect(init.dispatcher).toBeDefined();
  });

  describe("fallbackTimeoutValue", () => {
    test("uses fallback when raw value is undefined", () => {
      const wrapped = getFetchWithCustomTimeout(undefined, slog, 5000);
      expect(typeof wrapped).toBe("function");
      expect(wrapped).not.toBe(global.fetch);
      expect(slog.mock.calls[0][0]).toMatch(/Applying custom fetch/i);
    });

    test("uses fallback when raw value is empty string", () => {
      const wrapped = getFetchWithCustomTimeout("", slog, 5000);
      expect(wrapped).not.toBe(global.fetch);
      expect(slog.mock.calls[0][0]).toMatch(/Applying custom fetch/i);
    });

    test("uses fallback when raw value fails to parse, and still logs the parse error", () => {
      const wrapped = getFetchWithCustomTimeout("abc", slog, 5000);
      expect(wrapped).not.toBe(global.fetch);
      const logMessages = slog.mock.calls.map((c) => c[0]);
      expect(logMessages).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/Error parsing response timeout value/i),
          expect.stringMatching(/Applying custom fetch/i),
        ])
      );
    });

    test("raw value takes precedence over fallback when valid", async () => {
      const fetchMock = jest.fn().mockResolvedValue("ok");
      global.fetch = fetchMock;
      const undici = require("undici");
      const OriginalAgent = undici.Agent;
      const observed = [];
      undici.Agent = function MockAgent(opts) {
        observed.push(opts);
        return new OriginalAgent(opts);
      };

      try {
        const wrapped = getFetchWithCustomTimeout("60000", slog, 5000);
        await wrapped("https://example.com");
        expect(observed[0]).toEqual({
          headersTimeout: 60000,
          bodyTimeout: 60000,
        });
      } finally {
        undici.Agent = OriginalAgent;
      }
    });

    test("returns global fetch when raw is missing and fallback is zero", () => {
      expect(getFetchWithCustomTimeout(undefined, slog, 0)).toBe(global.fetch);
      expect(slog.mock.calls[0][0]).toMatch(/falling back to default fetch/i);
    });
  });
});

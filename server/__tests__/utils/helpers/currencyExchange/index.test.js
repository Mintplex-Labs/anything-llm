const fs = require("fs");
const os = require("os");
const path = require("path");

process.env.NODE_ENV = "test";

const FRANKFURTER_RESPONSE = {
  amount: 1,
  base: "USD",
  date: "2026-08-06",
  rates: {
    EUR: 0.85,
    GBP: 0.74,
    JPY: 147.2,
    CAD: 1.37,
  },
};

/**
 * The module memoizes a singleton at require time, so every test builds its
 * own instance against a fresh temp STORAGE_DIR and a mocked global fetch.
 */
function freshInstance() {
  const {
    CurrencyExchange,
  } = require("../../../../utils/helpers/currencyExchange");
  CurrencyExchange.instance = null;
  return new CurrencyExchange();
}

function mockFetchWith(response) {
  global.fetch = jest.fn().mockImplementation(async () => response);
}

function okResponse(data) {
  return {
    status: 200,
    json: async () => data,
  };
}

describe("CurrencyExchange", () => {
  let tempDir;
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.resetModules();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "currency-exchange-test-"));
    process.env.STORAGE_DIR = tempDir;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe("cache mechanics", () => {
    it("fetches the remote rates and writes the disk cache", async () => {
      mockFetchWith(okResponse(FRANKFURTER_RESPONSE));
      const exchange = freshInstance();
      const rates = await exchange.getRates();

      expect(rates).toEqual({
        EUR: 0.85,
        GBP: 0.74,
        JPY: 147.2,
        CAD: 1.37,
        USD: 1,
      });

      const cacheDir = path.join(tempDir, "currency");
      expect(fs.existsSync(path.join(cacheDir, "exchange-rates.json"))).toBe(
        true
      );
      expect(fs.existsSync(path.join(cacheDir, ".cached_at"))).toBe(true);
      expect(exchange.isCacheStale).toBe(false);
    });

    it("serves rates from the disk cache without refetching when fresh", async () => {
      mockFetchWith(okResponse(FRANKFURTER_RESPONSE));
      await freshInstance().getRates();

      jest.resetModules();
      const fetchSpy = jest.fn();
      global.fetch = fetchSpy;
      const rates = await freshInstance().getRates();

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(rates.EUR).toBe(0.85);
    });

    it("refetches when the disk cache is older than the expiry", async () => {
      mockFetchWith(okResponse(FRANKFURTER_RESPONSE));
      await freshInstance().getRates();

      // Age the cache far past expiry, then serve different rates remotely.
      fs.writeFileSync(path.join(tempDir, "currency", ".cached_at"), "0");
      jest.resetModules();
      mockFetchWith(
        okResponse({ ...FRANKFURTER_RESPONSE, rates: { EUR: 0.9 } })
      );
      const rates = await freshInstance().getRates();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(rates).toEqual({ EUR: 0.9, USD: 1 });
    });

    it("treats a corrupted .cached_at timestamp as stale", async () => {
      mockFetchWith(okResponse(FRANKFURTER_RESPONSE));
      const exchange = freshInstance();
      await exchange.getRates();

      fs.writeFileSync(
        path.join(tempDir, "currency", ".cached_at"),
        "not-a-number"
      );
      expect(exchange.isCacheStale).toBe(true);
    });

    it("de-dupes concurrent refreshes into a single fetch", async () => {
      mockFetchWith(okResponse(FRANKFURTER_RESPONSE));
      const exchange = freshInstance();
      const [a, b] = await Promise.all([
        exchange.getRates(),
        exchange.getRates(),
      ]);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(a).toEqual(b);
    });

    it("fetches with an abort signal so a hung upstream cannot stall requests", async () => {
      mockFetchWith(okResponse(FRANKFURTER_RESPONSE));
      await freshInstance().getRates();

      const [, options] = global.fetch.mock.calls[0];
      expect(options?.signal).toBeInstanceOf(AbortSignal);
    });

    it("returns a copy so callers cannot mutate the memoized rates", async () => {
      mockFetchWith(okResponse(FRANKFURTER_RESPONSE));
      const exchange = freshInstance();

      const rates = await exchange.getRates();
      rates.EUR = 9999;
      delete rates.USD;

      expect(await exchange.getRates()).toEqual({
        EUR: 0.85,
        GBP: 0.74,
        JPY: 147.2,
        CAD: 1.37,
        USD: 1,
      });
    });
  });

  describe("failure handling", () => {
    it("returns null when no rates have ever been fetched and the remote fails", async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error("network down"));
      const rates = await freshInstance().getRates();
      expect(rates).toBeNull();
    });

    it("serves stale disk rates when the remote is unreachable", async () => {
      mockFetchWith(okResponse(FRANKFURTER_RESPONSE));
      await freshInstance().getRates();

      // Age the cache so a refresh is attempted, then kill the network.
      fs.writeFileSync(path.join(tempDir, "currency", ".cached_at"), "0");
      jest.resetModules();
      global.fetch = jest.fn().mockRejectedValue(new Error("network down"));
      const rates = await freshInstance().getRates();

      expect(rates.EUR).toBe(0.85);
    });

    it("keeps existing rates when the remote returns a non-200 status", async () => {
      mockFetchWith(okResponse(FRANKFURTER_RESPONSE));
      await freshInstance().getRates();

      fs.writeFileSync(path.join(tempDir, "currency", ".cached_at"), "0");
      jest.resetModules();
      mockFetchWith({ status: 503, json: async () => ({}) });
      const rates = await freshInstance().getRates();

      expect(rates.EUR).toBe(0.85);
    });

    it("retries the remote on the next call after a failed refresh", async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error("network down"));
      const exchange = freshInstance();
      expect(await exchange.getRates()).toBeNull();

      mockFetchWith(okResponse(FRANKFURTER_RESPONSE));
      const rates = await exchange.getRates();
      expect(rates.EUR).toBe(0.85);
    });

    it("survives a corrupted disk cache file", async () => {
      mockFetchWith(okResponse(FRANKFURTER_RESPONSE));
      await freshInstance().getRates();

      fs.writeFileSync(
        path.join(tempDir, "currency", "exchange-rates.json"),
        "{not json"
      );
      jest.resetModules();
      mockFetchWith(okResponse(FRANKFURTER_RESPONSE));
      const rates = await freshInstance().getRates();

      expect(rates.EUR).toBe(0.85);
    });
  });

  describe("payload sanitization", () => {
    it("drops unsupported currencies and non-numeric or non-positive rates", async () => {
      mockFetchWith(
        okResponse({
          rates: {
            EUR: 0.85,
            FAKE: 2, // not a supported currency
            GBP: "0.74", // numeric string is not trusted
            JPY: -5, // negative
            CAD: Infinity, // non-finite
            CHF: 0, // zero would divide costs away
          },
        })
      );
      const rates = await freshInstance().getRates();
      expect(rates).toEqual({ EUR: 0.85, USD: 1 });
    });

    it("treats a payload with no usable rates as a failed refresh", async () => {
      mockFetchWith(okResponse({ rates: { FAKE: 2 } }));
      const rates = await freshInstance().getRates();
      expect(rates).toBeNull();
    });

    it("treats a malformed payload as a failed refresh", async () => {
      mockFetchWith(okResponse({ rates: "not-an-object" }));
      expect(await freshInstance().getRates()).toBeNull();

      jest.resetModules();
      mockFetchWith(okResponse(null));
      expect(await freshInstance().getRates()).toBeNull();
    });
  });

  describe("isSupportedCurrency", () => {
    it("accepts only known currency codes", () => {
      const {
        isSupportedCurrency,
      } = require("../../../../utils/helpers/currencyExchange");
      expect(isSupportedCurrency("USD")).toBe(true);
      expect(isSupportedCurrency("EUR")).toBe(true);
      expect(isSupportedCurrency("FAKE")).toBe(false);
      expect(isSupportedCurrency("usd")).toBe(false);
      expect(isSupportedCurrency(null)).toBe(false);
      expect(isSupportedCurrency(42)).toBe(false);
    });
  });

  describe("display_currency validation", () => {
    it("accepts supported currencies and falls back to USD otherwise", () => {
      const { SystemSettings } = require("../../../../models/systemSettings");
      expect(SystemSettings.validations.display_currency("EUR")).toBe("EUR");
      expect(SystemSettings.validations.display_currency("USD")).toBe("USD");
      expect(SystemSettings.validations.display_currency("FAKE")).toBe("USD");
      expect(SystemSettings.validations.display_currency(null)).toBe("USD");
    });
  });
});

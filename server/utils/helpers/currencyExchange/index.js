const path = require("path");
const fs = require("fs");

/**
 * Currencies the Frankfurter API can convert USD into. Kept as a static list
 * so the frontend picker and the `display_currency` setting validation never
 * accept a currency we cannot actually convert to. Mirrored in
 * `frontend/src/utils/currency.js` - keep the two lists in sync.
 * @type {string[]}
 */
const SUPPORTED_CURRENCIES = [
  "USD",
  "AUD",
  "BGN",
  "BRL",
  "CAD",
  "CHF",
  "CNY",
  "CZK",
  "DKK",
  "EUR",
  "GBP",
  "HKD",
  "HUF",
  "IDR",
  "ILS",
  "INR",
  "ISK",
  "JPY",
  "KRW",
  "MXN",
  "MYR",
  "NOK",
  "NZD",
  "PHP",
  "PLN",
  "RON",
  "SEK",
  "SGD",
  "THB",
  "TRY",
  "ZAR",
];

/**
 * Checks that a currency code is one we can convert USD into.
 * @param {unknown} code
 * @returns {boolean}
 */
function isSupportedCurrency(code) {
  return typeof code === "string" && SUPPORTED_CURRENCIES.includes(code);
}

class CurrencyExchange {
  static instance = null;
  // FX rates move, but not enough to matter for an informational display -
  // costs are stored in USD and only converted at render time.
  static expiryMs = 1000 * 60 * 60 * 24 * 30; // 30 days
  static remoteUrl = "https://api.frankfurter.dev/v1/latest?base=USD";

  cacheLocation = path.resolve(
    process.env.STORAGE_DIR
      ? path.resolve(process.env.STORAGE_DIR, "currency")
      : path.resolve(__dirname, `../../../storage/currency`)
  );
  cacheFilePath = path.resolve(this.cacheLocation, "exchange-rates.json");
  cacheFileExpiryPath = path.resolve(this.cacheLocation, ".cached_at");

  /** @type {Record<string, number>|null} - memoized units-per-USD rates keyed by currency code */
  #rates = null;
  /** @type {Promise<void>|null} - de-dupes concurrent refreshes */
  #inflightRefresh = null;

  constructor() {
    if (CurrencyExchange.instance) return CurrencyExchange.instance;
    CurrencyExchange.instance = this;
    if (!fs.existsSync(this.cacheLocation))
      fs.mkdirSync(this.cacheLocation, { recursive: true });
    this.#loadFromDisk();
  }

  log(text, ...args) {
    if (process.env.NODE_ENV === "test") return;
    console.log(`\x1b[36m[CurrencyExchange]\x1b[0m ${text}`, ...args);
  }

  /**
   * Checks if the disk cache is older than the expiry time (or missing entirely).
   * @returns {boolean}
   */
  get isCacheStale() {
    if (!fs.existsSync(this.cacheFileExpiryPath)) return true;
    const cachedAt = Number(fs.readFileSync(this.cacheFileExpiryPath, "utf8"));
    // A corrupted timestamp would make every comparison false (NaN) and the
    // cache permanently fresh - treat it as stale so it self-heals.
    if (!Number.isFinite(cachedAt)) return true;
    return Date.now() - cachedAt > CurrencyExchange.expiryMs;
  }

  /** Loads and memoizes the sanitized rates map from the disk cache, if present. */
  #loadFromDisk() {
    try {
      if (!fs.existsSync(this.cacheFilePath)) return;
      this.#rates = this.#sanitize(
        JSON.parse(fs.readFileSync(this.cacheFilePath, { encoding: "utf8" }))
      );
    } catch (error) {
      this.log("Failed to read exchange rate cache from disk", error?.message);
      this.#rates = null;
    }
  }

  /**
   * Keeps only supported currencies whose rate is a positive, finite number
   * so a malformed payload can never produce a nonsense conversion.
   * Returns null when nothing usable remains.
   * @param {unknown} rates
   * @returns {Record<string, number>|null}
   */
  #sanitize(rates) {
    if (!rates || typeof rates !== "object") return null;
    const sanitized = {};
    for (const code of SUPPORTED_CURRENCIES) {
      const rate = rates[code];
      if (typeof rate === "number" && Number.isFinite(rate) && rate > 0)
        sanitized[code] = rate;
    }
    // Frankfurter omits the base currency from its response.
    sanitized.USD = 1;
    return Object.keys(sanitized).length > 1 ? sanitized : null;
  }

  /**
   * Fetches the latest USD-based rates from Frankfurter and caches them to
   * disk + memory. On failure the previously loaded (possibly stale) rates
   * are left in place and `.cached_at` is not written, so the next call
   * retries the remote source.
   */
  async #refresh() {
    try {
      const response = await fetch(CurrencyExchange.remoteUrl);
      if (response.status !== 200)
        throw new Error(
          `Failed to fetch remote exchange rates - status ${response.status}`
        );

      const data = await response.json();
      const rates = this.#sanitize(data?.rates);
      if (!rates)
        throw new Error("Remote exchange rate data contained no usable rates");

      this.#rates = rates;
      await Promise.all([
        fs.promises.writeFile(this.cacheFilePath, JSON.stringify(rates)),
        fs.promises.writeFile(this.cacheFileExpiryPath, Date.now().toString()),
      ]);
      this.log("Remote exchange rates synced and cached.");
    } catch (error) {
      this.log("Error syncing remote exchange rates", error?.message);
    }
  }

  /**
   * Returns the units-per-USD exchange rates, refreshing from the remote
   * source when the disk cache is stale or missing. Serves stale rates when
   * the remote is unreachable, and null when no rates have ever been fetched
   * (callers should then display USD).
   * @returns {Promise<Record<string, number>|null>}
   */
  async getRates() {
    if (this.#rates && !this.isCacheStale) return { ...this.#rates };

    this.#inflightRefresh ??= this.#refresh().finally(
      () => (this.#inflightRefresh = null)
    );
    await this.#inflightRefresh;
    return this.#rates ? { ...this.#rates } : null;
  }
}

const CURRENCY_EXCHANGE = new CurrencyExchange();

module.exports = {
  CurrencyExchange,
  CURRENCY_EXCHANGE,
  SUPPORTED_CURRENCIES,
  isSupportedCurrency,
};

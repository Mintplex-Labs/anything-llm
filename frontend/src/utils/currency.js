import System from "@/models/system";

export const CURRENCY_CHANGE_EVENT = "anythingllm_currency_change";

/**
 * Currencies the server's exchange rate source (Frankfurter) can convert USD
 * into. Mirrored in `server/utils/helpers/currencyExchange/index.js` - keep
 * the two lists in sync.
 */
export const SUPPORTED_CURRENCIES = [
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
 * Module-level cache of the exchange-rates fetch so the many components that
 * render costs (one per chat message) share a single request per page load.
 * @type {Promise<{base: string, currency: string, rates: Record<string, number>|null}|null>|null}
 */
let currencySettingsPromise = null;

/**
 * Fetches the instance display currency and USD exchange rates from our own
 * server (which caches the upstream source). The result is memoized for the
 * lifetime of the page - call `invalidateCurrencySettings` after changing
 * the display currency to force a refetch.
 * @returns {Promise<{base: string, currency: string, rates: Record<string, number>|null}|null>}
 */
export async function getCurrencySettings() {
  currencySettingsPromise ??= System.exchangeRates().then((result) => {
    // Never memoize a failed fetch - let the next caller retry.
    if (!result) currencySettingsPromise = null;
    return result;
  });
  return currencySettingsPromise;
}

/** Clears the memoized currency settings so the next read refetches. */
export function invalidateCurrencySettings() {
  currencySettingsPromise = null;
}

/**
 * Returns the display name of a currency code in the user's language,
 * falling back to the code itself.
 * @param {string} code - ISO 4217 currency code (eg: "EUR")
 * @param {string} [locale] - BCP 47 locale tag (eg: "en")
 * @returns {string}
 */
export function currencyName(code, locale = undefined) {
  try {
    return new Intl.DisplayNames(locale, { type: "currency" }).of(code) ?? code;
  } catch {
    return code;
  }
}

/**
 * Formats a stored USD cost into the given display currency.
 * Precision scales down with the value so tiny per-message costs stay legible:
 * >= 1 shows 2 decimals, >= 0.01 shows up to 4, anything smaller up to 6.
 * @param {number} usd - the cost in USD
 * @param {{currency?: string, rate?: number}} [options] - display currency and its units-per-USD rate
 * @returns {string}
 */
export function formatCost(usd, { currency = "USD", rate = 1 } = {}) {
  if (typeof usd !== "number" || !isFinite(usd)) return "";
  const value = usd * (rate || 1);
  const maxDigits = value >= 1 ? 2 : value >= 0.01 ? 4 : value > 0 ? 6 : 2;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: maxDigits,
    }).format(value);
  } catch {
    return `$${value.toFixed(maxDigits)}`;
  }
}

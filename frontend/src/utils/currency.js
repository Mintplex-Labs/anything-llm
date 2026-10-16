import System from "@/models/system";

export const CURRENCY_CHANGE_EVENT = "anythingllm_currency_change";

const EURO_REGIONS = [
  "AD",
  "AT",
  "BE",
  "BG",
  "CY",
  "DE",
  "EE",
  "ES",
  "FI",
  "FR",
  "GR",
  "HR",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "MC",
  "ME",
  "MT",
  "NL",
  "PT",
  "SI",
  "SK",
  "SM",
  "VA",
  "XK",
];

/** ISO 3166 region -> currency, for the supported non-euro currencies. */
const REGION_CURRENCIES = {
  AU: "AUD",
  BR: "BRL",
  CA: "CAD",
  CH: "CHF",
  LI: "CHF",
  CN: "CNY",
  CZ: "CZK",
  DK: "DKK",
  GB: "GBP",
  HK: "HKD",
  HU: "HUF",
  ID: "IDR",
  IL: "ILS",
  IN: "INR",
  IS: "ISK",
  JP: "JPY",
  KR: "KRW",
  MX: "MXN",
  MY: "MYR",
  NO: "NOK",
  NZ: "NZD",
  PH: "PHP",
  PL: "PLN",
  RO: "RON",
  SE: "SEK",
  SG: "SGD",
  TH: "THB",
  TR: "TRY",
  ZA: "ZAR",
};

/**
 * Infers the currency of the browser's locale region (eg: de-DE -> EUR).
 * Falls back to USD for unsupported or region-less locales.
 * @param {string} [locale] - BCP 47 locale tag
 * @returns {string}
 */
export function localeCurrency(locale = navigator.language) {
  try {
    const { region } = new Intl.Locale(locale).maximize();
    if (EURO_REGIONS.includes(region)) return "EUR";
    return REGION_CURRENCIES[region] ?? "USD";
  } catch {
    return "USD";
  }
}

/**
 * Module-level cache of the exchange-rates fetch so every component that
 * renders costs shares a single request per page load.
 * @type {Promise<import("@/models/system").CurrencySettings|null>|null}
 */
let currencySettingsPromise = null;

/**
 * Fetches the instance display currency and USD exchange rates from our own
 * server (which caches the upstream source). The result is memoized for the
 * lifetime of the page - call `invalidateCurrencySettings` after changing
 * the display currency to force a refetch.
 * @returns {Promise<import("@/models/system").CurrencySettings|null>}
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

import System from "@/models/system";
import { localeCurrency, storeDisplayCurrency } from "@/utils/localeCurrency";

export { localeCurrency };

export const CURRENCY_CHANGE_EVENT = "anythingllm_currency_change";

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
    else storeDisplayCurrency(result.currency);
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
 * Decimals kept by "full" precision. Stored USD costs carry 10 decimals.
 */
const FULL_PRECISION_DIGITS = 10;

/**
 * Number format options for a cost at a given precision.
 * - standard: the currency's minor units (eg: 2 decimals for USD, 0 for JPY)
 * - significant: like standard, but amounts under one currency unit keep 2
 *   significant figures so small per-chat costs do not round to zero
 * - full: every stored decimal, for tooltips
 * @param {number} value - amount in the display currency
 * @param {"standard"|"significant"|"full"} precision
 * @returns {Intl.NumberFormatOptions}
 */
function precisionOptions(value, precision) {
  if (precision === "full")
    return { maximumFractionDigits: FULL_PRECISION_DIGITS };
  if (precision === "significant" && value !== 0 && Math.abs(value) < 1)
    return { minimumSignificantDigits: 2, maximumSignificantDigits: 2 };
  return {};
}

/**
 * Formats a stored USD cost into the given display currency.
 * @param {number} usd - the cost in USD
 * @param {{currency?: string, rate?: number, precision?: "standard"|"significant"|"full"}} [options] - display currency, its units-per-USD rate, and how many digits to show (see `precisionOptions`)
 * @returns {string}
 */
export function formatCost(
  usd,
  { currency = "USD", rate = 1, precision = "standard" } = {}
) {
  if (typeof usd !== "number" || !isFinite(usd)) return "";
  const value = usd * (rate || 1);
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      ...precisionOptions(value, precision),
    }).format(value);
  } catch {
    const digits = precision === "full" ? FULL_PRECISION_DIGITS : 2;
    return `${value.toFixed(digits)} ${currency}`;
  }
}

/**
 * Returns the short symbol of a currency in the user's language, falling back
 * to the code itself.
 * @param {string} code - ISO 4217 currency code (eg: "EUR")
 * @returns {string} eg: "$", "€", "kr"
 */
export function currencySymbol(code) {
  try {
    return (
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: code,
        currencyDisplay: "narrowSymbol",
      })
        .formatToParts(0)
        .find((part) => part.type === "currency")?.value ?? code
    );
  } catch {
    return code;
  }
}

import { safeJsonParse } from "@/utils/request";

const FX_CACHE_KEY = "anythingllm_fx_rates";
const FX_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const FX_RATES_URL = "https://api.frankfurter.dev/v1/latest?base=USD";
export const CURRENCY_CHANGE_EVENT = "anythingllm_currency_change";

/**
 * Currencies the Frankfurter API can convert USD into. Kept as a static list
 * (rather than Intl.supportedValuesOf) so the picker never offers a currency
 * we cannot actually convert to.
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
 * Fetches the latest USD-based exchange rates, cached in localStorage for
 * 24 hours. Returns a stale cache when the API is unreachable, or null when
 * no rates are available at all (callers should then display USD).
 * Never throws.
 * @returns {Promise<{fetchedAt: number, rates: Record<string, number>}|null>}
 */
export async function getExchangeRates() {
  const cached = safeJsonParse(window.localStorage.getItem(FX_CACHE_KEY), null);
  if (cached?.fetchedAt && Date.now() - cached.fetchedAt < FX_TTL_MS)
    return cached;

  try {
    const res = await fetch(FX_RATES_URL);
    if (!res.ok) throw new Error(`Bad response: ${res.status}`);
    const { rates } = await res.json();
    if (!rates || typeof rates !== "object")
      throw new Error("Malformed rates response");
    const record = { fetchedAt: Date.now(), rates };
    window.localStorage.setItem(FX_CACHE_KEY, JSON.stringify(record));
    return record;
  } catch {
    return cached ?? null;
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

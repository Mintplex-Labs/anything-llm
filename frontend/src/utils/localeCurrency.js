import { DISPLAY_CURRENCY } from "@/utils/constants";

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
 * The currency costs should be shown in: the admin-set display currency saved
 * by `storeDisplayCurrency`, else the browser locale's currency. Read
 * synchronously so it is known on load and can be sent as the `X-Currency`
 * header on every request.
 * @returns {string} ISO 4217 code
 */
export function preferredCurrency() {
  try {
    const stored = window.localStorage.getItem(DISPLAY_CURRENCY);
    if (stored) return stored;
  } catch {}
  return localeCurrency();
}

/**
 * Saves the admin-set display currency, or clears it when unset so the
 * browser locale's currency is used.
 * @param {string|null} currency - ISO 4217 code, null for automatic
 */
export function storeDisplayCurrency(currency) {
  try {
    if (currency) window.localStorage.setItem(DISPLAY_CURRENCY, currency);
    else window.localStorage.removeItem(DISPLAY_CURRENCY);
  } catch {}
}

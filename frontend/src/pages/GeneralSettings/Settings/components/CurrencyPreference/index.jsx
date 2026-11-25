import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Admin from "@/models/admin";
import showToast from "@/utils/toast";
import {
  CURRENCY_CHANGE_EVENT,
  currencyName,
  getCurrencySettings,
  invalidateCurrencySettings,
  localeCurrency,
} from "@/utils/currency";
import { storeDisplayCurrency } from "@/utils/localeCurrency";

export default function CurrencyPreference() {
  const { t, i18n } = useTranslation();
  const [currency, setCurrency] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [ratesAsOf, setRatesAsOf] = useState(null);

  useEffect(() => {
    getCurrencySettings().then((settings) => {
      if (settings?.currency) setCurrency(settings.currency);
      setCurrencies(settings?.currencies ?? []);
      setRatesAsOf(settings?.asOf ?? null);
    });
  }, []);

  async function changeCurrency(e) {
    const newCurrency = e.target.value;
    const previousCurrency = currency;
    setCurrency(newCurrency);

    const result = await Admin.updateSystemPreferences({
      display_currency: newCurrency || null,
    });
    if (!result?.success) {
      setCurrency(previousCurrency);
      showToast(t("customization.items.display-currency.error"), "error");
      return;
    }

    storeDisplayCurrency(newCurrency || null);
    invalidateCurrencySettings();
    window.dispatchEvent(new CustomEvent(CURRENCY_CHANGE_EVENT));
  }

  return (
    <div className="flex flex-col gap-y-0.5 my-4">
      <p className="text-sm leading-6 font-semibold text-white">
        {t("customization.items.display-currency.title")}
      </p>
      <p className="text-xs text-white/60">
        {t("customization.items.display-currency.description")}
      </p>
      <div className="flex items-center gap-x-4">
        <select
          name="displayCurrency"
          className="border-none bg-theme-settings-input-bg mt-2 text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-fit py-2 px-4"
          value={currency}
          onChange={changeCurrency}
        >
          <option value="">
            {t("customization.items.display-currency.automatic", {
              currency: localeCurrency(),
            })}
          </option>
          {currencies.map((code) => (
            <option key={code} value={code}>
              {code} — {currencyName(code, i18n.language)}
            </option>
          ))}
        </select>
      </div>
      {ratesAsOf && (
        <p className="text-xs text-white/60 mt-2">
          {t("customization.items.display-currency.rates-as-of", {
            date: formatRatesDate(ratesAsOf, i18n.language),
          })}
        </p>
      )}
    </div>
  );
}

/**
 * @param {string} day - YYYY-MM-DD
 * @param {string} locale - BCP 47 locale tag
 * @returns {string} the day in the user's language, or as given when it cannot be parsed
 */
function formatRatesDate(day, locale) {
  const date = new Date(`${day}T00:00:00`);
  if (isNaN(date.getTime())) return day;
  try {
    return date.toLocaleDateString(locale, { dateStyle: "medium" });
  } catch {
    return date.toLocaleDateString(undefined, { dateStyle: "medium" });
  }
}

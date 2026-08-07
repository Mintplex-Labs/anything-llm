import { useTranslation } from "react-i18next";
import Appearance from "@/models/appearance";
import {
  CURRENCY_CHANGE_EVENT,
  SUPPORTED_CURRENCIES,
  currencyName,
} from "@/utils/currency";

export default function CurrencyPreference() {
  const { t, i18n } = useTranslation();

  function changeCurrency(currency) {
    Appearance.set("preferredCurrency", currency);
    window.dispatchEvent(
      new CustomEvent(CURRENCY_CHANGE_EVENT, { detail: { currency } })
    );
  }

  return (
    <div className="flex flex-col gap-y-0.5 my-4">
      <p className="text-sm leading-6 font-semibold text-white">
        {t("customization.items.preferred-currency.title")}
      </p>
      <p className="text-xs text-white/60">
        {t("customization.items.preferred-currency.description")}
      </p>
      <div className="flex items-center gap-x-4">
        <select
          name="preferredCurrency"
          className="border-none bg-theme-settings-input-bg mt-2 text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-fit py-2 px-4"
          defaultValue={Appearance.get("preferredCurrency") || "USD"}
          onChange={(e) => changeCurrency(e.target.value)}
        >
          {SUPPORTED_CURRENCIES.map((code) => {
            return (
              <option key={code} value={code}>
                {code} — {currencyName(code, i18n.language)}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}

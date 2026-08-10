import { useCallback, useEffect, useState } from "react";
import {
  CURRENCY_CHANGE_EVENT,
  formatCost,
  getCurrencySettings,
} from "@/utils/currency";

/**
 * Provides the instance's display currency and a formatter that converts
 * stored USD costs into it. Both come from the server (admin-set system
 * setting + server-cached exchange rates). Falls back to USD display when no
 * exchange rate is available for the display currency.
 *
 * NOTE: Currently unused - cost display was intentionally pulled from the UI
 * since per-chat/per-run costs are too small to be useful on their own. This
 * hook is the intended entry point for upcoming cost features (eg: aggregate
 * usage/spend views): call it in any component that renders a stored USD cost
 * and pass the value through `formatCost`.
 * @returns {{currency: string, formatCost: (usd: number) => string}}
 */
export default function useCurrency() {
  const [currency, setCurrency] = useState("USD");
  const [rates, setRates] = useState(null);

  useEffect(() => {
    let mounted = true;

    function applySettings(settings) {
      if (!mounted || !settings) return;
      setCurrency(settings.currency || "USD");
      setRates(settings.rates ?? null);
    }

    getCurrencySettings().then(applySettings);

    // When an admin changes the display currency, `CurrencyPreference`
    // invalidates the memoized settings and fires this event so every
    // mounted consumer refetches without a page reload.
    function handleCurrencyChange() {
      getCurrencySettings().then(applySettings);
    }
    window.addEventListener(CURRENCY_CHANGE_EVENT, handleCurrencyChange);
    return () => {
      mounted = false;
      window.removeEventListener(CURRENCY_CHANGE_EVENT, handleCurrencyChange);
    };
  }, []);

  const rate = currency === "USD" ? 1 : rates?.[currency];
  const format = useCallback(
    (usd) =>
      formatCost(usd, rate ? { currency, rate } : { currency: "USD", rate: 1 }),
    [currency, rate]
  );

  return { currency, formatCost: format };
}

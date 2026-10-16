import { useCallback, useEffect, useState } from "react";
import {
  CURRENCY_CHANGE_EVENT,
  formatCost,
  getCurrencySettings,
  localeCurrency,
} from "@/utils/currency";

/**
 * Provides the display currency and a formatter that converts stored USD
 * costs into it. The currency is the admin-set system setting, or the browser
 * locale's currency when unset. Falls back to USD when no exchange rate is
 * available for that currency (eg: offline before rates were ever fetched).
 * @returns {{currency: string, formatCost: (usd: number) => string}}
 */
export default function useCurrency() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let mounted = true;
    function loadSettings() {
      getCurrencySettings().then((result) => {
        if (mounted && result) setSettings(result);
      });
    }

    loadSettings();
    // `CurrencyPreference` invalidates the memoized settings and fires this
    // event so every mounted consumer refetches without a page reload.
    window.addEventListener(CURRENCY_CHANGE_EVENT, loadSettings);
    return () => {
      mounted = false;
      window.removeEventListener(CURRENCY_CHANGE_EVENT, loadSettings);
    };
  }, []);

  const preferred = settings?.currency || localeCurrency();
  const rate = preferred === "USD" ? 1 : settings?.rates?.[preferred];
  const currency = rate ? preferred : "USD";
  const format = useCallback(
    (usd) => formatCost(usd, { currency, rate: rate || 1 }),
    [currency, rate]
  );

  return { currency, formatCost: format };
}

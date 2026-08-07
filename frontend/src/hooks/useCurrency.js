import { useCallback, useEffect, useState } from "react";
import Appearance from "@/models/appearance";
import {
  CURRENCY_CHANGE_EVENT,
  formatCost,
  getExchangeRates,
} from "@/utils/currency";

/**
 * Provides the user's preferred display currency and a formatter that
 * converts stored USD costs into it. Falls back to USD display when no
 * exchange rate is available for the preferred currency.
 * @returns {{currency: string, formatCost: (usd: number) => string}}
 */
export default function useCurrency() {
  const [currency, setCurrency] = useState(
    Appearance.get("preferredCurrency") || "USD"
  );
  const [rates, setRates] = useState(null);

  useEffect(() => {
    getExchangeRates().then((record) => setRates(record?.rates ?? null));
  }, []);

  useEffect(() => {
    function handleCurrencyChange(e) {
      if (!e?.detail?.currency) return;
      setCurrency(e.detail.currency);
    }
    window.addEventListener(CURRENCY_CHANGE_EVENT, handleCurrencyChange);
    return () =>
      window.removeEventListener(CURRENCY_CHANGE_EVENT, handleCurrencyChange);
  }, []);

  const rate = currency === "USD" ? 1 : rates?.[currency];
  const format = useCallback(
    (usd) =>
      formatCost(usd, rate ? { currency, rate } : { currency: "USD", rate: 1 }),
    [currency, rate]
  );

  return { currency, formatCost: format };
}

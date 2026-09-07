import { numberWithCommas } from "../numbers.js";

/**
 * Format available prompt and completion token counts.
 * @param {Object|null} metrics
 * @returns {string}
 */
export default function formatTokenUsage(metrics = {}) {
  const parts = [
    ["Input", metrics?.prompt_tokens],
    ["Output", metrics?.completion_tokens],
  ]
    .filter(([, value]) => Number.isSafeInteger(value) && value >= 0)
    .map(([label, value]) => `${label}: ${numberWithCommas(value)}`);

  return parts.length > 0 ? `${parts.join(" | ")} tokens` : "";
}

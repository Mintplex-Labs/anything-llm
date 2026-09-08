/**
 * Coerces a value into a finite, non-negative number. Provider-reported
 * usage metrics and token counts arrive in inconsistent shapes (missing
 * keys, numeric strings, nulls, negative or non-finite values), so anything
 * that does not resolve to a usable number becomes 0.
 * @param {unknown} value
 * @returns {number}
 */
function toNonNegativeNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return 0;
  return number;
}

module.exports = { toNonNegativeNumber };

export function normalizeGeminiKeyList(value = "") {
  return Array.from(
    new Set(
      String(value)
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean)
    )
  ).join(",");
}

export function applyNormalizedGeminiKeyFields(data = {}, fieldNames = []) {
  for (const fieldName of fieldNames) {
    const normalized = normalizeGeminiKeyList(data[fieldName] || "");
    if (!normalized) {
      delete data[fieldName];
      continue;
    }
    data[fieldName] = normalized;
  }
  return data;
}

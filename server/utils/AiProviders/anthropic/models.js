/**
 * Anthropic dropped the `temperature`/`top_p`/`top_k` inference parameters on
 * Opus 4.7+ and on every generation 5+ model. Sending one returns a 400
 * (`temperature is deprecated for this model`). Model ids keep changing
 * (`claude-opus-5`, `us.anthropic.claude-sonnet-5-...-v1:0`), so match the
 * family and version instead of listing exact model names.
 *
 * Older naming (`claude-3-5-sonnet-20241022`, `claude-3-opus-*`) predates the
 * deprecation and still accepts temperature, so unmatched ids return true.
 *
 * @param {string} modelName - The model id or preference string.
 * @returns {boolean} Whether the model accepts a `temperature` parameter.
 */
function supportsTemperature(modelName = "") {
  const match = String(modelName).match(
    /claude-(opus|sonnet|haiku)-(\d+)(?:-(\d+))?/i
  );
  if (!match) return true;

  const family = match[1].toLowerCase();
  const major = Number(match[2]);
  const minor = Number(match[3] || 0);

  if (major >= 5) return false;
  // Opus dropped temperature mid-generation 4.
  if (family === "opus" && major === 4 && minor >= 7) return false;
  return true;
}

module.exports = { supportsTemperature };

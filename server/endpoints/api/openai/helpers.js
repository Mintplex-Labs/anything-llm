/**
 * Extracts text content from a multimodal message
 * If the content has multiple text items, it will join them together with a newline.
 * @param {string|Array} content - Message content that could be string or array of content objects
 * @returns {string} - The text content
 */
function extractTextContent(content) {
  if (!Array.isArray(content)) return content;
  return content
    .filter((item) => item.type === "text")
    .map((item) => item.text)
    .join("\n");
}

/**
 * Detects mime type from a base64 data URL string, defaults to PNG if not detected
 * @param {string} dataUrl - The data URL string (e.g. data:image/jpeg;base64,...)
 * @returns {string} - The mime type or 'image/png' if not detected
 */
function getMimeTypeFromDataUrl(dataUrl) {
  try {
    const matches = dataUrl.match(/^data:([^;]+);base64,/);
    return matches ? matches[1].toLowerCase() : "image/png";
  } catch (e) {
    return "image/png";
  }
}

/**
 * Extracts attachments from a multimodal message
 * The attachments provided are in OpenAI format since this util is used in the OpenAI compatible chat.
 * However, our backend internal chat uses the Attachment type we use elsewhere in the app so we have to convert it.
 * @param {Array} content - Message content that could be string or array of content objects
 * @returns {import("../../../utils/helpers").Attachment[]} - The attachments
 */
function extractAttachments(content) {
  if (!Array.isArray(content)) return [];
  return content
    .filter((item) => item.type === "image_url")
    .map((item, index) => ({
      name: `uploaded_image_${index}`,
      mime: getMimeTypeFromDataUrl(item.image_url.url),
      contentString: item.image_url.url,
    }));
}

/**
 * Validates the request body for a message-quota adjustment booking.
 * Sign convention: amount > 0 deducts from the contingent (consumes quota),
 * amount < 0 credits quota back.
 * @param {Object} body - Parsed request body
 * @param {Object} [limits]
 * @param {number} [limits.maxAbsAmount] - Maximum absolute amount allowed
 * @param {number} [limits.maxReasonLength] - Maximum reason string length
 * @returns {{valid: boolean, error: string|null, amount: number|null, reason: string|null}}
 */
function validateAdjustmentRequest(
  body,
  { maxAbsAmount = 1_000_000, maxReasonLength = 500 } = {}
) {
  const invalid = (error) => ({
    valid: false,
    error,
    amount: null,
    reason: null,
  });

  if (!body || typeof body !== "object" || Array.isArray(body))
    return invalid("Request body must be a JSON object.");

  const { amount, reason = null } = body;
  if (amount === undefined || amount === null)
    return invalid("amount is required.");
  if (typeof amount !== "number" || !Number.isInteger(amount))
    return invalid("amount must be an integer.");
  if (amount === 0)
    return invalid(
      "amount must not be 0. Use a positive amount to deduct messages or a negative amount to credit them back."
    );
  if (Math.abs(amount) > maxAbsAmount)
    return invalid(
      `amount must be between -${maxAbsAmount} and ${maxAbsAmount}.`
    );

  if (reason !== null && typeof reason !== "string")
    return invalid("reason must be a string.");
  if (reason && reason.length > maxReasonLength)
    return invalid(`reason must be at most ${maxReasonLength} characters.`);

  return { valid: true, error: null, amount, reason: reason || null };
}

module.exports = {
  extractTextContent,
  extractAttachments,
  validateAdjustmentRequest,
};

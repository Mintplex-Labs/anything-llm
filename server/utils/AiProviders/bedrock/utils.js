/** @typedef {'jpeg' | 'png' | 'gif' | 'webp'} */
const SUPPORTED_BEDROCK_IMAGE_FORMATS = ["jpeg", "png", "gif", "webp"];

/** @type {number} */
const DEFAULT_MAX_OUTPUT_TOKENS = 4096;

/** @type {number} */
const DEFAULT_CONTEXT_WINDOW_TOKENS = 8191;

/** @type {'iam' | 'iam_role' | 'sessionToken'} */
const SUPPORTED_CONNECTION_METHODS = ["iam", "iam_role", "sessionToken"];

/**
 * Parses a MIME type string (e.g., "image/jpeg") to extract and validate the image format
 * supported by Bedrock Converse. Handles 'image/jpg' as 'jpeg'.
 * @param {string | null | undefined} mimeType - The MIME type string.
 * @returns {string | null} The validated image format (e.g., "jpeg") or null if invalid/unsupported.
 */
function getImageFormatFromMime(mimeType = "") {
  if (!mimeType) return null;
  const parts = mimeType.toLowerCase().split("/");
  if (parts?.[0] !== "image") return null;
  let format = parts?.[1];
  if (!format) return null;

  // Remap jpg to jpeg
  switch (format) {
    case "jpg":
      format = "jpeg";
      break;
    default:
      break;
  }

  if (!SUPPORTED_BEDROCK_IMAGE_FORMATS.includes(format)) return null;
  return format;
}

/**
 * Decodes a pure base64 string (without data URI prefix) into a Uint8Array using the atob method.
 * This approach matches the technique previously used by Langchain's implementation.
 * @param {string} base64String - The pure base64 encoded data.
 * @returns {Uint8Array | null} The resulting byte array or null on decoding error.
 */
function base64ToUint8Array(base64String) {
  try {
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  } catch (e) {
    console.error(
      `[AWSBedrock] Error decoding base64 string with atob: ${e.message}`
    );
    return null;
  }
}

module.exports = {
  SUPPORTED_CONNECTION_METHODS,
  SUPPORTED_BEDROCK_IMAGE_FORMATS,
  DEFAULT_MAX_OUTPUT_TOKENS,
  DEFAULT_CONTEXT_WINDOW_TOKENS,
  getImageFormatFromMime,
  base64ToUint8Array,
};

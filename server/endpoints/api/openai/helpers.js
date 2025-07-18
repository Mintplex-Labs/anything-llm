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
      mime: "image/png",
      contentString: item.image_url.url,
    }));
}

module.exports = {
  extractTextContent,
  extractAttachments,
};

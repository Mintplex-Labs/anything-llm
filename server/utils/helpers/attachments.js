/**
 * Converts a single chat attachment into an OpenAI-compatible multimodal
 * content block. Audio attachments (`audio/*`) use the `input_audio` schema
 * (raw base64 with the data URI prefix stripped, plus a normalized format);
 * everything else is treated as an image via `image_url`.
 * @param {import("./index").Attachment} attachment
 * @param {{imageDetail?: string}} [options] - imageDetail sets `image_url.detail` (e.g. "high")
 * @returns {object} an OpenAI-compatible content block
 */
function attachmentToContentBlock(attachment, { imageDetail } = {}) {
  const isAudio =
    attachment?.mime?.startsWith("audio/") ||
    attachment?.contentString?.startsWith("data:audio/");

  if (isAudio) {
    const subtype = (
      attachment?.mime ||
      attachment?.contentString?.match(/^data:([^;]+);/)?.[1] ||
      ""
    )
      .split("/")[1]
      ?.split(";")[0]
      ?.toLowerCase();
    let format = subtype?.replace(/^x-/, "") || "";
    if (subtype === "mpeg" || subtype === "mp3") format = "mp3";
    if (subtype === "wave" || subtype === "x-wav") format = "wav";
    return {
      type: "input_audio",
      input_audio: {
        data: attachment.contentString.split(",").pop(),
        format,
      },
    };
  }

  return {
    type: "image_url",
    image_url: {
      url: attachment.contentString,
      ...(imageDetail ? { detail: imageDetail } : {}),
    },
  };
}

module.exports = { attachmentToContentBlock };

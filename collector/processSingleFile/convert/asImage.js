const { v4 } = require("uuid");
const { tokenizeString } = require("../../utils/tokenizer");
const {
  createdDate,
  trashFile,
  writeToServerDocuments,
} = require("../../utils/files");
const OCRLoader = require("../../utils/OCRLoader");
const { default: slugify } = require("slugify");
const { OpenAiVision } = require("../../utils/VisionProviders/OpenAiVision");
const {
  GenericOpenAiVision,
} = require("../../utils/VisionProviders/GenericOpenAiVision");

const VISION_PROVIDERS = {
  openai: OpenAiVision,
  "generic-openai": GenericOpenAiVision,
};

// Marks the model-written text inside pageContent so it is never read back as OCR ground truth.
const DESCRIPTION_HEADER = "[Machine-generated image description]";

/**
 * Describe the image with the configured vision provider. Returns an empty string
 * when none is set or the provider fails so ingestion always falls back to OCR-only.
 * @param {string} fullFilePath
 * @param {Object} options
 * @returns {Promise<string>}
 */
async function describeImage(fullFilePath, options) {
  if (!VISION_PROVIDERS.hasOwnProperty(options?.visionProvider)) return "";
  const VisionProvider = VISION_PROVIDERS[options.visionProvider];

  try {
    const { content, error } = await new VisionProvider({
      options,
    }).describeImage(fullFilePath);
    if (!!error) throw new Error(error);
    return content || "";
  } catch (e) {
    console.error(`Could not describe image. ${e.message}`);
    return "";
  }
}

async function asImage({
  fullFilePath = "",
  filename = "",
  options = {},
  metadata = {},
}) {
  const ocrContent = await new OCRLoader({
    targetLanguages: options?.ocr?.langList,
  }).ocrImage(fullFilePath);
  const description = await describeImage(fullFilePath, options);
  const described = !!description?.length;
  const content = [
    ocrContent?.length ? ocrContent : null,
    described ? `${DESCRIPTION_HEADER}\n${description}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  if (!content?.length) {
    console.error(`Resulting text content was empty for ${filename}.`);
    if (!options.absolutePath) trashFile(fullFilePath);
    return {
      success: false,
      reason: `No text content found in ${filename}.`,
      documents: [],
    };
  }

  console.log(`-- Working ${filename} --`);
  const data = {
    id: v4(),
    url: "file://" + fullFilePath,
    title: metadata.title || filename,
    docAuthor: metadata.docAuthor || "Unknown",
    description:
      metadata.description ||
      (described ? "Machine-generated description of an image." : "Unknown"),
    docSource:
      metadata.docSource ||
      (described
        ? "image file uploaded by the user, described by a vision model."
        : "image file uploaded by the user."),
    chunkSource: metadata.chunkSource || "",
    published: createdDate(fullFilePath),
    wordCount: content.split(" ").length,
    pageContent: content,
    token_count_estimate: tokenizeString(content),
  };

  const document = writeToServerDocuments({
    data,
    filename: `${slugify(filename)}-${data.id}`,
    options: { parseOnly: options.parseOnly },
  });
  if (!options.absolutePath) trashFile(fullFilePath);
  console.log(`[SUCCESS]: ${filename} converted & ready for embedding.\n`);
  return { success: true, reason: null, documents: [document] };
}

module.exports = asImage;

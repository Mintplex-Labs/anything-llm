const { v4 } = require("uuid");
const {
  createdDate,
  trashFile,
  writeToServerDocuments,
} = require("../../utils/files");
const { tokenizeString } = require("../../utils/tokenizer");
const { default: slugify } = require("slugify");
const { LocalWhisper } = require("../../utils/WhisperProviders/localWhisper");
const { OpenAiWhisper } = require("../../utils/WhisperProviders/OpenAiWhisper");

const WHISPER_PROVIDERS = {
  openai: OpenAiWhisper,
  local: LocalWhisper,
};

async function asAudio({ fullFilePath = "", filename = "", options = {} }) {
  const WhisperProvider = WHISPER_PROVIDERS.hasOwnProperty(
    options?.whisperProvider
  )
    ? WHISPER_PROVIDERS[options?.whisperProvider]
    : WHISPER_PROVIDERS.local;

  console.log(`-- Working ${filename} --`);
  const whisper = new WhisperProvider({ options });
  const { content, error } = await whisper.processFile(fullFilePath, filename);

  if (!!error) {
    console.error(`Error encountered for parsing of ${filename}.`);
    trashFile(fullFilePath);
    return {
      success: false,
      reason: error,
      documents: [],
    };
  }

  if (!content?.length) {
    console.error(`Resulting text content was empty for ${filename}.`);
    trashFile(fullFilePath);
    return {
      success: false,
      reason: `No text content found in ${filename}.`,
      documents: [],
    };
  }

  const data = {
    id: v4(),
    url: "file://" + fullFilePath,
    title: filename,
    docAuthor: "no author found",
    description: "No description found.",
    docSource: "pdf file uploaded by the user.",
    chunkSource: "",
    published: createdDate(fullFilePath),
    wordCount: content.split(" ").length,
    pageContent: content,
    token_count_estimate: tokenizeString(content).length,
  };

  const document = writeToServerDocuments(
    data,
    `${slugify(filename)}-${data.id}`
  );
  trashFile(fullFilePath);
  console.log(
    `[SUCCESS]: ${filename} transcribed, converted & ready for embedding.\n`
  );
  return { success: true, reason: null, documents: [document] };
}

module.exports = asAudio;

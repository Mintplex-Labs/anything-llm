const fs = require("fs");
const path = require("path");
const { default: slugify } = require("slugify");
const { v4 } = require("uuid");
const {
  writeToServerDocuments,
  sanitizeFileName,
  documentsFolder,
} = require("../../files");
const { tokenizeString } = require("../../tokenizer");
const { YoutubeLoader } = require("./YoutubeLoader");
const { validYoutubeVideoUrl } = require("../../url");

/**
 * Fetch the transcript content for a YouTube video
 * @param {string} url - The URL of the YouTube video
 * @returns {Promise<{success: boolean, reason: string|null, content: string|null, metadata: Object}>} - The transcript content for the YouTube video
 */
async function fetchVideoTranscriptContent({ url }) {
  if (!validYoutubeVideoUrl(url)) {
    return {
      success: false,
      reason: "Invalid URL. Should be youtu.be or youtube.com/watch.",
      content: null,
      metadata: {},
    };
  }

  console.log(`-- Working YouTube ${url} --`);
  const loader = YoutubeLoader.createFromUrl(url, { addVideoInfo: true });
  const { docs, error } = await loader
    .load()
    .then((docs) => ({ docs, error: null }))
    .catch((e) => ({
      docs: [],
      error: e.message?.split("Error:")?.[1] || e.message,
    }));

  if (!docs.length || !!error) {
    return {
      success: false,
      reason: error ?? "No transcript found for that YouTube video.",
      content: null,
      metadata: {},
    };
  }

  const metadata = docs[0].metadata;
  const content = docs[0].pageContent;
  if (!content.length) {
    return {
      success: false,
      reason: "No transcript could be parsed for that YouTube video.",
      content: null,
      metadata: {},
    };
  }

  return {
    success: true,
    reason: null,
    content,
    metadata,
  };
}

/**
 * @typedef {Object} TranscriptAsDocument
 * @property {boolean} success - Whether the transcript was successful
 * @property {string|null} reason - The reason for the transcript
 * @property {{title: string, author: string, destination: string}} data - The data from the transcript
 */

/**
 * @typedef {Object} TranscriptAsContent
 * @property {boolean} success - Whether the transcript was successful
 * @property {string|null} reason - The reason for the transcript
 * @property {string|null} content - The content of the transcript
 * @property {Object[]} documents - The documents from the transcript
 * @property {boolean} saveAsDocument - Whether to save the transcript as a document
 */

/**
 * Load the transcript content for a YouTube video as well as save it to the server documents
 * @param {Object} params - The parameters for the YouTube transcript
 * @param {string} params.url - The URL of the YouTube video
 * @param {Object} options - The options for the YouTube transcript
 * @param {boolean} options.parseOnly - Whether to parse the transcript content only or save it to the server documents
 * @returns {Promise<TranscriptAsDocument | TranscriptAsContent>} - The transcript content for the YouTube video
 */
async function loadYouTubeTranscript({ url }, options = { parseOnly: false }) {
  const transcriptResults = await fetchVideoTranscriptContent({ url });
  if (!transcriptResults.success) {
    return {
      success: false,
      reason:
        transcriptResults.reason ||
        "An unknown error occurred during transcription retrieval",
      documents: [],
      content: null,
      saveAsDocument: options.parseOnly,
      data: {},
    };
  }

  const { content, metadata } = transcriptResults;
  if (options.parseOnly) {
    return {
      success: true,
      reason: null,
      content,
      documents: [],
      saveAsDocument: options.parseOnly,
      data: {},
    };
  }

  const outFolder = sanitizeFileName(
    slugify(`${metadata.author} YouTube transcripts`).toLowerCase()
  );
  const outFolderPath = path.resolve(documentsFolder, outFolder);

  if (!fs.existsSync(outFolderPath))
    fs.mkdirSync(outFolderPath, { recursive: true });
  const data = {
    id: v4(),
    url: url + ".youtube",
    title: metadata.title || url,
    docAuthor: metadata.author,
    description: metadata.description,
    docSource: url,
    chunkSource: `youtube://${url}`,
    published: new Date().toLocaleString(),
    wordCount: content.split(" ").length,
    pageContent: content,
    token_count_estimate: tokenizeString(content),
  };

  console.log(`[YouTube Loader]: Saving ${metadata.title} to ${outFolder}`);
  writeToServerDocuments({
    data,
    filename: sanitizeFileName(`${slugify(metadata.title)}-${data.id}`),
    destinationOverride: outFolderPath,
  });

  return {
    success: true,
    reason: null,
    data: {
      title: metadata.title,
      author: metadata.author,
      destination: outFolder,
    },
  };
}

module.exports = {
  loadYouTubeTranscript,
  fetchVideoTranscriptContent,
};

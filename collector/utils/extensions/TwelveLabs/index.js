const fs = require("fs");
const path = require("path");
const { default: slugify } = require("slugify");
const { v4 } = require("uuid");
const {
  writeToServerDocuments,
  sanitizeFileName,
  documentsFolder,
  isWithin,
} = require("../../files");
const { tokenizeString } = require("../../tokenizer");
const { validURL } = require("../../url");

const DEFAULT_INDEX_NAME = "anythingllm-pegasus";
const DEFAULT_PROMPT =
  "Provide a detailed, factual breakdown of this video. Begin with a one-paragraph summary, then a full transcript of any spoken words, then a chronological list of the key visual scenes and on-screen text. Do not invent information that is not present in the video.";

// TwelveLabs processes an uploaded video asynchronously, so allow a generous
// ceiling before we give up polling. Short clips finish in well under a minute.
// ponytail: fixed timeout/interval; expose as options only if users hit the cap.
const POLL_INTERVAL_MS = 5000;
const POLL_TIMEOUT_MS = 15 * 60 * 1000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Find an existing index with the given name (and Pegasus enabled) or create one.
 * Reusing an index avoids re-creating it on every collection.
 * @param {import("twelvelabs-js").TwelveLabs} client
 * @param {string} indexName
 * @returns {Promise<string>} the index id
 */
async function resolvePegasusIndex(client, indexName) {
  for await (const index of await client.indexes.list()) {
    if (index.indexName === indexName && index.id) return index.id;
  }

  const created = await client.indexes.create({
    indexName,
    models: [{ modelName: "pegasus1.2", modelOptions: ["visual", "audio"] }],
  });
  if (!created.id) throw new Error("Failed to create a TwelveLabs index.");
  return created.id;
}

/**
 * Upload a video by URL, index it with Pegasus, and wait until it is ready.
 * @param {import("twelvelabs-js").TwelveLabs} client
 * @param {string} indexId
 * @param {string} url
 * @returns {Promise<string>} the indexed asset (video) id used for analysis
 */
async function uploadAndIndexVideo(client, indexId, url) {
  const asset = await client.assets.create({ method: "url", url });
  if (!asset.id) throw new Error("TwelveLabs did not return an asset id.");

  const deadline = Date.now() + POLL_TIMEOUT_MS;
  let readyAsset = await client.assets.retrieve(asset.id);
  while (readyAsset.status !== "ready" && readyAsset.status !== "failed") {
    if (Date.now() > deadline)
      throw new Error("Timed out waiting for the video upload to be ready.");
    await sleep(POLL_INTERVAL_MS);
    readyAsset = await client.assets.retrieve(asset.id);
  }
  if (readyAsset.status === "failed")
    throw new Error("TwelveLabs failed to process the uploaded video.");

  let indexedAsset = await client.indexes.indexedAssets.create(indexId, {
    assetId: asset.id,
  });
  if (!indexedAsset.id)
    throw new Error("TwelveLabs did not return an indexed asset id.");

  while (true) {
    if (Date.now() > deadline)
      throw new Error("Timed out waiting for the video to finish indexing.");
    indexedAsset = await client.indexes.indexedAssets.retrieve(
      indexId,
      indexedAsset.id
    );
    if (indexedAsset.status === "ready") break;
    if (indexedAsset.status === "failed")
      throw new Error("TwelveLabs failed to index the video.");
    await sleep(POLL_INTERVAL_MS);
  }

  return indexedAsset.id;
}

/**
 * Run a video through the TwelveLabs Pegasus model and return the generated text.
 * @param {Object} params
 * @param {string} params.url - The publicly accessible URL of the video to analyze.
 * @param {string} [params.apiKey] - TwelveLabs API key. Falls back to the TWELVELABS_API_KEY env var.
 * @param {string} [params.indexName] - The index to use (reused or created). Defaults to "anythingllm-pegasus".
 * @param {string} [params.prompt] - The analysis prompt sent to Pegasus.
 * @returns {Promise<{success: boolean, reason: string|null, content: string|null, metadata: Object}>}
 */
async function fetchVideoAnalysisContent({
  url,
  apiKey,
  indexName = DEFAULT_INDEX_NAME,
  prompt = DEFAULT_PROMPT,
}) {
  const key = apiKey || process.env.TWELVELABS_API_KEY || null;
  if (!key)
    return {
      success: false,
      reason:
        "No TwelveLabs API key provided. Set TWELVELABS_API_KEY or include an apiKey. Get a free key at https://twelvelabs.io.",
      content: null,
      metadata: {},
    };

  if (!validURL(url))
    return {
      success: false,
      reason: "Invalid URL. Provide a publicly accessible direct video URL.",
      content: null,
      metadata: {},
    };

  // Lazy require so the collector does not pay the import cost unless this
  // connector is actually invoked, mirroring the other extension loaders.
  const { TwelveLabs } = require("twelvelabs-js");
  const client = new TwelveLabs({ apiKey: key });

  console.log(`-- Working TwelveLabs Pegasus ${url} --`);
  const indexId = await resolvePegasusIndex(client, indexName);
  const videoId = await uploadAndIndexVideo(client, indexId, url);
  const result = await client.analyze({ videoId, prompt });
  const content = result?.data || "";

  if (!content.length)
    return {
      success: false,
      reason: "TwelveLabs returned no analysis for that video.",
      content: null,
      metadata: {},
    };

  return {
    success: true,
    reason: null,
    content,
    metadata: { source: url, indexName, videoId },
  };
}

/**
 * Analyze a video with TwelveLabs Pegasus and save the result as a server document.
 * @param {Object} params - See {@link fetchVideoAnalysisContent}.
 * @param {Object} options
 * @param {boolean} options.parseOnly - When true, return content inline without persisting a document.
 * @returns {Promise<Object>}
 */
async function loadTwelveLabsVideo(args, options = { parseOnly: false }) {
  const { url } = args;
  const analysisResults = await fetchVideoAnalysisContent(args);
  if (!analysisResults.success) {
    return {
      success: false,
      reason:
        analysisResults.reason ||
        "An unknown error occurred during video analysis.",
      documents: [],
      content: null,
      saveAsDocument: options.parseOnly,
      data: {},
    };
  }

  const { content, metadata } = analysisResults;

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
    slugify("TwelveLabs video analysis").toLowerCase()
  );
  const outFolderPath = path.resolve(documentsFolder, outFolder);
  const uuid = v4();
  const fileName = sanitizeFileName(`${slugify(metadata.videoId)}-${uuid}`);

  if (!isWithin(documentsFolder, path.resolve(outFolderPath, fileName))) {
    const reason = `[TwelveLabs Loader]: Invalid file path ${path.resolve(
      outFolderPath,
      fileName
    )} is not within the documents folder ${documentsFolder}`;
    console.error(reason);
    return { success: false, reason, documents: [], data: {} };
  }

  if (!fs.existsSync(outFolderPath))
    fs.mkdirSync(outFolderPath, { recursive: true });

  const data = {
    id: uuid,
    url: url + ".twelvelabs",
    title: `TwelveLabs analysis - ${url}`,
    docAuthor: "TwelveLabs Pegasus",
    description: `Pegasus video analysis of ${url}`,
    docSource: url,
    chunkSource: `twelvelabs://${url}`,
    published: new Date().toLocaleString(),
    wordCount: content.split(" ").length,
    pageContent: content,
    token_count_estimate: tokenizeString(content),
  };

  console.log(`[TwelveLabs Loader]: Saving analysis of ${url} to ${outFolder}`);
  const document = writeToServerDocuments({
    data,
    filename: fileName,
    destinationOverride: outFolderPath,
  });

  return {
    success: true,
    reason: null,
    documents: [document],
    data: {
      title: data.title,
      author: data.docAuthor,
      destination: outFolder,
    },
  };
}

module.exports = {
  loadTwelveLabsVideo,
  fetchVideoAnalysisContent,
};

const fs = require("fs");
const path = require("path");
const { default: slugify } = require("slugify");
const { v4 } = require("uuid");
const { writeToServerDocuments } = require("../../files");
const { tokenizeString } = require("../../tokenizer");
const { YoutubeLoader } = require("./YoutubeLoader");

function validYoutubeVideoUrl(link) {
  const UrlPattern = require("url-pattern");
  const opts = new URL(link);
  const url = `${opts.protocol}//${opts.host}${opts.pathname}${
    opts.searchParams.has("v") ? `?v=${opts.searchParams.get("v")}` : ""
  }`;

  const shortPatternMatch = new UrlPattern(
    "https\\://(www.)youtu.be/(:videoId)"
  ).match(url);
  const fullPatternMatch = new UrlPattern(
    "https\\://(www.)youtube.com/watch?v=(:videoId)"
  ).match(url);
  const videoId =
    shortPatternMatch?.videoId || fullPatternMatch?.videoId || null;
  if (!!videoId) return true;

  return false;
}

async function loadYouTubeTranscript({ url }) {
  if (!validYoutubeVideoUrl(url)) {
    return {
      success: false,
      reason: "Invalid URL. Should be youtu.be or youtube.com/watch.",
    };
  }

  console.log(`-- Working YouTube ${url} --`);
  const loader = YoutubeLoader.createFromUrl(url, { addVideoInfo: true });
  const { docs, error } = await loader
    .load()
    .then((docs) => {
      return { docs, error: null };
    })
    .catch((e) => {
      return {
        docs: [],
        error: e.message?.split("Error:")?.[1] || e.message,
      };
    });

  if (!docs.length || !!error) {
    return {
      success: false,
      reason: error ?? "No transcript found for that YouTube video.",
    };
  }

  const metadata = docs[0].metadata;
  const content = docs[0].pageContent;
  if (!content.length) {
    return {
      success: false,
      reason: "No transcript could be parsed for that YouTube video.",
    };
  }

  const outFolder = slugify(
    `${metadata.author} YouTube transcripts`
  ).toLowerCase();

  const outFolderPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(
          __dirname,
          `../../../../server/storage/documents/${outFolder}`
        )
      : path.resolve(process.env.STORAGE_DIR, `documents/${outFolder}`);

  if (!fs.existsSync(outFolderPath))
    fs.mkdirSync(outFolderPath, { recursive: true });

  const data = {
    id: v4(),
    url: url + ".youtube",
    title: metadata.title || url,
    docAuthor: metadata.author,
    description: metadata.description,
    docSource: url,
    chunkSource: `link://${url}`,
    published: new Date().toLocaleString(),
    wordCount: content.split(" ").length,
    pageContent: content,
    token_count_estimate: tokenizeString(content).length,
  };

  console.log(`[YouTube Loader]: Saving ${metadata.title} to ${outFolder}`);
  writeToServerDocuments(
    data,
    `${slugify(metadata.title)}-${data.id}`,
    outFolderPath
  );

  return {
    success: true,
    reason: "test",
    data: {
      title: metadata.title,
      author: metadata.author,
      destination: outFolder,
    },
  };
}

module.exports = loadYouTubeTranscript;

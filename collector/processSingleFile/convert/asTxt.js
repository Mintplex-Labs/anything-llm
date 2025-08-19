const { v4 } = require("uuid");
const fs = require("fs");
const { tokenizeString } = require("../../utils/tokenizer");
const {
  createdDate,
  trashFile,
  writeToServerDocuments,
} = require("../../utils/files");
const { default: slugify } = require("slugify");

const CHUNK_LIMIT = Number(
  process.env.EMBEDDING_MODEL_MAX_CHUNK_LENGTH || 1000
);

function chunkText(text = "", limit = CHUNK_LIMIT) {
  const words = text.split(/\s+/);
  const chunks = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (tokenizeString(next) > limit) {
      chunks.push(current.trim());
      current = word;
    } else {
      current = next;
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

async function asTxt({ fullFilePath = "", filename = "" }) {
  const { size } = fs.statSync(fullFilePath);
  let content = "";
  try {
    if (size > 5 * 1024 * 1024) {
      console.log(
        `[asTxt] Streaming ${filename} (${(size / 1024 / 1024).toFixed(1)}MB)`
      );
      const stream = fs.createReadStream(fullFilePath, {
        encoding: "utf8",
        highWaterMark: 1024 * 1024,
      });
      let read = 0;
      for await (const chunk of stream) {
        read += Buffer.byteLength(chunk);
        console.log(`[asTxt] reading ${((read / size) * 100).toFixed(0)}%`);
        content += chunk;
      }
    } else {
      content = fs.readFileSync(fullFilePath, "utf8");
    }
  } catch (err) {
    console.error("Could not read file!", err);
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

  console.log(`-- Working ${filename} --`);
  const baseMeta = {
    url: "file://" + fullFilePath,
    title: filename,
    docAuthor: "Unknown",
    description: "Unknown",
    docSource: "a text file uploaded by the user.",
    chunkSource: "",
    published: createdDate(fullFilePath),
  };

  const tokenCount = tokenizeString(content);
  const documents = [];

  if (tokenCount > CHUNK_LIMIT) {
    console.log(`[asTxt] Splitting ${filename} into chunks...`);
    const chunks = chunkText(content, CHUNK_LIMIT);
    chunks.forEach((chunk, idx) => {
      const data = {
        id: v4(),
        ...baseMeta,
        wordCount: chunk.split(" ").length,
        pageContent: chunk,
        token_count_estimate: tokenizeString(chunk),
      };
      const doc = writeToServerDocuments({
        data,
        filename: `${slugify(filename)}-${data.id}`,
      });
      console.log(`[asTxt] chunk ${idx + 1}/${chunks.length} ready`);
      documents.push(doc);
    });
  } else {
    const data = {
      id: v4(),
      ...baseMeta,
      wordCount: content.split(" ").length,
      pageContent: content,
      token_count_estimate: tokenCount,
    };
    const doc = writeToServerDocuments({
      data,
      filename: `${slugify(filename)}-${data.id}`,
    });
    documents.push(doc);
  }

  trashFile(fullFilePath);
  console.log(
    `[SUCCESS]: ${filename} converted into ${documents.length} chunk(s) & ready for embedding.\n`
  );
  return { success: true, reason: null, documents };
}

module.exports = asTxt;

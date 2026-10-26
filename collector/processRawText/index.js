const { v4 } = require("uuid");
const { writeToServerDocuments } = require("../utils/files");
const { tokenizeString } = require("../utils/tokenizer");
const { default: slugify } = require("slugify");

// Will remove the last .extension from the input
// and stringify the input + move to lowercase.
function stripAndSlug(input) {
  if (!input.includes(".")) return slugify(input, { lower: true });
  return slugify(input.split(".").slice(0, -1).join("-"), { lower: true });
}

const METADATA_KEYS = {
  possible: {
    url: ({ url, title }) => {
      let validUrl;
      try {
        const u = new URL(url);
        validUrl = ["https:", "http:"].includes(u.protocol);
      } catch {}

      if (validUrl) return `web://${url.toLowerCase()}.website`;
      return `file://${stripAndSlug(title)}.txt`;
    },
    title: ({ title }) => `${stripAndSlug(title)}.txt`,
    docAuthor: ({ docAuthor }) => {
      return typeof docAuthor === "string" ? docAuthor : "no author specified";
    },
    description: ({ description }) => {
      return typeof description === "string"
        ? description
        : "no description found";
    },
    docSource: ({ docSource }) => {
      return typeof docSource === "string" ? docSource : "no source set";
    },
    chunkSource: ({ chunkSource, title }) => {
      return typeof chunkSource === "string"
        ? chunkSource
        : `${stripAndSlug(title)}.txt`;
    },
    /**
     * Normalizes the `published` metadata key into a locale date string.
     * The API schema documents this key as an epoch timestamp in ms, nullable.
     *
     * Falls back to the current time when the value is:
     * - absent: `undefined`, `null`, a boolean, `""`, whitespace, or `[]`
     *   (all of which `Number()` would otherwise coerce to `0`/`1` and stamp as 1970)
     * - non-numeric: any string that does not parse as a number
     * - out of range: a number a `Date` cannot represent (eg: `1e20`, `"Infinity"`),
     *   which would otherwise render the literal string "Invalid Date"
     *
     * `0` and negative numbers are valid epochs and are honored as-is.
     * @param {{ published?: unknown }} metadata
     * @returns {string}
     */
    published: ({ published }) => {
      if (
        published === null ||
        typeof published === "boolean" ||
        `${published}`.trim() === ""
      )
        return new Date().toLocaleString();

      const date = new Date(Number(published));
      if (isNaN(date.getTime())) return new Date().toLocaleString();
      return date.toLocaleString();
    },
  },
};

async function processRawText(textContent, metadata) {
  console.log(`-- Working Raw Text doc ${metadata?.title} --`);
  if (typeof textContent !== "string" || textContent.length === 0) {
    return {
      success: false,
      reason: "textContent was empty - nothing to process.",
      documents: [],
    };
  }

  // Every other metadata key has a fallback, but title is used to derive the
  // url, chunkSource and filename via stripAndSlug, which requires a string.
  if (typeof metadata?.title !== "string" || metadata.title.length === 0) {
    return {
      success: false,
      reason: "metadata.title must be a non-empty string.",
      documents: [],
    };
  }

  const data = {
    id: v4(),
    url: METADATA_KEYS.possible.url(metadata),
    title: METADATA_KEYS.possible.title(metadata),
    docAuthor: METADATA_KEYS.possible.docAuthor(metadata),
    description: METADATA_KEYS.possible.description(metadata),
    docSource: METADATA_KEYS.possible.docSource(metadata),
    chunkSource: METADATA_KEYS.possible.chunkSource(metadata),
    published: METADATA_KEYS.possible.published(metadata),
    wordCount: textContent.split(" ").length,
    pageContent: textContent,
    token_count_estimate: tokenizeString(textContent),
  };

  const document = writeToServerDocuments({
    data,
    filename: `raw-${stripAndSlug(metadata.title)}-${data.id}`,
  });
  console.log(
    `[SUCCESS]: Raw text and metadata saved & ready for embedding.\n`
  );
  return { success: true, reason: null, documents: [document] };
}

module.exports = { processRawText };

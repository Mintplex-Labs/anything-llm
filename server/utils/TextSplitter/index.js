function isNullOrNaN(value) {
  if (value === null) return true;
  return isNaN(value);
}

class TextSplitter {
  #splitter;
  constructor(config = {}) {
    /*
      config can be a ton of things depending on what is required or optional by the specific splitter.
      Non-splitter related keys
      {
        splitByFilename: string, // TODO
      }
      ------
      Default: "RecursiveCharacterTextSplitter"
      Config: {
        chunkSize: number,
        chunkOverlap: number,
        chunkHeaderMeta: object | null, // Gets appended to top of each chunk as metadata
      }
      ------
    */
    this.config = config;
    this.#splitter = this.#setSplitter(config);
  }

  log(text, ...args) {
    console.log(`\x1b[35m[TextSplitter]\x1b[0m ${text}`, ...args);
  }

  // Does a quick check to determine the text chunk length limit.
  // Embedder models have hard-set limits that cannot be exceeded, just like an LLM context
  // so here we want to allow override of the default 1000, but up to the models maximum, which is
  // sometimes user defined.
  static determineMaxChunkSize(preferred = null, embedderLimit = 1000) {
    const prefValue = isNullOrNaN(preferred)
      ? Number(embedderLimit)
      : Number(preferred);
    const limit = Number(embedderLimit);
    if (prefValue > limit)
      console.log(
        `\x1b[43m[WARN]\x1b[0m Text splitter chunk length of ${prefValue} exceeds embedder model max of ${embedderLimit}. Will use ${embedderLimit}.`
      );
    return prefValue > limit ? limit : prefValue;
  }

  stringifyHeader() {
    if (!this.config.chunkHeaderMeta) return null;
    let content = "";
    Object.entries(this.config.chunkHeaderMeta).map(([key, value]) => {
      if (!key || !value) return;
      content += `${key}: ${value}\n`;
    });

    if (!content) return null;
    return `<document_metadata>\n${content}</document_metadata>\n\n`;
  }

  #setSplitter(config = {}) {
    // if (!config?.splitByFilename) {// TODO do something when specific extension is present? }
    return new RecursiveSplitter({
      chunkSize: isNaN(config?.chunkSize) ? 1_000 : Number(config?.chunkSize),
      chunkOverlap: isNaN(config?.chunkOverlap)
        ? 20
        : Number(config?.chunkOverlap),
      chunkHeader: this.stringifyHeader(),
    });
  }

  async splitText(documentText) {
    return this.#splitter._splitText(documentText);
  }
}

// Wrapper for Langchain default RecursiveCharacterTextSplitter class.
class RecursiveSplitter {
  constructor({ chunkSize, chunkOverlap, chunkHeader = null }) {
    const {
      RecursiveCharacterTextSplitter,
    } = require("@langchain/textsplitters");
    this.log(`Will split with`, { chunkSize, chunkOverlap });
    this.chunkHeader = chunkHeader;
    this.engine = new RecursiveCharacterTextSplitter({
      chunkSize,
      chunkOverlap,
    });
  }

  log(text, ...args) {
    console.log(`\x1b[35m[RecursiveSplitter]\x1b[0m ${text}`, ...args);
  }

  async _splitText(documentText) {
    if (!this.chunkHeader) return this.engine.splitText(documentText);
    const strings = await this.engine.splitText(documentText);
    const documents = await this.engine.createDocuments(strings, [], {
      chunkHeader: this.chunkHeader,
    });
    return documents
      .filter((doc) => !!doc.pageContent)
      .map((doc) => doc.pageContent);
  }
}

module.exports.TextSplitter = TextSplitter;

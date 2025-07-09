/**
 * Copyright 2024
 *
 * Authors:
 *  - Eugen Mayer (KontextWork)
 */

const { htmlToText } = require("html-to-text");
const { tokenizeString } = require("../../../tokenizer");
const {
  sanitizeFileName,
  writeToServerDocuments,
  documentsFolder,
} = require("../../../files");
const { default: slugify } = require("slugify");
const path = require("path");
const fs = require("fs");
const { processSingleFile } = require("../../../../processSingleFile");
const {
  WATCH_DIRECTORY,
  SUPPORTED_FILETYPE_CONVERTERS,
} = require("../../../constants");

class Page {
  /**
   *
   * @param {number }id
   * @param {string }title
   * @param {string} created
   * @param {string} type
   * @param {string} processedBody
   * @param {string} url
   * @param {number} spaceId
   */
  constructor({ id, title, created, type, processedBody, url, spaceId }) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.created = created;
    this.type = type;
    this.processedBody = processedBody;
    this.spaceId = spaceId;
  }
}

class DrupalWiki {
  /**
   *
   * @param baseUrl
   * @param spaceId
   * @param accessToken
   */
  constructor({ baseUrl, accessToken }) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
    this.storagePath = this.#prepareStoragePath(baseUrl);
  }

  /**
   * Load all pages for the given space, fetching storing each page one by one
   * to minimize the memory usage
   *
   * @param {number} spaceId
   * @param {import("../../EncryptionWorker").EncryptionWorker} encryptionWorker
   * @returns {Promise<void>}
   */
  async loadAndStoreAllPagesForSpace(spaceId, encryptionWorker) {
    const pageIndex = await this.#getPageIndexForSpace(spaceId);
    for (const pageId of pageIndex) {
      try {
        const page = await this.loadPage(pageId);

        // Pages with an empty body will lead to embedding issues / exceptions
        if (page.processedBody.trim() !== "") {
          this.#storePage(page, encryptionWorker);
          await this.#downloadAndProcessAttachments(page.id);
        } else {
          console.log(`Skipping page (${page.id}) since it has no content`);
        }
      } catch (e) {
        console.error(
          `Could not process DrupalWiki page ${pageId} (skipping and continuing): `
        );
        console.error(e);
      }
    }
  }

  /**
   * @param {number} pageId
   * @returns {Promise<Page>}
   */
  async loadPage(pageId) {
    return this.#fetchPage(pageId);
  }

  /**
   * Fetches the page ids for the configured space
   * @param {number} spaceId
   * @returns{Promise<number[]>} array of pageIds
   */
  async #getPageIndexForSpace(spaceId) {
    // errors on fetching the pageIndex is fatal, no error handling
    let hasNext = true;
    let pageIds = [];
    let pageNr = 0;
    do {
      let { isLast, pageIdsForPage } = await this.#getPagesForSpacePaginated(
        spaceId,
        pageNr
      );
      hasNext = !isLast;
      pageNr++;
      if (pageIdsForPage.length) {
        pageIds = pageIds.concat(pageIdsForPage);
      }
    } while (hasNext);

    return pageIds;
  }

  /**
   *
   * @param {number} pageNr
   * @param {number} spaceId
   * @returns {Promise<{isLast,pageIds}>}
   */
  async #getPagesForSpacePaginated(spaceId, pageNr) {
    /*
     * {
     *   content: Page[],
     *   last: boolean,
     *   pageable: {
     *     pageNumber: number
     *   }
     * }
     */
    const data = await this._doFetch(
      `${this.baseUrl}/api/rest/scope/api/page?size=100&space=${spaceId}&page=${pageNr}`
    );

    const pageIds = data.content.map((page) => {
      return Number(page.id);
    });

    return {
      isLast: data.last,
      pageIdsForPage: pageIds,
    };
  }

  /**
   * @param pageId
   * @returns {Promise<Page>}
   */
  async #fetchPage(pageId) {
    const data = await this._doFetch(
      `${this.baseUrl}/api/rest/scope/api/page/${pageId}`
    );
    const url = `${this.baseUrl}/node/${data.id}`;
    return new Page({
      id: data.id,
      title: data.title,
      created: data.lastModified,
      type: data.type,
      processedBody: this.#processPageBody({
        body: data.body,
        title: data.title,
        lastModified: data.lastModified,
        url: url,
      }),
      url: url,
    });
  }

  /**
   * @param {Page} page
   * @param {import("../../EncryptionWorker").EncryptionWorker} encryptionWorker
   */
  #storePage(page, encryptionWorker) {
    const { hostname } = new URL(this.baseUrl);

    // This UUID will ensure that re-importing the same page without any changes will not
    // show up (deduplication).
    const targetUUID = `${hostname}.${page.spaceId}.${page.id}.${page.created}`;
    const wordCount = page.processedBody.split(" ").length;
    const data = {
      id: targetUUID,
      url: `drupalwiki://${page.url}`,
      title: page.title,
      docAuthor: this.baseUrl,
      description: page.title,
      docSource: `${this.baseUrl} DrupalWiki`,
      chunkSource: this.#generateChunkSource(page.id, encryptionWorker),
      published: new Date().toLocaleString(),
      wordCount: wordCount,
      pageContent: page.processedBody,
      token_count_estimate: tokenizeString(page.processedBody),
    };

    const fileName = sanitizeFileName(`${slugify(page.title)}-${data.id}`);
    console.log(
      `[DrupalWiki Loader]: Saving page '${page.title}' (${page.id}) to '${this.storagePath}/${fileName}'`
    );
    writeToServerDocuments(data, fileName, this.storagePath);
  }

  /**
   * Generate the full chunkSource for a specific Confluence page so that we can resync it later.
   * This data is encrypted into a single `payload` query param so we can replay credentials later
   * since this was encrypted with the systems persistent password and salt.
   * @param {number} pageId
   * @param {import("../../EncryptionWorker").EncryptionWorker} encryptionWorker
   * @returns {string}
   */
  #generateChunkSource(pageId, encryptionWorker) {
    const payload = {
      baseUrl: this.baseUrl,
      pageId: pageId,
      accessToken: this.accessToken,
    };
    return `drupalwiki://${
      this.baseUrl
    }/node/${pageId}?payload=${encryptionWorker.encrypt(
      JSON.stringify(payload)
    )}`;
  }

  async _doFetch(url) {
    const response = await fetch(url, {
      headers: this.#getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }
    return response.json();
  }

  #getHeaders() {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${this.accessToken}`,
    };
  }

  #prepareStoragePath(baseUrl) {
    const { hostname } = new URL(baseUrl);
    const subFolder = slugify(`drupalwiki-${hostname}`).toLowerCase();
    const outFolder = path.resolve(documentsFolder, subFolder);
    if (!fs.existsSync(outFolder)) fs.mkdirSync(outFolder, { recursive: true });
    return outFolder;
  }

  /**
   * @param {string} body
   * @param {string} url
   * @param {string} title
   * @param {string} lastModified
   * @returns {string}
   * @private
   */
  #processPageBody({ body, url, title, lastModified }) {
    const textContent = body.trim() !== "" ? body : title;

    const plainTextContent = htmlToText(textContent, {
      wordwrap: false,
      preserveNewlines: true,
      selectors: [
        {
          selector: "table",
          format: "dataTable",
          options: {
            colSpacing: 3,
            rowSpacing: 1,
            uppercaseHeaderCells: true,
            maxColumnWidth: Infinity,
          },
        },
      ],
    });

    const plainBody = plainTextContent.replace(/\n{3,}/g, "\n\n");
    return plainBody;
  }

  async #downloadAndProcessAttachments(pageId) {
    try {
      const data = await this._doFetch(
        `${this.baseUrl}/api/rest/scope/api/attachment?pageId=${pageId}&size=2000`
      );

      const extensionsList = Object.keys(SUPPORTED_FILETYPE_CONVERTERS);
      for (const attachment of data.content || data) {
        const { fileName, id: attachId } = attachment;
        const lowerName = fileName.toLowerCase();
        if (!extensionsList.some((ext) => lowerName.endsWith(ext))) {
          continue;
        }

        const downloadUrl = `${this.baseUrl}/api/rest/scope/api/attachment/${attachId}/download`;
        const attachmentResponse = await fetch(downloadUrl, {
          headers: this.#getHeaders(),
        });
        if (!attachmentResponse.ok) {
          console.log(`Skipping attachment: ${fileName} - Download failed`);
          continue;
        }

        const buffer = await attachmentResponse.arrayBuffer();
        const localFilePath = `${WATCH_DIRECTORY}/${fileName}`;
        require("fs").writeFileSync(localFilePath, Buffer.from(buffer));

        await processSingleFile(fileName);
      }
    } catch (err) {
      console.error(`Fetching/processing attachments failed:`, err);
    }
  }
}

module.exports = { DrupalWiki };

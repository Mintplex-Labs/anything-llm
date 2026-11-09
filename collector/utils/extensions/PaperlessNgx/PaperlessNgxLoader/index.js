const { htmlToText } = require("html-to-text");
const pdf = require("pdf-parse");

class PaperlessNgxLoader {
  maxConcurrentDownloads = 5;
  downloadTimeoutMs = 120_000;
  downloadRetryDelaysMs = [1_000, 3_000];

  constructor({ baseUrl, apiToken }) {
    const url = new URL(baseUrl);
    this.baseUrl = `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
    this.apiToken = apiToken;
    this.baseHeaders = {
      Authorization: `Token ${this.apiToken}`,
    };
  }

  async load() {
    try {
      const documents = await this.fetchAllDocuments();
      return documents.map((doc) => this.createDocumentFromPage(doc));
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  /**
   * Fetches all documents from Paperless-ngx
   * @returns {Promise<{{[key: string]: any, content: string}[]}>} The documents with their content
   */
  async fetchAllDocuments() {
    try {
      const documents = [];
      let nextUrl = `${this.baseUrl}/api/documents/`;
      let page = 1;

      while (nextUrl) {
        console.log(`Fetching documents page ${page} from Paperless-ngx`);
        try {
          const data = await fetch(nextUrl, {
            headers: {
              "Content-Type": "application/json",
              ...this.baseHeaders,
            },
          }).then((res) => {
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            return res.json();
          });

          const validResults = data.results.filter((doc) => doc?.id);
          if (!validResults.length) break;

          documents.push(...validResults);

          if (!data.next) break;
          const { search } = new URL(data.next, nextUrl);
          const next = `${this.baseUrl}/api/documents/${search}`;
          if (next === nextUrl) break;
          nextUrl = next;
          page++;
        } catch (error) {
          console.error(
            `Error fetching page ${page} from Paperless-ngx:`,
            error
          );
          // Nothing was fetched, so the instance could not be read at all, for
          // example a wrong token or URL. Report that instead of an empty import.
          if (!documents.length) throw error;
          break;
        }
      }

      console.log(
        `Fetched ${documents.length} documents from Paperless-ngx (Pages: ${
          page - 1
        })`
      );

      const documentsWithContent = await this.fetchAllDocumentContent(
        documents
      );
      const failedIds = documentsWithContent
        .filter((doc) => !doc.content)
        .map((doc) => doc.id);
      if (failedIds.length)
        console.warn(
          `Could not fetch content for ${failedIds.length} of ${
            documents.length
          } Paperless-ngx documents: ${failedIds.join(", ")}`
        );

      return documentsWithContent.filter((doc) => !!doc.content);
    } catch (error) {
      throw new Error(
        `Failed to fetch documents from Paperless-ngx: ${error.message}`
      );
    }
  }

  /**
   * Fetches the content of every document with at most `maxConcurrentDownloads`
   * requests in flight, since each download holds a database connection on the
   * Paperless-ngx side and an unbounded burst exhausts its Postgres pool.
   * @param {{[key: string]: any, id: number}[]} documents
   * @returns {Promise<{[key: string]: any, content: string}[]>} In input order
   */
  async fetchAllDocumentContent(documents) {
    const results = new Array(documents.length);
    let next = 0;
    const worker = async () => {
      while (next < documents.length) {
        const index = next++;
        const doc = documents[index];
        results[index] = {
          ...doc,
          content: await this.fetchDocumentContent(doc.id),
        };
      }
    };

    const workerCount = Math.min(this.maxConcurrentDownloads, documents.length);
    await Promise.all(Array.from({ length: workerCount }, worker));
    return results;
  }

  /**
   * Fetches the content of a document from Paperless-ngx, retrying network
   * errors, timeouts, 429s and 5xx responses with a growing delay.
   * @param {string} documentId - The ID of the document to fetch
   * @returns {Promise<string>} The content of the document, or "" on failure
   */
  async fetchDocumentContent(documentId) {
    for (let attempt = 0; ; attempt++) {
      try {
        return await this.downloadDocumentContent(documentId);
      } catch (error) {
        if (error.retryable && attempt < this.downloadRetryDelaysMs.length) {
          const delay = this.downloadRetryDelaysMs[attempt];
          console.warn(
            `Retrying document ${documentId} in ${delay}ms: ${error.message}`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        console.error(
          `Failed to fetch content for document ${documentId}:`,
          error
        );
        return "";
      }
    }
  }

  /**
   * A single download attempt. Throws on failure, with `retryable` set when
   * another attempt could succeed.
   * @param {string} documentId
   * @returns {Promise<string>}
   */
  async downloadDocumentContent(documentId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/documents/${documentId}/download/`,
        {
          headers: this.baseHeaders,
          // Also bounds reading the body, so a stalled transfer frees its worker
          signal: AbortSignal.timeout(this.downloadTimeoutMs),
        }
      );

      if (!response.ok) {
        const error = new Error(
          `Failed to fetch document content: ${response.status}`
        );
        error.retryable = response.status === 429 || response.status >= 500;
        throw error;
      }

      // The media type without parameters such as `; charset=utf-8`
      const contentType = response.headers
        .get("content-type")
        ?.split(";")[0]
        .trim()
        .toLowerCase();
      switch (contentType) {
        case "application/pdf":
          const buffer = await response.arrayBuffer();
          return await this.parsePdfContent(buffer);
        case "text/html":
          return htmlToText(await response.text(), {
            wordwrap: false,
            preserveNewlines: true,
          });
        default:
          // Returned verbatim so angle-bracketed text like `<john@example.com>`
          // and the column spacing in OCR text are preserved
          return await response.text();
      }
    } catch (error) {
      // Network failures and timeouts reject from fetch or the body read
      // rather than producing a status code
      if (error.retryable === undefined) error.retryable = true;
      throw error;
    }
  }

  async parsePdfContent(buffer) {
    try {
      const data = await pdf(Buffer.from(buffer));
      return data.text;
    } catch (error) {
      console.error("Failed to parse PDF content:", error);
      return "";
    }
  }

  createDocumentFromPage(doc) {
    return {
      pageContent: doc.content || "",
      metadata: {
        id: doc.id,
        title: doc.original_file_name,
        created: doc.created,
        modified: doc.modified,
        added: doc.added,
        tags: doc.tags,
        correspondent: doc.correspondent,
        documentType: doc.document_type,
        url: `${this.baseUrl}/documents/${doc.id}`,
      },
    };
  }
}

module.exports = PaperlessNgxLoader;

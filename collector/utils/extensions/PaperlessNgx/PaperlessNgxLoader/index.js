const { htmlToText } = require("html-to-text");
const pdf = require("pdf-parse");

class PaperlessNgxLoader {
  constructor({ baseUrl, apiToken }) {
    this.baseUrl = new URL(baseUrl).origin;
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
      const documents = await fetch(`${this.baseUrl}/api/documents/`, {
        headers: {
          "Content-Type": "application/json",
          ...this.baseHeaders,
        },
      })
        .then((res) => res.json())
        .then((data) => data.results || [])
        .catch((error) => {
          throw new Error(
            `Failed to fetch documents from Paperless-ngx: ${error.message}`
          );
        });

      const documentsWithContent = await Promise.all(
        documents.map(async (doc) => {
          const content = await this.fetchDocumentContent(doc.id);
          return { ...doc, content };
        })
      );

      return documentsWithContent.filter((doc) => !!doc.content);
    } catch (error) {
      throw new Error(
        `Failed to fetch documents from Paperless-ngx: ${error.message}`
      );
    }
  }

  /**
   * Fetches the content of a document from Paperless-ngx
   * @param {string} documentId - The ID of the document to fetch
   * @returns {Promise<string>} The content of the document
   */
  async fetchDocumentContent(documentId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/documents/${documentId}/download/`,
        {
          headers: this.baseHeaders,
        }
      );

      if (!response.ok)
        throw new Error(`Failed to fetch document content: ${response.status}`);

      const contentType = response.headers.get("content-type");
      switch (contentType) {
        case "text/plain":
          return await response.text();
        case "application/pdf":
          const buffer = await response.arrayBuffer();
          return await this.parsePdfContent(buffer);
        default:
          return await response.text();
      }
    } catch (error) {
      console.error(
        `Failed to fetch content for document ${documentId}:`,
        error
      );
      return "";
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
    const content = doc.content || "";
    const plainTextContent = htmlToText(content, {
      wordwrap: false,
      preserveNewlines: true,
    });

    return {
      pageContent: plainTextContent,
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

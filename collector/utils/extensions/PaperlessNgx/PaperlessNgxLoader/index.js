const { htmlToText } = require("html-to-text");
const pdf = require("pdf-parse");

class PaperlessNgxLoader {
  constructor({ baseUrl, apiToken }) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.apiToken = apiToken;
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

  async fetchAllDocuments() {
    try {
      const response = await fetch(`${this.baseUrl}/api/documents/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${this.apiToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch documents from Paperless-ngx: ${response.status}`
        );
      }

      const data = await response.json();
      const documents = data.results || [];

      const documentsWithContent = await Promise.all(
        documents.map(async (doc) => {
          const content = await this.fetchDocumentContent(doc.id);
          return { ...doc, content };
        })
      );

      return documentsWithContent;
    } catch (error) {
      throw new Error(
        `Failed to fetch documents from Paperless-ngx: ${error.message}`
      );
    }
  }

  async fetchDocumentContent(documentId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/documents/${documentId}/download/`,
        {
          headers: {
            Authorization: `Token ${this.apiToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch document content: ${response.status}`);
      }

      // Process text and pdf files
      const contentType = response.headers.get("content-type");
      let content;

      if (contentType.includes("text/plain")) {
        content = await response.text();
      } else if (contentType.includes("application/pdf")) {
        const buffer = await response.arrayBuffer();
        content = await this.parsePdfContent(buffer);
      } else {
        // Fallback to text content
        content = await response.text();
      }

      return content;
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
        title: doc.title,
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

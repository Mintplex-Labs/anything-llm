const fs = require("fs");
const path = require("path");

const documentsPath =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, `../../storage/documents`)
    : path.resolve(process.env.STORAGE_DIR, `documents`);

class DocumentManager {
  constructor({ workspace = null, maxTokens = null }) {
    this.workspace = workspace;
    this.maxTokens = maxTokens || Number.POSITIVE_INFINITY;
    this.documentStoragePath = documentsPath;
  }

  log(text, ...args) {
    console.log(`\x1b[36m[DocumentManager]\x1b[0m ${text}`, ...args);
  }

  async pinnedDocuments() {
    if (!this.workspace) return [];
    const { Document } = require("../../models/documents");
    return await Document.where({
      workspaceId: Number(this.workspace.id),
      pinned: true,
    });
  }

  async pinnedDocs() {
    if (!this.workspace) return [];
    const pinnedDocs = await this.pinnedDocuments();
    if (pinnedDocs.length === 0) return [];

    let tokens = 0;
    const processedDocs = [];
    
    for (const doc of pinnedDocs) {
      try {
        const metadata = JSON.parse(doc.metadata);
        if (!metadata.pageContent) {
          this.log(
            `Skipping document ${doc.name} - Could not find page content in pinned source.`
          );
          continue;
        }

        if (!metadata.token_count_estimate) {
          metadata.token_count_estimate = Math.ceil(metadata.pageContent.length / 4);
          this.log(
            `Generated token estimate for document ${doc.name}: ${metadata.token_count_estimate}`
          );
        }

        if (tokens >= this.maxTokens) {
          this.log(
            `Skipping document ${doc.name} - Token limit of ${this.maxTokens} has already been exceeded by pinned documents.`
          );
          continue;
        }

        processedDocs.push({
          ...metadata,
          pageContent: metadata.pageContent,
          metadata: {
            ...metadata,
            name: doc.name,
            docId: doc.docId,
            token_count: metadata.token_count_estimate
          }
        });
        tokens += metadata.token_count_estimate;
      } catch (error) {
        this.log(`Error processing pinned document ${doc.name}: ${error.message}`);
        continue;
      }
    }

    this.log(
      `Found ${processedDocs.length} pinned sources - prepending to content with ~${tokens} tokens of content.`
    );
    return processedDocs;
  }
}

module.exports.DocumentManager = DocumentManager;

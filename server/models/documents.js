const { v4: uuidv4 } = require("uuid");
const prisma = require("../utils/prisma");
const { getVectorDbClass } = require("../utils/helpers");
const { Telemetry } = require("./telemetry");
const { EventLogs } = require("./eventLogs");
const { safeJsonParse } = require("../utils/http");
const path = require('path');
const fs = require('fs');

const Document = {
  writable: ["pinned", "watched", "lastUpdatedAt"],
  /**
   * @param {import("@prisma/client").workspace_documents} document - Document PrismaRecord
   * @returns {{
   *  metadata: (null|object),
   *  type: import("./documentSyncQueue.js").validFileType,
   *  source: string
   * }}
   */
  parseDocumentTypeAndSource: function (document) {
    const metadata = safeJsonParse(document.metadata, null);
    if (!metadata) return { metadata: null, type: null, source: null };

    // Parse the correct type of source and its original source path.
    const idx = metadata.chunkSource.indexOf("://");
    const [type, source] = [
      metadata.chunkSource.slice(0, idx),
      metadata.chunkSource.slice(idx + 3),
    ];
    return { metadata, type, source: this._stripSource(source, type) };
  },

  forWorkspace: async function (workspaceId = null) {
    if (!workspaceId) return [];
    return await prisma.workspace_documents.findMany({
      where: { workspaceId },
    });
  },

  delete: async function (clause = {}) {
    try {
      await prisma.workspace_documents.deleteMany({ where: clause });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  get: async function (clause = {}) {
    try {
      const document = await prisma.workspace_documents.findFirst({
        where: clause,
      });
      return document || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  where: async function (
    clause = {},
    limit = null,
    orderBy = null,
    include = null,
    select = null
  ) {
    try {
      const results = await prisma.workspace_documents.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
        ...(include !== null ? { include } : {}),
        ...(select !== null ? { select: { ...select } } : {}),
      });
      return results;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  addDocuments: async function (workspace, additions = [], userId = null) {
    const VectorDb = getVectorDbClass();
    if (additions.length === 0) return { failed: [], embedded: [] };
    const { fileData } = require("../utils/files");
    const embedded = [];
    const failedToEmbed = [];
    const errors = new Set();

    // Ensure custom-documents directory exists
    const documentsPath = process.env.NODE_ENV === "development"
      ? path.resolve(__dirname, "../storage/documents")
      : path.resolve(process.env.STORAGE_DIR, "documents");
    const customDocsDir = path.join(documentsPath, "custom-documents");
    
    if (!fs.existsSync(customDocsDir)) {
      console.log('Creating custom-documents directory:', customDocsDir);
      fs.mkdirSync(customDocsDir, { recursive: true });
    }

    for (const filePath of additions) {
      try {
        console.log('Processing file:', filePath);
        
        // Handle different file path formats
        let absolutePath;
        let originalPath = filePath;
        
        if (filePath.startsWith('googledocs://')) {
          // For Google Docs, search for any JSON file in custom-documents that contains the doc ID
          const docId = filePath.split('//')[1];
          console.log('Looking for Google Doc with ID:', docId);
          
          const files = fs.readdirSync(customDocsDir);
          const matchingFile = files.find(file => {
            if (!file.endsWith('.json')) return false;
            try {
              const content = JSON.parse(fs.readFileSync(path.join(customDocsDir, file), 'utf8'));
              return content.metadata?.sourceId === docId || 
                     content.metadata?.docId === `googledoc-${docId}` ||
                     content.id === `googledoc-${docId}`;
            } catch (e) {
              console.error('Error reading file:', file, e);
              return false;
            }
          });

          if (matchingFile) {
            console.log('Found matching file:', matchingFile);
            absolutePath = path.join(customDocsDir, matchingFile);
            originalPath = `custom-documents/${matchingFile}`;
          } else {
            console.error('No matching Google Doc found for ID:', docId);
            failedToEmbed.push(filePath);
            errors.add(`No matching Google Doc found for ID: ${docId}`);
            continue;
          }
        } else {
          absolutePath = path.isAbsolute(filePath)
            ? filePath
            : path.join(documentsPath, filePath);
        }

        console.log('Reading file from:', absolutePath);
        const data = await fileData(absolutePath);
        if (!data) {
          console.error('No data found for file:', filePath);
          failedToEmbed.push(filePath);
          errors.add(`No data found for file: ${filePath}`);
          continue;
        }

        const { pageContent, metadata = {}, id, chunkSource } = data;
        if (!pageContent) {
          console.error('No page content found in file:', filePath);
          failedToEmbed.push(filePath);
          errors.add(`No page content found in file: ${filePath}`);
          continue;
        }

        // Use the document's ID from metadata or data
        const documentId = metadata.docId || id || (filePath.startsWith('googledocs://') ? 
          `googledoc-${filePath.split('//')[1]}` : 
          `doc-${path.basename(filePath, '.json')}`);
        
        console.log('Using document ID:', documentId);

        // Check if document already exists
        const existingDoc = await this.get({ docId: documentId });
        if (existingDoc) {
          console.log(`Document with ID ${documentId} already exists, skipping...`);
          embedded.push(filePath);
          continue;
        }

        // Ensure metadata is properly structured
        const processedMetadata = {
          ...metadata,
          source: metadata.source || (filePath.startsWith('googledocs://') ? 'google_docs' : 'local'),
          type: metadata.type || 'text/plain',
          documentType: metadata.documentType || (filePath.startsWith('googledocs://') ? 'google_document' : 'unknown'),
          docId: documentId,
          chunkSource: chunkSource || metadata.chunkSource || `file://${originalPath}`,
          cached: true
        };

        // Create document record in database
        try {
          const doc = await this.create({
            docId: documentId,
            workspaceId: workspace.id,
            docpath: originalPath,
            filename: path.basename(originalPath),
            metadata: JSON.stringify(processedMetadata)
          });
          console.log('Successfully created document:', doc);
          embedded.push(filePath);
        } catch (error) {
          console.error('Failed to create document:', error);
          failedToEmbed.push(filePath);
          errors.add(`Failed to create document: ${error.message}`);
        }
      } catch (error) {
        console.error('Error processing file:', error);
        failedToEmbed.push(filePath);
        errors.add(error.message);
      }
    }

    return {
      failed: failedToEmbed,
      embedded,
      errors: Array.from(errors)
    };
  },

  removeDocuments: async function (workspace, removals = [], userId = null) {
    const VectorDb = getVectorDbClass();
    if (removals.length === 0) return;

    for (const path of removals) {
      const document = await this.get({
        docpath: path,
        workspaceId: workspace.id,
      });
      if (!document) continue;
      await VectorDb.deleteDocumentFromNamespace(
        workspace.slug,
        document.docId
      );

      try {
        await prisma.workspace_documents.delete({
          where: { id: document.id, workspaceId: workspace.id },
        });
        await prisma.document_vectors.deleteMany({
          where: { docId: document.docId },
        });
      } catch (error) {
        console.error(error.message);
      }
    }

    await Telemetry.sendTelemetry("documents_removed_in_workspace", {
      LLMSelection: process.env.LLM_PROVIDER || "openai",
      Embedder: process.env.EMBEDDING_ENGINE || "inherit",
      VectorDbSelection: process.env.VECTOR_DB || "lancedb",
      TTSSelection: process.env.TTS_PROVIDER || "native",
    });
    await EventLogs.logEvent(
      "workspace_documents_removed",
      {
        workspaceName: workspace?.name || "Unknown Workspace",
        numberOfDocuments: removals.length,
      },
      userId
    );
    return true;
  },

  count: async function (clause = {}, limit = null) {
    try {
      const count = await prisma.workspace_documents.count({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
      });
      return count;
    } catch (error) {
      console.error("FAILED TO COUNT DOCUMENTS.", error.message);
      return 0;
    }
  },
  update: async function (id = null, data = {}) {
    if (!id) throw new Error("No workspace document id provided for update");

    const validKeys = Object.keys(data).filter((key) =>
      this.writable.includes(key)
    );
    if (validKeys.length === 0)
      return { document: { id }, message: "No valid fields to update!" };

    try {
      const document = await prisma.workspace_documents.update({
        where: { id },
        data,
      });
      return { document, message: null };
    } catch (error) {
      console.error(error.message);
      return { document: null, message: error.message };
    }
  },
  _updateAll: async function (clause = {}, data = {}) {
    try {
      await prisma.workspace_documents.updateMany({
        where: clause,
        data,
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },
  content: async function (docId) {
    if (!docId) throw new Error("No workspace docId provided!");
    const document = await this.get({ docId: String(docId) });
    if (!document) throw new Error(`Could not find a document by id ${docId}`);

    const { fileData } = require("../utils/files");
    const data = await fileData(document.docpath);
    return { title: data.title, content: data.pageContent };
  },
  contentByDocPath: async function (docPath) {
    const { fileData } = require("../utils/files");
    const data = await fileData(docPath);
    return { title: data.title, content: data.pageContent };
  },

  // Some data sources have encoded params in them we don't want to log - so strip those details.
  _stripSource: function (sourceString, type) {
    if (["confluence", "github"].includes(type)) {
      const _src = new URL(sourceString);
      _src.search = ""; // remove all search params that are encoded for resync.
      return _src.toString();
    }

    return sourceString;
  },

  // Add create function
  create: async function (data = {}) {
    try {
      // If docId is provided, use it, otherwise generate one
      const docId = data.docId || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Ensure metadata is properly structured
      const metadata = {
        name: data.name || data.metadata?.name,
        type: data.metadata?.type || data.type || 'text/plain',
        size: data.metadata?.size || 0,
        ...data.metadata
      };

      const document = await prisma.workspace_documents.create({
        data: {
          docId,
          filename: path.basename(data.docpath),
          docpath: data.docpath,
          workspaceId: data.workspaceId,
          metadata: JSON.stringify(metadata),
          pinned: false,
          watched: false,
        },
        include: {
          workspace: true,
        },
      });

      return { document, message: null };
    } catch (error) {
      console.error("Failed to create workspace document.", error);
      return { document: null, message: error.message };
    }
  },
};

module.exports = { Document };


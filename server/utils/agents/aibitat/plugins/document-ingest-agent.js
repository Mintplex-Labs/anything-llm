const fs = require("fs");
const os = require("os");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { Document } = require("../../../../models/documents");
const {
  WorkspaceParsedFiles,
} = require("../../../../models/workspaceParsedFiles");
const { CollectorApi } = require("../../../collectorApi");
const { safeJsonParse } = require("../../../http");
const {
  documentsPath,
  directUploadsPath,
  hotdirPath,
  isWithin,
  normalizePath,
  sanitizeFileName,
} = require("../../../files");

const TOOL_NAME = "document-ingest-agent";
const APPROVAL_DESCRIPTION =
  "是否使用 Batch 异步模式入库？Batch 成本更低，但文档完成前不可检索。";
const DEFAULT_FILE_TYPES = ["pdf", "docx", "txt", "md", "csv"];
const ALLOWED_HOME_DIRS = ["Desktop", "Documents", "Downloads"];
const BLOCKED_SEGMENTS = new Set([
  ".env",
  ".ssh",
  ".openclaw",
  "node_modules",
  "storage",
]);
const BLOCKED_ABSOLUTE_ROOTS = ["/System", "/Library", "/Applications"];

function isInsideOrEqual(outer, inner) {
  const relative = path.relative(outer, inner);
  return relative === "" || (!!relative && !relative.startsWith(".."));
}

function expandHome(inputPath = "") {
  const value = String(inputPath || "").trim();
  if (value === "~") return os.homedir();
  if (value.startsWith("~/")) return path.join(os.homedir(), value.slice(2));
  return value;
}

function realpathIfExists(targetPath = "") {
  if (!fs.existsSync(targetPath)) return null;
  return fs.realpathSync(targetPath);
}

function safeRealpath(targetPath = "") {
  try {
    return realpathIfExists(targetPath);
  } catch {
    return null;
  }
}

function allowedLocalRoots() {
  return ALLOWED_HOME_DIRS.map((dir) => path.join(os.homedir(), dir))
    .map((dirPath) => safeRealpath(dirPath) || path.resolve(dirPath))
    .filter(Boolean);
}

function safeDisplayPath(realPath = "") {
  const home = safeRealpath(os.homedir()) || os.homedir();
  if (realPath && isInsideOrEqual(home, realPath))
    return path.relative(home, realPath).split(path.sep).join("/");
  return path.basename(realPath);
}

function pathSegments(realPath = "") {
  return String(realPath || "")
    .split(path.sep)
    .filter(Boolean);
}

function blockedPathReason(realPath = "") {
  if (!realPath) return "path_not_found";
  for (const blockedRoot of BLOCKED_ABSOLUTE_ROOTS) {
    if (isInsideOrEqual(blockedRoot, realPath)) return "blocked_system_path";
  }

  const segments = pathSegments(realPath);
  for (const segment of segments) {
    if (BLOCKED_SEGMENTS.has(segment)) return "blocked_sensitive_path";
    if (segment.startsWith(".")) return "blocked_hidden_path";
  }
  return null;
}

function isAllowedLocalPath(realPath = "") {
  const roots = allowedLocalRoots();
  return roots.some((root) => isInsideOrEqual(root, realPath));
}

function resolveLocalPath(inputPath = "") {
  const expandedPath = expandHome(inputPath);
  const candidates = path.isAbsolute(expandedPath)
    ? [expandedPath]
    : [
        path.resolve(process.cwd(), expandedPath),
        path.resolve(os.homedir(), expandedPath),
      ];

  for (const candidate of candidates) {
    const realPath = safeRealpath(candidate);
    if (realPath) return realPath;
  }
  return null;
}

function normalizeFileTypes(fileTypes = DEFAULT_FILE_TYPES) {
  const normalized =
    Array.isArray(fileTypes) && fileTypes.length > 0
      ? fileTypes
      : DEFAULT_FILE_TYPES;
  return new Set(
    normalized
      .map((type) =>
        String(type || "")
          .trim()
          .toLowerCase()
          .replace(/^\./, "")
      )
      .filter(Boolean)
  );
}

function supportedFileType(realPath = "", fileTypes = DEFAULT_FILE_TYPES) {
  const extension = path.extname(realPath).toLowerCase().replace(/^\./, "");
  return normalizeFileTypes(fileTypes).has(extension);
}

function globToRegex(pattern = "") {
  const normalized = String(pattern || "")
    .split(path.sep)
    .join("/");
  if (!normalized) return null;
  let regex = "^";
  for (let index = 0; index < normalized.length; index++) {
    const char = normalized[index];
    const next = normalized[index + 1];
    const afterNext = normalized[index + 2];
    if (char === "*" && next === "*" && afterNext === "/") {
      regex += "(?:.*/)?";
      index += 2;
      continue;
    }
    if (char === "*" && next === "*") {
      regex += ".*";
      index++;
      continue;
    }
    if (char === "*") {
      regex += "[^/]*";
      continue;
    }
    regex += char.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
  }
  regex += "$";
  return new RegExp(regex);
}

function matchesGlob(realPath = "", rootPath = "", pattern = null) {
  if (!pattern) return true;
  const matcher = globToRegex(pattern);
  if (!matcher) return true;
  const relativePath = path
    .relative(rootPath, realPath)
    .split(path.sep)
    .join("/");
  return matcher.test(relativePath) || matcher.test(path.basename(realPath));
}

function localPathSafetyError(realPath = "") {
  if (!realPath) return "path_not_found";
  const blockedReason = blockedPathReason(realPath);
  if (blockedReason) return blockedReason;
  if (!isAllowedLocalPath(realPath)) return "path_not_allowed";
  return null;
}

function scanLocalPath({
  inputPath,
  recursive = true,
  fileTypes = DEFAULT_FILE_TYPES,
  glob = null,
}) {
  const rootPath = resolveLocalPath(inputPath);
  const rootError = localPathSafetyError(rootPath);
  if (rootError)
    return {
      error: rootError,
      scannedFiles: [],
      files: [],
      skippedFiles: [
        {
          path: String(inputPath || ""),
          reason: rootError,
        },
      ],
    };

  const scannedFiles = [];
  const files = [];
  const skippedFiles = [];
  const seen = new Set();

  function recordSkip(realPath, reason) {
    skippedFiles.push({
      path: safeDisplayPath(realPath),
      reason,
    });
  }

  function visit(realPath, scanRoot) {
    const safetyError = localPathSafetyError(realPath);
    if (safetyError) {
      recordSkip(realPath, safetyError);
      return;
    }

    const stat = fs.statSync(realPath);
    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(realPath, { withFileTypes: true })) {
        const childPath = path.join(realPath, entry.name);
        const childRealPath = safeRealpath(childPath);
        if (!childRealPath) {
          recordSkip(childPath, "path_not_found");
          continue;
        }

        const childSafetyError = localPathSafetyError(childRealPath);
        if (childSafetyError) {
          recordSkip(childRealPath, childSafetyError);
          continue;
        }

        if (entry.isDirectory()) {
          if (recursive) visit(childRealPath, scanRoot);
          continue;
        }
        if (entry.isFile() || entry.isSymbolicLink())
          visit(childRealPath, scanRoot);
      }
      return;
    }

    if (!stat.isFile()) {
      recordSkip(realPath, "not_a_file");
      return;
    }

    if (seen.has(realPath)) return;
    seen.add(realPath);
    scannedFiles.push(safeDisplayPath(realPath));

    if (!supportedFileType(realPath, fileTypes)) {
      recordSkip(realPath, "unsupported_file_type");
      return;
    }
    if (!matchesGlob(realPath, scanRoot, glob)) {
      recordSkip(realPath, "glob_mismatch");
      return;
    }

    files.push({
      realPath,
      displayPath: safeDisplayPath(realPath),
      filename: path.basename(realPath),
    });
  }

  visit(rootPath, rootPath);
  return { error: null, scannedFiles, files, skippedFiles };
}

function isUnsafeDocumentIdentifier(identifier = "") {
  const value = String(identifier || "").trim();
  if (!value) return true;
  if (path.isAbsolute(value)) return true;
  if (/^[a-zA-Z]:[\\/]/.test(value)) return true;
  return value
    .split(/[\\/]+/)
    .filter(Boolean)
    .some((part) => part === "..");
}

function safeBasename(value = "") {
  return path.basename(String(value || ""));
}

function readDocumentMetadata(docpath = "") {
  try {
    const fullPath = path.resolve(documentsPath, normalizePath(docpath));
    if (!fs.existsSync(fullPath) || !isWithin(documentsPath, fullPath))
      return null;
    const data = safeJsonParse(fs.readFileSync(fullPath, "utf8"), null);
    if (!data?.pageContent) return null;
    return data;
  } catch {
    return null;
  }
}

function documentMatchesIdentifier(
  docpath = "",
  metadata = {},
  identifier = ""
) {
  const normalizedIdentifier = String(identifier || "").trim();
  const filename = safeBasename(docpath);
  const checks = [
    docpath,
    filename,
    metadata?.title,
    metadata?.url,
    metadata?.docSource,
    metadata?.chunkSource,
  ]
    .filter(Boolean)
    .map((value) => String(value).trim());
  return checks.includes(normalizedIdentifier);
}

async function documentLibraryCandidates(identifier = "") {
  if (isUnsafeDocumentIdentifier(identifier)) return [];

  const normalizedIdentifier = normalizePath(identifier);
  const exactFullPath = path.resolve(documentsPath, normalizedIdentifier);
  const candidates = new Map();

  if (
    fs.existsSync(exactFullPath) &&
    isWithin(documentsPath, exactFullPath) &&
    fs.lstatSync(exactFullPath).isFile()
  ) {
    const metadata = readDocumentMetadata(normalizedIdentifier);
    if (metadata) candidates.set(normalizedIdentifier, normalizedIdentifier);
  }

  if (!fs.existsSync(documentsPath)) return Array.from(candidates.values());
  for (const folder of fs.readdirSync(documentsPath)) {
    const folderPath = path.resolve(documentsPath, folder);
    if (
      !isWithin(documentsPath, folderPath) ||
      !fs.lstatSync(folderPath).isDirectory()
    )
      continue;

    for (const file of fs.readdirSync(folderPath)) {
      if (path.extname(file) !== ".json") continue;
      const docpath = `${folder}/${file}`;
      const metadata = readDocumentMetadata(docpath);
      if (metadata && documentMatchesIdentifier(docpath, metadata, identifier))
        candidates.set(docpath, docpath);
    }
  }

  return Array.from(candidates.values());
}

function parsedFileMatchesIdentifier(parsedFile, identifier = "") {
  const metadata = safeJsonParse(parsedFile?.metadata, {});
  const checks = [
    parsedFile?.id,
    parsedFile?.filename,
    metadata?.title,
    metadata?.location,
    safeBasename(metadata?.location),
  ]
    .filter(Boolean)
    .map((value) => String(value).trim());
  return checks.includes(String(identifier || "").trim());
}

async function parsedFileCandidates({
  workspace,
  userId = null,
  identifier = "",
}) {
  if (isUnsafeDocumentIdentifier(identifier)) return [];

  const files = await WorkspaceParsedFiles.where({
    workspaceId: workspace.id,
    ...(userId ? { userId } : {}),
  });
  return files.filter((file) => parsedFileMatchesIdentifier(file, identifier));
}

async function prepareParsedFile(parsedFile) {
  const metadata = safeJsonParse(parsedFile.metadata, {});
  const location = metadata.location;
  if (!location) throw new Error("No file location in metadata");

  const sourceFile = path.resolve(directUploadsPath, safeBasename(location));
  if (!fs.existsSync(sourceFile) || !isWithin(directUploadsPath, sourceFile))
    throw new Error("Source file not found");

  const customDocsPath = path.resolve(documentsPath, "custom-documents");
  if (!fs.existsSync(customDocsPath))
    fs.mkdirSync(customDocsPath, { recursive: true });

  const targetFile = path.resolve(customDocsPath, safeBasename(location));
  if (!isWithin(documentsPath, targetFile))
    throw new Error("Invalid document target");

  fs.copyFileSync(sourceFile, targetFile);
  fs.unlinkSync(sourceFile);
  await WorkspaceParsedFiles.delete({ id: parsedFile.id });
  return `custom-documents/${safeBasename(location)}`;
}

async function resolveDocumentIdentifiers({
  workspace,
  userId = null,
  identifiers = [],
}) {
  const resolved = [];
  const errors = [];

  for (const identifier of identifiers) {
    if (isUnsafeDocumentIdentifier(identifier)) {
      errors.push({
        identifier,
        error: "invalid_document_identifier",
      });
      continue;
    }

    const [documentCandidates, parsedCandidates] = await Promise.all([
      documentLibraryCandidates(identifier),
      parsedFileCandidates({ workspace, userId, identifier }),
    ]);
    const totalMatches = documentCandidates.length + parsedCandidates.length;

    if (totalMatches === 0) {
      errors.push({ identifier, error: "document_not_found" });
      continue;
    }
    if (totalMatches > 1) {
      errors.push({ identifier, error: "ambiguous_document_identifier" });
      continue;
    }

    if (documentCandidates.length === 1) {
      resolved.push({
        type: "document",
        identifier,
        docpath: documentCandidates[0],
      });
      continue;
    }

    resolved.push({
      type: "parsed-file",
      identifier,
      parsedFile: parsedCandidates[0],
    });
  }

  return { resolved, errors };
}

async function documentsForPaths(workspaceId, docpaths = []) {
  if (docpaths.length === 0) return [];
  const docs = await Document.where(
    {
      workspaceId,
      docpath: { in: docpaths },
    },
    null,
    { createdAt: "desc" },
    null,
    {
      docId: true,
      docpath: true,
      embeddingStatus: true,
    }
  );
  const seen = new Set();
  return docs
    .filter((doc) => {
      if (seen.has(doc.docpath)) return false;
      seen.add(doc.docpath);
      return true;
    })
    .map((doc) => ({
      docId: doc.docId,
      path: doc.docpath,
    }));
}

function normalizeIdentifiers(input = {}) {
  const identifiers = [];
  if (typeof input.document_identifier === "string")
    identifiers.push(input.document_identifier);
  if (typeof input.document_path === "string")
    identifiers.push(input.document_path);
  if (typeof input.document_filename === "string")
    identifiers.push(input.document_filename);
  if (Number.isInteger(input.parsed_file_id))
    identifiers.push(String(input.parsed_file_id));
  if (Array.isArray(input.document_identifiers))
    identifiers.push(
      ...input.document_identifiers.filter((value) => typeof value === "string")
    );

  return [...new Set(identifiers.map((value) => value.trim()).filter(Boolean))];
}

function parseBatchJobDocuments(batchJob = null) {
  if (!batchJob) return [];
  const documentIds = Array.isArray(batchJob.documentIds)
    ? batchJob.documentIds
    : safeJsonParse(batchJob.documentIds, []);
  const documentPaths = Array.isArray(batchJob.documentPaths)
    ? batchJob.documentPaths
    : safeJsonParse(batchJob.documentPaths, []);

  return documentPaths.map((docpath, index) => ({
    docId: documentIds[index] || null,
    path: docpath,
  }));
}

async function processLocalFilesWithCollector(files = []) {
  const Collector = new CollectorApi();
  const processingOnline = await Collector.online();
  if (!processingOnline)
    return {
      additions: [],
      importedFiles: [],
      skippedFiles: files.map((file) => ({
        path: file.displayPath,
        reason: "collector_offline",
      })),
    };

  if (!fs.existsSync(hotdirPath)) fs.mkdirSync(hotdirPath, { recursive: true });

  const additions = [];
  const importedFiles = [];
  const skippedFiles = [];
  for (const file of files) {
    const tempName = sanitizeFileName(`${uuidv4()}-${file.filename}`);
    const hotdirFilePath = path.resolve(hotdirPath, tempName);
    if (!isInsideOrEqual(hotdirPath, hotdirFilePath)) {
      skippedFiles.push({
        path: file.displayPath,
        reason: "invalid_hotdir_path",
      });
      continue;
    }

    try {
      fs.copyFileSync(file.realPath, hotdirFilePath);
      const {
        success,
        reason,
        documents = [],
      } = await Collector.processDocument(tempName, {
        title: file.filename,
        docSource: "local path document imported by document-ingest-agent.",
      });

      if (!success || documents.length === 0) {
        skippedFiles.push({
          path: file.displayPath,
          reason: reason || "collector_parse_failed",
        });
        continue;
      }

      const documentPaths = documents
        .map((doc) => doc.location)
        .filter((location) => !!location);
      additions.push(...documentPaths);
      importedFiles.push({
        path: file.displayPath,
        documentPaths,
      });
    } catch (error) {
      skippedFiles.push({
        path: file.displayPath,
        reason: error.message,
      });
    }
  }

  return {
    additions: [...new Set(additions)],
    importedFiles,
    skippedFiles,
  };
}

function responseDocumentsForBatch(batchJob = null) {
  return parseBatchJobDocuments(batchJob);
}

function toImportedDocumentFiles(documents = []) {
  return documents.map((doc) => ({
    path: doc.path,
    docId: doc.docId,
  }));
}

const documentIngestAgent = {
  name: TOOL_NAME,
  startupConfig: {
    params: {},
  },
  plugin: function () {
    return {
      name: this.name,
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Add local files, local directories, already uploaded files, parsed files, or workspace-accessible documents to the current workspace knowledge base. Use this when the user asks to add a file, folder, document, PDF, or directory to the knowledge base or workspace. You can pass a local path such as ~/Desktop/biology or /Users/name/Downloads/file.pdf. This tool ingests documents only and must not be used to store plain memory.",
          examples: [
            {
              prompt: "Add the onboarding PDF to this workspace knowledge base",
              call: JSON.stringify({
                document_identifier: "onboarding.pdf",
              }),
            },
            {
              prompt: "把刚上传的文件加入知识库",
              call: JSON.stringify({
                document_identifier: "uploaded-file.pdf",
              }),
            },
            {
              prompt: "把桌面 biology 文件夹导入知识库",
              call: JSON.stringify({
                path: "~/Desktop/biology",
                recursive: true,
                file_types: ["pdf", "docx", "md"],
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              path: {
                type: "string",
                description:
                  "A local file or directory path to scan, parse, and ingest. Supports ~, absolute paths, and relative paths. Allowed roots are Desktop, Documents, and Downloads.",
              },
              recursive: {
                type: "boolean",
                description:
                  "Whether to recursively scan directories. Defaults to true.",
              },
              file_types: {
                type: "array",
                items: { type: "string" },
                description:
                  'Allowed file extensions for local path scanning. Defaults to ["pdf","docx","txt","md","csv"].',
              },
              glob: {
                type: "string",
                description:
                  'Optional simple glob filter for local path scanning, such as "*.pdf" or "**/*.pdf".',
              },
              document_identifier: {
                type: "string",
                description:
                  "A safe relative document path, document filename, parsed chat file id, or parsed chat file name that already exists in this workspace or the uploaded document library.",
              },
              document_identifiers: {
                type: "array",
                items: { type: "string" },
                description:
                  "Multiple safe relative document identifiers to ingest in one call.",
              },
              document_path: {
                type: "string",
                description:
                  "Optional safe relative document path under the existing document library, such as custom-documents/file.json.",
              },
              document_filename: {
                type: "string",
                description:
                  "Optional document filename to resolve from already uploaded documents.",
              },
              parsed_file_id: {
                type: "integer",
                description:
                  "Optional id of a file uploaded to the current workspace chat and parsed by AnythingLLM.",
              },
            },
            additionalProperties: false,
          },
          handler: async function (input = {}) {
            try {
              return await this.ingest(input);
            } catch (error) {
              this.super.handlerProps.log(
                `document-ingest-agent raised an error. ${error.message}`
              );
              return JSON.stringify({
                success: false,
                error: error.message,
              });
            }
          },
          ingest: async function (input = {}) {
            if (typeof input.path === "string" && input.path.trim())
              return await this.ingestLocalPath(input);
            return await this.ingestWorkspaceDocuments(input);
          },
          selectEmbeddingMode: async function (payload = {}) {
            const approval = this.super.requestToolApproval
              ? await this.super.requestToolApproval({
                  skillName: TOOL_NAME,
                  description: APPROVAL_DESCRIPTION,
                  payload,
                })
              : { approved: false };

            // The current approval UI only supports approve/reject. For this tool,
            // approve means use async batch ingest, while reject/cancel/timeout means
            // continue with direct ingest instead of aborting the document import.
            return approval.approved ? "batch" : "direct";
          },
          batchSupportResponse: function ({
            source,
            scannedFiles,
            skippedFiles,
            supportError,
          }) {
            return JSON.stringify({
              success: false,
              source,
              scannedFiles,
              importedFiles: [],
              skippedFiles,
              batchJobId: null,
              embeddingStatus: null,
              error: supportError,
              hint: "Batch ingest is not supported for the current embedding provider. Reject the batch prompt or run this again and choose direct ingest.",
            });
          },
          ingestLocalPath: async function (input = {}) {
            this.super.handlerProps.log(
              "document-ingest-agent: local path scan"
            );
            const scanResult = scanLocalPath({
              inputPath: input.path,
              recursive:
                typeof input.recursive === "boolean" ? input.recursive : true,
              fileTypes: input.file_types || DEFAULT_FILE_TYPES,
              glob: input.glob || null,
            });

            if (scanResult.error)
              return JSON.stringify({
                success: false,
                source: "local_path",
                scannedFiles: scanResult.scannedFiles,
                importedFiles: [],
                skippedFiles: scanResult.skippedFiles,
                batchJobId: null,
                embeddingStatus: null,
                error: scanResult.error,
              });

            if (scanResult.files.length === 0)
              return JSON.stringify({
                success: false,
                source: "local_path",
                scannedFiles: scanResult.scannedFiles,
                importedFiles: [],
                skippedFiles: scanResult.skippedFiles,
                batchJobId: null,
                embeddingStatus: null,
                error: "no_supported_files_found",
              });

            const embeddingModeOverride = await this.selectEmbeddingMode({
              source: "local_path",
              files: scanResult.files.map((file) => file.displayPath),
            });
            if (embeddingModeOverride === "batch") {
              const {
                batchSupportError,
              } = require("../../../DocumentEmbeddingBatch");
              const supportError = batchSupportError();
              if (supportError)
                return this.batchSupportResponse({
                  source: "local_path",
                  scannedFiles: scanResult.scannedFiles,
                  skippedFiles: scanResult.skippedFiles,
                  supportError,
                });
            }

            const { additions, importedFiles, skippedFiles } =
              await processLocalFilesWithCollector(scanResult.files);
            const allSkippedFiles = [
              ...scanResult.skippedFiles,
              ...skippedFiles,
            ];
            if (additions.length === 0)
              return JSON.stringify({
                success: false,
                source: "local_path",
                scannedFiles: scanResult.scannedFiles,
                importedFiles,
                skippedFiles: allSkippedFiles,
                batchJobId: null,
                embeddingStatus: null,
                error: "no_documents_parsed",
              });

            this.super.handlerProps.log(
              `document-ingest-agent: document ${embeddingModeOverride} ingest`
            );
            const workspace = this.super.handlerProps.invocation.workspace;
            const userId = this.super.handlerProps.invocation.user_id || null;
            const {
              failedToEmbed = [],
              errors: addErrors = [],
              embedded = [],
              batchJob = null,
            } = await Document.addDocuments(workspace, additions, userId, {
              embeddingModeOverride,
            });

            if (failedToEmbed.length > 0)
              return JSON.stringify({
                success: false,
                source: "local_path",
                scannedFiles: scanResult.scannedFiles,
                importedFiles,
                skippedFiles: allSkippedFiles,
                batchJobId: null,
                embeddingStatus: null,
                error: addErrors[0] || "document_ingest_failed",
                failedToEmbed,
              });

            if (embeddingModeOverride === "batch") {
              const documents = responseDocumentsForBatch(batchJob);
              return JSON.stringify({
                success: true,
                source: "local_path",
                scannedFiles: scanResult.scannedFiles,
                importedFiles,
                skippedFiles: allSkippedFiles,
                batchJobId: batchJob?.jobId || null,
                documents,
                embeddingStatus: "processing",
                message:
                  "Documents are being processed asynchronously. You can view progress in Settings -> Batch Jobs.",
              });
            }

            const documents = await documentsForPaths(workspace.id, embedded);
            return JSON.stringify({
              success: true,
              source: "local_path",
              scannedFiles: scanResult.scannedFiles,
              importedFiles,
              skippedFiles: allSkippedFiles,
              batchJobId: null,
              documents,
              embeddingStatus: "completed",
              message:
                "Documents were ingested directly and are available for immediate retrieval.",
            });
          },
          ingestWorkspaceDocuments: async function (input = {}) {
            const workspace = this.super.handlerProps.invocation.workspace;
            const userId = this.super.handlerProps.invocation.user_id || null;
            const identifiers = normalizeIdentifiers(input);
            if (identifiers.length === 0)
              return JSON.stringify({
                success: false,
                source: "workspace_document",
                scannedFiles: [],
                importedFiles: [],
                skippedFiles: [],
                batchJobId: null,
                embeddingStatus: null,
                error: "missing_document_identifier",
              });

            const { resolved, errors } = await resolveDocumentIdentifiers({
              workspace,
              userId,
              identifiers,
            });
            if (errors.length > 0 || resolved.length === 0)
              return JSON.stringify({
                success: false,
                source: "workspace_document",
                scannedFiles: identifiers,
                importedFiles: [],
                skippedFiles: errors.map((error) => ({
                  path: error.identifier,
                  reason: error.error,
                })),
                batchJobId: null,
                embeddingStatus: null,
                errors,
              });

            const embeddingModeOverride = await this.selectEmbeddingMode({
              source: "workspace_document",
              documents: resolved.map((doc) => ({
                identifier: doc.identifier,
                type: doc.type,
              })),
            });
            if (embeddingModeOverride === "batch") {
              const {
                batchSupportError,
              } = require("../../../DocumentEmbeddingBatch");
              const supportError = batchSupportError();
              if (supportError)
                return this.batchSupportResponse({
                  source: "workspace_document",
                  scannedFiles: identifiers,
                  skippedFiles: [],
                  supportError,
                });
            }

            const additions = [];
            for (const doc of resolved) {
              if (doc.type === "document") {
                additions.push(doc.docpath);
                continue;
              }
              additions.push(await prepareParsedFile(doc.parsedFile));
            }

            const uniqueAdditions = [...new Set(additions)];
            this.super.handlerProps.log(
              `document-ingest-agent: document ${embeddingModeOverride} ingest`
            );
            const {
              failedToEmbed = [],
              errors: addErrors = [],
              embedded = [],
              batchJob = null,
            } = await Document.addDocuments(
              workspace,
              uniqueAdditions,
              userId,
              { embeddingModeOverride }
            );

            if (failedToEmbed.length > 0)
              return JSON.stringify({
                success: false,
                source: "workspace_document",
                scannedFiles: identifiers,
                importedFiles: [],
                skippedFiles: failedToEmbed.map((failed) => ({
                  path: failed,
                  reason: addErrors[0] || "document_ingest_failed",
                })),
                batchJobId: null,
                embeddingStatus: null,
                error: addErrors[0] || "document_ingest_failed",
                failedToEmbed,
              });

            if (embeddingModeOverride === "batch")
              return JSON.stringify({
                success: true,
                source: "workspace_document",
                scannedFiles: identifiers,
                importedFiles: responseDocumentsForBatch(batchJob),
                skippedFiles: [],
                batchJobId: batchJob?.jobId || null,
                documents: responseDocumentsForBatch(batchJob),
                embeddingStatus: "processing",
                message:
                  "Documents are being processed asynchronously. You can view progress in Settings -> Batch Jobs.",
              });

            const documents = await documentsForPaths(workspace.id, embedded);
            return JSON.stringify({
              success: true,
              source: "workspace_document",
              scannedFiles: identifiers,
              importedFiles: toImportedDocumentFiles(documents),
              skippedFiles: [],
              batchJobId: null,
              documents,
              embeddingStatus: "completed",
              message:
                "Documents were ingested directly and are available for immediate retrieval.",
            });
          },
        });
      },
    };
  },
};

module.exports = {
  documentIngestAgent,
  _private: {
    isUnsafeDocumentIdentifier,
    normalizeIdentifiers,
    resolveDocumentIdentifiers,
    scanLocalPath,
    resolveLocalPath,
    localPathSafetyError,
    processLocalFilesWithCollector,
  },
};

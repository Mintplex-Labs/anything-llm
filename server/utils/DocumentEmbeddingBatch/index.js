const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { OpenAI } = require("openai");
const { TextSplitter } = require("../TextSplitter");
const {
  getEmbeddingEngineSelection,
  getVectorDbClass,
  toChunks,
} = require("../helpers");
const { fileData, storeVectorResult } = require("../files");
const { SystemSettings } = require("../../models/systemSettings");
const { EmbeddingBatchJob } = require("../../models/embeddingBatchJob");
const prisma = require("../prisma");

const DASH_SCOPE_BASE_PATH =
  "https://dashscope.aliyuncs.com/compatible-mode/v1";
const DASH_SCOPE_MODEL = "text-embedding-v4";
const activeTimers = new Map();
const TRANSIENT_ERROR_PATTERNS = [
  /connection error/i,
  /ECONNRESET/i,
  /ETIMEDOUT/i,
  /ENOTFOUND/i,
  /EAI_AGAIN/i,
  /network timeout/i,
  /fetch failed/i,
  /rate limit/i,
  /too many requests/i,
  /\b429\b/i,
];

function storagePath() {
  const basePath =
    process.env.NODE_ENV === "development"
      ? path.resolve(__dirname, "../../storage")
      : path.resolve(
          process.env.STORAGE_DIR || path.resolve(__dirname, "../../storage")
        );
  const target = path.resolve(basePath, "embedding-batches");
  if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
  return target;
}

function normalizedBasePath() {
  return String(process.env.EMBEDDING_BASE_PATH || "").replace(/\/+$/, "");
}

function documentEmbeddingMode(modeOverride = null) {
  if (["batch", "direct"].includes(modeOverride)) return modeOverride;
  return process.env.DOCUMENT_EMBEDDING_MODE === "batch" ? "batch" : "direct";
}

function isBatchMode(modeOverride = null) {
  return documentEmbeddingMode(modeOverride) === "batch";
}

function batchSupportError() {
  if (process.env.EMBEDDING_ENGINE !== "generic-openai")
    return "batch_not_supported_for_provider";
  if (normalizedBasePath() !== DASH_SCOPE_BASE_PATH)
    return "batch_not_supported_for_provider";
  if (process.env.EMBEDDING_MODEL_PREF !== DASH_SCOPE_MODEL)
    return "batch_not_supported_for_provider";
  if (!process.env.GENERIC_OPEN_AI_EMBEDDING_API_KEY)
    return "missing_generic_openai_embedding_api_key";
  return null;
}

function batchClient() {
  return new OpenAI({
    baseURL: normalizedBasePath(),
    apiKey: process.env.GENERIC_OPEN_AI_EMBEDDING_API_KEY,
  });
}

function pollIntervalMs() {
  const seconds = Number(
    process.env.EMBEDDING_BATCH_POLL_INTERVAL_SECONDS || 30
  );
  return Math.max(5, Number.isNaN(seconds) ? 30 : seconds) * 1_000;
}

function maxRetries() {
  const retries = Number(process.env.EMBEDDING_BATCH_MAX_RETRIES || 20);
  return Math.max(0, Number.isNaN(retries) ? 20 : retries);
}

function retryBaseMs() {
  const seconds = Number(process.env.EMBEDDING_BATCH_RETRY_BASE_SECONDS || 30);
  return Math.max(1, Number.isNaN(seconds) ? 30 : seconds) * 1_000;
}

function retryMaxMs() {
  const seconds = Number(process.env.EMBEDDING_BATCH_RETRY_MAX_SECONDS || 300);
  return Math.max(1, Number.isNaN(seconds) ? 300 : seconds) * 1_000;
}

function retryDelayMs(retryCount) {
  const delay = retryBaseMs() * Math.pow(2, Math.max(0, retryCount - 1));
  return Math.min(delay, retryMaxMs());
}

function errorMessage(error) {
  return String(error?.message || error || "Unknown error");
}

function errorStatus(error) {
  return Number(
    error?.status ||
      error?.statusCode ||
      error?.response?.status ||
      error?.response?.statusCode
  );
}

function isTransientBatchError(error) {
  const status = errorStatus(error);
  if (status === 429 || (status >= 500 && status <= 599)) return true;

  const message = errorMessage(error);
  if (TRANSIENT_ERROR_PATTERNS.some((pattern) => pattern.test(message)))
    return true;
  return /\b5\d{2}\b/.test(message);
}

function maxItemsPerFile() {
  const max = Number(process.env.EMBEDDING_BATCH_MAX_ITEMS_PER_FILE || 50000);
  return Number.isNaN(max) ? 50000 : max;
}

function completionWindow() {
  return process.env.EMBEDDING_BATCH_COMPLETION_WINDOW || "24h";
}

function schedule(jobId, delayMs = pollIntervalMs()) {
  if (activeTimers.has(jobId)) return;
  const timer = setTimeout(
    async () => {
      activeTimers.delete(jobId);
      await processBatchJob(jobId);
    },
    Math.max(0, delayMs)
  );
  activeTimers.set(jobId, timer);
}

function stopSchedule(jobId) {
  const timer = activeTimers.get(jobId);
  if (timer) clearTimeout(timer);
  activeTimers.delete(jobId);
}

async function createWorkspaceDocuments({ workspace, additions, jobId }) {
  const docs = [];
  const failedToEmbed = [];
  const errors = new Set();

  for (const docpath of additions) {
    const data = await fileData(docpath);
    if (!data) {
      failedToEmbed.push(docpath);
      errors.add("Failed to load file data");
      continue;
    }

    const docId = uuidv4();
    const { pageContent: _pageContent, ...metadata } = data;
    const newDoc = {
      docId,
      filename: docpath.split("/")[1],
      docpath,
      workspaceId: workspace.id,
      metadata: JSON.stringify(metadata),
      embeddingStatus: "processing",
      embeddingBatchJobId: jobId,
    };

    try {
      await prisma.workspace_documents.create({ data: newDoc });
      docs.push({ ...newDoc, data });
    } catch (error) {
      failedToEmbed.push(metadata?.title || newDoc.filename);
      errors.add(error.message);
    }
  }

  return { docs, failedToEmbed, errors: Array.from(errors) };
}

async function enqueueBatchDocuments({
  workspace,
  additions = [],
  userId = null,
}) {
  const supportError = batchSupportError();
  if (supportError)
    return { failedToEmbed: additions, errors: [supportError], embedded: [] };

  const jobId = uuidv4();
  const { docs, failedToEmbed, errors } = await createWorkspaceDocuments({
    workspace,
    additions,
    jobId,
  });

  if (docs.length === 0)
    return { failedToEmbed, errors, embedded: [], batchJob: null };

  const { job, error } = await EmbeddingBatchJob.create({
    jobId,
    workspaceId: workspace.id,
    workspaceSlug: workspace.slug,
    documentIds: docs.map((doc) => doc.docId),
    documentPaths: docs.map((doc) => doc.docpath),
    provider: "generic-openai",
    model: process.env.EMBEDDING_MODEL_PREF,
    createdBy: userId,
  });

  if (error) {
    await prisma.workspace_documents.updateMany({
      where: { embeddingBatchJobId: jobId },
      data: {
        embeddingStatus: "failed",
        embeddingError: error,
        lastUpdatedAt: new Date(),
      },
    });
    return { failedToEmbed: additions, errors: [error], embedded: [] };
  }

  const { emitProgress } = require("../EmbeddingWorkerManager");
  emitProgress(workspace.slug, {
    type: "batch_starting",
    workspaceSlug: workspace.slug,
    userId,
    filenames: docs.map((doc) => doc.docpath),
    totalDocs: docs.length,
    batchJobId: job.jobId,
  });
  for (const doc of docs) {
    emitProgress(workspace.slug, {
      type: "doc_starting",
      workspaceSlug: workspace.slug,
      userId,
      filename: doc.docpath,
      batchJobId: job.jobId,
    });
  }

  setImmediate(() => processBatchJob(job.jobId));
  return {
    failedToEmbed,
    errors,
    embedded: docs.map((doc) => doc.docpath),
    batchJob: job,
  };
}

async function prepareJsonl(job) {
  const docs = await prisma.workspace_documents.findMany({
    where: { embeddingBatchJobId: job.jobId },
  });
  const EmbedderEngine = getEmbeddingEngineSelection();
  const rows = [];
  const chunkManifest = {};

  for (const doc of docs) {
    const data = await fileData(doc.docpath);
    if (!data?.pageContent) continue;

    const { pageContent, ...metadata } = data;
    const textSplitter = new TextSplitter({
      chunkSize: TextSplitter.determineMaxChunkSize(
        await SystemSettings.getValueOrFallback({
          label: "text_splitter_chunk_size",
        }),
        EmbedderEngine?.embeddingMaxChunkLength
      ),
      chunkOverlap: await SystemSettings.getValueOrFallback(
        { label: "text_splitter_chunk_overlap" },
        20
      ),
      chunkHeaderMeta: TextSplitter.buildHeaderMeta(metadata),
      chunkPrefix: EmbedderEngine?.embeddingPrefix,
    });
    const textChunks = await textSplitter.splitText(pageContent);
    chunkManifest[doc.docId] = {
      docId: doc.docId,
      docpath: doc.docpath,
      data,
      chunks: textChunks,
    };

    for (const [chunkIndex, chunkText] of textChunks.entries()) {
      rows.push({
        custom_id: `doc:${doc.docId}:chunk:${chunkIndex}`,
        method: "POST",
        url: "/v1/embeddings",
        body: {
          model: DASH_SCOPE_MODEL,
          input: chunkText,
        },
      });
    }
  }

  if (rows.length === 0) throw new Error("No document chunks to embed.");
  if (rows.length > maxItemsPerFile()) throw new Error("batch_too_large");

  const jsonlPath = path.join(storagePath(), `${job.jobId}.jsonl`);
  fs.writeFileSync(
    jsonlPath,
    rows.map((row) => JSON.stringify(row)).join("\n")
  );
  fs.writeFileSync(
    path.join(storagePath(), `${job.jobId}.manifest.json`),
    JSON.stringify(chunkManifest),
    "utf8"
  );
  return { jsonlPath, totalChunks: rows.length };
}

async function submitBatch(job) {
  const client = batchClient();
  let inputFileId = job.inputFileId;

  if (!inputFileId) {
    const { jsonlPath, totalChunks } = await prepareJsonl(job);
    const uploaded = await client.files.create({
      file: fs.createReadStream(jsonlPath),
      purpose: "batch",
    });
    inputFileId = uploaded.id;
    await EmbeddingBatchJob.update(job.jobId, { inputFileId });
    await EmbeddingBatchJob.setStatus(job.jobId, "file_uploaded", {
      inputFileId,
      totalChunks,
    });
  }

  if (!job.batchId) {
    const batch = await client.batches.create({
      input_file_id: inputFileId,
      endpoint: "/v1/embeddings",
      completion_window: completionWindow(),
    });
    await EmbeddingBatchJob.update(job.jobId, { batchId: batch.id });
    await EmbeddingBatchJob.setStatus(job.jobId, "submitted", {
      batchId: batch.id,
    });
  }
}

async function retrieveBatch(job) {
  const client = batchClient();
  const batch = await client.batches.retrieve(job.batchId);
  await EmbeddingBatchJob.logEvent(job.jobId, "polling", {
    batchStatus: batch.status,
  });

  if (["validating", "in_progress", "finalizing"].includes(batch.status)) {
    await EmbeddingBatchJob.update(job.jobId, {
      status: "polling",
      nextRetryAt: null,
    });
    schedule(job.jobId);
    return;
  }

  if (batch.status === "completed") {
    await EmbeddingBatchJob.update(job.jobId, {
      outputFileId: batch.output_file_id || null,
      errorFileId: batch.error_file_id || null,
      status: "polling",
    });
    await writeBatchOutput(job.jobId, batch.output_file_id);
    return;
  }

  throw new Error(`DashScope batch ${batch.status || "failed"}`);
}

function parseCustomId(customId) {
  const match = String(customId || "").match(/^doc:(.+):chunk:(\d+)$/);
  if (!match) return null;
  return { docId: match[1], chunkIndex: Number(match[2]) };
}

function buildWorkspaceDocumentRecord({ docId, docManifest, job }) {
  const { pageContent: _pageContent, ...metadata } = docManifest.data || {};
  return {
    docId,
    filename: docManifest.docpath.split("/")[1],
    docpath: docManifest.docpath,
    workspaceId: job.workspaceId,
    metadata: JSON.stringify(metadata),
    embeddingStatus: "processing",
    embeddingError: null,
    embeddingBatchJobId: job.jobId,
  };
}

async function ensureWorkspaceDocumentForBatch({ docId, docManifest, job }) {
  const existingDoc = await prisma.workspace_documents.findFirst({
    where: { docId },
  });
  if (existingDoc) return existingDoc;

  return await prisma.workspace_documents.create({
    data: buildWorkspaceDocumentRecord({ docId, docManifest, job }),
  });
}

async function downloadOutputFile(outputFileId) {
  const response = await batchClient().files.content(outputFileId);
  return await response.text();
}

async function writeBatchOutput(jobId, outputFileId) {
  if (!outputFileId) throw new Error("Batch completed without output_file_id.");

  const manifestPath = path.join(storagePath(), `${jobId}.manifest.json`);
  if (!fs.existsSync(manifestPath))
    throw new Error("Batch manifest missing; cannot map embeddings to chunks.");

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const outputText = await downloadOutputFile(outputFileId);
  const outputPath = path.join(storagePath(), `${jobId}.output.jsonl`);
  fs.writeFileSync(outputPath, outputText, "utf8");

  const vectorsByDoc = {};
  for (const line of outputText.split(/\r?\n/).filter(Boolean)) {
    const row = JSON.parse(line);
    const parsed = parseCustomId(row.custom_id);
    if (!parsed) throw new Error(`Invalid custom_id in batch output.`);
    if (row.error) throw new Error(row.error?.message || "Batch item failed.");

    const docManifest = manifest[parsed.docId];
    const embedding = row.response?.body?.data?.[0]?.embedding;
    const text = docManifest?.chunks?.[parsed.chunkIndex];
    if (!docManifest || !embedding || !text)
      throw new Error(`Missing embedding result for ${row.custom_id}.`);

    if (!vectorsByDoc[parsed.docId]) vectorsByDoc[parsed.docId] = [];
    vectorsByDoc[parsed.docId][parsed.chunkIndex] = {
      id: uuidv4(),
      values: embedding,
      metadata: {
        ...docManifest.data,
        pageContent: undefined,
        text,
      },
    };
    delete vectorsByDoc[parsed.docId][parsed.chunkIndex].metadata.pageContent;
  }

  const VectorDb = getVectorDbClass();
  const job = await EmbeddingBatchJob.get({ jobId });
  let vectorsWritten = 0;

  for (const [docId, vectorRecords] of Object.entries(vectorsByDoc)) {
    const docManifest = manifest[docId];
    await ensureWorkspaceDocumentForBatch({
      docId,
      docManifest,
      job,
    });

    const vectors = vectorRecords.filter(Boolean);
    await storeVectorResult(toChunks(vectors, 500), docManifest.docpath);
    const { vectorized, error } = await VectorDb.addDocumentToNamespace(
      job.workspaceSlug,
      { ...docManifest.data, docId },
      docManifest.docpath
    );
    if (!vectorized) throw new Error(error || "Failed to write vectors.");
    vectorsWritten += vectors.length;
  }

  await prisma.workspace_documents.updateMany({
    where: { embeddingBatchJobId: jobId },
    data: {
      embeddingStatus: "completed",
      embeddingError: null,
      lastUpdatedAt: new Date(),
    },
  });
  await EmbeddingBatchJob.logEvent(jobId, "vectors_written", {
    count: vectorsWritten,
  });
  await EmbeddingBatchJob.setStatus(jobId, "completed", {
    outputFileId,
    vectorsWritten,
  });

  const { emitProgress } = require("../EmbeddingWorkerManager");
  for (const docPath of job.documentPaths) {
    emitProgress(job.workspaceSlug, {
      type: "doc_complete",
      workspaceSlug: job.workspaceSlug,
      filename: docPath,
      batchJobId: jobId,
    });
  }
  emitProgress(job.workspaceSlug, {
    type: "all_complete",
    workspaceSlug: job.workspaceSlug,
    embedded: job.documentPaths.length,
    failed: 0,
    embeddedFiles: job.documentPaths,
    batchJobId: jobId,
  });
  stopSchedule(jobId);
}

async function scheduleTransientRetry(jobId, error) {
  const job = await EmbeddingBatchJob.get({ jobId });
  if (!job) return { scheduled: false, retryCount: 0 };

  const retryCount = Number(job.retryCount || 0) + 1;
  const message = errorMessage(error);
  if (retryCount > maxRetries()) return { scheduled: false, retryCount };

  const nextRetryAt = new Date(Date.now() + retryDelayMs(retryCount));
  await EmbeddingBatchJob.scheduleRetry(jobId, {
    error: message,
    retryCount,
    nextRetryAt,
  });
  schedule(jobId, nextRetryAt.getTime() - Date.now());
  return { scheduled: true, retryCount };
}

function retryNotReady(job) {
  if (job.status !== "retrying" || !job.nextRetryAt) return false;

  const nextRetryAt = new Date(job.nextRetryAt).getTime();
  if (Number.isNaN(nextRetryAt) || nextRetryAt <= Date.now()) return false;

  schedule(job.jobId, nextRetryAt - Date.now());
  return true;
}

async function processBatchJob(jobId) {
  try {
    const supportError = batchSupportError();
    if (supportError) throw new Error(supportError);

    const job = await EmbeddingBatchJob.get({ jobId });
    if (!job || ["completed", "failed", "cancelled"].includes(job.status))
      return;
    if (retryNotReady(job)) return;

    if (!job.batchId) {
      await submitBatch(job);
      schedule(jobId);
      return;
    }

    await retrieveBatch(job);
  } catch (error) {
    stopSchedule(jobId);
    const retryResult = isTransientBatchError(error)
      ? await scheduleTransientRetry(jobId, error)
      : { scheduled: false, retryCount: null };
    if (retryResult.scheduled) return;

    const latest = await EmbeddingBatchJob.get({ jobId });
    await EmbeddingBatchJob.fail(jobId, error, {
      retryCount: Number(retryResult.retryCount ?? latest?.retryCount ?? 0),
      final: true,
    });
    const job = await EmbeddingBatchJob.get({ jobId });
    if (job) {
      const { emitProgress } = require("../EmbeddingWorkerManager");
      for (const docPath of job.documentPaths) {
        emitProgress(job.workspaceSlug, {
          type: "doc_failed",
          workspaceSlug: job.workspaceSlug,
          filename: docPath,
          error: error.message,
          batchJobId: jobId,
        });
      }
      emitProgress(job.workspaceSlug, {
        type: "all_complete",
        workspaceSlug: job.workspaceSlug,
        error: error.message,
        embedded: 0,
        failed: job.documentPaths.length,
        batchJobId: jobId,
      });
    }
  }
}

async function continueBatchPolling(jobId, { manual = false } = {}) {
  const job = await EmbeddingBatchJob.get({ jobId });
  if (!job) return { success: false, error: "batch_job_not_found" };
  if (!job.batchId) return { success: false, error: "missing_batch_id" };
  if (["completed", "cancelled"].includes(job.status))
    return { success: false, error: `cannot_retry_${job.status}` };

  stopSchedule(jobId);
  await EmbeddingBatchJob.resumePolling(jobId, {
    event: manual ? "manual_retry" : "resume_polling",
    reason: manual ? "manual" : "server_start",
    resetRetryCount: manual,
  });
  setImmediate(() => processBatchJob(jobId));
  return { success: true };
}

async function resumeActiveBatchJobs() {
  if (!isBatchMode()) return;
  const candidates = await EmbeddingBatchJob.where(
    {
      OR: [
        { status: { in: EmbeddingBatchJob.activeStatuses } },
        { status: EmbeddingBatchJob.statuses.failed },
      ],
    },
    null,
    { updatedAt: "asc" }
  );
  const jobs = candidates.filter((job) => {
    if (job.status !== EmbeddingBatchJob.statuses.failed) return true;
    if (!job.batchId) return false;
    if (Number(job.retryCount || 0) >= maxRetries()) return false;
    return isTransientBatchError(job.lastTransientError || job.lastError);
  });

  for (const job of jobs) {
    await EmbeddingBatchJob.logEvent(job.jobId, "resume_polling", {
      status: job.status,
    });
    if (job.status === EmbeddingBatchJob.statuses.failed) {
      await continueBatchPolling(job.jobId);
      continue;
    }
    setImmediate(() => processBatchJob(job.jobId));
  }
}

module.exports = {
  isBatchMode,
  documentEmbeddingMode,
  batchSupportError,
  enqueueBatchDocuments,
  processBatchJob,
  continueBatchPolling,
  resumeActiveBatchJobs,
  isTransientBatchError,
  retryDelayMs,
  maxRetries,
  buildWorkspaceDocumentRecord,
};

/**
 * Document Enrichment Utility
 *
 * Handles OCR merging and chunk enrichment during ONE-TIME embedding process.
 * After embedding, hybrid search uses stored vectors - no re-processing needed.
 */
const { SystemSettings } = require("../models/systemSettings");

/**
 * Default enrichment configuration
 */
const DEFAULT_ENRICHMENT_CONFIG = {
  enabled: true,
  includeDocumentContext: true,
  includePositionInfo: true,
  includeAuthor: false, // Disabled by default to save tokens
  includeDescription: false, // Disabled by default to save tokens
  format: "minimal", // Compact format, not XML
  maxEnrichmentLength: 80, // Keep it short
};

/**
 * Get enrichment configuration from system settings
 */
async function getEnrichmentConfig() {
  const config = { ...DEFAULT_ENRICHMENT_CONFIG };

  try {
    config.enabled = await SystemSettings.getValueOrFallback(
      { label: "document_enrichment_enabled" },
      DEFAULT_ENRICHMENT_CONFIG.enabled
    );
    config.includeDocumentContext = await SystemSettings.getValueOrFallback(
      { label: "document_enrichment_include_context" },
      DEFAULT_ENRICHMENT_CONFIG.includeDocumentContext
    );
    config.includePositionInfo = await SystemSettings.getValueOrFallback(
      { label: "document_enrichment_include_position" },
      DEFAULT_ENRICHMENT_CONFIG.includePositionInfo
    );
    config.format = await SystemSettings.getValueOrFallback(
      { label: "document_enrichment_format" },
      DEFAULT_ENRICHMENT_CONFIG.format
    );
  } catch (error) {
    // Use defaults if settings unavailable
    console.warn("[Enrichment] Using default config:", error.message);
  }

  return config;
}

/**
 * Build canonical pageContent from OCR sources
 * Priority: user_corrected > google_raw > anything_raw > pageContent
 *
 * This runs ONCE during document processing.
 */
function buildCanonicalPageContent(document) {
  const ocr = document.ocr || {};

  // Priority 1: User corrections (highest priority)
  if (ocr.user_corrected?.trim()) {
    return ocr.user_corrected.trim();
  }

  // Priority 2: Google OCR (from Keystone)
  const googleRaw = ocr.google_raw?.trim();
  const anythingRaw = ocr.anything_raw?.trim();

  if (googleRaw && !anythingRaw) return googleRaw;
  if (!googleRaw && anythingRaw) return anythingRaw;

  // Priority 3: Merge if both exist
  if (googleRaw && anythingRaw) {
    return mergeOcrSources(googleRaw, anythingRaw);
  }

  // Priority 4: Fallback to existing pageContent (backward compatibility)
  return document.pageContent || "";
}

/**
 * Merge multiple OCR sources intelligently
 * Simple merge for now - can be enhanced later with deduplication
 */
function mergeOcrSources(googleRaw, anythingRaw) {
  if (!googleRaw && !anythingRaw) return "";
  if (googleRaw && !anythingRaw) return googleRaw;
  if (!googleRaw && anythingRaw) return anythingRaw;

  // Simple similarity check - if very similar, prefer Google
  const similarity = calculateSimpleSimilarity(googleRaw, anythingRaw);
  if (similarity > 0.9) {
    // Very similar - use Google (higher quality)
    return googleRaw;
  }

  // Different enough - merge both
  // TODO: Future enhancement - deduplication, alignment, confidence scoring
  return `${googleRaw}\n\n--- Additional OCR Content ---\n\n${anythingRaw}`;
}

/**
 * Calculate simple word overlap similarity (0-1)
 * Used to determine if OCR sources are duplicates
 */
function calculateSimpleSimilarity(text1, text2) {
  if (!text1 || !text2) return 0;

  const words1 = new Set(
    text1.toLowerCase().split(/\s+/).filter((w) => w.length > 2)
  );
  const words2 = new Set(
    text2.toLowerCase().split(/\s+/).filter((w) => w.length > 2)
  );

  if (words1.size === 0 || words2.size === 0) return 0;

  const intersection = new Set([...words1].filter((x) => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

/**
 * Build contextual information for a chunk
 */
function buildChunkContext(metadata, chunkIndex, totalChunks) {
  const context = {
    document: {},
    position: {},
  };

  // Document-level context (only if enabled)
  if (metadata?.title) {
    context.document.title = metadata.title;
  }

  // Position context
  context.position.chunkNumber = chunkIndex + 1;
  context.position.totalChunks = totalChunks;
  context.position.percentage = Math.round(
    ((chunkIndex + 1) / totalChunks) * 100
  );

  // Relative position
  if (chunkIndex === 0) {
    context.position.relative = "start";
  } else if (chunkIndex === totalChunks - 1) {
    context.position.relative = "end";
  } else {
    const third = Math.floor(totalChunks / 3);
    if (chunkIndex < third) {
      context.position.relative = "start";
    } else if (chunkIndex >= totalChunks - third) {
      context.position.relative = "end";
    } else {
      context.position.relative = "mid";
    }
  }

  return context;
}

/**
 * Format enrichment header in minimal format
 * Kept very short to minimize token usage
 */
function formatEnrichmentHeader(context, config) {
  const parts = [];

  // Position info (if enabled)
  if (config.includePositionInfo) {
    parts.push(
      `[${context.position.chunkNumber}/${context.position.totalChunks}]`
    );
  }

  // Document context (if enabled)
  if (config.includeDocumentContext && context.document.title) {
    // Truncate title if too long
    const title =
      context.document.title.length > 40
        ? context.document.title.substring(0, 40) + "..."
        : context.document.title;
    parts.push(title);
  }

  if (parts.length === 0) return "";

  // Minimal format: [2/10] Document Title\n\n[chunk text]
  return `${parts.join(" ")}\n\n`;
}

/**
 * Enrich a single chunk with contextual information
 * This runs ONCE per chunk during embedding
 */
function enrichChunk(chunk, metadata, chunkIndex, totalChunks, config) {
  if (!config.enabled) {
    return chunk; // Return unchanged if enrichment disabled
  }

  const context = buildChunkContext(metadata, chunkIndex, totalChunks);
  const header = formatEnrichmentHeader(context, config);

  if (!header || header.trim().length === 0) {
    return chunk; // Return unchanged if no enrichment
  }

  // Prepend minimal header to chunk
  return `${header}${chunk}`;
}

/**
 * Enrich multiple chunks with contextual information
 * This runs ONCE during document embedding
 *
 * @param {string[]} chunks - Raw chunks from TextSplitter
 * @param {object} metadata - Document metadata
 * @param {object} config - Enrichment configuration (optional, will load if not provided)
 * @returns {Promise<string[]>} Enriched chunks
 */
async function enrichChunks(chunks, metadata, config = null) {
  // Load config if not provided
  const enrichmentConfig = config || (await getEnrichmentConfig());

  if (!enrichmentConfig.enabled || !chunks || chunks.length === 0) {
    return chunks; // Return unchanged if disabled or empty
  }

  // Enrich each chunk (one-time process)
  return chunks.map((chunk, index) =>
    enrichChunk(chunk, metadata, index, chunks.length, enrichmentConfig)
  );
}

module.exports = {
  buildCanonicalPageContent,
  mergeOcrSources,
  enrichChunks,
  enrichChunk,
  buildChunkContext,
  formatEnrichmentHeader,
  getEnrichmentConfig,
  DEFAULT_ENRICHMENT_CONFIG,
};


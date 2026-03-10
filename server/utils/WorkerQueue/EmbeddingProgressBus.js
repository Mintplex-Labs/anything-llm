const EventEmitter = require("events");

/**
 * Singleton event bus for embedding progress.
 * Emits events for both document-level progress (from Document.addDocuments)
 * and chunk-level progress (from the embedding worker via JobQueue).
 *
 * Event: "progress"
 * Payload: {
 *   workspaceSlug: string,
 *   userId: number|null,
 *   type: "doc_starting" | "doc_complete" | "doc_failed" | "chunk_progress" | "all_complete",
 *   filename?: string,
 *   docIndex?: number,
 *   totalDocs?: number,
 *   chunksCompleted?: number,
 *   totalChunks?: number,
 *   error?: string,
 * }
 */
class EmbeddingProgressBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50);
  }

  /**
   * Register an SSE listener filtered by workspace and user.
   * @param {{ workspaceSlug: string, userId?: number }} filter
   * @param {function} callback - receives the progress event payload
   * @returns {function} unsubscribe
   */
  subscribe(filter, callback) {
    const handler = (event) => {
      if (filter.workspaceSlug && event.workspaceSlug !== filter.workspaceSlug)
        return;
      if (filter.userId && event.userId && event.userId !== filter.userId)
        return;
      callback(event);
    };
    this.on("progress", handler);
    return () => this.off("progress", handler);
  }
}

// Singleton
const embeddingProgressBus = new EmbeddingProgressBus();

module.exports = { embeddingProgressBus };

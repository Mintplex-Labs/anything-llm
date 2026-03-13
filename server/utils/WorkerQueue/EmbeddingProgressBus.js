const EventEmitter = require("events");

/**
 * Singleton event emitter for streaming embedding progress to SSE clients.
 * Buffers events per-workspace so late-joining connections can replay history.
 */
class EmbeddingProgressBus extends EventEmitter {
  /** @type {Map<string, object[]>} workspace slug → ordered event history */
  #history = new Map();

  constructor() {
    super();
    this.setMaxListeners(50);

    // Buffer progress events so late-joining SSE clients can catch up.
    this.on("progress", (event) => {
      if (!event.workspaceSlug) return;
      const slug = event.workspaceSlug;
      if (!this.#history.has(slug)) this.#history.set(slug, []);
      this.#history.get(slug).push(event);

      // Clear history shortly after all docs finish (mirrors frontend cleanup).
      if (event.type === "all_complete") {
        setTimeout(() => this.#history.delete(slug), 10_000);
      }
    });
  }

  /**
   * Register an SSE listener filtered by workspace and user.
   * Replays any buffered events for the workspace before subscribing to live events.
   * @param {{ workspaceSlug: string, userId?: number }} filter
   * @param {function} callback - receives the progress event payload
   * @returns {{ unsubscribe: function }}
   */
  subscribe(filter, callback) {
    // Replay buffered events so reconnecting clients catch up.
    if (filter.workspaceSlug && this.#history.has(filter.workspaceSlug)) {
      for (const event of this.#history.get(filter.workspaceSlug)) {
        if (filter.userId && event.userId && event.userId !== filter.userId)
          continue;
        callback(event);
      }
    }

    const handler = (event) => {
      if (filter.workspaceSlug && event.workspaceSlug !== filter.workspaceSlug)
        return;
      if (filter.userId && event.userId && event.userId !== filter.userId)
        return;
      callback(event);
    };
    this.on("progress", handler);
    return {
      unsubscribe: () => this.off("progress", handler),
    };
  }
}

const embeddingProgressBus = new EmbeddingProgressBus();

module.exports = { embeddingProgressBus };

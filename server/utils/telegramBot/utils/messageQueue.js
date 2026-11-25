/**
 * A simple per-key async message queue that ensures sequential processing.
 * Reusable across any connector (Telegram, Discord, Slack, etc.)
 * where concurrent messages from the same source must be processed in order.
 *
 * Usage:
 *   const queue = new MessageQueue();
 *   queue.enqueue(userId, async () => { ... });
 */
class MessageQueue {
  #chains = new Map();

  /**
   * Enqueue an async handler to run after all prior handlers for this key complete.
   * Different keys run in parallel; same key runs sequentially.
   * @param {string|number} key - Unique identifier (e.g. chat ID, user ID)
   * @param {() => Promise<void>} handler - Async function to execute
   * @returns {Promise<void>}
   */
  enqueue(key, handler) {
    const prev = this.#chains.get(key) || Promise.resolve();
    const chain = prev
      .then(handler)
      .catch((err) =>
        console.error(`[MessageQueue] Error processing key ${key}:`, err)
      )
      .finally(() => {
        // Clean up if this is the last item in the chain
        if (this.#chains.get(key) === chain) {
          this.#chains.delete(key);
        }
      });
    this.#chains.set(key, chain);
    return chain;
  }

  /**
   * Clear all pending chains. Does not cancel in-flight work.
   */
  clear() {
    this.#chains.clear();
  }

  /**
   * Number of active keys being processed.
   * @returns {number}
   */
  get size() {
    return this.#chains.size;
  }
}

module.exports = { MessageQueue };

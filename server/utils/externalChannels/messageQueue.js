/** Serializes each conversation without blocking unrelated conversations. */
class KeyedSerialExecutor {
  #tails = new Map();

  get size() {
    return this.#tails.size;
  }

  // Cancellation skips queued work. Running work receives the signal and retains
  // its place until it settles, so cancellation cannot create overlapping turns.
  run(key, work, { signal } = {}) {
    const previous = this.#tails.get(key) || Promise.resolve();
    const result = previous.then(() => {
      if (signal?.aborted) {
        const error = new Error("Operation aborted");
        error.name = "AbortError";
        throw error;
      }
      return work(signal);
    });
    const tail = result
      .then(
        () => {},
        () => {}
      )
      .then(() => {
        if (this.#tails.get(key) === tail) this.#tails.delete(key);
      });
    this.#tails.set(key, tail);
    return result.then(
      async (value) => {
        await tail;
        return value;
      },
      async (error) => {
        await tail;
        throw error;
      }
    );
  }
}

module.exports = { KeyedSerialExecutor };

/** Process IPC sends complete at their callbacks, not at their boolean return. */
function createWorkerIPC({ ipc = process, parentPort = null } = {}) {
  const pending = new Set();
  let failure = null;
  return {
    send(event) {
      const message = { ...event, silent: true };
      const sent = new Promise((resolve, reject) => {
        if (parentPort) {
          parentPort.postMessage(message);
          resolve();
        } else {
          ipc.send(message, (error) => (error ? reject(error) : resolve()));
        }
      });
      pending.add(sent);
      // Streaming producers do not await each token; retain errors for drain
      // while observing every promise to avoid unhandled rejections.
      sent.then(
        () => pending.delete(sent),
        (error) => {
          pending.delete(sent);
          failure ||= error;
        }
      );
      return sent;
    },
    async drain() {
      while (pending.size) await Promise.allSettled([...pending]);
      if (failure) throw failure;
    },
  };
}

module.exports = { createWorkerIPC };

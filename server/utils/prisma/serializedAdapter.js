/**
 * The SQLite driver adapter runs every query on a single connection. A query made outside an interactive
 * transaction while one is open would run inside it: it would read uncommitted rows, and its writes would be
 * rolled back with that transaction even though the query reported success.
 *
 * This wraps the adapter factory so queries outside a transaction wait until every open transaction has ended.
 * Queries made through the transaction client (`tx`) are not affected. Never use the global client inside a
 * `$transaction(async (tx) => ...)` callback: it would wait for the transaction, which waits for it, until the
 * transaction times out.
 *
 * @param {import("@prisma/driver-adapter-utils").SqlDriverAdapterFactory} factory
 */
function serializeTransactions(factory) {
  return {
    provider: factory.provider,
    adapterName: factory.adapterName,
    connect: async () => serializeAdapter(await factory.connect()),
    connectToShadowDb: async () =>
      serializeAdapter(await factory.connectToShadowDb()),
  };
}

function serializeAdapter(adapter) {
  let openTransactions = 0;
  let waiters = [];

  const transactionEnded = () => {
    openTransactions--;
    if (openTransactions === 0) waiters.splice(0).forEach((wake) => wake());
  };
  const waitForNoTransaction = async () => {
    while (openTransactions > 0)
      await new Promise((resolve) => waiters.push(resolve));
  };

  return new Proxy(adapter, {
    get(target, prop) {
      const value = Reflect.get(target, prop, target);
      if (typeof value !== "function") return value;

      if (prop === "startTransaction") {
        return async (...args) => {
          openTransactions++;
          let transaction;
          try {
            transaction = await value.apply(target, args);
          } catch (error) {
            transactionEnded();
            throw error;
          }

          let ended = false;
          const end = (method) => async () => {
            try {
              return await method.call(transaction);
            } finally {
              if (!ended) {
                ended = true;
                transactionEnded();
              }
            }
          };
          transaction.commit = end(transaction.commit);
          transaction.rollback = end(transaction.rollback);
          return transaction;
        };
      }

      if (["queryRaw", "executeRaw", "executeScript"].includes(prop)) {
        return async (...args) => {
          await waitForNoTransaction();
          return value.apply(target, args);
        };
      }
      return value.bind(target);
    },
  });
}

module.exports = { serializeTransactions };

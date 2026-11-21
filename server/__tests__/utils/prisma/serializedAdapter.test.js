const { serializeTransactions } = require("../../../utils/prisma/serializedAdapter");

function fakeFactory(log) {
  const adapter = {
    provider: "sqlite",
    queryRaw: async (q) => log.push(`query:${q}`),
    executeRaw: async (q) => log.push(`execute:${q}`),
    startTransaction: async () => {
      log.push("begin");
      return {
        queryRaw: async (q) => log.push(`tx:${q}`),
        commit: async () => log.push("commit"),
        rollback: async () => log.push("rollback"),
      };
    },
  };
  return { provider: "sqlite", adapterName: "fake", connect: async () => adapter };
}

describe("serializeTransactions", () => {
  it("runs queries outside a transaction only after the open transaction ends", async () => {
    const log = [];
    const adapter = await serializeTransactions(fakeFactory(log)).connect();

    const tx = await adapter.startTransaction();
    const outside = adapter.executeRaw("outside");
    await tx.queryRaw("inside");
    await new Promise((r) => setImmediate(r));
    expect(log).toEqual(["begin", "tx:inside"]);

    await tx.rollback();
    await outside;
    expect(log).toEqual(["begin", "tx:inside", "rollback", "execute:outside"]);
  });

  it("does not wait when no transaction is open, or after a failed start", async () => {
    const log = [];
    const factory = fakeFactory(log);
    const adapter = await serializeTransactions(factory).connect();
    const raw = await factory.connect();
    raw.startTransaction = async () => {
      throw new Error("busy");
    };

    await expect(adapter.startTransaction()).rejects.toThrow("busy");
    await adapter.queryRaw("after");
    expect(log).toEqual(["query:after"]);
  });
});

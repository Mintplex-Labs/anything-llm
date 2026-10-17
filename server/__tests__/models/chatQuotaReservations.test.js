/* eslint-env jest, node */

jest.mock("@prisma/client", () => ({
  Prisma: {
    PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {},
    TransactionIsolationLevel: { Serializable: "Serializable" },
  },
}));

jest.mock("../../utils/middleware/multiUserProtected", () => ({
  ROLES: { admin: "admin" },
}));

jest.mock("../../models/eventLogs", () => ({
  EventLogs: { logEvent: jest.fn() },
}));

jest.mock("../../utils/prisma", () => {
  const state = { chats: [], reservations: [] };
  let transactionTail = Promise.resolve();

  function matches(row, where = {}) {
    return Object.entries(where).every(([key, value]) => {
      if (value === undefined) return true;
      if (value && typeof value === "object" && !(value instanceof Date)) {
        return Object.entries(value).every(([operator, expected]) => {
          if (operator === "gte") return row[key] >= expected;
          if (operator === "gt") return row[key] > expected;
          if (operator === "lte") return row[key] <= expected;
          if (operator === "lt") return row[key] < expected;
          return false;
        });
      }
      return row[key] === value;
    });
  }

  const prisma = {
    workspace_chats: {
      count: jest.fn(async ({ where = {} } = {}) =>
        state.chats.filter((row) => matches(row, where)).length
      ),
    },
    chat_quota_reservations: {
      create: jest.fn(async ({ data }) => {
        const row = { createdAt: new Date(), ...data };
        state.reservations.push(row);
        return row;
      }),
      count: jest.fn(async ({ where = {} } = {}) =>
        state.reservations.filter((row) => matches(row, where)).length
      ),
      deleteMany: jest.fn(async ({ where = {} } = {}) => {
        const remaining = state.reservations.filter(
          (row) => !matches(row, where)
        );
        const count = state.reservations.length - remaining.length;
        state.reservations = remaining;
        return { count };
      }),
    },
    $transaction: jest.fn(async (callback) => {
      const transaction = transactionTail.then(() => callback(prisma));
      transactionTail = transaction.catch(() => {});
      return transaction;
    }),
    __reset: () => {
      state.chats = [];
      state.reservations = [];
      transactionTail = Promise.resolve();
    },
    __addChat: (row) => state.chats.push(row),
    __reservations: () => state.reservations,
  };

  return prisma;
});

const prisma = require("../../utils/prisma");
const { User } = require("../../models/user");

describe("shared daily chat quota reservations", () => {
  beforeEach(() => {
    prisma.__reset();
    jest.clearAllMocks();
  });

  test("reserves a slot before a second request can pass", async () => {
    const user = { id: 12, role: "default", dailyMessageLimit: 1 };

    const first = await User.reserveChatQuota(user);
    const second = await User.reserveChatQuota(user);

    expect(first).toEqual({ allowed: true, reservationId: expect.any(String) });
    expect(second).toEqual({ allowed: false, reservationId: null });
    expect(prisma.__reservations()).toHaveLength(1);
  });

  test("counts hidden chat rows after reservation is released", async () => {
    const user = { id: 12, role: "default", dailyMessageLimit: 1 };
    const reservation = await User.reserveChatQuota(user);
    prisma.__addChat({
      user_id: user.id,
      include: false,
      createdAt: new Date(),
    });

    await User.releaseChatQuotaReservation(reservation.reservationId);
    const next = await User.reserveChatQuota(user);

    expect(next).toEqual({ allowed: false, reservationId: null });
  });

  test("shares concurrent reservations against the same database quota", async () => {
    const user = { id: 12, role: "default", dailyMessageLimit: 2 };

    const reservations = await Promise.all([
      User.reserveChatQuota(user),
      User.reserveChatQuota(user),
    ]);

    expect(reservations.every((reservation) => reservation.allowed)).toBe(true);
    expect(prisma.__reservations()).toHaveLength(2);
  });

  test("does not grant the same final slot to concurrent requests", async () => {
    const user = { id: 12, role: "default", dailyMessageLimit: 1 };

    const reservations = await Promise.all([
      User.reserveChatQuota(user),
      User.reserveChatQuota(user),
    ]);

    expect(reservations.filter((reservation) => reservation.allowed)).toHaveLength(
      1
    );
    expect(prisma.__reservations()).toHaveLength(1);
  });

  test("does not reserve quota for admins or users without a limit", async () => {
    expect(
      await User.reserveChatQuota({ id: 1, role: "admin", dailyMessageLimit: 1 })
    ).toEqual({ allowed: true, reservationId: null });
    expect(
      await User.reserveChatQuota({ id: 2, role: "default", dailyMessageLimit: null })
    ).toEqual({ allowed: true, reservationId: null });
    expect(prisma.chat_quota_reservations.create).not.toHaveBeenCalled();
  });
});

// A separate process/client, sharing only the test database with other workers.
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.QUOTA_TEST_DATABASE_URL } },
});
require.cache[require.resolve("../../utils/prisma")] = { exports: prisma };
const { User } = require("../../models/user");

process.once("message", async (user) => {
  try {
    const result = await User.reserveChatQuota(user);
    process.send({ result });
  } catch (error) {
    process.send({ error: { code: error.code, message: error.message } });
  } finally {
    await prisma.$disconnect();
    process.disconnect();
  }
});
prisma.$connect().then(() => process.send({ ready: true }));

const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const rows = await prisma.quotations.findMany({ where: { totalAmount: 2319483920 } });
    console.log(JSON.stringify(rows, null, 2));
  } catch (e) {
    console.error(e && e.stack ? e.stack : e);
  } finally {
    await prisma.$disconnect();
  }
})();

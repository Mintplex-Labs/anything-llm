const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    // List all quotations saved with this source filename so we can inspect which columns
    // were extracted for "Gia MT chao - (250136-MTC).pdf"
    const rows = await prisma.quotations.findMany({ where: { sourceFilePath: 'Gia MT chao - (250136-MTC).pdf' } });
    console.log(JSON.stringify(rows, null, 2));
  } catch (e) {
    console.error(e && e.stack ? e.stack : e);
  } finally {
    await prisma.$disconnect();
  }
})();

const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const q = await prisma.quotations.findMany({ where: { sourceFilePath: { contains: 'Gia MT chao' } }, take: 10 });
    console.log(JSON.stringify(q, null, 2));
  } catch (e) {
    console.error('Error:', e && e.stack ? e.stack : e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();

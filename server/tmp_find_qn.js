const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const qn = 'VT-1609/25-XL-DA-VVD';
    const row = await prisma.quotations.findUnique({ where: { quotationNumber: qn } });
    if (!row) {
      console.log('NOT FOUND');
    } else {
      console.log('FOUND');
      console.log(JSON.stringify(row, null, 2));
    }
  } catch (e) {
    console.error(e && e.stack ? e.stack : e);
  } finally {
    await prisma.$disconnect();
  }
})();

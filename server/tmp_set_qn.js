const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const id = '1cfe2177-0624-4012-9b3d-df11c67201fa';
    // ensure no other row has that quotationNumber
    const desired = '250136-MTCO';
    const existing = await prisma.quotations.findUnique({ where: { quotationNumber: desired } });
    if (existing) {
      console.log('Desired quotationNumber already exists on another row:', existing.id);
    } else {
      const q = await prisma.quotations.update({ where: { id }, data: { quotationNumber: desired, updatedAt: new Date() } });
      console.log('Updated quotation:', JSON.stringify(q, null, 2));
    }
  } catch (e) {
    console.error(e && e.stack ? e.stack : e);
  } finally {
    process.exit(0);
  }
})();

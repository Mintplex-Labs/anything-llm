const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
(async () => {
  const prisma = new PrismaClient();
  try {
    const docId = 'Gia MT chao - (250136-MTC).pdf-9e70096e-de1b-4399-844d-32ba09cce8ee';
    const q = await prisma.quotations.findFirst({ where: { documentId: docId } });
    const backupDir = '/app/server/storage/backups';
    try { fs.mkdirSync(backupDir, { recursive: true }); } catch (e) {}
    const bakPath = backupDir + '/quotation-' + q.id + '-backup-' + Date.now() + '.json';
    fs.writeFileSync(bakPath, JSON.stringify(q, null, 2));
    console.log('Backup written to', bakPath);
    console.log('Before update:', JSON.stringify({id:q.id, totalAmount:q.totalAmount, currency:q.currency, deliveryTerms:q.deliveryTerms, documentId:q.documentId}, null, 2));
    const updated = await prisma.quotations.update({ where: { id: q.id }, data: { totalAmount: 4407569828, currency: 'VND', updatedAt: new Date() } });
    console.log('After update:', JSON.stringify({id:updated.id, totalAmount:updated.totalAmount, currency:updated.currency, deliveryTerms:updated.deliveryTerms, documentId:updated.documentId}, null, 2));
    await prisma.$disconnect();
    process.exit(0);
  } catch (e) {
    console.error('Error:', e && e.stack ? e.stack : e);
    process.exit(1);
  }
})();

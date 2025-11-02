const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

/*
 Usage (dry-run):
  node tmp_update_giadoithu.js <totalAmount> "<deliveryTerms>" <documentId>

 Example:
  node tmp_update_giadoithu.js 2502553977 "delivering goods to VSP warehouse, Vung Tau City, Vietnam includes taxes..." Gia\ doi\ thu\ (250136-MTC).pdf-0331c2fc-5b5c-429e-b278-425527710dc4

 This script will:
 - read the quotation by a hard-coded id (update QUOTATION_ID variable below if needed)
 - write a JSON backup to server/storage/backups/
 - update totalAmount, deliveryTerms, and documentId
 - print before/after rows

 Run only after you review and confirm.
*/

const QUOTATION_ID = '2d1f31a1-559e-437e-ac38-b36720c9ffe0';

(async () => {
  const prisma = new PrismaClient();
  try {
    const args = process.argv.slice(2);
    if (args.length < 3) {
      console.error('Usage: node tmp_update_giadoithu.js <totalAmount> "<deliveryTerms>" <documentId>');
      process.exit(2);
    }
    const totalAmount = Number(args[0]);
    const deliveryTerms = String(args[1]);
    const documentId = String(args[2]);

    if (!Number.isFinite(totalAmount)) {
      throw new Error('totalAmount must be a valid number');
    }

    const row = await prisma.quotations.findUnique({ where: { id: QUOTATION_ID } });
    if (!row) {
      throw new Error(`Quotation with id ${QUOTATION_ID} not found`);
    }

    // Backup
    const backupsDir = path.join(__dirname, 'storage', 'backups');
    fs.mkdirSync(backupsDir, { recursive: true });
    const backupPath = path.join(backupsDir, `quotation-${QUOTATION_ID}-backup-${Date.now()}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(row, null, 2));
    console.log('Backup written to', backupPath);

    console.log('Before update:');
    console.log(JSON.stringify(row, null, 2));

    const updated = await prisma.quotations.update({
      where: { id: QUOTATION_ID },
      data: {
        totalAmount,
        deliveryTerms,
        documentId,
      },
    });

    console.log('After update:');
    console.log(JSON.stringify(updated, null, 2));

    console.log('Done. Backup retained at', backupPath);
  } catch (e) {
    console.error('Error:', e && e.stack ? e.stack : e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();

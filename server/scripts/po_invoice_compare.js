#!/usr/bin/env node
/**
 * POC comparator: compare PO vs Invoice vs optional Certificate
 * - Dry-run by default (prints discrepancies)
 * - Use --apply to insert `document_discrepancies` rows into DB
 *
 * Usage:
 *   node server/scripts/po_invoice_compare.js --poNumber=240023-MTCO-CHALMIT --invoiceNumber=443762109 --certificateNumber=240023-MTCO-CHALMIT
 *   node server/scripts/po_invoice_compare.js --poNumber=... --invoiceNumber=... --apply
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (const a of args) {
    if (a.startsWith('--')) {
      const kv = a.slice(2).split('=');
      out[kv[0]] = kv.length > 1 ? kv.slice(1).join('=') : true;
    }
  }
  return out;
}

function normalizePart(s) {
  if (!s) return '';
  return String(s).toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function tokenize(s) {
  if (!s) return [];
  return String(s)
    .toLowerCase()
    .replace(/[.,\/()\-\u2013\u2014]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function tokenSimilarity(a, b) {
  const A = new Set(tokenize(a));
  const B = new Set(tokenize(b));
  if (A.size === 0 && B.size === 0) return 1;
  if (A.size === 0 || B.size === 0) return 0;
  let common = 0;
  for (const t of A) if (B.has(t)) common++;
  return (2 * common) / (A.size + B.size);
}

function pctDiff(a, b) {
  if (a == null || b == null) return null;
  const nA = Number(a) || 0;
  const nB = Number(b) || 0;
  if (nA === 0 && nB === 0) return 0;
  if (nA === 0) return Infinity;
  return ((nB - nA) / Math.abs(nA)) * 100.0;
}

async function main() {
  const argv = parseArgs();
  const poNumber = argv.poNumber || argv.po;
  const invoiceNumber = argv.invoiceNumber || argv.invoice;
  const certNumber = argv.certificateNumber || argv.cert;
  const poJson = argv.poJson || argv.poFile || null;
  const invoiceJson = argv.invoiceJson || argv.invoiceFile || null;
  const certJson = argv.certJson || argv.certFile || null;
  const apply = !!argv.apply;

  if ((!poNumber || !invoiceNumber) && !(poJson && invoiceJson)) {
    console.error('Usage: --poNumber=... --invoiceNumber=... [--certificateNumber=...] [--apply]  OR  --poJson=path --invoiceJson=path [--certJson=path]');
    process.exit(1);
  }

  console.log('POC comparator starting (dry-run=%s) for PO=%s Invoice=%s Cert=%s', !apply, poNumber, invoiceNumber, certNumber || 'N/A');

  let po = null;
  let invoice = null;
  let certificate = null;

  const haveDb = !!process.env.DATABASE_URL;
  if (!haveDb) {
    console.log('No DATABASE_URL in env — will attempt JSON-file mode if file paths provided.');
  }

  if (poJson && invoiceJson) {
    // Read provided JSON files from disk
    const fs = require('fs');
    try {
      const p = JSON.parse(fs.readFileSync(poJson, 'utf8'));
      const inv = JSON.parse(fs.readFileSync(invoiceJson, 'utf8'));
      po = p;
      invoice = inv;
      if (certJson) {
        try { certificate = JSON.parse(fs.readFileSync(certJson, 'utf8')); } catch (e) { console.warn('Failed to read certJson:', e.message); }
      }
    } catch (e) {
      console.error('Failed to read JSON files:', e.message);
      process.exit(1);
    }
  } else if (haveDb) {
    // DB mode
    po = await prisma.purchase_orders.findUnique({ where: { poNumber }, include: { items: true } });
    if (!po) { console.error('PO not found:', poNumber); process.exit(1); }

    invoice = await prisma.invoices.findUnique({ where: { invoiceNumber }, include: { items: true } });
    if (!invoice) { console.error('Invoice not found:', invoiceNumber); process.exit(1); }

    if (certNumber) {
      certificate = await prisma.certificates.findUnique({ where: { certNumber }, include: { items: true } });
      if (!certificate) console.warn('Certificate not found:', certNumber);
    }
  } else {
    console.error('No DATABASE_URL and no JSON file paths provided. Exiting.');
    process.exit(1);
  }

  // Precompute normalized partNumbers for PO items
  const poItems = (po.items || []).map(it => ({
    ...it,
    _normPN: normalizePart(it.partNumber || ''),
    _desc: it.description || '',
  }));

  const discrepancies = [];

  function recordDiscrepancy(d) {
    discrepancies.push(d);
  }

  // Helper: find best PO match for a given item
  function findBestPoMatch(item) {
    const itemPN = normalizePart(item.partNumber || '');
    const itemDesc = item.description || '';
    let best = null;
    for (const p of poItems) {
      let score = 0;
      // PN exact match strong
      if (itemPN && p._normPN && itemPN === p._normPN) score += 0.7;
      // description similarity
      const sim = tokenSimilarity(itemDesc, p._desc);
      score += sim * 0.3; // up to 0.3
      // quantity match bonus
      if (item.quantity && p.quantity && Number(item.quantity) === Number(p.quantity)) score += 0.1;
      if (!best || score > best.score) best = { score, po: p, sim };
    }
    return best;
  }

  // Compare invoice items
  for (const invItem of invoice.items || []) {
    const best = findBestPoMatch(invItem);
    const matched = best && best.score >= 0.4 ? best.po : null;
    const confidence = best ? Math.min(1, best.score) : 0;

    // If no match, record partNumber discrepancy
    if (!matched) {
      recordDiscrepancy({
        sourceType: 'invoice', sourceId: invoice.id,
        targetType: 'po', targetId: po.id,
        field: 'partNumber', severity: 'high',
        partNumber: invItem.partNumber || null,
        sourceValue: invItem.partNumber || invItem.description || '',
        targetValue: '',
        difference: `No matching PO line (bestScore=${best?best.score:0})`,
      });
      continue;
    }

    // Check quantity
    if (invItem.quantity != null && matched.quantity != null && Number(invItem.quantity) !== Number(matched.quantity)) {
      recordDiscrepancy({
        sourceType: 'invoice', sourceId: invoice.id,
        targetType: 'po', targetId: po.id,
        field: 'quantity', severity: 'medium',
        partNumber: invItem.partNumber || null,
        sourceValue: String(invItem.quantity), targetValue: String(matched.quantity),
        difference: `Qty invoice=${invItem.quantity} vs PO=${matched.quantity}`,
      });
    }

    // Check price: prefer unitPrice, fall back to totalPrice
    const invPrice = (invItem.unitPrice != null && Number(invItem.unitPrice) > 0) ? Number(invItem.unitPrice) : (invItem.totalPrice ? Number(invItem.totalPrice) : null);
    const poPrice = (matched.unitPrice != null && Number(matched.unitPrice) > 0) ? Number(matched.unitPrice) : (matched.totalPrice ? Number(matched.totalPrice) : null);
    if (invPrice != null && poPrice != null) {
      const diff = poPrice - invPrice;
      const diffPct = pctDiff(poPrice, invPrice);
      const absDiff = Math.abs(diff);
      // thresholds: 5% or absolute 1 (currency units) - tune later
      const pctThreshold = 5.0;
      if (diffPct === Infinity || Math.abs(diffPct) > pctThreshold || absDiff > 1.0) {
        recordDiscrepancy({
          sourceType: 'invoice', sourceId: invoice.id,
          targetType: 'po', targetId: po.id,
          field: 'unitPrice', severity: Math.abs(diffPct) > 20 ? 'high' : 'medium',
          partNumber: invItem.partNumber || null,
          sourceValue: String(invPrice), targetValue: String(poPrice),
          difference: `PO ${poPrice} vs Invoice ${invPrice} (diff ${diff} => ${diffPct ? diffPct.toFixed(2) : 'N/A'}%)`,
        });
      }
    }

    // Check currency at header level
    if (invoice.currency && po.currency && invoice.currency !== po.currency) {
      recordDiscrepancy({
        sourceType: 'invoice', sourceId: invoice.id,
        targetType: 'po', targetId: po.id,
        field: 'currency', severity: 'high',
        partNumber: invItem.partNumber || null,
        sourceValue: invoice.currency, targetValue: po.currency,
        difference: `Invoice currency ${invoice.currency} differs from PO currency ${po.currency}`,
      });
    }
  }

  // Compare certificate items (if present) with PO
  if (certificate && certificate.items && certificate.items.length) {
    for (const certItem of certificate.items) {
      // match by partNumber or description
      const certPN = normalizePart(certItem.partNumber || '');
      const found = poItems.find(p => p._normPN && certPN && p._normPN === certPN);
      if (!found) {
        // try description similarity
        const bestDesc = poItems.map(p => ({ p, sim: tokenSimilarity(certItem.description || '', p._desc) })).sort((a,b)=>b.sim-a.sim)[0];
        if (!bestDesc || bestDesc.sim < 0.4) {
          recordDiscrepancy({
            sourceType: 'certificate', sourceId: certificate.id,
            targetType: 'po', targetId: po.id,
            field: 'partNumber', severity: 'high',
            partNumber: certItem.partNumber || null,
            sourceValue: certItem.partNumber || certItem.description || '', targetValue: '',
            difference: `No matching PO line for certificate item (bestDesc=${bestDesc?bestDesc.sim:0})`,
          });
          continue;
        }
      } else {
        // check qty mismatch
        if (certItem.quantity != null && found.quantity != null && Number(certItem.quantity) !== Number(found.quantity)) {
          recordDiscrepancy({
            sourceType: 'certificate', sourceId: certificate.id,
            targetType: 'po', targetId: po.id,
            field: 'quantity', severity: 'medium',
            partNumber: certItem.partNumber || null,
            sourceValue: String(certItem.quantity), targetValue: String(found.quantity),
            difference: `Certificate qty=${certItem.quantity} vs PO=${found.quantity}`,
          });
        }
      }
    }
  }

  // Summarize and optionally persist
  console.log('\nPOC result: compared PO %s (items=%d) with Invoice %s (items=%d)%s', poNumber, poItems.length, invoiceNumber, invoice.items.length, certificate ? ` and Certificate ${certNumber} (items=${certificate.items.length})` : '');
  console.log('Discrepancies found:', discrepancies.length);
  for (const d of discrepancies) {
    console.log('-', d.field, '| part:', d.partNumber || '-', '| severity:', d.severity, '|', d.difference || `${d.sourceValue} -> ${d.targetValue}`);
  }

  if (apply) {
    console.log('\nApplying %d discrepancies to DB...', discrepancies.length);
    for (const d of discrepancies) {
      try {
        const inserted = await prisma.document_discrepancies.create({ data: {
          sourceType: d.sourceType,
          sourceId: d.sourceId,
          targetType: d.targetType,
          targetId: d.targetId,
          field: d.field,
          severity: d.severity,
          partNumber: d.partNumber || null,
          sourceValue: d.sourceValue || '',
          targetValue: d.targetValue || '',
          difference: d.difference || '',
        }});
        console.log('Inserted discrepancy id:', inserted.id);
      } catch (e) {
        console.error('Failed to insert discrepancy:', e.message);
      }
    }
  } else {
    console.log('\nDry-run mode: no DB writes. To persist results, re-run with --apply');
  }

  await prisma.$disconnect();
}

main().catch(e => { console.error(e && e.stack ? e.stack : e); process.exit(1); });

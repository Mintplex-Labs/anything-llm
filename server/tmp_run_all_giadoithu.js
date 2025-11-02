const fs = require('fs');
const path = require('path');
(async () => {
  try {
    const { extractDocumentData } = require('./utils/extraction/documentExtractor');
    const dir = path.join(__dirname, 'storage', 'documents', 'custom-documents');
    const files = fs.readdirSync(dir).filter(f => f.startsWith('Gia doi thu (250136-MTC).pdf-') && f.endsWith('.json'));
    console.log('Found files:', files);
    for (const f of files) {
      const file = path.join(dir, f);
      const documentId = path.basename(file, '.json');
      console.log('Running extractor for', documentId, file);
      try {
        const res = await extractDocumentData(documentId, file);
        console.log('Extractor result for', documentId, ':', res && res.id ? res.id : JSON.stringify(res));
      } catch (e) {
        console.error('Extractor error for', documentId, e && e.stack ? e.stack : e);
      }
    }
    if (files.length === 0) console.log('No matching JSON files found for Gia doi thu');
  } catch (e) {
    console.error('Fatal error running batch extractor:', e && e.stack ? e.stack : e);
    process.exit(1);
  }
})();

(async () => {
  try {
    const path = require('path');
    const { extractDocumentData } = require('./utils/extraction/documentExtractor');
  const file = '/app/server/storage/documents/custom-documents/Gia doi thu (250136-MTC).pdf-0331c2fc-5b5c-429e-b278-425527710dc4.json';
    const documentId = path.basename(file, '.json');
    console.log('Running extractor for', documentId, file);
    const res = await extractDocumentData(documentId, file);
    console.log('Extractor result:', res && res.id ? res.id : JSON.stringify(res));
  } catch (e) {
    console.error('Extractor run error:', e && e.stack ? e.stack : e);
    process.exit(1);
  }
})();

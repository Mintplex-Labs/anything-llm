(async () => {
  try {
    const path = require('path');
    const { extractDocumentData } = require('./utils/extraction/documentExtractor');
    const file = '/app/server/storage/documents/custom-documents/Gia MT chao - (250136-MTC).pdf-ef99abcc-94c9-4576-a0e4-38406b9fd1fa.json';
    const documentId = path.basename(file, '.json');
    console.log('Running extractor for', documentId, file);
    const res = await extractDocumentData(documentId, file);
    console.log('Extractor result:', res && res.id ? res.id : JSON.stringify(res));
  } catch (e) {
    console.error('Extractor run error:', e && e.stack ? e.stack : e);
    process.exit(1);
  }
})();

#!/usr/bin/env node
// Usage: node scripts/run_extractor.js <relative-path-to-json>
// If no arg provided, defaults to the PO sample from the workspace used in the conversation.

const path = require('path');
const fs = require('fs');
(async () => {
  try {
    const arg = process.argv[2];
    const defaultFile = path.resolve('server/storage/documents/custom-documents/Both Signed PO 240152 (McPEC.PO.651052025.06.0098.R1).pdf-7cc5c5a8-51f3-43bd-9177-4e8d997907cc.json');
    const filePath = arg ? path.resolve(arg) : defaultFile;
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath);
      process.exit(2);
    }
  const { extractDocumentData } = require('../server/utils/extraction/documentExtractor');
    const docId = path.basename(filePath, '.json');
    console.log('Running extractor for', docId);
    const result = await extractDocumentData(docId, filePath);
    console.log('---RESULT (preview or object)---');
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (e) {
    console.error('Extractor run failed:', e && e.stack ? e.stack : e);
    process.exit(1);
  }
})();

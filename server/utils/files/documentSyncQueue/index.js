const GoogleDocsLoader = require('../../extensions/GoogleDocs');

async function syncDocument(metadata = {}) {
  try {
    // Handle Google Docs sync
    if (metadata.source === 'googledocs' || metadata.chunkSource?.startsWith('googledocs://')) {
      const loader = new GoogleDocsLoader();
const result = await loader.syncDocument(metadata);
      if (!result.success) {
        throw new Error(`Failed to sync Google Doc: ${result.error}`);
      }
      return result.document;
    }
  } catch (error) {
    console.error('Error in syncDocument:', error);
    throw error;
  }
} 
const express = require('express');
const router = express.Router();
const { DocumentSyncQueue } = require('../models/documentSyncQueue');

// Trigger immediate sync for a document
router.post('/sync-document/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    const result = await DocumentSyncQueue.syncNow(documentId);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to sync document:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update sync interval for a document
router.post('/update-sync-interval/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    const { intervalMs } = req.body;
    
    if (!intervalMs || isNaN(intervalMs)) {
      return res.status(400).json({ error: 'Invalid interval' });
    }
    
    const result = await DocumentSyncQueue.updateSyncInterval(documentId, intervalMs);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to update sync interval:', error);
    res.status(500).json({ error: error.message });
  }
}); 
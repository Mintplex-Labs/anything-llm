const express = require('express');
const router = express.Router();
const GoogleDocsLoader = require('../utils/extensions/GoogleDocs/index');
const { Workspace } = require('../models/workspace');
const path = require('path');

router.get('/auth/status', async (req, res) => {
  try {
    console.log('Checking auth status...');
    const loader = new GoogleDocsLoader();
    const status = await loader.checkAuth();
    console.log('Auth status result:', status);
    res.json(status);
  } catch (error) {
    console.error('Error checking auth status:', error);
    res.status(500).json({ 
      authorized: false,
      error: error.message || 'Failed to check authorization status'
    });
  }
});

router.get('/auth/url', async (req, res) => {
  try {
    console.log('Generating auth URL...');
    const loader = new GoogleDocsLoader();
    const result = loader.getAuthUrl();
    
    if (!result || !result.url) {
      throw new Error('Failed to generate authorization URL');
    }
    
    console.log('Auth URL generated:', result.url.substring(0, 100) + '...');
    res.json({ url: result.url });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: error.message || 'Failed to generate authorization URL' });
  }
});

router.get('/callback', async (req, res) => {
  console.log('Received callback with query:', req.query);
  const { code, error } = req.query;

  if (error) {
    console.error('OAuth error:', error);
    return res.redirect('/workspace?auth=error&reason=' + encodeURIComponent(error));
  }

  if (!code) {
    console.error('No authorization code provided');
    return res.redirect('/workspace?auth=error&reason=no_code');
  }

  try {
    console.log('Processing callback with code...');
    const loader = new GoogleDocsLoader();
    const result = await loader.handleCallback(code);
    
    if (result.success) {
      console.log('Successfully processed callback');
      res.redirect('/workspace?auth=success');
    } else {
      console.error('Callback processing failed:', result.error);
      res.redirect('/workspace?auth=error&reason=' + encodeURIComponent(result.error));
    }
  } catch (error) {
    console.error('Error handling callback:', error);
    res.redirect('/workspace?auth=error&reason=' + encodeURIComponent(error.message));
  }
});

router.get('/list', async (req, res) => {
  try {
    console.log('Fetching document list...');
    const loader = new GoogleDocsLoader();
    const result = await loader.listDocuments();
    
    if (result.error) {
      console.error('Error listing documents:', result.error);
      return res.status(500).json({ error: result.error });
    }
    
    console.log(`Found ${result.documents?.length || 0} documents`);
    res.json({ documents: result.documents || [] });
  } catch (error) {
    console.error('Error listing documents:', error);
    res.status(500).json({ error: error.message || 'Failed to list documents' });
  }
});

router.post('/collect', async (req, res) => {
  try {
    console.log('Received collect request with body:', req.body);
    
    const { documentIds, workspaceId } = req.body;
    console.log('Processing documentIds:', documentIds);

    if (!documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
      console.error('Invalid document IDs:', documentIds);
      return res.status(400).json({ 
        error: 'Document IDs array is required and must not be empty'
      });
    }

    if (!workspaceId) {
      console.error('No workspace ID provided');
      return res.status(400).json({
        error: 'Workspace ID is required'
      });
    }

    // First collect the documents from Google
    const loader = new GoogleDocsLoader();
    const result = await loader.collect(documentIds);
    console.log('Collection result:', result);
    
    if (!result.success || !result.documents || result.documents.length === 0) {
      console.error('No documents were collected:', result);
      return res.status(500).json({ error: 'No documents were successfully collected' });
    }

    // Add each document to the workspace
    const workspace = await Workspace.get({ id: workspaceId });
    
    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    const addedDocs = [];
    const errors = [];

    for (const doc of result.documents) {
      try {
        console.log('Adding document to workspace:', doc);

        // Ensure we have all required metadata fields
        const docMetadata = {
          source: 'google_docs',
          type: 'google_document',
          documentType: 'google_document',
          sourceId: doc.metadata.sourceId, // Extract original Google Doc ID
          docId: doc.id,
          name: doc.name,
          filename: path.basename(doc.path),
          filepath: doc.path,
          size: doc.size,
          token_count_estimate: doc.token_count_estimate,
          originalId: doc.metadata.sourceId, // Extract pure Google Doc ID
          chunkSource: `googledocs://${doc.metadata.sourceId}`,
          source: 'google_docs',
          cached: true,
          pageContent: doc.pageContent,
          ...doc.metadata,
          createdAt: doc.metadata?.createdAt || new Date().toISOString(),
          updatedAt: doc.metadata?.updatedAt || new Date().toISOString(),
          lastSynced: new Date().toISOString()
        };

        const { document, message } = await Workspace.addDocument(workspace.id, {
          docpath: doc.path,
          docId: doc.id,
          metadata: docMetadata
        });

        if (document) {
          console.log('Successfully added document:', document);
          addedDocs.push({
            id: document.id,
            docId: document.docId,
            name: doc.name,
            path: document.docpath,
            metadata: document.metadata,
            type: 'google_document',
            pinned: document.pinned,
            watched: document.watched,
            createdAt: document.createdAt,
            lastUpdatedAt: document.lastUpdatedAt
          });
        } else {
          console.error('Failed to add document:', message);
          errors.push({ name: doc.name, error: message });
        }
      } catch (error) {
        console.error(`Failed to add document ${doc.name}:`, error);
        errors.push({ name: doc.name, error: error.message });
      }
    }

    if (addedDocs.length === 0) {
      return res.status(500).json({ 
        error: 'Failed to add any documents to workspace',
        details: errors
      });
    }
    
    // Return the successful response with documents and any errors
    res.json({
      success: true,
      data: {
        documents: addedDocs,
        errors: errors.length > 0 ? errors : undefined
      }
    });
  } catch (error) {
    console.error('Error collecting documents:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to collect documents',
      details: error.stack
    });
  }
});

module.exports = router;
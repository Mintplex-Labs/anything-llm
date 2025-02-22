const express = require('express');
const router = express.Router();
const { DocumentSyncQueue } = require("../models/documentSyncQueue");
const { Document } = require("../models/documents");
const { Workspace } = require("../models/workspace");

router.post("/sync-document/:documentId", async (request, response) => {
  try {
    const { documentId } = request.params;
    const result = await DocumentSyncQueue.syncNow(documentId);
    
    if (!result.success) {
      return response.status(400).json({ error: result.error });
    }
    
    response.json({ success: true });
  } catch (error) {
    console.error("Failed to sync document:", error);
    response.status(500).json({ error: error.message });
  }
});

// Add watch status endpoint
router.post("/workspace/:slug/document/watch-status", async (request, response) => {
  console.log('\n=== Document Watch Status Update Request ===');
  
  try {
    // Ensure request body is properly parsed
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    const { docPath, watchStatus } = body;
    const { slug } = request.params;

    console.log('Processing watch status update:', {
      docPath,
      watchStatus,
      workspaceSlug: slug
    });

    if (!docPath) {
      console.error('Document path is required but was not provided');
      return response.status(400).json({ 
        success: false,
        error: "Document path is required" 
      });
    }

    // Get workspace
    console.log('Looking up workspace with slug:', slug);
    const workspace = await Workspace.get({ slug });
    
    if (!workspace) {
      console.error('Workspace not found:', slug);
      return response.status(404).json({ 
        success: false,
        error: "Workspace not found" 
      });
    }

    console.log('Found workspace:', {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug
    });

    // Find document
    console.log('Looking up document:', {
      docpath: docPath,
      workspaceId: workspace.id
    });

    const document = await Document.get({ 
      docpath: docPath,
      workspaceId: workspace.id 
    });

    if (!document) {
      console.error('Document not found:', {
        docpath: docPath,
        workspaceId: workspace.id
      });
      return response.status(404).json({ 
        success: false,
        error: "Document not found in workspace" 
      });
    }

    console.log('Found document:', {
      id: document.id,
      name: document.name,
      docpath: document.docpath,
      metadata: document.metadata
    });

    // Toggle watch status
    console.log('Toggling watch status:', {
      documentId: document.id,
      currentStatus: document.watched,
      newStatus: watchStatus
    });

    await DocumentSyncQueue.toggleWatchStatus(document, watchStatus);
    console.log('Watch status updated successfully');
    
    response.json({ success: true });
  } catch (error) {
    console.error("Failed to update watch status:", {
      error: error.message,
      stack: error.stack
    });
    response.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Add endpoint to get watched documents
router.get("/watched-documents", async (request, response) => {
  try {
    const documents = await Document.where({ watched: true });
    response.json({ 
      success: true, 
      documents: documents.map(doc => ({
        id: doc.id,
        name: doc.name || doc.docpath,
        docpath: doc.docpath,
        watched: doc.watched,
        lastSynced: doc.lastUpdatedAt,
        createdAt: doc.createdAt,
        metadata: doc.metadata
      }))
    });
  } catch (error) {
    console.error("Failed to fetch watched documents:", error);
    response.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

const experimentalEndpoints = (app) => {
  app.use("/experimental", router);
};

module.exports = { experimentalEndpoints }; 
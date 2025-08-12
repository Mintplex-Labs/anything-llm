const { Server: TusServer, EVENTS, FileStore } = require('tus-node-server');
const path = require('path');
const fs = require('fs');
const { Document } = require('../models/documents');
const { Workspace } = require('../models/workspace');

function uploadEndpoints(app) {
  if (!app) return;
  const uploadDir =
    process.env.NODE_ENV === 'development'
      ? path.resolve(__dirname, '../storage/uploads')
      : path.resolve(process.env.STORAGE_DIR, 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const tusServer = new TusServer({
    path: '/uploads',
    datastore: new FileStore({ path: uploadDir }),
  });

  app.all('/uploads/*', (req, res) => {
    tusServer.handle(req, res);
  });

  tusServer.on(EVENTS.EVENT_UPLOAD_COMPLETE, async (event) => {
    try {
      const filePath = path.join(uploadDir, event.file.id);
      const documentsDir =
        process.env.NODE_ENV === 'development'
          ? path.resolve(__dirname, '../storage/documents')
          : path.resolve(process.env.STORAGE_DIR, 'documents');
      if (!fs.existsSync(documentsDir))
        fs.mkdirSync(documentsDir, { recursive: true });
      const targetPath = path.join(documentsDir, `${event.file.id}.json`);
      fs.renameSync(filePath, targetPath);

      const workspaceId = Number(event.file.metadata?.workspaceId);
      if (!workspaceId) return;
      const workspace = await Workspace._findFirst({
        where: { id: workspaceId },
      });
      if (!workspace) return;

      await Document.addDocuments(workspace, [`${event.file.id}.json`]);
    } catch (e) {
      console.error('Error processing upload', e);
    }
  });
}

module.exports = { uploadEndpoints };

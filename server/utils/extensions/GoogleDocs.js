const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Get the absolute path to the server directory
const serverDir = path.resolve(__dirname, '../..');
console.log('Server directory:', serverDir);

// Resolve the storage path
const storagePath = process.env.STORAGE_DIR || path.join(serverDir, 'storage');
console.log('Storage path:', storagePath);

class GoogleDocsLoader {
  constructor() {
    // Validate environment variables
    const requiredVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    // Initialize OAuth client
    const redirectUri = process.env.GOOGLE_REDIRECT_URI.trim();
    console.log('Initializing OAuth client with redirect URI:', redirectUri);
    
    this.oauth2Client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID.trim(),
      clientSecret: process.env.GOOGLE_CLIENT_SECRET.trim(),
      redirectUri: redirectUri
    });

    // Set up storage paths
    this.storageDir = path.join(process.cwd(), 'storage');
    this.tokenPath = path.join(this.storageDir, 'google_tokens.json');
    
    // Ensure storage directory exists synchronously
    try {
      if (!fs.existsSync(this.storageDir)) {
        fs.mkdirSync(this.storageDir, { recursive: true });
        console.log('Created storage directory at:', this.storageDir);
      }
    } catch (error) {
      console.error('Error creating storage directory:', error);
    }

    // Initialize the Google APIs
    this.docs = google.docs({ version: 'v1', auth: this.oauth2Client });
    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });

    // Try to load existing tokens
    this.loadExistingTokens();
  }

  loadExistingTokens() {
    try {
      if (fs.existsSync(this.tokenPath)) {
        const tokens = JSON.parse(fs.readFileSync(this.tokenPath, 'utf8'));
        this.oauth2Client.setCredentials(tokens);
      }
    } catch (error) {
      console.error('Error initializing tokens:', error);
    }
  }

  async checkAuth() {
    try {
      if (!fs.existsSync(this.tokenPath)) {
        return { authorized: false };
      }

      const drive = google.drive({ version: 'v3', auth: this.oauth2Client });
      await drive.files.list({ pageSize: 1 });
      return { authorized: true };
    } catch (error) {
      return { authorized: false };
    }
  }

  getAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/documents.readonly'
    ];

    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });

    return { url };
  }

  async handleCallback(code) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      fs.writeFileSync(this.tokenPath, JSON.stringify(tokens));
      this.oauth2Client.setCredentials(tokens);
      return { success: true };
    } catch (error) {
      console.error('Error handling callback:', error);
      return { success: false, error: error.message };
    }
  }

  async listDocuments() {
    const drive = google.drive({ version: 'v3', auth: this.oauth2Client });
    const response = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.document'",
      fields: 'files(id, name)',
      pageSize: 100
    });

    return { documents: response.data.files };
  }

  async collect(documentIds) {
    try {
      console.log('Starting document collection with IDs:', documentIds);
      
      const storageRoot = path.join(process.cwd(), 'storage');
      const documentsDir = path.join(storageRoot, 'documents');
      const customDocsDir = path.join(documentsDir, 'custom-documents');
      
      console.log('\n=== Google Docs Collection Debug ===');
      console.log('Storage paths:', {
        storageRoot,
        documentsDir,
        customDocsDir
      });

      // Ensure all directories exist with proper permissions
      for (const dir of [storageRoot, documentsDir, customDocsDir]) {
        if (!fs.existsSync(dir)) {
          console.log(`Creating directory: ${dir}`);
          fs.mkdirSync(dir, { recursive: true, mode: 0o755 });
        }
      }

      const results = [];

      for (const docId of documentIds) {
        try {
          console.log(`Processing document ${docId}...`);
          
          // Fetch document content
          const doc = await this.docs.documents.get({ documentId: docId });
          
          // Extract text content
          let content = '';
          const elements = doc.data.body.content || [];
          for (const element of elements) {
            if (element.paragraph) {
              for (const paragraphElement of element.paragraph.elements) {
                if (paragraphElement.textRun) {
                  content += paragraphElement.textRun.content;
                }
              }
              content += '\n';
            }
          }

          // Get document metadata
          const docInfo = await this.drive.files.get({
            fileId: docId,
            fields: 'name,mimeType,size,modifiedTime,createdTime'
          });

          // Create unique document ID that's stable for this document
          const uniqueDocId = `googledoc-${docId}`;
          
          // Create safe filename
          const cleanName = docInfo.data.name
            .replace(/[^a-zA-Z0-9\s-]/g, '_')
            .replace(/\s+/g, '_')
            .toLowerCase();
          const timestamp = new Date().getTime();
          const filename = `${cleanName}_${timestamp}.json`;
          const filePath = path.join(customDocsDir, filename);
          const relativePath = `custom-documents/${filename}`;

          // Prepare document data with consistent schema
          const documentData = {
            id: uniqueDocId,
            url: `googledocs://${docId}`,
            title: docInfo.data.name,
            docAuthor: 'Google Docs',
            description: `Imported from Google Docs: ${docInfo.data.name}`,
            docSource: 'Google Docs',
            chunkSource: `googledocs://${docId}`,
            published: docInfo.data.modifiedTime || new Date().toISOString(),
            created: docInfo.data.createdTime || new Date().toISOString(),
            wordCount: content.split(/\s+/).length,
            pageContent: content,
            token_count_estimate: Math.ceil(content.length / 4),
            cached: false,
            type: 'application/json',
            size: Buffer.from(content).length,
            metadata: {
              source: 'googledocs',
              title: docInfo.data.name,
              docId: uniqueDocId,
              originalId: docId,
              created: docInfo.data.createdTime,
              modified: docInfo.data.modifiedTime,
              mimeType: docInfo.data.mimeType
            }
          };

          // Write file with proper error handling
          try {
            await fs.promises.writeFile(
              filePath, 
              JSON.stringify(documentData, null, 2), 
              { encoding: 'utf-8', mode: 0o644 }
            );
            
            // Verify file was written
            const stats = await fs.promises.stat(filePath);
            if (stats.size === 0) {
              throw new Error(`File was created but is empty: ${filePath}`);
            }
            
            console.log(`Saved document ${docId} to ${filePath} (${stats.size} bytes)`);

            results.push({
              id: uniqueDocId,
              name: docInfo.data.name,
              path: relativePath,
              type: 'application/json',
              size: stats.size,
              token_count_estimate: documentData.token_count_estimate
            });
          } catch (writeError) {
            console.error(`Failed to write file for document ${docId}:`, writeError);
            throw writeError;
          }
        } catch (docError) {
          console.error(`Error processing document ${docId}:`, docError);
          continue;
        }
      }

      if (results.length === 0) {
        return { 
          success: false, 
          error: 'No documents were successfully processed' 
        };
      }

      return {
        success: true,
        documents: results
      };
    } catch (error) {
      console.error('Collection failed:', error);
      return { 
        success: false,
        error: `Collection failed: ${error.message}` 
      };
    }
  }
}

module.exports = new GoogleDocsLoader(); 
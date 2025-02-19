const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

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
        console.log('Successfully loaded existing tokens');
      }
    } catch (error) {
      console.error('Error loading existing tokens:', error);
    }
  }

  getAuthUrl() {
    try {
      const scopes = [
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/documents.readonly'
      ];

      const authUrl = this.oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI.trim(),
        response_type: 'code',
        prompt: 'consent',
        include_granted_scopes: true
      });

      console.log('Successfully generated auth URL');
      return { url: authUrl };
    } catch (error) {
      console.error('Error generating auth URL:', error);
      throw error;
    }
  }

  async handleCallback(code) {
    try {
      console.log('Getting tokens from code...');
      const { tokens } = await this.oauth2Client.getToken(code);
      
      // Ensure storage directory exists
      if (!fs.existsSync(this.storageDir)) {
        fs.mkdirSync(this.storageDir, { recursive: true });
      }
      
      console.log('Writing tokens to:', this.tokenPath);
      fs.writeFileSync(this.tokenPath, JSON.stringify(tokens, null, 2));
      
      this.oauth2Client.setCredentials(tokens);
      console.log('Successfully saved tokens and set credentials');
      
      return { success: true };
    } catch (error) {
      console.error('Token exchange failed:', error);
      return { success: false, error: error.message };
    }
  }

  async checkAuth() {
    try {
      if (!this.oauth2Client.credentials) {
        console.log('No credentials found, not authorized');
        return { authorized: false };
      }
      
      await this.drive.files.list({ pageSize: 1 });
      console.log('Successfully verified authorization');
      return { authorized: true };
    } catch (error) {
      console.error('Auth check failed:', error);
      return { 
        authorized: false,
        error: error.message || 'Failed to verify authorization'
      };
    }
  }

  async listDocuments() {
    try {
      const response = await this.drive.files.list({
        q: "mimeType='application/vnd.google-apps.document'",
        fields: 'files(id, name)',
        pageSize: 100
      });

      return { documents: response.data.files };
    } catch (error) {
      console.error('Failed to list documents:', error);
      throw error;
    }
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
          
          // Fetch document content and metadata
          const [doc, docInfo] = await Promise.all([
            this.docs.documents.get({ documentId: docId }),
            this.drive.files.get({
              fileId: docId,
              fields: 'name,mimeType,size,modifiedTime,createdTime,owners'
            })
          ]);
          
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

          // Create unique and stable document ID
          const uniqueDocId = `googledoc-${docId}`;
          
          // Create filename without type inference
          const timestamp = new Date().getTime();
          const cleanName = docInfo.data.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
          const filename = `${cleanName}_${timestamp}.json`;
          const filePath = path.join(customDocsDir, filename);
          const relativePath = `custom-documents/${filename}`;

          // Calculate token count
          const tokenCount = Math.ceil(content.length / 4);
          const contentSize = Buffer.from(content).length;

          // Create consistent document metadata
          const metadata = {
            source: 'google_docs',
            type: 'google_document',
            documentType: 'google_document',
            author: docInfo.data.owners?.[0]?.displayName || 'Unknown',
            createdAt: docInfo.data.createdTime || new Date().toISOString(),
            updatedAt: docInfo.data.modifiedTime || new Date().toISOString(),
            mimeType: 'application/vnd.google-apps.document',
            sourceId: docId,
            docId: uniqueDocId,
            filename,
            filepath: relativePath,
            size: contentSize,
            wordCount: content.split(/\s+/).length,
            tokenCount: tokenCount,
            status: 'processed',
            cached: true,
            chunkSource: `googledocs://${docId}`,
            name: docInfo.data.name,
            token_count_estimate: tokenCount
          };

          const documentData = {
            id: uniqueDocId,
            docId: uniqueDocId,
            url: `https://docs.google.com/document/d/${docId}`,
            title: docInfo.data.name,
            pageContent: content,
            chunkSource: `googledocs://${docId}`,
            type: 'google_document',
            metadata
          };

          // Write file
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
            docId: uniqueDocId,
            name: docInfo.data.name,
            title: docInfo.data.name,
            path: relativePath,
            type: 'google_document',
            size: stats.size,
            token_count_estimate: tokenCount,
            metadata: documentData.metadata,
            chunkSource: `googledocs://${docId}`
          });
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

module.exports = GoogleDocsLoader;
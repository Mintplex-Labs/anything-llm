const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const tokenStorage = require('./tokenStorage');
const path = require('path');
const fs = require('fs').promises;


class GoogleDocsLoader {
  constructor() {
    this.oauth2Client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_REDIRECT_URI
    });

    // Initialize the Google Docs API
    this.docs = google.docs({ version: 'v1', auth: this.oauth2Client });
    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
  }

  async checkAuth() {
    const { token } = await tokenStorage.getToken();
    if (!token) return { authorized: false };

    try {
      this.oauth2Client.setCredentials(token);
      // Verify token is still valid
      await this.drive.files.list({ pageSize: 1 });
      return { authorized: true };
    } catch (error) {
      console.error('Auth check failed:', error);
      await tokenStorage.deleteToken();
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
      await tokenStorage.saveToken(tokens);
      return { success: true };
    } catch (error) {
      console.error('Token exchange failed:', error);
      return { success: false, error: error.message };
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
      return { error: 'Failed to fetch document list' };
    }
  }

  async getDocumentContent(docId) {
    try {
      const doc = await this.docs.documents.get({ documentId: docId });
      let content = '';
      
      const elements = doc.data.body.content;
      for (const element of elements) {
        if (element.paragraph) {
          for (const paragraphElement of element.paragraph.elements) {
            if (paragraphElement.textRun) {
              content += paragraphElement.textRun.content;
            }
          }
        }
      }
      
      return { content };
    } catch (error) {
      console.error(`Failed to fetch document ${docId}:`, error);
      return { error: `Failed to fetch document content: ${error.message}` };
    }
  }

  async collect(documentIds) {
    const outputDir = path.join(process.cwd(), 'collector', 'hotdir');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const collectionDir = path.join(outputDir, `googledocs-${timestamp}`);

    try {
      await fs.mkdir(collectionDir, { recursive: true });

      for (const docId of documentIds) {
        const { content, error } = await this.getDocumentContent(docId);
        if (error) {
          console.error(`Error processing document ${docId}:`, error);
          continue;
        }

        const docInfo = await this.drive.files.get({
          fileId: docId,
          fields: 'name'
        });

        const filename = `${docInfo.data.name.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
        await fs.writeFile(path.join(collectionDir, filename), content);
      }

      return {
        success: true,
        destination: collectionDir
      };
    } catch (error) {
      console.error('Collection failed:', error);
      return { error: `Collection failed: ${error.message}` };
    }
  }
}

module.exports = new GoogleDocsLoader(); 
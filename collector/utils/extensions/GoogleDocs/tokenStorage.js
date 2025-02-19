const fs = require('fs').promises;
const path = require('path');

// Get the absolute path to the server directory
const serverDir = path.resolve(__dirname, '../../../../server');
console.log('Server directory:', serverDir);

// Resolve the storage path
const storagePath = process.env.STORAGE_DIR || path.join(serverDir, 'storage');
console.log('Storage path:', storagePath);

class TokenStorage {
  constructor() {
    this.tokenPath = path.join(storagePath, 'google_tokens.json');
    this.ensureStorageDirectory();
  }

  async ensureStorageDirectory() {
    try {
      if (!fs.existsSync(storagePath)) {
        console.log(`Creating storage directory: ${storagePath}`);
        await fs.mkdir(storagePath, { recursive: true, mode: 0o755 });
      }
    } catch (error) {
      console.error('Error creating storage directory:', error);
    }
  }

  async saveToken(token) {
    try {
      await fs.writeFile(this.tokenPath, JSON.stringify(token));
      return { success: true };
    } catch (error) {
      console.error('Error saving token:', error);
      return { success: false, error: error.message };
    }
  }

  async getToken() {
    try {
      const token = await fs.readFile(this.tokenPath, 'utf8');
      return { token: JSON.parse(token) };
    } catch (error) {
      if (error.code === 'ENOENT') {
        return { token: null };
      }
      console.error('Error reading token:', error);
      return { token: null, error: error.message };
    }
  }

  async deleteToken() {
    try {
      await fs.unlink(this.tokenPath);
      return { success: true };
    } catch (error) {
      if (error.code === 'ENOENT') {
        return { success: true };
      }
      console.error('Error deleting token:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new TokenStorage(); 
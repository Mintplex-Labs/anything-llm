const fs = require("fs");
const path = require("path");

// Set up environment variables for tests
process.env.NODE_ENV = "test";
process.env.STORAGE_DIR = "/tmp/anythingllm-test-storage";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.SIG_KEY = "test-sig-key";
process.env.SIG_SALT = "test-sig-salt";

// Create test storage directories
const storageDir = "/tmp/anythingllm-test-storage";
const modelsDir = path.join(storageDir, "models");
const documentsDir = path.join(storageDir, "documents");

if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}
if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
}

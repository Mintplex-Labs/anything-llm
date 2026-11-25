const path = require("path");
require("dotenv").config();

const storageDir = process.env.STORAGE_DIR;
if (storageDir) {
  process.stdout.write(`file:${path.resolve(storageDir, "anythingllm.db")}`);
}

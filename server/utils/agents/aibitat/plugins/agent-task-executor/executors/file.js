const fs = require("fs").promises;

async function executeFileOperation(config) {
  const { path, operation, content } = config;

  switch (operation) {
    case "read":
      return await fs.readFile(path, "utf8");
    case "write":
      await fs.writeFile(path, content);
      return `File written to ${path}`;
    case "append":
      await fs.appendFile(path, content);
      return `Content appended to ${path}`;
    default:
      throw new Error(`Unknown file operation: ${operation}`);
  }
}

module.exports = executeFileOperation;

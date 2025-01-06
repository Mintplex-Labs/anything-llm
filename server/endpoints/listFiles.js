const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

function listFilesEndpoints(app) {
  if (!app) return;

  app.get("/list-files", async (req, res) => {
    try {
      // Get the folder path from the query parameter
      //const folderPath = path.resolve(__dirname, 'server/storage/Test1');
      const folderPath = './storage/Test1';

      // Validate folderPath if necessary to avoid security issues
      if (!folderPath) {
        return res.status(400).json({ error: "Folder path is required ${folderPath}" });
      }

      fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
        if (err) {
          console.error(`Error reading directory: ${err.message}  ${folderPath}`);
          return res.status(500).json({ error: "Failed to read the directory", folderPath });
        }

        // Map and filter out directories, only include files
        const fileList = files
          .filter((file) => file.isFile())
          .map((file) => ({
            name: file.name,
            path: path.join(folderPath, file.name),
            file,            
          }));

        res.status(200).json(fileList);
      });
    } catch (error) {
      console.error(`Unexpected error: ${error.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}

module.exports = { listFilesEndpoints };


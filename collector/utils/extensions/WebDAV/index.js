const { v4 } = require("uuid");
const { default: slugify } = require("slugify");
const path = require("path");
const fs = require("fs");
const { writeToServerDocuments } = require("../../files");
const { tokenizeString } = require("../../tokenizer");
const { createClient } = require("webdav");

async function loadWebDAV(options, response) {
  try {
    const { url, username, password, path: webdavPath = "/", recursive = true, fileTypes = [] } = options;

    if (!url || !username || !password) {
      return {
        success: false,
        reason: "WebDAV URL, username, and password are required.",
        data: null,
      };
    }

    // Validate and normalize URL
    let normalizedUrl;
    try {
      normalizedUrl = new URL(url);
      if (!['http:', 'https:'].includes(normalizedUrl.protocol)) {
        return {
          success: false,
          reason: "Invalid URL protocol. Only HTTP and HTTPS are supported.",
          data: null,
        };
      }
    } catch (error) {
      return {
        success: false,
        reason: "Invalid URL format. Please provide a valid WebDAV server URL.",
        data: null,
      };
    }

    console.log(`[WebDAV Loader]: Connecting to ${url}`);
    
    // Create WebDAV client with timeout configuration
    const client = createClient(url, {
      username,
      password,
      timeout: 30000, // 30 second timeout
      maxBodyLength: 100 * 1024 * 1024, // 100MB max file size
    });

    // Test connection with detailed error handling
    try {
      await client.getDirectoryContents("/");
    } catch (error) {
      console.error(`[WebDAV Loader]: Connection failed - ${error.message}`);
      
      // Provide specific error messages based on common issues
      let errorMessage = `Failed to connect to WebDAV server: ${error.message}`;
      
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        errorMessage = "Authentication failed. Please check your username and password.";
      } else if (error.message.includes('404') || error.message.includes('Not Found')) {
        errorMessage = "WebDAV server not found. Please check the URL.";
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
        errorMessage = "Cannot connect to server. Please check the URL and network connection.";
      } else if (error.message.includes('certificate') || error.message.includes('SSL')) {
        errorMessage = "SSL/Certificate error. The server may have an invalid SSL certificate.";
      }
      
      return {
        success: false,
        reason: errorMessage,
        data: null,
      };
    }

    // Create output folder
    const webdavName = new URL(url).hostname;
    const outFolder = slugify(
      `${slugify(webdavName)}-${v4().slice(0, 4)}`
    ).toLowerCase();
    const outFolderPath =
      process.env.NODE_ENV === "development"
        ? path.resolve(
            __dirname,
            `../../../../server/storage/documents/${outFolder}`
          )
        : path.resolve(process.env.STORAGE_DIR, `documents/${outFolder}`);

    if (!fs.existsSync(outFolderPath)) {
      fs.mkdirSync(outFolderPath, { recursive: true });
    }

    // Get all files recursively
    const files = await getAllFiles(client, webdavPath, recursive, fileTypes);
    console.log(`[WebDAV Loader]: Found ${files.length} files to process`);

    if (files.length === 0) {
      return {
        success: false,
        reason: "No supported files found in the specified path.",
        data: null,
      };
    }

    // Process files
    const processedFiles = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`[WebDAV Loader]: Processing ${i + 1}/${files.length}: ${file.filename}`);

      try {
        const result = await processWebDAVFile(client, file, outFolderPath);
        if (result) {
          processedFiles.push(result);
        }
      } catch (error) {
        console.error(`[WebDAV Loader]: Failed to process ${file.filename}:`, error);
      }
    }

    console.log(`[WebDAV Loader]: Successfully processed ${processedFiles.length} files`);

    return {
      success: true,
      reason: null,
      data: {
        title: `WebDAV Import - ${webdavName}`,
        author: "WebDAV Connector",
        documents: processedFiles,
      },
    };
  } catch (error) {
    console.error("[WebDAV Loader]: Error:", error);
    return {
      success: false,
      reason: error.message,
      data: null,
    };
  }
}

async function getAllFiles(client, basePath, recursive, fileTypes) {
  const files = [];
  const supportedExtensions = fileTypes.length > 0 ? fileTypes : [
    "pdf", "txt", "md", "docx", "xlsx", "csv", "html", "json", "xml", "rtf"
  ];

  async function scanDirectory(dirPath) {
    try {
      const contents = await client.getDirectoryContents(dirPath);
      
      for (const item of contents) {
        if (item.type === "file") {
          const extension = path.extname(item.basename).toLowerCase().slice(1);
          if (supportedExtensions.includes(extension)) {
            files.push({
              filename: item.basename,
              path: item.filename,
              size: item.size,
              lastModified: item.lastmod,
            });
          }
        } else if (item.type === "directory" && recursive) {
          await scanDirectory(item.filename);
        }
      }
    } catch (error) {
      console.error(`[WebDAV Loader]: Error scanning directory ${dirPath}:`, error);
    }
  }

  await scanDirectory(basePath);
  return files;
}

async function processWebDAVFile(client, file, outFolderPath) {
  try {
    // Download file content
    const fileContent = await client.getFileContents(file.path, { format: "text" });
    
    if (!fileContent || fileContent.length === 0) {
      console.warn(`[WebDAV Loader]: Empty content for ${file.filename}. Skipping.`);
      return null;
    }

    const extension = path.extname(file.filename).toLowerCase().slice(1);
    const filename = slugify(file.filename.replace(/\.[^/.]+$/, "")) + `.${extension}`;

    // Create document data
    const data = {
      id: v4(),
      url: `webdav://${file.path}`,
      title: file.filename,
      docAuthor: "WebDAV Import",
      description: `Imported from WebDAV server: ${file.filename}`,
      docSource: "WebDAV server",
      chunkSource: `webdav://${file.path}`,
      published: file.lastModified ? new Date(file.lastModified).toLocaleString() : new Date().toLocaleString(),
      wordCount: fileContent.split(" ").length,
      pageContent: fileContent,
      token_count_estimate: tokenizeString(fileContent),
    };

    // Write to server documents
    writeToServerDocuments(data, data.title, outFolderPath);

    return data;
  } catch (error) {
    console.error(`[WebDAV Loader]: Failed to process file ${file.filename}:`, error);
    return null;
  }
}

async function loadWebDAVTest(options) {
  try {
    const { url, username, password } = options;
    if (!url || !username || !password) {
      return {
        success: false,
        folders: [],
        message: "WebDAV URL, username, and password are required.",
      };
    }

    // Validate URL format
    try {
      const normalizedUrl = new URL(url);
      if (!['http:', 'https:'].includes(normalizedUrl.protocol)) {
        return {
          success: false,
          folders: [],
          message: "Invalid URL protocol. Only HTTP and HTTPS are supported.",
        };
      }
    } catch (error) {
      return {
        success: false,
        folders: [],
        message: "Invalid URL format. Please provide a valid WebDAV server URL.",
      };
    }
    const client = createClient(url, { 
      username, 
      password,
      timeout: 15000, // 15 second timeout for test connection
    });
    let contents;
    try {
      contents = await client.getDirectoryContents("/");
    } catch (error) {
      console.error(`[WebDAV Test]: Connection failed - ${error.message}`);
      
      // Provide specific error messages for common authentication issues
      let errorMessage = `Failed to connect to WebDAV server: ${error.message}`;
      
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        errorMessage = "Authentication failed. Please verify your username and password are correct.";
      } else if (error.message.includes('404') || error.message.includes('Not Found')) {
        errorMessage = "WebDAV server not found at this URL. Please check the server address.";
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
        errorMessage = "Cannot reach the server. Please check the URL and ensure the server is accessible.";
      } else if (error.message.includes('certificate') || error.message.includes('SSL')) {
        errorMessage = "SSL certificate error. The server may have an invalid or self-signed certificate.";
      } else if (error.message.includes('timeout')) {
        errorMessage = "Connection timeout. The server may be slow or unreachable.";
      }
      
      return {
        success: false,
        folders: [],
        message: errorMessage,
      };
    }
    // List only folders at root
    const folders = contents.filter(item => item.type === "directory").map(item => item.filename.replace(/^\/+/, ""));
    return {
      success: true,
      folders,
      message: "Connection successful!",
    };
  } catch (error) {
    return {
      success: false,
      folders: [],
      message: error.message,
    };
  }
}

module.exports = { loadWebDAV, loadWebDAVTest }; 
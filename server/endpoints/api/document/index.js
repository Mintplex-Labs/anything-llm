const { Telemetry } = require("../../../models/telemetry");
const { validApiKey } = require("../../../utils/middleware/validApiKey");
const { handleFileUpload } = require("../../../utils/files/multer");
const {
  viewLocalFiles,
  findDocumentInDocuments,
  normalizePath,
  isWithin,
} = require("../../../utils/files");
const { reqBody } = require("../../../utils/http");
const { EventLogs } = require("../../../models/eventLogs");
const { CollectorApi } = require("../../../utils/collectorApi");
const fs = require("fs");
const path = require("path");
const { Document } = require("../../../models/documents");
const documentsPath =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, "../../../storage/documents")
    : path.resolve(process.env.STORAGE_DIR, `documents`);

function apiDocumentEndpoints(app) {
  if (!app) return;

  app.post(
    "/v1/document/upload",
    [validApiKey, handleFileUpload],
    async (request, response) => {
      /*
    #swagger.tags = ['Documents']
    #swagger.description = 'Upload a new file to AnythingLLM to be parsed and prepared for embedding.'
    #swagger.requestBody = {
      description: 'File to be uploaded.',
      required: true,
      type: 'file',
      content: {
        "multipart/form-data": {
          schema: {
            type: 'object',
            properties: {
              file: {
                type: 'string',
                format: 'binary',
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: {
              success: true,
              error: null,
              documents: [
                {
                  "location": "custom-documents/anythingllm.txt-6e8be64c-c162-4b43-9997-b068c0071e8b.json",
                  "name": "anythingllm.txt-6e8be64c-c162-4b43-9997-b068c0071e8b.json",
                  "url": "file:///Users/tim/Documents/anything-llm/collector/hotdir/anythingllm.txt",
                  "title": "anythingllm.txt",
                  "docAuthor": "Unknown",
                  "description": "Unknown",
                  "docSource": "a text file uploaded by the user.",
                  "chunkSource": "anythingllm.txt",
                  "published": "1/16/2024, 3:07:00 PM",
                  "wordCount": 93,
                  "token_count_estimate": 115,
                }
              ]
            }
          }
        }
      }
    }
    #swagger.responses[403] = {
      schema: {
        "$ref": "#/definitions/InvalidAPIKey"
      }
    }
    */
      try {
        const Collector = new CollectorApi();
        const { originalname } = request.file;
        const processingOnline = await Collector.online();

        if (!processingOnline) {
          response
            .status(500)
            .json({
              success: false,
              error: `Document processing API is not online. Document ${originalname} will not be processed automatically.`,
            })
            .end();
          return;
        }

        const { success, reason, documents } =
          await Collector.processDocument(originalname);
        if (!success) {
          response
            .status(500)
            .json({ success: false, error: reason, documents })
            .end();
          return;
        }

        Collector.log(
          `Document ${originalname} uploaded processed and successfully. It is now available in documents.`
        );
        await Telemetry.sendTelemetry("document_uploaded");
        await EventLogs.logEvent("api_document_uploaded", {
          documentName: originalname,
        });
        response.status(200).json({ success: true, error: null, documents });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/v1/document/upload-link",
    [validApiKey],
    async (request, response) => {
      /*
    #swagger.tags = ['Documents']
    #swagger.description = 'Upload a valid URL for AnythingLLM to scrape and prepare for embedding.'
    #swagger.requestBody = {
      description: 'Link of web address to be scraped.',
      required: true,
      type: 'object',
      content: {
          "application/json": {
            schema: {
              type: 'object',
              example: {
                "link": "https://anythingllm.com"
              }
            }
          }
        }
    }
    #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: {
              success: true,
              error: null,
              documents: [
                {
                  "id": "c530dbe6-bff1-4b9e-b87f-710d539d20bc",
                  "url": "file://useanything_com.html",
                  "title": "useanything_com.html",
                  "docAuthor": "no author found",
                  "description": "No description found.",
                  "docSource": "URL link uploaded by the user.",
                  "chunkSource": "https:anythingllm.com.html",
                  "published": "1/16/2024, 3:46:33 PM",
                  "wordCount": 252,
                  "pageContent": "AnythingLLM is the best....",
                  "token_count_estimate": 447,
                  "location": "custom-documents/url-useanything_com-c530dbe6-bff1-4b9e-b87f-710d539d20bc.json"
                }
              ]
            }
          }
        }
      }
    }
    #swagger.responses[403] = {
      schema: {
        "$ref": "#/definitions/InvalidAPIKey"
      }
    }
    */
      try {
        const Collector = new CollectorApi();
        const { link } = reqBody(request);
        const processingOnline = await Collector.online();

        if (!processingOnline) {
          response
            .status(500)
            .json({
              success: false,
              error: `Document processing API is not online. Link ${link} will not be processed automatically.`,
            })
            .end();
          return;
        }

        const { success, reason, documents } =
          await Collector.processLink(link);
        if (!success) {
          response
            .status(500)
            .json({ success: false, error: reason, documents })
            .end();
          return;
        }

        Collector.log(
          `Link ${link} uploaded processed and successfully. It is now available in documents.`
        );
        await Telemetry.sendTelemetry("link_uploaded");
        await EventLogs.logEvent("api_link_uploaded", {
          link,
        });
        response.status(200).json({ success: true, error: null, documents });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/v1/document/raw-text",
    [validApiKey],
    async (request, response) => {
      /*
     #swagger.tags = ['Documents']
     #swagger.description = 'Upload a file by specifying its raw text content and metadata values without having to upload a file.'
     #swagger.requestBody = {
      description: 'Text content and metadata of the file to be saved to the system. Use metadata-schema endpoint to get the possible metadata keys',
      required: true,
      type: 'object',
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: {
              "textContent": "This is the raw text that will be saved as a document in AnythingLLM.",
              "metadata": {
                "title": "This key is required. See in /server/endpoints/api/document/index.js:287",
                keyOne: "valueOne",
                keyTwo: "valueTwo",
                etc: "etc"
              }
            }
          }
        }
      }
     }
    #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: {
              success: true,
              error: null,
              documents: [
                {
                  "id": "c530dbe6-bff1-4b9e-b87f-710d539d20bc",
                  "url": "file://my-document.txt",
                  "title": "hello-world.txt",
                  "docAuthor": "no author found",
                  "description": "No description found.",
                  "docSource": "My custom description set during upload",
                  "chunkSource": "no chunk source specified",
                  "published": "1/16/2024, 3:46:33 PM",
                  "wordCount": 252,
                  "pageContent": "AnythingLLM is the best....",
                  "token_count_estimate": 447,
                  "location": "custom-documents/raw-my-doc-text-c530dbe6-bff1-4b9e-b87f-710d539d20bc.json"
                }
              ]
            }
          }
        }
      }
     }
     #swagger.responses[403] = {
       schema: {
         "$ref": "#/definitions/InvalidAPIKey"
       }
     }
     */
      try {
        const Collector = new CollectorApi();
        const requiredMetadata = ["title"];
        const { textContent, metadata = {} } = reqBody(request);
        const processingOnline = await Collector.online();

        if (!processingOnline) {
          response
            .status(500)
            .json({
              success: false,
              error: `Document processing API is not online. Request will not be processed.`,
            })
            .end();
          return;
        }

        if (
          !requiredMetadata.every(
            (reqKey) =>
              Object.keys(metadata).includes(reqKey) && !!metadata[reqKey]
          )
        ) {
          response
            .status(422)
            .json({
              success: false,
              error: `You are missing required metadata key:value pairs in your request. Required metadata key:values are ${requiredMetadata
                .map((v) => `'${v}'`)
                .join(", ")}`,
            })
            .end();
          return;
        }

        if (!textContent || textContent?.length === 0) {
          response
            .status(422)
            .json({
              success: false,
              error: `The 'textContent' key cannot have an empty value.`,
            })
            .end();
          return;
        }

        const { success, reason, documents } = await Collector.processRawText(
          textContent,
          metadata
        );
        if (!success) {
          response
            .status(500)
            .json({ success: false, error: reason, documents })
            .end();
          return;
        }

        Collector.log(
          `Document created successfully. It is now available in documents.`
        );
        await Telemetry.sendTelemetry("raw_document_uploaded");
        await EventLogs.logEvent("api_raw_document_uploaded");
        response.status(200).json({ success: true, error: null, documents });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get("/v1/documents", [validApiKey], async (_, response) => {
    /*
    #swagger.tags = ['Documents']
    #swagger.description = 'List of all locally-stored documents in instance'
    #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: {
             "localFiles": {
              "name": "documents",
              "type": "folder",
              items: [
                {
                  "name": "my-stored-document.json",
                  "type": "file",
                  "id": "bb07c334-4dab-4419-9462-9d00065a49a1",
                  "url": "file://my-stored-document.txt",
                  "title": "my-stored-document.txt",
                  "cached": false
                },
              ]
             }
            }
          }
        }
      }
    }
    #swagger.responses[403] = {
      schema: {
        "$ref": "#/definitions/InvalidAPIKey"
      }
    }
    */
    try {
      const localFiles = await viewLocalFiles();
      response.status(200).json({ localFiles });
    } catch (e) {
      console.error(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.get(
    "/v1/document/accepted-file-types",
    [validApiKey],
    async (_, response) => {
      /*
    #swagger.tags = ['Documents']
    #swagger.description = 'Check available filetypes and MIMEs that can be uploaded.'
    #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: {
              "types": {
                "application/mbox": [
                  ".mbox"
                ],
                "application/pdf": [
                  ".pdf"
                ],
                "application/vnd.oasis.opendocument.text": [
                  ".odt"
                ],
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
                  ".docx"
                ],
                "text/plain": [
                  ".txt",
                  ".md"
                ]
              }
            }
          }
        }
      }
    }
    #swagger.responses[403] = {
      schema: {
        "$ref": "#/definitions/InvalidAPIKey"
      }
    }
    */
      try {
        const types = await new CollectorApi().acceptedFileTypes();
        if (!types) {
          response.sendStatus(404).end();
          return;
        }

        response.status(200).json({ types });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/v1/document/metadata-schema",
    [validApiKey],
    async (_, response) => {
      /*
    #swagger.tags = ['Documents']
    #swagger.description = 'Get the known available metadata schema for when doing a raw-text upload and the acceptable type of value for each key.'
    #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: {
             "schema": {
                "keyOne": "string | number | nullable",
                "keyTwo": "string | number | nullable",
                "specialKey": "number",
                "title": "string",
              }
            }
          }
        }
      }
    }
    #swagger.responses[403] = {
      schema: {
        "$ref": "#/definitions/InvalidAPIKey"
      }
    }
    */
      try {
        response.status(200).json({
          schema: {
            // If you are updating this be sure to update the collector METADATA_KEYS constant in /processRawText.
            url: "string | nullable",
            title: "string",
            docAuthor: "string | nullable",
            description: "string | nullable",
            docSource: "string | nullable",
            chunkSource: "string | nullable",
            published: "epoch timestamp in ms | nullable",
          },
        });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  // Be careful and place as last route to prevent override of the other /document/ GET
  // endpoints!
  app.get("/v1/document/:docName", [validApiKey], async (request, response) => {
    /*
    #swagger.tags = ['Documents']
    #swagger.description = 'Get a single document by its unique AnythingLLM document name'
    #swagger.parameters['docName'] = {
        in: 'path',
        description: 'Unique document name to find (name in /documents)',
        required: true,
        type: 'string'
    }
    #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: {
             "localFiles": {
              "name": "documents",
              "type": "folder",
              items: [
                {
                  "name": "my-stored-document.txt-uuid1234.json",
                  "type": "file",
                  "id": "bb07c334-4dab-4419-9462-9d00065a49a1",
                  "url": "file://my-stored-document.txt",
                  "title": "my-stored-document.txt",
                  "cached": false
                },
              ]
             }
            }
          }
        }
      }
    }
    #swagger.responses[403] = {
      schema: {
        "$ref": "#/definitions/InvalidAPIKey"
      }
    }
    */
    try {
      const { docName } = request.params;
      const document = await findDocumentInDocuments(docName);
      if (!document) {
        response.sendStatus(404).end();
        return;
      }
      response.status(200).json({ document });
    } catch (e) {
      console.error(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.post(
    "/v1/document/create-folder",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['Documents']
      #swagger.description = 'Create a new folder inside the documents storage directory.'
      #swagger.requestBody = {
        description: 'Name of the folder to create.',
        required: true,
        type: 'object',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: {
                "name": "new-folder"
              }
            }
          }
        }
      }
      #swagger.responses[200] = {
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: {
                success: true,
                message: null
              }
            }
          }
        }
      }
      #swagger.responses[403] = {
        schema: {
          "$ref": "#/definitions/InvalidAPIKey"
        }
      }
      */
      try {
        const { name } = reqBody(request);
        const storagePath = path.join(documentsPath, normalizePath(name));
        if (!isWithin(path.resolve(documentsPath), path.resolve(storagePath)))
          throw new Error("Invalid path name");

        if (fs.existsSync(storagePath)) {
          response.status(500).json({
            success: false,
            message: "Folder by that name already exists",
          });
          return;
        }

        fs.mkdirSync(storagePath, { recursive: true });
        response.status(200).json({ success: true, message: null });
      } catch (e) {
        console.error(e);
        response.status(500).json({
          success: false,
          message: `Failed to create folder: ${e.message}`,
        });
      }
    }
  );

  app.post(
    "/v1/document/move-files",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['Documents']
      #swagger.description = 'Move files within the documents storage directory.'
      #swagger.requestBody = {
        description: 'Array of objects containing source and destination paths of files to move.',
        required: true,
        type: 'object',
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: {
                "files": [
                  {
                    "from": "custom-documents/file.txt-fc4beeeb-e436-454d-8bb4-e5b8979cb48f.json",
                    "to": "folder/file.txt-fc4beeeb-e436-454d-8bb4-e5b8979cb48f.json"
                  }
                ]
              }
            }
          }
        }
      }
      #swagger.responses[200] = {
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: {
                success: true,
                message: null
              }
            }
          }
        }
      }
      #swagger.responses[403] = {
        schema: {
          "$ref": "#/definitions/InvalidAPIKey"
        }
      }
      */
      try {
        const { files } = reqBody(request);
        const docpaths = files.map(({ from }) => from);
        const documents = await Document.where({ docpath: { in: docpaths } });
        const embeddedFiles = documents.map((doc) => doc.docpath);
        const moveableFiles = files.filter(
          ({ from }) => !embeddedFiles.includes(from)
        );
        const movePromises = moveableFiles.map(({ from, to }) => {
          const sourcePath = path.join(documentsPath, normalizePath(from));
          const destinationPath = path.join(documentsPath, normalizePath(to));
          return new Promise((resolve, reject) => {
            fs.rename(sourcePath, destinationPath, (err) => {
              if (err) {
                console.error(`Error moving file ${from} to ${to}:`, err);
                reject(err);
              } else {
                resolve();
              }
            });
          });
        });
        Promise.all(movePromises)
          .then(() => {
            const unmovableCount = files.length - moveableFiles.length;
            if (unmovableCount > 0) {
              response.status(200).json({
                success: true,
                message: `${unmovableCount}/${files.length} files not moved. Unembed them from all workspaces.`,
              });
            } else {
              response.status(200).json({
                success: true,
                message: null,
              });
            }
          })
          .catch((err) => {
            console.error("Error moving files:", err);
            response
              .status(500)
              .json({ success: false, message: "Failed to move some files." });
          });
      } catch (e) {
        console.error(e);
        response
          .status(500)
          .json({ success: false, message: "Failed to move files." });
      }
    }
  );
}

module.exports = { apiDocumentEndpoints };

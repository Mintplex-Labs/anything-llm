const path = require("path");
const fs = require("fs/promises");
const filesystem = require("./lib.js");
const createFilesLib = require("../create-files/lib");

module.exports.FilesystemWriteTextFile = {
  name: "filesystem-write-text-file",
  plugin: function () {
    return {
      name: "filesystem-write-text-file",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Create a new file or completely overwrite an existing file with new content. " +
            "Use with caution as it will overwrite existing files without warning. " +
            "Handles all text-based formats: code files (.py, .js, .ts, .lua, .sh, .ps1, .bat, " +
            ".rs, .go, .rb, .php, .java, .c, .cpp, .cs, .swift, .kt, .r, .sql), config files " +
            "(.json, .yaml, .yml, .toml, .ini, .env, .cfg), web files (.html, .css), " +
            "and plain text (.txt, .md, .csv, .log, .xml). " +
            "Only works within allowed directories. " +
            "For binary formats (PDF, DOCX, XLSX, PPTX), use the appropriate document creation tools instead.",
          examples: [
            {
              prompt: "Write a hello world Python script",
              call: JSON.stringify({
                path: "hello.py",
                content: 'print("Hello, World!")',
              }),
            },
            {
              prompt: "Create a Lua game script",
              call: JSON.stringify({
                path: "game.lua",
                content: "local player = {}\nfunction player.new(name)\n  return setmetatable({name=name, health=100}, player)\nend\nreturn player",
              }),
            },
            {
              prompt: "Create a PowerShell setup script",
              call: JSON.stringify({
                path: "setup.ps1",
                content: "param([string]$Env = 'dev')\nWrite-Host \"Setting up $Env environment\"",
              }),
            },
            {
              prompt: "Create a new JSON config file",
              call: JSON.stringify({
                path: "config.json",
                content: '{"debug": true, "port": 3000}',
              }),
            },
            {
              prompt: "Create a bash deployment script",
              call: JSON.stringify({
                path: "deploy.sh",
                content: "#!/usr/bin/env bash\nset -euo pipefail\necho \"Deploying...\"",
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "The path where the file should be created or overwritten.",
              },
              content: {
                type: "string",
                description: "The content to write to the file.",
              },
            },
            required: ["path", "content"],
            additionalProperties: false,
          },
          handler: async function ({ path: filePath = "", content = "" }) {
            try {
              this.super.handlerProps.log(`Using the filesystem-write-text-file tool.`);

              const validPath = await filesystem.validatePath(filePath);
              this.super.introspect(`${this.caller}: Writing to file ${filePath}`);

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { path: filePath, content },
                  description: "Write content to a file",
                });
                if (!approval.approved) {
                  this.super.introspect(`${this.caller}: User rejected the ${this.name} request.`);
                  return approval.message;
                }
              }

              await filesystem.writeFileContent(validPath, content);
              this.super.introspect(`Successfully wrote to ${filePath}`);

              // Register preview card — both live (socket) and historical (DB)
              try {
                const filename = path.basename(validPath);
                const extension = path.extname(filename).replace(".", "") || "txt";
                await createFilesLib.ensureInitialized();
                const savedFile = await createFilesLib.saveGeneratedFile({
                  fileType: "fs",
                  extension,
                  buffer: Buffer.from(content, "utf-8"),
                  displayFilename: filename,
                });

                // Live card — shows immediately in the current chat response
                this.super.socket.send("fileDownloadCard", {
                  filename: savedFile.displayFilename,
                  storageFilename: savedFile.filename,
                  fileSize: savedFile.fileSize,
                });

                // Historical record — shows when viewing past messages
                createFilesLib.registerOutput(this.super, "FilesystemFileDownload", {
                  filename: savedFile.displayFilename,
                  storageFilename: savedFile.filename,
                  fileSize: savedFile.fileSize,
                });
              } catch (outputErr) {
                // Non-fatal — file was still written successfully
                console.warn(`[filesystem-write-text-file] Could not register preview output: ${outputErr.message}`);
              }

              return `Successfully wrote to ${filePath}`;
            } catch (e) {
              this.super.handlerProps.log(`filesystem-write-text-file error: ${e.message}`);
              this.super.introspect(`Error: ${e.message}`);
              return `Error writing file: ${e.message}`;
            }
          },
        });
      },
    };
  },
};

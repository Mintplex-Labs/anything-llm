const { google } = require("googleapis");
const { PassThrough } = require("stream");

/**
 * Google Drive API Loader for AnythingLLM
 * Handles authentication via service account and file processing
 */
class GoogleDriveLoader {
    constructor({ serviceAccount, folderId, includeSubfolders = true }) {
        this.serviceAccount = serviceAccount;
        this.folderId = folderId;
        this.includeSubfolders = includeSubfolders;
        this.drive = null;
        this.auth = null;
    }

    /**
     * Initialize authentication with Google Drive API
     */
    async authenticate() {
        try {
            this.auth = new google.auth.GoogleAuth({
                credentials: this.serviceAccount,
                scopes: ["https://www.googleapis.com/auth/drive.readonly"],
            });

            this.drive = google.drive({ version: "v3", auth: this.auth });

            // Test the connection
            await this.drive.about.get({ fields: "user" });
            return true;
        } catch (error) {
            console.error("Google Drive authentication failed:", error.message);
            throw new Error(`Authentication failed: ${error.message}`);
        }
    }

    /**
     * Get all files from the specified folder and subfolders
     */
    async getAllFiles() {
        const allFiles = [];
        const foldersToProcess = [this.folderId];
        const processedFolders = new Set();

        while (foldersToProcess.length > 0) {
            const currentFolderId = foldersToProcess.shift();

            if (processedFolders.has(currentFolderId)) {
                continue; // Prevent infinite loops
            }
            processedFolders.add(currentFolderId);

            try {
                let pageToken = null;

                do {
                    const response = await this.drive.files.list({
                        q: `'${currentFolderId}' in parents and trashed=false`,
                        fields: "nextPageToken, files(id, name, mimeType, size, modifiedTime, parents, webViewLink)",
                        pageSize: 1000,
                        pageToken: pageToken,
                    });

                    const files = response.data.files || [];

                    for (const file of files) {
                        if (this.isFolder(file.mimeType)) {
                            if (this.includeSubfolders) {
                                foldersToProcess.push(file.id);
                            }
                        } else if (this.isSupportedFile(file)) {
                            allFiles.push(file);
                        }
                    }

                    pageToken = response.data.nextPageToken;
                } while (pageToken);

            } catch (error) {
                console.error(`Error processing folder ${currentFolderId}:`, error.message);
                // Continue with other folders even if one fails
            }
        }

        return allFiles;
    }

    /**
     * Check if the file type is a folder
     */
    isFolder(mimeType) {
        return mimeType === "application/vnd.google-apps.folder";
    }

    /**
     * Check if the file is supported for processing
     */
    isSupportedFile(file) {
        // Skip very large files (>50MB)
        const maxSize = 50 * 1024 * 1024;
        if (file.size && parseInt(file.size) > maxSize) {
            console.log(`Skipping large file: ${file.name} (${Math.round(file.size / 1024 / 1024)}MB)`);
            return false;
        }

        const supportedMimeTypes = [
            // Google Workspace files
            "application/vnd.google-apps.document",
            "application/vnd.google-apps.spreadsheet",
            "application/vnd.google-apps.presentation",

            // Common document formats
            "application/pdf",
            "text/plain",
            "text/csv",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "application/msword",
            "application/vnd.ms-excel",
            "application/vnd.ms-powerpoint",

            // Images (for OCR)
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/bmp",
            "image/tiff",

            // Text formats
            "text/html",
            "text/markdown",
            "application/rtf",
        ];

        return supportedMimeTypes.includes(file.mimeType);
    }

    /**
     * Download and convert a file to text content
     */
    async downloadAndConvertFile(file) {
        try {
            let content = "";
            let mimeType = file.mimeType;

            // Handle Google Workspace files by exporting them
            if (file.mimeType.startsWith("application/vnd.google-apps.")) {
                content = await this.exportGoogleWorkspaceFile(file);
            } else {
                // Handle regular files
                content = await this.downloadRegularFile(file);
            }

            return {
                content,
                metadata: {
                    source: file.webViewLink,
                    title: file.name,
                    fileId: file.id,
                    mimeType: file.mimeType,
                    size: file.size,
                    modifiedTime: file.modifiedTime,
                },
            };
        } catch (error) {
            console.error(`Error processing file ${file.name}:`, error.message);
            return null;
        }
    }

    /**
     * Export Google Workspace files to text format
     */
    async exportGoogleWorkspaceFile(file) {
        const exportMimeTypes = {
            "application/vnd.google-apps.document": "text/plain",
            "application/vnd.google-apps.spreadsheet": "text/csv",
            "application/vnd.google-apps.presentation": "text/plain",
        };

        const exportMimeType = exportMimeTypes[file.mimeType];
        if (!exportMimeType) {
            throw new Error(`Unsupported Google Workspace file type: ${file.mimeType}`);
        }

        const response = await this.drive.files.export({
            fileId: file.id,
            mimeType: exportMimeType,
        });

        return response.data;
    }

    /**
     * Download regular files
     */
    async downloadRegularFile(file) {
        const response = await this.drive.files.get({
            fileId: file.id,
            alt: "media",
        });

        // For text files, return the content directly
        if (file.mimeType.startsWith("text/") || file.mimeType === "application/pdf") {
            return response.data;
        }

        // For other formats, we'll need additional processing
        // This is a placeholder - in a real implementation, you'd use libraries like pdf-parse, etc.
        return response.data.toString();
    }

    /**
     * Get the current change token for the folder
     */
    async getCurrentChangeToken() {
        try {
            const response = await this.drive.changes.getStartPageToken();
            return response.data.startPageToken;
        } catch (error) {
            console.error("Error getting change token:", error.message);
            return null;
        }
    }

    /**
     * Get changes since the last token
     */
    async getChangesSince(changeToken) {
        try {
            const allChanges = [];
            let pageToken = changeToken;

            do {
                const response = await this.drive.changes.list({
                    pageToken: pageToken,
                    fields: "nextPageToken, newStartPageToken, changes(fileId, removed, file(id, name, mimeType, size, modifiedTime, parents, webViewLink))",
                });

                if (response.data.changes) {
                    // Filter changes to only include files in our watched folder(s)
                    const relevantChanges = await this.filterRelevantChanges(response.data.changes);
                    allChanges.push(...relevantChanges);
                }

                pageToken = response.data.nextPageToken;

                // If this is the last page, return the new start token
                if (!pageToken && response.data.newStartPageToken) {
                    return {
                        changes: allChanges,
                        newChangeToken: response.data.newStartPageToken,
                    };
                }
            } while (pageToken);

            return {
                changes: allChanges,
                newChangeToken: null,
            };
        } catch (error) {
            console.error("Error getting changes:", error.message);
            throw error;
        }
    }

    /**
     * Filter changes to only include files in our watched folders
     */
    async filterRelevantChanges(changes) {
        const relevantChanges = [];

        for (const change of changes) {
            if (change.removed) {
                // File was deleted
                relevantChanges.push(change);
                continue;
            }

            if (!change.file || !change.file.parents) {
                continue;
            }

            // Check if the file is in our watched folder or its subfolders
            const isInWatchedFolder = await this.isFileInWatchedFolder(change.file);
            if (isInWatchedFolder) {
                relevantChanges.push(change);
            }
        }

        return relevantChanges;
    }

    /**
     * Check if a file is in the watched folder or its subfolders
     */
    async isFileInWatchedFolder(file) {
        if (!file.parents) return false;

        for (const parentId of file.parents) {
            if (parentId === this.folderId) {
                return true;
            }

            // If including subfolders, check if parent is a subfolder of our watched folder
            if (this.includeSubfolders) {
                const isSubfolder = await this.isSubfolderOf(parentId, this.folderId);
                if (isSubfolder) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Check if a folder is a subfolder of another folder
     */
    async isSubfolderOf(childFolderId, parentFolderId, visited = new Set()) {
        if (visited.has(childFolderId)) {
            return false; // Prevent infinite loops
        }
        visited.add(childFolderId);

        try {
            const response = await this.drive.files.get({
                fileId: childFolderId,
                fields: "parents",
            });

            if (!response.data.parents) {
                return false;
            }

            for (const parent of response.data.parents) {
                if (parent === parentFolderId) {
                    return true;
                }

                // Recursively check parent folders
                const isSubfolder = await this.isSubfolderOf(parent, parentFolderId, visited);
                if (isSubfolder) {
                    return true;
                }
            }

            return false;
        } catch (error) {
            console.error(`Error checking folder hierarchy for ${childFolderId}:`, error.message);
            return false;
        }
    }

    /**
     * Load all documents from the folder
     */
    async load() {
        await this.authenticate();

        const files = await this.getAllFiles();
        console.log(`Found ${files.length} supported files in Google Drive folder`);

        const documents = [];
        let processed = 0;
        let failed = 0;

        for (const file of files) {
            try {
                const doc = await this.downloadAndConvertFile(file);
                if (doc && doc.content) {
                    documents.push({
                        pageContent: doc.content,
                        metadata: doc.metadata,
                    });
                    processed++;
                } else {
                    failed++;
                }
            } catch (error) {
                console.error(`Failed to process file ${file.name}:`, error.message);
                failed++;
            }
        }

        console.log(`Google Drive sync completed: ${processed} processed, ${failed} failed`);

        return {
            documents,
            stats: {
                total: files.length,
                processed,
                failed,
            },
        };
    }
}

module.exports = { GoogleDriveLoader }; 
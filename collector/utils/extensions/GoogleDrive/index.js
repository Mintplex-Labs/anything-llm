const fs = require("fs");
const path = require("path");
const { default: slugify } = require("slugify");
const { v4 } = require("uuid");
const { writeToServerDocuments, sanitizeFileName } = require("../../files");
const { tokenizeString } = require("../../tokenizer");
const { GoogleDriveLoader } = require("./GoogleDriveLoader");

/**
 * Load Google Drive documents from a folder and service account credentials
 * @param {object} args - forwarded request body params
 * @param {import("../../../middleware/setDataSigner").ResponseWithSigner} response - Express response object with encryptionWorker
 * @returns
 */
async function loadGoogleDrive(
    {
        folderId = null,
        serviceAccount = null,
        syncFrequency = "daily",
        enableAutoSync = false,
        includeSubfolders = true,
    },
    response
) {
    if (!folderId) {
        return {
            success: false,
            reason: "You need to provide a Google Drive folder ID.",
        };
    }

    if (!serviceAccount) {
        return {
            success: false,
            reason: "You need to provide a valid service account JSON.",
        };
    }

    console.log(`-- Working Google Drive Folder ${folderId} --`);
    const loader = new GoogleDriveLoader({
        serviceAccount,
        folderId,
        includeSubfolders,
    });

    const { documents, stats, error } = await loader
        .load()
        .then((result) => {
            return { documents: result.documents, stats: result.stats, error: null };
        })
        .catch((e) => {
            return {
                documents: [],
                stats: { total: 0, processed: 0, failed: 0 },
                error: e.message?.split("Error:")?.[1] || e.message,
            };
        });

    if (!documents.length || !!error) {
        return {
            success: false,
            reason: error ?? "No documents found in the Google Drive folder.",
        };
    }

    const outFolder = slugify(
        `Google Drive Folder ${folderId}`.substring(0, 20)
    );

    const outFolderPath =
        process.env.NODE_ENV === "development"
            ? path.resolve(__dirname, `../../../../server/storage/documents/${outFolder}`)
            : path.resolve(process.env.STORAGE_DIR, `documents/${outFolder}`);

    if (!fs.existsSync(outFolderPath)) {
        fs.mkdirSync(outFolderPath, { recursive: true });
    }

    // Process documents and save to storage
    let processedFiles = 0;
    for (const document of documents) {
        if (!document.pageContent || document.pageContent.length === 0) {
            continue;
        }

        console.log(`-- Working Google Drive document: ${document.metadata.title} --`);

        // Ensure pageContent is a string
        let pageContent = document.pageContent;
        if (typeof pageContent !== 'string') {
            console.log(`Converting non-string content for ${document.metadata.title}`);
            pageContent = String(pageContent);
        }

        // Skip if still not valid text content
        if (!pageContent || pageContent.length === 0) {
            console.log(`Skipping ${document.metadata.title} - no valid text content`);
            continue;
        }

        // Generate a unique ID for tracking changes
        const docId = `google-drive-${document.metadata.fileId}`;
        const data = {
            id: docId,
            url: `googledrive://${document.metadata.source}`,
            title: document.metadata.title,
            docAuthor: "Google Drive",
            description: `Google Drive document: ${document.metadata.title}`,
            docSource: `Google Drive Folder ${folderId}`,
            chunkSource: response.locals.encryptionWorker.encrypt(
                JSON.stringify({
                    type: "googledrive",
                    folderId,
                    fileId: document.metadata.fileId,
                    serviceAccount: response.locals.encryptionWorker.encrypt(JSON.stringify(serviceAccount)),
                    syncFrequency,
                    enableAutoSync,
                    includeSubfolders,
                })
            ),
            published: new Date().toLocaleString(),
            wordCount: pageContent.split(" ").length,
            pageContent: pageContent,
            token_count_estimate: tokenizeString(pageContent),
        };

        const fileName = sanitizeFileName(
            `${slugify(document.metadata.title)}-${docId}`
        );
        writeToServerDocuments(data, fileName, outFolderPath);
        processedFiles++;
    }

    return {
        success: true,
        reason: null,
        data: {
            destination: outFolder,
            processedFiles,
            totalFiles: stats.total,
            failedFiles: stats.failed,
            syncFrequency,
            enableAutoSync,
        },
    };
}

/**
 * Resync a Google Drive document based on its chunkSource metadata
 * @param {object} args - forwarded request body params
 * @returns
 */
async function resyncGoogleDriveDocument({ chunkSource }) {
    try {
        // The chunkSource contains encrypted metadata about the original sync
        const { EncryptionWorker } = require("../../EncryptionWorker");
        const encryptionWorker = new EncryptionWorker();

        const metadata = JSON.parse(encryptionWorker.decrypt(chunkSource));
        if (metadata.type !== "googledrive") {
            throw new Error("Invalid chunk source type for Google Drive resync");
        }

        // Decrypt the service account
        const serviceAccount = JSON.parse(encryptionWorker.decrypt(metadata.serviceAccount));

        const loader = new GoogleDriveLoader({
            serviceAccount,
            folderId: metadata.folderId,
            includeSubfolders: metadata.includeSubfolders,
        });

        await loader.authenticate();

        // Get the specific file by ID
        const file = await loader.drive.files.get({
            fileId: metadata.fileId,
            fields: "id, name, mimeType, size, modifiedTime, parents, webViewLink",
        });

        if (!file.data) {
            return null; // File no longer exists
        }

        // Download and convert the file
        const doc = await loader.downloadAndConvertFile(file.data);
        if (!doc || !doc.content) {
            return null;
        }

        return doc.content;
    } catch (error) {
        console.error("Error resyncing Google Drive document:", error.message);
        return null;
    }
}

/**
 * Get changes from Google Drive since a specific change token
 * @param {object} args - Arguments containing change token and metadata
 * @returns
 */
async function getGoogleDriveChanges({
    changeToken,
    folderId,
    serviceAccount,
    includeSubfolders = true,
}) {
    try {
        const loader = new GoogleDriveLoader({
            serviceAccount,
            folderId,
            includeSubfolders,
        });

        await loader.authenticate();

        const { changes, newChangeToken } = await loader.getChangesSince(changeToken);

        return {
            success: true,
            changes,
            newChangeToken,
        };
    } catch (error) {
        console.error("Error getting Google Drive changes:", error.message);
        return {
            success: false,
            error: error.message,
        };
    }
}

module.exports = {
    loadGoogleDrive,
    resyncGoogleDriveDocument,
    getGoogleDriveChanges,
}; 
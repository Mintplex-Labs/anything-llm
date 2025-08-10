const { DocumentArchive } = require('../models/documentArchive.js');
const { log, conclude } = require('./helpers/index.js');

(async () => {
    try {
        // Get documents that are ready for permanent deletion
        const documentsToDelete = await DocumentArchive.getDocumentsReadyForPurge();

        if (documentsToDelete.length === 0) {
            log('No archived documents ready for purging. Checking for old records to clean up.');
        } else {
            log(`Found ${documentsToDelete.length} archived documents ready for permanent deletion.`);

            let successCount = 0;
            let errorCount = 0;

            for (const archiveRecord of documentsToDelete) {
                try {
                    const success = await DocumentArchive.permanentlyDelete(archiveRecord.id);
                    if (success) {
                        successCount++;
                        log(`Permanently deleted archived document: ${archiveRecord.originalFilename}`);
                    } else {
                        errorCount++;
                        log(`Failed to delete archived document: ${archiveRecord.originalFilename}`);
                    }
                } catch (error) {
                    errorCount++;
                    log(`Error deleting archived document ${archiveRecord.originalFilename}: ${error.message}`);
                }
            }

            log(`Archive cleanup completed: ${successCount} deleted, ${errorCount} errors.`);
        }

        // Clean up old archive records (older than 1 year)
        const cleanedCount = await DocumentArchive.cleanupOldRecords();
        if (cleanedCount > 0) {
            log(`Cleaned up ${cleanedCount} old archive records.`);
        }

        // Log current archive statistics
        const stats = await DocumentArchive.getStats();
        log(`Archive stats - Total: ${stats.totalArchived}, Ready for purge: ${stats.readyForPurge}, Purged: ${stats.totalPurged}, Restored: ${stats.totalRestored}`);

    } catch (e) {
        console.error(e);
        log(`Archive cleanup job errored with ${e.message}`);
    } finally {
        conclude();
    }
})(); 
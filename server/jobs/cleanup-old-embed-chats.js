const { log, conclude } = require("./helpers/index.js");
const { EmbedConfig } = require("../models/embedConfig.js");
const { EmbedChats } = require("../models/embedChats.js");
const { EventLogs } = require("../models/eventLogs.js");

/**
 * DSGVO-compliant automatic deletion of old embed chats based on retention periods.
 * Runs daily to clean up chats older than their configured retention days.
 *
 * IMPORTANT: Cleanup only starts AFTER retention_days have passed since the
 * retention was activated (retention_started_at). This prevents retroactive
 * deletion of old chats when a retention policy is first enabled.
 */
(async () => {
  try {
    log("Starting cleanup of old embed chats...");

    // Find all embeds with a retention policy configured
    const embedsWithRetention = await EmbedConfig.where({
      chat_retention_days: { not: null },
    });

    if (embedsWithRetention.length === 0) {
      log("No embeds with retention policies found - exiting.");
      return;
    }

    log(
      `Found ${embedsWithRetention.length} embed(s) with retention policies configured`
    );

    let totalDeleted = 0;

    for (const embed of embedsWithRetention) {
      try {
        const retentionDays = embed.chat_retention_days;
        if (!retentionDays || retentionDays <= 0) continue;

        const retentionStartedAt = embed.retention_started_at
          ? new Date(embed.retention_started_at)
          : null;

        // Safety check: If retention_started_at is not set, skip this embed.
        // This protects against retroactive deletion for legacy entries.
        if (!retentionStartedAt) {
          log(
            `  Skipping embed ${embed.id}: retention_started_at not set (legacy entry). ` +
            `Re-save the retention setting to activate cleanup.`
          );
          continue;
        }

        // Only start cleanup AFTER retention_days have passed since activation.
        // Example: If set on Feb 24 with 30 days, first cleanup is March 26.
        const cleanupStartDate = new Date(retentionStartedAt);
        cleanupStartDate.setDate(cleanupStartDate.getDate() + retentionDays);

        if (new Date() < cleanupStartDate) {
          log(
            `  Skipping embed ${embed.id}: retention grace period active until ${cleanupStartDate.toISOString()}. ` +
            `Cleanup will begin after ${retentionDays} days from activation.`
          );
          continue;
        }

        // Calculate cutoff date: now - retention_days
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

        log(
          `Processing embed ${embed.id}: deleting chats older than ${retentionDays} days (before ${cutoffDate.toISOString()})`
        );

        // Count chats to be deleted
        const count = await EmbedChats.count({
          embed_id: embed.id,
          createdAt: { lt: cutoffDate },
        });

        if (count === 0) {
          log(`  No old chats found for embed ${embed.id}`);
          continue;
        }

        // Delete old chats
        await EmbedChats.delete({
          embed_id: embed.id,
          createdAt: { lt: cutoffDate },
        });

        totalDeleted += count;

        log(
          `  Deleted ${count} chat(s) from embed ${embed.id} (older than ${retentionDays} days)`
        );

        // Log event for audit trail (DSGVO compliance)
        await EventLogs.logEvent(
          "embed_chats_auto_deleted",
          {
            embedId: embed.id,
            deletedCount: count,
            retentionDays: retentionDays,
            cutoffDate: cutoffDate.toISOString(),
          },
          null // System operation, no user
        );
      } catch (embedError) {
        log(
          `  Error processing embed ${embed.id}: ${embedError.message}`
        );
        console.error(embedError);
      }
    }

    log(`Cleanup complete. Total chats deleted: ${totalDeleted}`);
  } catch (e) {
    console.error(e);
    log(`Cleanup errored with: ${e.message}`);
  } finally {
    conclude();
  }
})();

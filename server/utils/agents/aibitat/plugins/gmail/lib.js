const fs = require("fs");
const path = require("path");
const os = require("os");
const mime = require("mime");
const { SystemSettings } = require("../../../../../models/systemSettings");
const { CollectorApi } = require("../../../../collectorApi");
const { humanFileSize } = require("../../../../helpers");
const { safeJsonParse } = require("../../../../http");

const MAX_TOTAL_ATTACHMENT_SIZE = 20 * 1024 * 1024; // 20MB limit for all attachments combined

/**
 * Validates and prepares a file attachment for email.
 * Note: Does not check total size limit - caller should track cumulative size.
 * @param {string} filePath - Absolute path to the file
 * @returns {{success: boolean, attachment?: object, error?: string, fileInfo?: object}}
 */
function prepareAttachment(filePath) {
  if (process.env.ANYTHING_LLM_RUNTIME === "docker") {
    return {
      success: false,
      error: "File attachments are not supported in Docker environments.",
    };
  }

  if (!path.isAbsolute(filePath)) {
    return { success: false, error: `Path must be absolute: ${filePath}` };
  }

  if (!fs.existsSync(filePath)) {
    return { success: false, error: `File does not exist: ${filePath}` };
  }

  const stats = fs.statSync(filePath);
  if (!stats.isFile()) {
    return { success: false, error: `Path is not a file: ${filePath}` };
  }

  if (stats.size === 0) {
    return { success: false, error: `File is empty: ${filePath}` };
  }

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const base64Data = fileBuffer.toString("base64");
    const fileName = path.basename(filePath);
    const contentType = mime.getType(filePath) || "application/octet-stream";

    return {
      success: true,
      attachment: {
        name: fileName,
        contentType,
        data: base64Data,
      },
      fileInfo: {
        path: filePath,
        name: fileName,
        size: stats.size,
        sizeFormatted: humanFileSize(stats.size, true),
        contentType,
      },
    };
  } catch (e) {
    return { success: false, error: `Failed to read file: ${e.message}` };
  }
}

/**
 * Parse an attachment using the CollectorApi for secure content extraction.
 * Writes the base64 data to a temp file, parses it, then cleans up.
 * @param {Object} attachment - The attachment object with name, contentType, size, data (base64)
 * @returns {Promise<{success: boolean, content: string|null, error: string|null}>}
 */
async function parseAttachment(attachment) {
  const tempDir = os.tmpdir();
  const safeFilename = attachment.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const tempFilePath = path.join(
    tempDir,
    `gmail-attachment-${Date.now()}-${safeFilename}`
  );

  try {
    const buffer = Buffer.from(attachment.data, "base64");
    fs.writeFileSync(tempFilePath, buffer);

    const collector = new CollectorApi();
    const result = await collector.parseDocument(safeFilename, {
      absolutePath: tempFilePath,
    });

    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }

    if (!result.success) {
      return {
        success: false,
        content: null,
        error: result.reason || "Failed to parse attachment",
      };
    }

    const textContent = result.documents
      ?.map((doc) => doc.pageContent || doc.content || "")
      .filter(Boolean)
      .join("\n\n");

    return {
      success: true,
      content: textContent || "(No text content extracted)",
      error: null,
    };
  } catch (e) {
    if (fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch {}
    }
    return { success: false, content: null, error: e.message };
  }
}

/**
 * Collect attachments from messages and optionally parse them with user approval.
 * Specific files may not show (images) and are pre-stripped by the app script.
 * If two attachments have the same name, only the first one will be kept (handling fwd emails)
 * @param {Object} context - The handler context (this) from the aibitat function
 * @param {Array} messages - Array of message objects (single message should be wrapped in array)
 * @returns {Promise<{allAttachments: Array, parsedContent: string}>}
 */
async function handleAttachments(context, messages) {
  const allAttachments = [];
  const uniqueAttachments = new Set();
  messages.forEach((msg, msgIndex) => {
    if (msg.attachments?.length > 0) {
      msg.attachments.forEach((att) => {
        if (uniqueAttachments.has(att.name)) return;
        uniqueAttachments.add(att.name);
        allAttachments.push({
          ...att,
          messageIndex: msgIndex + 1,
          messageId: msg.id,
        });
      });
    }
  });

  let parsedContent = "";
  const citations = [];
  if (allAttachments.length > 0 && context.super.requestToolApproval) {
    const attachmentNames = allAttachments.map((a) => a.name).join(", ");

    const approval = await context.super.requestToolApproval({
      skillName: context.name,
      payload: { attachments: attachmentNames },
      description: `Parse attachments (${attachmentNames}) to extract text content?`,
    });

    if (approval.approved) {
      context.super.introspect(
        `${context.caller}: Parsing ${allAttachments.length} attachment(s)...`
      );

      const parsedResults = [];
      for (const attachment of allAttachments) {
        if (!attachment.data) continue;
        context.super.introspect(
          `${context.caller}: Parsing "${attachment.name}"...`
        );
        const parseResult = await parseAttachment(attachment);
        if (!parseResult.success) continue;

        citations.push({
          id: `gmail-attachment-${attachment.messageId}-${attachment.name}`,
          title: attachment.name,
          text: parseResult.content,
          chunkSource: "gmail-attachment://" + attachment.name,
          score: null,
        });
        parsedResults.push({
          name: attachment.name,
          messageIndex: attachment.messageIndex,
          ...parseResult,
        });
      }

      parsedContent =
        "\n\n--- Parsed Attachment Content ---\n" +
        parsedResults
          .map((r) => `\n[Message ${r.messageIndex}: ${r.name}]\n${r.content}`)
          .join("\n");

      context.super.introspect(
        `${context.caller}: Finished parsing attachments`
      );
    } else {
      context.super.introspect(
        `${context.caller}: User declined to parse attachments`
      );
    }
  }

  citations.forEach((c) => context.super.addCitation?.(c));
  return { allAttachments, parsedContent };
}

/**
 * Gmail Bridge Library
 * Handles communication with the AnythingLLM Gmail Google Apps Script deployment.
 */
class GmailBridge {
  #deploymentId = null;
  #apiKey = null;
  #isInitialized = false;

  #log(text, ...args) {
    console.log(`\x1b[36m[GmailBridge]\x1b[0m ${text}`, ...args);
  }

  /**
   * Resets the bridge state, forcing re-initialization on next use.
   * Call this when configuration changes (e.g., deployment ID updated).
   */
  reset() {
    this.#deploymentId = null;
    this.#apiKey = null;
    this.#isInitialized = false;
  }

  /**
   * Gets the current Gmail agent configuration from system settings.
   * @returns {Promise<{deploymentId?: string, apiKey?: string}>}
   */
  static async getConfig() {
    const configJson = await SystemSettings.getValueOrFallback(
      { label: "gmail_agent_config" },
      "{}"
    );
    return safeJsonParse(configJson, {});
  }

  /**
   * Updates the Gmail agent configuration in system settings.
   * @param {Object} updates - Fields to update
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async updateConfig(updates) {
    try {
      await SystemSettings.updateSettings({
        gmail_agent_config: JSON.stringify(updates),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Initializes the Gmail bridge by fetching configuration from system settings.
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async initialize() {
    if (this.#isInitialized) return { success: true };

    try {
      const isMultiUser = await SystemSettings.isMultiUserMode();
      if (isMultiUser) {
        return {
          success: false,
          error:
            "Gmail integration is not available in multi-user mode for security reasons.",
        };
      }

      const config = await GmailBridge.getConfig();
      if (!config.deploymentId || !config.apiKey) {
        return {
          success: false,
          error:
            "Gmail integration is not configured. Please set the Deployment ID and API Key in the agent settings.",
        };
      }

      this.#deploymentId = config.deploymentId;
      this.#apiKey = config.apiKey;
      this.#isInitialized = true;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Checks if the Gmail bridge is properly configured and available.
   * @returns {Promise<boolean>}
   */
  async isAvailable() {
    const result = await this.initialize();
    return result.success;
  }

  /**
   * Checks if Gmail tools are available (not in multi-user mode and has configuration).
   * @returns {Promise<boolean>}
   */
  static async isToolAvailable() {
    const isMultiUser = await SystemSettings.isMultiUserMode();
    if (isMultiUser) return false;

    const config = await GmailBridge.getConfig();
    return !!(config.deploymentId && config.apiKey);
  }

  get maskedDeploymentId() {
    if (!this.#deploymentId) return "(not configured)";
    return (
      this.#deploymentId.substring(0, 5) +
      "..." +
      this.#deploymentId.substring(this.#deploymentId.length - 5)
    );
  }

  /**
   * Gets the base URL for the Gmail Google Apps Script deployment.
   * @returns {string}
   */
  #getBaseUrl() {
    this.#log(`Getting base URL for deployment ID ${this.maskedDeploymentId}`);
    return `https://script.google.com/macros/s/${this.#deploymentId}/exec`;
  }

  /**
   * Makes a request to the Gmail Google Apps Script API.
   * @param {string} action - The action to perform
   * @param {object} params - Additional parameters for the action
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async request(action, params = {}) {
    const initResult = await this.initialize();
    if (!initResult.success) {
      return { success: false, error: initResult.error };
    }

    try {
      const response = await fetch(this.#getBaseUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-AnythingLLM-UA": "AnythingLLM-Gmail-Agent/1.0",
        },
        body: JSON.stringify({
          key: this.#apiKey,
          action,
          ...params,
        }),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Gmail API request failed with status ${response.status}`,
        };
      }

      const result = await response.json();

      if (result.status === "error") {
        return { success: false, error: result.error };
      }

      return { success: true, data: result.data, quota: result.quota };
    } catch (error) {
      return {
        success: false,
        error: `Gmail API request failed: ${error.message}`,
      };
    }
  }

  /**
   * Search emails using Gmail query syntax.
   * @param {string} query - Gmail search query
   * @param {number} limit - Maximum results to return
   * @param {number} start - Starting offset
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async search(query = "is:inbox", limit = 10, start = 0) {
    return this.request("search", { query, limit, start });
  }

  /**
   * Read a full thread by ID.
   * @param {string} threadId - The thread ID
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async readThread(threadId) {
    return this.request("read_thread", { threadId });
  }

  /**
   * Create a new draft email.
   * @param {string} to - Recipient email
   * @param {string} subject - Email subject
   * @param {string} body - Email body
   * @param {object} options - Additional options (cc, bcc, htmlBody, etc.)
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async createDraft(to, subject, body, options = {}) {
    return this.request("create_draft", { to, subject, body, ...options });
  }

  /**
   * Create a draft reply to an existing thread.
   * @param {string} threadId - The thread ID to reply to
   * @param {string} body - Reply body
   * @param {boolean} replyAll - Whether to reply all
   * @param {object} options - Additional options
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async createDraftReply(threadId, body, replyAll = false, options = {}) {
    return this.request("create_draft_reply", {
      threadId,
      body,
      replyAll,
      ...options,
    });
  }

  /**
   * Update an existing draft.
   * @param {string} draftId - The draft ID
   * @param {string} to - Recipient email
   * @param {string} subject - Email subject
   * @param {string} body - Email body
   * @param {object} options - Additional options
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async updateDraft(draftId, to, subject, body, options = {}) {
    return this.request("update_draft", {
      draftId,
      to,
      subject,
      body,
      ...options,
    });
  }

  /**
   * Get a specific draft by ID.
   * @param {string} draftId - The draft ID
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async getDraft(draftId) {
    return this.request("get_draft", { draftId });
  }

  /**
   * List all drafts.
   * @param {number} limit - Maximum drafts to return
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async listDrafts(limit = 25) {
    return this.request("list_drafts", { limit });
  }

  /**
   * Delete a draft.
   * @param {string} draftId - The draft ID
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async deleteDraft(draftId) {
    return this.request("delete_draft", { draftId });
  }

  /**
   * Send an existing draft.
   * @param {string} draftId - The draft ID
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async sendDraft(draftId) {
    return this.request("send_draft", { draftId });
  }

  /**
   * Send an email immediately.
   * @param {string} to - Recipient email
   * @param {string} subject - Email subject
   * @param {string} body - Email body
   * @param {object} options - Additional options
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async sendEmail(to, subject, body, options = {}) {
    return this.request("send_email", { to, subject, body, ...options });
  }

  /**
   * Reply to a thread immediately.
   * @param {string} threadId - The thread ID
   * @param {string} body - Reply body
   * @param {boolean} replyAll - Whether to reply all
   * @param {object} options - Additional options
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async replyToThread(threadId, body, replyAll = false, options = {}) {
    return this.request("reply_to_thread", {
      threadId,
      body,
      replyAll,
      ...options,
    });
  }

  /**
   * Mark a thread as read.
   * @param {string} threadId - The thread ID
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async markRead(threadId) {
    return this.request("mark_read", { threadId });
  }

  /**
   * Mark a thread as unread.
   * @param {string} threadId - The thread ID
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async markUnread(threadId) {
    return this.request("mark_unread", { threadId });
  }

  /**
   * Move a thread to trash.
   * @param {string} threadId - The thread ID
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async moveToTrash(threadId) {
    return this.request("move_to_trash", { threadId });
  }

  /**
   * Archive a thread.
   * @param {string} threadId - The thread ID
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async moveToArchive(threadId) {
    return this.request("move_to_archive", { threadId });
  }

  /**
   * Move a thread to inbox.
   * @param {string} threadId - The thread ID
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async moveToInbox(threadId) {
    return this.request("move_to_inbox", { threadId });
  }

  /**
   * Get mailbox statistics.
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async getMailboxStats() {
    return this.request("get_mailbox_stats");
  }
}

module.exports = new GmailBridge();
module.exports.GmailBridge = GmailBridge;
module.exports.prepareAttachment = prepareAttachment;
module.exports.parseAttachment = parseAttachment;
module.exports.handleAttachments = handleAttachments;
module.exports.MAX_TOTAL_ATTACHMENT_SIZE = MAX_TOTAL_ATTACHMENT_SIZE;

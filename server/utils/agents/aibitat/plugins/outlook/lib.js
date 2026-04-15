const fs = require("fs");
const path = require("path");
const os = require("os");
const mime = require("mime");
const { SystemSettings } = require("../../../../../models/systemSettings");
const { CollectorApi } = require("../../../../collectorApi");
const { humanFileSize } = require("../../../../helpers");
const { safeJsonParse } = require("../../../../http");

const MAX_TOTAL_ATTACHMENT_SIZE = 25 * 1024 * 1024; // 25MB limit for Outlook

/**
 * Parses a comma-separated email string into Graph API recipient format.
 * @param {string} emailString - Comma-separated email addresses
 * @returns {Array<{emailAddress: {address: string}}>}
 */
function parseEmailRecipients(emailString) {
  if (!emailString) return [];
  return emailString.split(",").map((email) => ({
    emailAddress: { address: email.trim() },
  }));
}

/**
 * Validates organization auth type configuration.
 * @param {Object} config - The Outlook configuration object
 * @returns {{valid: boolean, error?: string}}
 */
function validateOrganizationAuth(config) {
  const authType = config.authType || AUTH_TYPES.common;
  if (authType === AUTH_TYPES.organization && !config.tenantId) {
    return {
      valid: false,
      error: "Tenant ID is required for organization-only authentication.",
    };
  }
  return { valid: true };
}

/**
 * Maps a Microsoft Graph message object to a simplified format.
 * @param {Object} msg - The Graph API message object
 * @param {Object} options - Mapping options
 * @param {boolean} options.includeBody - Include full body content
 * @param {boolean} options.includeAttachments - Include attachment details
 * @returns {Object} Simplified message object
 */
function mapGraphMessage(msg, options = {}) {
  const base = {
    id: msg.id,
    conversationId: msg.conversationId,
    subject: msg.subject,
    from: msg.from?.emailAddress?.address || "Unknown",
    fromName: msg.from?.emailAddress?.name || "",
    to: msg.toRecipients?.map((r) => r.emailAddress?.address).join(", ") || "",
    cc: msg.ccRecipients?.map((r) => r.emailAddress?.address).join(", ") || "",
    isRead: msg.isRead,
    hasAttachments: msg.hasAttachments,
  };

  if (msg.receivedDateTime) {
    base.receivedDateTime = msg.receivedDateTime;
  }
  if (msg.bodyPreview !== undefined) {
    base.preview = msg.bodyPreview;
  }

  if (options.includeBody && msg.body) {
    base.date = msg.receivedDateTime;
    base.body = msg.body?.content || "";
    base.bodyType = msg.body?.contentType || "text";
  }

  if (options.includeAttachments && msg.attachments) {
    base.attachments = (msg.attachments || []).map((att) => ({
      id: att.id,
      name: att.name,
      contentType: att.contentType,
      size: att.size,
      contentBytes: att.contentBytes,
    }));
  }

  return base;
}

/**
 * Formats an array of messages into a human-readable summary string.
 * @param {Array} messages - Array of simplified message objects
 * @returns {string} Formatted summary
 */
function formatMessageSummary(messages) {
  return messages
    .map(
      (m, i) =>
        `${i + 1}. [${m.isRead ? "READ" : "UNREAD"}] "${m.subject}" from ${m.fromName || m.from} (${new Date(m.receivedDateTime).toLocaleString()})${m.hasAttachments ? " 📎" : ""}\n   ID: ${m.id}\n   Conversation ID: ${m.conversationId}`
    )
    .join("\n\n");
}

/**
 * Handles errors in Outlook skill handlers with consistent logging and messaging.
 * @param {Object} context - The handler context (this) from the aibitat function
 * @param {string} skillName - The name of the skill (e.g., "outlook-get-inbox")
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
function handleSkillError(context, skillName, error) {
  context.super.handlerProps.log(`${skillName} error: ${error.message}`);
  context.super.introspect(`Error: ${error.message}`);
  return `Error in ${skillName}: ${error.message}`;
}

/**
 * Normalizes a token expiry value to a number.
 * @param {number|string|null|undefined} expiry - The token expiry value
 * @returns {number|null} The normalized expiry as a number, or null if invalid
 */
function normalizeTokenExpiry(expiry) {
  if (expiry === null || expiry === undefined) return null;
  return typeof expiry === "number" ? expiry : parseInt(expiry, 10);
}

/**
 * Prepares and validates attachments for email sending/drafting.
 * @param {Object} context - The handler context with introspect and caller
 * @param {Array<string>} attachmentPaths - Array of absolute file paths
 * @param {Object} options - Options for attachment handling
 * @param {boolean} options.requireApprovalPerFile - Request approval for each file
 * @param {string} options.recipientInfo - Recipient info for approval message
 * @returns {Promise<{success: boolean, attachments?: Array, summaries?: Array, totalSize?: number, error?: string}>}
 */
async function prepareAttachmentsWithValidation(
  context,
  attachmentPaths,
  options = {}
) {
  if (!Array.isArray(attachmentPaths) || attachmentPaths.length === 0) {
    return { success: true, attachments: [], summaries: [], totalSize: 0 };
  }

  const preparedAttachments = [];
  const attachmentSummaries = [];
  let totalAttachmentSize = 0;

  context.super.introspect(
    `${context.caller}: Validating ${attachmentPaths.length} attachment(s)...`
  );

  for (const filePath of attachmentPaths) {
    const result = prepareAttachment(filePath);
    if (!result.success) {
      context.super.introspect(
        `${context.caller}: Attachment validation failed - ${result.error}`
      );
      return { success: false, error: result.error };
    }

    totalAttachmentSize += result.fileInfo.size;
    if (totalAttachmentSize > MAX_TOTAL_ATTACHMENT_SIZE) {
      const totalFormatted = humanFileSize(totalAttachmentSize, true);
      context.super.introspect(
        `${context.caller}: Total attachment size (${totalFormatted}) exceeds 25MB limit`
      );
      return {
        success: false,
        error: `Total attachment size (${totalFormatted}) exceeds the 25MB limit.`,
      };
    }

    if (options.requireApprovalPerFile && context.super.requestToolApproval) {
      const approval = await context.super.requestToolApproval({
        skillName: context.name,
        payload: {
          fileName: result.fileInfo.name,
          fileSize: result.fileInfo.sizeFormatted,
          filePath: result.fileInfo.path,
        },
        description:
          `Attach file "${result.fileInfo.name}" (${result.fileInfo.sizeFormatted}) to email? ` +
          `This file will be sent to ${options.recipientInfo || "recipients"}.`,
      });

      if (!approval.approved) {
        context.super.introspect(
          `${context.caller}: User rejected attaching "${result.fileInfo.name}"`
        );
        return {
          success: false,
          error: `Attachment rejected by user: ${result.fileInfo.name}. ${approval.message || ""}`,
        };
      }
    }

    preparedAttachments.push(result.attachment);
    attachmentSummaries.push(
      `${result.fileInfo.name} (${result.fileInfo.sizeFormatted})`
    );
    context.super.introspect(
      `${context.caller}: Prepared attachment "${result.fileInfo.name}"`
    );
  }

  return {
    success: true,
    attachments: preparedAttachments,
    summaries: attachmentSummaries,
    totalSize: totalAttachmentSize,
  };
}

// ============================================================================
// Attachment Functions
// ============================================================================

/**
 * Validates and prepares a file attachment for email.
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
        "@odata.type": "#microsoft.graph.fileAttachment",
        name: fileName,
        contentType,
        contentBytes: base64Data,
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
 * @param {Object} attachment - The attachment object with name, contentType, size, contentBytes (base64)
 * @returns {Promise<{success: boolean, content: string|null, error: string|null}>}
 */
async function parseAttachment(attachment) {
  const tempDir = os.tmpdir();
  const safeFilename = attachment.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const tempFilePath = path.join(
    tempDir,
    `outlook-attachment-${Date.now()}-${safeFilename}`
  );

  try {
    const buffer = Buffer.from(attachment.contentBytes, "base64");
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
 * MIME types that can be parsed by the collector to extract text content.
 * These are a subset of ACCEPTED_MIMES from collector/utils/constants.js
 * that are suitable for attachment parsing (excludes audio/video and images).
 * Images are excluded because they're typically signature images in emails.
 */
const PARSEABLE_ATTACHMENT_MIMES = [
  "text/plain",
  "text/html",
  "text/csv",
  "application/json",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.oasis.opendocument.text", // .odt
  "application/vnd.oasis.opendocument.presentation", // .odp
  "application/pdf",
  "application/epub+zip",
];

/**
 * Checks if an attachment's MIME type can be parsed for text extraction.
 * @param {string} contentType - The MIME type of the attachment
 * @returns {boolean}
 */
function isParseableMimeType(contentType) {
  if (!contentType) return false;
  const baseMime = contentType.split(";")[0].trim().toLowerCase();
  return PARSEABLE_ATTACHMENT_MIMES.includes(baseMime);
}

/**
 * Collect attachments from messages and optionally parse them with user approval.
 * Only attachments with parseable MIME types will be offered for parsing.
 * If two attachments have the same name, only the first one will be kept (handling fwd emails)
 * @param {Object} context - The handler context (this) from the aibitat function
 * @param {Array} messages - Array of message objects
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

  const parseableAttachments = allAttachments.filter((att) =>
    isParseableMimeType(att.contentType)
  );

  let parsedContent = "";
  const citations = [];
  if (parseableAttachments.length > 0 && context.super.requestToolApproval) {
    const attachmentNames = parseableAttachments
      .map((a) => `${a.name} (${a.contentType})`)
      .join(", ");

    const approval = await context.super.requestToolApproval({
      skillName: context.name,
      payload: { attachments: attachmentNames },
      description: `Download and parse ${parseableAttachments.length} attachment(s) to extract text content? (${attachmentNames})`,
    });

    if (approval.approved) {
      context.super.introspect(
        `${context.caller}: Downloading and parsing ${parseableAttachments.length} attachment(s)...`
      );

      const parsedResults = [];
      for (const attachment of parseableAttachments) {
        if (!attachment.contentBytes) {
          context.super.introspect(
            `${context.caller}: Skipping "${attachment.name}" - no content available`
          );
          continue;
        }
        context.super.introspect(
          `${context.caller}: Parsing "${attachment.name}"...`
        );
        const parseResult = await parseAttachment(attachment);
        if (!parseResult.success) {
          context.super.introspect(
            `${context.caller}: Failed to parse "${attachment.name}": ${parseResult.error}`
          );
          continue;
        }

        citations.push({
          id: `outlook-attachment-${attachment.messageId}-${attachment.name}`,
          title: attachment.name,
          text: parseResult.content,
          chunkSource: "outlook-attachment://" + attachment.name,
          score: null,
        });
        parsedResults.push({
          name: attachment.name,
          messageIndex: attachment.messageIndex,
          ...parseResult,
        });
      }

      if (parsedResults.length > 0) {
        parsedContent =
          "\n\n--- Parsed Attachment Content ---\n" +
          parsedResults
            .map(
              (r) => `\n[Message ${r.messageIndex}: ${r.name}]\n${r.content}`
            )
            .join("\n");
      }

      context.super.introspect(
        `${context.caller}: Finished parsing attachments (${parsedResults.length}/${parseableAttachments.length} successful)`
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
 * Microsoft Graph API OAuth2 Configuration
 * Uses Authorization Code Flow with PKCE
 */
const MICROSOFT_AUTH_URL = "https://login.microsoftonline.com";
const GRAPH_API_URL = "https://graph.microsoft.com/v1.0";
const SCOPES = [
  "offline_access",
  "Mail.Read",
  "Mail.ReadWrite",
  "Mail.Send",
  "User.Read",
].join(" ");

/**
 * Authentication types for Microsoft OAuth2.
 * - "organization": Use tenant ID endpoint (work/school accounts from a specific tenant only)
 * - "common": Use /common endpoint (both personal and work/school accounts)
 * - "consumers": Use /consumers endpoint (personal Microsoft accounts only)
 */
const AUTH_TYPES = {
  organization: "organization",
  common: "common",
  consumers: "consumers",
};

/**
 * Gets the appropriate OAuth2 authority endpoint based on auth type.
 * @param {string} authType - The authentication type
 * @param {string} tenantId - The tenant ID (used only for "organization" type)
 * @returns {string} The authority path segment
 */
function getAuthority(authType, tenantId) {
  switch (authType) {
    case AUTH_TYPES.consumers:
      return "consumers";
    case AUTH_TYPES.organization:
      return tenantId || "common";
    case AUTH_TYPES.common:
    default:
      return "common";
  }
}

/**
 * Outlook Bridge Library
 * Handles OAuth2 authentication and Microsoft Graph API communication for Outlook mail.
 */
class OutlookBridge {
  #accessToken = null;
  #isInitialized = false;

  #log(text, ...args) {
    console.log(`\x1b[35m[OutlookBridge]\x1b[0m ${text}`, ...args);
  }

  /**
   * Decodes a JWT token and logs relevant info.
   * @param {string} token - The JWT token to decode
   * @param {string} context - Context label for logging (e.g., "NEW token", "Token")
   * @returns {Object|null} The decoded payload or null if decoding fails
   */
  #decodeAndLogToken(token, context = "Token") {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
      this.#log(
        `${context} for: ${payload.upn || payload.email || payload.unique_name || "unknown"}`
      );
      return payload;
    } catch {
      this.#log(`Could not decode ${context.toLowerCase()}`);
      return null;
    }
  }

  /**
   * Resets the bridge state, forcing re-initialization on next use.
   */
  reset() {
    this.#accessToken = null;
    this.#isInitialized = false;
  }

  /**
   * Gets the current Outlook agent configuration from system settings.
   * @returns {Promise<{clientId?: string, tenantId?: string, clientSecret?: string, authType?: string, accessToken?: string, refreshToken?: string, tokenExpiry?: number}>}
   */
  static async getConfig() {
    const configJson = await SystemSettings.getValueOrFallback(
      { label: "outlook_agent_config" },
      "{}"
    );
    return safeJsonParse(configJson, {});
  }

  /**
   * Updates the Outlook agent configuration in system settings.
   * @param {Object} updates - Fields to update
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async updateConfig(updates) {
    try {
      await SystemSettings.updateSettings({
        outlook_agent_config: JSON.stringify(updates),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Generates the OAuth2 authorization URL for the user to authenticate.
   * @param {string} redirectUri - The callback URL for OAuth
   * @returns {Promise<{success: boolean, url?: string, error?: string}>}
   */
  async getAuthUrl(redirectUri) {
    const config = await OutlookBridge.getConfig();

    if (!config.clientId) {
      return {
        success: false,
        error: "Outlook configuration incomplete. Please set Client ID.",
      };
    }

    const orgAuth = validateOrganizationAuth(config);
    if (!orgAuth.valid) {
      return { success: false, error: orgAuth.error };
    }

    const authType = config.authType || AUTH_TYPES.common;
    const authority = getAuthority(authType, config.tenantId);
    const params = new URLSearchParams({
      client_id: config.clientId,
      response_type: "code",
      redirect_uri: redirectUri,
      response_mode: "query",
      scope: SCOPES,
      prompt: "consent",
    });

    const url = `${MICROSOFT_AUTH_URL}/${authority}/oauth2/v2.0/authorize?${params.toString()}`;
    this.#log(`Auth URL using authType: ${authType}, authority: ${authority}`);
    return { success: true, url };
  }

  /**
   * Exchanges the authorization code for access and refresh tokens.
   * @param {string} code - The authorization code from OAuth callback
   * @param {string} redirectUri - The callback URL used in the initial auth request
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async exchangeCodeForToken(code, redirectUri) {
    const config = await OutlookBridge.getConfig();

    if (!config.clientId || !config.clientSecret) {
      return {
        success: false,
        error: "Outlook configuration incomplete.",
      };
    }

    const orgAuth = validateOrganizationAuth(config);
    if (!orgAuth.valid) {
      return { success: false, error: orgAuth.error };
    }

    try {
      const authType = config.authType || AUTH_TYPES.common;
      const authority = getAuthority(authType, config.tenantId);
      const tokenUrl = `${MICROSOFT_AUTH_URL}/${authority}/oauth2/v2.0/token`;
      this.#log(
        `Token exchange using authType: ${authType}, authority: ${authority}`
      );

      const params = new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
        scope: SCOPES,
      });

      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        this.#log("Token exchange failed:", data);
        return {
          success: false,
          error:
            data.error_description || data.error || "Token exchange failed",
        };
      }

      const expiresAt = Date.now() + (data.expires_in - 60) * 1000;
      this.#decodeAndLogToken(data.access_token, "NEW token received");
      await OutlookBridge.updateConfig({
        ...config,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        tokenExpiry: expiresAt,
      });

      this.#accessToken = data.access_token;
      this.#isInitialized = false; // Force re-initialization

      this.#log("Successfully obtained tokens");
      return { success: true };
    } catch (error) {
      this.#log("Token exchange error:", error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Refreshes the access token using the refresh token.
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async #refreshAccessToken() {
    const config = await OutlookBridge.getConfig();

    if (!config.clientId || !config.clientSecret || !config.refreshToken) {
      return {
        success: false,
        error: "Cannot refresh token. Missing configuration or refresh token.",
      };
    }

    const orgAuth = validateOrganizationAuth(config);
    if (!orgAuth.valid) {
      return { success: false, error: orgAuth.error };
    }

    try {
      const authType = config.authType || AUTH_TYPES.common;
      const authority = getAuthority(authType, config.tenantId);
      const tokenUrl = `${MICROSOFT_AUTH_URL}/${authority}/oauth2/v2.0/token`;
      this.#log(
        `Token refresh using authType: ${authType}, authority: ${authority}`
      );

      const params = new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: config.refreshToken,
        grant_type: "refresh_token",
        scope: SCOPES,
      });

      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        this.#log("Token refresh failed:", data);
        return {
          success: false,
          error: data.error_description || data.error || "Token refresh failed",
        };
      }

      const expiresAt = Date.now() + (data.expires_in - 60) * 1000;

      await OutlookBridge.updateConfig({
        ...config,
        accessToken: data.access_token,
        refreshToken: data.refresh_token || config.refreshToken,
        tokenExpiry: expiresAt,
      });

      this.#accessToken = data.access_token;

      this.#log("Successfully refreshed access token");
      return { success: true };
    } catch (error) {
      this.#log("Token refresh error:", error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Ensures we have a valid access token, refreshing if necessary.
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async #ensureValidToken() {
    const config = await OutlookBridge.getConfig();

    if (!config.accessToken || !config.tokenExpiry) {
      this.#log("No access token or expiry found in config");
      return {
        success: false,
        error: "Outlook is not authenticated. Please complete the OAuth flow.",
      };
    }

    const expiryTime = normalizeTokenExpiry(config.tokenExpiry);

    const now = Date.now();
    const timeUntilExpiry = expiryTime - now;
    this.#log(
      `Token check: expires in ${Math.round(timeUntilExpiry / 1000)}s (at ${new Date(expiryTime).toISOString()})`
    );

    const payload = this.#decodeAndLogToken(config.accessToken, "Token check");
    if (payload) {
      this.#log(`Token aud: ${payload.aud}`);
      this.#log(`Token scp: ${payload.scp}`);
    }

    if (now >= expiryTime) {
      this.#log("Access token expired, refreshing...");
      return this.#refreshAccessToken();
    }

    this.#accessToken = config.accessToken;
    return { success: true };
  }

  /**
   * Initializes the Outlook bridge by fetching configuration from system settings.
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
            "Outlook integration is not available in multi-user mode for security reasons.",
        };
      }

      const config = await OutlookBridge.getConfig();

      if (!config.clientId || !config.clientSecret) {
        return {
          success: false,
          error:
            "Outlook integration is not configured. Please set Client ID and Client Secret in the agent settings.",
        };
      }

      const orgAuth = validateOrganizationAuth(config);
      if (!orgAuth.valid) {
        return { success: false, error: orgAuth.error };
      }

      this.#log(
        `Initializing with authType: ${config.authType || AUTH_TYPES.common}`
      );

      if (!config.accessToken) {
        return {
          success: false,
          error:
            "Outlook is not authenticated. Please complete the OAuth authorization flow.",
        };
      }

      const tokenResult = await this.#ensureValidToken();
      if (!tokenResult.success) {
        return tokenResult;
      }

      this.#isInitialized = true;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Checks if the Outlook bridge is properly configured and available.
   * @returns {Promise<boolean>}
   */
  async isAvailable() {
    const result = await this.initialize();
    return result.success;
  }

  /**
   * Checks if Outlook tools are available (not in multi-user mode and has configuration).
   * @returns {Promise<boolean>}
   */
  static async isToolAvailable() {
    const isMultiUser = await SystemSettings.isMultiUserMode();
    if (isMultiUser) return false;

    const config = await OutlookBridge.getConfig();

    if (!config.clientId || !config.clientSecret || !config.accessToken) {
      return false;
    }

    const orgAuth = validateOrganizationAuth(config);
    return orgAuth.valid;
  }

  /**
   * Makes a request to the Microsoft Graph API.
   * @param {string} endpoint - The API endpoint (relative to /v1.0)
   * @param {object} options - Fetch options
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async request(endpoint, options = {}) {
    const initResult = await this.initialize();
    if (!initResult.success) {
      this.#log(`Initialize failed: ${initResult.error}`);
      return { success: false, error: initResult.error };
    }

    const tokenResult = await this.#ensureValidToken();
    if (!tokenResult.success) {
      this.#log(`Token validation failed: ${tokenResult.error}`);
      return { success: false, error: tokenResult.error };
    }

    try {
      const url = endpoint.startsWith("http")
        ? endpoint
        : `${GRAPH_API_URL}${endpoint}`;

      this.#log(`Making request to: ${url}`);

      const response = await fetch(url, {
        ...options,
        headers: {
          Authorization: `Bearer ${this.#accessToken}`,
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData = {};
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { raw: errorText };
        }
        this.#log(
          `API request failed: ${response.status} ${response.statusText}`,
          `\n  Endpoint: ${endpoint}`,
          `\n  Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`,
          `\n  Error: ${JSON.stringify(errorData, null, 2)}`
        );
        return {
          success: false,
          error:
            errorData.error?.message ||
            `Request failed with status ${response.status}`,
        };
      }

      // Handle responses with no content (204 No Content, 202 Accepted with empty body, etc.)
      if (response.status === 204 || response.status === 202) {
        return { success: true, data: {} };
      }

      const text = await response.text();
      if (!text || text.trim() === "") {
        return { success: true, data: {} };
      }

      const data = JSON.parse(text);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: `Outlook API request failed: ${error.message}`,
      };
    }
  }

  /**
   * Search emails using OData filter syntax.
   * Note: Microsoft Graph API does not support $skip with $search, so pagination
   * is only available when no query is provided.
   * @param {string} query - Search query (uses Microsoft Search syntax)
   * @param {number} limit - Maximum results to return
   * @param {number} skip - Number of results to skip for pagination (ignored when query is provided)
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async search(query = "", limit = 10, skip = 0) {
    let endpoint;

    if (query) {
      // $skip is not supported with $search in Microsoft Graph API
      // $orderby is also not supported with $search - results are ordered by relevance
      endpoint = `/me/messages?$top=${limit}&$select=id,subject,from,toRecipients,ccRecipients,receivedDateTime,isRead,hasAttachments,bodyPreview,conversationId&$search="${encodeURIComponent(query)}"`;
    } else {
      endpoint = `/me/messages?$top=${limit}&$skip=${skip}&$orderby=receivedDateTime desc&$select=id,subject,from,toRecipients,ccRecipients,receivedDateTime,isRead,hasAttachments,bodyPreview,conversationId`;
    }

    const result = await this.request(endpoint);
    if (!result.success) return result;

    const messages = result.data.value || [];
    return {
      success: true,
      data: {
        messages: messages.map((msg) => mapGraphMessage(msg)),
        resultCount: messages.length,
        hasMore: !!result.data["@odata.nextLink"],
      },
    };
  }

  /**
   * Get inbox messages (only from the Inbox folder, not archived/other folders).
   * @param {number} limit - Maximum results to return
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async getInbox(limit = 25) {
    const endpoint = `/me/mailFolders/inbox/messages?$top=${limit}&$orderby=receivedDateTime desc&$select=id,subject,from,toRecipients,ccRecipients,receivedDateTime,isRead,hasAttachments,bodyPreview,conversationId`;

    const result = await this.request(endpoint);
    if (!result.success) return result;

    const messages = result.data.value || [];
    return {
      success: true,
      data: {
        messages: messages.map((msg) => mapGraphMessage(msg)),
        resultCount: messages.length,
        hasMore: !!result.data["@odata.nextLink"],
      },
    };
  }

  /**
   * Read a full conversation thread by conversation ID.
   * Note: We avoid combining $filter with $orderby due to Microsoft Graph API
   * "InefficientFilter" errors. Instead, we fetch without orderby and sort client-side.
   * @param {string} conversationId - The conversation ID
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async readThread(conversationId) {
    const endpoint = `/me/messages?$filter=conversationId eq '${conversationId}'&$select=id,subject,from,toRecipients,ccRecipients,receivedDateTime,isRead,hasAttachments,body,attachments&$expand=attachments`;

    const result = await this.request(endpoint);
    if (!result.success) return result;

    let messages = result.data.value || [];
    if (messages.length === 0) {
      return {
        success: false,
        error: "No messages found in this conversation.",
      };
    }

    // Sort by receivedDateTime ascending (oldest first) client-side
    messages.sort(
      (a, b) => new Date(a.receivedDateTime) - new Date(b.receivedDateTime)
    );

    return {
      success: true,
      data: {
        conversationId,
        subject: messages[0]?.subject || "No Subject",
        messageCount: messages.length,
        messages: messages.map((msg) =>
          mapGraphMessage(msg, { includeBody: true, includeAttachments: true })
        ),
      },
    };
  }

  /**
   * Read a single message by ID.
   * @param {string} messageId - The message ID
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async readMessage(messageId) {
    const endpoint = `/me/messages/${messageId}?$select=id,subject,from,toRecipients,ccRecipients,receivedDateTime,isRead,hasAttachments,body,conversationId&$expand=attachments`;

    const result = await this.request(endpoint);
    if (!result.success) return result;

    return {
      success: true,
      data: mapGraphMessage(result.data, {
        includeBody: true,
        includeAttachments: true,
      }),
    };
  }

  /**
   * Create a new draft email.
   * @param {string} to - Recipient email
   * @param {string} subject - Email subject
   * @param {string} body - Email body
   * @param {object} options - Additional options (cc, bcc, isHtml, attachments)
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async createDraft(to, subject, body, options = {}) {
    const message = {
      subject,
      body: {
        contentType: options.isHtml ? "HTML" : "Text",
        content: body,
      },
      toRecipients: parseEmailRecipients(to),
    };

    if (options.cc) {
      message.ccRecipients = parseEmailRecipients(options.cc);
    }

    if (options.bcc) {
      message.bccRecipients = parseEmailRecipients(options.bcc);
    }

    const result = await this.request("/me/messages", {
      method: "POST",
      body: JSON.stringify(message),
    });

    if (!result.success) return result;

    const draftId = result.data.id;

    if (options.attachments && options.attachments.length > 0) {
      for (const attachment of options.attachments) {
        const attachResult = await this.request(
          `/me/messages/${draftId}/attachments`,
          {
            method: "POST",
            body: JSON.stringify(attachment),
          }
        );
        if (!attachResult.success) {
          this.#log(`Failed to add attachment: ${attachResult.error}`);
        }
      }
    }

    return {
      success: true,
      data: {
        draftId: result.data.id,
        subject: result.data.subject,
        to,
        webLink: result.data.webLink,
      },
    };
  }

  /**
   * Create a draft reply to an existing message.
   * @param {string} messageId - The message ID to reply to
   * @param {string} body - Reply body
   * @param {boolean} replyAll - Whether to reply all
   * @param {object} options - Additional options
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async createDraftReply(messageId, body, replyAll = false, _options = {}) {
    const endpoint = replyAll
      ? `/me/messages/${messageId}/createReplyAll`
      : `/me/messages/${messageId}/createReply`;

    const result = await this.request(endpoint, {
      method: "POST",
      body: JSON.stringify({
        comment: body,
      }),
    });

    if (!result.success) return result;

    return {
      success: true,
      data: {
        draftId: result.data.id,
        subject: result.data.subject,
        webLink: result.data.webLink,
      },
    };
  }

  /**
   * Get a specific draft by ID.
   * @param {string} draftId - The draft ID
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async getDraft(draftId) {
    return this.readMessage(draftId);
  }

  /**
   * List all drafts.
   * @param {number} limit - Maximum drafts to return
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async listDrafts(limit = 25) {
    const endpoint = `/me/mailFolders/drafts/messages?$top=${limit}&$orderby=lastModifiedDateTime desc&$select=id,subject,toRecipients,lastModifiedDateTime,bodyPreview`;

    const result = await this.request(endpoint);
    if (!result.success) return result;

    const drafts = result.data.value || [];
    return {
      success: true,
      data: {
        drafts: drafts.map((draft) => ({
          id: draft.id,
          subject: draft.subject,
          to:
            draft.toRecipients
              ?.map((r) => r.emailAddress?.address)
              .join(", ") || "",
          lastModified: draft.lastModifiedDateTime,
          preview: draft.bodyPreview,
        })),
        count: drafts.length,
      },
    };
  }

  /**
   * Update an existing draft.
   * @param {string} draftId - The draft ID
   * @param {object} updates - Fields to update
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async updateDraft(draftId, updates) {
    const message = {};

    if (updates.subject) message.subject = updates.subject;
    if (updates.body) {
      message.body = {
        contentType: updates.isHtml ? "HTML" : "Text",
        content: updates.body,
      };
    }
    if (updates.to) {
      message.toRecipients = parseEmailRecipients(updates.to);
    }
    if (updates.cc) {
      message.ccRecipients = parseEmailRecipients(updates.cc);
    }

    const result = await this.request(`/me/messages/${draftId}`, {
      method: "PATCH",
      body: JSON.stringify(message),
    });

    if (!result.success) return result;

    return {
      success: true,
      data: {
        draftId: result.data.id,
        subject: result.data.subject,
      },
    };
  }

  /**
   * Delete a draft.
   * @param {string} draftId - The draft ID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async deleteDraft(draftId) {
    return this.request(`/me/messages/${draftId}`, {
      method: "DELETE",
    });
  }

  /**
   * Send an existing draft.
   * @param {string} draftId - The draft ID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async sendDraft(draftId) {
    return this.request(`/me/messages/${draftId}/send`, {
      method: "POST",
    });
  }

  /**
   * Send an email immediately.
   * @param {string} to - Recipient email
   * @param {string} subject - Email subject
   * @param {string} body - Email body
   * @param {object} options - Additional options
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async sendEmail(to, subject, body, options = {}) {
    const message = {
      subject,
      body: {
        contentType: options.isHtml ? "HTML" : "Text",
        content: body,
      },
      toRecipients: parseEmailRecipients(to),
    };

    if (options.cc) {
      message.ccRecipients = parseEmailRecipients(options.cc);
    }

    if (options.bcc) {
      message.bccRecipients = parseEmailRecipients(options.bcc);
    }

    if (options.attachments && options.attachments.length > 0) {
      message.attachments = options.attachments;
    }

    return this.request("/me/sendMail", {
      method: "POST",
      body: JSON.stringify({
        message,
        saveToSentItems: true,
      }),
    });
  }

  /**
   * Reply to a message immediately.
   * @param {string} messageId - The message ID to reply to
   * @param {string} body - Reply body
   * @param {boolean} replyAll - Whether to reply all
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async replyToMessage(messageId, body, replyAll = false) {
    const endpoint = replyAll
      ? `/me/messages/${messageId}/replyAll`
      : `/me/messages/${messageId}/reply`;

    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify({
        comment: body,
      }),
    });
  }

  /**
   * Mark a message as read.
   * @param {string} messageId - The message ID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async markRead(messageId) {
    return this.request(`/me/messages/${messageId}`, {
      method: "PATCH",
      body: JSON.stringify({ isRead: true }),
    });
  }

  /**
   * Mark a message as unread.
   * @param {string} messageId - The message ID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async markUnread(messageId) {
    return this.request(`/me/messages/${messageId}`, {
      method: "PATCH",
      body: JSON.stringify({ isRead: false }),
    });
  }

  /**
   * Move a message to trash.
   * @param {string} messageId - The message ID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async moveToTrash(messageId) {
    return this.request(`/me/messages/${messageId}/move`, {
      method: "POST",
      body: JSON.stringify({
        destinationId: "deleteditems",
      }),
    });
  }

  /**
   * Get mailbox folder statistics.
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async getMailboxStats() {
    const folders = ["inbox", "drafts", "sentitems", "deleteditems"];
    const stats = {};

    for (const folder of folders) {
      const result = await this.request(
        `/me/mailFolders/${folder}?$select=displayName,totalItemCount,unreadItemCount`
      );
      if (result.success) {
        stats[folder] = {
          name: result.data.displayName,
          total: result.data.totalItemCount,
          unread: result.data.unreadItemCount,
        };
      }
    }

    const profileResult = await this.request("/me?$select=displayName,mail");

    return {
      success: true,
      data: {
        email: profileResult.data?.mail || "Unknown",
        displayName: profileResult.data?.displayName || "Unknown",
        folders: stats,
      },
    };
  }
}

module.exports = new OutlookBridge();
module.exports.OutlookBridge = OutlookBridge;
module.exports.prepareAttachment = prepareAttachment;
module.exports.parseAttachment = parseAttachment;
module.exports.handleAttachments = handleAttachments;
module.exports.isParseableMimeType = isParseableMimeType;
module.exports.PARSEABLE_ATTACHMENT_MIMES = PARSEABLE_ATTACHMENT_MIMES;
module.exports.MAX_TOTAL_ATTACHMENT_SIZE = MAX_TOTAL_ATTACHMENT_SIZE;
module.exports.AUTH_TYPES = AUTH_TYPES;
module.exports.formatMessageSummary = formatMessageSummary;
module.exports.mapGraphMessage = mapGraphMessage;
module.exports.parseEmailRecipients = parseEmailRecipients;
module.exports.validateOrganizationAuth = validateOrganizationAuth;
module.exports.prepareAttachmentsWithValidation =
  prepareAttachmentsWithValidation;
module.exports.handleSkillError = handleSkillError;
module.exports.normalizeTokenExpiry = normalizeTokenExpiry;

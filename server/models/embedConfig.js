const { v4 } = require("uuid");
const prisma = require("../utils/prisma");
const { VALID_CHAT_MODE } = require("../utils/chats/stream");

const EmbedConfig = {
  writable: [
    // Used for generic updates so we can validate keys in request body
    "enabled",
    "allowlist_domains",
    "allow_model_override",
    "allow_temperature_override",
    "allow_prompt_override",
    "max_chats_per_day",
    "max_chats_per_session",
    "chat_mode",
    "workspace_id",
    "message_limit",
    "chat_retention_days",
    "visual_config",
  ],

  new: async function (data, creatorId = null) {
    try {
      const embed = await prisma.embed_configs.create({
        data: {
          uuid: v4(),
          enabled: true,
          chat_mode: validatedCreationData(data?.chat_mode, "chat_mode"),
          allowlist_domains: validatedCreationData(
            data?.allowlist_domains,
            "allowlist_domains"
          ),
          allow_model_override: validatedCreationData(
            data?.allow_model_override,
            "allow_model_override"
          ),
          allow_temperature_override: validatedCreationData(
            data?.allow_temperature_override,
            "allow_temperature_override"
          ),
          allow_prompt_override: validatedCreationData(
            data?.allow_prompt_override,
            "allow_prompt_override"
          ),
          max_chats_per_day: validatedCreationData(
            data?.max_chats_per_day,
            "max_chats_per_day"
          ),
          max_chats_per_session: validatedCreationData(
            data?.max_chats_per_session,
            "max_chats_per_session"
          ),
          message_limit: validatedCreationData(
            data?.message_limit,
            "message_limit"
          ),
          chat_retention_days: validatedCreationData(
            data?.chat_retention_days,
            "chat_retention_days"
          ),
          visual_config: validatedCreationData(
            data?.visual_config,
            "visual_config"
          ),
          createdBy: Number(creatorId) ?? null,
          workspace: {
            connect: { id: Number(data.workspace_id) },
          },
        },
      });
      return { embed, message: null };
    } catch (error) {
      console.error(error.message);
      return { embed: null, message: error.message };
    }
  },

  update: async function (embedId = null, data = {}) {
    if (!embedId) throw new Error("No embed id provided for update");
    const validKeys = Object.keys(data).filter((key) =>
      this.writable.includes(key)
    );
    if (validKeys.length === 0)
      return { embed: { id }, message: "No valid fields to update!" };

    const updates = {};
    validKeys.map((key) => {
      updates[key] = validatedCreationData(data[key], key);
    });

    // DSGVO: Track when retention was activated so cleanup doesn't delete retroactively.
    // Only set retention_started_at when retention is being enabled (changed from null to a value).
    if ("chat_retention_days" in updates) {
      const newRetention = updates.chat_retention_days;
      if (newRetention && newRetention > 0) {
        // Check if retention was previously not set
        const current = await prisma.embed_configs.findFirst({
          where: { id: Number(embedId) },
          select: { chat_retention_days: true, retention_started_at: true },
        });
        // Only set start date if retention is new or was previously disabled
        if (!current?.chat_retention_days || !current?.retention_started_at) {
          updates.retention_started_at = new Date();
        }
      } else {
        // Retention disabled — clear the start date
        updates.retention_started_at = null;
      }
    }

    try {
      await prisma.embed_configs.update({
        where: { id: Number(embedId) },
        data: updates,
      });
      return { success: true, error: null };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  },

  get: async function (clause = {}) {
    try {
      const embedConfig = await prisma.embed_configs.findFirst({
        where: clause,
      });

      return embedConfig || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  getWithWorkspace: async function (clause = {}) {
    try {
      const embedConfig = await prisma.embed_configs.findFirst({
        where: clause,
        include: {
          workspace: true,
        },
      });

      return embedConfig || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.embed_configs.delete({
        where: clause,
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  where: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const results = await prisma.embed_configs.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return results;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  whereWithWorkspace: async function (
    clause = {},
    limit = null,
    orderBy = null
  ) {
    try {
      const results = await prisma.embed_configs.findMany({
        where: clause,
        include: {
          workspace: true,
          _count: {
            select: { embed_chats: true },
          },
        },
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return results;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  getVisualConfig: async function (uuid) {
    try {
      const embed = await prisma.embed_configs.findFirst({
        where: { uuid },
        select: { visual_config: true },
      });
      if (!embed || !embed.visual_config) return {};
      return JSON.parse(embed.visual_config);
    } catch (error) {
      console.error(error.message);
      return {};
    }
  },

  // Will return null if process should be skipped
  // an empty array means the system will check. This
  // prevents a bad parse from allowing all requests
  parseAllowedHosts: function (embed) {
    if (!embed.allowlist_domains) return null;

    try {
      return JSON.parse(embed.allowlist_domains);
    } catch {
      console.error(`Failed to parse allowlist_domains for Embed ${embed.id}!`);
      return [];
    }
  },
};

const BOOLEAN_KEYS = [
  "allow_model_override",
  "allow_temperature_override",
  "allow_prompt_override",
  "enabled",
];

const NUMBER_KEYS = [
  "max_chats_per_day",
  "max_chats_per_session",
  "workspace_id",
  "message_limit",
  "chat_retention_days",
];

// Helper to validate a data object strictly into the proper format
function validatedCreationData(value, field) {
  if (field === "chat_mode") {
    if (!value || !VALID_CHAT_MODE.includes(value)) return "query";
    return value;
  }

  if (field === "allowlist_domains") {
    try {
      if (!value) return null;
      return JSON.stringify(
        // Iterate and force all domains to URL object
        // and stringify the result.
        value
          .split(",")
          .map((input) => {
            let url = input;
            if (!url.includes("http://") && !url.includes("https://"))
              url = `https://${url}`;
            try {
              new URL(url);
              return url;
            } catch {
              return null;
            }
          })
          .filter((u) => !!u)
      );
    } catch {
      return null;
    }
  }

  if (BOOLEAN_KEYS.includes(field)) {
    return value === true || value === false ? value : false;
  }

  if (NUMBER_KEYS.includes(field)) {
    return isNaN(value) || Number(value) <= 0 ? null : Number(value);
  }

  if (field === "visual_config") {
    try {
      if (!value) return null;
      if (typeof value === "string") {
        JSON.parse(value); // validate
        return value;
      }
      return JSON.stringify(value);
    } catch {
      return null;
    }
  }

  return null;
}

module.exports = { EmbedConfig };

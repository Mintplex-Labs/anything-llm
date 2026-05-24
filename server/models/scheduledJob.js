const prisma = require("../utils/prisma");
const later = require("@breejs/later");
const cronValidate = require("cron-validate").default;

// Use UTC time for cron interpretation. This ensures consistent behavior
// regardless of server timezone (e.g., when running in containers).
// The frontend is responsible for converting user's local time to UTC
// when creating/editing schedules, and converting UTC back to local time
// when displaying.
later.date.UTC();

const ScheduledJob = {
  writable: ["name", "prompt", "tools", "schedule", "enabled"],

  /**
   * Maximum number of scheduled jobs that can be enabled at once.
   * null = no limit. Set to a positive integer to cap concurrent active jobs;
   * attempting to enable a job past the cap will be rejected at the API layer.
   * @todo: add a configuration option for this
   * @type {number|null}
   */
  MAX_ACTIVE: null,

  /**
   * Compute the next run time from a cron expression.
   * Uses @breejs/later which is already available via Bree.
   * @param {string} cronExpression
   * @returns {Date|null}
   */
  computeNextRunAt: function (cronExpression) {
    try {
      const sched = later.parse.cron(cronExpression);
      const next = later.schedule(sched).next(1);
      return next || null;
    } catch (error) {
      console.error(
        "Failed to compute next run time from cron:",
        error.message
      );
      return null;
    }
  },

  /**
   * Validate a cron expression.
   * Uses cron-validate which is already available via Bree.
   * @param {string} cronExpression
   * @returns {boolean}
   */
  isValidCron: function (cronExpression) {
    try {
      return cronValidate(cronExpression).isValid();
    } catch {
      return false;
    }
  },

  create: async function ({ name, prompt, tools = null, schedule } = {}) {
    try {
      const nextRunAt = this.computeNextRunAt(schedule);
      const job = await prisma.scheduled_jobs.create({
        data: {
          name: String(name),
          prompt: String(prompt),
          tools: tools ? JSON.stringify(tools) : null,
          schedule: String(schedule),
          nextRunAt,
        },
      });
      return { job, error: null };
    } catch (error) {
      console.error("Failed to create scheduled job:", error.message);
      return { job: null, error: error.message };
    }
  },

  update: async function (id, data = {}) {
    try {
      const updates = {};
      for (const key of this.writable) {
        if (data.hasOwnProperty(key)) {
          if (key === "tools") {
            updates[key] = data[key] ? JSON.stringify(data[key]) : null;
          } else {
            updates[key] = data[key];
          }
        }
      }

      // Recompute nextRunAt if schedule changed
      if (updates.schedule) {
        updates.nextRunAt = this.computeNextRunAt(updates.schedule);
      }

      updates.updatedAt = new Date();

      const job = await prisma.scheduled_jobs.update({
        where: { id: Number(id) },
        data: updates,
      });
      return { job, error: null };
    } catch (error) {
      console.error("Failed to update scheduled job:", error.message);
      return { job: null, error: error.message };
    }
  },

  get: async function (clause = {}) {
    try {
      const job = await prisma.scheduled_jobs.findFirst({ where: clause });
      return job || null;
    } catch (error) {
      console.error("Failed to get scheduled job:", error.message);
      return null;
    }
  },

  where: async function (
    clause = {},
    limit = null,
    orderBy = null,
    include = {}
  ) {
    try {
      const results = await prisma.scheduled_jobs.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null
          ? { orderBy }
          : { orderBy: { createdAt: "desc" } }),
        ...(Object.keys(include).length > 0 ? { include } : {}),
      });
      return results;
    } catch (error) {
      console.error("Failed to query scheduled jobs:", error.message);
      return [];
    }
  },

  delete: async function (id) {
    try {
      await prisma.scheduled_jobs.delete({ where: { id: Number(id) } });
      return true;
    } catch (error) {
      console.error("Failed to delete scheduled job:", error.message);
      return false;
    }
  },

  allEnabled: async function () {
    try {
      return await prisma.scheduled_jobs.findMany({
        where: { enabled: true },
      });
    } catch (error) {
      console.error("Failed to get enabled scheduled jobs:", error.message);
      return [];
    }
  },

  /**
   * Count enabled scheduled jobs, optionally excluding a single job by id.
   * `excludeId` is used by canActivate so that re-saving an already-enabled job
   * is not double-counted against the limit.
   * @param {number|null} excludeId
   * @returns {Promise<number>}
   */
  countActive: async function (excludeId = null) {
    try {
      return await prisma.scheduled_jobs.count({
        where: {
          enabled: true,
          ...(excludeId != null ? { NOT: { id: Number(excludeId) } } : {}),
        },
      });
    } catch (error) {
      console.error("Failed to count active scheduled jobs:", error.message);
      return 0;
    }
  },

  /**
   * Check whether a job can be activated without exceeding MAX_ACTIVE.
   * Pass `excludeId` when re-saving an existing job to avoid counting it twice.
   * @param {{ excludeId?: number|null }} [opts]
   * @returns {Promise<{ allowed: boolean, limit: number|null, current: number }>}
   */
  canActivate: async function ({ excludeId = null } = {}) {
    const limit = this.MAX_ACTIVE;
    if (limit == null) {
      return { allowed: true, limit: null, current: 0 };
    }
    const current = await this.countActive(excludeId);
    return { allowed: current < limit, limit, current };
  },

  /**
   * Recompute nextRunAt from the current time.
   * Used on cold startup to correct stale nextRunAt values.
   * @param {number} id
   */
  recomputeNextRunAt: async function (id) {
    try {
      const job = await this.get({ id: Number(id) });
      if (!job) return;

      const nextRunAt = this.computeNextRunAt(job.schedule);
      if (!nextRunAt) return;

      await prisma.scheduled_jobs.update({
        where: { id: Number(id) },
        data: { nextRunAt, updatedAt: new Date() },
      });
    } catch (error) {
      console.error("Failed to recompute nextRunAt:", error.message);
    }
  },

  /**
   * Update lastRunAt and nextRunAt after a job run.
   * @param {number} id
   */
  updateRunTimestamps: async function (id) {
    try {
      const job = await this.get({ id: Number(id) });
      if (!job) return;

      const nextRunAt = this.computeNextRunAt(job.schedule);
      await prisma.scheduled_jobs.update({
        where: { id: Number(id) },
        data: {
          lastRunAt: new Date(),
          nextRunAt,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error("Failed to update run timestamps:", error.message);
    }
  },

  /**
   * Get ALL available tools for scheduled jobs to choose from.
   * Unlike the global agent settings, each scheduled job can have its own tool configuration.
   * This returns all possible tools so users can enable different tools for different scheduled tasks.
   *
   * @returns {Promise<{
   *   category: string,
   *   name: string,
   *   items: Array<{ id: string, name: string, description?: string, requiresSetup?: boolean }>
   * }[]>}
   */
  availableTools: async function () {
    const AgentPlugins = require("../utils/agents/aibitat/plugins");
    const ImportedPlugin = require("../utils/agents/imported");
    const { AgentFlows } = require("../utils/agentFlows");
    const MCPCompatibilityLayer = require("../utils/MCP");
    const {
      listSQLConnections,
    } = require("../utils/agents/aibitat/plugins/sql-agent/SQLConnectors");
    const {
      GmailBridge,
    } = require("../utils/agents/aibitat/plugins/gmail/lib");
    const {
      GoogleCalendarBridge,
    } = require("../utils/agents/aibitat/plugins/google-calendar/lib");
    const {
      OutlookBridge,
    } = require("../utils/agents/aibitat/plugins/outlook/lib");

    const categories = [];

    // Check which skills need setup
    const sqlConnections = await listSQLConnections();
    const sqlNeedsSetup = sqlConnections.length === 0;

    const gmailConfig = await GmailBridge.getConfig();
    const gmailNeedsSetup = !gmailConfig.deploymentId || !gmailConfig.apiKey;

    const gcalConfig = await GoogleCalendarBridge.getConfig();
    const gcalNeedsSetup = !gcalConfig.deploymentId || !gcalConfig.apiKey;

    const outlookConfig = await OutlookBridge.getConfig();
    const outlookNeedsSetup =
      !outlookConfig.clientId ||
      !outlookConfig.clientSecret ||
      !outlookConfig.accessToken;

    // Default skills (always available)
    const DEFAULT_SKILLS = [
      {
        id: "rag-memory",
        name: "RAG Memory",
        description: "Recall and cite information from embedded documents",
      },
      {
        id: "document-summarizer",
        name: "Document Summarizer",
        description: "Summarize documents in the workspace",
      },
      {
        id: "web-scraping",
        name: "Web Scraping",
        description: "Scrape content from web pages",
      },
    ];

    // Configurable skills without sub-skills
    const SIMPLE_CONFIGURABLE_SKILLS = [
      {
        id: "create-chart",
        name: "Create Charts",
        description: "Generate data visualization charts",
      },
      {
        id: "web-browsing",
        name: "Web Browsing",
        description: "Search and browse the web",
      },
      {
        id: "sql-agent",
        name: "SQL Agent",
        description: "Query connected SQL databases",
        requiresSetup: sqlNeedsSetup,
      },
    ];

    // Build agent skills category
    const agentSkillItems = [...DEFAULT_SKILLS, ...SIMPLE_CONFIGURABLE_SKILLS];

    if (agentSkillItems.length > 0) {
      categories.push({
        category: "agent-skills",
        name: "Agent Skills",
        items: agentSkillItems,
      });
    }

    // Helper to prettify a sub-skill name (e.g., "gmail-get-inbox" -> "Get Inbox")
    const prettifySubSkillName = (name, prefix) => {
      let cleaned = name;
      const prefixes = [prefix, "gcal", "filesystem", "create"];
      for (const p of prefixes) {
        if (cleaned.startsWith(`${p}-`)) {
          cleaned = cleaned.slice(p.length + 1);
          break;
        }
      }
      return cleaned
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    };

    // Helper function to build sub-skill items from AgentPlugins
    const buildSubSkillItems = (pluginKey, namePrefix) => {
      const plugin = AgentPlugins[pluginKey];
      if (!plugin || !Array.isArray(plugin.plugin)) return [];

      return plugin.plugin.map((subPlugin) => ({
        id: `${plugin.name}#${subPlugin.name}`,
        name: prettifySubSkillName(subPlugin.name, namePrefix),
        description: subPlugin.description || null,
      }));
    };

    // Filesystem Agent (has sub-skills)
    const filesystemItems = buildSubSkillItems("filesystemAgent", "filesystem");
    if (filesystemItems.length > 0) {
      categories.push({
        category: "filesystem-agent",
        name: "File System",
        items: filesystemItems,
      });
    }

    // Create Files Agent (has sub-skills)
    const createFilesItems = buildSubSkillItems("createFilesAgent", "create");
    if (createFilesItems.length > 0) {
      categories.push({
        category: "create-files-agent",
        name: "Create Files",
        items: createFilesItems,
      });
    }

    // Gmail Agent (has sub-skills)
    const gmailItems = buildSubSkillItems("gmailAgent", "gmail");
    if (gmailItems.length > 0) {
      categories.push({
        category: "gmail-agent",
        name: "Gmail",
        items: gmailItems.map((item) => ({
          ...item,
          requiresSetup: gmailNeedsSetup,
        })),
        requiresSetup: gmailNeedsSetup,
      });
    }

    // Google Calendar Agent (has sub-skills)
    const googleCalendarItems = buildSubSkillItems(
      "googleCalendarAgent",
      "gcal"
    );
    if (googleCalendarItems.length > 0) {
      categories.push({
        category: "google-calendar-agent",
        name: "Google Calendar",
        items: googleCalendarItems.map((item) => ({
          ...item,
          requiresSetup: gcalNeedsSetup,
        })),
        requiresSetup: gcalNeedsSetup,
      });
    }

    // Outlook Agent (has sub-skills)
    const outlookItems = buildSubSkillItems("outlookAgent", "outlook");
    if (outlookItems.length > 0) {
      categories.push({
        category: "outlook-agent",
        name: "Outlook",
        items: outlookItems.map((item) => ({
          ...item,
          requiresSetup: outlookNeedsSetup,
        })),
        requiresSetup: outlookNeedsSetup,
      });
    }

    // Custom/imported skills category
    const importedPlugins = ImportedPlugin.listImportedPlugins();
    if (importedPlugins.length > 0) {
      const customSkillItems = importedPlugins.map((plugin) => ({
        id: `@@${plugin.hubId}`,
        name: plugin.name || plugin.hubId,
        description: plugin.description || null,
      }));

      categories.push({
        category: "custom-skills",
        name: "Custom Skills",
        items: customSkillItems,
      });
    }

    // Agent flows category
    const allFlows = AgentFlows.listFlows();
    if (allFlows.length > 0) {
      const flowItems = allFlows.map((flow) => ({
        id: `@@flow_${flow.uuid}`,
        name: flow.name,
        description: flow.description || null,
      }));

      categories.push({
        category: "agent-flows",
        name: "Agent Flows",
        items: flowItems,
      });
    }

    // MCP servers category - get all servers
    // MCP servers are selected as a whole (@@mcp_serverName), not individual tools.
    // The agent loader expands the server into its individual tools at runtime.
    try {
      const mcpLayer = new MCPCompatibilityLayer();
      const servers = await mcpLayer.servers();

      const mcpItems = [];
      for (const server of servers) {
        const toolCount = server.tools?.length || 0;
        mcpItems.push({
          id: `@@mcp_${server.name}`,
          name: server.name,
          description:
            toolCount > 0
              ? `${toolCount} tools available`
              : "No tools available",
        });
      }

      if (mcpItems.length > 0) {
        categories.push({
          category: "mcp-servers",
          name: "MCP Servers",
          items: mcpItems,
        });
      }
    } catch (error) {
      console.error("Failed to load MCP servers for available tools:", error);
    }

    return categories;
  },
};

module.exports = { ScheduledJob };

const { z } = require("zod");

const CRUD_DEFAULTS = {
  create: z.boolean().default(false),
  read: z.boolean().default(false),
  update: z.boolean().default(false),
  delete: z.boolean().default(false),
};

const ACCESS_SCHEMA = z.object({
  name: z.string().default(""),
  description: z.string().default("").optional(),
  permissions: z.object({
    system: z.object({
      update: z.boolean().default(false),
      countVectors: z.boolean().default(false),
      branding: z.object({
        read: z.boolean().default(false),
        update: z.boolean().default(false),
        delete: z.boolean().default(false),
      }),
      models: z.object({
        read: z.boolean().default(false),
      }),
    }),

    systemSettings: z.object({
      ...CRUD_DEFAULTS,
    }),

    apiKeys: z.object({
      ...CRUD_DEFAULTS,
    }),

    browserExtensionKey: z.object({
      readAny: z.boolean().default(false),
      create: z.boolean().default(false),
      read: z.boolean().default(false),
      delete: z.boolean().default(false),
    }),

    workspace: z.object({
      ...CRUD_DEFAULTS,
      chat: z.boolean().default(true),
      embed: z.boolean().default(false),
      resetVectorDb: z.boolean().default(false),
      documentPinStatus: z.boolean().default(false),
      playTTS: z.boolean().default(false),
      readAny: z.boolean().default(false),
    }),

    workspaceThread: z.object({
      ...CRUD_DEFAULTS,
    }),

    workspaceChats: z.object({
      ...CRUD_DEFAULTS,
      export: z.boolean().default(false),
    }),

    documents: z.object({
      read: z.boolean().default(false),
      delete: z.boolean().default(false),
      createFolder: z.boolean().default(false),
      moveFiles: z.boolean().default(false),
      upload: z.boolean().default(false),
    }),

    documentSync: z.object({
      read: z.boolean().default(false),
      update: z.boolean().default(false),
    }),

    users: z.object({
      ...CRUD_DEFAULTS,
      pfp: z.object({
        read: z.boolean().default(false),
        update: z.boolean().default(false),
        delete: z.boolean().default(false),
      }),
    }),

    chatEmbeds: z.object({
      ...CRUD_DEFAULTS,
    }),

    chatEmbedChats: z.object({
      read: z.boolean().default(false),
      delete: z.boolean().default(false),
    }),

    agentFlows: z.object({
      ...CRUD_DEFAULTS,
    }),

    agent: z.object({
      invoke: z.boolean().default(false),
      imported: z.object({
        update: z.boolean().default(false),
        delete: z.boolean().default(false),
      }),
    }),

    roles: z.object({
      ...CRUD_DEFAULTS,
    }),

    eventLogs: z.object({
      read: z.boolean().default(false),
      delete: z.boolean().default(false),
    }),

    invite: z.object({
      create: z.boolean().default(false),
      read: z.boolean().default(false),
      delete: z.boolean().default(false),
    }),

    promptHistory: z.object({
      read: z.boolean().default(false),
      delete: z.boolean().default(false),
    }),

    slashCommands: z.object({
      ...CRUD_DEFAULTS,
    }),

    systemPromptVariables: z.object({
      ...CRUD_DEFAULTS,
    }),

    welcomeMessages: z.object({
      ...CRUD_DEFAULTS,
    }),

    workspaceSuggestedMessages: z.object({
      ...CRUD_DEFAULTS,
    }),

    workspaceUsers: z.object({
      ...CRUD_DEFAULTS,
    }),

    communityHub: z.object({
      explore: z.boolean().default(false),
      viewItems: z.boolean().default(false),
      importItems: z.boolean().default(false),
    }),

    mcp: z.object({
      forceReload: z.boolean().default(false),
      read: z.boolean().default(false),
      update: z.boolean().default(false),
      delete: z.boolean().default(false),
    }),

    collector: z.object({
      useExtension: z.boolean().default(false),
    }),
  }),
});

module.exports = ACCESS_SCHEMA;

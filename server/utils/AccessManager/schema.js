const CRUD_DEFAULTS = {
  create: "boolean",
  read: "boolean",
  update: "boolean",
  delete: "boolean",
};

const ACCESS_SCHEMA = {
  name: "string",
  description: "string",
  permissions: {
    system: {
      update: "boolean",
      countVectors: "boolean",
      branding: {
        update: "boolean",
        delete: "boolean",
      },
      models: {
        read: "boolean",
      },
    },
    systemSettings: {
      read: "boolean",
      update: "boolean",
    },
    apiKeys: {
      create: "boolean",
      read: "boolean",
      delete: "boolean",
    },
    browserExtensionKey: {
      readAny: "boolean",
      read: "boolean",
      create: "boolean",
      delete: "boolean",
    },
    workspace: {
      ...CRUD_DEFAULTS,
      chat: true,
      embed: "boolean",
      resetVectorDb: "boolean",
      documentPinStatus: "boolean",
      readAny: "boolean",
    },
    workspaceThread: {
      ...CRUD_DEFAULTS,
    },
    workspaceChats: {
      ...CRUD_DEFAULTS,
      export: "boolean",
      playTTS: "boolean",
    },
    documents: {
      read: "boolean",
      remove: "boolean",
      createFolder: "boolean",
      moveFiles: "boolean",
      upload: "boolean",
    },
    documentSync: {
      read: "boolean",
      update: "boolean",
    },
    users: {
      ...CRUD_DEFAULTS,
      pfp: {
        read: "boolean",
        update: "boolean",
        delete: "boolean",
      },
    },
    chatEmbeds: {
      ...CRUD_DEFAULTS,
    },
    chatEmbedChats: {
      read: "boolean",
      delete: "boolean",
      // export?
    },
    agentFlows: {
      ...CRUD_DEFAULTS,
    },
    agent: {
      imported: {
        update: "boolean",
        delete: "boolean",
      },
    },
    roles: {
      ...CRUD_DEFAULTS,
    },
    eventLogs: {
      read: "boolean",
      delete: "boolean",
    },
    invite: {
      create: "boolean",
      read: "boolean",
      delete: "boolean",
    },
    promptHistory: {
      read: "boolean",
      delete: "boolean",
    },
    slashCommands: {
      ...CRUD_DEFAULTS,
    },
    systemPromptVariables: {
      ...CRUD_DEFAULTS,
    },
    welcomeMessages: {
      read: "boolean",
      update: "boolean",
    },
    workspaceSuggestedMessages: {
      read: "boolean",
      update: "boolean",
    },
    workspaceUsers: {
      read: "boolean",
      update: "boolean",
    },
    communityHub: {
      explore: "boolean",
      viewItems: "boolean",
      importItems: "boolean",
    },
    mcp: {
      forceReload: "boolean",
      read: "boolean",
      update: "boolean",
      delete: "boolean",
    },
    collector: {
      useExtension: "boolean",
    },
  },
};

const getDefaultAccessSchema = () => JSON.parse(
  JSON.stringify(ACCESS_SCHEMA)
    .replaceAll("boolean", false)
    .replaceAll("string", "")
    .replaceAll("number", 0)
);

module.exports = { ACCESS_SCHEMA, getDefaultAccessSchema };

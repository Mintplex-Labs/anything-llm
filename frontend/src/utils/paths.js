import { API_BASE } from "./api";

export default {
  home: () => {
    return "/";
  },
  login: () => {
    return "/login";
  },
  onboarding: {
    home: () => {
      return "/onboarding";
    },
    survey: () => {
      return "/onboarding/survey";
    },
    llmPreference: () => {
      return "/onboarding/llm-preference";
    },
    embeddingPreference: () => {
      return "/onboarding/embedding-preference";
    },
    vectorDatabase: () => {
      return "/onboarding/vector-database";
    },
    dataHandling: () => {
      return "/onboarding/data-handling";
    },
    createWorkspace: () => {
      return "/onboarding/create-workspace";
    },
  },
  github: () => {
    return "https://github.com/Mintplex-Labs/anything-llm";
  },
  discord: () => {
    return "https://discord.com/invite/6UyHPeGZAC";
  },
  docs: () => {
    return "https://docs.useanything.com";
  },
  mailToMintplex: () => {
    return "mailto:team@mintplexlabs.com";
  },
  workspace: {
    chat: (slug) => {
      return `/workspace/${slug}`;
    },
    additionalSettings: (slug) => {
      return `/workspace/${slug}/settings`;
    },
    thread: (wsSlug, threadSlug) => {
      return `/workspace/${wsSlug}/t/${threadSlug}`;
    },
  },
  apiDocs: () => {
    return `${API_BASE()}/docs`;
  },
  settings: {
    system: () => {
      return `/settings/system-preferences`;
    },
    users: () => {
      return `/settings/users`;
    },
    invites: () => {
      return `/settings/invites`;
    },
    workspaces: () => {
      return `/settings/workspaces`;
    },
    chats: () => {
      return "/settings/workspace-chats";
    },
    llmPreference: () => {
      return "/settings/llm-preference";
    },
    embeddingPreference: () => {
      return "/settings/embedding-preference";
    },
    vectorDatabase: () => {
      return "/settings/vector-database";
    },
    security: () => {
      return "/settings/security";
    },
    appearance: () => {
      return "/settings/appearance";
    },
    apiKeys: () => {
      return "/settings/api-keys";
    },
    logs: () => {
      return "/settings/event-logs";
    },
    embedSetup: () => {
      return `/settings/embed-config`;
    },
    embedChats: () => {
      return `/settings/embed-chats`;
    },
    dataConnectors: {
      list: () => {
        return "/settings/data-connectors";
      },
      github: () => {
        return "/settings/data-connectors/github";
      },
      youtubeTranscript: () => {
        return "/settings/data-connectors/youtube-transcript";
      },
    },
  },
};

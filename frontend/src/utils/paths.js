import { API_BASE } from "./constants";

export default {
  home: () => {
    return "/";
  },
  login: (noTry = false) => {
    return `/login${noTry ? "?nt=1" : ""}`;
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
    userSetup: () => {
      return "/onboarding/user-setup";
    },
    dataHandling: () => {
      return "/onboarding/data-handling";
    },
    createWorkspace: () => {
      return "/onboarding/create-workspace";
    },
  },
  github: () => {
    return "https://github.com/raiqa-org/raiqa-rag";
  },
  discord: () => {
    return "https://discord.com/invite/6UsyHPeGZAC";
  },
  docs: () => {
    return "https://docs.raiqa.ai";
  },
  mailToMintplex: () => {
    return "mailto:team@raiqa.ai";
  },
  hosting: () => {
    return "https://raiqa.ai";
  },
  workspace: {
    chat: (slug) => {
      return `/workspace/${slug}`;
    },
    settings: {
      generalAppearance: (slug) => {
        return `/workspace/${slug}/settings/general-appearance`;
      },
      chatSettings: (slug) => {
        return `/workspace/${slug}/settings/chat-settings`;
      },
      vectorDatabase: (slug) => {
        return `/workspace/${slug}/settings/vector-database`;
      },
      members: (slug) => {
        return `/workspace/${slug}/settings/members`;
      },
      agentConfig: (slug) => {
        return `/workspace/${slug}/settings/agent-config`;
      },
    },
    thread: (wsSlug, threadSlug) => {
      return `/workspace/${wsSlug}/t/${threadSlug}`;
    },
  },
  apiDocs: () => {
    return `${API_BASE}/docs`;
  },
  orderFineTune: () => {
    return `/fine-tuning`;
  },
  settings: {
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
    transcriptionPreference: () => {
      return "/settings/transcription-preference";
    },
    audioPreference: () => {
      return "/settings/audio-preference";
    },
    embedder: {
      modelPreference: () => "/settings/embedding-preference",
      chunkingPreference: () => "/settings/text-splitter-preference",
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
    agentSkills: () => {
      return "/settings/agents";
    },
    apiKeys: () => {
      return "/settings/api-keys";
    },
    logs: () => {
      return "/settings/event-logs";
    },
    privacy: () => {
      return "/settings/privacy";
    },
    embedSetup: () => {
      return `/settings/embed-config`;
    },
    embedChats: () => {
      return `/settings/embed-chats`;
    },
    browserExtension: () => {
      return `/settings/browser-extension`;
    },
    experimental: () => {
      return `/settings/beta-features`;
    },
  },
  experimental: {
    liveDocumentSync: {
      manage: () => `/settings/beta-features/live-document-sync/manage`,
    },
  },
};

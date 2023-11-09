import { API_BASE } from "./constants";

export default {
  home: () => {
    return "/";
  },
  login: () => {
    return "/login";
  },
  onboarding: () => {
    return "/onboarding";
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
  hosting: () => {
    return "https://my.mintplexlabs.com/aio-checkout?product=anythingllm";
  },
  feedback: () => {
    return "https://mintplexlabs.typeform.com/to/i0KE3aEW";
  },
  workspace: {
    chat: (slug) => {
      return `/workspace/${slug}`;
    },
  },
  exports: () => {
    return `${API_BASE.replace("/api", "")}/system/data-exports`;
  },
  apiDocs: () => {
    return `${API_BASE}/docs`;
  },
  general: {
    llmPreference: () => {
      return "/general/llm-preference";
    },
    embeddingPreference: () => {
      return "/general/embedding-preference";
    },
    vectorDatabase: () => {
      return "/general/vector-database";
    },
    exportImport: () => {
      return "/general/export-import";
    },
    security: () => {
      return "/general/security";
    },
    appearance: () => {
      return "/general/appearance";
    },
    apiKeys: () => {
      return "/general/api-keys";
    },
    chats: () => {
      return "/general/workspace-chats";
    },
  },
  admin: {
    system: () => {
      return `/admin/system-preferences`;
    },
    users: () => {
      return `/admin/users`;
    },
    invites: () => {
      return `/admin/invites`;
    },
    workspaces: () => {
      return `/admin/workspaces`;
    },
    chats: () => {
      return "/admin/workspace-chats";
    },
  },
};

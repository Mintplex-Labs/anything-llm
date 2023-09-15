import { API_BASE } from "./constants";

export default {
  home: () => {
    return "/";
  },
  github: () => {
    return "https://github.com/Mintplex-Labs/anything-llm";
  },
  discord: () => {
    return "https://discord.com/invite/6UyHPeGZAC";
  },
  docs: () => {
    return "https://docs.pullmai.space";
  },
  mailToMintplex: () => {
    return "mailto:contacto@meiklabs.com";
  },
  hosting: () => {
    return "https://www.pullmai.space";
  },
  feedback: () => {
    return "https://forms.office.com/r/LNGFFk3FpE";
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
    appearance: () => {
      return "/admin/appearance";
    },
    apiKeys: () => {
      return "/admin/api-keys";
    },
  },
};

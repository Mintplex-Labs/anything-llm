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
    return "https://docs.useanything.com";
  },
  mailToMintplex: () => {
    return "mailto:team@mintplexlabs.com";
  },
  hosting: () => {
    return "https://my.mintplexlabs.com/aio-checkout?product=anythingllm";
  },
  feedback: () => {
    return "https://form.typeform.com/to/i0KE3aEW";
  },
  workspace: {
    chat: (slug) => {
      return `/workspace/${slug}`;
    },
  },
  exports: () => {
    return `${API_BASE.replace("/api", "")}/system/data-exports`;
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

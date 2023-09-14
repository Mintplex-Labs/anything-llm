import { API_BASE } from "./constants";

export default {
  home: () => {
    return "/";
  
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
    return "https://my.mintplexlabs.com/aio-checkout?product=anythingllm";
  },
  feedback: () => {
    return "https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAN__iN86xdUNkVSU0gxVFk5TlZGODJEREJMQTIyTkJZNy4u";
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

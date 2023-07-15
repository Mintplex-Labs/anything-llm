import { API_BASE } from "./constants";

export default {
  home: () => {
    return "/";
  },
  github: () => {
    return "https://github.com/Mintplex-Labs/anything-llm";
  },
  docs: () => {
    return "https://discord.com/invite/6UyHPeGZAC";
  },
  mailToMintplex: () => {
    return "mailto:team@mintplex.xyz";
  },
  hosting: () => {
    return "https://form.typeform.com/to/KdSCdSvq";
  },
  workspace: {
    chat: (slug) => {
      return `/workspace/${slug}`;
    },
  },
  exports: () => {
    return `${API_BASE.replace("/api", "")}/system/data-exports`;
  },
};

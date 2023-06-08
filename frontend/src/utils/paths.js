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
};

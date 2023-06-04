export default {
  home: () => {
    return "/";
  },
  github: () => {
    return "/";
  },
  docs: () => {
    return "/";
  },
  mailToMintplex: () => {
    return "mailto:team@mintplex.xyz";
  },
  workspace: {
    chat: (slug) => {
      return `/workspace/${slug}`;
    },
  },
};

import LiveSyncToggle from "./Features/LiveSync/toggle";

export const configurableFeatures = (t) => {
  return {
    experimental_live_file_sync: {
      title: t("experimentalFeatures.featureList.liveDocumentSync"),
      component: LiveSyncToggle,
      key: "experimental_live_file_sync",
    },
  };
};

import LiveSyncToggle from "./Features/LiveSync/toggle";
import paths from "@/utils/paths";

export const configurableFeatures = {
  experimental_live_file_sync: {
    title: "Live Document Sync",
    component: LiveSyncToggle,
    key: "experimental_live_file_sync",
  },
};

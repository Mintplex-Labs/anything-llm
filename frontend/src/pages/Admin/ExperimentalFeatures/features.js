import LiveSyncToggle from "./Features/LiveSync/toggle";
import FileTypeDefaultToggle from "./Features/FileTypeDefault/toggle";

export const configurableFeatures = {
  experimental_live_file_sync: {
    title: "Live Document Sync",
    component: LiveSyncToggle,
    key: "experimental_live_file_sync",
  },
  experimental_file_type_default: {
    title: "File Type Default",
    component: FileTypeDefaultToggle,
    key: "experimental_file_type_default",
  },
};

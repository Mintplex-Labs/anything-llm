import LiveSyncToggle from "./Features/LiveSync/toggle";
import LibraryToggle from "./Features/Library/toggle";

export const configurableFeatures = {
  experimental_live_file_sync: {
    title: "Live Document Sync",
    component: LiveSyncToggle,
    key: "experimental_live_file_sync",
  },
  library: {
    title: "Document Library",
    component: LibraryToggle,
    key: "library",
  },
};

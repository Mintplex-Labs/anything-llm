import LiveSyncToggle from "./Features/LiveSync/toggle";

export const configurableFeatures = {
  experimental_live_file_sync: {
    title: "Đồng bộ tài liệu trực tiếp",
    component: LiveSyncToggle,
    key: "experimental_live_file_sync",
  },
};

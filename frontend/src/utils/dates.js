import moment from "moment";

export function formatDateTime24(dateString) {
  if (!dateString) return "--";
  return moment(dateString).format("YYYY-MM-DD HH:mm:ss");
}

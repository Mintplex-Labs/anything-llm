import { toast } from "react-toastify";

/**
 * Resolves the effective theme (light or dark) using the same logic as useTheme,
 * but without React hooks so it can be called from plain utility functions.
 * @returns {"light" | "dark"}
 */
function resolveTheme() {
  const stored = localStorage?.getItem("theme") || "system";
  if (stored === "default" || stored === "dark") return "dark";
  if (stored === "light") return "light";
  return window.matchMedia?.("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

/**
 * Shows a toast notification with the given message and type.
 * @param {string} message - The message to display in the toast.
 * @param {'success' | 'error' | 'info' | 'warning' | 'default'} type - The type of toast to display.
 * @param {Object} opts - Additional options for the toast.
 * @returns {void}
 */
const showToast = (message, type = "default", opts = {}) => {
  const resolved = resolveTheme();
  const options = {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: resolved === "light" ? "light" : "dark",
    ...opts,
  };

  if (opts?.clear === true) toast.dismiss();

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "info":
      toast.info(message, options);
      break;
    case "warning":
      toast.warn(message, options);
      break;
    default:
      toast(message, options);
  }
};

export default showToast;

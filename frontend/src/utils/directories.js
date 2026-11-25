import moment from "moment";
import { isMac } from "./keyboardShortcuts";

export function formatDateTimeAsMoment(dateString, format = "LLL") {
  if (!dateString) return moment().format(format);
  try {
    return moment(dateString).format(format);
  } catch {
    return moment().format(format);
  }
}

export function getFileExtension(path) {
  // Only the last path segment can have an extension, a dot in a parent folder does not count.
  const fileName = path?.split(/[\\/]/)?.pop();
  const hasExtension = fileName?.includes(".");
  if (!hasExtension) return "FILE";
  const extension = fileName.split(".").slice(-1)[0];
  return extension?.toUpperCase() || "FILE";
}

export function middleTruncate(str, n) {
  const fileExtensionPattern = /([^.]*)$/;
  const extensionMatch = str.includes(".") && str.match(fileExtensionPattern);

  if (str.length <= n) return str;

  if (extensionMatch && extensionMatch[1]) {
    const extension = extensionMatch[1];
    const nameWithoutExtension = str.replace(fileExtensionPattern, "");
    const truncationPoint = Math.max(0, n - extension.length - 4);
    const truncatedName =
      nameWithoutExtension.substr(0, truncationPoint) +
      "..." +
      nameWithoutExtension.slice(-4);

    return truncatedName + extension;
  } else {
    return str.length > n ? str.substr(0, n - 8) + "..." + str.slice(-4) : str;
  }
}

/** Inclusive slice of `rows` between two ids, or null if either is missing. */
export function rowsBetween(rows, anchorId, targetId) {
  const from = rows.findIndex((row) => row.id === anchorId);
  const to = rows.findIndex((row) => row.id === targetId);
  if (from === -1 || to === -1) return null;
  return rows.slice(Math.min(from, to), Math.max(from, to) + 1);
}

function inTextField(event) {
  return ["INPUT", "TEXTAREA"].includes(event.target.tagName);
}

/** Cmd/Ctrl+A, ignored in text fields so their own select-all still works. */
export function isSelectAllShortcut(event) {
  const modifier = isMac ? event.metaKey : event.ctrlKey;
  return modifier && event.key.toLowerCase() === "a" && !inTextField(event);
}

/** Escape, ignored in text fields. */
export function isClearSelectionKey(event) {
  return event.key === "Escape" && !inTextField(event);
}

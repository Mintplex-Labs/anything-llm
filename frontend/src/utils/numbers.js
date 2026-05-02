const Formatter = Intl.NumberFormat("en", { notation: "compact" });

export function numberWithCommas(input) {
  return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function nFormatter(input) {
  return Formatter.format(input);
}

export function dollarFormat(input) {
  return new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
  }).format(input);
}

export function toPercentString(input = null, decimals = 0) {
  if (isNaN(input) || input === null) return "";
  const percentage = Math.round(input * 100);
  return (
    (decimals > 0 ? percentage.toFixed(decimals) : percentage.toString()) + "%"
  );
}

export function humanFileSize(bytes, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

export function milliToHms(milli = 0) {
  const d = parseFloat(milli) / 1_000.0;
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = parseFloat((d % 3600.0) % 60);

  var hDisplay = h >= 1 ? h + "h " : "";
  var mDisplay = m >= 1 ? m + "m " : "";
  var sDisplay = s >= 0.01 ? s.toFixed(2) + "s" : "";
  return hDisplay + mDisplay + sDisplay;
}

/**
 * Format a duration in milliseconds to a human readable string
 * - Less than 1 second - show milliseconds (50ms)
 * - Less than 60 seconds - show seconds (5s)
 * - Less than 1 hour - show min:sec (1m 30s)
 * - 1 hour or more - show h:min:sec (1h 30m 5s)
 * @param {number} duration - duration in milliseconds
 * @returns {string}
 */
export function formatDuration(duration) {
  try {
    if (duration < 0) return "";
    if (duration < 1) return `${(duration * 1000).toFixed(0)}ms`;
    if (duration < 60) return `${duration.toFixed(1)}s`;
    if (duration < 3600) {
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      return `${minutes}m ${seconds}s`;
    }

    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  } catch {
    return "";
  }
}

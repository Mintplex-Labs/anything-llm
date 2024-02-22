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

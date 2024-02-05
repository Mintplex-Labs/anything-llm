export function formatDate(dateString) {
  const date = isNaN(new Date(dateString).getTime())
    ? new Date()
    : new Date(dateString);
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  return formattedDate;
}

export function getFileExtension(path) {
  return path?.split(".")?.slice(-1)?.[0] || "file";
}

export function middleTruncate(str, n) {
  const fileExtensionPattern = /(\.[^.]*)$/;
  const extensionMatch = str.match(fileExtensionPattern);
  let extension = "";
  let nameWithoutExtension = str;

  if (extensionMatch) {
    extension = extensionMatch[0];
    nameWithoutExtension = str.substring(0, str.length - extension.length);
  }
  if (str.length <= n) return str;
  const startLength = Math.ceil((n - 3) / 2);
  const endLength = Math.floor((n - 3) / 2);
  const adjustedStartLength = extension
    ? startLength - Math.ceil(extension.length / 2)
    : startLength;
  const adjustedEndLength = extension
    ? endLength - Math.floor(extension.length / 2)
    : endLength;
  const truncated =
    nameWithoutExtension.substr(0, adjustedStartLength) +
    "..." +
    nameWithoutExtension.slice(-adjustedEndLength);
  return truncated + extension;
}

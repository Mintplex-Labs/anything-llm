async function getContentType(url) {
  // Determine the content type of the resource by making a HEAD request
  const res = await fetch(url, { method: "HEAD" });

  if (!res.ok) {
    console.log("Not a valid URL.", res.status);
    return { success: false, reason: "Not a valid URL." };
  }

  const contentType = res.headers.get("Content-Type")?.toLowerCase();

  // Remove the charset from the content type (example: application/json; charset=utf-8)
  const contentTypeWithoutCharset = contentType?.split(";")[0].trim();


  if (!contentTypeWithoutCharset) {
    console.log("No Content-Type found.", res.status);
    return { success: false, reason: "No Content-Type found." };
  }

  return { success: true, contentType: contentTypeWithoutCharset };
}

module.exports = {
  getContentType,
};

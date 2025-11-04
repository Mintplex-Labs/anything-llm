function cleanResponse(text) {
  if (!text) return text;
  return text.replace(/(<\|.*?\|>)+\s*$/g, "");
}

function responseCleanerMiddleware(response) {
  if (!response || !response.text) return response;
  response.text = cleanResponse(response.text);
  return response;
}

module.exports = { responseCleanerMiddleware };
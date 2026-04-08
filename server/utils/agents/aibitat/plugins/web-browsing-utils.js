function normalizeBaiduSearchReferences(references = []) {
  if (!Array.isArray(references)) return [];

  const seenLinks = new Set();
  return references
    .filter((reference) => {
      if (!reference) return false;
      const referenceType = String(
        reference.type || reference.resource_type || "web"
      ).toLowerCase();
      return referenceType === "web";
    })
    .map((reference) => {
      const title = String(
        reference.title || reference.web_anchor || ""
      ).trim();
      const link = String(reference.url || "").trim();
      const snippet = String(
        reference.snippet || reference.content || ""
      ).trim();

      if (!title || !link || seenLinks.has(link)) return null;
      seenLinks.add(link);

      return { title, link, snippet };
    })
    .filter(Boolean);
}

module.exports = {
  normalizeBaiduSearchReferences,
};

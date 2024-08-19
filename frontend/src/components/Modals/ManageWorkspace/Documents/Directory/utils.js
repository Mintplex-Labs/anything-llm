import strDistance from "js-levenshtein";

const LEVENSHTEIN_MIN = 2;

// Regular expression pattern to match the v4 UUID and the ending .json
const uuidPattern =
  /-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/;
const jsonPattern = /\.json$/;

// Function to strip UUID v4 and JSON from file names as that will impact search results.
export const stripUuidAndJsonFromString = (input = "") => {
  return input
    ?.replace(uuidPattern, "") // remove v4 uuid
    ?.replace(jsonPattern, "") // remove trailing .json
    ?.replace("-", " "); // turn slugged names into spaces
};

export function filterFileSearchResults(files = [], searchTerm = "") {
  if (!searchTerm) return files?.items || [];

  const normalizedSearchTerm = searchTerm.toLowerCase().trim();

  const searchResult = [];
  for (const folder of files?.items) {
    const folderNameNormalized = folder.name.toLowerCase();

    // Check for exact match first, then fuzzy match
    if (folderNameNormalized.includes(normalizedSearchTerm)) {
      searchResult.push(folder);
      continue;
    }

    // Check children for matches
    const fileSearchResults = [];
    for (const file of folder?.items) {
      const fileNameNormalized = stripUuidAndJsonFromString(
        file.name
      ).toLowerCase();

      // Exact match check
      if (fileNameNormalized.includes(normalizedSearchTerm)) {
        fileSearchResults.push(file);
      }
      // Fuzzy match only if no exact matches found
      else if (
        fileSearchResults.length === 0 &&
        strDistance(fileNameNormalized, normalizedSearchTerm) <= LEVENSHTEIN_MIN
      ) {
        fileSearchResults.push(file);
      }
    }

    if (fileSearchResults.length > 0) {
      searchResult.push({
        ...folder,
        items: fileSearchResults,
      });
    }
  }

  return searchResult;
}

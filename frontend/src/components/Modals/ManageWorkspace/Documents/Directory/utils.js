import strDistance from "js-levenshtein";

const LEVENSHTEIN_MIN = 8;

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

  const searchResult = [];
  for (const folder of files?.items) {
    // If folder is a good match then add all its children
    if (strDistance(folder.name, searchTerm) <= LEVENSHTEIN_MIN) {
      searchResult.push(folder);
      continue;
    }

    // Otherwise check children for good results
    const fileSearchResults = [];
    for (const file of folder?.items) {
      if (
        strDistance(stripUuidAndJsonFromString(file.name), searchTerm) <=
        LEVENSHTEIN_MIN
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

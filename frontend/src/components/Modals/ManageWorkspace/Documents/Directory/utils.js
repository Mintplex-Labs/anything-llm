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

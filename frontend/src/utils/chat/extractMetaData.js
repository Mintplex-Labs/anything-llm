/**
 * Extracts JSON objects and arrays from a text response from OpenAI API call and returns the remaining text with the extracted JSON strings removed.
 * @param {String} textResponse  The text response from OpenAI API call
 * @returns  {Object} { remainingText, meta: extractedObjects }  remainingText is the textResponse with the extracted JSON strings removed, and meta is an array of the extracted JSON objects/arrays
 */

export const extractMetaData = (textResponse) => {
  console.log("textResponse", textResponse);
  if (!textResponse) return { remainingText: "", metaData: {} };
  let remainingText = textResponse;
  let inString = false;
  let char, prevChar;
  let braceCount = 0;
  let bracketCount = 0;
  let startIndex = null;
  let extractedObjects = {}; // Keep as an object as requested

  for (let i = 0; i < textResponse?.length; i++) {
    char = textResponse[i];
    if (char === '"' && prevChar !== "\\") inString = !inString;
    if (inString) continue;

    if (char === "{" || char === "[") {
      if (braceCount === 0 && bracketCount === 0) startIndex = i;
      if (char === "{") braceCount++;
      if (char === "[") bracketCount++;
    } else if (char === "}" || char === "]") {
      if (char === "}") braceCount--;
      if (char === "]") bracketCount--;

      if (braceCount === 0 && bracketCount === 0 && startIndex !== null) {
        let json = textResponse.substring(startIndex, i + 1);

        try {
          let parsedJson = JSON.parse(json);
          console.log("Parsed JSON:", parsedJson);
          for (let key in parsedJson) {
            if (parsedJson.hasOwnProperty(key)) {
              extractedObjects[key] = parsedJson[key];
            }
          }
        } catch (error) {
          console.error("Error parsing JSON:", error, "in JSON:", json);
        }
        startIndex = null;
      }
    }
    prevChar = char;
  }

  // Remove any json objects from the text tat starts with ```json nad ends with ```
  const jsonRegex = /```json[\s\S]*?```/g;
  remainingText = remainingText.replace(jsonRegex, "");
  console.log("remainingText", remainingText);
  console.log("extractedObjects", extractedObjects);
  return { remainingText, metaData: extractedObjects };
};

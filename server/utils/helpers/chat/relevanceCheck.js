const { getLLMProvider } = require("../../helpers");

async function checkChunkRelevance(query, chunks, workspace) {
  console.log("\n[Relevance Check] Starting relevance analysis...");
  console.log(`[Relevance Check] Query: "${query}"`);
  console.log(`[Relevance Check] Analyzing ${chunks.length} document chunks`);

  const LLMConnector = getLLMProvider({
    provider: workspace?.chatProvider,
    model: workspace?.chatModel,
  });

  // Construct the relevance check prompt
  const relevancePrompt = `You are a document relevance checker. Your task is to analyze the following user query and determine which document chunks are relevant to answering it.

User Query: "${query}"

Document Chunks:
${chunks.map((chunk, index) => `[Chunk ${index + 1}]
${chunk}
`).join('\n')}

IMPORTANT: You must respond with ONLY a valid JSON array containing the 0-based indices of relevant chunks.
- The response must be a JSON array of numbers, like this: [0, 2, 4]
- Do not include any text, explanation, or other content
- Do not use any formatting or markdown
- If no chunks are relevant, return an empty array: []
- The response must be parseable by JSON.parse()

Example valid responses:
[0, 2, 4]
[]
[1, 3]

Your response must be a valid JSON array and nothing else.`;

  console.log("[Relevance Check] Sending request to LLM for analysis...");

  // Get the LLM's response
  const { textResponse } = await LLMConnector.getChatCompletion([
    { role: "system", content: "You are a precise document relevance checker. You must respond with ONLY a valid JSON array of numbers. No other text or formatting is allowed." },
    { role: "user", content: relevancePrompt }
  ], {
    temperature: 0.1, // Low temperature for more deterministic responses
  });

  console.log("[Relevance Check] Received LLM response");
  console.log("[Relevance Check] Raw response:", textResponse);

  try {
    // Clean the response to ensure it's valid JSON
    const cleanedResponse = textResponse.trim().replace(/^```json\s*|\s*```$/g, '');
    console.log("[Relevance Check] Cleaned response:", cleanedResponse);

    // Parse the response and validate it's an array of numbers
    const relevantIndices = JSON.parse(cleanedResponse);
    if (!Array.isArray(relevantIndices)) {
      console.error("[Relevance Check] Error: Response was not an array");
      return chunks;
    }

    // Validate that all elements are numbers
    if (!relevantIndices.every(index => typeof index === 'number' && Number.isInteger(index))) {
      console.error("[Relevance Check] Error: Array contains non-integer values");
      return chunks;
    }

    // Validate that indices are within bounds
    if (!relevantIndices.every(index => index >= 0 && index < chunks.length)) {
      console.error("[Relevance Check] Error: Array contains out-of-bounds indices");
      return chunks;
    }

    console.log(`[Relevance Check] Found ${relevantIndices.length} relevant chunks out of ${chunks.length} total chunks`);
    console.log(`[Relevance Check] Relevant chunk indices: ${JSON.stringify(relevantIndices)}`);

    // Filter chunks based on relevant indices
    const relevantChunks = chunks.filter((_, index) => relevantIndices.includes(index));
    return relevantChunks;
  } catch (error) {
    console.error("[Relevance Check] Error parsing LLM response:", error);
    console.log("[Relevance Check] Falling back to using all chunks");
    return chunks;
  }
}

module.exports = {
  checkChunkRelevance
};
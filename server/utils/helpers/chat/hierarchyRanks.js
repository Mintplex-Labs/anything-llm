/**
 * Ranks documents based on their relevance to the query using three factors:
 * 1. Chroma's similarity score (60%)
 * 2. TF-IDF keyword matching (30%)
 * 3. Document recency (10%)
 * Only runs when chatMode is "query"
 * @param {string} query - The user's query
 * @param {Array} documents - Array of documents to rank
 * @param {Object} workspace - The workspace configuration
 * @param {string} chatMode - The current chat mode
 * @returns {Promise<Array>} - Ranked documents with scores
 */
async function rankDocuments(query, documents, workspace, chatMode) {
  console.log("\n[Document Ranking] Starting document ranking...");
  console.log(`[Document Ranking] Query: "${query}"`);
  console.log(`[Document Ranking] Analyzing ${documents.length} documents`);

  if (chatMode !== "query") {
    console.log("[Document Ranking] Not in query mode, skipping ranking");
    return documents;
  }

  if (!documents || documents.length === 0) {
    console.log("[Document Ranking] No documents to rank");
    return documents;
  }

  try {
    const rankedDocs = await Promise.all(
      documents.map(async (doc) => {
        console.log("[Document Ranking] Calculating relevance score for document:", doc.text);
        const relevanceScore = await calculateRelevanceScore(query, doc, workspace);
        return {
          ...doc,
          relevanceScore,
        };
      })
    );

    const sortedDocs = rankedDocs.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    console.log(`[Document Ranking] Completed ranking ${sortedDocs.length} documents`);
    console.log(`[Document Ranking] Top document score: ${sortedDocs[0]?.relevanceScore || 0}`);
    console.log("[Document Ranking] Top document text:", sortedDocs[0]?.text);
    
    return sortedDocs;
  } catch (error) {
    console.error("[Document Ranking] Error during ranking:", error);
    console.log("[Document Ranking] Falling back to original document order");
    return documents;
  }
}

/**
 * Calculates a relevance score for a document based on three factors
 * Only runs when chatMode is "query"
 * @param {string} query - The user's query
 * @param {Object} doc - The document to score
 * @param {Object} workspace - The workspace configuration
 * @returns {Promise<number>} - Relevance score between 0 and 1
 */
async function calculateRelevanceScore(query, doc, workspace) {
  //console.log("[Document Ranking] Full document structure:", JSON.stringify(doc, null, 2));

  let score = 0;
  
  // 1. Semantic similarity score (50% weight)
  // For Chroma, the score is in the metadata object
  const similarityScore = doc.score || 0;
  score += similarityScore * 0.5;
  console.log("[Document Ranking] Similarity score:", similarityScore);

  // 2. TF-IDF keyword matching score (40% weight)
  const keywordScore = calculateKeywordMatchScore(query, doc.text || "");
  score += keywordScore * 0.4;
  console.log("[Document Ranking] Keyword score:", keywordScore);

  // 3. Recency score (20% weight)
  if (doc.timestamp) {
    const recencyScore = calculateRecencyScore(doc.timestamp);
    score += recencyScore * 0.2;
    console.log("[Document Ranking] Recency score:", recencyScore);
  }

  return Math.min(1, Math.max(0, score)); // Ensure score is between 0 and 1
}

/**
 * Calculates a score based on TF-IDF keyword matching
 * @param {string} query - The user's query
 * @param {string} text - The document content
 * @returns {number} - Score between 0 and 1
 */
function calculateKeywordMatchScore(query, text) {
  if (!text || !query) return 0;

  console.log("[Document Ranking] Document text:", text);

  // Get all words from both query and text
  const queryWords = query.toLowerCase().split(/\s+/);
  const textWords = text.toLowerCase().split(/\s+/);
  
  console.log("[Document Ranking] Query words:", queryWords);
  console.log("[Document Ranking] Text words:", textWords);
  
  // Calculate term frequencies
  const queryTF = {};
  const textTF = {};
  
  queryWords.forEach(word => {
    queryTF[word] = (queryTF[word] || 0) + 1;
  });
  
  textWords.forEach(word => {
    textTF[word] = (textTF[word] || 0) + 1;
  });
  
  console.log("[Document Ranking] Query term frequencies:", queryTF);
  console.log("[Document Ranking] Text term frequencies:", textTF);
  
  // Calculate IDF for each word
  const allWords = new Set([...queryWords, ...textWords]);
  const idf = {};
  
  allWords.forEach(word => {
    // For keyword matching, we want to give more weight to words that appear in both query and text
    // and less weight to words that only appear in one or the other
    const appearsInQuery = queryWords.includes(word);
    const appearsInText = textWords.includes(word);
    
    if (appearsInQuery && appearsInText) {
      // Word appears in both - give it high weight
      idf[word] = 1.0;
    } else if (appearsInQuery || appearsInText) {
      // Word appears in only one - give it lower weight
      idf[word] = 0.5;
    } else {
      // Word doesn't appear in either (shouldn't happen)
      idf[word] = 0.0;
    }
  });
  
  console.log("[Document Ranking] IDF scores:", idf);
  
  // Calculate TF-IDF scores
  let totalScore = 0;
  let matchedWords = 0;
  
  queryWords.forEach(word => {
    if (textWords.includes(word)) {
      const queryTFIDF = queryTF[word] * idf[word];
      const textTFIDF = textTF[word] * idf[word];
      totalScore += Math.min(queryTFIDF, textTFIDF);
      matchedWords++;
      console.log(`[Document Ranking] Word "${word}" matched with scores:`, {
        queryTFIDF,
        textTFIDF,
        minScore: Math.min(queryTFIDF, textTFIDF)
      });
    }
  });
  
  // Normalize score
  const maxPossibleScore = queryWords.length;
  const finalScore = matchedWords > 0 ? totalScore / maxPossibleScore : 0;
  
  return finalScore;
}

/**
 * Calculates a score based on document recency
 * @param {string|number} timestamp - Document timestamp
 * @returns {number} - Score between 0 and 1
 */
function calculateRecencyScore(timestamp) {
  const docDate = new Date(timestamp);
  const now = new Date();
  const diffDays = (now - docDate) / (1000 * 60 * 60 * 24);
  
  // Documents from the last 30 days get higher scores
  return Math.max(0, 1 - (diffDays / 30));
}

module.exports = {
  rankDocuments
}; 


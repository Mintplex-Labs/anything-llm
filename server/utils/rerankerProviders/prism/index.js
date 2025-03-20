const fetch = require('node-fetch');

/**
 * Rerank Texts using the Reranker API
 * @param {string[]} texts - Array of text chunks to be reranked.
 * @param {string} query - The input query or message for reranking.
 * @returns {Promise<Object[]>} - Top 5 reranked results based on scores.
 */
async function rerankTexts(texts, query) {
    try {

      if (!Array.isArray(texts) || texts.length === 0) {
        throw new Error('The texts parameter must be a non-empty array.');
      }
      if (typeof query !== 'string' || query.trim() === '') {
        throw new Error('The query parameter must be a non-empty string.');
      }
  
      const payload = {
        model: process.env.RERANKER_MODEL,
        query: query,
        top_n: Number(process.env.RERANK_TOP_N_RESULTS),
        documents: texts,
    };
      // Call the Reranker API
      const response = await fetch(process.env.RERANKER_URL, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RERANKER_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch from Prism Reranker API: ${response.statusText}`);
      }
      
      // Parse JSON response
      const data = await response.json();
  
      if (!data.results || !Array.isArray(data.results)) {
        throw new Error('Invalid response format from Prism Reranker API');
    }

    // Transform the response to match the expected format
    const formattedResults = data.results.map((result) => ({
        index: result.index,
        score: result.relevance_score, // Map relevance_score to score
    }));
      return formattedResults;
    } catch (error) {
      console.error('Error in Prism Reranker API:', error.message);
      throw error;
    }
  }
module.exports = {
    rerankTexts,
  };

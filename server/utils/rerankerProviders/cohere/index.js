const { CohereClient } = require('cohere-ai');
const cohere = new CohereClient({ token: process.env.RERANKER_API_KEY });

/**
 * Rerank Texts using the Reranker API
 * @param {string[]} texts - Array of text chunks to be reranked.
 * @param {string} query - The input query or message for reranking.
 * @returns {Promise<Object[]>} - Top 5 reranked results based on scores.
 */
async function rerankTexts(texts, query) {
    try {

        // Validate inputs
        if (!Array.isArray(texts) || texts.length === 0) {
            throw new Error('The texts parameter must be a non-empty array.');
        }
        if (typeof query !== 'string' || query.trim() === '') {
            throw new Error('The query parameter must be a non-empty string.');
        }

        // Call Cohere's rerank API and await the result
        const rerank = await cohere.v2.rerank({
            documents: texts,
            query: query,
            topN: Number(process.env.RERANK_TOP_N_RESULTS),
            model: process.env.RERANKER_MODEL,
        });

        const formattedResults = rerank.results.map((item) => ({
            index: item.index,
            score: item.relevanceScore,
        }));
        // console.log(formattedResults)
        return formattedResults;
    } catch (error) {
        console.error('Error in Cohere Reranker:', error.message);
        throw error; // Rethrow the error for the caller to handle
    }
}
module.exports = {
    rerankTexts,
};

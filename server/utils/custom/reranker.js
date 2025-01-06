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

        // Define the payload for the reranker API
        const payload = {
            query,
            raw_scores: false,
            return_text: true,
            texts,
            truncate: false
        };

        // Call the Reranker API
        const response = await fetch(process.env.RERANKER_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch from Reranker API: ${response.statusText}`);
        }

        // Parse JSON response
        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error('Invalid response format from Reranker API');
        }

        // Sort results by score in descending order and take the top 5
        const topResults = data
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

        // console.log('Top 5 Reranked Results:', topResults);
        return topResults;

    } catch (error) {
        console.error('Error in rerankTexts:', error.message);
        throw error;
    }
}
module.exports = {
    rerankTexts,
  };

// // Example Usage
// (async () => {
//     const texts = [
//         "Unsupervised learning is a type of machine learning where the model learns from data without labeled outputs.",
//         "The model attempts to find hidden patterns and structure in the data.",
//         "Clustering and dimensionality reduction are common techniques in unsupervised learning."
//     ];
//     const query = "What is unsupervised learning?";

//     try {
//         const top5Results = await rerankTexts(texts, query);
//         console.log('Final Top 5 Results:', JSON.stringify(top5Results, null, 2));
//     } catch (err) {
//         console.error('Failed to rerank texts:', err.message);
//     }
// })();

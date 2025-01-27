const https = require('https');


/**
 * Rerank Texts using the Reranker API
 * @param {string[]} texts - Array of text chunks to be reranked.
 * @param {string} query - The input query or message for reranking.
 * @returns {Promise<Object[]>} - Top 5 reranked results based on scores.
 */
async function rerankTexts(texts, query) {
    try {
        console.log('jina reranker called')
        // Validate inputs
        if (!Array.isArray(texts) || texts.length === 0) {
            throw new Error('The texts parameter must be a non-empty array.');
        }
        if (typeof query !== 'string' || query.trim() === '') {
            throw new Error('The query parameter must be a non-empty string.');
        }

        const postData = JSON.stringify({
            model: process.env.RERANKER_MODEL,
            query: query,
            top_n: Number(process.env.RERANK_TOP_N_RESULTS),
            documents: texts,
        });

        const options = {
            hostname: 'api.jina.ai',
            port: 443,
            path: '/v1/rerank',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.RERANKER_API_KEY}`,
            },
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);

                        // Validate response format
                        if (!response.results || !Array.isArray(response.results)) {
                            throw new Error('Invalid response format from Jina API');
                        }

                        // Transform the response to match the expected format
                        const formattedResults = response.results.map((result) => ({
                            index: result.index,
                            score: result.relevance_score, // Map relevance_score to score
                        }));

                        resolve(formattedResults); // Resolve the transformed results
                    } catch (error) {
                        reject(error);
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.write(postData);
            req.end();
        });
    } catch (error) {
        console.error('Error in rerankTexts:', error.message);
        throw error;
    }
}
module.exports = {
    rerankTexts,
};

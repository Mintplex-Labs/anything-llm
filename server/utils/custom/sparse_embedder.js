const fetch = require('node-fetch');

/**
 * Fetch Sparse Embeddings from Sparse Embedder API
 * @param {string} inputText - The text to embed sparsely.
 * @returns {Promise<Object[]>} - Sparse embeddings formatted for Milvus.
 */
async function getSparseEmbedding(inputText) {
    try {
        if (typeof inputText !== 'string' || inputText.trim() === '') {
            throw new Error('The inputText parameter must be a non-empty string.');
        }

        // Define the payload for the sparse embedder API
        const payload = {
            inputs: inputText
        };

        // Call the Sparse Embedder API
        const response = await fetch(process.env.SPARSE_EMBEDDER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch from Sparse Embedder API: ${response.statusText}`);
        }

        // Parse JSON response
        const data = await response.json();


        if (!Array.isArray(data) || !Array.isArray(data[0])) {
            throw new Error('Invalid response format from Sparse Embedder API');
        }

        // Convert the response to Milvus-compatible format
        const milvusSparseVector = convertToMilvusFormat(data);
        // console.log(`generated sparse vector successfully text length: ${inputText.length}`)
        return milvusSparseVector;

    } catch (error) {
        // console.log(`##############################################################################`)
        // console.log(`failed to get sparse vector text length: ${inputText}`)
        // console.log(`##############################################################################`)
        console.error('Error in getSparseEmbedding:', error.message);
        throw error;
    }
}

/**
 * Convert Sparse Embedding Array into Milvus-Compatible Format
 * @param {Array} sparseArray - Sparse embedding array from the API.
 * @returns {Array} - Milvus-compatible sparse vector format.
 */
function convertToMilvusFormat(sparseArray) {
    // Assuming sparseArray[0] because your data is nested within an array
    const result = sparseArray[0].reduce((acc, item) => {
        acc[Number(item.index)] = Number(item.value);
        return acc;
    }, {});
    return result;
}

module.exports = {
    getSparseEmbedding,
};

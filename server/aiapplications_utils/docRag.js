async function fetchAndProcessRAGData(dataToSend) {
  let serverResponseData = null;

  try {
    const response = await fetch(process.env.RAG_DOCS_SERVICE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.RAG_DOCS_SERVICE_API_KEY
      },
      body: JSON.stringify(dataToSend)
    });

    if (!response.ok) {
      throw new Error(`ERROR: ${response.status}`);
    }

    serverResponseData = await response.json();
    let documents = {}
    console.log(serverResponseData.length)
    for (const chunk of serverResponseData) {
        const newChunk = {
            score: chunk.overallScore,
            text: chunk.chunkText
        }
        console.log(chunk.overallScore)
      if (!(chunk.documentId in documents)) {
        let newDocument = {
            title: chunk.title,
            summary: chunk.summary,
            url: "https://asdasadd",
            chunks: [newChunk],
            mediaType: chunk.mediaType
        }
        documents[chunk.documentId] = newDocument;
    }
    else  {
        documents[chunk.documentId].chunks.push(newChunk);
      }
    }
    let finalDocuments = {};
    let idx = 0;
    for (const value of Object.values(documents)) {
        finalDocuments[idx] = value;
        idx++;
    }
    return finalDocuments;

  } catch (error) {
    console.error('Error fetching RAG data:', error);
    return null; 
  }
}


module.exports = {
    fetchAndProcessRAGData
}
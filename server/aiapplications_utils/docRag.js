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

    return serverResponseData;

  } catch (error) {
    console.error('Error fetching RAG data:', error);
    return null; 
  }
}


module.exports = {
    fetchAndProcessRAGData
}
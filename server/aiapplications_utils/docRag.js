const { RagDocuments } = require("../models/ragDocuments");

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

function countDocUsageInModelResponse(text, dictionary) {
    const regex = /\[(\d+)\]/g;
    const counts = {}; // Tutaj klucze będą stringami, np. "0", "1"

    for (const match of text.matchAll(regex)) {
        const numberString = match[1]; // match[1] to już string (np. "0")
        counts[numberString] = (counts[numberString] || 0) + 1;
    }

    for (const key in dictionary) {
        if (Object.prototype.hasOwnProperty.call(dictionary, key)) {
            // 'key' jest już stringiem (np. "0"), a 'counts' ma klucze stringowe
            dictionary[key].count = counts[key] || 0;
        }
    }
    return dictionary;
}


async function updateRagDocumentsDb(engine_sources) {
  for (const key of Object.keys(engine_sources)) {
    const value = engine_sources[key];
    if (await RagDocuments.exists(value["firestore_doc_id"])){
      await RagDocuments.incrementTimesRetrieved(value["firestore_doc_id"], 1);
      await RagDocuments.incrementTimesLmmUsed(value["firestore_doc_id"], value["count"]);
    }
    else{
      await RagDocuments.create(value["firestore_doc_id"], 1, value["count"]);
    }
  }
}

module.exports = {
    fetchAndProcessRAGData,
    countDocUsageInModelResponse,
    updateRagDocumentsDb
}
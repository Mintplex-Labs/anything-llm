const { ConversationalSearchServiceClient } = require('@google-cloud/discoveryengine').v1;
const { VertexAI } = require('@google-cloud/vertexai');
const { project_id, location } = require('./config');

const searchClient = new ConversationalSearchServiceClient({
    apiEndpoint: `${location}-discoveryengine.googleapis.com`,
});

async function getEngineResponse(engine_id, query, session_id) {
    const serving_config = `projects/${project_id}/locations/${location}/collections/default_collection/engines/${engine_id}/servingConfigs/default_serving_config`;
    const full_session_id = `projects/${project_id}/locations/${location}/collections/default_collection/engines/${engine_id}/sessions/${session_id}`;

    const request = {
        servingConfig: serving_config,
        query: { text: query },
        session: full_session_id,
        queryUnderstandingSpec: {
            queryRephraserSpec: {
                disable: false,
                maxRephraseSteps: 1,
            },
            queryClassificationSpec: {
                types: [
                    'ADVERSARIAL_QUERY',
                    'NON_ANSWER_SEEKING_QUERY'
                ]
            },
        },
        answerGenerationSpec: {
            ignoreAdversarialQuery: true,
            ignoreNonAnswerSeekingQuery: false,
            ignoreLowRelevantContent: true,
            answerLanguageCode: "en",
            includeCitations: true,
            modelSpec: {
                modelVersion: "gemini-2.5-flash/answer_gen/v1",
            },
            promptSpec: {
                preamble: "Given the conversation between a user and a helpful assistant and some search results, create a final answer for the assistant. The answer should use all relevant information from the search results, not introduce any additional information, and use exactly the same words as the search results when possible. The assistant's answer should be no more than 20 sentences. The user is a member of the general public who doesn't have in-depth knowledge of the subject matter. The assistant should avoid using specialized knowledge, and instead answer in a non-technical manner that anyone can understand. Provide a summary, details in bullet points and a conclusion",
            },
        },
        relatedQuestionsSpec: { enable: true },
        searchSpec: {
            searchParams: {
                maxReturnResults: 4,
            },
        },
    };

    const [response] = await searchClient.answerQuery(request);

    const full_citations = response.answer.citations;
    const full_references = response.answer.references;
    const vaild_references = [];
    for (const reference of full_references) {
        vaild_references.push(reference.chunkInfo.documentMetadata.uri)
    }

    const unique_references = [...new Set(vaild_references)];

    return {
        answer: response.answer.answerText,
        citations: full_citations,
        references: full_references,
        related_questions: response.answer.relatedQuestions,
        sources: unique_references,
    };
}

module.exports = {
    getEngineResponse,
}; 
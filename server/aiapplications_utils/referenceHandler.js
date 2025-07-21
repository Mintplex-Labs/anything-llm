const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

const getSignedUrlFromUri = async (uri) => {
    const match = uri.match(/^gs:\/\/([a-zA-Z0-9._-]+)\/(.*)$/);
    if (!match) {
        console.error('Invalid GCS URI:', uri);
        return null;
    }
    const bucketName = match[1];
    const fileName = match[2];
    const expirationMinutes = 60;
    const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + expirationMinutes * 60 * 1000,
      };
    const [url] = await storage
    .bucket(bucketName)
    .file(fileName)
    .getSignedUrl(options);
    return url;
}



const parseEngineResponses = async (responses) => {
    const related_questions = {};
    const answers = {};
    const citationsMapping = {};
    let i = 0;
    let index = 0;
    
    for (const response of responses) {
        related_questions[`model_${index}`] = response.related_questions;
        const textParts = [];
        let lastIndex = 0;
        for (const citation of response.citations) {
            const startIndex = parseInt(citation.startIndex, 10);
            const endIndex = parseInt(citation.endIndex, 10);
            if (startIndex > lastIndex) {
                textParts.push(response.answer.substring(lastIndex, startIndex));
              }
            textParts.push(response.answer.substring(startIndex, endIndex));
            for (const source of citation.sources) {
                const refId = Number(source.referenceId);
                const reference = response.references[refId];
                const referenceUri = reference.chunkInfo.documentMetadata.uri;
                const markerSting = `[${i}]`;
                textParts.push(markerSting);
                const signedUrl = await getSignedUrlFromUri(referenceUri);
                citationsMapping[markerSting] = signedUrl;
                i++;
            }
            lastIndex = endIndex;
        }
        if (lastIndex < response.answer.length) {
            textParts.push(response.answer.substring(lastIndex));
          }
        answers[`model_${index}`] = textParts.join('');
        index++;
    };
    return {
        related_questions,
        answers,
        citationsMapping
    };
}


module.exports = {
    parseEngineResponses
}
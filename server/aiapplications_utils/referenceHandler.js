const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

function isReferenceDoubled(reference, mappings) {
    const allValues = Object.values(mappings);
    return allValues.includes(reference);
}

const getSignedUrlFromUri = async (uri) => {
    const match = uri.match(/^gs:\/\/([a-zA-Z0-9._-]+)\/(.*)$/);
    if (!match) {
        console.error('Invalid GCS URI:', uri);
        return uri;
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

const getReferencesSignedUrls = async (citationsMapping) => {
    const referencesSignedUrls = {};
    for (const key in citationsMapping) {
        const signedUrl = await getSignedUrlFromUri(citationsMapping[key]);
        referencesSignedUrls[key] = signedUrl;
    }
    return referencesSignedUrls;
}

function findMostFrequent(arr) {
    if (arr.length === 0) {
      return undefined;
    }
  
    const frequencyMap = new Map();
    let maxCount = 0;
    let mostFrequentElement = arr[0];
  
    for (const item of arr) {
      const count = (frequencyMap.get(item) || 0) + 1;
      frequencyMap.set(item, count);
  
      if (count > maxCount) {
        maxCount = count;
        mostFrequentElement = item;
      }
    }
  
    return mostFrequentElement;
  }



const parseEngineResponses = async (responses) => {
    const related_questions = [];
    const answers = {};
    const citationsMapping = {};
    const topReferences = {};
    let i = 0;
    let index = 0;
    
    for (const response of responses) {
        if (response.answer === "No results could be found. Try rephrasing the search query.") {
            continue;
        }
        if (!response.sources || response.sources.length === 0) {
            continue;
        }
        const sourceName = response.sources[0].split('/')[2];
        topReferences[sourceName] = [];
        related_questions.push(...response.related_questions);
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
                topReferences[sourceName].push(referenceUri);
                if (isReferenceDoubled(referenceUri, citationsMapping)) {
                    const markerSting = getKeyByValue(citationsMapping, referenceUri);
                    textParts.push(markerSting);
                }
                else {
                    const markerSting = `[${i}]`;
                    textParts.push(markerSting);
                    citationsMapping[markerSting] = referenceUri;
                    i++;
                }
            }
            lastIndex = endIndex;
        }
        if (lastIndex < response.answer.length) {
            textParts.push(response.answer.substring(lastIndex));
          }
        answers[`model_${index}`] = textParts.join('');
        index++;
    };
    const referencesSignedUrls = await getReferencesSignedUrls(citationsMapping);
    const bestReferences = {}
    for (const sourceName in topReferences) {
        const currentList = topReferences[sourceName];
        const mostFrequent = findMostFrequent(currentList);
        bestReferences[sourceName] = mostFrequent;
    }
    return {
        related_questions,
        answers,
        referencesSignedUrls,
        bestReferences
    };
}


module.exports = {
    parseEngineResponses
}
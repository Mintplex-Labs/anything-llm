require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
const { Pinecone } = require('../utils/pinecone');
const { viewLocalFiles } = require('../utils/files');

function systemEndpoints(app) {
  if (!app) return;

  app.get('/ping', (_, response) => {
    response.sendStatus(200);
  })

  app.get('/setup-complete', (_, response) => {
    const results = {
      OpenAiKey: !!process.env.OPEN_AI_KEY,
      OpenAiModelPref: process.env.OPEN_MODEL_PREF || 'gpt-3.5-turbo',
      PineConeEnvironment: process.env.PINECONE_ENVIRONMENT,
      PineConeKey: !!process.env.PINECONE_API_KEY,
      PinceConeIndex: process.env.PINECONE_INDEX,
    }
    response.status(200).json({ results })
  })

  app.get('/system-vectors', async (_, response) => {
    const vectorCount = await Pinecone.totalIndicies();
    response.status(200).json({ vectorCount })
  })

  app.get('/local-files', async (_, response) => {
    const localFiles = await viewLocalFiles()
    response.status(200).json({ localFiles })
  })
}

module.exports = { systemEndpoints }
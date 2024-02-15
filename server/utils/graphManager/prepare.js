const { GraphManager } = require(".");
const { OpenAiLLM } = require("../AiProviders/openAi")

const DEFAULT_KG_TRIPLET_EXTRACT_TMPL = `
Some text is provided below. Given the text, extract knowledge graph triplet objects in the form of JSON array of objects structured as {subject, predicate, object} for levelgraph "put" statements for NodeJS. Avoid stopwords.
---------------------
Example:
Text: Alice is Bob's mother.
Result: [{subject: "Alice", predicate: "is mother of", object: "Bob"}]

Text: Philz is a coffee shop founded in Berkeley in 1982.
Result: [
{subject: "Philz", predicate: "is", object: "coffee shop"},
{subject: "Philz", predicate: "founded in", object: "Berkeley"},
{subject: "Philz", predicate: "founded in", object: "1982"},
]
---------------------`

async function insertIntoGraph(namespace, metadatas) {
  const LLM = new OpenAiLLM()
  const keyGraph = new Set();
  const insertStmts = [];

  for await (const metadata of metadatas) {
    if (!metadata?.text) continue;

    await LLM.openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      n: 1,
      response_format: {
        type: "json_object"
      },
      messages: [
        {
          role: "system",
          content: DEFAULT_KG_TRIPLET_EXTRACT_TMPL,
        },
        { role: "user", content: metadata.text },
      ],
    })
      .then((res) => {
        if (!res.hasOwnProperty("choices"))
          throw new Error("OpenAI chat: No results!");
        if (res.choices.length === 0)
          throw new Error("OpenAI chat: No results length!");
        return res.choices[0].message.content;
      })
      .then((resObjectString) => {
        try {
          const data = JSON.parse(resObjectString);
          if (data.hasOwnProperty('triplets')) return data.triplets;
          return data;
        } catch {
          console.error('Failed to parse', resObjectString)
          throw new Error("Failed to parse data from response as JSON.")
        }
      })
      .then((stmts) => {
        // returned a single JSON object, not an array
        if (!Array.isArray(stmts)) {
          const key = `spo::${stmts.subject}:${stmts.predicate}:${stmts.object}`;
          insertStmts.push({ ...stmts, fullText: metadata.text });
          keyGraph.add(key)
          return;
        }

        for (const stmt of stmts) {
          const key = `spo::${stmt.subject}:${stmt.predicate}:${stmt.object}`;
          if (keyGraph.has(key)) {
            console.log(`Key ${key} already known`);
            continue;
          };

          insertStmts.push({ ...stmt, fullText: metadata.text });
          keyGraph.add(key)
        }
      })
      .catch((error) => {
        throw new Error(
          `OpenAI::chat.completions.create() failed with: ${error.message}`
        );
      });
  }

  const graph = new GraphManager({ filename: namespace });
  await graph.put(insertStmts, { namespace });
  graph.db.close();
  return;
}

async function knowledgeGraphSearch(namespace, textChunks) {
  const LLM = new OpenAiLLM()
  const keyGraph = new Set();
  const uniqueTexts = new Set(textChunks)
  let getStmts = [];

  for await (const text of textChunks) {
    // If text is somehow empty or the length of the content is
    // not enough words, its highly unlikely we can get anything good from this
    // piece of content so we can skip it.
    if (!text || text.split(' ').length < 5) continue;

    await LLM.openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      n: 1,
      response_format: {
        type: "json_object"
      },
      messages: [
        {
          role: "system",
          content: DEFAULT_KG_TRIPLET_EXTRACT_TMPL,
        },
        { role: "user", content: text },
      ],
    })
      .then((res) => {
        if (!res.hasOwnProperty("choices"))
          throw new Error("OpenAI chat: No results!");
        if (res.choices.length === 0)
          throw new Error("OpenAI chat: No results length!");
        return res.choices[0].message.content;
      })
      .then((resObjectString) => {
        try {
          const data = JSON.parse(resObjectString);
          if (data.hasOwnProperty('triplets')) return data.triplets;
          return data;
        } catch {
          console.error('Failed to parse response from OpenAI as JSON', { resObjectString })
          return false;
        }
      })
      .then((stmts) => {
        if (!stmts) return;

        // returned a single JSON object, not an array
        if (!Array.isArray(stmts)) {
          const key = `spo::${stmts.subject}:${stmts.predicate}:${stmts.object}`;
          getStmts.push({ ...stmts });
          keyGraph.add(key)
          return;
        }

        for (const stmt of stmts) {
          if (!(stmt.hasOwnProperty('subject') && stmt.hasOwnProperty('predicate') && stmt.hasOwnProperty('object'))) {
            console.log('Invalid stmt object schema.')
            continue;
          }

          const key = {
            spo: `spo::${stmt.subject}:${stmt.predicate}:${stmt.object}`,
            s: `s::${stmt.subject}`,
            so: `so::${stmt.subject}:${stmt.object}`,
            o: `o::${stmt.object}`
          };

          if (keyGraph.has(key)) {
            console.log(`SPO Key ${key} already known`);
            continue;
          };

          getStmts.push(
            { ...stmt },
            keyGraph.has(key.s) ? null : { subject: stmt.subject },
            keyGraph.has(key.so) ? null : { subject: stmt.subject, object: stmt.object },
            keyGraph.has(key.o) ? null : { object: stmt.object },
          );

          keyGraph.add(key.spo)
          keyGraph.add(key.s)
          keyGraph.add(key.so)
          keyGraph.add(key.o)
        }
      })
      .catch((error) => {
        throw new Error(
          `OpenAI::chat.completions.create() failed with: ${error.message}`
        );
      });
  }
  getStmts = getStmts.filter((d) => !!d)
  if (getStmts.length === 0) return textChunks;

  console.log(`Discovered ${getStmts.length} graph queries from ${textChunks.length} text segments`);
  const graph = new GraphManager({ filename: namespace });
  const expandedResults = (await graph.query(getStmts, { limit: 2 }))
    .filter((result) => !uniqueTexts.has(result.fullText))
    .map((expandedResult) => expandedResult.fullText)

  if (expandedResults.length === 0) {
    console.log(`Knowledge graph expansion had no impact on the knowledge available.`)
    return textChunks;
  }

  console.log(`SUCCESS: Knowledge graph expanded the knowledge available from ${uniqueTexts.size} to ${expandedResults.length} chunks of relevant knowledge`)
  return [...textChunks, ...expandedResults]
}

module.exports = {
  insertIntoGraph,
  knowledgeGraphSearch
}
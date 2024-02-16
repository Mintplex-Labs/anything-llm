const DEFAULT_KG_TRIPLET_EXTRACT_TMPL = `
Some text is provided below. Given the text, extract knowledge graph triplet objects in the form of JSON array of objects structured as {subject, predicate, object} for levelgraph "put" statements for NodeJS. Avoid stopwords.
Elaborate on the given text to additionally expand upon the relevant topics and keywords that might not be explicitly mentioned in the text.
---------------------
Example:
Text: Alice is Bob's mother.
Result: [
  {subject: "Alice", predicate: "is mother of", object: "Bob"},
  {subject: "Bob", predicate: "has a mother named", object: "Alice"},
  {subject: "Bob", predicate: "is a", object: "human"},
  {subject: "Bob", predicate: "could have", object: "siblings"}
]

Text: Philz is a coffee shop founded in Berkeley in 1982.
Result: [
{subject: "Philz", predicate: "is", object: "coffee shop"},
{subject: "Philz", predicate: "founded in", object: "Berkeley"},
{subject: "Philz", predicate: "founded in", object: "1982"},
]
---------------------`;

async function LLMConceptExtraction(text) {
  if (!process.env.OPEN_AI_KEY) throw new Error("No OpenAI API key was set.");
  return fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
    },
    body: JSON.stringify({
      n: 1,
      model: "gpt-3.5-turbo-1106",
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content: DEFAULT_KG_TRIPLET_EXTRACT_TMPL,
        },
        { role: "user", content: text },
      ],
    }),
  })
    .then((res) => res.json())
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
        if (data.hasOwnProperty("triplets")) return data.triplets;
        return data;
      } catch {
        console.error("Failed to parse", { resObjectString });
        throw new Error("Failed to parse data from response as JSON.");
      }
    });
}

async function _insertIntoGraph(
  graphInstance = null,
  namespace,
  metadatas = [],
  graphCacheKey
) {
  if (!graphInstance)
    throw new Error("Cannot be called from outside GraphManager class!");
  let insertStmts = [];
  const graph = graphInstance;
  const cache = graph.hasCache(graphCacheKey);

  if (cache.exists) {
    graph.log("Cached concept extraction was found - skipping LLM query");

    // Make sure the new vectorId and documentID are upserted with the new information
    // so that we can track the objects later.
    const { docId: documentId } = metadatas[0];
    for (const stmt of cache.statements) {
      insertStmts.push({ ...stmt, documentId });
    }
  } else {
    const extractionQueue = [];
    const keyGraph = new Set();

    for await (const [i, metadata] of metadatas.entries()) {
      if (!metadata?.text) continue;

      const conceptRequest = () => {
        const insertStmts = [];
        const { vectorId, docId: documentId, text: fullText } = metadata;

        return new Promise(async (resolve) => {
          graph.log(
            `Extracting concepts from text chunk ${i + 1} of ${
              metadatas.length
            } via LLM from document.`
          );
          await LLMConceptExtraction(metadata.text)
            .then((stmts) => {
              // returned a single JSON object, not an array
              if (!Array.isArray(stmts)) {
                const key = `spo::${stmts.subject}:${stmts.predicate}:${stmts.object}`;
                insertStmts.push({ ...stmts, vectorId, documentId, fullText });
                keyGraph.add(key);
                return;
              }

              for (const stmt of stmts) {
                const key = `spo::${stmt.subject}:${stmt.predicate}:${stmt.object}`;
                if (keyGraph.has(key)) continue;

                insertStmts.push({ ...stmt, vectorId, documentId, fullText });
                keyGraph.add(key);
              }
            })
            .catch((error) => {
              console.error(
                `OpenAI::chat.completions.create() failed with: ${error.message}`
              );
            });
          resolve(insertStmts);
        });
      };
      extractionQueue.push(conceptRequest);
    }
    insertStmts = await Promise.all(extractionQueue.map((f) => f())).then(
      (results) => results.flat()
    );
  }

  graph.init({ namespace });
  await graph.$upsert(
    insertStmts,
    { namespace },
    cache.exists ? null : graphCacheKey
  );
  return;
}

async function _knowledgeGraphSearch(
  graphInstance = null,
  namespace,
  textChunks
) {
  if (!graphInstance)
    throw new Error("Cannot be called from outside GraphManager class!");
  const graph = graphInstance;
  const extractionQueue = [];

  for await (const text of textChunks) {
    // If text is somehow empty or the length of the content is
    // not enough words, its highly unlikely we can get anything good from this
    // piece of content so we can skip it.
    if (!text || text.split(" ").length < 5) continue;
    const extractionPromise = () => {
      const getStmts = [];
      const keyGraph = new Set();
      return new Promise(async (resolve) => {
        graph.log(`Extracting concepts from text chunk to expand search.`);
        await LLMConceptExtraction(text)
          .then((stmts) => {
            if (!stmts) return;

            // returned a single JSON object, not an array
            if (!Array.isArray(stmts)) {
              const key = `spo::${stmts.subject}:${stmts.predicate}:${stmts.object}`;
              getStmts.push({ ...stmts });
              keyGraph.add(key);
              return;
            }

            for (const stmt of stmts) {
              if (
                !(
                  stmt.hasOwnProperty("subject") &&
                  stmt.hasOwnProperty("predicate") &&
                  stmt.hasOwnProperty("object")
                )
              ) {
                console.log(
                  "knowledgeGraphSearch:Invalid stmt object schema - skipping."
                );
                continue;
              }

              const key = {
                spo: `spo::${stmt.subject}:${stmt.predicate}:${stmt.object}`,
                s: `s::${stmt.subject}`,
                so: `so::${stmt.subject}:${stmt.object}`,
                o: `o::${stmt.object}`,
              };

              if (keyGraph.has(key)) continue;

              getStmts.push(
                { ...stmt },
                keyGraph.has(key.s) ? null : { subject: stmt.subject },
                keyGraph.has(key.so)
                  ? null
                  : { subject: stmt.subject, object: stmt.object },
                keyGraph.has(key.o) ? null : { object: stmt.object }
              );

              Object.values(key).forEach(keyGraph.add, keyGraph);
            }
          })
          .catch((error) => {
            console.error(
              `OpenAI::chat.completions.create() failed with: ${error.message}`
            );
          });
        resolve(getStmts);
      });
    };
    extractionQueue.push(extractionPromise);
  }

  const getStmts = (
    await Promise.all(extractionQueue.map((f) => f())).then((results) =>
      results.flat()
    )
  ).filter((d) => !!d);

  if (getStmts.length === 0) return textChunks;

  graph.log(
    `Discovered ${getStmts.length} knowledge graph queries to expand our search!`
  );
  graph.init({ namespace }); // prepare kg table for inserts and open connection.

  const uniqueTexts = new Set(textChunks);
  const expandedResults = (await graph.$query(getStmts, { limit: 4 }))
    .filter((result) => !uniqueTexts.has(result.fullText))
    .map((expandedResult) => expandedResult.fullText);

  if (expandedResults.length === 0) {
    graph.log(`Knowledge graph expansion found no additional context.`);
    return textChunks;
  }

  const combinedResults = [...textChunks, ...expandedResults];
  graph.log(
    `SUCCESS: Knowledge graph expanded from ${uniqueTexts.size} to ${combinedResults.length} text chunks of relevant knowledge`
  );
  return combinedResults;
}

module.exports = {
  _insertIntoGraph,
  _knowledgeGraphSearch,
};

const OpenAI = require("openai");

/**
 * @type {import("openai").OpenAI}
 */
const client = new OpenAI({
  baseURL: "http://localhost:3001/api/v1/openai",
  apiKey: "ENTER_ANYTHINGLLM_API_KEY_HERE",
});

(async () => {
  // Models endpoint testing.
  console.log("Fetching /models");
  const modelList = await client.models.list();
  for await (const model of modelList) {
    console.log({ model });
  }

  // Test sync chat completion
  console.log("Running synchronous chat message");
  const syncCompletion = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant who only speaks like a pirate.",
      },
      { role: "user", content: "What is AnythingLLM?" },
      // {
      //   role: 'assistant',
      //   content: "Arrr, matey! AnythingLLM be a fine tool fer sailin' the treacherous sea o' information with a powerful language model at yer helm. It's a potent instrument to handle all manner o' tasks involvin' text, like answerin' questions, generating prose, or even havin' a chat with digital scallywags like meself. Be there any specific treasure ye seek in the realm o' AnythingLLM?"
      // },
      // { role: "user", content: "Why are you talking like a pirate?" },
    ],
    model: "anythingllm", // must be workspace-slug
  });
  console.log(syncCompletion.choices[0]);

  // Test sync chat streaming completion
  console.log("Running asynchronous chat message");
  const asyncCompletion = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant who only speaks like a pirate.",
      },
      { role: "user", content: "What is AnythingLLM?" },
    ],
    model: "anythingllm", // must be workspace-slug
    stream: true,
  });

  let message = "";
  for await (const chunk of asyncCompletion) {
    message += chunk.choices[0].delta.content;
    console.log({ message });
  }

  // Vector DB functionality
  console.log("Fetching /vector_stores");
  const vectorDBList = await client.beta.vectorStores.list();
  for await (const db of vectorDBList) {
    console.log(db);
  }
})();

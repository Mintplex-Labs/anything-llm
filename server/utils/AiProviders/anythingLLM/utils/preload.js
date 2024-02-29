const { AnythingLLMOllama } = require("../index.js");

// When the app has booted for the first time ever we have no idea what
// their LLM_PROVIDER will be, but its highly likely they will just use the default
// provider. So if the ENV is unknown _or_ the ENV is not anythingllm_ollama we will
// tell the main process to go ahead and boot the bg ollama service.
// Lastly, if this is a n+1 boot of the app - we will have an LLM_PROVIDER set and can skip or
// appropriately pre-load.
//
// For existing installations, this wont happen and this will have no overhead impact..
// When you toggle between providers we will start/kill the process - see: updateENV LLM_PROVIDER postUpdate hook.
async function preloadOllamaService() {
  if (
    !!process.env.LLM_PROVIDER &&
    process.env.LLM_PROVIDER !== "anythingllm_ollama"
  ) {
    console.log(
      `Skipping preloading of AnythingLLMOllama - LLM_PROVIDER is ${process.env.LLM_PROVIDER}.`
    );
    return;
  }

  const manager = new AnythingLLMOllama();
  manager.bootOrContinue();
  return;
}

module.exports = {
  preloadOllamaService,
};

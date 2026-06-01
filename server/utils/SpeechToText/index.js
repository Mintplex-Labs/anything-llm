function getSTTProvider() {
  const provider = process.env.STT_PROVIDER || "native";
  switch (provider) {
    case "openai":
      const { OpenAiSTT } = require("./openAi");
      return new OpenAiSTT();
    case "lemonade":
      const { LemonadeSTT } = require("./lemonade");
      return new LemonadeSTT();
    case "deepgram":
      const { DeepgramSTT } = require("./deepgram");
      return new DeepgramSTT();
    case "generic-openai":
      const { GenericOpenAiSTT } = require("./openAiGeneric");
      return new GenericOpenAiSTT();
    default:
      throw new Error(
        `STT_PROVIDER "${provider}" is not a server-side provider.`
      );
  }
}

module.exports = { getSTTProvider };

function getSTTProvider() {
  const provider = process.env.STT_PROVIDER || "native";
  switch (provider) {
    case "openai":
      const { OpenAiSTT } = require("./openAi");
      return new OpenAiSTT();
    default:
      throw new Error(
        `STT_PROVIDER "${provider}" is not a server-side provider.`
      );
  }
}

module.exports = { getSTTProvider };

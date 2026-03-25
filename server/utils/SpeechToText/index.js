function getSTTProvider() {
  const provider = process.env.STT_PROVIDER || "native";
  switch (provider) {
    case "generic-openai":
      const { GenericOpenAiSTT } = require("./openAiGeneric");
      return new GenericOpenAiSTT();
    default:
      throw new Error(
        "STT_PROVIDER is not set to a valid server-side provider."
      );
  }
}

module.exports = { getSTTProvider };

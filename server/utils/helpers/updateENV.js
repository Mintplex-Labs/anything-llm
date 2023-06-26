const KEY_MAPPING = {
  OpenAiKey: {
    envKey: "OPEN_AI_KEY",
    checks: [isNotEmpty, validOpenAIKey],
  },
  OpenAiModelPref: {
    envKey: "OPEN_MODEL_PREF",
    checks: [isNotEmpty, validOpenAIModel],
  },
  VectorDB: {
    envKey: "VECTOR_DB",
    checks: [isNotEmpty, supportedVectorDB],
  },
  ChromaEndpoint: {
    envKey: "CHROMA_ENDPOINT",
    checks: [isValidURL, validChromaURL],
  },
  PineConeEnvironment: {
    envKey: "PINECONE_ENVIRONMENT",
    checks: [],
  },
  PineConeKey: {
    envKey: "PINECONE_API_KEY",
    checks: [],
  },
  PineConeIndex: {
    envKey: "PINECONE_INDEX",
    checks: [],
  },
  // Not supported yet.
  // 'AuthToken': 'AUTH_TOKEN',
  // 'JWTSecret': 'JWT_SECRET',
  // 'StorageDir': 'STORAGE_DIR',
};

function isNotEmpty(input = "") {
  return !input || input.length === 0 ? "Value cannot be empty" : null;
}

function isValidURL(input = "") {
  try {
    new URL(input);
    return null;
  } catch (e) {
    return "URL is not a valid URL.";
  }
}

function validOpenAIKey(input = "") {
  return input.startsWith("sk-") ? null : "OpenAI Key must start with sk-";
}

function validOpenAIModel(input = "") {
  const validModels = [
    "gpt-4",
    "gpt-4-0613",
    "gpt-4-32k",
    "gpt-4-32k-0613",
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-0613",
    "gpt-3.5-turbo-16k",
    "gpt-3.5-turbo-16k-0613",
  ];
  return validModels.includes(input)
    ? null
    : `Invalid Model type. Must be one of ${validModels.join(", ")}.`;
}

function supportedVectorDB(input = "") {
  const supported = ["chroma", "pinecone", "lancedb"];
  return supported.includes(input)
    ? null
    : `Invalid VectorDB type. Must be one of ${supported.join(", ")}.`;
}

function validChromaURL(input = "") {
  return input.slice(-1) === "/"
    ? `Chroma Instance URL should not end in a trailing slash.`
    : null;
}

// This will force update .env variables which for any which reason were not able to be parsed or
// read from an ENV file as this seems to be a complicating step for many so allowing people to write
// to the process will at least alleviate that issue. It does not perform comprehensive validity checks or sanity checks
// and is simply for debugging when the .env not found issue many come across.
function updateENV(newENVs = {}) {
  let error = "";
  const validKeys = Object.keys(KEY_MAPPING);
  const ENV_KEYS = Object.keys(newENVs).filter((key) =>
    validKeys.includes(key)
  );
  const newValues = {};

  ENV_KEYS.forEach((key) => {
    const { envKey, checks } = KEY_MAPPING[key];
    const value = newENVs[key];
    const errors = checks
      .map((validityCheck) => validityCheck(value))
      .filter((err) => typeof err === "string");

    if (errors.length > 0) {
      error += errors.join("\n");
      return;
    }

    newValues[key] = value;
    process.env[envKey] = value;
  });

  return { newValues, error: error?.length > 0 ? error : false };
}

module.exports = {
  updateENV,
};

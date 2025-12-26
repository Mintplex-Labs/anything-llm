// TODO: When CometAPI's model list is upgraded, this operation needs to be removed
// Model filtering patterns from cometapi.md that are not supported by AnythingLLM
module.exports.COMETAPI_IGNORE_PATTERNS = [
  // Image generation models
  "dall-e",
  "dalle",
  "midjourney",
  "mj_",
  "stable-diffusion",
  "sd-",
  "flux-",
  "playground-v",
  "ideogram",
  "recraft-",
  "black-forest-labs",
  "/recraft-v3",
  "recraftv3",
  "stability-ai/",
  "sdxl",
  // Audio generation models
  "suno_",
  "tts",
  "whisper",
  // Video generation models
  "runway",
  "luma_",
  "luma-",
  "veo",
  "kling_",
  "minimax_video",
  "hunyuan-t1",
  // Utility models
  "embedding",
  "search-gpts",
  "files_retrieve",
  "moderation",
  // Deepl
  "deepl",
];

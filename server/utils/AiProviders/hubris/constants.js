// Model filtering patterns for Hubris models without modality metadata.
// Primary filtering uses `output_modalities` from GET /v1/models (must include "text").
// These patterns are a fallback for entries lacking modality fields.
module.exports.HUBRIS_IGNORE_PATTERNS = [
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
  "riverflow",
  "nano-banana",
  // Audio generation models
  "suno_",
  "tts",
  "whisper",
  "speech",
  "transcription",
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
  "embed",
  "search-gpts",
  "files_retrieve",
  "moderation",
  // Deepl
  "deepl",
];

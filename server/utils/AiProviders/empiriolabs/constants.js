// EmpirioLabs hosts chat, image, video, audio, transcription, rerank, embedding,
// and 3D models behind one OpenAI-compatible API. AnythingLLM's LLM provider only
// supports chat-completions models, so we filter the `/v1/models` catalog down to
// chat-capable models by removing ids that match these non-chat patterns.
module.exports.EMPIRIOLABS_IGNORE_PATTERNS = [
  // Image generation / editing models
  "image",
  "flux",
  "seedream",
  "seedance",
  "qwen-image",
  "wan-",
  "nova-canvas",
  "nova-reel",
  "janus",
  "hunyuan-video",
  "kling",
  "grok-imagine",
  // Audio / music / speech models
  "tts-",
  "whisper",
  "deepgram",
  "ace-step",
  "soulx",
  "podcast",
  "inworld",
  // Video generation models
  "veo",
  "runway",
  "pixverse",
  // 3D generation models
  "trellis",
  "3d",
  // Retrieval / utility models
  "embedding",
  "embed",
  "rerank",
  "reranker",
  "moderation",
];

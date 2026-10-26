const fs = require("fs");
const os = require("os");
const { EmbeddedLemonadeEngine } = require("./engine");

/**
 * Three models (fastest, balanced, most capable) for the hardware this container can use, shown during onboarding.
 * Picks are maintained by hand and favor models that download quickly and run comfortably, not the largest model
 * the hardware could load. Every id must be in models.json.
 *
 * CPU tiers follow desktop's ModelSuggestion sizes. GPU tiers apply when lemond reports a GPU with enough VRAM.
 * Qwen picks are Qwen3.5 or newer (every Qwen3.5 model has vision) - MTP variants on a GPU, where they are faster.
 */
const PICKS = {
  // CPU only (or a GPU with too little VRAM), by system RAM
  "cpu-low": [
    "Qwen3.5-0.8B-GGUF",
    "Llama-3.2-3B-Instruct-GGUF",
    "Qwen3.5-2B-GGUF",
  ],
  "cpu-medium": [
    "Qwen3.5-2B-GGUF",
    "Llama-3.2-3B-Instruct-GGUF",
    "Qwen3.5-4B-GGUF",
  ],
  "cpu-high": [
    "Llama-3.2-3B-Instruct-GGUF",
    "Qwen3.5-4B-GGUF",
    "Qwen3.5-9B-GGUF",
  ],
  // GPU, by VRAM of the largest GPU
  "gpu-8": [
    "Qwen3.5-2B-MTP-GGUF",
    "Qwen3.5-4B-MTP-GGUF",
    "Gemma-4-E4B-it-GGUF",
  ],
  "gpu-16": [
    "Qwen3.5-4B-MTP-GGUF",
    "Qwen3.5-9B-MTP-GGUF",
    "gpt-oss-20b-mxfp4-GGUF",
  ],
  "gpu-24": ["Qwen3.5-4B-MTP-GGUF", "Qwen3.5-9B-MTP-GGUF", "Qwen3.8-27B-GGUF"],
};

const CATEGORIES = [
  {
    category: "fastest",
    label: "Fastest",
    description: "Quick replies and light on resources.",
  },
  {
    category: "balanced",
    label: "Balanced",
    description: "A good mix of speed and quality.",
  },
  {
    category: "mostCapable",
    label: "Most capable",
    description: "The best answers this hardware runs comfortably.",
  },
];

const GB = 1024 ** 3;

/** Memory this container may use - the cgroup limit when one is set, otherwise the machine's RAM. */
function containerMemoryBytes() {
  let limit = Infinity;
  try {
    const raw = fs.readFileSync("/sys/fs/cgroup/memory.max", "utf8").trim();
    if (raw !== "max") limit = Number(raw);
  } catch {}
  return Math.min(os.totalmem(), limit);
}

/** VRAM (bytes) of the largest GPU lemond can use, or 0 when there is none. */
async function largestGpuVramBytes() {
  const info = await fetch(
    `${EmbeddedLemonadeEngine.baseUrl}/api/v1/system-info`
  )
    .then((res) => (res.ok ? res.json() : {}))
    .catch(() => ({}));
  const gpus = [
    ...(info?.devices?.nvidia_gpu ?? []),
    ...(info?.devices?.amd_gpu ?? []),
  ].filter((gpu) => gpu && gpu.available !== false);
  const vramGb = Math.max(0, ...gpus.map((gpu) => Number(gpu.vram_gb) || 0));
  return vramGb * GB;
}

function tierFor(ramBytes, vramBytes) {
  if (vramBytes >= 24 * GB) return "gpu-24";
  if (vramBytes >= 16 * GB) return "gpu-16";
  if (vramBytes >= 8 * GB) return "gpu-8";
  if (ramBytes >= 24 * GB) return "cpu-high";
  if (ramBytes >= 8 * GB) return "cpu-medium";
  return "cpu-low";
}

/**
 * @param {Array<object>} models - EmbeddedLemonadeLLM.availableModels()
 * @returns {Promise<{tier: string, ramGb: number, vramGb: number, recommendations: Array<object>}>}
 */
async function recommendModels(models = []) {
  const ramBytes = containerMemoryBytes();
  const vramBytes = await largestGpuVramBytes();
  const tier = tierFor(ramBytes, vramBytes);
  const byId = new Map(models.map((model) => [model.id, model]));
  const recommendations = PICKS[tier]
    .map((id, i) => ({ ...CATEGORIES[i], model: byId.get(id) ?? null }))
    .filter((pick) => !!pick.model);
  return {
    tier,
    ramGb: Math.round((ramBytes / GB) * 10) / 10,
    vramGb: Math.round((vramBytes / GB) * 10) / 10,
    recommendations,
  };
}

module.exports = { recommendModels };

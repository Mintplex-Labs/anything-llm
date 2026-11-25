const fs = require("fs");
const os = require("os");
const {
  recommendModels,
} = require("../../../../utils/AiProviders/embeddedLemonade/recommendations");
const MODEL_REGISTRY = require("../../../../utils/AiProviders/embeddedLemonade/models.json");

const GB = 1024 ** 3;
const ORIGINAL_FETCH = global.fetch;
const readFileSync = fs.readFileSync;
const ALL_MODELS = MODEL_REGISTRY.models.map((m) => ({ id: m.id }));

/**
 * @param {{totalGb: number, cgroup?: string, systemInfo?: object|null}} hardware
 * cgroup is /sys/fs/cgroup/memory.max (missing when undefined); systemInfo null fails the lemond request.
 */
function mockHardware({ totalGb, cgroup, systemInfo = {} }) {
  jest.spyOn(os, "totalmem").mockReturnValue(totalGb * GB);
  jest.spyOn(fs, "readFileSync").mockImplementation((file, ...args) => {
    if (file !== "/sys/fs/cgroup/memory.max")
      return readFileSync(file, ...args);
    if (cgroup === undefined) throw new Error("ENOENT");
    return cgroup;
  });
  global.fetch = jest.fn(async () =>
    systemInfo === null
      ? { ok: false, json: async () => ({}) }
      : { ok: true, json: async () => systemInfo }
  );
}

const gpu = (kind, vram_gb, extra = {}) => ({
  devices: { [kind]: [{ vram_gb, ...extra }] },
});

afterEach(() => {
  global.fetch = ORIGINAL_FETCH;
  jest.restoreAllMocks();
});

describe("recommendModels", () => {
  it.each([
    ["7.9 GB RAM", { totalGb: 7.9 }, "cpu-low"],
    ["8 GB RAM", { totalGb: 8 }, "cpu-medium"],
    ["23.9 GB RAM", { totalGb: 23.9 }, "cpu-medium"],
    ["24 GB RAM", { totalGb: 24 }, "cpu-high"],
    [
      "a 4 GB cgroup limit on a 64 GB host",
      { totalGb: 64, cgroup: `${4 * GB}\n` },
      "cpu-low",
    ],
    ["an unlimited cgroup", { totalGb: 16, cgroup: "max\n" }, "cpu-medium"],
    [
      "7.9 GB NVIDIA",
      { totalGb: 64, systemInfo: gpu("nvidia_gpu", 7.9) },
      "cpu-high",
    ],
    ["8 GB NVIDIA", { totalGb: 4, systemInfo: gpu("nvidia_gpu", 8) }, "gpu-8"],
    ["16 GB AMD", { totalGb: 4, systemInfo: gpu("amd_gpu", 16) }, "gpu-16"],
    [
      "24 GB NVIDIA",
      { totalGb: 4, systemInfo: gpu("nvidia_gpu", 24) },
      "gpu-24",
    ],
    [
      "VRAM reported as a string",
      { totalGb: 4, systemInfo: gpu("nvidia_gpu", "16") },
      "gpu-16",
    ],
    [
      "an unavailable GPU",
      { totalGb: 16, systemInfo: gpu("amd_gpu", 24, { available: false }) },
      "cpu-medium",
    ],
    [
      "a failed system-info request",
      { totalGb: 16, systemInfo: null },
      "cpu-medium",
    ],
  ])("picks the %s tier", async (_, hardware, tier) => {
    mockHardware(hardware);
    const result = await recommendModels(ALL_MODELS);
    expect(result.tier).toBe(tier);
    expect(result.recommendations.map((r) => r.category)).toEqual([
      "fastest",
      "balanced",
      "mostCapable",
    ]);
  });

  it("uses the largest of several GPUs", async () => {
    mockHardware({
      totalGb: 8,
      systemInfo: {
        devices: {
          nvidia_gpu: [{ vram_gb: 8 }],
          amd_gpu: [{ vram_gb: 24 }],
        },
      },
    });
    const result = await recommendModels(ALL_MODELS);
    expect(result).toMatchObject({ tier: "gpu-24", ramGb: 8, vramGb: 24 });
  });

  it("only recommends models from the registry, each as its listing", async () => {
    mockHardware({ totalGb: 16 });
    const { recommendations } = await recommendModels(ALL_MODELS);
    for (const { model } of recommendations)
      expect(ALL_MODELS).toContainEqual(model);
  });

  it("leaves out picks that are not in the model list", async () => {
    mockHardware({ totalGb: 16 });
    const { recommendations } = await recommendModels([
      { id: "Qwen3.5-4B-GGUF" },
    ]);
    expect(recommendations).toEqual([
      expect.objectContaining({
        category: "mostCapable",
        model: { id: "Qwen3.5-4B-GGUF" },
      }),
    ]);
    await expect(recommendModels([])).resolves.toMatchObject({
      recommendations: [],
    });
  });

  it("recommends models that exist for every tier", async () => {
    for (const vram of [0, 8, 16, 24])
      for (const totalGb of [4, 16, 32]) {
        mockHardware({ totalGb, systemInfo: gpu("nvidia_gpu", vram) });
        const { recommendations } = await recommendModels(ALL_MODELS);
        expect(recommendations).toHaveLength(3);
        jest.restoreAllMocks();
      }
  });
});

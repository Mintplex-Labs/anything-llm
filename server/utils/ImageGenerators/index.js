/**
 * Generates an image from a prompt using the system-configured provider and
 * persists it to `storage/generated-images`. This is the single shared entry
 * point used by the `/img` chat command and the image generation endpoints.
 * @param {{prompt: string, size?: string}} params
 * @returns {Promise<{storageFilename: string, filename: string, fileSize: number, buffer: Buffer}>}
 */
async function generateImageForWorkspace({ prompt, size = "512x512" }) {
  // Required lazily to avoid a circular dependency during boot (helpers/files
  // are loaded early and transitively reach this module).
  const { getImageGeneratorProvider } = require("../helpers");
  const { saveGeneratedImage } = require("../files");
  const provider = getImageGeneratorProvider();
  const { buffer } = await provider.generateImage({ prompt, size });
  const saved = await saveGeneratedImage({ buffer, prompt });
  return { ...saved, buffer };
}

module.exports = { generateImageForWorkspace };

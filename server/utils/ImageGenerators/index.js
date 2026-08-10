/**
 * Generates an image from a prompt using the system-configured provider and
 * persists it to `storage/generated-images`. This is the single shared entry
 * point used by the `/img` chat command and the image generation endpoints.
 * @param {{prompt: string, size?: string}} params - size defaults to the
 * provider's configured size (IMAGE_GEN_SIZE_PREF) when omitted.
 * @returns {Promise<{storageFilename: string, filename: string, fileSize: number, buffer: Buffer}>}
 */
async function generateImageForWorkspace({ prompt, size, signal }) {
  // Required lazily to avoid a circular dependency during boot (helpers/files
  // are loaded early and transitively reach this module).
  const { getImageGeneratorProvider } = require("../helpers");
  const { saveGeneratedImage } = require("../files");
  const provider = getImageGeneratorProvider();
  const { buffer } = await provider.generateImage({ prompt, size, signal });
  const saved = await saveGeneratedImage({ buffer, prompt });
  return { ...saved, buffer };
}

/**
 * Edits/transforms images from a prompt + reference images using the
 * system-configured provider. Falls back to generation if the provider
 * doesn't support editing (Ollama handles this internally).
 * @param {{prompt: string, images: Buffer[], size?: string, signal?: AbortSignal}} params
 * @returns {Promise<{storageFilename: string, filename: string, fileSize: number, buffer: Buffer}>}
 */
async function editImageForWorkspace({ prompt, images, size, signal }) {
  const { getImageGeneratorProvider } = require("../helpers");
  const { saveGeneratedImage } = require("../files");
  const provider = getImageGeneratorProvider();
  const { buffer, notice } = await provider.editImage({
    prompt,
    images,
    size,
    signal,
  });
  const saved = await saveGeneratedImage({ buffer, prompt });
  return { ...saved, buffer, ...(notice && { notice }) };
}

module.exports = { generateImageForWorkspace, editImageForWorkspace };

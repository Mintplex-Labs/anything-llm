const { WorkspaceChats } = require("../../../models/workspaceChats");
const {
  generateImageForWorkspace,
  editImageForWorkspace,
} = require("../../ImageGenerators");
const { writeResponseChunk } = require("../../helpers/chat/responses");
const path = require("path");
const fs = require("fs");

/**
 * Handles the `/img <prompt>` slash command: generates an image, stores it, and
 * persists the chat. The command branch in stream.js does not persist on its own,
 * so the WorkspaceChat is written here; the image reference travels in the
 * response `outputs` array so it renders both live and on reload.
 * @param {object} workspace - workspace the chat belongs to
 * @param {string} message - raw user message, including the `/img` prefix
 * @param {string} msgUUID - uuid for the streamed response chunk
 * @param {object|null} user - requesting user
 * @param {object|null} thread - thread when the chat is in one
 * @param {object|null} response - SSE response stream for emitting progress events
 * @param {Array} attachments - uploaded file attachments
 * @param {AbortSignal|null} signal - optional external abort signal (e.g. from agent session)
 * @returns {Promise<object>} response chunk written back over the stream
 */
async function generateImage(
  workspace,
  message,
  msgUUID,
  user = null,
  thread = null,
  response = null,
  attachments = [],
  signal = null
) {
  const prompt = String(message)
    .replace(/^\/img\s*/i, "")
    .trim();

  if (!prompt.length) {
    return {
      uuid: msgUUID,
      type: "textResponse",
      textResponse: "Please provide a prompt, e.g. `/img a red fox in snow`.",
      sources: [],
      close: true,
      error: false,
    };
  }

  // Show friendly "not set up" message instead of generic provider error
  const { getImageGeneratorProvider } = require("../../helpers");
  try {
    getImageGeneratorProvider();
  } catch {
    const canConfigure = !user || user.role === "admin";
    return {
      uuid: msgUUID,
      type: "textResponse",
      textResponse: "",
      sources: [],
      close: true,
      error: canConfigure
        ? "Image generation isn't set up yet. Choose a provider in Settings → Image Generation."
        : "Image generation isn't set up yet. Contact an admin to configure it.",
    };
  }

  try {
    if (response) {
      writeResponseChunk(response, {
        uuid: msgUUID,
        type: "imageGenerationPending",
        textResponse: null,
        sources: [],
        close: false,
        error: false,
      });
    }

    const { combineAbortSignals } = require("../../helpers/abortSignals");
    const disconnectController = new AbortController();
    if (response && typeof response.on === "function")
      response.on("close", () => disconnectController.abort());
    const combinedSignal =
      combineAbortSignals([disconnectController.signal, signal]) ??
      disconnectController.signal;

    const imageBuffers = resolveImageBuffers(attachments);
    const result =
      imageBuffers.length > 0
        ? await editImageForWorkspace({
            prompt,
            images: imageBuffers,
            signal: combinedSignal,
          })
        : await generateImageForWorkspace({ prompt, signal: combinedSignal });
    const { storageFilename, filename, fileSize, notice } = result;

    const outputs = [
      {
        type: "imageGenerationCard",
        payload: { storageFilename, filename, fileSize, prompt },
      },
    ];
    let textResponse = `Generated an image for: "${prompt}"`;
    if (notice) textResponse += `\n\n_${notice}_`;

    const { chat } = await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: message,
      response: {
        text: textResponse,
        sources: [],
        type: "textResponse",
        outputs,
        attachments,
      },
      user,
      threadId: thread?.id || null,
      include: true,
    });

    return {
      uuid: msgUUID,
      type: "textResponse",
      textResponse,
      sources: [],
      outputs,
      chatId: chat?.id || null,
      close: true,
      error: false,
    };
  } catch (e) {
    const { isAbortError } = require("../../helpers/abortSignals");
    if (isAbortError(e)) {
      return {
        uuid: msgUUID,
        type: "textResponse",
        textResponse: "",
        sources: [],
        close: true,
        error: false,
      };
    }
    return {
      uuid: msgUUID,
      type: "textResponse",
      textResponse: "",
      sources: [],
      close: true,
      error: `Image generation failed: ${e.message}`,
    };
  }
}

/**
 * Extracts image Buffers from chat attachments. Supports both:
 * - base64 data-URL content strings (from pasted/dropped images)
 * - storageFilename references (from the "Edit" action on generated images)
 * Non-image attachments are silently skipped.
 * @param {Array} attachments
 * @returns {Buffer[]}
 */
function resolveImageBuffers(attachments = []) {
  const {
    generatedImagesPath,
    isWithin,
    GENERATED_IMAGE_FILENAME_PATTERN,
  } = require("../../files");
  const buffers = [];
  for (const att of attachments) {
    if (!att.mime?.startsWith("image/")) continue;

    if (att.storageFilename) {
      if (!GENERATED_IMAGE_FILENAME_PATTERN.test(att.storageFilename)) continue;
      const filePath = path.resolve(generatedImagesPath, att.storageFilename);
      if (!isWithin(generatedImagesPath, filePath) || !fs.existsSync(filePath))
        continue;
      buffers.push(fs.readFileSync(filePath));
      continue;
    }

    if (att.contentString) {
      const base64 = att.contentString.includes(",")
        ? att.contentString.split(",").pop()
        : att.contentString;
      buffers.push(Buffer.from(base64, "base64"));
    }
  }
  return buffers;
}

module.exports = { generateImage };

const { WorkspaceChats } = require("../../../models/workspaceChats");
const { generateImageForWorkspace } = require("../../ImageGenerators");

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
 * @returns {Promise<object>} response chunk written back over the stream
 */
async function generateImage(
  workspace,
  message,
  msgUUID,
  user = null,
  thread = null
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
      textResponse: canConfigure
        ? "Image generation isn't set up yet. Choose a provider in Settings → Image Generation."
        : "Image generation isn't set up yet. Contact an admin to configure it.",
      sources: [],
      close: true,
      error: false,
    };
  }

  try {
    const { storageFilename, filename, fileSize } =
      await generateImageForWorkspace({ prompt });

    const outputs = [
      {
        type: "imageGenerationCard",
        payload: { storageFilename, filename, fileSize, prompt },
      },
    ];
    const textResponse = `Generated an image for: "${prompt}"`;

    const { chat } = await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: message,
      response: {
        text: textResponse,
        sources: [],
        type: "textResponse",
        outputs,
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
    return {
      uuid: msgUUID,
      type: "textResponse",
      textResponse: `Image generation failed: ${e.message}`,
      sources: [],
      close: true,
      error: false,
    };
  }
}

module.exports = { generateImage };

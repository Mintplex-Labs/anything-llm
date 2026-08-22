const { v4: uuidv4 } = require("uuid");
const {
  generateImageForWorkspace,
  editImageForWorkspace,
} = require("../../../ImageGenerators");
const { resolveImageBuffers } = require("../../../chats/commands/img");
const { WorkspaceChats } = require("../../../../models/workspaceChats");
const { safeJSONStringify } = require("../../../helpers/chat/responses");

/**
 * Collects the image buffers an edit request should transform. Prefers the
 * images attached to the most recent user message and falls back to the image
 * this session generated last, which is not yet in the persisted chat history.
 * @param {object} aibitat
 * @returns {Buffer[]}
 */
function sourceImages(aibitat) {
  const lastUserMessage = [...aibitat.chats]
    .reverse()
    .find((chat) => chat.from === "USER");
  const images = resolveImageBuffers(lastUserMessage?.attachments || []);
  if (images.length || !aibitat._lastGeneratedImage) return images;
  return resolveImageBuffers([
    { mime: "image/png", storageFilename: aibitat._lastGeneratedImage },
  ]);
}

/**
 * Writes the outputs collected so far onto the chat row reserved for this reply.
 * The image serve endpoint authorizes a request by finding a chat that references
 * the file, so that reference has to exist before the card asks for the image -
 * the reply itself is not persisted until the agent finishes its turn.
 * @param {object} aibitat
 */
async function persistOutputs(aibitat) {
  if (!aibitat.trackedChatId) return;
  await WorkspaceChats._update(aibitat.trackedChatId, {
    response: safeJSONStringify({ outputs: aibitat._pendingOutputs }),
  });
}

const generateImage = {
  name: "generate-image",
  startupConfig: {
    params: {},
  },
  plugin: function () {
    return {
      name: this.name,
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Generate an image from a text prompt, or edit an image already in the conversation. Use for any request to draw, create, render, or modify a picture.",
          examples: [
            {
              prompt: "Generate an image of a red fox in the snow",
              call: JSON.stringify({ prompt: "a red fox in the snow" }),
            },
            {
              prompt: "Make that image black and white",
              call: JSON.stringify({
                prompt: "make the image black and white",
                edit: true,
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              prompt: {
                type: "string",
                description:
                  "Detailed description of the image to create, or of the change to apply when editing.",
              },
              size: {
                type: "string",
                description:
                  "Image dimensions as WIDTHxHEIGHT (eg: 512x512, 1024x1024). Omit to use the system default.",
              },
              edit: {
                type: "boolean",
                description:
                  "Set true to edit an image already in the conversation instead of creating a new one.",
              },
            },
            additionalProperties: false,
          },
          required: ["prompt"],
          handler: async function ({ prompt, size = null, edit = false }) {
            const { getImageGeneratorProvider } = require("../../../helpers");
            try {
              getImageGeneratorProvider();
            } catch {
              this.super.introspect(
                `${this.caller}: No image generation provider is configured.`
              );
              return "No image generation provider is set up on this instance, so no image could be created. Tell the user to configure one in Settings > Image Generation (an admin must do this) and then try again.";
            }

            // Ties the placeholder card to the result so the frontend can swap
            // or drop it once generation settles.
            const pendingId = uuidv4();
            try {
              const images = edit ? sourceImages(this.super) : [];
              this.super.introspect(
                `${this.caller}: ${images.length ? "Editing image" : "Generating image"} - "${prompt}"`
              );
              this.super.socket?.send?.("imageGenerationPending", {
                pendingId,
                prompt,
              });

              // Models like to invent sizes ("large", "square"), so anything
              // that is not WIDTHxHEIGHT falls back to the system default.
              if (!/^\d+x\d+$/.test(String(size))) size = null;

              const signal = this.super.abortController?.signal ?? null;
              const { storageFilename, filename, fileSize, notice } =
                images.length > 0
                  ? await editImageForWorkspace({
                      prompt,
                      images,
                      size,
                      signal,
                    })
                  : await generateImageForWorkspace({ prompt, size, signal });

              // Register the card as a pending output so it is saved with the
              // reply and re-renders when the chat is reloaded.
              const output = {
                type: "imageGenerationCard",
                payload: { storageFilename, filename, fileSize, prompt },
              };
              if (!Array.isArray(this.super._pendingOutputs))
                this.super._pendingOutputs = [];
              this.super._pendingOutputs.push(output);
              this.super._lastGeneratedImage = storageFilename;
              await persistOutputs(this.super);

              this.super.socket?.send?.("imageGenerationCard", {
                pendingId,
                text: `Generated an image for: "${prompt}"`,
                outputs: [output],
              });

              return `The image was generated and is already displayed to the user.${notice ? ` Note: ${notice}.` : ""} Confirm it is ready in one short sentence - do not describe the image or repeat the prompt.`;
            } catch (error) {
              this.super.socket?.send?.("imageGenerationCard", {
                pendingId,
                text: error.message,
                failed: true,
              });
              const { isAbortError } = require("../../../helpers/abortSignals");
              if (isAbortError(error)) return "Image generation was cancelled.";
              this.super.handlerProps.log(
                `generate-image raised an error. ${error.message}`
              );
              return `Let the user know the image could not be generated. ${error.message}`;
            }
          },
        });
      },
    };
  },
};

module.exports = { generateImage };

/* eslint-env jest */
// `utils/files` resolves its storage paths from STORAGE_DIR at require time.
process.env.STORAGE_DIR = __dirname;
jest.mock("../../../../../utils/ImageGenerators", () => ({
  generateImageForWorkspace: jest.fn(),
  editImageForWorkspace: jest.fn(),
}));
jest.mock("../../../../../utils/helpers", () => ({
  getImageGeneratorProvider: jest.fn(),
}));

const {
  generateImageForWorkspace,
  editImageForWorkspace,
} = require("../../../../../utils/ImageGenerators");
const {
  generateImage,
} = require("../../../../../utils/agents/aibitat/plugins/generate-image.js");

const SAVED_IMAGE = {
  storageFilename: "generated-image-abc.png",
  filename: "a-fox.png",
  fileSize: 100,
  buffer: Buffer.from("image-bytes"),
};

function setupPlugin(chats = []) {
  const aibitat = {
    chats,
    introspect: jest.fn(),
    handlerProps: { log: jest.fn() },
    socket: { send: jest.fn() },
    function: (config) => (aibitat._fn = config),
  };
  generateImage.plugin.call(generateImage).setup(aibitat);
  return { aibitat, handler: aibitat._fn.handler.bind(aibitat._fn) };
}

beforeEach(() => jest.clearAllMocks());

describe("generate-image agent skill", () => {
  test("generates an image and registers the card for live + historical render", async () => {
    generateImageForWorkspace.mockResolvedValue(SAVED_IMAGE);
    const { aibitat, handler } = setupPlugin();

    await handler({ prompt: "a red fox in the snow", size: "512x512" });

    expect(generateImageForWorkspace).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: "a red fox in the snow",
        size: "512x512",
      })
    );
    const expectedOutput = {
      type: "imageGenerationCard",
      payload: {
        storageFilename: SAVED_IMAGE.storageFilename,
        filename: SAVED_IMAGE.filename,
        fileSize: SAVED_IMAGE.fileSize,
        prompt: "a red fox in the snow",
      },
    };
    // The persisted output must not carry the inline image, the live one must -
    // the serve endpoint cannot authorize the image until the chat is saved.
    expect(aibitat._pendingOutputs).toEqual([expectedOutput]);
    const [type, , extras] = aibitat.socket.send.mock.calls.find(
      ([type]) => type === "imageGenerationCard"
    );
    expect(type).toBe("imageGenerationCard");
    expect(extras.outputs[0].payload).toEqual({
      ...expectedOutput.payload,
      dataUrl: `data:image/png;base64,${SAVED_IMAGE.buffer.toString("base64")}`,
    });
  });

  test("shows a placeholder card and swaps it for the result", async () => {
    generateImageForWorkspace.mockResolvedValue(SAVED_IMAGE);
    const { aibitat, handler } = setupPlugin();

    await handler({ prompt: "a fox" });

    const [pending, card] = aibitat.socket.send.mock.calls;
    expect(pending[0]).toBe("imageGenerationPending");
    expect(card[0]).toBe("imageGenerationCard");
    expect(card[2].pendingId).toBe(pending[2].pendingId);
  });

  test("clears the placeholder card when generation fails", async () => {
    generateImageForWorkspace.mockRejectedValue(new Error("provider is down"));
    const { aibitat, handler } = setupPlugin();

    const reply = await handler({ prompt: "a fox" });

    const [pending, failure] = aibitat.socket.send.mock.calls;
    expect(failure[0]).toBe("imageGenerationCard");
    expect(failure[2]).toEqual({
      pendingId: pending[2].pendingId,
      failed: true,
    });
    expect(reply).toContain("provider is down");
  });

  test("drops a size the model invented instead of failing the call", async () => {
    generateImageForWorkspace.mockResolvedValue(SAVED_IMAGE);
    const { handler } = setupPlugin();

    await handler({ prompt: "a fox", size: "large" });

    expect(generateImageForWorkspace).toHaveBeenCalledWith(
      expect.objectContaining({ size: null })
    );
  });

  test("edits using the images attached to the last user message", async () => {
    editImageForWorkspace.mockResolvedValue(SAVED_IMAGE);
    const { handler } = setupPlugin([
      { from: "USER", content: "make it blue" },
      {
        from: "USER",
        content: "here is my photo",
        attachments: [
          {
            mime: "image/png",
            contentString: `data:image/png;base64,${Buffer.from("source").toString("base64")}`,
          },
        ],
      },
    ]);

    await handler({ prompt: "make it blue", edit: true });

    expect(generateImageForWorkspace).not.toHaveBeenCalled();
    expect(editImageForWorkspace).toHaveBeenCalledWith(
      expect.objectContaining({ images: [Buffer.from("source")] })
    );
  });

  test("falls back to the image generated earlier in the session when editing", async () => {
    generateImageForWorkspace.mockResolvedValue(SAVED_IMAGE);
    editImageForWorkspace.mockResolvedValue(SAVED_IMAGE);
    const { handler } = setupPlugin();

    await handler({ prompt: "a fox" });
    await handler({ prompt: "now make it blue", edit: true });

    expect(editImageForWorkspace).toHaveBeenCalledWith(
      expect.objectContaining({ images: [SAVED_IMAGE.buffer] })
    );
  });
});

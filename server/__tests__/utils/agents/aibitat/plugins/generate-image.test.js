/* eslint-env jest */
const fs = require("fs");
const os = require("os");
const path = require("path");

// `utils/files` resolves its storage paths from STORAGE_DIR at require time.
process.env.STORAGE_DIR = fs.mkdtempSync(
  path.join(os.tmpdir(), "generate-image-test-")
);
jest.mock("../../../../../utils/ImageGenerators", () => ({
  generateImageForWorkspace: jest.fn(),
  editImageForWorkspace: jest.fn(),
}));
jest.mock("../../../../../utils/helpers", () => ({
  getImageGeneratorProvider: jest.fn(),
}));
jest.mock("../../../../../models/workspaceChats", () => ({
  WorkspaceChats: { _update: jest.fn() },
}));

const {
  generateImageForWorkspace,
  editImageForWorkspace,
} = require("../../../../../utils/ImageGenerators");
const { WorkspaceChats } = require("../../../../../models/workspaceChats");
const {
  generateImage,
} = require("../../../../../utils/agents/aibitat/plugins/generate-image.js");

const SAVED_IMAGE = {
  storageFilename: "img-11111111-2222-3333-4444-555555555555.png",
  filename: "a-fox.png",
  fileSize: 100,
  buffer: Buffer.from("image-bytes"),
};

beforeAll(() => {
  const dir = path.join(process.env.STORAGE_DIR, "generated-images");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, SAVED_IMAGE.storageFilename),
    SAVED_IMAGE.buffer
  );
});

afterAll(() =>
  fs.rmSync(process.env.STORAGE_DIR, { recursive: true, force: true })
);

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
    // The card must only reference the stored file - no image bytes travel over
    // the socket or into the chat record.
    expect(aibitat._pendingOutputs).toEqual([expectedOutput]);
    const [, card] = aibitat.socket.send.mock.calls.find(
      ([type]) => type === "imageGenerationCard"
    );
    expect(card.outputs).toEqual([expectedOutput]);
  });

  test("writes the image reference to the reserved chat before showing the card", async () => {
    generateImageForWorkspace.mockResolvedValue(SAVED_IMAGE);
    const { aibitat, handler } = setupPlugin();
    aibitat.trackedChatId = 42;

    await handler({ prompt: "a fox" });

    // The serve endpoint only authorizes files referenced by a chat record, so
    // the reference has to land before the frontend requests the image.
    expect(WorkspaceChats._update).toHaveBeenCalledWith(42, {
      response: JSON.stringify({ outputs: aibitat._pendingOutputs }),
    });
    expect(WorkspaceChats._update.mock.invocationCallOrder[0]).toBeLessThan(
      aibitat.socket.send.mock.invocationCallOrder[1]
    );
  });

  test("shows a placeholder card and swaps it for the result", async () => {
    generateImageForWorkspace.mockResolvedValue(SAVED_IMAGE);
    const { aibitat, handler } = setupPlugin();

    await handler({ prompt: "a fox" });

    const [pending, card] = aibitat.socket.send.mock.calls;
    expect(pending[0]).toBe("imageGenerationPending");
    expect(card[0]).toBe("imageGenerationCard");
    expect(card[1].pendingId).toBe(pending[1].pendingId);
  });

  test("clears the placeholder card when generation fails", async () => {
    generateImageForWorkspace.mockRejectedValue(new Error("provider is down"));
    const { aibitat, handler } = setupPlugin();

    const reply = await handler({ prompt: "a fox" });

    const [pending, failure] = aibitat.socket.send.mock.calls;
    expect(failure[0]).toBe("imageGenerationCard");
    expect(failure[1]).toEqual({
      pendingId: pending[1].pendingId,
      text: "provider is down",
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
    const { aibitat, handler } = setupPlugin();

    await handler({ prompt: "a fox" });
    await handler({ prompt: "now make it blue", edit: true });

    expect(aibitat._lastGeneratedImage).toBe(SAVED_IMAGE.storageFilename);
    expect(editImageForWorkspace).toHaveBeenCalledWith(
      expect.objectContaining({ images: [SAVED_IMAGE.buffer] })
    );
  });
});

/* eslint-env jest */
const fs = require("fs");
const os = require("os");
const path = require("path");

// `utils/files` resolves its storage paths from STORAGE_DIR at require time.
process.env.STORAGE_DIR = fs.mkdtempSync(
  path.join(os.tmpdir(), "chat-history-attachments-test-")
);
const { chatHistoryAttachments } = require("../../../utils/files");

const GENERATED_FILENAME = "img-11111111-2222-3333-4444-555555555555.png";
const imageAttachment = (mime = "image/png") => ({
  name: "photo",
  mime,
  contentString: `data:${mime};base64,${Buffer.from("photo").toString("base64")}`,
});

beforeAll(() => {
  const dir = path.join(process.env.STORAGE_DIR, "generated-images");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, GENERATED_FILENAME), "generated");
});

afterAll(() =>
  fs.rmSync(process.env.STORAGE_DIR, { recursive: true, force: true })
);

describe("chatHistoryAttachments", () => {
  test("returns nothing for a response without attachments or outputs", () => {
    expect(chatHistoryAttachments({ text: "hi" })).toEqual([]);
    expect(chatHistoryAttachments(undefined)).toEqual([]);
    expect(chatHistoryAttachments(null)).toEqual([]);
  });

  test("keeps uploaded image attachments of any image type", () => {
    const png = imageAttachment("image/png");
    const jpeg = imageAttachment("IMAGE/JPEG");
    expect(chatHistoryAttachments({ attachments: [png, jpeg] })).toEqual([
      png,
      jpeg,
    ]);
  });

  test("drops document and malformed attachments", () => {
    const image = imageAttachment();
    const attachments = chatHistoryAttachments({
      attachments: [
        {
          name: "report.pdf",
          mime: "application/anythingllm-document",
          contentString: Buffer.from("pdf").toString("base64"),
        },
        { name: "no-mime", contentString: "data:image/png;base64,AAAA" },
        null,
        image,
      ],
    });
    expect(attachments).toEqual([image]);
  });

  test("appends generated images after uploaded images", () => {
    const image = imageAttachment();
    const attachments = chatHistoryAttachments({
      attachments: [image],
      outputs: [
        {
          type: "imageGenerationCard",
          payload: { storageFilename: GENERATED_FILENAME, filename: "fox.png" },
        },
      ],
    });
    expect(attachments).toEqual([
      image,
      {
        name: "fox.png",
        mime: "image/png",
        contentString: `data:image/png;base64,${Buffer.from("generated").toString("base64")}`,
      },
    ]);
  });
});

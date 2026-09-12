const resyncExtensions = require("../../../extensions/resync");
jest.mock(
  "../../../processLink",
  () => ({ getLinkText: jest.fn() }),
  { virtual: true }
);

jest.mock(
  "../../../utils/extensions/PaperlessNgx/PaperlessNgxLoader",
  () => {
    const calls = [];
    class PaperlessNgxLoader {
      constructor(opts) {
        calls.push({ constructedWith: opts });
      }
      async fetchDocumentContent(documentId) {
        calls.push({ fetchedDocumentId: documentId });
        return documentId === "123" ? "re-synced document body" : "";
      }
    }
    PaperlessNgxLoader.__calls = calls;
    return PaperlessNgxLoader;
  },
  { virtual: true }
);

describe("resyncPaperlessNgx", () => {
  function buildResponse(chunkSource) {
    return {
      locals: {
        encryptionWorker: {
          expandPayload: () => new URL(chunkSource),
        },
      },
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  }

  test("constructs the default-exported loader and reads the document id from the url host", async () => {
    const chunkSource =
      "paperless-ngx://123?payload=ignored&baseUrl=https%3A%2F%2Fpaperless.example.com%2Fpaperless&token=tok";
    const response = buildResponse(chunkSource);
    await resyncExtensions["paperless-ngx"]({ chunkSource }, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      content: "re-synced document body",
    });
    const loaderModule = require("../../../utils/extensions/PaperlessNgx/PaperlessNgxLoader");
    expect(loaderModule.__calls[0].constructedWith).toEqual({
      baseUrl: "https://paperless.example.com/paperless",
      apiToken: "tok",
    });
    expect(loaderModule.__calls[1].fetchedDocumentId).toBe("123");
  });
});

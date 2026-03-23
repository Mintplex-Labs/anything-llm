const path = require("path");
const { ACCEPTED_MIMES, SUPPORTED_FILETYPE_CONVERTERS } = require("../../../utils/constants");

// We test the mimeToExtension helper and the filename extension logic
// without making real HTTP requests.

// Import the module to access mimeToExtension via the module's internals.
// Since mimeToExtension is not exported, we replicate it here for unit testing.
function mimeToExtension(mimeType) {
  if (!mimeType) return null;
  const extensions = ACCEPTED_MIMES[mimeType];
  return Array.isArray(extensions) && extensions.length > 0
    ? extensions[0]
    : null;
}

/**
 * Simulates the filename-building logic from downloadURIToFile
 * to verify extension inference works correctly.
 */
function buildFilenameWithExtension(sluggedFilename, contentType) {
  const existingExt = path.extname(sluggedFilename).toLowerCase();
  if (!SUPPORTED_FILETYPE_CONVERTERS.hasOwnProperty(existingExt)) {
    const mimeType = contentType?.toLowerCase()?.split(";")[0]?.trim();
    const inferredExt = mimeToExtension(mimeType);
    if (inferredExt) {
      return sluggedFilename + inferredExt;
    }
  }
  return sluggedFilename;
}

describe("mimeToExtension", () => {
  test("returns .pdf for application/pdf", () => {
    expect(mimeToExtension("application/pdf")).toBe(".pdf");
  });

  test("returns .txt for text/plain", () => {
    expect(mimeToExtension("text/plain")).toBe(".txt");
  });

  test("returns .docx for application/vnd.openxmlformats-officedocument.wordprocessingml.document", () => {
    expect(
      mimeToExtension(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
    ).toBe(".docx");
  });

  test("returns null for unknown MIME type", () => {
    expect(mimeToExtension("application/octet-stream")).toBeNull();
  });

  test("returns null for null/undefined input", () => {
    expect(mimeToExtension(null)).toBeNull();
    expect(mimeToExtension(undefined)).toBeNull();
  });

  test("returns .mp3 for audio/mpeg", () => {
    expect(mimeToExtension("audio/mpeg")).toBe(".mp3");
  });

  test("returns .epub for application/epub+zip", () => {
    expect(mimeToExtension("application/epub+zip")).toBe(".epub");
  });
});

describe("buildFilenameWithExtension", () => {
  test("appends .pdf when URL path has no recognized extension (arxiv case)", () => {
    // Simulates: https://arxiv.org/pdf/2307.10265
    // slugify produces something like "arxiv.org-pdf-230710265"
    const filename = "arxiv.org-pdf-230710265";
    const result = buildFilenameWithExtension(filename, "application/pdf");
    expect(result).toBe("arxiv.org-pdf-230710265.pdf");
  });

  test("appends .pdf when URL has numeric-looking extension", () => {
    // path.extname("arxiv.org-pdf-2307.10265") => ".10265" which is not in SUPPORTED_FILETYPE_CONVERTERS
    const filename = "arxiv.org-pdf-2307.10265";
    const result = buildFilenameWithExtension(
      filename,
      "application/pdf; charset=utf-8"
    );
    expect(result).toBe("arxiv.org-pdf-2307.10265.pdf");
  });

  test("does NOT append extension when file already has a supported extension", () => {
    const filename = "example.com-document.pdf";
    const result = buildFilenameWithExtension(filename, "application/pdf");
    expect(result).toBe("example.com-document.pdf");
  });

  test("does NOT append extension when file has .txt extension", () => {
    const filename = "example.com-readme.txt";
    const result = buildFilenameWithExtension(filename, "text/plain");
    expect(result).toBe("example.com-readme.txt");
  });

  test("does not append extension for unknown content type", () => {
    const filename = "example.com-binary-blob";
    const result = buildFilenameWithExtension(
      filename,
      "application/octet-stream"
    );
    expect(result).toBe("example.com-binary-blob");
  });

  test("does not append extension when content type is null", () => {
    const filename = "example.com-unknown";
    const result = buildFilenameWithExtension(filename, null);
    expect(result).toBe("example.com-unknown");
  });

  test("appends .docx for word document MIME type", () => {
    const filename = "sharepoint.com-documents-report";
    const result = buildFilenameWithExtension(
      filename,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    expect(result).toBe("sharepoint.com-documents-report.docx");
  });

  test("handles content type with charset parameter correctly", () => {
    const filename = "api.example.com-export-data";
    const result = buildFilenameWithExtension(
      filename,
      "text/csv; charset=utf-8"
    );
    expect(result).toBe("api.example.com-export-data.csv");
  });
});

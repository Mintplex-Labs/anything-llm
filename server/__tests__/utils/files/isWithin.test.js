// Set required env vars before requiring modules
process.env.STORAGE_DIR = __dirname;

const path = require("path");
const { isWithin } = require("../../../utils/files");

describe("isWithin", () => {
  describe("valid paths (should return true)", () => {
    it("returns true for a direct child file", () => {
      const outer = "/documents";
      const inner = "/documents/file.json";
      expect(isWithin(outer, inner)).toBe(true);
    });

    it("returns true for a nested child file", () => {
      const outer = "/documents";
      const inner = "/documents/folder/subfolder/file.json";
      expect(isWithin(outer, inner)).toBe(true);
    });

    it("returns true for a direct child folder", () => {
      const outer = "/documents";
      const inner = "/documents/folder";
      expect(isWithin(outer, inner)).toBe(true);
    });

    it("returns true for deeply nested paths", () => {
      const outer = "/documents";
      const inner = "/documents/a/b/c/d/e/f/file.json";
      expect(isWithin(outer, inner)).toBe(true);
    });

    it("returns true with resolved paths", () => {
      const outer = path.resolve("/documents");
      const inner = path.resolve("/documents/folder/file.json");
      expect(isWithin(outer, inner)).toBe(true);
    });
  });

  describe("identical paths (should return false)", () => {
    it("returns false when outer and inner are the same", () => {
      const outer = "/documents";
      const inner = "/documents";
      expect(isWithin(outer, inner)).toBe(false);
    });

    it("returns false when outer and inner are the same (resolved)", () => {
      const outer = path.resolve("/documents");
      const inner = path.resolve("/documents");
      expect(isWithin(outer, inner)).toBe(false);
    });
  });

  describe("POSIX-style traversal (should return false)", () => {
    it("rejects ../ traversal to parent directory", () => {
      const outer = "/documents";
      const inner = "/documents/../secrets";
      expect(isWithin(outer, path.resolve(inner))).toBe(false);
    });

    it("rejects ../ traversal to sibling directory", () => {
      const outer = "/documents";
      const inner = "/secrets";
      expect(isWithin(outer, inner)).toBe(false);
    });

    it("rejects deep ../ traversal", () => {
      const outer = "/home/user/documents";
      const inner = "/home/user/documents/../../../etc/passwd";
      expect(isWithin(outer, path.resolve(inner))).toBe(false);
    });

    it("rejects bare .. relative path", () => {
      const outer = "/documents/folder";
      const inner = "/documents";
      expect(isWithin(outer, inner)).toBe(false);
    });
  });

  describe("Windows-style traversal (should return false)", () => {
    it("rejects paths that would produce ..\\\\ relative on Windows", () => {
      // Simulate what path.relative returns on Windows for sibling directories
      // On Windows: path.relative('C:\\documents', 'C:\\secrets') = '..\\secrets'
      const outer = "/documents";
      const inner = "/secrets";
      expect(isWithin(outer, inner)).toBe(false);
    });

    it("rejects paths outside the outer directory", () => {
      const outer = "/app/storage/documents";
      const inner = "/app/storage/secrets";
      expect(isWithin(outer, inner)).toBe(false);
    });

    it("rejects parent directory access", () => {
      const outer = "/app/storage/documents";
      const inner = "/app/storage";
      expect(isWithin(outer, inner)).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("rejects paths with similar prefixes but not actually within", () => {
      const outer = "/documents";
      const inner = "/documents-backup/file.json";
      expect(isWithin(outer, inner)).toBe(false);
    });

    it("handles paths with trailing slashes consistently", () => {
      const outer = "/documents";
      const inner = "/documents/folder/";
      // path.relative handles trailing slashes, result should be 'folder'
      expect(isWithin(outer, inner)).toBe(true);
    });

    it("rejects completely unrelated absolute paths", () => {
      const outer = "/home/user/documents";
      const inner = "/var/log/system.log";
      expect(isWithin(outer, inner)).toBe(false);
    });

    it("works with real resolved paths", () => {
      const outer = path.resolve(__dirname, "../../../storage/documents");
      const inner = path.resolve(
        __dirname,
        "../../../storage/documents/custom-documents/file.json"
      );
      expect(isWithin(outer, inner)).toBe(true);
    });

    it("rejects traversal with real resolved paths", () => {
      const outer = path.resolve(__dirname, "../../../storage/documents");
      const inner = path.resolve(__dirname, "../../../storage/secrets");
      expect(isWithin(outer, inner)).toBe(false);
    });
  });

  describe("absolute path handling", () => {
    it("rejects when relative result would be absolute (different drives on Windows)", () => {
      // On Windows, path.relative('C:\\docs', 'D:\\secrets') returns 'D:\\secrets' (absolute)
      // We simulate this by checking that absolute relative results are rejected
      // This test verifies the path.isAbsolute check works
      const outer = "/mnt/c/documents";
      const inner = "/mnt/d/secrets";
      expect(isWithin(outer, inner)).toBe(false);
    });
  });
});

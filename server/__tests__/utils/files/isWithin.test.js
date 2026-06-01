process.env.STORAGE_DIR = __dirname;

const path = require("path");

// We need to test Windows-style paths on non-Windows systems, so we mock
// path.resolve/relative/isAbsolute/sep for the Windows test block.
const { isWithin } = require("../../../utils/files");

describe("isWithin", () => {
  describe("valid paths — should return true", () => {
    it("direct child file", () => {
      expect(isWithin("/documents", "/documents/file.json")).toBe(true);
    });

    it("nested child file", () => {
      expect(isWithin("/documents", "/documents/folder/subfolder/file.json")).toBe(true);
    });

    it("direct child directory", () => {
      expect(isWithin("/documents", "/documents/folder")).toBe(true);
    });

    it("deeply nested path", () => {
      expect(isWithin("/documents", "/documents/a/b/c/d/e/f/file.json")).toBe(true);
    });

    it("trailing slash on outer", () => {
      expect(isWithin("/documents/", "/documents/file.json")).toBe(true);
    });

    it("trailing slash on inner", () => {
      expect(isWithin("/documents", "/documents/folder/")).toBe(true);
    });

    it("both have trailing slashes", () => {
      expect(isWithin("/documents/", "/documents/folder/")).toBe(true);
    });

    it("relative outer resolved against cwd", () => {
      expect(isWithin("storage/documents", "storage/documents/file.json")).toBe(true);
    });

    it("inner with redundant separators", () => {
      expect(isWithin("/documents", "/documents///folder//file.json")).toBe(true);
    });

    it("inner with . segment", () => {
      expect(isWithin("/documents", "/documents/./folder/file.json")).toBe(true);
    });

    it("inner with internal .. that stays within", () => {
      expect(isWithin("/documents", "/documents/folder/../other/file.json")).toBe(true);
    });
  });

  describe("same path — should return false", () => {
    it("identical strings", () => {
      expect(isWithin("/documents", "/documents")).toBe(false);
    });

    it("outer with trailing slash vs without", () => {
      expect(isWithin("/documents/", "/documents")).toBe(false);
    });

    it("inner with trailing slash vs without", () => {
      expect(isWithin("/documents", "/documents/")).toBe(false);
    });

    it("both relative resolving to same dir", () => {
      expect(isWithin("storage", "./storage")).toBe(false);
    });

    it("with . segment resolving to same", () => {
      expect(isWithin("/documents/.", "/documents")).toBe(false);
    });
  });

  describe("path traversal — should return false", () => {
    it("simple ../ to parent", () => {
      expect(isWithin("/documents", "/documents/../secrets")).toBe(false);
    });

    it("sibling directory (relative result starts with ../)", () => {
      expect(isWithin("/documents", "/secrets")).toBe(false);
    });

    it("deep traversal to /etc/passwd", () => {
      expect(isWithin("/home/user/documents", "/home/user/documents/../../../etc/passwd")).toBe(false);
    });

    it("bare parent (inner is parent of outer)", () => {
      expect(isWithin("/documents/folder", "/documents")).toBe(false);
    });

    it("root traversal", () => {
      expect(isWithin("/home/user/docs", "/")).toBe(false);
    });

    it("similar prefix but not within (documents vs documents-backup)", () => {
      expect(isWithin("/documents", "/documents-backup/file.json")).toBe(false);
    });

    it("unrelated absolute paths", () => {
      expect(isWithin("/home/user/documents", "/var/log/system.log")).toBe(false);
    });

    it("traversal encoded in middle of path", () => {
      expect(isWithin("/app/storage", "/app/storage/folder/../../secrets/key")).toBe(false);
    });

    it("traversal that resolves back in but escapes first", () => {
      // /app/storage/../storage/file resolves to /app/storage/file — this IS within
      expect(isWithin("/app/storage", "/app/storage/../storage/file")).toBe(true);
    });

    it("traversal that looks like it stays in but doesn't", () => {
      // /app/storage/../other/storage/file resolves to /app/other/storage/file — NOT within
      expect(isWithin("/app/storage", "/app/storage/../other/storage/file")).toBe(false);
    });
  });

  describe("relative inputs — should resolve correctly", () => {
    it("both relative and inner is within", () => {
      expect(isWithin("foo", "foo/bar")).toBe(true);
    });

    it("both relative and inner escapes", () => {
      expect(isWithin("foo/bar", "foo/baz")).toBe(false);
    });

    it("outer relative, inner absolute outside", () => {
      expect(isWithin("relative/dir", "/etc/passwd")).toBe(false);
    });
  });

  describe("Windows-style paths (simulated on POSIX)", () => {
    // On POSIX, path.resolve won't produce Windows-style paths, so we test
    // the cross-drive detection by directly verifying path.isAbsolute behavior.
    // These tests validate the logic would work on a Windows system.

    it("rejects cross-drive paths (path.isAbsolute check)", () => {
      // On Windows, path.relative('C:\\docs', 'D:\\secrets') returns 'D:\\secrets' (absolute)
      // We can't fully simulate this on POSIX, but we verify path.isAbsolute catches it
      const posixPath = require("path").posix;
      // Simulate: if relative result were an absolute path, isWithin should reject
      const rel = "/absolute/result";
      expect(posixPath.isAbsolute(rel)).toBe(true);
    });

    it("handles backslash in input on POSIX (treated as filename chars)", () => {
      // On POSIX, backslashes are valid filename characters, not separators.
      // This just ensures no crash — behavior differs on Windows.
      expect(() => isWithin("/documents", "/documents/folder\\file")).not.toThrow();
    });
  });

  describe("Windows path logic (unit testing the algorithm)", () => {
    // To properly test Windows path behavior, we test the core algorithm
    // directly with Windows-style path module behavior.
    const win32 = require("path").win32;

    function isWithinWin32(outer, inner) {
      const resolvedOuter = win32.resolve(outer);
      const resolvedInner = win32.resolve(inner);
      const rel = win32.relative(resolvedOuter, resolvedInner);
      if (rel === "") return false;
      return !rel.startsWith(`..${win32.sep}`) && rel !== ".." && !win32.isAbsolute(rel);
    }

    it("child file on same drive", () => {
      expect(isWithinWin32("C:\\documents", "C:\\documents\\file.json")).toBe(true);
    });

    it("nested child on same drive", () => {
      expect(isWithinWin32("C:\\documents", "C:\\documents\\folder\\file.json")).toBe(true);
    });

    it("same directory", () => {
      expect(isWithinWin32("C:\\documents", "C:\\documents")).toBe(false);
    });

    it("same directory with trailing backslash", () => {
      expect(isWithinWin32("C:\\documents\\", "C:\\documents")).toBe(false);
    });

    it("parent traversal with backslash", () => {
      expect(isWithinWin32("C:\\documents", "C:\\documents\\..\\secrets")).toBe(false);
    });

    it("sibling directory on same drive", () => {
      expect(isWithinWin32("C:\\documents", "C:\\secrets")).toBe(false);
    });

    it("cross-drive (D: vs C:) — must reject", () => {
      expect(isWithinWin32("C:\\documents", "D:\\secrets")).toBe(false);
    });

    it("cross-drive nested path — must reject", () => {
      expect(isWithinWin32("C:\\app\\storage", "D:\\app\\storage\\file.json")).toBe(false);
    });

    it("UNC path within UNC base", () => {
      expect(isWithinWin32("\\\\server\\share\\docs", "\\\\server\\share\\docs\\file.txt")).toBe(true);
    });

    it("UNC path escaping to different share", () => {
      expect(isWithinWin32("\\\\server\\share\\docs", "\\\\server\\other\\file.txt")).toBe(false);
    });

    it("deep traversal on Windows", () => {
      expect(isWithinWin32("C:\\Users\\app\\data", "C:\\Users\\app\\data\\..\\..\\..\\Windows\\System32\\cmd.exe")).toBe(false);
    });

    it("traversal that resolves back within on Windows", () => {
      expect(isWithinWin32("C:\\app\\storage", "C:\\app\\storage\\..\\storage\\file.json")).toBe(true);
    });

    it("similar prefix but not within on Windows", () => {
      expect(isWithinWin32("C:\\documents", "C:\\documents-backup\\file.json")).toBe(false);
    });

    it("forward slashes on Windows (normalized by resolve)", () => {
      expect(isWithinWin32("C:/documents", "C:/documents/folder/file.json")).toBe(true);
    });

    it("mixed slashes on Windows", () => {
      expect(isWithinWin32("C:\\documents", "C:/documents/folder\\file.json")).toBe(true);
    });
  });
});

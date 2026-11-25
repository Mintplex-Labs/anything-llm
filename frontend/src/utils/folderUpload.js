import { fromEvent } from "file-selector";

/**
 * Utilities for folder uploads via drag-and-drop.
 *
 * Folder structure is recovered by getFilesFromUploadEvent, which traverses
 * the drop's FileSystemEntry tree and stamps each file's path relative to the
 * drop (eg: "/rootFolder/sub/file.md") onto RELATIVE_PATH_KEY. That is a
 * standard Chromium API and behaves identically in the browser and in the
 * Electron-based desktop app.
 *
 * We deliberately never read file.path. react-dropzone's default aggregator
 * carries the drop-relative path there, but Electron (<32) pre-fills that
 * same property with the file's absolute OS path (eg: "/Users/me/notes/a.md"),
 * which cannot be grouped into folders.
 */

const RELATIVE_PATH_KEY = "_relativePath";

/**
 * The most specific relative path we know for a dropped file.
 * webkitRelativePath is kept as a fallback so this stays correct if a
 * webkitdirectory input is ever wired up again.
 * @param {File} file
 * @returns {string}
 */
export function filePathOf(file) {
  return file[RELATIVE_PATH_KEY] || file.webkitRelativePath || file.name;
}

/**
 * Reads every entry of a directory. readEntries() returns at most ~100
 * entries per call, so it must be drained until it yields an empty batch or
 * large folders would be silently truncated.
 * @param {FileSystemDirectoryEntry} directory
 * @returns {Promise<FileSystemEntry[]>}
 */
async function allEntriesOf(directory) {
  const reader = directory.createReader();
  const entries = [];

  while (true) {
    const batch = await new Promise((resolve, reject) =>
      reader.readEntries(resolve, reject)
    );
    if (batch.length === 0) break;
    entries.push(...batch);
  }

  return entries;
}

/**
 * Records a file's path relative to the drop. Stored under our own key so it
 * cannot collide with file.path, which Electron and file-selector both write.
 * @param {File} file
 * @param {string} fullPath
 * @returns {File}
 */
function stampRelativePath(file, fullPath) {
  file[RELATIVE_PATH_KEY] = fullPath;
  return file;
}

/**
 * Recursively collects the files under a FileSystemEntry, stamping each one
 * with its path relative to the drop.
 * @param {FileSystemEntry} entry
 * @returns {Promise<File[]>}
 */
async function filesUnderEntry(entry) {
  if (entry.isFile) {
    const file = await new Promise((resolve, reject) =>
      entry.file(resolve, reject)
    );
    return [stampRelativePath(file, entry.fullPath)];
  }

  if (entry.isDirectory) {
    const children = await allEntriesOf(entry);
    const files = await Promise.all(children.map(filesUnderEntry));
    return files.flat();
  }

  return [];
}

/**
 * Custom file aggregator for react-dropzone's getFilesFromEvent option.
 * Drops are traversed with webkitGetAsEntry so nested folders resolve to
 * files with drop-relative paths. Every other invocation shape react-dropzone
 * uses (dragenter bookkeeping, the click-to-upload input's change event,
 * showOpenFilePicker file handles) is delegated to its default aggregator.
 *
 * Not async on purpose: a drop's DataTransferItems are only readable while
 * the drop event is being dispatched, so webkitGetAsEntry must be called
 * before anything yields. The FileSystemEntry objects it returns stay
 * readable after that.
 * @param {(Event|DragEvent|FileSystemFileHandle[])} event
 * @returns {Promise<File[]>}
 */
export function getFilesFromUploadEvent(event) {
  const items =
    event?.type === "drop" ? Array.from(event.dataTransfer?.items || []) : [];
  const fileItems = items.filter((item) => item.kind === "file");
  const entries = fileItems.map((item) => item.webkitGetAsEntry?.() || null);

  if (entries.length === 0 || entries.some((entry) => entry === null))
    return fromEvent(event);

  const collected = entries.map((entry, index) => {
    // Loose files dropped outside a folder keep their native File object so
    // nonstandard platform properties survive — the desktop app reads
    // Electron's file.path off uploads for its local file sync feature.
    if (entry.isFile) {
      const nativeFile = fileItems[index].getAsFile();
      if (nativeFile)
        return Promise.resolve([stampRelativePath(nativeFile, entry.fullPath)]);
    }
    return filesUnderEntry(entry);
  });

  return Promise.all(collected).then((files) => files.flat());
}

/**
 * Splits a file's path into clean segments, dropping the leading "/" that
 * entry.fullPath carries.
 * @param {File} file
 * @returns {string[]}
 */
function pathSegmentsOf(file) {
  return filePathOf(file)
    .split("/")
    .filter((segment) => segment !== "" && segment !== ".");
}

/**
 * Hidden files (dot-prefixed, eg: .DS_Store) or files inside hidden folders
 * (eg: .git) are OS/tooling noise that would fail or pollute processing, so
 * folder uploads skip them.
 * @param {string[]} segments
 * @returns {boolean}
 */
function isHiddenPath(segments) {
  return segments.some((segment) => segment.startsWith("."));
}

/**
 * Deepest drop we accept: a folder plus the files directly inside it. Nested
 * subfolders are skipped until deep nesting is supported.
 */
const MAX_DEPTH = 2;

/**
 * Groups a drop into loose files and per-folder groups.
 * Files more than one path segment deep belong to the folder named by their
 * first segment; everything else is a loose file.
 * @param {File[]} files
 * @returns {{
 *  looseFiles: File[],
 *  folders: Array<{folderName: string, files: Array<{file: File, relativePath: string}>}>,
 * }}
 */
export function groupDroppedFiles(files = []) {
  const looseFiles = [];
  const foldersByName = {};

  for (const file of files) {
    const segments = pathSegmentsOf(file);

    if (segments.length <= 1) {
      looseFiles.push(file);
      continue;
    }
    if (isHiddenPath(segments)) continue;

    // Only accept files directly inside the top-level folder (no nesting).
    // Nested subfolders are skipped — deep nesting support will be added in
    // a future PR.
    if (segments.length > MAX_DEPTH) continue;

    const folderName = segments[0];
    const relativePath = segments[1];
    if (!foldersByName[folderName])
      foldersByName[folderName] = { folderName, files: [] };
    foldersByName[folderName].files.push({ file, relativePath });
  }

  return {
    looseFiles,
    folders: Object.values(foldersByName),
  };
}

/**
 * Re-targets a drop at one specific folder, for drops aimed at a folder row.
 *
 * Only loose files are accepted. Storage is a flat two segments
 * (folder/file.json), so a dropped folder has nowhere to go - keeping its
 * structure would need nesting we do not support, and flattening it would
 * produce files literally named "subfolder/report.pdf". Dropping a folder
 * onto the main dropzone still works and creates a folder of its own.
 * @param {File[]} files
 * @param {string} folderName - destination folder
 * @returns {{
 *  files: Array<{file: File, relativePath: string}>,
 *  skipped: number,
 * }} skipped counts files rejected for being hidden or inside a folder
 */
export function groupFilesIntoFolder(files = [], folderName = "") {
  const accepted = [];
  let skipped = 0;

  for (const file of files) {
    const segments = pathSegmentsOf(file);
    if (segments.length === 0) continue;
    if (isHiddenPath(segments)) {
      skipped++;
      continue;
    }
    // More than one segment means the file came from inside a dropped folder.
    if (segments.length > 1) {
      skipped++;
      continue;
    }
    accepted.push({ file, relativePath: segments[0] });
  }

  return { folderName, files: accepted, skipped };
}

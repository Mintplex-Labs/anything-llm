const fs = require("fs");
const path = require("path");

const SWARMSY_REQUIRED_DOCS_MANIFEST_PATH = path.resolve(
  __dirname,
  "..",
  "..",
  "config",
  "swarmsy",
  "SWARMSY_REQUIRED_DOCS_MANIFEST.json"
);

const DEFAULT_DOCTRINE_DOCS_ROOT = path.resolve(__dirname, "..", "..", "..");

function isRequiredGroup(group = {}) {
  if (typeof group.required === "string") {
    return group.required.toLowerCase() === "true";
  }

  return Boolean(group.required);
}

function normalizeManifestPath(manifestPath) {
  if (typeof manifestPath !== "string" || !manifestPath.trim()) {
    throw new Error("Manifest path must be a non-empty string.");
  }

  const posixPath = String(manifestPath || "").replace(/\\/g, "/");
  if (path.posix.isAbsolute(posixPath) || path.isAbsolute(manifestPath)) {
    throw new Error("Absolute paths are not allowed.");
  }

  const pathSegments = posixPath.split("/");
  if (pathSegments.includes("..")) {
    throw new Error("Path traversal is not allowed.");
  }

  const normalizedPath = path.posix.normalize(posixPath);
  if (normalizedPath === "." || normalizedPath.startsWith("../")) {
    throw new Error("Path traversal is not allowed.");
  }

  return normalizedPath;
}

function getDoctrineDocsRootStatus() {
  const envValue = process.env.SWARMSY_DOCTRINE_DOCS_ROOT || null;
  const docsRoot = path.resolve(envValue || DEFAULT_DOCTRINE_DOCS_ROOT);

  try {
    const stats = fs.statSync(docsRoot);
    if (!stats.isDirectory()) {
      return {
        docsRoot,
        envValue,
        available: false,
        message: "Doctrine docs root is not a directory.",
      };
    }

    fs.accessSync(docsRoot, fs.constants.R_OK);
    return {
      docsRoot,
      envValue,
      available: true,
      message: null,
    };
  } catch (error) {
    return {
      docsRoot,
      envValue,
      available: false,
      message: `Doctrine docs root is unavailable: ${error.message}`,
    };
  }
}

function isPathInsideRoot(absolutePath, docsRootAbsolute) {
  const relativePath = path.relative(docsRootAbsolute, absolutePath);
  return (
    relativePath === "" ||
    (!relativePath.startsWith("..") && !path.isAbsolute(relativePath))
  );
}

function pathHasSymlinkComponent(absolutePath, docsRootAbsolute) {
  const relativePath = path.relative(docsRootAbsolute, absolutePath);

  if (
    relativePath === "" ||
    relativePath.startsWith("..") ||
    path.isAbsolute(relativePath)
  ) {
    return false;
  }

  const pathParts = relativePath.split(path.sep).filter(Boolean);
  let currentPath = docsRootAbsolute;

  for (const pathPart of pathParts) {
    currentPath = path.join(currentPath, pathPart);

    try {
      if (fs.lstatSync(currentPath).isSymbolicLink()) {
        return true;
      }
    } catch (error) {
      if (error.code === "ENOENT") {
        return false;
      }

      throw error;
    }
  }

  return false;
}

function resolveManifestPath(docsRoot, manifestPath) {
  const normalizedPath = normalizeManifestPath(manifestPath);
  const docsRootAbsolute = path.resolve(docsRoot);
  const absolutePath = path.resolve(docsRootAbsolute, normalizedPath);
  const isInsideRoot = isPathInsideRoot(absolutePath, docsRootAbsolute);

  if (!isInsideRoot) {
    throw new Error("Resolved path is outside configured docs root.");
  }

  return { normalizedPath, absolutePath, docsRootAbsolute };
}

function getDocumentStatus(docsRootStatus, manifestPath, required) {
  const status = {
    path: manifestPath,
    present: false,
    loadable: false,
    required,
    optional: !required,
    bytes: 0,
    error: null,
  };

  if (!docsRootStatus.available) {
    status.error = docsRootStatus.message;
    return status;
  }

  let pathInfo;
  try {
    pathInfo = resolveManifestPath(docsRootStatus.docsRoot, manifestPath);
  } catch (error) {
    status.error = `Invalid manifest path: ${error.message}`;
    return status;
  }

  status.path = pathInfo.normalizedPath;

  let fileStats = null;
  try {
    if (
      pathHasSymlinkComponent(pathInfo.absolutePath, pathInfo.docsRootAbsolute)
    ) {
      status.present = true;
      status.loadable = false;
      status.bytes = 0;
      status.error = "Document path must not include symbolic links.";
      return status;
    }

    fileStats = fs.statSync(pathInfo.absolutePath);
  } catch (error) {
    if (error.code === "ENOENT") {
      status.error = "Document is missing.";
      return status;
    }

    status.present = true;
    status.error = `Document could not be inspected: ${error.message}`;
    return status;
  }

  if (!fileStats.isFile()) {
    status.error = "Path is not a file.";
    return status;
  }

  status.present = true;
  status.bytes = fileStats.size;

  let content = "";
  try {
    content = fs.readFileSync(pathInfo.absolutePath, "utf8");
  } catch (error) {
    status.error = `Document could not be read: ${error.message}`;
    return status;
  }

  const hasContent = content.trim().length > 0;
  if (!hasContent) {
    status.error = "Document is empty.";
    return status;
  }

  status.loadable = true;
  return status;
}

function loadSwarmsyRequiredDocsManifest() {
  const rawManifest = fs.readFileSync(
    SWARMSY_REQUIRED_DOCS_MANIFEST_PATH,
    "utf8"
  );
  const manifest = JSON.parse(rawManifest);

  if (!manifest || !Array.isArray(manifest.groups)) {
    throw new Error("Invalid SWARMSY required docs manifest.");
  }

  return manifest;
}

function getSwarmsyRequiredDocPaths(
  manifest = loadSwarmsyRequiredDocsManifest()
) {
  const paths = [];
  const seen = new Set();

  for (const group of manifest.groups || []) {
    for (const manifestPath of group.paths || []) {
      try {
        const normalizedPath = normalizeManifestPath(manifestPath);
        if (!seen.has(normalizedPath)) {
          seen.add(normalizedPath);
          paths.push(normalizedPath);
        }
      } catch {
        continue;
      }
    }
  }

  return paths;
}

function getSwarmsyRequiredDocsStatus(options = {}) {
  const manifest = options.manifest || loadSwarmsyRequiredDocsManifest();
  const docsRootStatus = getDoctrineDocsRootStatus();

  const groups = (manifest.groups || []).map((group) => {
    const required = isRequiredGroup(group);
    const files = (group.paths || []).map((manifestPath) =>
      getDocumentStatus(docsRootStatus, manifestPath, required)
    );
    const present = files.filter((file) => file.present).length;
    const loadable = files.filter((file) => file.loadable).length;

    return {
      id: group.id,
      label: group.label,
      required,
      optional: !required,
      present,
      missing: files.length - present,
      loadable,
      files,
    };
  });

  const summary = groups.reduce(
    (accumulator, group) => {
      if (group.required) {
        accumulator.requiredPresent += group.present;
        accumulator.requiredMissing += group.missing;
      } else {
        accumulator.optionalPresent += group.present;
        accumulator.optionalMissing += group.missing;
      }

      accumulator.loadable += group.loadable;
      return accumulator;
    },
    {
      requiredPresent: 0,
      requiredMissing: 0,
      optionalPresent: 0,
      optionalMissing: 0,
      loadable: 0,
    }
  );

  return {
    success: true,
    manifest: manifest.name || "SWARMSY Required Doctrine Docs",
    docsRoot: docsRootStatus.docsRoot,
    docsRootAvailable: docsRootStatus.available,
    docsRootMessage: docsRootStatus.message,
    groups,
    summary,
    documentsToIngest: getSwarmsyRequiredDocPaths(manifest),
  };
}

module.exports = {
  loadSwarmsyRequiredDocsManifest,
  getSwarmsyRequiredDocsStatus,
  getSwarmsyRequiredDocPaths,
};

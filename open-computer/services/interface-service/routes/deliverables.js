const fs = require("fs");
const path = require("path");

const {
  MIME_TYPES,
  fileExtensionMismatch,
  readManifest,
  safeFilename,
  writeManifest,
} = require("../utils/deliverables");

function registerDeliverableRoutes(app, { deliverablesDir }) {
  app.get("/api/v1/deliverables", (_req, res) => {
    try {
      res.json({ deliverables: readManifest(deliverablesDir) });
    } catch {
      res.json({ deliverables: [] });
    }
  });

  app.get("/api/v1/deliverables/:filename", (req, res) => {
    const filename = safeFilename(req.params.filename);
    const filepath = path.join(deliverablesDir, filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: `File not found: ${filename}` });
    }

    const ext = filename.split(".").pop()?.toLowerCase();
    const mismatch = fileExtensionMismatch(filepath, ext);
    if (mismatch) {
      return res.status(409).json({
        error: `Refusing to download ${filename}: ${mismatch}.`,
      });
    }

    res.setHeader("Content-Type", MIME_TYPES[ext] || "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    fs.createReadStream(filepath).pipe(res);
  });

  app.delete("/api/v1/deliverables/:filename", (req, res) => {
    const filename = safeFilename(req.params.filename);
    const filepath = path.join(deliverablesDir, filename);

    try {
      fs.unlinkSync(filepath);
    } catch {}

    try {
      const entries = readManifest(deliverablesDir)
        .filter((e) => e.filename !== filename);
      writeManifest(deliverablesDir, entries);
    } catch {}

    res.json({ status: "deleted", filename });
  });
}

module.exports = {
  registerDeliverableRoutes,
};

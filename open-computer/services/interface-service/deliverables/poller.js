const fs = require("fs");
const path = require("path");
const { DELIVERABLES_DIR } = require("../config");
const { broadcast } = require("../broadcast");

const _knownDeliverables = new Map(); // filename → mtimeMs
let _seeded = false;

function pollDeliverables() {
  try {
    if (!fs.existsSync(DELIVERABLES_DIR)) return;

    const files = fs
      .readdirSync(DELIVERABLES_DIR)
      .filter((f) => !f.startsWith("."));

    let changed = false;

    for (const file of files) {
      const filepath = path.join(DELIVERABLES_DIR, file);
      let stat;
      try {
        stat = fs.statSync(filepath);
      } catch {
        continue;
      }
      if (!stat.isFile()) continue;

      const prevMtime = _knownDeliverables.get(file);
      if (prevMtime === undefined || prevMtime < stat.mtimeMs) {
        _knownDeliverables.set(file, stat.mtimeMs);
        changed = true;

        const manifest = path.join(DELIVERABLES_DIR, ".manifest.json");
        let entries = [];
        try {
          if (fs.existsSync(manifest))
            entries = JSON.parse(fs.readFileSync(manifest, "utf8"));
        } catch {}

        if (!entries.some((e) => e.filename === file)) {
          entries.push({
            filename: file,
            description: file,
            created_at: new Date(stat.mtimeMs).toISOString(),
          });
          try {
            fs.writeFileSync(manifest, JSON.stringify(entries, null, 2), "utf8");
          } catch {}
        }
      }
    }

    // Remove tracked entries for files that no longer exist, and sync the manifest.
    let manifestNeedsUpdate = false;
    for (const tracked of _knownDeliverables.keys()) {
      if (!files.includes(tracked)) {
        _knownDeliverables.delete(tracked);
        manifestNeedsUpdate = true;
      }
    }
    if (manifestNeedsUpdate) {
      const manifest = path.join(DELIVERABLES_DIR, ".manifest.json");
      try {
        let entries = [];
        if (fs.existsSync(manifest))
          entries = JSON.parse(fs.readFileSync(manifest, "utf8"));
        const pruned = entries.filter((e) => files.includes(e.filename));
        if (pruned.length !== entries.length) {
          fs.writeFileSync(manifest, JSON.stringify(pruned, null, 2), "utf8");
          if (_seeded) broadcast({ type: "deliverable_saved" });
        }
      } catch {}
    }

    if (changed && _seeded) {
      broadcast({ type: "deliverable_saved" });
    }
    _seeded = true;
  } catch {}
}

function startDeliverablesPoller() {
  // Seed initial state so pre-existing files don't trigger spurious events
  pollDeliverables();
  setInterval(pollDeliverables, 3000);
}

module.exports = { pollDeliverables, startDeliverablesPoller };

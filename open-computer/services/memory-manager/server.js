const express = require("express");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const PORT = process.env.PORT || 8090;
const AGENT_USER = process.env.AGENT_USER || "agent";
const MEMORY_DIR =
  process.env.MEMORY_DIR ||
  `/home/${AGENT_USER}/.pi/agent/pi-hermes-memory`;

const MEMORY_FILE = path.join(MEMORY_DIR, "MEMORY.md");
const USER_FILE = path.join(MEMORY_DIR, "USER.md");
const SESSIONS_DB = path.join(MEMORY_DIR, "sessions.db");

const DELIMITER = "§";
const CHAR_LIMIT = 5000;

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readEntries(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf-8").trim();
    if (!raw) return [];
    return raw.split(DELIMITER).map((e) => e.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function writeEntries(filePath, entries) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, entries.join(` ${DELIMITER} `) + "\n");
}

function getFileStats(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return { chars: raw.length, exists: true };
  } catch {
    return { chars: 0, exists: false };
  }
}

// --- API Routes ---

app.get("/api/memories", (_req, res) => {
  res.json({ entries: readEntries(MEMORY_FILE) });
});

app.get("/api/user", (_req, res) => {
  res.json({ entries: readEntries(USER_FILE) });
});

app.post("/api/memories", (req, res) => {
  const { entry } = req.body;
  if (!entry || !entry.trim()) return res.status(400).json({ error: "Empty entry" });
  const entries = readEntries(MEMORY_FILE);
  entries.push(entry.trim());
  const combined = entries.join(` ${DELIMITER} `);
  if (combined.length > CHAR_LIMIT) {
    return res.status(400).json({ error: `Would exceed ${CHAR_LIMIT} char limit` });
  }
  writeEntries(MEMORY_FILE, entries);
  res.json({ entries });
});

app.delete("/api/memories/:index", (req, res) => {
  const entries = readEntries(MEMORY_FILE);
  const idx = parseInt(req.params.index, 10);
  if (idx < 0 || idx >= entries.length) return res.status(404).json({ error: "Not found" });
  entries.splice(idx, 1);
  writeEntries(MEMORY_FILE, entries);
  res.json({ entries });
});

app.post("/api/user", (req, res) => {
  const { entry } = req.body;
  if (!entry || !entry.trim()) return res.status(400).json({ error: "Empty entry" });
  const entries = readEntries(USER_FILE);
  entries.push(entry.trim());
  const combined = entries.join(` ${DELIMITER} `);
  if (combined.length > CHAR_LIMIT) {
    return res.status(400).json({ error: `Would exceed ${CHAR_LIMIT} char limit` });
  }
  writeEntries(USER_FILE, entries);
  res.json({ entries });
});

app.delete("/api/user/:index", (req, res) => {
  const entries = readEntries(USER_FILE);
  const idx = parseInt(req.params.index, 10);
  if (idx < 0 || idx >= entries.length) return res.status(404).json({ error: "Not found" });
  entries.splice(idx, 1);
  writeEntries(USER_FILE, entries);
  res.json({ entries });
});

app.post("/api/review", (_req, res) => {
  const child = spawn("pi", ["-p", "--no-session", "Review the recent conversation and save any durable memories, corrections, or lessons learned."], {
    stdio: "ignore",
    detached: true,
    env: { ...process.env, HOME: `/home/${AGENT_USER}` },
  });
  child.unref();
  res.json({ status: "review_triggered" });
});

app.get("/api/stats", (_req, res) => {
  const memStats = getFileStats(MEMORY_FILE);
  const userStats = getFileStats(USER_FILE);
  let dbSize = 0;
  try {
    dbSize = fs.statSync(SESSIONS_DB).size;
  } catch {}

  res.json({
    memory: {
      chars: memStats.chars,
      limit: CHAR_LIMIT,
      entries: readEntries(MEMORY_FILE).length,
      exists: memStats.exists,
    },
    user: {
      chars: userStats.chars,
      limit: CHAR_LIMIT,
      entries: readEntries(USER_FILE).length,
      exists: userStats.exists,
    },
    sessionsDbBytes: dbSize,
  });
});

app.listen(PORT, () => {
  console.log(`[memory-manager] listening on http://localhost:${PORT}`);
});

/**
 * Markdown Skill Store
 *
 * Stores "markdown skills" in the Agent Skills format described by
 * https://agentskills.io/specification : each skill is a directory containing a
 * `SKILL.md` file with YAML frontmatter (`name`, `description`, optional fields)
 * followed by a markdown body of instructions.
 *
 * These skills are plain context - they are NOT executable tools. They are
 * detected as relevant to a prompt and injected into the LLM's system prompt,
 * the same way Cursor / Claude surface skills to the model.
 *
 * The store is intentionally dependency-free: it parses a small, well-defined
 * subset of YAML frontmatter (top-level scalar fields plus one level of nested
 * `metadata:`) so we do not need to pull in a full YAML parser.
 */
const fs = require("fs");
const path = require("path");

/**
 * Resolve the skills root. Resolved eagerly at module load: STORAGE_DIR must
 * be set in the environment before the process starts (it is, via
 * docker-compose / .env). Falls back to the local storage folder for
 * standalone usage/tests.
 */
function resolveSkillsPath() {
  if (process.env.NODE_ENV === "development")
    return path.resolve(__dirname, "../../storage/plugins/skills");
  return path.resolve(
    process.env.STORAGE_DIR || path.resolve(__dirname, "../../storage"),
    "plugins",
    "skills"
  );
}

const skillsPath = resolveSkillsPath();

const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Validate a skill name against the Agent Skills spec.
 * 1-64 chars, lowercase alphanumerics and single hyphens, no leading/trailing
 * hyphen, no consecutive hyphens.
 * @param {string} name
 * @returns {boolean}
 */
function isValidName(name) {
  if (typeof name !== "string") return false;
  if (name.length < 1 || name.length > 64) return false;
  return NAME_RE.test(name);
}

/**
 * Parse `SKILL.md` raw text into `{ fields, body }`. Returns null when there is
 * no leading `--- ... ---` frontmatter block.
 * @param {string} raw
 * @returns {{fields: object, body: string} | null}
 */
function parseFrontmatter(raw) {
  const normalized = (raw || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return null;

  const [, fmText, body] = match;
  const fields = {};
  const lines = fmText.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) {
      i++;
      continue;
    }
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) {
      i++;
      continue;
    }
    const key = m[1];
    const value = m[2].trim();

    // A block scalar indicator (| or >, optional +/- chomping) opens a
    // multi-line value: subsequent indented lines are the content.
    if (/^[|>][+-]?$/.test(value)) {
      const style = value[0];
      const raw = [];
      i++;
      while (
        i < lines.length &&
        (lines[i] === "" ||
          lines[i].startsWith("  ") ||
          lines[i].startsWith("\t"))
      ) {
        raw.push(lines[i].replace(/^[ \t]+/, ""));
        i++;
      }
      while (raw.length && raw[raw.length - 1] === "") raw.pop();
      const text = (style === "|" ? raw : foldLines(raw)).join("\n");
      fields[key] = text.trim();
      continue;
    }

    // A key with no inline value opens a nested map (e.g. `metadata:`).
    if (value === "") {
      const nested = {};
      i++;
      while (
        i < lines.length &&
        (lines[i].startsWith("  ") || lines[i].startsWith("\t"))
      ) {
        const inner = lines[i].replace(/^[ \t]+/, "");
        const im = inner.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
        if (im) nested[im[1]] = stripQuotes(im[2].trim());
        i++;
      }
      fields[key] = nested;
      continue;
    }

    fields[key] = stripQuotes(value);
    i++;
  }
  return { fields, body: body.trim() };
}

/**
 * Fold a `>` block scalar: consecutive non-empty lines become space-separated,
 * a blank line becomes a single newline. (Simplified YAML folding - good enough
 * for skill metadata, which is prose, not code.)
 * @param {string[]} raw
 * @returns {string[]}
 */
function foldLines(raw) {
  const out = [];
  let current = "";
  for (const line of raw) {
    if (line === "") {
      if (current) out.push(current);
      current = "";
      out.push("");
    } else if (current) {
      current += ` ${line}`;
    } else {
      current = line;
    }
  }
  if (current) out.push(current);
  return out;
}

/**
 * Remove surrounding quotes from a scalar and unescape its contents.
 * Double-quoted: honors backslash escapes (\\" \\\\ \\n \\t).
 * Single-quoted: YAML style, where '' is an escaped quote.
 * @param {string} str
 * @returns {string}
 */
function stripQuotes(str) {
  if (str.length >= 2 && str.startsWith('"') && str.endsWith('"')) {
    return str
      .slice(1, -1)
      .replace(/\\(["\\/bfnrt]|u[0-9a-fA-F]{4})/g, (whole, seq) => {
        if (seq[0] === "u")
          return String.fromCharCode(parseInt(seq.slice(1), 16));
        return (
          {
            '"': '"',
            "\\": "\\",
            "/": "/",
            n: "\n",
            t: "\t",
            r: "\r",
            b: "\b",
            f: "\f",
          }[seq] ?? whole
        );
      });
  }
  if (str.length >= 2 && str.startsWith("'") && str.endsWith("'")) {
    return str.slice(1, -1).replace(/''/g, "'");
  }
  return str;
}

/**
 * Build a full `SKILL.md` document from a record.
 * @param {object} skill
 * @param {string} skill.name
 * @param {string} skill.description
 * @param {string} [skill.license]
 * @param {string} [skill.compatibility]
 * @param {string} skill.body
 * @param {object} [skill.metadata]
 * @returns {string}
 */
function serializeSkill({
  name,
  description,
  license,
  compatibility,
  body,
  metadata,
}) {
  const lines = [
    "---",
    `name: ${name}`,
    `description: ${JSON.stringify(String(description).replace(/\n/g, " "))}`,
  ];
  if (license) lines.push(`license: ${JSON.stringify(String(license))}`);
  if (compatibility)
    lines.push(`compatibility: ${JSON.stringify(String(compatibility))}`);
  if (
    metadata &&
    typeof metadata === "object" &&
    Object.keys(metadata).length
  ) {
    lines.push("metadata:");
    for (const [k, v] of Object.entries(metadata))
      lines.push(`  ${k}: ${JSON.stringify(String(v))}`);
  }
  lines.push("---", "");
  lines.push(String(body || "").trim());
  lines.push("");
  return lines.join("\n");
}

class SkillStore {
  constructor(basePath = skillsPath) {
    this.basePath = basePath;
    this._listCache = null;
  }

  /** Ensure the skills root exists. */
  ensureDir() {
    if (!fs.existsSync(this.basePath))
      fs.mkdirSync(this.basePath, { recursive: true });
    return this.basePath;
  }

  /**
   * Rename a skill directory. The frontmatter `name` field is rewritten to
   * match so the two never diverge. Use this to resolve a name mismatch where
   * the directory name is the one to keep.
   * @param {string} oldName
   * @param {string} newName
   * @returns {object|null} the re-read record, or null if anything failed
   */
  rename(oldName, newName) {
    try {
      if (!isValidName(oldName) || !isValidName(newName)) return null;
      const from = this.skillDir(oldName);
      const to = this.skillDir(newName);
      if (!fs.existsSync(from) || fs.existsSync(to)) return null;

      fs.renameSync(from, to);
      const file = this.skillFile(newName);
      if (fs.existsSync(file)) {
        const raw = fs.readFileSync(file, "utf8");
        const updated = raw.replace(/^name:\s*.+$/m, `name: ${newName}`);
        fs.writeFileSync(file, updated, "utf8");
      }
      this.#invalidateCache();
      return this.get(newName);
    } catch {
      return null;
    }
  }

  /** Absolute path of a skill's directory. Never escapes the base. */
  skillDir(name) {
    if (!isValidName(name)) throw new Error(`Invalid skill name: "${name}"`);
    const dir = path.resolve(this.basePath, name);
    if (!isWithin(this.basePath, dir))
      throw new Error("Path escapes the skills directory.");
    return dir;
  }

  skillFile(name) {
    return path.join(this.skillDir(name), "SKILL.md");
  }

  /**
   * Parse a single skill from disk.
   * @param {string} name
   * @returns {object|null} skill record or null if missing/invalid
   */
  get(name) {
    // Validate before the catch-all so invalid names fail loudly like
    // save()/delete() instead of masquerading as a missing skill.
    this.skillDir(name);
    try {
      const file = this.skillFile(name);
      if (!fs.existsSync(file)) return null;
      const record = this.#recordFromRaw(fs.readFileSync(file, "utf8"), name);
      if (record) record.dir = name;
      return record;
    } catch {
      return null;
    }
  }

  /**
   * List all skills. Valid skills come back as records; broken ones
   * (missing SKILL.md, unparseable frontmatter, or a name that does not match
   * its folder) come back as `{ dir, error }` markers so callers can surface
   * them instead of them silently disappearing.
   * Results are cached and invalidated on mutations or when the directory
   * changes on disk (mtime).
   * @returns {object[]}
   */
  list() {
    this.ensureDir();
    const dirMtime = this.#dirMtime();
    if (this._listCache && this._listCache.mtime === dirMtime)
      return this._listCache.entries;

    const results = [];
    const folders = fs.readdirSync(this.basePath, { withFileTypes: true });
    for (const folder of folders) {
      if (!folder.isDirectory()) continue;
      const file = path.join(this.basePath, folder.name, "SKILL.md");
      if (!fs.existsSync(file)) {
        results.push({
          dir: folder.name,
          error: "Missing SKILL.md file.",
        });
        continue;
      }
      const record = this.#recordFromRaw(
        fs.readFileSync(file, "utf8"),
        folder.name
      );
      if (!record) {
        results.push({
          dir: folder.name,
          error: "SKILL.md is missing or has invalid frontmatter.",
        });
        continue;
      }
      record.dir = folder.name;
      if (record.name !== folder.name)
        record.error = `Name "${record.name}" does not match its folder "${folder.name}".`;
      results.push(record);
    }
    results.sort((a, b) => (a.name || a.dir).localeCompare(b.name || b.dir));
    this._listCache = { mtime: dirMtime, entries: results };
    return results;
  }

  /** Directory mtime, or null when unreadable (treated as "never cached"). */
  #dirMtime() {
    try {
      return fs.statSync(this.basePath).mtimeMs;
    } catch {
      return null;
    }
  }

  #invalidateCache() {
    this._listCache = null;
  }

  /**
   * Create or overwrite a skill. Validates name and requires a description.
   * @param {object} skill
   * @param {string} skill.name
   * @param {string} skill.description
   * @param {string} [skill.license]
   * @param {string} [skill.compatibility]
   * @param {string} [skill.metadata]
   * @param {string} skill.body
   * @returns {object} the created skill record
   */
  save(skill) {
    const name = typeof skill?.name === "string" ? skill.name.trim() : "";
    if (!isValidName(name)) {
      throw new Error(
        "Skill name must be 1-64 chars: lowercase letters, numbers, and single hyphens."
      );
    }
    const description =
      typeof skill?.description === "string" ? skill.description.trim() : "";
    if (!description || description.length > 1024) {
      throw new Error("A description of 1-1024 characters is required.");
    }

    const dir = this.skillDir(name);
    fs.mkdirSync(dir, { recursive: true });
    const content = serializeSkill({
      name,
      description,
      license: skill?.license || undefined,
      compatibility: skill?.compatibility || undefined,
      metadata: skill?.metadata || undefined,
      body: skill?.body || "",
    });
    fs.writeFileSync(this.skillFile(name), content, "utf8");
    this.#invalidateCache();
    return this.get(name);
  }

  /** Delete a skill directory. @returns {boolean} */
  delete(name) {
    try {
      const dir = this.skillDir(name);
      if (!fs.existsSync(dir)) return false;
      fs.rmSync(dir, { recursive: true });
      this.#invalidateCache();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Parse raw SKILL.md content into a record, validating against the spec.
   * Returns null when the frontmatter is missing or invalid so callers can skip it.
   * @param {string} raw
   * @param {string} [dirName] directory the file was read from, used for
   * `updatedAt` so it does not depend on the frontmatter name
   */
  #recordFromRaw(raw, dirName = null) {
    const parsed = parseFrontmatter(raw);
    if (!parsed) return null;
    const name = String(parsed.fields.name || "").trim();
    const description = String(parsed.fields.description || "").trim();
    if (!isValidName(name) || !description) return null;

    return {
      name,
      description,
      license: parsed.fields.license || null,
      compatibility: parsed.fields.compatibility || null,
      metadata:
        parsed.fields.metadata && typeof parsed.fields.metadata === "object"
          ? parsed.fields.metadata
          : null,
      body: parsed.body,
      updatedAt: statMtime(this.skillFile(dirName || name)),
    };
  }
}

function isWithin(root, target) {
  const rel = path.relative(root, target);
  return !rel.startsWith("..") && !path.isAbsolute(rel);
}

function statMtime(file) {
  try {
    return fs.statSync(file).mtime.toISOString();
  } catch {
    return null;
  }
}

const store = new SkillStore();

module.exports = {
  store,
  SkillStore,
  isValidName,
  parseFrontmatter,
  serializeSkill,
  skillsPath,
};

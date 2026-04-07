import { useState, useEffect, useRef, useCallback } from "react";
import { saveAs } from "file-saver";
import {
  DownloadSimple,
  CircleNotch,
  CaretDown,
  CaretUp,
  Warning,
} from "@phosphor-icons/react";
import { humanFileSize } from "@/utils/numbers";
import StorageFiles from "@/models/files";

/**
 * FilePreviewCard
 *
 * Renders an in-chat file preview card whenever the agent creates or edits a file.
 *
 * Preview modes by file type:
 *   "code"          – syntax-highlighted code block (all programming languages)
 *   "text"          – plain scrollable <pre> block (txt, csv, json, md)
 *   "html"          – sandboxed <iframe> rendered from fetched HTML text
 *   "iframe-inline" – <iframe> via /preview endpoint (PDF)
 *   "image"         – <img> via /preview endpoint
 *   "none"          – no preview available (pptx, docx, xlsx)
 */
function FilePreviewCard({ props }) {
  const { filename, storageFilename, fileSize } = props?.content ?? {};
  const info = getFileInfo(filename);

  // Use sessionStorage keyed by storageFilename so isOpen state survives
  // remounts caused by parent re-renders (scroll, streaming, etc.)
  const stateKey = storageFilename ? `fpc-open:${storageFilename}` : null;
  const [isOpen, setIsOpenState] = useState(() => {
    if (!stateKey) return true;
    const stored = sessionStorage.getItem(stateKey);
    return stored === null ? true : stored === "1";
  });
  const setIsOpen = (val) => {
    setIsOpenState((prev) => {
      const next = typeof val === "function" ? val(prev) : val;
      if (stateKey) sessionStorage.setItem(stateKey, next ? "1" : "0");
      return next;
    });
  };

  const [downloading, setDownloading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error
  const [textContent, setTextContent] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!storageFilename || info.previewMode === "none") return;

    if (
      info.previewMode === "code" ||
      info.previewMode === "text" ||
      info.previewMode === "html"
    ) {
      setStatus("loading");
      // Retry up to 5 times with 800ms delay — handles race condition where
      // the file may not yet be in generated-files storage on first mount
      let attempts = 0;
      const MAX_ATTEMPTS = 5;
      const RETRY_DELAY_MS = 800;
      const tryFetch = () => {
        StorageFiles.fetchText(storageFilename)
          .then((t) => { setTextContent(t); setStatus("ready"); })
          .catch(() => {
            attempts++;
            if (attempts < MAX_ATTEMPTS) {
              setTimeout(tryFetch, RETRY_DELAY_MS);
            } else {
              setStatus("error");
            }
          });
      };
      tryFetch();
      return;
    }

    if (info.previewMode === "iframe-inline" || info.previewMode === "image") {
      setPreviewUrl(StorageFiles.previewUrl(storageFilename));
      setStatus("ready");
    }
  }, [storageFilename, info.previewMode]);

  async function handleDownload() {
    if (downloading || !storageFilename) return;
    setDownloading(true);
    try {
      const blob = await StorageFiles.download(storageFilename);
      if (!blob) throw new Error("Download failed");
      saveAs(blob, filename || storageFilename);
    } catch {
      console.error("FilePreviewCard: download failed");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex justify-center w-full my-2">
      <div className="w-full max-w-[750px] mr-4">

        {/* ── Header ── */}
        <div
          onClick={() => setIsOpen((o) => !o)}
          className="flex items-center justify-between bg-zinc-800 light:bg-slate-100 light:border light:border-slate-200/50 rounded-xl px-2 py-1 cursor-pointer select-none hover:bg-zinc-700/60 light:hover:bg-slate-200/60 transition-colors"
        >
          <div className="flex items-center gap-x-3 min-w-0">
            <div
              className="rounded-lg flex items-center justify-center flex-shrink-0 h-[44px] w-[44px] text-[11px] font-bold"
              style={{ background: info.badgeBg, color: info.badgeColor }}
            >
              {info.badge}
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-white light:text-slate-900 text-sm font-medium truncate leading-snug">
                {filename ?? "Unknown file"}
              </p>
              <p className="text-zinc-400 light:text-slate-500 text-xs leading-snug">
                {humanFileSize(fileSize, true, 1)}
                {fileSize && info.label ? " · " : ""}
                {info.label}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-x-2 flex-shrink-0 ml-4">
            {info.previewMode !== "none" && (
              <span className="text-zinc-500 text-xs hidden sm:block">Preview</span>
            )}
            {isOpen
              ? <CaretUp size={14} className="text-zinc-500" />
              : <CaretDown size={14} className="text-zinc-500" />
            }
          </div>
        </div>

        {/* ── Body ── */}
        {isOpen && (
          <div className="mt-[2px] rounded-xl overflow-hidden border border-zinc-700 light:border-slate-200">

            <PreviewBody
              info={info}
              status={status}
              textContent={textContent}
              previewUrl={previewUrl}
              filename={filename}
            />

            {/* Footer */}
            <div className="flex items-center justify-between px-3 py-2 bg-zinc-900 light:bg-slate-50 border-t border-zinc-700 light:border-slate-200">
              <span className="flex items-center gap-x-1.5 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 rounded-md px-2 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Just created
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                disabled={downloading}
                className="flex items-center gap-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-600 light:border-slate-300 hover:bg-zinc-700 light:hover:bg-slate-100 transition-colors text-white light:text-slate-800 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading
                  ? <CircleNotch size={13} weight="bold" className="animate-spin" />
                  : <DownloadSimple size={13} weight="bold" />
                }
                {downloading ? "Downloading…" : "Download"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PreviewBody
───────────────────────────────────────────────────────── */
function PreviewBody({ info, status, textContent, previewUrl, filename }) {
  if (info.previewMode === "none") {
    return (
      <div className="flex flex-col items-center justify-center gap-y-2 py-8 px-4 text-center bg-zinc-900 light:bg-slate-50">
        <div className="w-9 h-9 rounded-lg bg-zinc-800 light:bg-slate-200 flex items-center justify-center mb-1">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="3" width="16" height="18" rx="2" stroke="#71717a" strokeWidth="1.5"/>
            <path d="M8 8h8M8 12h5" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="text-zinc-400 text-sm">Preview not available for <span className="font-mono">.{info.ext}</span> files</p>
        <p className="text-zinc-600 text-xs">Download to open in the appropriate application</p>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center gap-x-2 py-10 bg-zinc-900 light:bg-slate-50">
        <CircleNotch size={18} className="animate-spin text-zinc-500" />
        <span className="text-zinc-500 text-sm">Loading preview…</span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center gap-x-2 py-10 bg-zinc-900 light:bg-slate-50 text-red-400">
        <Warning size={16} />
        <span className="text-sm">Could not load preview</span>
      </div>
    );
  }

  // Code files — syntax highlighted
  if (info.previewMode === "code" && textContent !== null) {
    return <CodePreview code={textContent} language={info.language} langLabel={info.langLabel} />;
  }

  // Plain text / CSV / JSON / Markdown
  if (info.previewMode === "text" && textContent !== null) {
    let display = textContent;
    if (info.ext === "json") {
      try { display = JSON.stringify(JSON.parse(textContent), null, 2); } catch { /* keep raw */ }
    }
    return (
      <div className="relative bg-zinc-950 light:bg-slate-900">
        <pre className="overflow-auto max-h-[280px] p-4 text-xs text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed">
          {display}
        </pre>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10"
          style={{ background: "linear-gradient(transparent, #09090b)" }} />
      </div>
    );
  }

  // HTML — sandboxed iframe
  if (info.previewMode === "html" && textContent !== null) {
    const blob = new Blob([textContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    return (
      <iframe
        src={url}
        title={`Preview: ${filename}`}
        sandbox="allow-scripts"
        className="w-full border-0"
        style={{ height: 360 }}
      />
    );
  }

  // PDF — inline iframe
  if (info.previewMode === "iframe-inline" && previewUrl) {
    return (
      <iframe
        src={previewUrl}
        title={`Preview: ${filename}`}
        className="w-full border-0"
        style={{ height: 480 }}
      />
    );
  }

  // Image
  if (info.previewMode === "image" && previewUrl) {
    return (
      <div className="flex items-center justify-center p-4 bg-zinc-950 light:bg-slate-900">
        <img
          src={previewUrl}
          alt={`Preview: ${filename}`}
          className="max-w-full max-h-[400px] object-contain rounded"
        />
      </div>
    );
  }

  return null;
}

/* ─────────────────────────────────────────────────────────
   CodePreview — VSCode-style two-column layout
   Line numbers and code scroll together via a shared scroll ref
───────────────────────────────────────────────────────── */
function CodePreview({ code, language, langLabel }) {
  const lines = code.split("\n");
  const scrollRef = useRef(null);
  const lineNumRef = useRef(null);

  // Sync vertical scroll of line numbers with the code scroll container
  const handleScroll = useCallback(() => {
    if (lineNumRef.current && scrollRef.current) {
      lineNumRef.current.scrollTop = scrollRef.current.scrollTop;
    }
  }, []);

  return (
    <div className="relative bg-[#18181b]">
      {/* Language bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-zinc-900 border-b border-zinc-800">
        <span className="text-[11px] text-zinc-500 font-mono">{langLabel}</span>
        <span className="text-[11px] text-zinc-600">{lines.length} lines</span>
      </div>

      {/* Code area — flex row, both columns capped at same height */}
      <div className="flex max-h-[420px]" style={{ minHeight: 0 }}>

        {/* Line numbers — scrolls via JS sync, hidden scrollbar */}
        <div
          ref={lineNumRef}
          className="flex-shrink-0 select-none text-right border-r border-zinc-800 bg-[#18181b]"
          style={{
            overflowY: "hidden",
            overflowX: "hidden",
            paddingTop: "12px",
            paddingBottom: "12px",
            paddingLeft: "16px",
            paddingRight: "12px",
          }}
        >
          {lines.map((_, i) => (
            <div key={i} className="text-[11px] text-zinc-600 font-mono leading-[1.7]">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code content — the real scroll container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-auto"
          style={{ paddingTop: "12px", paddingBottom: "12px" }}
        >
          {lines.map((line, i) => (
            <div
              key={i}
              className="text-[12px] font-mono leading-[1.7] whitespace-pre px-4"
              dangerouslySetInnerHTML={{ __html: highlightLine(line, language) }}
            />
          ))}
        </div>
      </div>

      {/* Fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-10"
        style={{ background: "linear-gradient(transparent, #18181b)" }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Syntax highlighting
   Lightweight regex-based — no external library needed.
   Colors match a VS Code dark theme aesthetic.
───────────────────────────────────────────────────────── */
const C = {
  kw:  (s) => `<span style="color:#c084fc">${s}</span>`,   // keywords   – purple
  fn:  (s) => `<span style="color:#60a5fa">${s}</span>`,   // functions  – blue
  st:  (s) => `<span style="color:#4ade80">${s}</span>`,   // strings    – green
  cm:  (s) => `<span style="color:#52525b">${s}</span>`,   // comments   – muted
  nm:  (s) => `<span style="color:#fb923c">${s}</span>`,   // numbers    – orange
  tp:  (s) => `<span style="color:#f472b6">${s}</span>`,   // types      – pink
  op:  (s) => `<span style="color:#94a3b8">${s}</span>`,   // operators  – slate
  pl:  (s) => `<span style="color:#e4e4e7">${s}</span>`,   // plain
};

function esc(s) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

const KEYWORDS = {
  python:      /\b(import|from|as|def|class|if|elif|else|for|while|return|in|not|and|or|True|False|None|with|try|except|finally|raise|lambda|yield|pass|break|continue|global|nonlocal|del|assert|is)\b/g,
  javascript:  /\b(const|let|var|function|async|await|return|if|else|for|while|do|class|new|this|import|export|default|from|typeof|instanceof|in|of|try|catch|finally|throw|true|false|null|undefined|void|delete|switch|case|break|continue)\b/g,
  typescript:  /\b(const|let|var|function|async|await|return|if|else|for|while|do|class|new|this|import|export|default|from|typeof|instanceof|in|of|try|catch|finally|throw|true|false|null|undefined|void|delete|switch|case|break|continue|interface|type|enum|namespace|declare|readonly|public|private|protected|abstract|implements|extends)\b/g,
  rust:        /\b(fn|let|mut|const|struct|enum|impl|trait|use|pub|mod|match|if|else|for|while|loop|return|true|false|self|Self|super|crate|where|type|async|await|move|ref|in|as)\b/g,
  go:          /\b(func|var|const|type|struct|interface|map|chan|go|defer|select|case|default|package|import|if|else|for|range|return|break|continue|switch|goto|fallthrough|true|false|nil|make|new|len|cap|append|copy|close|delete|panic|recover)\b/g,
  lua:         /\b(local|function|end|if|then|elseif|else|for|do|while|repeat|until|return|break|true|false|nil|and|or|not|in)\b/g,
  bash:        /\b(if|then|else|elif|fi|for|do|done|while|until|case|esac|function|return|in|local|export|set|unset|shift|echo|exit|source|declare|readonly)\b/g,
  powershell:  /\b(function|param|if|else|elseif|for|foreach|while|do|switch|return|begin|process|end|filter|try|catch|finally|throw|break|continue|exit|true|false|null|in|where)\b/g,
  batch:       /\b(@echo|echo|set|if|else|for|goto|call|exit|rem|setlocal|endlocal|pause|shift|errorlevel|defined|exist|not|equ|neq|lss|leq|gtr|geq)\b/gi,
  ruby:        /\b(def|end|class|module|if|elsif|else|unless|case|when|then|do|begin|rescue|ensure|raise|return|yield|self|true|false|nil|and|or|not|in|for|while|until|next|break|super|require|include|extend|attr_accessor|attr_reader|attr_writer)\b/g,
  php:         /\b(function|class|if|else|elseif|foreach|for|while|do|switch|case|break|return|echo|print|new|public|private|protected|static|abstract|interface|extends|implements|namespace|use|require|include|true|false|null)\b/g,
  java:        /\b(public|private|protected|static|final|abstract|class|interface|extends|implements|new|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|throws|import|package|void|true|false|null|this|super|instanceof|enum)\b/g,
  csharp:      /\b(public|private|protected|internal|static|readonly|const|class|interface|struct|enum|abstract|sealed|override|virtual|new|return|if|else|for|foreach|while|do|switch|case|break|continue|try|catch|finally|throw|using|namespace|void|true|false|null|this|base|async|await|var|out|ref|in|params|delegate|event|get|set)\b/g,
  cpp:         /\b(int|char|void|bool|float|double|long|short|unsigned|signed|const|static|auto|return|if|else|for|while|do|switch|case|break|continue|class|struct|namespace|template|typename|public|private|protected|virtual|override|nullptr|true|false|new|delete|include|define)\b/g,
  default:     /\b(if|else|for|while|return|true|false|null|undefined|function|class|import|export)\b/g,
};

const TYPES = {
  python:     /\b(str|int|float|bool|list|dict|tuple|set|bytes|None|pd\.[A-Z]\w*|[A-Z][a-zA-Z0-9]*)\b/g,
  typescript: /\b(string|number|boolean|any|void|never|unknown|object|Array|Promise|Record|Partial|Required|Readonly|Pick|Omit|[A-Z][a-zA-Z0-9]*)\b/g,
  rust:       /\b(String|str|i32|i64|u32|u64|usize|f32|f64|bool|Vec|HashMap|Option|Result|Box|Rc|Arc|[A-Z][a-zA-Z0-9]*)\b/g,
  go:         /\b(string|int|int32|int64|uint|uint32|uint64|float32|float64|bool|byte|rune|error|[A-Z][a-zA-Z0-9]*)\b/g,
  java:       /\b(String|Integer|Boolean|Double|Float|Long|List|Map|Set|[A-Z][a-zA-Z0-9]*)\b/g,
  csharp:     /\b(string|int|bool|double|float|decimal|long|object|var|List|Dictionary|Task|[A-Z][a-zA-Z0-9]*)\b/g,
};

function highlightLine(raw, language) {
  // Escape HTML first
  let line = esc(raw);

  // --- Comments (must run first, before other patterns stomp on them) ---
  const singleCommentMap = {
    python: /#.*/,
    javascript: /\/\/.*/,
    typescript: /\/\/.*/,
    rust: /\/\/.*/,
    go: /\/\/.*/,
    lua: /--.*/,
    bash: /#.*/,
    powershell: /#.*/,
    batch: /(?:rem\s.*|@rem\s.*|::.*)/i,
    ruby: /#.*/,
    php: /(?:\/\/.*|#.*)/,
    java: /\/\/.*/,
    csharp: /\/\/.*/,
    cpp: /\/\/.*/,
  };
  const commentRe = singleCommentMap[language] || /#.*/;
  const commentMatch = line.match(commentRe);
  let commentSuffix = "";
  if (commentMatch) {
    const idx = line.indexOf(commentMatch[0]);
    commentSuffix = C.cm(line.slice(idx));
    line = line.slice(0, idx);
  }

  // --- Strings ---
  line = line.replace(/(&#39;|&quot;|`)(.*?)\1/g, (_, q, inner) =>
    C.st(`${q}${inner}${q}`)
  );
  // Also catch f-strings, template literals, unmatched quotes at EOL
  line = line.replace(/(f&#39;|f&quot;)(.*?)(&#39;|&quot;)/g, (_, q, inner, q2) =>
    C.st(`${q}${inner}${q2}`)
  );

  // --- Numbers ---
  line = line.replace(/\b(\d+\.?\d*)\b/g, C.nm("$1"));

  // --- Types (language-specific) ---
  const typeRe = TYPES[language];
  if (typeRe) {
    line = line.replace(typeRe, (m) => C.tp(m));
  }

  // --- Keywords ---
  const kwRe = KEYWORDS[language] || KEYWORDS.default;
  line = line.replace(new RegExp(kwRe.source, kwRe.flags), (m) => C.kw(m));

  // --- Function calls  foo( ---
  line = line.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, (_, name) => {
    // Don't double-wrap keywords
    if (/(kw|tp|nm|fn|st|cm|op)/.test(name)) return _;
    return C.fn(name);
  });

  // --- Operators ---
  line = line.replace(/([=<>!+\-*/&|^%]+)/g, (m) => C.op(m));

  return `<span style="color:#e4e4e7">${line}</span>${commentSuffix}`;
}

/* ─────────────────────────────────────────────────────────
   getFileInfo
   Maps filename → badge, colors, label, previewMode, language
───────────────────────────────────────────────────────── */
function getFileInfo(filename) {
  const ext = filename?.split(".").pop()?.toLowerCase() ?? "";

  const CODE = (badge, bg, color, label, language, langLabel) => ({
    ext, badge, badgeBg: bg, badgeColor: color, label,
    previewMode: "code", language, langLabel,
  });

  switch (ext) {
    // ── Programming languages ──────────────────────────────
    case "py":
      return CODE("PY",  "#1e3a5f", "#60a5fa", "Python script",      "python",     "python");
    case "js":
      return CODE("JS",  "#422006", "#fbbf24", "JavaScript",          "javascript", "javascript");
    case "jsx":
      return CODE("JSX", "#422006", "#fbbf24", "React / JSX",         "javascript", "jsx");
    case "ts":
      return CODE("TS",  "#1e3a5f", "#38bdf8", "TypeScript",          "typescript", "typescript");
    case "tsx":
      return CODE("TSX", "#1e3a5f", "#38bdf8", "React / TSX",         "typescript", "tsx");
    case "lua":
      return CODE("LUA", "#1a2d4a", "#818cf8", "Lua script",          "lua",        "lua");
    case "sh":
    case "bash":
    case "zsh":
      return CODE("SH",  "#14532d", "#4ade80", "Shell script",        "bash",       "bash");
    case "ps1":
    case "psm1":
    case "psd1":
      return CODE("PS1", "#1e293b", "#7dd3fc", "PowerShell script",   "powershell", "powershell");
    case "bat":
    case "cmd":
      return CODE("BAT", "#1c1c1e", "#94a3b8", "Batch script",        "batch",      "batch");
    case "rs":
      return CODE("RS",  "#431407", "#fb923c", "Rust",                "rust",       "rust");
    case "go":
      return CODE("GO",  "#083344", "#22d3ee", "Go",                  "go",         "go");
    case "rb":
      return CODE("RB",  "#450a0a", "#f87171", "Ruby",                "ruby",       "ruby");
    case "php":
      return CODE("PHP", "#2e1065", "#a78bfa", "PHP",                 "php",        "php");
    case "java":
      return CODE("JVA", "#422006", "#f97316", "Java",                "java",       "java");
    case "c":
      return CODE("C",   "#1e3a5f", "#60a5fa", "C",                   "cpp",        "c");
    case "cpp":
    case "cc":
    case "cxx":
      return CODE("C++", "#1e3a5f", "#60a5fa", "C++",                 "cpp",        "c++");
    case "h":
    case "hpp":
      return CODE("H",   "#1e3a5f", "#93c5fd", "C/C++ header",        "cpp",        "c header");
    case "cs":
      return CODE("CS",  "#2e1065", "#c084fc", "C#",                  "csharp",     "c#");
    case "swift":
      return CODE("SW",  "#431407", "#fdba74", "Swift",               "default",    "swift");
    case "kt":
    case "kts":
      return CODE("KT",  "#2e1065", "#c084fc", "Kotlin",              "default",    "kotlin");
    case "r":
      return CODE("R",   "#450a0a", "#f87171", "R script",            "default",    "r");
    case "sql":
      return CODE("SQL", "#1e3a5f", "#7dd3fc", "SQL",                 "default",    "sql");

    // ── Config / data ──────────────────────────────────────
    case "yaml":
    case "yml":
      return CODE("YML", "#1a2d1a", "#86efac", "YAML",                "default",    "yaml");
    case "toml":
      return CODE("TML", "#2d1a00", "#fbbf24", "TOML",                "default",    "toml");
    case "ini":
    case "env":
    case "cfg":
      return CODE("INI", "#1c1c1e", "#94a3b8", "Config file",         "default",    "ini");

    // ── Text / data ────────────────────────────────────────
    case "json":
      return { ext, badge: "JSON", badgeBg: "#2d2200", badgeColor: "#fcd34d",
        label: "JSON", previewMode: "text", language: null, langLabel: null };
    case "csv":
      return { ext, badge: "CSV",  badgeBg: "#14532d", badgeColor: "#4ade80",
        label: "CSV Spreadsheet", previewMode: "text", language: null, langLabel: null };
    case "md":
    case "markdown":
      return { ext, badge: "MD",   badgeBg: "#1e293b", badgeColor: "#94a3b8",
        label: "Markdown", previewMode: "text", language: null, langLabel: null };
    case "txt":
      return { ext, badge: "TXT",  badgeBg: "#27272a", badgeColor: "#a1a1aa",
        label: "Text file", previewMode: "text", language: null, langLabel: null };

    // ── Web ────────────────────────────────────────────────
    case "html":
    case "htm":
      return CODE("HTML","#2e1065", "#c084fc", "HTML file",           "default",    "html");
    case "css":
      return CODE("CSS", "#1e3a5f", "#60a5fa", "CSS stylesheet",      "default",    "css");

    // ── Documents (no preview) ─────────────────────────────
    case "pdf":
      return { ext, badge: "PDF",  badgeBg: "#450a0a", badgeColor: "#f87171",
        label: "PDF Document", previewMode: "iframe-inline" };
    case "docx":
    case "doc":
      return { ext, badge: "DOC",  badgeBg: "#1e3a5f", badgeColor: "#60a5fa",
        label: "Word Document", previewMode: "none" };
    case "pptx":
    case "ppt":
      return { ext, badge: "PPT",  badgeBg: "#431407", badgeColor: "#fb923c",
        label: "PowerPoint", previewMode: "none" };
    case "xlsx":
    case "xls":
      return { ext, badge: "XLS",  badgeBg: "#14532d", badgeColor: "#4ade80",
        label: "Spreadsheet", previewMode: "none" };

    // ── Images ────────────────────────────────────────────
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
    case "svg":
      return { ext, badge: ext.toUpperCase().slice(0,4), badgeBg: "#500724", badgeColor: "#f9a8d4",
        label: "Image", previewMode: "image" };

    default:
      return { ext, badge: ext.toUpperCase().slice(0,4) || "FILE",
        badgeBg: "#27272a", badgeColor: "#71717a",
        label: "File", previewMode: ext ? "text" : "none" };
  }
}

export default FilePreviewCard;

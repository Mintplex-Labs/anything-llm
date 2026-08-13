import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import {
  existsSync,
  mkdirSync,
  copyFileSync,
  writeFileSync,
  readFileSync,
  unlinkSync,
} from "fs";
import { join, extname } from "path";
import { execFileSync } from "child_process";

const DELIVERABLES_DIR = "/home/agent/deliverables";
const TMP_DIR = "/tmp/deliverable-convert";

// Extensions that require binary conversion when raw text/markdown is provided
const BINARY_EXTENSIONS: Record<
  string,
  (mdPath: string, outPath: string) => void
> = {
  ".pdf": convertToPdf,
  ".docx": convertToDocx,
  ".doc": convertToDocx,
  ".xlsx": convertToXlsx,
  ".xls": convertToXlsx,
  ".pptx": convertToPptx,
  ".html": convertToHtml,
};

function ensureTmpDir() {
  try {
    mkdirSync(TMP_DIR, { recursive: true });
  } catch {}
}

function convertToPdf(mdPath: string, outPath: string) {
  // pandoc → HTML → weasyprint → PDF (no texlive needed)
  const htmlPath = mdPath.replace(/\.md$/, ".html");
  try {
    execFileSync(
      "pandoc",
      [mdPath, "-o", htmlPath, "--standalone", "--metadata", "title= "],
      { timeout: 30_000, stdio: "pipe" },
    );
    execFileSync("weasyprint", [htmlPath, outPath], {
      timeout: 60_000,
      stdio: "pipe",
    });
  } finally {
    try {
      unlinkSync(htmlPath);
    } catch {}
  }
}

function convertToDocx(mdPath: string, outPath: string) {
  execFileSync("pandoc", [mdPath, "-o", outPath], {
    timeout: 30_000,
    stdio: "pipe",
  });
}

function convertToXlsx(mdPath: string, outPath: string) {
  // For spreadsheets, detect if the content looks like CSV/TSV data
  // and convert accordingly using python + openpyxl
  const content = readFileSync(mdPath, "utf8");
  const looksLikeCsv =
    content.includes(",") &&
    content.split("\n").filter((l) => l.trim()).length > 1;
  const looksLikeTable =
    content.includes("|") &&
    content.split("\n").filter((l) => l.includes("|")).length > 2;

  if (looksLikeCsv || looksLikeTable) {
    // Write a small Python script to handle the conversion
    const separator = looksLikeCsv ? "," : "|";
    const pyScript = join(TMP_DIR, "csv2xlsx.py");
    writeFileSync(
      pyScript,
      `
import sys, csv, os
try:
    from openpyxl import Workbook
except ImportError:
    os.system("pip install -q openpyxl")
    from openpyxl import Workbook

wb = Workbook()
ws = wb.active
sep = ${JSON.stringify(separator)}

with open(sys.argv[1], "r") as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        if sep == "|":
            cells = [c.strip() for c in line.split("|") if c.strip()]
            if all(c.replace("-", "").replace(":", "").strip() == "" for c in cells):
                continue
        else:
            cells = list(csv.reader([line]))[0]
        ws.append(cells)

wb.save(sys.argv[2])
`,
      "utf8",
    );
    execFileSync("python3", [pyScript, mdPath, outPath], {
      timeout: 30_000,
      stdio: "pipe",
    });
  } else {
    // Plain text content — just wrap it in a single-cell spreadsheet
    const pyScript = join(TMP_DIR, "txt2xlsx.py");
    writeFileSync(
      pyScript,
      `
import sys, os
try:
    from openpyxl import Workbook
except ImportError:
    os.system("pip install -q openpyxl")
    from openpyxl import Workbook

wb = Workbook()
ws = wb.active
with open(sys.argv[1], "r") as f:
    for i, line in enumerate(f):
        ws.cell(row=i+1, column=1, value=line.rstrip())
wb.save(sys.argv[2])
`,
      "utf8",
    );
    execFileSync("python3", [pyScript, mdPath, outPath], {
      timeout: 30_000,
      stdio: "pipe",
    });
  }
}

function convertToPptx(mdPath: string, outPath: string) {
  execFileSync("pandoc", [mdPath, "-o", outPath], {
    timeout: 30_000,
    stdio: "pipe",
  });
}

function convertToHtml(mdPath: string, outPath: string) {
  execFileSync("pandoc", [mdPath, "-o", outPath, "--standalone"], {
    timeout: 30_000,
    stdio: "pipe",
  });
}

function updateManifest(filename: string, desc: string) {
  const manifest = join(DELIVERABLES_DIR, ".manifest.json");
  let entries: any[] = [];
  try {
    if (existsSync(manifest)) {
      entries = JSON.parse(readFileSync(manifest, "utf8"));
    }
  } catch {}

  entries.push({
    filename,
    description: desc,
    created_at: new Date().toISOString(),
  });
  writeFileSync(manifest, JSON.stringify(entries, null, 2), "utf8");
}

function validateFileExtension(filepath: string, filename: string): string | null {
  const ext = extname(filename).toLowerCase();
  const head = readFileSync(filepath).subarray(0, 8);

  if (ext === ".pdf" && !head.subarray(0, 5).equals(Buffer.from("%PDF-"))) {
    return "expected PDF bytes";
  }
  if (ext === ".png" && !head.equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "expected PNG bytes";
  }
  if ((ext === ".jpg" || ext === ".jpeg") && !(head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff)) {
    return "expected JPEG bytes";
  }

  return null;
}

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "save_deliverable",
    label: "Save Deliverable",
    description:
      "Save a file as a deliverable that the human operator can download. " +
      "Use this whenever you produce an output the user asked for: PDFs, reports, images, " +
      "code archives, spreadsheets, etc. The file will appear in the Deliverables panel in the UI. " +
      "You can either provide a path to an existing file to copy, or provide content directly. " +
      "When you provide text/markdown content with a binary extension (.pdf, .docx, .xlsx, .pptx), " +
      "the content is automatically converted to the proper format. " +
      "Markdown is best for simple reports; for highly stylized reports, provide full HTML/CSS content " +
      "or create an HTML file and pass it as source_path so layout, typography, colors, and tables are preserved. " +
      "To create a PDF that includes screenshots/images, put Markdown image references in content " +
      "such as ![Screenshot](/home/agent/deliverables/screenshot.png); do not save a screenshot PNG with a .pdf filename.",
    parameters: Type.Object({
      filename: Type.String({
        description:
          "The output filename (e.g. 'report.pdf', 'results.csv'). Will be saved to /home/agent/deliverables/",
      }),
      source_path: Type.Optional(
        Type.String({
          description:
            "Path to an existing file to copy into deliverables. Use this when you've already created the final file somewhere. " +
            "Do not use a PNG screenshot as source_path for a .pdf filename; use content with a Markdown image reference instead.",
        }),
      ),
      content: Type.Optional(
        Type.String({
          description:
            "Text/markdown content to write. For binary formats like .pdf, .docx, .xlsx, " +
            "the markdown is automatically converted to the proper format. " +
            "For highly styled PDFs/reports, HTML with inline CSS is supported and usually gives better control than Markdown. " +
            "For PDFs with screenshots, include image Markdown like ![Article screenshot](/home/agent/deliverables/article_screenshot.png). " +
            "For text files (.txt, .md, .csv, .html, .json), content is written as-is.",
        }),
      ),
      description: Type.Optional(
        Type.String({
          description: "Brief description of what this deliverable is",
        }),
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      if (!existsSync(DELIVERABLES_DIR)) {
        mkdirSync(DELIVERABLES_DIR, { recursive: true });
      }

      const dest = join(DELIVERABLES_DIR, params.filename);

      if (params.source_path) {
        if (!existsSync(params.source_path)) {
          return {
            content: [
              {
                type: "text",
                text: `Error: Source file not found: ${params.source_path}`,
              },
            ],
            details: {},
          };
        }

        const destExt = extname(params.filename).toLowerCase();
        const srcExt = extname(params.source_path).toLowerCase();
        const converter = BINARY_EXTENSIONS[destExt];
        const TEXT_SOURCE_EXTENSIONS = new Set([
          ".md",
          ".markdown",
          ".txt",
          ".text",
          ".csv",
          ".tsv",
          ".json",
          ".yaml",
          ".yml",
          ".rst",
          ".org",
        ]);

        if (converter && srcExt !== destExt && TEXT_SOURCE_EXTENSIONS.has(srcExt)) {
          // Source is a text file but destination wants a binary format — convert
          try {
            converter(params.source_path, dest);
          } catch (err: unknown) {
            const msg = (err as Error).message || "Unknown conversion error";
            // Fallback: copy the source as-is with a .md extension
            const fallbackName = params.filename.replace(/\.[^.]+$/, ".md");
            const fallbackDest = join(DELIVERABLES_DIR, fallbackName);
            copyFileSync(params.source_path, fallbackDest);
            updateManifest(fallbackName, params.description || fallbackName);

            return {
              content: [
                {
                  type: "text",
                  text:
                    `Warning: Failed to convert to ${destExt} (${msg}). ` +
                    `Saved source as markdown instead: ${fallbackName} → ${fallbackDest}`,
                },
              ],
              details: {},
            };
          }
        } else {
          copyFileSync(params.source_path, dest);
        }
      } else if (params.content) {
        const ext = extname(params.filename).toLowerCase();
        const converter = BINARY_EXTENSIONS[ext];

        if (converter) {
          // Text content with a binary extension — auto-convert
          ensureTmpDir();
          const tmpMd = join(TMP_DIR, `input-${Date.now()}.md`);
          try {
            writeFileSync(tmpMd, params.content, "utf8");
            converter(tmpMd, dest);
            try {
              unlinkSync(tmpMd);
            } catch {}
          } catch (err: unknown) {
            const msg = (err as Error).message || "Unknown conversion error";
            // Fallback: save as markdown with .md extension alongside the
            // original filename so the user at least gets something
            const fallbackName = params.filename.replace(
              /\.[^.]+$/,
              ".md",
            );
            const fallbackDest = join(DELIVERABLES_DIR, fallbackName);
            writeFileSync(fallbackDest, params.content, "utf8");
            updateManifest(fallbackName, params.description || fallbackName);

            return {
              content: [
                {
                  type: "text",
                  text:
                    `Warning: Failed to convert to ${ext} (${msg}). ` +
                    `Saved as markdown instead: ${fallbackName} → ${fallbackDest}`,
                },
              ],
              details: {},
            };
          }
        } else {
          writeFileSync(dest, params.content, "utf8");
        }
      } else {
        return {
          content: [
            {
              type: "text",
              text: "Error: Provide either source_path or content",
            },
          ],
          details: {},
        };
      }

      const validationError = validateFileExtension(dest, params.filename);
      if (validationError) {
        try {
          unlinkSync(dest);
        } catch {}
        return {
          content: [
            {
              type: "text",
              text: `Error: Refusing to save ${params.filename}: ${validationError}. Use the correct extension or regenerate the file.`,
            },
          ],
          details: {},
        };
      }

      const desc = params.description || params.filename;
      updateManifest(params.filename, desc);

      return {
        content: [
          {
            type: "text",
            text: `Deliverable saved: ${params.filename} → ${dest}\nThe operator can now see and download this file from the Deliverables panel.`,
          },
        ],
        details: {},
      };
    },
  });
}

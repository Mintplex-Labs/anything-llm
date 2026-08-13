import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { execFileSync, spawn, type ExecFileSyncOptions } from "child_process";
import { dirname, extname, isAbsolute, join } from "path";

const DELIVERABLES_DIR = "/home/agent/deliverables";

// Directories searched for .desktop entries. Includes both system and
// per-user flatpak exports so user-installed flatpaks (e.g. `flatpak install`
// without root) are discoverable.
const APP_DIRS = [
  "/usr/share/applications",
  "/home/agent/.local/share/applications",
  "/var/lib/flatpak/exports/share/applications",
  "/home/agent/.local/share/flatpak/exports/share/applications",
].join(" ");

function execWithStderr(cmd: string, args: string[], opts: ExecFileSyncOptions): string {
  try {
    return execFileSync(cmd, args, opts) as string;
  } catch (err: any) {
    const stderr = err.stderr?.toString?.()?.trim() || "";
    const stdout = err.stdout?.toString?.()?.trim() || "";
    const msg = stdout || stderr || err.message;
    throw new Error(msg);
  }
}

const A11Y_HARVEST = "/usr/local/bin/a11y-harvest";
const A11Y_ACTION = "/usr/local/bin/a11y-action";

const PYTHON_OPTS = {
  encoding: "utf8" as const,
  timeout: 15000,
  maxBuffer: 1024 * 1024,
  env: {
    ...process.env,
    DISPLAY: ":0",
    DBUS_SESSION_BUS_ADDRESS: process.env.DBUS_SESSION_BUS_ADDRESS || "unix:path=/run/user/1000/bus",
    GTK_MODULES: "gail:atk-bridge",
    NO_AT_BRIDGE: "0",
  },
};

function normalizeScreenshotSavePath(input: string | undefined, ts: number): string {
  let savePath = input?.trim() || `${DELIVERABLES_DIR}/screenshot-${ts}.png`;
  savePath = savePath.replace(/^~/, "/home/agent");
  if (!isAbsolute(savePath)) savePath = join(DELIVERABLES_DIR, savePath);

  const ext = extname(savePath).toLowerCase();
  if (!ext) return `${savePath}.png`;
  if (ext !== ".png") return savePath.slice(0, -ext.length) + ".png";
  return savePath;
}

function formatHarvest(raw: string): string {
  const data = JSON.parse(raw);
  if (data.error) return `Error: ${data.error}`;
  if (data.apps) return `Accessible apps:\n${data.apps.map((a: string) => `  • ${a}`).join("\n")}`;

  const lines: string[] = [];
  lines.push(`App: ${data.app}`);
  if (data.window) {
    lines.push(`Window: "${data.window.title}" (${data.window.w}x${data.window.h} at ${data.window.x},${data.window.y})`);
  }

  if (data.actions?.length > 0) {
    lines.push("");
    lines.push("--- ACTIONS ---");
    for (const a of data.actions) {
      let line = `[${a.id}] ${a.role}`;
      if (a.editable) line += " (editable)";
      if (a.checked) line += " (checked)";
      if (a.focused) line += " (focused)";
      if (a.disabled) line += " (disabled)";
      line += ` "${a.label}"`;
      if (a.value !== undefined) line += ` value=${JSON.stringify(a.value)}`;
      lines.push(line);
    }
  } else {
    lines.push("\n--- NO INTERACTIVE ELEMENTS ---");
  }

  if (data.texts?.length > 0) {
    lines.push("");
    lines.push("--- TEXT ---");
    for (const t of data.texts) {
      lines.push(`[T${t.id}] ${t.role}: ${t.text}`);
    }
  }

  return lines.join("\n");
}

export default function (pi: ExtensionAPI) {
  // ─── app_list ───
  pi.registerTool({
    name: "app_list",
    label: "List Desktop Apps",
    description:
      "Search for installed desktop applications (non-browser). " +
      "Use this to find apps by name before opening them. " +
      "Returns matching .desktop entries from the system. " +
      "Also shows apps currently visible to AT-SPI accessibility.",
    parameters: Type.Object({
      query: Type.Optional(
        Type.String({
          description:
            "Search term to filter apps (e.g. 'calculator', 'editor', 'file'). " +
            "Omit to list all installed apps.",
        })
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      try {
        // Search .desktop files for installed apps
        const grepArg = params.query || "";
        const cmd = grepArg
          ? `find ${APP_DIRS} -name '*.desktop' 2>/dev/null | xargs grep -li "Name=.*${grepArg}" 2>/dev/null | head -30`
          : `find ${APP_DIRS} -name '*.desktop' 2>/dev/null`;

        const desktopFiles = execFileSync("bash", ["-c", cmd], {
          encoding: "utf8",
          timeout: 5000,
        }).trim();

        // Parse each .desktop file for Name and Exec
        const apps: Array<{ name: string; exec: string; file: string }> = [];
        for (const f of desktopFiles.split("\n").filter(Boolean)) {
          try {
            const content = execFileSync("bash", ["-c", `grep -E '^(Name|Exec|NoDisplay)=' "${f}" | head -5`], {
              encoding: "utf8",
              timeout: 2000,
            });
            const nameMatch = content.match(/^Name=(.+)$/m);
            const execMatch = content.match(/^Exec=(.+)$/m);
            const noDisplay = content.includes("NoDisplay=true");
            if (nameMatch && execMatch && !noDisplay) {
              const name = nameMatch[1].trim();
              const query_lower = (params.query || "").toLowerCase();
              if (!query_lower || name.toLowerCase().includes(query_lower) || f.toLowerCase().includes(query_lower)) {
                apps.push({
                  name,
                  exec: execMatch[1].replace(/%[uUfF]/g, "").trim(),
                  file: f,
                });
              }
            }
          } catch {}
        }

        // Also list currently accessible apps
        let a11yApps: string[] = [];
        try {
          const raw = execWithStderr("python3", [A11Y_HARVEST], PYTHON_OPTS);
          const data = JSON.parse(raw);
          if (data.apps) a11yApps = data.apps;
        } catch {}

        const lines = [`Found ${apps.length} installed app(s):`];
        for (const app of apps) {
          lines.push(`  • ${app.name}  →  ${app.exec}`);
        }
        if (a11yApps.length > 0) {
          lines.push("");
          lines.push(`Currently running (AT-SPI visible): ${a11yApps.join(", ")}`);
        }

        return { content: [{ type: "text", text: lines.join("\n") }], details: {} };
      } catch (err: unknown) {
        const msg = (err as Error).message || "Unknown error";
        return { content: [{ type: "text", text: `Error listing apps: ${msg}` }], details: {} };
      }
    },
  });

  // ─── app_open ───

  function resolveExec(input: string): string {
    const trimmed = input.trim();

    // Already a full command (has path or spaces) — use as-is
    if (trimmed.startsWith("/") || trimmed.includes(" ")) return trimmed;

    // Looks like a flatpak app ID (has 2+ dots) — verify it's actually installed
    if (/^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+){2,}$/.test(trimmed)) {
      try {
        execFileSync("flatpak", ["info", "-r", trimmed], {
          encoding: "utf8", timeout: 5000,
        });
        return `flatpak run ${trimmed}`;
      } catch {}
    }

    // Bare name — search .desktop files for a matching Exec line
    try {
      const result = execFileSync("bash", ["-c",
        `grep -rlm1 -i "Name=.*${trimmed.replace(/[^a-zA-Z0-9 ]/g, ".")}.*" ${APP_DIRS} 2>/dev/null | head -1`
      ], { encoding: "utf8", timeout: 3000 }).trim();
      if (result) {
        const execLine = execFileSync("bash", ["-c",
          `grep -m1 '^Exec=' "${result}" | sed 's/^Exec=//' | sed 's/ %[uUfF]//g'`
        ], { encoding: "utf8", timeout: 3000 }).trim();
        if (execLine) return execLine;
      }
    } catch {}

    // Fall back to the input as-is
    return trimmed;
  }

  function isHttpUrl(input: string): boolean {
    try {
      const url = new URL(input.trim());
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }

  // Extract the flatpak app ID from a resolved exec like
  // "flatpak run io.github.foo.Bar" or "/usr/bin/flatpak run io.github.foo.Bar [args]"
  function extractFlatpakAppId(resolvedExec: string): string | null {
    const parts = resolvedExec.split(/\s+/).filter(Boolean);
    const flatpakIdx = parts.findIndex((p) => p === "flatpak" || p.endsWith("/flatpak"));
    if (flatpakIdx === -1) return null;
    if (parts[flatpakIdx + 1] !== "run") return null;
    const appId = parts[flatpakIdx + 2];
    return appId || null;
  }

  function flatpakAppInstalled(appId: string): boolean {
    try {
      execFileSync("flatpak", ["info", appId], {
        encoding: "utf8",
        timeout: 5000,
        stdio: ["ignore", "ignore", "ignore"],
      });
      return true;
    } catch {
      return false;
    }
  }

  pi.registerTool({
    name: "app_open",
    label: "Open Desktop App",
    description:
      "Launch a desktop application by name, flatpak ID, or command. " +
      "For browser URLs, prefer open_browser; URL inputs here are opened in Chromium as a fallback. " +
      "Accepts: app name ('BMI Calculator'), flatpak ID ('io.github...BmiCalculator'), " +
      "or full exec command from app_list. " +
      "Waits up to 10 seconds for the app to appear in the accessibility tree, " +
      "then automatically returns the app's UI state.",
    parameters: Type.Object({
      exec: Type.String({
        description:
          "App name, flatpak ID, or exec command from app_list. " +
          "If an http(s) URL is provided by mistake, it opens in Chromium. " +
          "Examples: 'BMI Calculator', 'io.github.johannesboehler2.BmiCalculator', " +
          "or '/usr/bin/flatpak run ... io.github...'",
      }),
      app_name: Type.Optional(
        Type.String({
          description:
            "Expected app name in the accessibility tree for detection. " +
            "If omitted, waits the full timeout and harvests whatever is new.",
        })
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      if (isHttpUrl(params.exec)) {
        const url = params.exec.trim();
        let browserError = "";
        const proc = spawn("chromium", ["--disable-session-crashed-bubble", url], {
          env: { ...process.env, DISPLAY: ":0" },
          detached: true,
          stdio: "ignore",
        });
        proc.on("error", (err) => { browserError = err.message; });
        proc.unref();

        await new Promise((r) => setTimeout(r, 200));
        if (browserError) {
          return {
            content: [{ type: "text", text: `Failed to open URL in Chromium: ${browserError}` }],
            details: {},
          };
        }

        return {
          content: [{
            type: "text",
            text: `Opened URL in Chromium: ${url}\nUse page_state/page_read/page_click/page_type for browser interaction.`,
          }],
          details: {},
        };
      }

      // Resolve the exec command from whatever the model gave us
      const resolvedExec = resolveExec(params.exec);

      // If this is a flatpak command, verify the app is actually installed
      // before trying to launch — otherwise we'd just time out for 10s and
      // report a vague "didn't appear in a11y tree" message.
      const flatpakAppId = extractFlatpakAppId(resolvedExec);
      if (flatpakAppId && !flatpakAppInstalled(flatpakAppId)) {
        return {
          content: [{
            type: "text",
            text:
              `App not installed: the flatpak "${flatpakAppId}" is not installed on this system. ` +
              `Use app_list to see installed apps, or install it first with: ` +
              `flatpak install flathub ${flatpakAppId}`,
          }],
          details: {},
        };
      }

      // Snapshot current a11y apps before launch
      let beforeApps: string[] = [];
      try {
        const raw = execWithStderr("python3", [A11Y_HARVEST], PYTHON_OPTS);
        const data = JSON.parse(raw);
        if (data.apps) beforeApps = data.apps;
      } catch {}

      // Launch the app
      const parts = resolvedExec.split(/\s+/);
      let spawnError = "";
      let stderrBuf = "";
      const proc = spawn(parts[0], parts.slice(1), {
        env: {
          ...process.env,
          DISPLAY: ":0",
          DBUS_SESSION_BUS_ADDRESS: process.env.DBUS_SESSION_BUS_ADDRESS || "unix:path=/run/user/1000/bus",
          GTK_MODULES: "gail:atk-bridge",
          NO_AT_BRIDGE: "0",
        },
        detached: true,
        stdio: ["ignore", "ignore", "pipe"],
      });
      proc.on("error", (err) => { spawnError = err.message; });
      proc.stderr?.on("data", (d: Buffer) => { stderrBuf += d.toString(); });
      proc.unref();

      // Give spawn a moment to fail if binary doesn't exist
      await new Promise((r) => setTimeout(r, 200));
      if (spawnError) {
        return {
          content: [{ type: "text", text: `Failed to launch "${resolvedExec}" (resolved from "${params.exec}"): ${spawnError}` }],
          details: {},
        };
      }

      // Wait for app to appear in a11y tree (up to 10s)
      const deadline = Date.now() + 10000;
      let newAppName = "";

      while (Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 500));
        try {
          const raw = execWithStderr("python3", [A11Y_HARVEST], PYTHON_OPTS);
          const data = JSON.parse(raw);
          if (data.apps) {
            const newApps = (data.apps as string[]).filter((a: string) => !beforeApps.includes(a));
            if (params.app_name) {
              const match = (data.apps as string[]).find(
                (a: string) => a.toLowerCase().includes(params.app_name!.toLowerCase())
              );
              if (match) {
                newAppName = match;
                // Give UI a moment to render
                await new Promise((r) => setTimeout(r, 1000));
                break;
              }
            } else if (newApps.length > 0) {
              newAppName = newApps[0];
              await new Promise((r) => setTimeout(r, 1000));
              break;
            }
          }
        } catch {}
      }

      if (!newAppName) {
        // Timeout — try to harvest whatever we can
        try {
          const raw = execWithStderr("python3", [A11Y_HARVEST], PYTHON_OPTS);
          const data = JSON.parse(raw);
          if (data.apps) {
            const newApps = (data.apps as string[]).filter((a: string) => !beforeApps.includes(a));
            if (newApps.length > 0) newAppName = newApps[0];
          }
        } catch {}
      }

      if (newAppName) {
        // Harvest the new app's state
        try {
          const raw = execWithStderr("python3", [A11Y_HARVEST, newAppName], PYTHON_OPTS);
          const formatted = formatHarvest(raw);
          return {
            content: [{ type: "text", text: `App launched: ${newAppName}\n\n${formatted}` }],
            details: {},
          };
        } catch (err: unknown) {
          return {
            content: [{ type: "text", text: `App launched: ${newAppName}\nBut failed to read state: ${(err as Error).message}` }],
            details: {},
          };
        }
      }

      return {
        content: [{
          type: "text",
          text:
            `App launched (${params.exec}) but didn't appear in accessibility tree within 10s. ` +
            `It may still be loading — try app_read_state to check.` +
            (stderrBuf.trim() ? `\n\nLaunch stderr:\n${stderrBuf.trim()}` : ""),
        }],
        details: {},
      };
    },
  });

  // ─── app_read_state ───
  pi.registerTool({
    name: "app_read_state",
    label: "Read App State",
    description:
      "Read the current UI state of a desktop application via its accessibility tree. " +
      "NOT for Chromium — use page_state for browser pages. " +
      "Returns all interactive elements (buttons, text fields, combos) with IDs for use " +
      "with app_click / app_fill / app_do_action, plus visible text content.",
    parameters: Type.Object({
      app: Type.String({
        description:
          "App name or substring to match (e.g. 'calculator', 'bmi', 'terminal'). " +
          "Use app_list to see available apps.",
      }),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      try {
        const raw = execWithStderr("python3", [A11Y_HARVEST, params.app], PYTHON_OPTS);
        const formatted = formatHarvest(raw);
        return { content: [{ type: "text", text: formatted }], details: {} };
      } catch (err: unknown) {
        const msg = (err as Error).message || "Unknown error";
        return {
          content: [{ type: "text", text: `Error reading app state: ${msg}` }],
          details: {},
        };
      }
    },
  });

  // ─── app_click ───
  pi.registerTool({
    name: "app_click",
    label: "Click App Element",
    description:
      "Click a button or interactive element in a desktop app by its label. " +
      "Uses the AT-SPI Action interface (not screen coordinates). " +
      "The label should match what you see in app_read_state output.",
    parameters: Type.Object({
      app: Type.String({
        description: "App name or substring (e.g. 'calculator', 'bmi')",
      }),
      label: Type.String({
        description: "Label of the element to click (e.g. 'Calculate', 'Save', 'OK')",
      }),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      try {
        const raw = execWithStderr(
          "python3", [A11Y_ACTION, params.app, "click", params.label],
          PYTHON_OPTS,
        );
        const result = JSON.parse(raw);
        if (result.error) {
          return { content: [{ type: "text", text: `Click failed: ${result.error}` }], details: {} };
        }
        return {
          content: [{ type: "text", text: `Clicked [${result.role}] "${result.label}" (action: ${result.action})` }],
          details: {},
        };
      } catch (err: unknown) {
        return {
          content: [{ type: "text", text: `Error: ${(err as Error).message}` }],
          details: {},
        };
      }
    },
  });

  // ─── app_fill ───
  pi.registerTool({
    name: "app_fill",
    label: "Fill App Text Field",
    description:
      "Set the text content of an input field in a desktop app. " +
      "Uses AT-SPI EditableText interface to directly set the value. " +
      "The label should match an editable text field from app_read_state.",
    parameters: Type.Object({
      app: Type.String({
        description: "App name or substring (e.g. 'calculator', 'bmi')",
      }),
      label: Type.String({
        description: "Label of the text field (e.g. 'Weight (in kg)', 'Search')",
      }),
      value: Type.String({
        description: "Text to set in the field",
      }),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      try {
        const raw = execWithStderr(
          "python3", [A11Y_ACTION, params.app, "set_text", params.label, params.value],
          PYTHON_OPTS,
        );
        const result = JSON.parse(raw);
        if (result.error) {
          return { content: [{ type: "text", text: `Fill failed: ${result.error}` }], details: {} };
        }
        return {
          content: [{ type: "text", text: `Set "${result.label}" = "${result.readback}"` }],
          details: {},
        };
      } catch (err: unknown) {
        return {
          content: [{ type: "text", text: `Error: ${(err as Error).message}` }],
          details: {},
        };
      }
    },
  });

  // ─── app_select ───
  pi.registerTool({
    name: "app_select",
    label: "Select App Combo Item",
    description:
      "Select an item from a combo box / dropdown in a desktop app. " +
      "Use app_read_state to find the combo box label and available items.",
    parameters: Type.Object({
      app: Type.String({
        description: "App name or substring",
      }),
      combo_label: Type.String({
        description: "Label of the combo box (e.g. 'Gender', 'Format')",
      }),
      item: Type.String({
        description: "Label of the item to select (e.g. 'Male', 'Female', 'PDF')",
      }),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      try {
        const raw = execWithStderr(
          "python3", [A11Y_ACTION, params.app, "select", params.combo_label, params.item],
          PYTHON_OPTS,
        );
        const result = JSON.parse(raw);
        if (result.error) {
          return { content: [{ type: "text", text: `Select failed: ${result.error}` }], details: {} };
        }
        return {
          content: [{ type: "text", text: `Selected "${result.selected}" in combo "${result.combo}"` }],
          details: {},
        };
      } catch (err: unknown) {
        return {
          content: [{ type: "text", text: `Error: ${(err as Error).message}` }],
          details: {},
        };
      }
    },
  });

  // ─── app_key ───
  pi.registerTool({
    name: "app_key",
    label: "Press Key in App",
    description:
      "Send a key press or keyboard shortcut to a desktop app. " +
      "Use for navigation (Tab, Return, Escape), arrow keys (Up, Down, Left, Right), " +
      "undo (ctrl+z), save (ctrl+s), copy/paste (ctrl+c, ctrl+v), close (ctrl+w), etc. " +
      "Key names follow xdotool syntax. NOT for Chromium — use page_click/page_type there.",
    parameters: Type.Object({
      app: Type.String({
        description: "App name or substring (e.g. 'calculator', 'mousepad')",
      }),
      key: Type.String({
        description:
          "Key name in xdotool syntax. Examples: Return, Escape, Tab, Up, Down, Left, Right, " +
          "BackSpace, Delete, ctrl+s, ctrl+z, ctrl+a, ctrl+c, ctrl+v, alt+F4, super+d",
      }),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      try {
        const raw = execWithStderr(
          "python3", [A11Y_ACTION, params.app, "key", params.key],
          PYTHON_OPTS,
        );
        const result = JSON.parse(raw);
        if (result.error) {
          return { content: [{ type: "text", text: `Key failed: ${result.error}` }], details: {} };
        }
        return {
          content: [{ type: "text", text: `Sent key "${result.key}" to ${params.app}` }],
          details: {},
        };
      } catch (err: unknown) {
        return { content: [{ type: "text", text: `Error: ${(err as Error).message}` }], details: {} };
      }
    },
  });

  // ─── app_type ───
  pi.registerTool({
    name: "app_type",
    label: "Type Text in App",
    description:
      "Type text character-by-character via keyboard events in a desktop app. " +
      "Use as a fallback when app_fill fails (e.g. Electron apps or apps without AT-SPI EditableText). " +
      "First focus the target field with app_click, then call this. " +
      "Prefer app_fill for standard GTK text fields — it is faster and more reliable.",
    parameters: Type.Object({
      app: Type.String({
        description: "App name or substring",
      }),
      text: Type.String({
        description: "Text to type into the focused field",
      }),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      try {
        const raw = execWithStderr(
          "python3", [A11Y_ACTION, params.app, "type", params.text],
          { ...PYTHON_OPTS, timeout: 20000 },
        );
        const result = JSON.parse(raw);
        if (result.error) {
          return { content: [{ type: "text", text: `Type failed: ${result.error}` }], details: {} };
        }
        return {
          content: [{ type: "text", text: `Typed "${result.typed}" into ${params.app}` }],
          details: {},
        };
      } catch (err: unknown) {
        return { content: [{ type: "text", text: `Error: ${(err as Error).message}` }], details: {} };
      }
    },
  });

  // ─── app_scroll ───
  pi.registerTool({
    name: "app_scroll",
    label: "Scroll in App",
    description:
      "Scroll within a desktop app's scroll area. " +
      "Use when the app has more content than fits the window (long lists, settings panels, documents). " +
      "Targets the largest visible scroll pane automatically.",
    parameters: Type.Object({
      app: Type.String({
        description: "App name or substring",
      }),
      direction: Type.Union(
        [Type.Literal("up"), Type.Literal("down"), Type.Literal("left"), Type.Literal("right")],
        { description: "Scroll direction" }
      ),
      amount: Type.Optional(
        Type.Number({
          description: "Number of scroll ticks (default 3). Use larger values (5–10) for long documents.",
        })
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      try {
        const amount = params.amount ?? 3;
        const raw = execWithStderr(
          "python3", [A11Y_ACTION, params.app, "scroll", params.direction, String(amount)],
          PYTHON_OPTS,
        );
        const result = JSON.parse(raw);
        if (result.error) {
          return { content: [{ type: "text", text: `Scroll failed: ${result.error}` }], details: {} };
        }
        return {
          content: [{ type: "text", text: `Scrolled ${result.direction} ${result.ticks} tick(s) in ${params.app}` }],
          details: {},
        };
      } catch (err: unknown) {
        return { content: [{ type: "text", text: `Error: ${(err as Error).message}` }], details: {} };
      }
    },
  });

  // ─── app_set_value ───
  pi.registerTool({
    name: "app_set_value",
    label: "Set Slider / Spinner Value",
    description:
      "Set the numeric value of a slider or spin button in a desktop app via the AT-SPI Value interface. " +
      "Use app_read_state to find elements — they show 'value=<number>' when they support this. " +
      "For text fields use app_fill instead.",
    parameters: Type.Object({
      app: Type.String({
        description: "App name or substring",
      }),
      label: Type.String({
        description: "Label of the slider or spinner from app_read_state",
      }),
      value: Type.Number({
        description: "Numeric value to set",
      }),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      try {
        const raw = execWithStderr(
          "python3", [A11Y_ACTION, params.app, "set_value", params.label, String(params.value)],
          PYTHON_OPTS,
        );
        const result = JSON.parse(raw);
        if (result.error) {
          return { content: [{ type: "text", text: `set_value failed: ${result.error}` }], details: {} };
        }
        return {
          content: [{ type: "text", text: `Set "${result.label}" = ${result.readback} (requested ${result.value_set})` }],
          details: {},
        };
      } catch (err: unknown) {
        return { content: [{ type: "text", text: `Error: ${(err as Error).message}` }], details: {} };
      }
    },
  });

  // ─── app_do_action ───
  pi.registerTool({
    name: "app_do_action",
    label: "Invoke AT-SPI Action",
    description:
      "Invoke a named AT-SPI action on a UI element in a desktop app. " +
      "Use for actions beyond click: 'expand' / 'collapse' on tree nodes, " +
      "'open' on menu items, 'activate' on list items, etc. " +
      "If the action name is unknown, it returns the available action names for that element.",
    parameters: Type.Object({
      app: Type.String({
        description: "App name or substring",
      }),
      label: Type.String({
        description: "Label of the element from app_read_state",
      }),
      action: Type.String({
        description: "AT-SPI action name, e.g. 'expand', 'collapse', 'open', 'activate', 'press'",
      }),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      try {
        const raw = execWithStderr(
          "python3", [A11Y_ACTION, params.app, "action", params.label, params.action],
          PYTHON_OPTS,
        );
        const result = JSON.parse(raw);
        if (result.error) {
          return { content: [{ type: "text", text: `Action failed: ${result.error}` }], details: {} };
        }
        return {
          content: [{ type: "text", text: `Invoked "${result.action}" on "${result.label}"` }],
          details: {},
        };
      } catch (err: unknown) {
        return { content: [{ type: "text", text: `Error: ${(err as Error).message}` }], details: {} };
      }
    },
  });

  // ─── screenshot ───
  pi.registerTool({
    name: "app_screenshot",
    label: "Screenshot Desktop",
    description:
      "Take a screenshot of the entire desktop or a specific window. " +
      "Only use this when the user explicitly asks for a screenshot or image-based verification; " +
      "otherwise use app_read_state or page_state to inspect UI state. " +
      "Returns the image as base64 PNG (usable with vision models). " +
      "Optionally saves to a file path. If the final deliverable should be a PDF with this screenshot, " +
      "save the screenshot as PNG, then call save_deliverable with Markdown content that embeds the PNG.",
    parameters: Type.Object({
      window: Type.Optional(
        Type.String({
          description:
            "Window title substring to capture (e.g. 'BMI', 'Terminal'). " +
            "Omit to capture the full desktop.",
        })
      ),
      save_path: Type.Optional(
        Type.String({
          description:
            "File path to save the screenshot PNG to. Relative paths are saved under /home/agent/deliverables. " +
            "The base64 image is always returned regardless.",
        })
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      try {
        const ts = Date.now();
        const tmpFile = `/tmp/screenshot-${ts}.png`;
        const env = { ...process.env, DISPLAY: ":0" };
        const savePath = normalizeScreenshotSavePath(params.save_path, ts);

        if (params.window) {
          // Find window ID by title
          const wmList = execFileSync("bash", [
            "-c",
            `DISPLAY=:0 wmctrl -l | grep -i "${params.window.replace(/"/g, '\\"')}" | head -1 | awk '{print $1}'`,
          ], { encoding: "utf8", env, timeout: 5000 }).trim();

          if (!wmList) {
            const allWindows = execFileSync("bash", [
              "-c", "DISPLAY=:0 wmctrl -l | awk '{$1=$2=$3=\"\"; print substr($0,4)}'",
            ], { encoding: "utf8", env, timeout: 5000 }).trim();
            return {
              content: [{
                type: "text",
                text: `Window "${params.window}" not found. Open windows:\n${allWindows || "(none)"}`,
              }],
              details: {},
            };
          }

          execFileSync("import", ["-window", wmList, tmpFile], { env, timeout: 10000 });
        } else {
          execFileSync("import", ["-window", "root", tmpFile], { env, timeout: 10000 });
        }

        // Save to final destination
        execFileSync("mkdir", ["-p", dirname(savePath)], { env, timeout: 5000 });
        execFileSync("cp", [tmpFile, savePath], { env, timeout: 5000 });

        // Read as base64 for vision models
        const b64 = execFileSync("base64", ["-w", "0", tmpFile], {
          encoding: "utf8",
          maxBuffer: 10 * 1024 * 1024,
          timeout: 10000,
        }).trim();

        // Get file size for info
        const sizeInfo = execFileSync("bash", ["-c",
          `stat -c '%s' "${savePath}" 2>/dev/null || stat -f '%z' "${savePath}"`
        ], { encoding: "utf8", timeout: 3000 }).trim();

        execFileSync("rm", ["-f", tmpFile], { timeout: 5000 });

        return {
          content: [
            {
              type: "image",
              data: b64,
              mimeType: "image/png",
            } as any,
            {
              type: "text",
              text: `Screenshot saved to ${savePath} (${Math.round(parseInt(sizeInfo) / 1024)}KB). Do NOT re-save this via save_deliverable — the file is already on disk.`,
            },
          ],
          details: {},
        };
      } catch (err: unknown) {
        return {
          content: [{ type: "text", text: `Screenshot error: ${(err as Error).message}` }],
          details: {},
        };
      }
    },
  });
}

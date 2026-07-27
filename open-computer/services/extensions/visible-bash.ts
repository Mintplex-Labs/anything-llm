import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { spawn } from "child_process";
import {
  writeFileSync,
  readFileSync,
  unlinkSync,
  mkdtempSync,
  existsSync,
} from "fs";
import { tmpdir } from "os";
import { join } from "path";

const MAX_OUTPUT_BYTES = 256 * 1024;
const MAX_OUTPUT_LINES = 2000;
const STREAM_POLL_MS = 150;

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "bash",
    label: "bash",
    description:
      `Execute a bash command in a visible terminal on the desktop. ` +
      `The user can watch the command run in real time. ` +
      `Returns stdout and stderr. Output is truncated to last ${MAX_OUTPUT_LINES} lines ` +
      `or ${MAX_OUTPUT_BYTES / 1024}KB. Optionally provide a timeout in seconds.`,
    parameters: Type.Object({
      command: Type.String({ description: "Bash command to execute" }),
      reason: Type.Optional(
        Type.String({
          description:
            "Short explanation of why you are running this command, shown to the user in the terminal banner",
        })
      ),
      timeout: Type.Optional(
        Type.Number({
          description: "Timeout in seconds (optional, no default timeout)",
        })
      ),
      linger: Type.Optional(
        Type.Number({
          description:
            "Seconds to keep the terminal open after the command finishes (default 5)",
        })
      ),
    }),
    async execute(_toolCallId, params: { command: string; reason?: string; timeout?: number; linger?: number }, signal, onUpdate, _ctx) {
      const { command, reason, timeout, linger = 5 } = params;

      const tmpDir = mkdtempSync(join(tmpdir(), "pi-vbash-"));
      const outputFile = join(tmpDir, "output.log");
      const exitCodeFile = join(tmpDir, "exitcode");
      const wrapperScript = join(tmpDir, "run.sh");

      writeFileSync(outputFile, "");

      // Wrapper script: runs the real command, tees to output file, records exit code.
      // Uses script(1) to allocate a PTY so programs that detect TTY still behave normally.
      const bannerLines: string[] = [];
      if (reason) {
        const divider = "─".repeat(60);
        bannerLines.push(
          `echo -e "\\033[1;36m${divider}\\033[0m"`,
          `echo -e "\\033[1;36m 🤖 ${reason.replace(/"/g, '\\"')}\\033[0m"`,
          `echo -e "\\033[1;36m${divider}\\033[0m"`,
          `echo ""`,
        );
      }

      const lingerSec = Math.max(0, Math.min(linger, 30));

      writeFileSync(
        wrapperScript,
        [
          "#!/bin/bash",
          `exec > >(tee -a "${outputFile}") 2>&1`,
          ...bannerLines,
          `( ${command} )`,
          `EC=$?`,
          `echo $EC > "${exitCodeFile}"`,
          `echo ""`,
          `if [ $EC -eq 0 ]; then`,
          `  echo -e "\\033[1;32m✔ Command finished (exit 0)\\033[0m"`,
          `else`,
          `  echo -e "\\033[1;31m✘ Command failed (exit $EC)\\033[0m"`,
          `fi`,
          `sleep ${lingerSec}`,
          `exit $EC`,
        ].join("\n"),
        { mode: 0o755 }
      );

      // Open a visible xfce4-terminal on DISPLAY=:0 running the wrapper
      const termTitle = `$ ${command.length > 80 ? command.slice(0, 77) + "..." : command}`;
      const termProc = spawn(
        "xfce4-terminal",
        [
          "--disable-server",
          "--title",
          termTitle,
          "--command",
          wrapperScript,
        ],
        {
          env: { ...process.env, DISPLAY: process.env.DISPLAY || ":99" },
          stdio: "ignore",
        }
      );

      let timedOut = false;
      let timeoutHandle: NodeJS.Timeout | undefined;
      let pollHandle: NodeJS.Timeout | undefined;
      let lastStreamedLen = 0;

      const cleanup = () => {
        if (timeoutHandle) clearTimeout(timeoutHandle);
        if (pollHandle) clearInterval(pollHandle);
        try { unlinkSync(outputFile); } catch {}
        try { unlinkSync(exitCodeFile); } catch {}
        try { unlinkSync(wrapperScript); } catch {}
        try { require("fs").rmdirSync(tmpDir); } catch {}
      };

      // Stream partial output back to the agent as it arrives
      if (onUpdate) {
        onUpdate({ content: [], details: undefined });
        pollHandle = setInterval(() => {
          try {
            const raw = readFileSync(outputFile, "utf-8");
            if (raw.length > lastStreamedLen) {
              lastStreamedLen = raw.length;
              const truncated = truncateOutput(raw);
              onUpdate({
                content: [{ type: "text", text: truncated }],
                details: {},
              });
            }
          } catch {}
        }, STREAM_POLL_MS);
      }

      try {
        const exitCode = await new Promise<number | null>((resolve, reject) => {
          if (timeout !== undefined && timeout > 0) {
            timeoutHandle = setTimeout(() => {
              timedOut = true;
              try { process.kill(-termProc.pid!, "SIGKILL"); } catch {}
              try { termProc.kill("SIGKILL"); } catch {}
            }, timeout * 1000);
          }

          const onAbort = () => {
            try { process.kill(-termProc.pid!, "SIGKILL"); } catch {}
            try { termProc.kill("SIGKILL"); } catch {}
          };

          if (signal) {
            if (signal.aborted) {
              onAbort();
              return reject(new Error("aborted"));
            }
            signal.addEventListener("abort", onAbort, { once: true });
          }

          termProc.on("error", (err) => reject(err));
          termProc.on("exit", (code) => {
            if (signal) signal.removeEventListener("abort", onAbort);
            resolve(code);
          });
        });

        // Brief wait for output file to flush
        await new Promise((r) => setTimeout(r, 100));

        let output = "";
        try {
          output = readFileSync(outputFile, "utf-8");
        } catch {}

        let realExitCode = exitCode;
        try {
          const ecStr = readFileSync(exitCodeFile, "utf-8").trim();
          if (ecStr) realExitCode = parseInt(ecStr, 10);
        } catch {}

        if (signal?.aborted) {
          throw new Error(
            output
              ? `${truncateOutput(output)}\n\nCommand aborted`
              : "Command aborted"
          );
        }

        if (timedOut) {
          throw new Error(
            output
              ? `${truncateOutput(output)}\n\nCommand timed out after ${timeout} seconds`
              : `Command timed out after ${timeout} seconds`
          );
        }

        const text = truncateOutput(output) || "(no output)";

        if (realExitCode !== 0 && realExitCode !== null) {
          throw new Error(`${text}\n\nCommand exited with code ${realExitCode}`);
        }

        return { content: [{ type: "text", text }], details: {} };
      } finally {
        cleanup();
      }
    },
  });
}

function truncateOutput(raw: string): string {
  if (raw.length <= MAX_OUTPUT_BYTES && raw.split("\n").length <= MAX_OUTPUT_LINES) {
    return raw;
  }

  let text = raw;
  if (text.length > MAX_OUTPUT_BYTES) {
    text = text.slice(-MAX_OUTPUT_BYTES);
    const nl = text.indexOf("\n");
    if (nl !== -1) text = text.slice(nl + 1);
  }

  const lines = text.split("\n");
  if (lines.length > MAX_OUTPUT_LINES) {
    const kept = lines.slice(-MAX_OUTPUT_LINES);
    const skipped = lines.length - MAX_OUTPUT_LINES;
    return `[...${skipped} lines truncated...]\n${kept.join("\n")}`;
  }

  return text;
}

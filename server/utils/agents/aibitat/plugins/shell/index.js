const { exec } = require("child_process");
const {
  canUseTerminal,
  validateReadPath,
  DENIAL_REASONS,
  explainDenial,
  auditLog,
  commandHash,
} = require("../../../../fileAccessPolicy");

const MAX_OUTPUT_CHARS = 20_000;
const DEFAULT_TIMEOUT_MS = 30_000;

function runShellCommand(command, cwd, timeoutMs = DEFAULT_TIMEOUT_MS) {
  return new Promise((resolve) => {
    exec(
      command,
      {
        cwd,
        timeout: Math.min(
          Math.max(Number(timeoutMs) || DEFAULT_TIMEOUT_MS, 1_000),
          120_000
        ),
        maxBuffer: 1024 * 1024,
        shell: process.env.SHELL || "/bin/sh",
      },
      (error, stdout, stderr) => {
        const output = [stdout, stderr].filter(Boolean).join("\n");
        resolve({
          exitCode: error?.code ?? 0,
          timedOut: error?.killed === true,
          output:
            output.length > MAX_OUTPUT_CHARS
              ? `${output.slice(0, MAX_OUTPUT_CHARS)}\n[Output truncated]`
              : output,
        });
      }
    );
  });
}

const shellAgent = {
  name: "shell-agent",
  startupConfig: {
    params: {},
  },
  plugin: function () {
    return {
      name: this.name,
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Execute a local shell command. This is high risk and only works when the current file access mode is Open. Every command requires explicit user approval.",
          examples: [
            {
              prompt: "List files in my project directory",
              call: JSON.stringify({
                command: "ls -la",
                cwd: "~/Projects",
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              command: {
                type: "string",
                description: "The shell command to execute.",
              },
              cwd: {
                type: "string",
                description:
                  "Working directory for the command. Defaults to the current process directory.",
              },
              timeoutMs: {
                type: "number",
                description:
                  "Optional timeout in milliseconds. Maximum 120000.",
              },
            },
            required: ["command"],
            additionalProperties: false,
          },
          handler: async function ({
            command = "",
            cwd = process.cwd(),
            timeoutMs = DEFAULT_TIMEOUT_MS,
          }) {
            const context = {
              ...(this.super.handlerProps.fileAccessContext || {}),
              tool: this.name,
            };
            const terminal = await canUseTerminal(context);
            if (!terminal.allowed) {
              await auditLog("file_access_path_denied", {
                user: context.user || context.invocation?.user_id || null,
                workspace: context.workspace || context.invocation?.workspace,
                thread: context.thread || context.invocation,
                mode: terminal.mode,
                tool: this.name,
                reason: terminal.reason,
                allowed: false,
              });
              return JSON.stringify({
                success: false,
                reason: DENIAL_REASONS.terminalNotAllowed,
                error: explainDenial(DENIAL_REASONS.terminalNotAllowed),
              });
            }

            const cwdValidation = await validateReadPath(cwd, context);
            if (!cwdValidation.allowed) {
              return JSON.stringify({
                success: false,
                reason: cwdValidation.reason,
                error: cwdValidation.message,
              });
            }

            if (!this.super.requestToolApproval) {
              return JSON.stringify({
                success: false,
                reason: DENIAL_REASONS.approvalRequired,
                error: explainDenial(DENIAL_REASONS.approvalRequired),
              });
            }

            await auditLog("file_access_shell_approval_requested", {
              user: context.user || context.invocation?.user_id || null,
              workspace: context.workspace || context.invocation?.workspace,
              thread: context.thread || context.invocation,
              mode: terminal.mode,
              tool: this.name,
              root: cwdValidation.path,
              allowed: null,
              metadata: { commandHash: commandHash(command) },
            });

            const approval = await this.super.requestToolApproval({
              skillName: this.name,
              payload: {
                command,
                cwd: cwdValidation.path,
                mode: terminal.mode,
                risk: "Open mode shell execution can read, write, delete, or exfiltrate local files.",
              },
              description:
                "Run a local shell command in Open file access mode.",
              forceApproval: true,
              allowAlwaysAllow: false,
            });

            if (!approval.approved) {
              await auditLog("file_access_shell_executed", {
                user: context.user || context.invocation?.user_id || null,
                workspace: context.workspace || context.invocation?.workspace,
                thread: context.thread || context.invocation,
                mode: terminal.mode,
                tool: this.name,
                root: cwdValidation.path,
                reason: DENIAL_REASONS.approvalDenied,
                allowed: false,
                metadata: { commandHash: commandHash(command) },
              });
              return JSON.stringify({
                success: false,
                reason: DENIAL_REASONS.approvalDenied,
                error:
                  approval.message ||
                  explainDenial(DENIAL_REASONS.approvalDenied),
              });
            }

            const result = await runShellCommand(
              command,
              cwdValidation.path,
              timeoutMs
            );
            await auditLog("file_access_shell_executed", {
              user: context.user || context.invocation?.user_id || null,
              workspace: context.workspace || context.invocation?.workspace,
              thread: context.thread || context.invocation,
              mode: terminal.mode,
              tool: this.name,
              root: cwdValidation.path,
              allowed: true,
              metadata: {
                commandHash: commandHash(command),
                exitCode: result.exitCode,
                timedOut: result.timedOut,
              },
            });

            return JSON.stringify({
              success: result.exitCode === 0 && !result.timedOut,
              exitCode: result.exitCode,
              timedOut: result.timedOut,
              output: result.output,
            });
          },
        });
      },
    };
  },
};

module.exports = { shellAgent };

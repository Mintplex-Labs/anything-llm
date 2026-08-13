// Global flag toggled by --json before command execution
let jsonMode = false;

export function setJsonMode(value: boolean): void {
  jsonMode = value;
}

export function isJsonMode(): boolean {
  return jsonMode;
}

export function jsonOk(fields: Record<string, unknown> = {}): void {
  console.log(JSON.stringify({ ok: true, ...fields }));
}

export function jsonErr(message: string): never {
  if (jsonMode) {
    process.stderr.write(JSON.stringify({ ok: false, error: message }) + '\n');
  } else {
    process.stderr.write(`Error: ${message}\n`);
  }
  process.exit(1);
}

/** Print only in human mode */
export function info(message: string): void {
  if (!jsonMode) console.log(message);
}

/** Always print to stderr */
export function warn(message: string): void {
  if (!jsonMode) process.stderr.write(`Warning: ${message}\n`);
}

/** Print only in human mode, to stderr */
export function errorMsg(message: string): void {
  if (!jsonMode) process.stderr.write(`Error: ${message}\n`);
}

export const CMD_REGEX = /[^a-zA-Z0-9_-]/g;

// Built-in commands reserved for system use. A preset command cannot
// exactly match one of these, but may extend one (eg: /reset-all is valid).
export const RESERVED_COMMANDS = ["/reset", "/img"];
export function isReservedCommand(command = "") {
  return RESERVED_COMMANDS.includes(String(command).toLowerCase());
}

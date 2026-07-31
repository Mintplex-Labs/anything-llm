import { spawnSync, spawn } from 'child_process';

export const SSH_OPTS = [
  '-o', 'StrictHostKeyChecking=no',
  '-o', 'UserKnownHostsFile=/dev/null',
  '-o', 'LogLevel=ERROR',
];

interface RunOptions {
  /** If true, suppress stdio output and return stdout as string */
  silent?: boolean;
  /** Timeout in milliseconds */
  timeout?: number;
}

export function sshRun(
  port: number,
  user: string,
  command: string,
  opts: RunOptions = {},
): { ok: boolean; output: string } {
  const args = [...SSH_OPTS, '-p', String(port), `${user}@localhost`, command];
  const result = spawnSync('ssh', args, {
    stdio: opts.silent ? 'pipe' : 'inherit',
    timeout: opts.timeout,
    encoding: 'utf8',
  });
  return {
    ok: result.status === 0,
    output: (result.stdout ?? '') + (result.stderr ?? ''),
  };
}

/** Open an interactive SSH shell (inherits stdio). Allocates a PTY (-t) so
 *  remote programs that require a terminal (e.g. `su` password prompts) work. */
export function sshInteractive(port: number, user: string, command?: string): void {
  const args = [...SSH_OPTS, '-t', '-p', String(port), `${user}@localhost`];
  if (command) args.push(command);
  const child = spawn('ssh', args, { stdio: 'inherit' });
  child.on('exit', (code) => process.exit(code ?? 0));
}

export function scpTo(
  port: number,
  user: string,
  localPath: string,
  remotePath: string,
  opts: { recursive?: boolean; silent?: boolean } = {},
): boolean {
  const args = [
    ...SSH_OPTS,
    ...(opts.recursive ? ['-r'] : []),
    '-P', String(port),
    localPath,
    `${user}@localhost:${remotePath}`,
  ];
  const result = spawnSync('scp', args, {
    stdio: opts.silent ? 'pipe' : 'inherit',
  });
  return result.status === 0;
}

export function scpFrom(
  port: number,
  user: string,
  remotePath: string,
  localPath: string,
  opts: { recursive?: boolean; silent?: boolean } = {},
): boolean {
  const args = [
    ...SSH_OPTS,
    ...(opts.recursive ? ['-r'] : []),
    '-P', String(port),
    `${user}@localhost:${remotePath}`,
    localPath,
  ];
  const result = spawnSync('scp', args, {
    stdio: opts.silent ? 'pipe' : 'inherit',
  });
  return result.status === 0;
}

/** Wait until SSH is reachable, retrying up to maxAttempts times with delaySec between. */
export function waitForSsh(
  port: number,
  user: string,
  maxAttempts = 30,
  delaySec = 2,
): boolean {
  for (let i = 0; i < maxAttempts; i++) {
    const result = spawnSync('ssh', [...SSH_OPTS, '-p', String(port), `${user}@localhost`, 'true'], {
      stdio: 'pipe',
      timeout: 5000,
    });
    if (result.status === 0) return true;
    // Sleep delaySec
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delaySec * 1000);
  }
  return false;
}

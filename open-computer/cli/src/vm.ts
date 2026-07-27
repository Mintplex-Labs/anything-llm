import * as fs from 'fs';
import * as path from 'path';
import { spawnSync, spawn } from 'child_process';
import {
  PLATFORM, GUEST_ARCH, CPUS, RAM, SERVICE_DIR,
  resolveQemuBinary, resolveQemuImgBinary, resolveEfiCode, resolveEfiVars,
  type Platform,
} from './config.js';

// ── Process helpers ──────────────────────────────────────────────────────────

export function isRunning(pidFile: string): boolean {
  if (!fs.existsSync(pidFile)) return false;
  try {
    const pid = parseInt(fs.readFileSync(pidFile, 'utf8').trim(), 10);
    if (isNaN(pid)) return false;
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

export function readPid(pidFile: string): number | null {
  if (!fs.existsSync(pidFile)) return null;
  const pid = parseInt(fs.readFileSync(pidFile, 'utf8').trim(), 10);
  return isNaN(pid) ? null : pid;
}

export function killPid(pidFile: string): void {
  const pid = readPid(pidFile);
  if (pid !== null) {
    try { process.kill(pid, 'SIGKILL'); } catch { /* already gone */ }
  }
  fs.rmSync(pidFile, { force: true });
}

/**
 * Remove a QEMU monitor socket file, tolerating platform quirks.
 * On Windows the AF_UNIX socket file created by `-monitor unix:` can make
 * fs.rmSync throw EACCES (lstat fails), so fall back to `cmd del`. Never throws.
 */
export function removeMonitorSock(sock: string): void {
  try {
    fs.rmSync(sock, { force: true });
  } catch {
    if (PLATFORM === 'win32') {
      try { spawnSync('cmd', ['/c', 'del', '/f', '/q', sock], { stdio: 'ignore' }); } catch { /* ignore */ }
    }
  }
}

// ── QEMU args builder ────────────────────────────────────────────────────────

interface QemuArgsOptions {
  disk: string;
  efi: string;
  sshPort: number;
  pidFile: string;
  monitorSock: string;
  appPort?: number;
  dev?: boolean;
  gui?: boolean;
  vncDisplay?: number;
  /** Optional installer ISO to attach as a bootable CD-ROM (used by `base install`). */
  iso?: string;
}

// Machine/accelerator/CPU flags. Pure and parameterized so the platform matrix
// can be unit tested without spawning QEMU.
export function buildMachineArgs(
  platform: Platform = PLATFORM,
  guestArch: 'aarch64' | 'x86_64' = GUEST_ARCH,
): string[] {
  // Machine type depends on the guest ISA, not the host OS.
  // 'virt' is the ARM64 platform board; 'q35' is the x86_64 platform board.
  const machine = guestArch === 'aarch64' ? 'virt,highmem=on' : 'q35';

  if (platform === 'win32') {
    // WHPX + `-cpu host` crashes on some AMD CPUs (Zen4 exposes APX/MPX features
    // WHPX rejects -> "Unexpected VP exit code 4"). Use a compatible named model
    // for the x86_64 guest; the arm64 guest still needs host passthrough.
    const cpu = guestArch === 'x86_64' ? 'Haswell' : 'host';
    return ['-machine', machine, '-accel', 'whpx', '-cpu', cpu];
  }
  if (platform === 'linux') {
    return ['-machine', machine, '-accel', 'kvm', '-cpu', 'host'];
  }
  // macOS (darwin): HVF for both arm64 (virt) and x64 (q35)
  return ['-machine', machine, '-accel', 'hvf', '-cpu', 'host'];
}

// Display adapter flags. OVMF on the bundled Windows QEMU build does not render
// to virtio-gpu over VNC, so Windows uses a standard VGA adapter; other
// platforms keep virtio-gpu. Pure and parameterized for testing.
export function gpuDeviceArgs(platform: Platform = PLATFORM): string[] {
  return platform === 'win32' ? ['-device', 'VGA'] : ['-device', 'virtio-gpu-pci'];
}

// Installer ISO CD-ROM flags (base install only). Scoped to Windows: it uses the
// q35 AHCI bus (ide.0), which does not exist on the aarch64 `virt` machine used
// on macOS/Linux arm64 hosts. Returns an empty array when not applicable.
export function isoDeviceArgs(iso: string | undefined, platform: Platform = PLATFORM): string[] {
  if (!iso || platform !== 'win32') return [];
  return [
    '-drive', `file=${iso},media=cdrom,readonly=on,if=none,id=install-cdrom`,
    '-device', 'usb-storage,drive=install-cdrom',
  ];
}

export function buildQemuArgs(opts: QemuArgsOptions): string[] {
  const { disk, efi, sshPort, pidFile, monitorSock, appPort, dev, vncDisplay = 1, iso } = opts;
  const efiCode = resolveEfiCode();

  // Ensure per-VM efi-vars.fd exists. Windows needs the OVMF VARS template
  // (copying CODE leaves OVMF without a variable store); other platforms keep
  // the original behavior so their setup is unchanged.
  if (!fs.existsSync(efi)) {
    fs.copyFileSync(PLATFORM === 'win32' ? resolveEfiVars() : efiCode, efi);
  }

  let netdev = `user,id=net0,hostfwd=tcp::${sshPort}-:22`;
  if (appPort !== undefined) {
    netdev += `,hostfwd=tcp::${appPort}-:8080`;
  }

  const args: string[] = [
    ...buildMachineArgs(),
    '-smp', String(CPUS),
    '-m', RAM,
    '-drive', `if=pflash,format=raw,readonly=on,file=${efiCode}`,
    '-drive', `if=pflash,format=raw,file=${efi}`,
    '-drive', `if=virtio,format=qcow2,discard=unmap,detect-zeroes=unmap,file=${disk}`,
    '-device', 'virtio-net-pci,netdev=net0',
    '-netdev', netdev,
    ...gpuDeviceArgs(),
    '-device', 'virtio-rng-pci',
    '-device', 'qemu-xhci',
    '-device', 'usb-kbd',
    '-device', 'usb-tablet',
    '-pidfile', pidFile,
    '-monitor', `unix:${monitorSock},server,nowait`,
  ];

  // Attach the installer ISO as a bootable CD-ROM (base install only, Windows).
  args.push(...isoDeviceArgs(iso));

  if (dev) {
    // 9p virtio host share (dev mode): supported on macOS and Windows ARM64
    // Windows x64 uses SCP sync instead (handled separately)
    if (!(PLATFORM === 'win32' && GUEST_ARCH === 'x86_64')) {
      args.push(
        '-fsdev', `local,id=svc,path=${SERVICE_DIR},security_model=mapped-xattr`,
        '-device', `virtio-9p-pci,fsdev=svc,mount_tag=open-computer_service`,
      );
    }
  }

  return args;
}

// ── Start/stop helpers ───────────────────────────────────────────────────────

interface StartVmOptions extends QemuArgsOptions {
  gui?: boolean;
  daemonize?: boolean;
}

/**
 * Pick the best available display backend by probing the binary at runtime.
 * Preference order: cocoa (native macOS) → gtk → sdl → vnc → none.
 * The bundled QEMU is intentionally headless (only 'none'), which is correct
 * for all normal agent flows. For base install, users with a display-capable
 * QEMU (e.g. Homebrew) get a native window; others fall back to headless and
 * can interact via the serial console or a separate VNC setup.
 */
function chooseDisplayArgs(binary: string, vncDisplay: number): string[] | null {
  const result = spawnSync(binary, ['--display', 'help'], { stdio: 'pipe', encoding: 'utf8' });
  const output = (result.stdout ?? '') + (result.stderr ?? '');
  const backends = new Set(
    output.split('\n').map((l) => l.trim()).filter((l) => /^[a-z][-a-z0-9]*$/.test(l)),
  );

  const prefer = PLATFORM === 'darwin'
    ? ['cocoa', 'sdl', 'gtk', 'vnc']
    : ['gtk', 'sdl', 'vnc'];

  for (const b of prefer) {
    if (backends.has(b)) {
      if (b === 'vnc') {
        const vncPort = 5900 + vncDisplay;
        console.log(`No native display available — VNC server on localhost:${vncPort}.`);
        console.log(`  macOS: open vnc://localhost:${vncPort}`);
        return ['-display', `vnc=:${vncDisplay}`];
      }
      return ['-display', b];
    }
  }

  return null;
}

export function startVm(opts: StartVmOptions): boolean {
  const { pidFile, gui = false, daemonize = true, vncDisplay = 1 } = opts;

  if (isRunning(pidFile)) {
    const pid = readPid(pidFile);
    console.log(`Already running (pid ${pid}).`);
    return true;
  }

  const binary = resolveQemuBinary();
  const args = buildQemuArgs(opts);

  if (gui) {
    const displayArgs = chooseDisplayArgs(binary, vncDisplay);
    if (!displayArgs) {
      console.error(
        'Error: GUI mode requested but the bundled QEMU has no display backends (no gtk, sdl, or vnc).\n' +
        'Install a full QEMU build with display support:\n' +
        '  Windows:  choco install qemu  OR  https://qemu.org/download/#windows\n' +
        '  Then set OPEN_COMPUTER_QEMU_DIR to the install path, or add it to your PATH.',
      );
      return false;
    }
    if (!daemonize) {
      // Foreground: keep QEMU attached so the GUI window stays alive and
      // errors are visible (used by `base install`).
      spawnSync(binary, [...args, ...displayArgs], { stdio: 'inherit' });
      return true;
    }
    const child = spawn(binary, [...args, ...displayArgs], {
      stdio: 'ignore',
      detached: true,
    });
    child.unref();
  } else if (daemonize && PLATFORM !== 'win32') {
    // macOS/Linux: use QEMU's built-in -daemonize
    const result = spawnSync(binary, [...args, '-display', 'none', '-daemonize'], {
      stdio: 'inherit',
    });
    if (result.status !== 0) {
      console.error('Failed to start QEMU.');
      return false;
    }
  } else {
    // Windows or non-daemonize: detach via Node
    const child = spawn(binary, [...args, '-display', 'none'], {
      stdio: 'ignore',
      detached: true,
    });
    child.unref();
    // Give the process a moment to write the pidfile
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1000);
  }

  // Brief pause to let pidfile be written
  const started = Date.now();
  while (Date.now() - started < 3000) {
    if (isRunning(pidFile)) {
      const pid = readPid(pidFile);
      console.log(`Started (pid ${pid}).`);
      return true;
    }
    // Busy-wait is acceptable here for a 3-second window
  }

  console.error('Failed to start (pidfile not found after 3s).');
  return false;
}

// ── qemu-img wrappers ────────────────────────────────────────────────────────

export function qemuImgCreate(file: string, backingFile: string, size: string): boolean {
  const result = spawnSync(resolveQemuImgBinary(), [
    'create', '-f', 'qcow2', '-b', backingFile, '-F', 'qcow2', file,
  ], { stdio: 'pipe' });
  return result.status === 0;
}

export function qemuImgConvert(src: string, dst: string, backingFile?: string): boolean {
  const args = [
    'convert', '-O', 'qcow2', '-c',
    ...(backingFile ? ['-B', backingFile, '-F', 'qcow2'] : []),
    src, dst,
  ];
  const result = spawnSync(resolveQemuImgBinary(), args, { stdio: 'inherit' });
  return result.status === 0;
}

export function fileSize(filePath: string): number {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

// ── Graceful shutdown ────────────────────────────────────────────────────────

import { sshRun } from './ssh.js';
import { VM_USER } from './config.js';

export function waitForShutdown(
  pidFile: string,
  monitorSock: string,
  sshPort?: number,
): void {
  if (sshPort !== undefined) {
    process.stdout.write('Shutting down via SSH...');
    sshRun(sshPort, VM_USER, 'sudo shutdown -h now', { silent: true });
  } else {
    // Fallback: ACPI power-down via QEMU monitor (Unix socket)
    process.stdout.write('Sending ACPI shutdown...');
    try {
      // Use nc/socat to send to the monitor socket
      spawnSync('sh', ['-c', `echo system_powerdown | socat - UNIX-CONNECT:${monitorSock}`], {
        stdio: 'pipe',
      });
    } catch { /* socat may not be available */ }
  }

  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (!isRunning(pidFile)) {
      process.stdout.write(' stopped.\n');
      fs.rmSync(pidFile, { force: true });
      removeMonitorSock(monitorSock);
      return;
    }
    process.stdout.write('.');
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1000);
  }

  // Force kill after timeout
  process.stdout.write(' force-killing.\n');
  killPid(pidFile);
  removeMonitorSock(monitorSock);
}

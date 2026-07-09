import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';
import { Command } from 'commander';
import {
  BASE_DIR, BASE_DISK, BASE_EFI, SETUP_DIR, VM_USER,
  SSH_PORT_BASE, APP_PORT_BASE, PLATFORM,
  isoPath, resolveEfiCode, resolveEfiVars, resolveQemuImgBinary,
} from '../config.js';
import {
  isRunning, readPid, killPid, startVm, waitForShutdown,
  qemuImgConvert, fileSize, formatBytes, removeMonitorSock,
} from '../vm.js';
import { sshRun, sshInteractive, scpTo, waitForSsh } from '../ssh.js';
import { isJsonMode, jsonOk, jsonErr, info } from '../output.js';
import { basePidfile, baseMonitorSock } from '../registry.js';

const BASE_SSH_PORT = SSH_PORT_BASE - 1;
const BASE_APP_PORT = APP_PORT_BASE - 1;

function ensureBaseDir(): void {
  fs.mkdirSync(BASE_DIR, { recursive: true });
}

export function registerBaseCommand(program: Command): void {
  const base = program
    .command('base')
    .description('Base image management (one-time setup)');

  base
    .command('install')
    .description('Boot Debian ISO to build the golden base image (opens GUI window)')
    .action(() => {
      const iso = isoPath();
      if (!fs.existsSync(iso)) {
        jsonErr(`ISO not found: ${iso}\nRun: scripts/fetch-debian-iso.sh`);
      }
      ensureBaseDir();
      if (!fs.existsSync(BASE_DISK)) {
        spawnSync(resolveQemuImgBinary(), ['create', '-f', 'qcow2', BASE_DISK, '40G'], { stdio: 'inherit' });
      }
      const pf = basePidfile();
      const sock = baseMonitorSock();
      // Windows needs the OVMF VARS template; other platforms keep the CODE copy
      // (original behavior) to avoid any regression.
      if (!fs.existsSync(BASE_EFI)) {
        fs.copyFileSync(PLATFORM === 'win32' ? resolveEfiVars() : resolveEfiCode(), BASE_EFI);
      }

      info('=== Installing base image ===');
      info('Starting QEMU with VNC display — connect with any VNC viewer:');
      info('  macOS built-in:  open vnc://localhost:5901');
      info('  RealVNC / Tiger: connect to localhost:5901');
      info(`Create user '${VM_USER}' during install. Enable SSH. Skip desktop environment.`);

      startVm({
        disk: BASE_DISK,
        efi: BASE_EFI,
        iso,
        sshPort: BASE_SSH_PORT,
        appPort: BASE_APP_PORT,
        pidFile: pf,
        monitorSock: sock,
        gui: true,
        daemonize: false,
      });
    });

  base
    .command('up')
    .description('Start the base image for provisioning/dev')
    .option('--console', 'Show QEMU console window')
    .action((opts: { console?: boolean }) => {
      const pf = basePidfile();
      const sock = baseMonitorSock();

      if (opts.console) {
        if (isRunning(pf)) jsonErr('Base image is already running. Shut it down first.');
        info(`=== Starting base image (console, SSH on localhost:${BASE_SSH_PORT}) ===`);
        startVm({
          disk: BASE_DISK, efi: BASE_EFI,
          sshPort: BASE_SSH_PORT, appPort: BASE_APP_PORT,
          pidFile: pf, monitorSock: sock,
          gui: true, daemonize: false, dev: true,
        });
        return;
      }

      info(`=== Starting base image (SSH :${BASE_SSH_PORT}, App :${BASE_APP_PORT}) ===`);
      startVm({
        disk: BASE_DISK, efi: BASE_EFI,
        sshPort: BASE_SSH_PORT, appPort: BASE_APP_PORT,
        pidFile: pf, monitorSock: sock,
        dev: true,
      });
    });

  base
    .command('ssh [cmd...]')
    .description('SSH into the base image')
    .action((cmd: string[]) => {
      if (cmd.length > 0) {
        sshInteractive(BASE_SSH_PORT, VM_USER, cmd.join(' '));
      } else {
        sshInteractive(BASE_SSH_PORT, VM_USER);
      }
    });

  base
    .command('provision')
    .description('Run master/setup/provision.sh on the base image')
    .action(() => {
      info('=== Provisioning base image ===');
      info('  Waiting for SSH (up to 3 min)...');
      if (!waitForSsh(BASE_SSH_PORT, VM_USER, 60, 3)) {
        jsonErr('SSH not reachable after 3 minutes. Is the base image running? Try: open-computer base up');
      }
      info('  SSH ready. Copying files...');
      scpTo(BASE_SSH_PORT, VM_USER, path.join(SETUP_DIR, 'provision.sh'), '/tmp/provision.sh');
      scpTo(BASE_SSH_PORT, VM_USER, path.join(SETUP_DIR, 'curl-wrapper.sh'), '/tmp/curl-wrapper.sh');
      info('  Copying win10 theme...');
      scpTo(BASE_SSH_PORT, VM_USER, path.join(SETUP_DIR, 'themes', 'win10'), '/tmp/win10', { recursive: true });
      scpTo(BASE_SSH_PORT, VM_USER, path.join(SETUP_DIR, 'favicons'), '/tmp/favicons', { recursive: true });
      scpTo(BASE_SSH_PORT, VM_USER, path.join(SETUP_DIR, 'a11y-harvest.py'), '/tmp/a11y-harvest.py');
      scpTo(BASE_SSH_PORT, VM_USER, path.join(SETUP_DIR, 'a11y-action.py'), '/tmp/a11y-action.py');
      sshInteractive(BASE_SSH_PORT, VM_USER, 'chmod +x /tmp/provision.sh && su -c /tmp/provision.sh');
    });

  base
    .command('compact')
    .description('Shrink the base image (zeros free space + recompresses qcow2)')
    .action(() => {
      const pf = basePidfile();
      const sock = baseMonitorSock();
      const before = fileSize(BASE_DISK);

      if (isRunning(pf)) {
        info('=== Zeroing free space inside VM ===');
        sshRun(BASE_SSH_PORT, VM_USER,
          'sudo fstrim -av 2>/dev/null || (sudo dd if=/dev/zero of=/tmp/zero bs=1M 2>/dev/null; sudo rm -f /tmp/zero)',
          { silent: true }
        );
        info('  Shutting down base image...');
        waitForShutdown(pf, sock, BASE_SSH_PORT);
      } else {
        info('Base image is not running — compacting offline.');
      }

      info('=== Compacting base.qcow2 ===');
      const tmp = `${BASE_DISK}.tmp`;
      qemuImgConvert(BASE_DISK, tmp);
      fs.renameSync(tmp, BASE_DISK);

      const after = fileSize(BASE_DISK);
      if (isJsonMode()) {
        jsonOk({ before_bytes: before, after_bytes: after });
      } else {
        info(`  Before: ${formatBytes(before)}`);
        info(`  After:  ${formatBytes(after)}`);
        info('=== Compaction complete ===');
      }
    });

  base
    .command('down')
    .description('Shut down the base image gracefully')
    .action(() => {
      const pf = basePidfile();
      const sock = baseMonitorSock();
      if (!isRunning(pf)) {
        info('Base image is not running.');
        fs.rmSync(pf, { force: true });
        return;
      }
      waitForShutdown(pf, sock, BASE_SSH_PORT);
    });

  base
    .command('kill')
    .description('Force-kill the base image QEMU process')
    .action(() => {
      const pf = basePidfile();
      const sock = baseMonitorSock();
      if (!isRunning(pf)) {
        info('Base image is not running.');
        fs.rmSync(pf, { force: true });
        return;
      }
      killPid(pf);
      removeMonitorSock(sock);
      info('Base image killed.');
    });

  base
    .command('status')
    .description('Check if base image is running')
    .action(() => {
      const pf = basePidfile();
      if (isRunning(pf)) {
        const pid = readPid(pf);
        if (isJsonMode()) {
          jsonOk({ status: 'running', pid });
        } else {
          info(`Base image is running (pid ${pid}).`);
        }
      } else {
        fs.rmSync(pf, { force: true });
        if (isJsonMode()) {
          jsonOk({ status: 'stopped' });
        } else {
          info('Base image is not running.');
        }
      }
    });
}

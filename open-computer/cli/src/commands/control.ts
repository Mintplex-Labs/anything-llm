import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';
import { Command } from 'commander';
import { PLATFORM, GUEST_ARCH, VM_USER, SETUP_DIR, SERVICE_DIR, BASE_DISK } from '../config.js';
import {
  agentExists, readAgentJson, agentEnvPath,
  pidfilePath, monitorSockPath, efiVarsPath,
} from '../registry.js';
import {
  isRunning, readPid, killPid, startVm, waitForShutdown,
  qemuImgConvert, fileSize, formatBytes, removeMonitorSock,
} from '../vm.js';
import { sshRun, sshInteractive, scpTo, waitForSsh } from '../ssh.js';
import { isJsonMode, jsonOk, jsonErr, info } from '../output.js';

// ── Shared helpers ────────────────────────────────────────────────────────────

function syncAgentEnv(name: string): boolean {
  const envFile = agentEnvPath(name);
  if (!fs.existsSync(envFile)) return true;

  const { ssh_port } = readAgentJson(name);
  const ready = waitForSsh(ssh_port, VM_USER, 30, 2);
  if (!ready) {
    if (!isJsonMode()) process.stderr.write(`  Warning: could not reach '${name}' to sync agent .env\n`);
    return false;
  }

  return scpTo(ssh_port, VM_USER, envFile, '/home/agent/agent.env', { silent: true });
}

function restartServiceInVm(name: string): void {
  const { ssh_port } = readAgentJson(name);
  sshRun(ssh_port, VM_USER, 'sudo systemctl restart open-computer', { silent: true });
}

/**
 * On Windows x64 the 9p virtio share is not available, so dev mode syncs
 * the services/ directory into the VM over SCP instead.
 */
function syncServiceToVm(sshPort: number): void {
  info('  Syncing services/ to VM over SCP...');
  sshRun(sshPort, VM_USER, 'sudo mkdir -p /opt/open-computer', { silent: true });
  scpTo(sshPort, VM_USER, SERVICE_DIR, '/tmp/open-computer-sync', { recursive: true, silent: true });
  sshRun(sshPort, VM_USER, [
    'sudo cp -a /tmp/open-computer-sync/* /opt/open-computer/',
    'rm -rf /tmp/open-computer-sync',
    "sudo find /opt/open-computer -type f -exec sed -i 's/\\r$//' {} +",
    'sudo find /opt/open-computer -name "*.sh" -exec chmod +x {} +',
    'sudo chown -R agent:agent /opt/open-computer',
  ].join(' ; '), { silent: true });
  info('  Service synced.');
}

export function execUpCommand(name: string, opts: { dev?: boolean; gui?: boolean } = {}): boolean {
  if (!agentExists(name)) { jsonErr(`Agent '${name}' not found.`); }

  const agent = readAgentJson(name);
  const { disk, ssh_port, vnc_display, app_port } = agent;
  const efi = efiVarsPath(name);
  const pf = pidfilePath(name);
  const sock = monitorSockPath(name);
  const dev = opts.dev ?? false;
  const gui = opts.gui ?? false;

  const ok = startVm({ disk, efi, sshPort: ssh_port, appPort: app_port, pidFile: pf, monitorSock: sock, vncDisplay: vnc_display, dev, gui });

  if (ok && dev && PLATFORM === 'win32' && GUEST_ARCH === 'x86_64') {
    const ready = waitForSsh(ssh_port, VM_USER, 60, 3);
    if (ready) {
      syncServiceToVm(ssh_port);
      sshRun(ssh_port, VM_USER, 'sudo systemctl restart open-computer', { silent: true });
    } else {
      info('  Warning: SSH not reachable — could not sync services to VM.');
    }
  }

  if (fs.existsSync(agentEnvPath(name))) {
    syncAgentEnv(name);
    restartServiceInVm(name);
  }

  return ok;
}

// ── Command registrations ─────────────────────────────────────────────────────

export function registerControlCommands(program: Command): void {
  program
    .command('up <name>')
    .description('Start an agent')
    .option('--dev', 'Mount services/ via 9p (dev mode)')
    .option('--gui', 'Show QEMU window')
    .action((name: string, opts: { dev?: boolean; gui?: boolean }) => {
      if (!agentExists(name)) jsonErr(`Agent '${name}' not found.`);

      const agent = readAgentJson(name);
      const dev = opts.dev ?? false;
      const gui = opts.gui ?? false;
      const mode = dev
        ? (PLATFORM === 'win32' && GUEST_ARCH === 'x86_64' ? 'dev (scp sync)' : 'dev (9p mount)')
        : 'prod';

      if (!isJsonMode()) {
        if (gui) {
          info(`=== Starting '${name}' [${mode}] (SSH :${agent.ssh_port}, Desktop http://localhost:${agent.app_port}) ===`);
        } else {
          info(`=== Starting '${name}' [${mode}] (headless, SSH :${agent.ssh_port}, Desktop http://localhost:${agent.app_port}) ===`);
        }
      }

      const ok = execUpCommand(name, { dev, gui });

      if (isJsonMode()) {
        const pid = readPid(pidfilePath(name));
        jsonOk({
          name, ssh_port: agent.ssh_port, app_port: agent.app_port,
          desktop_url: `http://localhost:${agent.app_port}`,
          dev, gui,
          ...(pid !== null ? { pid } : {}),
        });
      } else if (!ok) {
        process.exit(1);
      }
    });

  program
    .command('down <name>')
    .description('Graceful shutdown')
    .action((name: string) => {
      if (!agentExists(name)) jsonErr(`Agent '${name}' not found.`);

      const pf = pidfilePath(name);
      const sock = monitorSockPath(name);
      const { ssh_port } = readAgentJson(name);

      if (!isRunning(pf)) {
        fs.rmSync(pf, { force: true });
        if (isJsonMode()) {
          jsonOk({ name, was_running: false });
        } else {
          info(`Agent '${name}' is not running.`);
        }
        return;
      }

      waitForShutdown(pf, sock, ssh_port);
      if (isJsonMode()) jsonOk({ name, was_running: true });
    });

  program
    .command('kill <name>')
    .description('Force-stop a running agent')
    .action((name: string) => {
      if (!agentExists(name)) jsonErr(`Agent '${name}' not found.`);

      const pf = pidfilePath(name);
      const sock = monitorSockPath(name);

      if (!isRunning(pf)) {
        fs.rmSync(pf, { force: true });
        if (isJsonMode()) {
          jsonOk({ name, was_running: false });
        } else {
          info(`Agent '${name}' is not running.`);
        }
        return;
      }

      killPid(pf);
      removeMonitorSock(sock);

      if (isJsonMode()) {
        jsonOk({ name, was_running: true });
      } else {
        info(`Killed agent '${name}'.`);
      }
    });

  program
    .command('restart <name>')
    .description('Restart the open-computer service inside the agent VM')
    .action((name: string) => {
      if (!agentExists(name)) jsonErr(`Agent '${name}' not found.`);

      const pf = pidfilePath(name);
      if (!isRunning(pf)) jsonErr(`Agent '${name}' is not running.`);

      if (!isJsonMode()) info(`Restarting open-computer service on '${name}'...`);
      syncAgentEnv(name);
      restartServiceInVm(name);

      if (isJsonMode()) {
        jsonOk({ name });
      } else {
        info('Service restarted.');
      }
    });

  program
    .command('compact <name>')
    .description('Shrink an agent\'s overlay disk (fstrim + qcow2 recompress)')
    .action((name: string) => {
      if (!agentExists(name)) jsonErr(`Agent '${name}' not found.`);

      const agent = readAgentJson(name);
      const pf = pidfilePath(name);
      const diskPath = agent.disk;
      const before = fileSize(diskPath);

      if (isRunning(pf)) {
        if (!isJsonMode()) info(`Zeroing free space inside '${name}'...`);
        sshRun(agent.ssh_port, VM_USER,
          'sudo fstrim -av 2>/dev/null || (sudo dd if=/dev/zero of=/tmp/zero bs=1M 2>/dev/null; sudo rm -f /tmp/zero)',
          { silent: true },
        );
        if (!isJsonMode()) info(`Shutting down '${name}'...`);

        const sock = monitorSockPath(name);
        waitForShutdown(pf, sock, agent.ssh_port);
      }

      if (!isJsonMode()) info('Compacting disk...');
      const tmp = `${diskPath}.tmp`;
      try {
        // Use the base disk as backing when re-creating the overlay
        const ok = qemuImgConvert(diskPath, tmp, BASE_DISK);
        if (!ok) {
          try { fs.unlinkSync(tmp); } catch {}
          jsonErr('qemu-img convert failed — disk unchanged');
        }
        fs.renameSync(tmp, diskPath);
      } catch (err: any) {
        try { fs.unlinkSync(tmp); } catch {}
        throw err;
      }

      const after = fileSize(diskPath);
      if (isJsonMode()) {
        jsonOk({ name, before_bytes: before, after_bytes: after });
      } else {
        info(`Compacted '${name}': ${formatBytes(before)} → ${formatBytes(after)}`);
      }
    });

  program
    .command('status <name>')
    .description('Check if an agent is running')
    .action((name: string) => {
      if (!agentExists(name)) jsonErr(`Agent '${name}' not found.`);

      const agent = readAgentJson(name);
      const pf = pidfilePath(name);

      if (isRunning(pf)) {
        const pid = readPid(pf);
        if (isJsonMode()) {
          jsonOk({
            name, status: 'running', pid,
            ssh_port: agent.ssh_port, vnc_port: agent.vnc_port, app_port: agent.app_port,
            desktop_url: `http://localhost:${agent.app_port}`,
          });
        } else {
          info(`Agent '${name}' is running (pid ${pid}).`);
          info(`  SSH:      localhost:${agent.ssh_port}`);
          info(`  Desktop:  http://localhost:${agent.app_port}`);
        }
      } else {
        fs.rmSync(pf, { force: true });
        if (isJsonMode()) {
          jsonOk({
            name, status: 'stopped',
            ssh_port: agent.ssh_port, vnc_port: agent.vnc_port, app_port: agent.app_port,
          });
        } else {
          info(`Agent '${name}' is stopped.`);
        }
      }
    });

  program
    .command('ssh <name> [cmd...]')
    .description('SSH into an agent')
    .action((name: string, cmd: string[]) => {
      if (!agentExists(name)) jsonErr(`Agent '${name}' not found.`);

      const { ssh_port } = readAgentJson(name);

      if (isJsonMode()) {
        if (cmd.length > 0) {
          const { output, ok } = sshRun(ssh_port, VM_USER, cmd.join(' '), { silent: true });
          jsonOk({ name, output });
        } else {
          jsonOk({ name, ssh_port, ssh_user: VM_USER, ssh_host: 'localhost' });
        }
        return;
      }

      if (cmd.length > 0) {
        sshInteractive(ssh_port, VM_USER, cmd.join(' '));
      } else {
        sshInteractive(ssh_port, VM_USER);
      }
    });

  program
    .command('vnc <name>')
    .description('Open VNC viewer for an agent')
    .action((name: string) => {
      if (!agentExists(name)) jsonErr(`Agent '${name}' not found.`);

      const { vnc_port } = readAgentJson(name);
      const vncUrl = `vnc://localhost:${vnc_port}`;

      if (isJsonMode()) {
        jsonOk({ name, vnc_url: vncUrl });
        return;
      }

      if (PLATFORM === 'darwin') {
        spawnSync('open', [vncUrl], { stdio: 'inherit' });
      } else if (PLATFORM === 'win32') {
        spawnSync('start', [vncUrl], { shell: true, stdio: 'inherit' });
      } else {
        spawnSync('xdg-open', [vncUrl], { stdio: 'inherit' });
      }
    });

  program
    .command('provision <name>')
    .description('Re-run provision script on a running agent')
    .action((name: string) => {
      if (!agentExists(name)) jsonErr(`Agent '${name}' not found.`);

      const { ssh_port } = readAgentJson(name);
      if (!isJsonMode()) info(`=== Provisioning '${name}' ===`);

      scpTo(ssh_port, VM_USER, path.join(SETUP_DIR, 'provision.sh'), '/tmp/provision.sh', { silent: true });
      scpTo(ssh_port, VM_USER, path.join(SETUP_DIR, 'curl-wrapper.sh'), '/tmp/curl-wrapper.sh', { silent: true });
      scpTo(ssh_port, VM_USER, path.join(SETUP_DIR, 'themes', 'win10'), '/tmp/win10', { recursive: true, silent: true });
      scpTo(ssh_port, VM_USER, path.join(SETUP_DIR, 'favicons'), '/tmp/favicons', { recursive: true, silent: true });
      sshRun(ssh_port, VM_USER, 'chmod +x /tmp/provision.sh && sudo /tmp/provision.sh');

      if (isJsonMode()) jsonOk({ name });
    });
}

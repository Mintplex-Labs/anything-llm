import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';
import { Command } from 'commander';
import {
  SERVICE_DIR, SETUP_DIR, VM_USER, BASE_DISK, BASE_EFI,
  SSH_PORT_BASE, APP_PORT_BASE,
} from '../config.js';
import { basePidfile, baseMonitorSock } from '../registry.js';
import {
  isRunning, startVm, waitForShutdown, qemuImgConvert,
  fileSize, formatBytes,
} from '../vm.js';
import { sshRun, scpTo, waitForSsh } from '../ssh.js';
import { jsonErr, info } from '../output.js';

const BASE_SSH_PORT = SSH_PORT_BASE - 1;
const BASE_APP_PORT = APP_PORT_BASE - 1;

export function registerBuildCommand(program: Command): void {
  program
    .command('build')
    .description('Bundle services and bake them into the base image (production build)')
    .action(() => {
      const pf = basePidfile();
      if (isRunning(pf)) {
        jsonErr('Base image is already running. Shut it down first (open-computer base down).');
      }

      // ── 1. Bundle ──────────────────────────────────────────────────────────
      info('=== Bundling interface-service ===');
      // On Windows, `bash` resolves to the WSL launcher which lacks the Windows
      // Node toolchain; prefer Git Bash (ships with Git for Windows).
      let bashCmd = 'bash';
      if (process.platform === 'win32') {
        const gitBash = [
          'C:\\Program Files\\Git\\bin\\bash.exe',
          'C:\\Program Files (x86)\\Git\\bin\\bash.exe',
        ].find((p) => fs.existsSync(p));
        if (gitBash) bashCmd = gitBash;
      }
      const buildResult = spawnSync(bashCmd, [path.join(SERVICE_DIR, 'build.sh')], {
        stdio: 'inherit',
        cwd: SERVICE_DIR,
      });
      if (buildResult.status !== 0) jsonErr('Build script failed.');

      const bundle = path.join(SERVICE_DIR, 'dist', 'interface-service.cjs');
      if (!fs.existsSync(bundle)) jsonErr(`Build failed: ${bundle} not found.`);

      // ── 2. Start base image ────────────────────────────────────────────────
      info('=== Starting base image ===');
      const sock = baseMonitorSock();
      startVm({
        disk: BASE_DISK, efi: BASE_EFI,
        sshPort: BASE_SSH_PORT, appPort: BASE_APP_PORT,
        pidFile: pf, monitorSock: sock,
        dev: false,
      });

      info('  Waiting for SSH...');
      if (!waitForSsh(BASE_SSH_PORT, VM_USER, 30, 2)) {
        jsonErr('Timed out waiting for base image SSH.');
      }

      // ── 3. Bake into base image ────────────────────────────────────────────
      info('=== Baking into base image ===');

      sshRun(BASE_SSH_PORT, VM_USER,
        'sudo mkdir -p /opt/open-computer/interface-service/utils /opt/open-computer/extensions /opt/open-computer/public /opt/open-computer/memory-manager/public && sudo rm -f /opt/open-computer/interface-service /opt/open-computer/html-to-markdown',
      );

      info('  Uploading bundles...');
      scpTo(BASE_SSH_PORT, VM_USER, bundle, '/tmp/interface-service.cjs');
      sshRun(BASE_SSH_PORT, VM_USER, 'sudo mv /tmp/interface-service.cjs /opt/open-computer/interface-service.cjs');

      const html2md = path.join(SERVICE_DIR, 'dist', 'html-to-markdown.cjs');
      if (fs.existsSync(html2md)) {
        scpTo(BASE_SSH_PORT, VM_USER, html2md, '/tmp/html-to-markdown.cjs');
        sshRun(BASE_SSH_PORT, VM_USER, 'sudo mv /tmp/html-to-markdown.cjs /opt/open-computer/html-to-markdown.cjs');
      }

      info('  Uploading supporting files...');
      for (const f of ['cdp-eval.js', 'cdp-input.js', 'browser-harvest.js', 'html-to-markdown.js']) {
        const src = path.join(SERVICE_DIR, 'dist', 'interface-service', 'utils', f);
        if (fs.existsSync(src)) {
          scpTo(BASE_SSH_PORT, VM_USER, src, `/tmp/${f}`);
          sshRun(BASE_SSH_PORT, VM_USER, `sudo mv /tmp/${f} /opt/open-computer/interface-service/utils/${f}`);
        }
      }

      info('  Uploading extensions...');
      for (const f of fs.readdirSync(path.join(SERVICE_DIR, 'extensions'))) {
        if (!f.endsWith('.ts')) continue;
        const src = path.join(SERVICE_DIR, 'extensions', f);
        scpTo(BASE_SSH_PORT, VM_USER, src, `/tmp/${f}`);
        sshRun(BASE_SSH_PORT, VM_USER, `sudo mv /tmp/${f} /opt/open-computer/extensions/${f}`);
      }

      info('  Uploading memory-manager...');
      const mmCjs = path.join(SERVICE_DIR, 'dist', 'memory-manager', 'memory-manager.cjs');
      const mmStart = path.join(SERVICE_DIR, 'dist', 'memory-manager', 'start.sh');
      scpTo(BASE_SSH_PORT, VM_USER, mmCjs, '/tmp/memory-manager.cjs');
      scpTo(BASE_SSH_PORT, VM_USER, mmStart, '/tmp/memory-manager-start.sh');
      sshRun(BASE_SSH_PORT, VM_USER,
        'sudo mv /tmp/memory-manager.cjs /opt/open-computer/memory-manager/memory-manager.cjs && sudo mv /tmp/memory-manager-start.sh /opt/open-computer/memory-manager/start.sh && sudo chmod +x /opt/open-computer/memory-manager/start.sh',
      );

      const mmPublicDir = path.join(SERVICE_DIR, 'dist', 'memory-manager', 'public');
      if (fs.existsSync(mmPublicDir)) {
        for (const f of fs.readdirSync(mmPublicDir)) {
          const src = path.join(mmPublicDir, f);
          if (!fs.statSync(src).isFile()) continue;
          scpTo(BASE_SSH_PORT, VM_USER, src, `/tmp/mm-${f}`);
          sshRun(BASE_SSH_PORT, VM_USER, `sudo mv /tmp/mm-${f} /opt/open-computer/memory-manager/public/${f}`);
        }
      }

      info('  Uploading public (UI)...');
      const publicDir = path.join(SERVICE_DIR, 'dist', 'public');
      if (fs.existsSync(publicDir)) {
        for (const f of fs.readdirSync(publicDir)) {
          const src = path.join(publicDir, f);
          if (!fs.statSync(src).isFile()) continue;
          scpTo(BASE_SSH_PORT, VM_USER, src, `/tmp/ui-${f}`);
          sshRun(BASE_SSH_PORT, VM_USER, `sudo mv /tmp/ui-${f} /opt/open-computer/public/${f}`);
        }
      }

      const wallpaper = path.join(SETUP_DIR, 'themes', 'win10', 'background.png');
      if (fs.existsSync(wallpaper)) {
        info('  Uploading wallpaper...');
        scpTo(BASE_SSH_PORT, VM_USER, wallpaper, '/tmp/background.png');
        sshRun(BASE_SSH_PORT, VM_USER,
          'sudo mv /tmp/background.png /usr/share/pixmaps/open-computer-background.png && sudo chmod 644 /usr/share/pixmaps/open-computer-background.png',
        );
      }

      info('  Uploading startup script...');
      scpTo(BASE_SSH_PORT, VM_USER, path.join(SERVICE_DIR, 'start-service.sh'), '/tmp/start-service.sh');
      sshRun(BASE_SSH_PORT, VM_USER,
        'sudo mv /tmp/start-service.sh /opt/open-computer/start-service.sh && sudo chmod +x /opt/open-computer/start-service.sh',
      );

      info('  Updating systemd units...');
      const mountUnit = `[Unit]
Description=Mount 9p open-computer service directory (dev mode)
DefaultDependencies=no
After=local-fs.target

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/bin/sh -c 'mount -t 9p -o trans=virtio,version=9p2000.L,msize=104857600 open-computer_service /opt/open-computer 2>/dev/null; true'

[Install]
WantedBy=multi-user.target`;

      const openComputerUnit = `[Unit]
Description=open-computer orchestration service
After=novnc.service open-computer-mount.service
Wants=novnc.service open-computer-mount.service

[Service]
Type=simple
User=agent
WorkingDirectory=/opt/open-computer
ExecStart=/opt/open-computer/start-service.sh
Restart=always
RestartSec=3
Environment=HOME=/home/agent
Environment=PORT=8080

[Install]
WantedBy=graphical.target`;

      const mmUnit = `[Unit]
Description=Memory Manager Web UI
After=network.target

[Service]
Type=simple
User=agent
WorkingDirectory=/opt/open-computer/memory-manager
ExecStart=/opt/open-computer/memory-manager/start.sh
Restart=always
RestartSec=3
Environment=HOME=/home/agent
Environment=PORT=8090

[Install]
WantedBy=multi-user.target`;

      const writeUnit = (content: string, dest: string): void => {
        const escaped = content.replace(/'/g, "'\\''");
        sshRun(BASE_SSH_PORT, VM_USER, `echo '${escaped}' | sudo tee ${dest} > /dev/null`);
      };

      writeUnit(mountUnit, '/etc/systemd/system/open-computer-mount.service');
      writeUnit(openComputerUnit, '/etc/systemd/system/open-computer.service');
      writeUnit(mmUnit, '/etc/systemd/system/memory-manager.service');

      sshRun(BASE_SSH_PORT, VM_USER,
        'sudo systemctl daemon-reload && sudo systemctl enable open-computer-mount memory-manager && sudo systemctl restart open-computer memory-manager',
      );

      // ── 4. Shut down ───────────────────────────────────────────────────────
      info('');
      info('=== Shutting down base image ===');
      waitForShutdown(pf, sock, BASE_SSH_PORT);

      // ── 5. Compact ─────────────────────────────────────────────────────────
      info('=== Compacting base image ===');
      const before = fileSize(BASE_DISK);
      const tmp = `${BASE_DISK}.tmp`;
      qemuImgConvert(BASE_DISK, tmp);
      fs.renameSync(tmp, BASE_DISK);
      const after = fileSize(BASE_DISK);
      info(`  Before: ${formatBytes(before)}  After: ${formatBytes(after)}`);

      info('');
      info('=== Build complete ===');
      info(`  Base image: ${BASE_DISK}`);
      info(`  EFI vars:   ${BASE_EFI}`);
    });
}

import * as fs from 'fs';
import * as path from 'path';
import {
  AGENTS_DIR, BASE_DIR, SSH_PORT_BASE, VNC_DISPLAY_BASE, APP_PORT_BASE,
} from './config.js';

export interface AgentJson {
  name: string;
  index: number;
  ssh_port: number;
  vnc_display: number;
  vnc_port: number;
  app_port: number;
  disk: string;
  created: string;
}

export function agentDir(name: string): string {
  return path.join(AGENTS_DIR, name);
}

export function agentJsonPath(name: string): string {
  return path.join(agentDir(name), 'agent.json');
}

export function agentEnvPath(name: string): string {
  return path.join(agentDir(name), '.env');
}

export function pidfilePath(name: string): string {
  return path.join(agentDir(name), 'qemu.pid');
}

export function monitorSockPath(name: string): string {
  return path.join(agentDir(name), 'qemu-monitor.sock');
}

export function efiVarsPath(name: string): string {
  return path.join(agentDir(name), 'efi-vars.fd');
}

export function basePidfile(): string {
  return path.join(BASE_DIR, 'qemu.pid');
}

export function baseMonitorSock(): string {
  return path.join(BASE_DIR, 'qemu-monitor.sock');
}

export function agentExists(name: string): boolean {
  return fs.existsSync(agentJsonPath(name));
}

export function readAgentJson(name: string): AgentJson {
  const raw = fs.readFileSync(agentJsonPath(name), 'utf8');
  return JSON.parse(raw) as AgentJson;
}

export function nextIndex(): number {
  if (!fs.existsSync(AGENTS_DIR)) return 0;
  let max = -1;
  for (const entry of fs.readdirSync(AGENTS_DIR)) {
    const jsonPath = path.join(AGENTS_DIR, entry, 'agent.json');
    if (!fs.existsSync(jsonPath)) continue;
    try {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8')) as { index: number };
      if (data.index > max) max = data.index;
    } catch {
      // ignore malformed entries
    }
  }
  return max + 1;
}

export function writeAgentJson(name: string, index: number): AgentJson {
  const dir = agentDir(name);
  const agent: AgentJson = {
    name,
    index,
    ssh_port: SSH_PORT_BASE + index,
    vnc_display: VNC_DISPLAY_BASE + index,
    vnc_port: 5900 + VNC_DISPLAY_BASE + index,
    app_port: APP_PORT_BASE + index,
    disk: path.join(dir, 'disk.qcow2'),
    created: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
  };
  fs.writeFileSync(agentJsonPath(name), JSON.stringify(agent, null, 2) + '\n');
  return agent;
}

export function listAgents(): string[] {
  if (!fs.existsSync(AGENTS_DIR)) return [];
  return fs.readdirSync(AGENTS_DIR).filter((entry) =>
    fs.existsSync(path.join(AGENTS_DIR, entry, 'agent.json'))
  );
}

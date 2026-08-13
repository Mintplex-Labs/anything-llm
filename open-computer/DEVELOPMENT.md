# Open Computer

QEMU-based virtual desktop environment for AI agents. Each agent gets a full Debian ARM64 VM with an XFCE desktop, Chromium browser, and a web-based UI for sending prompts and watching the agent work in real time.

## Setup

### Prerequisites

**macOS:**

```bash
brew install qemu jq socat
```

**Windows:** Enable [Windows Hypervisor Platform](https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/) (WHPX) for hardware acceleration.

### Fetch the Debian installer ISO

Download the Debian ARM64 netinst ISO for base image installation:

```bash
./scripts/fetch-debian-iso.sh
```

This downloads the ISO into `master/iso/` and verifies the checksum. On Windows, use `scripts/fetch-debian-iso.ps1` instead.

### Initialize the QEMU submodule (optional — only needed for building QEMU from source)

> We have pre-built QEMU binaries for macOS ARM64 and Windows x64. You can just unzip those and use them.

The `master/qemu-src/` directory is a git submodule pinned to QEMU `v11.0.1`. A pre-built macOS ARM64 binary is included at `master/qemu/qemu-darwin-arm64.tar.gz`, so most users don't need this. To pull the QEMU source for a custom build:

```bash
git submodule update --init --recursive master/qemu-src
```

See `master/qemu/BUILD-QEMU.md` for build instructions.

## Building the base image from scratch

First, you need the QEMU and Debian ISO. Then you can run the following command to start the process:
```bash
./open-computer base install
```

This starts QEMU with the Debian ISO attached and opens a VNC server on `localhost:5901`. Connect with any VNC viewer to see the Debian installer:

```bash
# macOS built-in screen sharing
open vnc://localhost:5901

# Or any third-party VNC client (RealVNC, TigerVNC, …)
```

Follow the prompts to install the OS fully until you get to the reboot step.

```bash
./open-computer base down # shuts down the VM
```

Then finalize the base image:

```bash
./open-computer base up && ./open-computer base provision && ./open-computer base down && ./open-computer base compact
```

> `base provision` waits automatically for SSH to become available before copying files — no need to add a manual `sleep` between `base up` and `base provision`.

This will start the base image in a VM, provision it, shut it down, and compact the image to minimize space on disk.

Now, you can use the `open-computer create/up agent --dev` command to start an agent in development mode. This will start the agent in a development mode where you can see the agent's UI and interact with it in real time.

> **Windows only — post-install step:** Before provisioning, SSH into the base image
> and remove passwords so that provisioning can run non-interactively:
>
> ```powershell
> .\open-computer.cmd base ssh
> ```
>
> Then inside the VM (enter root password when prompted by `su`):
>
> ```bash
> echo "<root-password>" | su -c "passwd -d root; passwd -d agent; apt-get install -y sudo; echo 'agent ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/agent; chmod 440 /etc/sudoers.d/agent; sed -i 's/^#*PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config; sed -i 's/^#*PermitEmptyPasswords.*/PermitEmptyPasswords yes/' /etc/ssh/sshd_config; sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config; sed -i 's/pam_unix.so/pam_unix.so nullok/' /etc/pam.d/common-auth; sed -i 's/pam_unix.so/pam_unix.so nullok/' /etc/pam.d/sshd; systemctl restart sshd"
> ```
>
> Exit the SSH session, then run `.\open-computer.cmd base provision`.
> On macOS this step is not needed — the macOS CLI uses `expect` for password automation.

## Usage

**macOS / Linux:**

```bash
./open-computer create myagent        # prod mode
./open-computer create myagent --dev  # dev mode with live-editing
open http://localhost:9800
```

**Windows (PowerShell):**

```powershell
.\open-computer.ps1 create myagent        # prod mode
.\open-computer.ps1 create myagent --dev  # dev mode with live-editing
Start-Process http://localhost:9800
```

Configure your API key in the UI, then send a prompt.

## Project structure

```
open-computer
├── open-computer              # CLI for VM lifecycle management (macOS/Linux)
├── open-computer.ps1          # CLI for VM lifecycle management (Windows)
├── master/
│   ├── iso/              # Debian installer ISO + checksums
│   ├── base_image/       # Golden base image (base.qcow2, efi-vars.fd)
│   ├── qemu/             # QEMU binaries + build scripts
│   │   ├── build-qemu.sh / .ps1   # Build QEMU from source
│   │   ├── BUILD-QEMU.md          # QEMU build documentation
│   │   └── darwin-arm64/           # qemu-system-aarch64, libs, EFI firmware
│   ├── qemu-src/         # QEMU source tree (git submodule, v11.0.1)
│   └── setup/            # Base image provisioning (provision.sh, themes/win10)
├── agents/
│   └── <name>/
│       ├── disk.qcow2    # Copy-on-write overlay (instant clone)
│       ├── efi-vars.fd
│       ├── agent.json     # Port assignments, metadata
│       └── qemu.pid
├── service/              # Express app + extensions (9p-mounted into VM at /opt/open-computer)
│   ├── server.js         # Main orchestration server
│   ├── start-service.sh  # Smart startup (nodemon in dev, binary in prod)
│   ├── cdp-eval.js       # CDP bridge for browser automation
│   ├── public/
│   │   └── index.html    # Frontend UI
│   └── extensions/       # Pi agent tool extensions
│       ├── open-browser.ts
│       ├── browser-cdp.ts
│       ├── ask-user.ts
│       └── save-deliverable.ts
└── scripts/              # Helper scripts (ISO fetch)
```

## Typical workflows

### Spin up a dev agent (live editing)

```bash
./open-computer create myagent --dev
open http://localhost:9800
# Edit files in service/ — nodemon auto-reloads
```

### Spin up a prod agent (compiled binary)

```bash
# First, ensure you've run `open-computer build` at least once
./open-computer create myagent
open http://localhost:9800/api/v1/ping   # verify service is alive
```

### Tear down an agent

```bash
./open-computer destroy myagent   # kills if running, then deletes all files
```

### Check service health

```bash
curl http://localhost:9800/api/v1/ping
# Returns: { "service": "open-computer", "agent": "myagent", "status": "ok", "uptime_seconds": 42, ... }
```

### Restart the service inside a running agent

```bash
./open-computer restart myagent
```

### Run multiple agents simultaneously

Each agent gets its own ports (see Port allocation below). Create them with different names:

```bash
./open-computer create agent1 --dev
./open-computer create agent2 --dev
./open-computer list
# agent1: http://localhost:9800
# agent2: http://localhost:9801
```

---

## Modifying the base image

The base image (`master/base_image/base.qcow2`) is the golden template all agents clone from. Changes to it affect every future agent. There are two workflows for modifying it:

### Quick path: modify a running agent, then rebake

This is the fastest approach for small changes (installing packages, fixing configs, adding files):

```bash
# 1. Create a throwaway agent and start it
./open-computer create temp
./open-computer up temp

# 2. Wait for SSH, then make your changes
./open-computer ssh temp "sudo apt-get install -y <package>"
./open-computer ssh temp "sudo systemctl enable <service>"
# ... any changes you want

# 3. Shut down the VM cleanly
./open-computer ssh temp "sudo shutdown -h now"
# Wait ~10s for it to stop
./open-computer list   # confirm status = stopped

# 4. Commit the overlay into the base image
qemu-img commit agents/temp/disk.qcow2

# 5. Recompress the base (reclaims space, ~2 min)
qemu-img convert -O qcow2 -c master/base_image/base.qcow2 master/base_image/base-new.qcow2
mv master/base_image/base-new.qcow2 master/base_image/base.qcow2

# 6. Clean up the temp agent
./open-computer destroy temp

# 7. Verify: create a fresh agent and check your changes are there
./open-computer create test
./open-computer up test
./open-computer ssh test "<verify command>"
./open-computer down test && ./open-computer destroy test
```

### Full rebuild: re-provision from scratch

For major changes, edit `master/setup/provision.sh` and rebuild:

```bash
# 1. Start the base image directly
./open-computer base up

# 2. Run provisioning
./open-computer base provision

# 3. Compact (shuts down + recompresses)
./open-computer base compact
```

## Modifying the service (server.js, extensions, frontend)

The `service/` directory is mounted into every VM via virtio-9p at `/opt/open-computer`. Changes on the host are visible inside the VM immediately.

### Auto-reload (dev mode)

The service uses `start-service.sh`, which automatically detects the mode:

- **Dev (9p mount active):** `server.js` is present on disk, so it runs via `nodemon` for live reload. Edit any `.js`, `.json`, or `.ts` file in `service/` and nodemon restarts automatically.
- **Prod (compiled binary baked in):** No `server.js` on disk, so it runs `/opt/open-computer/open-computer-service` directly.

### Adding a new tool extension

Extensions are TypeScript files in `service/extensions/` that register tools with the `pi` agent:

```typescript
// service/extensions/my-tool.ts
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "my_tool",
    label: "My Tool",
    description: "What this tool does...",
    parameters: Type.Object({
      input: Type.String({ description: "..." }),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      // ... implementation ...
      return {
        content: [{ type: "text", text: "result" }],
        details: {},
      };
    },
  });
}
```

Then register it in `server.js` by adding to the `piArgs` array:

```javascript
"--extension", path.join(EXTENSIONS_DIR, "my-tool.ts"),
```
<a name="readme-top"></a>

<p align="center">
  <a href="https://github.com/Mintplex-Labs/anything-llm/tree/master/open-computer"><img src="https://github.com/Mintplex-Labs/anything-llm/blob/master/open-computer/assets/OPEN_COMPUTER.png?raw=true" alt="Open Computer logo"></a>
</p>

<p align="center">
    <b>Open Computer:</b> Give your agent its own machine.<br />
    An isolated, purpose-built virtual computer your agent can actually live in.
</p>

<video src="https://github.com/user-attachments/assets/79334c87-c5ae-4c2c-8384-d7ef922e4184"></video>

> [!IMPORTANT]
> This project is a work in progress and is something we intend to bring fully into AnythingLLM — enabling custom, secure, and scalable agent compute for everyone.
>
> ⭐ Star the repo to stay updated!

### What if your AI agent had its own computer?

Open Computer is a virtual OS built expressly for AI agents to inhabit and operate like they own it - because they do! It is designed for **humans** to manage, but for **agents** to use. It is not a general-purpose OS — it is a specialized environment, purposefully engineered for AI agents running on real hardware with realistic resource constraints.

At its core, Open Computer is a **human-in-the-loop** operating system. The human sees everything the agent does, in real time, through a live UI (that looks like Windows lol). The agent can reach back and ask the human a question via `ask-user` at any moment. We want something that feels like collaboration, not just recursive tool calls.

The deeper ambition is a new UX for AI agents: one that evolves out of the terminal's "black box" into something observable, legible, and collaborative — a workspace that a non-technical user can sit alongside without feeling lost but also can meaningfully manipulate whenever the agent is stuck.

AI agents are most capable in a Linux shell, but most people truthfully dont feel comfortable with a terminal that might as well be a black box to them. Open Computer gives you both: the raw power of a full Linux environment for the agent, and a friendly, approachable UI for the human running it. All of this without blindly running `--dangerously-skip-permissions` on your host and crossing your fingers.

## Use Case Demos

<video src="https://github.com/user-attachments/assets/cd5363d9-1daf-4867-8d97-d7fd903ad1b5"></video>
<p align="center"><em>Open Computer building a data visualization from an uploaded CSV file | LM Studio Gemma 4 12B QAT on MacBook Pro M4 Pro for inference</em></p>

<video src="https://github.com/user-attachments/assets/cf8444d8-15f9-489d-8800-fb25a1769804"></video>
<p align="center"><em>Open Computer building a data visualization from web research | OpenRouter Qwen 3.6 35B A3B</em></p>

<video src="https://github.com/user-attachments/assets/79334c87-c5ae-4c2c-8384-d7ef922e4184"></video>
<p align="center"><em>Open Computer doing deep research and analysis on a topic | LM Studio Gemma 4 12B QAT on MacBook Pro M4 Pro</em></p>

The above demos are just a few of the many use cases that Open Computer can be used for - all while the human can see and interact with the agent in real time.

The inference runs on the host machine, while the UI is showing the direct output of the agent while it works in its own isolated computer. Both the VM and inference are running on the host machine.

## Purpose

An agent is only as useful as the environment it operates in. Give it too little — and it can't get anything done. Give it too much access to your real machine — and you've introduced a massive security and stability risk. Neither extreme is acceptable.

Open Computer resolves this tension. It is a QEMU-based virtual desktop environment, purpose-built for AI agents. The OS is modified and pre-loaded with the services and tooling agents need to work effectively, while remaining trivial to set up for non-technical users through a standard UI. Spin one up per agent, tear it down when done. No contamination. No risk.

## Open Computer Objectives

0. **Human in the loop, first**: The human should be able to see what the agent is doing at all times and step in at any moment. The agent should be able to easily reach the human via `ask-user`, turning it into a genuine collaboration rather than blind automation.
1. Create an OS that can be spun up and torn down per-agent — meaningfully isolated from the host and from other agents — while remaining tiny in space, compute, and memory usage.
2. Come pre-loaded with everything an agent needs: a browser, a terminal, a text editor, a file manager, and more.
3. Be easy enough for non-technical users to set up a machine for an agent by just using it like a normal computer.
4. **No screenshots, no coordinate guessing**: Existing "computer use" approaches are bottlenecked by vision models pointing at pixels. Everything in Open Computer is designed to work without a vision model at all.
5. **Optimized browser use**: The browser is the primary tool for most agent tasks. We've built a browser integration that is significantly more token-efficient than popular alternatives — roughly 60% fewer tokens per task than tools like browser-use.
6. **Native app manipulation**: Open Computer can manipulate native Linux apps the same way it handles web apps, using accessibility (A11y) APIs directly. No screenshots required.
7. **Passwordless `sudo`**: Agents need to be able to install packages, modify files, and do whatever is required to complete a task. Full `sudo` access is on by default and can be restricted if needed.
8. Do all of this without demanding serious compute, memory, or disk space from the host machine.

> Currently, each agent's base overlay is only ~100 MB. The base image is ~2.9 GB. The OS ISO is ~700 MB.
> For a fully functional, isolated operating system — that's tiny.

## How It Works

Open Computer is architected so that LLM inference can live anywhere — on the host machine, on a local server, or in the cloud. A single port-forwarding mechanism gives the agent inside the VM access to the LLM outside it, and nothing else. The OS itself is completely provider-agnostic.

Any provider that supports the [OpenAI API](https://platform.openai.com/docs/api-reference) can power Open Computer. A vision model is not required — though it certainly doesn't hurt.

### Inside Open Computer

The Open Computer OS is built on top of [Debian 13.5.0 (Trixie)](https://www.debian.org/releases/trixie/).

1. **Agent Harness**: The core of Open Computer is a minimal, lightweight client — [Pi](https://pi.dev) with custom extensions we've built to make it capable of handling complex tasks inside small context windows. You can always add your own extensions to the harness.

2. **Interface Service**: The [interface service](./services/server/index.js) is an HTTP/WebSocket server that lets the agent interact with the computer, the browser, and native apps. It also serves the full live UI when running `open-computer create/up agent --dev`.

3. **Memory Manager**: The [memory manager](./services/memory-manager/index.js) is built on the [pi-hermes-memory](https://pi.dev/packages/pi-hermes-memory) package, extended with a full UI so you can inspect, edit, and manage the agent's memory at any time.

4. **XFCE Desktop**: The desktop environment is XFCE — lightweight, customizable, and ["riced"](https://jie-fang.github.io/blog/basics-of-ricing) to resemble Windows 10 (forked from [Fake10](https://store.kde.org/p/2332691)). Familiar enough for anyone to navigate.

5. **Chromium Browser**: Chromium, pre-configured for agent use. Fast, scriptable, and deeply integrated with the interface service.

This modular architecture keeps each component replaceable and the overall footprint small. Each agent adds only a thin overlay on top of the shared base image.

### QEMU and Debian

Open Computer virtualizes using a lightweight build of QEMU. A Debian 13.5.0 ISO is used to install and create the base image, saved to `master/base_image/base.qcow2`.

From there, `open-computer provision` builds up the image to its operational state — installing all required services, tooling, and the custom communication layer the agent uses to reach the host LLM.

### How Agents Work

Every agent inherits the `base_image` created from the base Debian install, but maintains its own `.qcow2` overlay file containing only its specific delta — its own tools, configurations, and state. This means you can run multiple agents simultaneously, each with its own isolated environment, without multiplying disk usage.

### Can You Use Local Models?

Yes. Open Computer is designed with small, on-device LLMs in mind. The built-in agent harness assumes a minimum of 16K tokens of context and is optimized for that constraint — using regular compression, pruning, and other techniques to handle complex, long-running tasks without blowing the context window.

Tools like [LM Studio](https://lmstudio.ai), [Ollama](https://ollama.com), [OMLX](https://github.com/jundot/omlx), or anything that speaks the OpenAI API can power your agent's computer.

---

# Quick Start

You can skip building QEMU or the base image from scratch by using the pre-built binaries and base image we provide.

## Unzip the QEMU Binaries

Pre-built QEMU binaries for macOS ARM64 and Windows x64 are in the `master/qemu` folder. Unzip the one you need. On macOS, you may need to unquarantine the binaries first. If you'd rather build from source, see [BUILD-QEMU.md](master/qemu/BUILD-QEMU.md).

## Grab the Base Debian ISO

Download the correct arch ISO (x64 or arm64) from the [Debian OSUOSL mirror](https://debian.osuosl.org/debian-cdimage/13.5.0/) and save it to the `master/iso` folder.

Or use the provided fetch script: `scripts/fetch-debian-iso.{sh,ps1}`.

## Getting the Base Image

Building the base image requires going through a VNC-based OS install as a VM. Follow the detailed walkthrough in [DEVELOPMENT.md](./DEVELOPMENT.md).

If you want to just grab our pre-built base image, you can use the provided fetch script: `scripts/fetch-base-image.{sh,ps1}`.

We provide pre-built base images for macOS ARM64 and Windows x64 currently, but we're open to supporting more architectures - just open an issue so we know it's important to you.

## Starting an Agent

Use the `open-computer create/up agent --dev` command to start an agent in development mode. You'll get a live UI where you can watch the agent work, interact with it in real time, and hook it up to any OpenAI-compatible LLM provider — local or cloud.

---

# Future Plans

Open Computer is a proof of concept with serious ambitions. Depending on community feedback and usage, we'll be evolving the architecture significantly — ultimately toward a truly purpose-built modified OS rather than a Debian overlay.

The bones are solid. The vision is clear. The roadmap is ambitious.

## Roadmap

- [ ] Support for Windows ARM64: currently macOS ARM64 and Windows x64 only
- [ ] Cross-agent communication: allow agents to message each other via a shared channel
- [ ] Network services via simple config or UI: firewalls, NAT, and more
- [ ] Custom harnesses: bring your own agent harness (OpenClaw, Hermes, or anything else)
- [ ] Agent cloning: fork an agent and its current state as a starting point for a new one
- [ ] Automated base image builds: remove the manual VNC install step entirely
- [ ] Enterprise-ready features: firewall policies, VPN, audit logs, role-based access

## 🔗 More Products

- **[AnythingLLM](https://github.com/Mintplex-Labs/anything-llm):** The all-in-one AI app you were looking for.
- **[AnythingLLM Mobile](https://github.com/Mintplex-Labs/anythingllm-mobile):** AnythingLLM on your phone, MIT licensed.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

---

Copyright © 2026 [Mintplex Labs](https://github.com/Mintplex-Labs/anything-llm). <br />
This project is [AGPL-3.0](./LICENSE) licensed.

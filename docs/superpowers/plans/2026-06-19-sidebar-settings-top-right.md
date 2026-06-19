# Sidebar Settings Button Top-Right Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the workspace sidebar footer icons and place the existing settings wrench beside the desktop sidebar-collapse control.

**Architecture:** Keep the shared `Footer` and `SettingsButton` components unchanged. Compose the existing `SettingsButton` directly in the main workspace `Sidebar`, remove the workspace-only footer mounts, and release the layout space previously reserved for those footers.

**Tech Stack:** React 18, React Router, Phosphor Icons, Tailwind CSS, Vite.

---

### Task 1: Relocate the workspace settings control

**Files:**
- Modify: `frontend/src/components/Sidebar/index.jsx`

- [ ] **Step 1: Remove the workspace footer dependency and mounts**

Delete the `Footer` import and both `<Footer />` containers from the desktop and mobile workspace sidebars. Do not edit the shared `Footer` component or `SettingsSidebar`.

- [ ] **Step 2: Add the desktop top-right settings control**

Render the existing button only while the desktop sidebar and its toggle are visible:

```jsx
{canToggleSidebar && showSidebar && (
  <div className="hidden md:block absolute top-[12px] left-[200px] z-10">
    <SettingsButton />
  </div>
)}
```

This places the 36px settings button immediately left of the existing collapse control at `left-[248px]`, with both controls vertically centered at 30px.

- [ ] **Step 3: Release footer layout space**

Change the desktop scroll region from `h-[calc(100%-60px)]` to `h-full`. Remove the mobile workspace list's `pb-[60px]` because there is no longer a bottom overlay.

- [ ] **Step 4: Run static verification**

Run:

```bash
source "$HOME/.nvm/nvm.sh"
nvm use 18.18.0
cd frontend
yarn build
```

Expected: Vite exits with code 0 and generates the frontend bundle.

### Task 2: Verify the running interface

**Files:**
- Create: `design-qa.md`

- [ ] **Step 1: Inspect the live desktop workspace**

Open the existing workspace route at `http://localhost:3000/workspace/...`. Confirm the sidebar header contains one `Settings` link and one `Hide Sidebar` button, and that no GitHub, Docs, or Discord footer links remain in the workspace sidebar.

- [ ] **Step 2: Verify interactions**

Click the collapse control, confirm the sidebar closes, reopen it, and confirm the settings control returns. Verify the settings link still targets `/settings/interface` without submitting data.

- [ ] **Step 3: Run design QA**

Capture the same desktop viewport and state as the annotation. Compare control placement, icon sizing, vertical alignment, spacing, and the empty lower sidebar area against the supplied reference. Record the result in `design-qa.md`, fixing P0/P1/P2 issues until it contains `final result: passed`.

- [ ] **Step 4: Final verification**

Run:

```bash
git diff --check
git status --short
curl --max-time 10 -fsS http://localhost:3004/api/env-dump
curl --max-time 10 -fsS http://localhost:3000 >/dev/null
```

Expected: no whitespace errors, only intentional files changed, API prints `OK`, and the frontend responds successfully.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/Sidebar/index.jsx design-qa.md docs/superpowers/plans/2026-06-19-sidebar-settings-top-right.md
git commit -m "feat: move sidebar settings control to header"
```

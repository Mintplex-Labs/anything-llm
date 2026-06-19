# Settings Navigation Placement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep prior sidebar cleanup and move workspace settings access from the desktop header wrench into the account popover.

**Architecture:** Keep the shared settings route and mobile drawer control intact. Remove only the desktop `SettingsButton` composition from `Sidebar`, then add a role-gated text link to the existing `UserButton` popover while deleting its unused Support data flow.

**Tech Stack:** React 18, React Router, Phosphor Icons, Tailwind CSS, Vite.

---

### Task 1: Relocate the workspace settings control

**Files:**
- Modify: `frontend/src/components/Sidebar/index.jsx`

- [x] **Step 1: Remove the workspace footer dependency and mounts**

Delete the `Footer` import and both `<Footer />` containers from the desktop and mobile workspace sidebars. Do not edit the shared `Footer` component or `SettingsSidebar`.

- [x] **Step 2: Add the desktop top-right settings control**

Render the existing button only while the desktop sidebar and its toggle are visible:

```jsx
{canToggleSidebar && showSidebar && (
  <div className="hidden md:block absolute top-[12px] left-[200px] z-10">
    <SettingsButton />
  </div>
)}
```

This places the 36px settings button immediately left of the existing collapse control at `left-[248px]`, with both controls vertically centered at 30px.

- [x] **Step 3: Release footer layout space**

Change the desktop scroll region from `h-[calc(100%-60px)]` to `h-full`. Remove the mobile workspace list's `pb-[60px]` because there is no longer a bottom overlay.

- [x] **Step 4: Run static verification**

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

- [x] **Step 1: Inspect the live desktop workspace**

Open the existing workspace route at `http://localhost:3000/workspace/...`. Confirm the sidebar header contains one `Settings` link and one `Hide Sidebar` button, and that no GitHub, Docs, or Discord footer links remain in the workspace sidebar.

- [x] **Step 2: Verify interactions**

Click the collapse control, confirm the sidebar closes, reopen it, and confirm the settings control returns. Verify the settings link still targets `/settings/interface` without submitting data.

- [x] **Step 3: Run design QA**

Capture the same desktop viewport and state as the annotation. Compare control placement, icon sizing, vertical alignment, spacing, and the empty lower sidebar area against the supplied reference. Record the result in `design-qa.md`, fixing P0/P1/P2 issues until it contains `final result: passed`.

- [x] **Step 4: Final verification**

Run:

```bash
git diff --check
git status --short
curl --max-time 10 -fsS http://localhost:3004/api/env-dump
curl --max-time 10 -fsS http://localhost:3000 >/dev/null
```

Expected: no whitespace errors, only intentional files changed, API prints `OK`, and the frontend responds successfully.

- [x] **Step 5: Commit**

```bash
git add frontend/src/components/Sidebar/index.jsx design-qa.md docs/superpowers/plans/2026-06-19-sidebar-settings-top-right.md
git commit -m "feat: move sidebar settings control to header"
```

### Task 3: Simplify the settings sidebar

**Files:**
- Modify: `frontend/src/components/SettingsSidebar/index.jsx`
- Modify: `design-qa.md`

- [x] **Step 1: Remove settings-only footer mounts**

Remove the desktop and mobile `<Footer />` containers from `SettingsSidebar`, remove their reserved scroll padding, and leave the shared `Footer` component unchanged.

- [x] **Step 2: Remove Community Hub navigation**

Remove the Community Hub parent option, all three child entries, and the now-unused illustration import. Preserve the underlying routes for any non-sidebar consumers.

- [x] **Step 3: Move the desktop back button to the upper-left**

Reuse `SettingsButton` in its settings-route state before the product logo. Keep the existing home target, tooltip, icon styling, and role behavior.

- [x] **Step 4: Verify static quality and the live interface**

Run focused ESLint and the production build. In the live browser, confirm the removed links are absent, the back control targets `/`, its rectangle is the left-most header control, and the remaining settings navigation still renders.

- [x] **Step 5: Record design QA and commit**

Append the settings-screen evidence to `design-qa.md`, ensure the final verdict remains `passed`, run final health checks, and commit the intentional files.

### Task 4: Move settings into the account popover

**Files:**
- Modify: `frontend/src/components/Sidebar/index.jsx`
- Modify: `frontend/src/components/UserMenu/UserButton/index.jsx`
- Modify: `design-qa.md`

- [x] **Step 1: Verify the requested behavior fails before implementation**

With the existing account menu open, run a browser DOM assertion requiring one `/settings/interface` link inside the account-menu stack, zero support links in that stack, and zero settings links outside it. Expected: FAIL because the wrench is outside the menu, Support exists, and Settings is missing from the menu.

- [ ] **Step 2: Remove the desktop workspace settings control**

Delete the `canToggleSidebar && showSidebar` desktop mount from `Sidebar`. Retain the `SettingsButton` import because `SidebarMobileHeader` still uses the component in the mobile drawer.

- [ ] **Step 3: Replace Support with Settings in the account popover**

Remove `System`, the support-email state, and its fetch effect from `UserButton`. Add a `Link` to `paths.settings.interface()` immediately below Account, gated by `!user || user.role !== "default"`, and style it with the neighboring menu-item classes. Render the exact label `Settings`.

- [ ] **Step 4: Verify the browser assertion passes**

Reopen the account menu after hot reload and rerun the Step 1 assertion. Expected: one Settings link inside the menu, zero Support links, and zero settings links outside the menu. Click Settings and confirm the URL becomes `/settings/interface`.

- [ ] **Step 5: Run static and visual verification**

Run focused ESLint for both modified components and `yarn build`. Capture the 1227 × 1066 workspace with the account menu open, compare it with the supplied reference, update `design-qa.md`, and require `final result: passed`.

- [ ] **Step 6: Commit**

Stage the two components, design QA report, spec, and plan; commit with `feat: move settings into account menu`.

# Settings Navigation Placement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep prior UI cleanup and remove unused Data Connectors, distribution/embed navigation, and Slash Command publishing entry points.

**Architecture:** Keep direct routes and feature implementation modules intact while removing their unused product-navigation composition. `ManageWorkspace` renders Documents directly, `SettingsSidebar` exposes only the retained Tools children, and Slash Commands keeps editing while dropping its tab-local publish flow.

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

- [x] **Step 2: Remove the desktop workspace settings control**

Delete the `canToggleSidebar && showSidebar` desktop mount from `Sidebar`. Retain the `SettingsButton` import because `SidebarMobileHeader` still uses the component in the mobile drawer.

- [x] **Step 3: Replace Support with Settings in the account popover**

Remove `System`, the support-email state, and its fetch effect from `UserButton`. Add a `Link` to `paths.settings.interface()` immediately below Account, gated by `!user || user.role !== "default"`, and style it with the neighboring menu-item classes. Render the exact label `Settings`.

- [x] **Step 4: Verify the browser assertion passes**

Reopen the account menu after hot reload and rerun the Step 1 assertion. Expected: one Settings link inside the menu, zero Support links, and zero settings links outside the menu. Click Settings and confirm the URL becomes `/settings/interface`.

- [x] **Step 5: Run static and visual verification**

Run focused ESLint for both modified components and `yarn build`. Capture the 1227 × 1066 workspace with the account menu open, compare it with the supplied reference, update `design-qa.md`, and require `final result: passed`.

- [x] **Step 6: Commit**

Stage the two components, design QA report, spec, and plan; commit with `feat: move settings into account menu`.

### Task 5: Remove Data Connectors from document management

**Files:**
- Modify: `frontend/src/components/Modals/ManageWorkspace/index.jsx`
- Modify: `design-qa.md`

- [x] **Step 1: Verify the requested behavior fails before implementation**

Open the workspace document-management modal and assert that a button named `Data Connectors` has count zero. Expected: FAIL with count one while the legacy tab remains visible.

- [x] **Step 2: Remove connector-only composition**

Delete the `System` and `DataConnectors` imports, `settings` and `selectedTab` state, the `System.keys()` effect, the privileged-user tab-switcher block, the ternary connector view, and the complete `ModalTabSwitcher` component. Keep `useUser` because `useManageWorkspaceModal` still uses it.

- [x] **Step 3: Render Documents directly**

Wrap the existing `DocumentSettings` component in `EmbeddingProgressProvider` directly inside the desktop modal. Preserve `workspace`, `hideModal`, mobile handling, workspace fetch, and all document UI descendants unchanged.

- [x] **Step 4: Verify the browser assertion passes**

After hot reload, reopen the modal and assert zero `Data Connectors` controls, one `My Documents` heading, one document searchbox, one `New Folder` button, and one close button. Expected: all counts match and the modal remains interactive.

- [x] **Step 5: Run static and visual verification**

Run focused ESLint for `ManageWorkspace`, then run `yarn build`. Capture the 1227 × 1066 modal state, compare it with the supplied reference in one normalized image, and update `design-qa.md` with `final result: passed` only when no P0/P1/P2 issue remains.

- [x] **Step 6: Commit**

Stage `ManageWorkspace`, the QA report, spec, and plan; commit with `feat: remove data connectors from document modal`.

### Task 6: Remove unused Tools navigation entries

**Files:**
- Modify: `frontend/src/components/SettingsSidebar/index.jsx`
- Modify: `design-qa.md`

- [x] **Step 1: Verify the requested behavior fails before implementation**

Run a source contract requiring zero `settings.embeds`, `settings.browser-extension`, and `settings.mobile-app` entries in `SettingsSidebar`. Expected: FAIL and print all three existing child options.

- [x] **Step 2: Remove the three child options**

Delete the Chat Embed option targeting `paths.settings.embedChatWidgets()`, the Browser Extension option targeting `paths.settings.browserExtension()`, and the AnythingLLM Mobile option targeting `paths.settings.mobile()`. Do not change route definitions, page components, locale strings, or retained Tools options.

- [x] **Step 3: Verify the source contract passes**

Rerun the Step 1 contract. Expected: exit zero with no matching unused menu keys in `SettingsSidebar`.

- [x] **Step 4: Verify the live Tools group**

Open a settings route with Tools expanded and assert zero exact entries for Chat Embed, Browser Extension, and AnythingLLM Mobile; assert one each for Event Logs, Developer API, and System Prompt Variables.

- [x] **Step 5: Run static and visual verification**

Run focused ESLint for `SettingsSidebar`, then run `yarn build`. Capture the 1227 × 1066 settings sidebar with Tools expanded, compare it with the supplied reference in one normalized image, and update `design-qa.md` with `final result: passed` only when no P0/P1/P2 issue remains.

- [x] **Step 6: Commit**

Stage `SettingsSidebar`, the QA report, spec, and plan; commit with `feat: remove unused tools navigation`.

### Task 7: Remove the Slash Command Publish action

**Files:**
- Modify: `frontend/src/components/WorkspaceChat/ChatContainer/PromptInput/ToolsMenu/Tabs/SlashCommands/SlashCommandRow/index.jsx`
- Modify: `frontend/src/components/WorkspaceChat/ChatContainer/PromptInput/ToolsMenu/Tabs/SlashCommands/index.jsx`
- Modify: `design-qa.md`

- [x] **Step 1: Verify the requested behavior fails before implementation**

Run a source contract requiring zero `chat_window.publish`, `PublishEntityModal`, `handlePublishPreset`, `onPublish`, and `presetToPublish` references below the Slash Commands tab. Expected: FAIL and print the current publish button and modal wiring.

- [x] **Step 2: Remove Publish from the overflow menu**

Delete the `onPublish` prop and the Publish button from `SlashCommandRow`. Preserve the popover positioning, outside-click handling, three-dot trigger, and Edit button unchanged.

- [x] **Step 3: Remove tab-local publish composition**

Delete the `PublishEntityModal` import, publish-modal `useModal` state, `presetToPublish` state, `handlePublishPreset`, row callback, and modal render from `SlashCommands`. Keep both Add and Edit modal flows intact.

- [x] **Step 4: Verify the source contract passes**

Rerun the Step 1 contract. Expected: exit zero with no publish-specific references under the Slash Commands tab.

- [x] **Step 5: Verify the live Slash Commands menu**

Open Tools, select Slash Commands, and open a preset overflow menu. Assert one exact `Edit` action, zero exact `Publish` actions, and retained `/reset`, user preset, and `Add new` controls. Click Edit and confirm the existing preset editor opens.

- [x] **Step 6: Run static and visual verification**

Run focused ESLint for both Slash Commands files, then run `yarn build`. Capture the menu state, compare it with the supplied reference, and update `design-qa.md` with `final result: passed` only when no P0/P1/P2 issue remains.

- [x] **Step 7: Commit**

Stage both Slash Commands files, the QA report, spec, and plan; commit with `feat: remove slash command publish action`.

### Task 8: Remove Experimental Features from settings navigation

**Files:**
- Modify: `frontend/src/components/SettingsSidebar/index.jsx`
- Modify: `design-qa.md`

- [ ] **Step 1: Verify the requested behavior fails before implementation**

Run a source contract requiring zero `settings.experimental-features`, `HoldToReveal`, `Flask`, and `showToast` references in `SettingsSidebar`. Expected: FAIL and print the visible menu option plus its sidebar-only unlock implementation.

- [ ] **Step 2: Remove the menu option and dead reveal behavior**

Delete the `HoldToReveal` block that renders the Experimental Features `Option`, delete the complete `HoldToReveal` helper, and remove the now-unused `Flask` and `showToast` imports. Keep `useEffect` and `useState` because the responsive settings sidebar and support footer still use them.

- [ ] **Step 3: Verify the source contract passes**

Rerun the Step 1 contract. Expected: exit zero with no Experimental Features navigation or reveal-only references in `SettingsSidebar`.

- [ ] **Step 4: Verify the live settings sidebar and direct route**

Reload `/settings/beta-features`. Assert zero exact `Experimental Features` sidebar links while the page heading remains one, and confirm the retained `Tools`, `System Prompt Variables`, and `Privacy & Data` navigation remain rendered. The route must stay `/settings/beta-features` and the existing Live Document Sync content must remain visible.

- [ ] **Step 5: Run static and visual verification**

Run focused ESLint for `SettingsSidebar`, then run `yarn build`. Capture the same 340 × 720 sidebar region as the reference, combine reference and implementation into one comparison image, and update `design-qa.md` with `final result: passed` only when no P0/P1/P2 issue remains.

- [ ] **Step 6: Commit**

Stage `SettingsSidebar`, the QA report, and the implementation plan; commit with `feat: remove experimental features navigation`.

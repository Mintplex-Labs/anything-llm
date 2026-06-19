# Sidebar Settings Button Placement Design

## Goal

On workspace screens, remove the bottom row of GitHub, documentation, Discord, and settings icons. Keep the existing settings action fully functional and move its wrench button to the upper-right sidebar header, immediately to the left of the sidebar-collapse button.

## Visual Source

- The annotated workspace sidebar at `http://localhost:3000/workspace/...`.
- The supplied compact top-right control reference, where adjacent circular controls sit in one horizontal group.

## Scope

- Update the main workspace `Sidebar` only.
- Desktop: render `SettingsButton` in the top header beside `ToggleSidebarButton` while the sidebar is open.
- Desktop: remove the footer mount so no icons remain at the bottom.
- Mobile: keep the existing functional settings button in the drawer header and remove the drawer footer icons.
- Preserve role-based visibility in `SettingsButton`.
- Preserve the settings route, tooltip, sidebar-collapse behavior, theme styling, workspace list, and all other layout/content.
- Do not change the separate `SettingsSidebar` or the shared `Footer` component because the browser annotation is scoped to the workspace sidebar.

## Approaches Considered

1. **Relocate at the workspace sidebar composition layer — selected.** Remove `Footer` from `Sidebar` and place the existing `SettingsButton` beside the collapse control. This is the smallest scoped change and does not alter other screens.
2. Change the shared `Footer` to render only settings. Rejected because it would unexpectedly change settings and other sidebar surfaces.
3. Hide the three external links with CSS. Rejected because hidden controls would remain in the DOM and the settings button would still require a separate relocation.

## Interaction And Layout

- The wrench remains a real link to interface settings.
- The top-right wrench uses the existing circular icon styling.
- Its vertical center aligns with the sidebar-collapse icon.
- Closing the sidebar hides the wrench with the rest of the sidebar controls; reopening restores it.
- No empty footer container remains at the bottom.

## Verification

- Confirm the desktop workspace sidebar shows only the wrench and collapse controls in the upper-right header.
- Confirm GitHub, documentation, and Discord footer links are absent from the workspace sidebar.
- Confirm the wrench opens settings and the collapse control still works.
- Confirm the mobile drawer has no bottom footer icons and retains its existing header settings control.
- Confirm Vite builds successfully and the working tree contains only the intentional change.

The frontend currently has no component-test harness. For this small placement-only change, verification will use the running Vite app and browser interaction rather than adding a new test framework solely for this edit.

# Settings Navigation Placement Design

## Goal

Keep settings reachable without a standalone workspace-header wrench. On workspace screens, place a text `Settings` link directly below `Account` in the user menu and remove the unused `Support` entry.

## Visual Source

- The annotated workspace sidebar at `http://localhost:3000/workspace/...`.
- The supplied compact top-right control reference, where adjacent circular controls sit in one horizontal group.
- The supplied account-menu screenshot at `http://localhost:3000/`, showing the current `Account`, `Support`, and `Sign out` stack and the workspace-header wrench to remove.

## Scope

- Update the main workspace `Sidebar` and the existing `UserButton` account popover.
- Desktop: remove the standalone `SettingsButton` from the workspace header, leaving the sidebar-collapse control and product logo unchanged.
- Desktop: remove the footer mount so no icons remain at the bottom.
- Mobile: keep the existing functional settings button in the drawer header and remove the drawer footer icons.
- Account popover: add `Settings` immediately below `Account` and before `Sign out`.
- Account popover: remove `Support` and its support-email fetch because no support link remains in this surface.
- Preserve the former settings-button role rule: default-role users do not see the new Settings entry; single-user mode and privileged multi-user roles do.
- Preserve the settings route, sidebar-collapse behavior, theme styling, workspace list, and all other layout/content.
- Keep the shared `Footer` component unchanged.
- Settings screen: remove the desktop and mobile settings-sidebar footer mounts so GitHub, documentation, and Discord icons are absent.
- Settings screen: remove the complete Community Hub menu group and its children.
- Settings screen desktop: render the existing settings-aware back button at the upper-left, immediately before the product logo.
- Preserve every other settings menu, route, role check, logo, support link, version label, and content panel.

## Approaches Considered

1. **Move navigation into the existing account popover — selected.** Remove the desktop workspace `SettingsButton` mount and add a normal React Router link in `UserButton`. This matches the supplied hierarchy and keeps navigation in an established menu.
2. Keep the wrench and duplicate Settings in the account menu. Rejected because it leaves two competing entry points after the user explicitly asked to remove the wrench.
3. Reuse the shared `Footer` inside the account menu. Rejected because its icon layout and external links do not match the text-menu pattern.

## Interaction And Layout

- `Settings` is a real React Router link to `/settings/interface` and uses the same padding, typography, hover token, width, and rounded corners as the neighboring menu items.
- The order is `Account`, `Settings`, `Sign out` when Account is available. In single-user mode the order is `Settings`, `Sign out`.
- Opening Settings closes naturally through route navigation; Account modal and Sign out behavior remain unchanged.
- No `Support` link or support-email request remains in `UserButton`.
- No empty footer container remains at the bottom.
- On desktop settings screens, the back button remains a real link to the workspace home route and is the left-most header control.
- The product logo follows the back button in the same 60px-tall header footprint, so the settings navigation card retains its existing vertical placement.
- Removing Community Hub closes the gap naturally; Customization follows Agent Skills.

## Verification

- Confirm the desktop workspace header has no Settings wrench and still shows the sidebar-collapse control.
- Confirm GitHub, documentation, and Discord footer links are absent from the workspace sidebar.
- Confirm the account popover shows `Account`, `Settings`, and `Sign out` in that order, with no `Support` entry.
- Confirm `Settings` opens `/settings/interface`, then return to the workspace and confirm the account popover and collapse control still work.
- Confirm the mobile drawer has no bottom footer icons and retains its existing header settings control.
- Confirm settings pages have no sidebar footer icons or Community Hub menu entries.
- Confirm the settings back button appears at the desktop upper-left, targets `/`, and the logo sits immediately to its right.
- Confirm Vite builds successfully and the working tree contains only the intentional change.

The frontend currently has no component-test harness. For this small placement-only change, verification will use the running Vite app and browser interaction rather than adding a new test framework solely for this edit.

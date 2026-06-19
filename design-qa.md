# Sidebar Settings Placement Design QA

- Source visual truth: `/var/folders/73/27tr2bhn36q0dfv81b_968sw0000gn/T/codex-clipboard-76a64eea-9da1-4c0c-8fa2-2b24fecebcb5.png`
- Implementation screenshot: `/var/folders/73/27tr2bhn36q0dfv81b_968sw0000gn/T/projectm-sidebar-settings-top-right.png`
- Focused comparison: `/var/folders/73/27tr2bhn36q0dfv81b_968sw0000gn/T/projectm-sidebar-reference-comparison.png`
- Viewport: 1227 × 1066 desktop, dark theme
- State: workspace thread open, sidebar expanded

## Full-view comparison evidence

The supplied placement reference defines a compact top-right control group rather than a complete application viewport. The full implementation capture confirms the workspace composition is otherwise unchanged: logo, search, workspace tree, chat content, and prompt area retain their existing hierarchy and spacing. The former bottom icon row and its overlay are absent, leaving the workspace list area unobstructed.

## Focused comparison evidence

The side-by-side focused comparison shows the same intended pattern: compact circular controls grouped at the top edge. In the implementation, the existing 36px settings control sits at `x=200, y=12` and the 24px collapse control sits at `x=248, y=18`; both have a vertical center of 30px with a 12px gap. No focused crop beyond the header is needed because the requested visual change is confined to these controls.

## Required fidelity surfaces

- Fonts and typography: unchanged; this edit introduces no text or font changes.
- Spacing and layout rhythm: settings and collapse controls are vertically aligned, separated clearly, and contained in the sidebar's upper-right header. Footer-reserved height and mobile bottom padding were removed.
- Colors and visual tokens: the settings control continues to use the existing sidebar footer-icon theme tokens and hover state.
- Image quality and asset fidelity: no new raster or generated assets were needed. The existing Phosphor `Wrench` and `SidebarSimple` icons are preserved; the product logo is unchanged.
- Copy and content: unchanged. Existing accessible labels and tooltips remain `Settings`, `Open settings`, and the sidebar toggle labels.

## Findings

No actionable P0, P1, or P2 mismatches remain. The reference includes a different surrounding product chrome, but only the compact adjacent-control placement was requested and that pattern is matched within the existing AnythingLLM design system.

## Interaction verification

- Expanded state: one settings link targets `/settings/interface`; one hide-sidebar button is present.
- Collapsed state: the settings link is absent and one show-sidebar button is present.
- Reopened state: the settings link returns with the correct target.
- Workspace footer links: GitHub 0, Docs 0, Discord 0.

## Patches made

- Removed workspace-only desktop and mobile `Footer` mounts.
- Placed the existing desktop `SettingsButton` immediately left of the collapse control.
- Released desktop and mobile layout space previously reserved for the footer.

## Settings sidebar cleanup evidence

- Source visual truth: the three annotated `/settings/interface` captures supplied in the browser comments.
- Implementation screenshot: `/var/folders/73/27tr2bhn36q0dfv81b_968sw0000gn/T/projectm-settings-sidebar-cleanup.png`
- Viewport and state: 1227 × 1066 desktop, dark theme, `/settings/interface`.
- Comparison input: the annotated reference captures and the full implementation capture were reviewed together for the top header, navigation order, lower sidebar, and content-panel alignment.

The implementation preserves the settings card at its original top offset while moving the existing 36px back control to `x=20.5, y=12`. The product-logo link follows at `x=68.5`, giving a consistent 12px gap and making the back control the left-most element. Community Hub and its child links are absent, so Customization follows Agent Skills directly. The GitHub, Docs, and Discord footer controls are absent and no footer overlay obscures the now-scrollable settings menu.

DOM and interaction checks:

- Back control: count 1, target `/`, measured 36 × 36px, and click navigated to `http://localhost:3000/`.
- Product logo: begins at `x=68.5`, immediately right of the back control.
- Community Hub: count 0.
- Footer GitHub / Docs / Discord controls: counts 0 / 0 / 0.
- Retained navigation: AI Providers and Customization remain rendered; UI Preferences remains selected on the requested route.

No new P0, P1, or P2 visual or interaction issues were found in the requested settings-sidebar scope.

## Account menu settings placement evidence

- Source visual truth: `/var/folders/73/27tr2bhn36q0dfv81b_968sw0000gn/T/codex-clipboard-35315b6d-47ac-4d6d-b026-f2ef3efa531a.png`
- Implementation screenshot: `/var/folders/73/27tr2bhn36q0dfv81b_968sw0000gn/T/projectm-account-menu-settings.png`
- Normalized comparison: `/var/folders/73/27tr2bhn36q0dfv81b_968sw0000gn/T/projectm-account-menu-comparison.png`
- Viewport and state: 1227 × 1066 desktop, dark theme, `/`, account popover open.

The normalized comparison places the supplied top-of-workspace reference and the matching implementation crop in one image. The workspace composition, logo, sidebar-collapse control, profile button, menu width, typography, dark tokens, rounded corners, and vertical item rhythm remain consistent. The requested content changes are exact: the standalone wrench is absent, `Settings` replaces `Support`, and the final order is `Account`, `Settings`, `Sign out`.

Focused evidence was required because the changed controls occupy a small header region. The account popover measures 112.34 × 140px at `x=1074.66, y=84`; the Settings link uses the same 36px row height and neighboring menu-item classes. DOM checks found zero Support entries, zero `/settings/interface` links outside the popover, and one retained sidebar-collapse button.

Required fidelity surfaces:

- Fonts and typography: unchanged Plus Jakarta Sans stack, size, weight, line height, and antialiasing inherited from the existing menu items.
- Spacing and layout rhythm: existing 8px menu padding and vertical gap are preserved; the added Settings row aligns with Account and Sign out.
- Colors and visual tokens: existing action-menu background and hover tokens are reused without new colors.
- Image quality and asset fidelity: the product logo and profile control are unchanged; the removed wrench was an existing Phosphor icon and no replacement asset was needed.
- Copy and content: exact visible order is `Account`, `Settings`, `Sign out`; `Support` is absent.

Interaction verification:

- RED: before implementation, the account menu had no Settings link, one Support link, and one settings link outside the menu.
- GREEN: after implementation, the menu has one Settings link, zero Support links, and zero settings links outside the menu.
- Settings navigation: clicking the menu link reached `http://localhost:3000/settings/interface`.
- Existing controls: Account and Sign out remain buttons; the sidebar-collapse button remains present.

No actionable P0, P1, or P2 mismatch remains in the account-menu scope.

## Documents-only modal evidence

- Source visual truth: `/var/folders/73/27tr2bhn36q0dfv81b_968sw0000gn/T/codex-clipboard-5dad6f02-9328-406d-b346-896d4a448439.png`
- Implementation screenshot: `/var/folders/73/27tr2bhn36q0dfv81b_968sw0000gn/T/projectm-documents-only-modal.png`
- Normalized comparison: `/var/folders/73/27tr2bhn36q0dfv81b_968sw0000gn/T/projectm-documents-modal-comparison.png`
- Viewport and state: 1227 × 1066 desktop, dark theme, workspace document-management modal open.

The normalized comparison places the supplied modal-top reference and the same implementation region in one image. Removing the tab strip allows the existing Documents content to become the modal's immediate first section while preserving the modal frame, close control, typography, spacing, search field, New Folder action, document list, upload dropzone, link fetch control, and workspace assignment panel.

Focused evidence was required because the requested change is confined to the modal header and first content row. The comparison confirms that `Data Connectors` and the full tab container are absent rather than visually hidden. `My Documents` now establishes the top hierarchy directly beneath the modal edge without introducing an empty spacer.

Required fidelity surfaces:

- Fonts and typography: the existing Plus Jakarta Sans hierarchy, weights, and control labels are unchanged.
- Spacing and layout rhythm: the Documents row retains its internal alignment; only the connector tab strip and its reserved margin are removed.
- Colors and visual tokens: existing modal background, border, input, and action tokens are preserved.
- Image quality and asset fidelity: no new assets were introduced; the existing upload icon and app chrome remain unchanged.
- Copy and content: `Data Connectors` count is zero; `My Documents`, `Search for document`, and `New Folder` remain unchanged.

Interaction verification:

- RED: before implementation, the `Data Connectors` button count was one.
- GREEN: after implementation, Data Connectors button and exact-text counts are both zero.
- Retained controls: one My Documents heading, one document searchbox, one New Folder button, and one close button.
- Close/reopen: closing removes the modal content, and reopening restores the Documents-only state.

No actionable P0, P1, or P2 mismatch remains in the Documents-only modal scope.

## Tools menu cleanup evidence

- Source visual truth: `/var/folders/73/27tr2bhn36q0dfv81b_968sw0000gn/T/codex-clipboard-fafbecd8-d2fc-4619-95a2-17da65c075a8.png`
- Implementation screenshot: `/var/folders/73/27tr2bhn36q0dfv81b_968sw0000gn/T/projectm-tools-menu-cleanup.png`
- Normalized comparison: `/var/folders/73/27tr2bhn36q0dfv81b_968sw0000gn/T/projectm-tools-menu-comparison.png`
- Viewport and state: 1227 × 1066 desktop with a 300 × 1000 sidebar crop, dark theme, `/settings/system-prompt-variables`, Tools expanded.

The normalized comparison places the supplied Tools reference and the focused implementation region in one image. The Tools header, toolbox icon, chevron, indentation, text size, row spacing, active-row styling, and surrounding settings navigation remain consistent. The implementation removes Chat Embed, Browser Extension, and AnythingLLM Mobile without leaving gaps; Event Logs, Developer API, and System Prompt Variables form the complete retained group.

Focused evidence is sufficient because this change affects only a single expanded navigation group. The full sidebar capture confirms the compacted Tools group flows naturally into Experimental Features and the footer links without clipping or an empty reserved area.

Required fidelity surfaces:

- Fonts and typography: existing Plus Jakarta Sans labels, weights, and active-row hierarchy are unchanged.
- Spacing and layout rhythm: child indentation and vertical gaps are preserved; removing three rows compacts the group naturally.
- Colors and visual tokens: existing sidebar, hover, text, and selected-item tokens remain unchanged.
- Image quality and asset fidelity: the Phosphor toolbox and flask icons remain source components; no new assets were introduced.
- Copy and content: Chat Embed, Browser Extension, and AnythingLLM Mobile are absent; Event Logs, Developer API, and System Prompt Variables remain.

Verification:

- RED source contract printed all three unused option keys before implementation.
- GREEN source contract finds none of those option keys in `SettingsSidebar`.
- Live DOM: the three removed labels and route links have count zero; all three retained Tools labels and links remain available.

No actionable P0, P1, or P2 mismatch remains in the Tools-menu scope.

## Slash Command Publish cleanup evidence

- Source visual truth: `/var/folders/73/27tr2bhn36q0dfv81b_968sw0000gn/T/codex-clipboard-f691f552-11d2-422b-b5ff-527ec4502084.png`
- Implementation screenshot: `/var/folders/73/27tr2bhn36q0dfv81b_968sw0000gn/T/projectm-slash-command-menu-cleanup.png`
- Normalized comparison: `/var/folders/73/27tr2bhn36q0dfv81b_968sw0000gn/T/projectm-slash-command-menu-comparison.png`
- Viewport and state: 1280 × 720 desktop, dark theme, workspace Tools menu open on Slash Commands with the `/wow` overflow menu expanded.

The normalized comparison places the supplied two-action menu beside the focused implementation crop. The Slash Commands and Agent Skills tabs, `/reset`, `/wow`, descriptions, Add new row, three-dot trigger, dark tokens, rounded border, and preset-menu anchoring remain intact. The overflow menu now contains only `Edit`; its width and row styling continue to use the existing component tokens, and the removed `Publish` row leaves no empty interactive element.

Required fidelity surfaces:

- Fonts and typography: existing Plus Jakarta Sans sizing, weights, and italic descriptions remain unchanged.
- Spacing and layout rhythm: the preset list and Add new row retain their original positions; the overflow menu contracts naturally to one row.
- Colors and visual tokens: the existing tools panel, border, hover, and popover colors are unchanged.
- Image quality and asset fidelity: the Phosphor three-dot and plus icons remain source components; no new assets were introduced.
- Copy and content: `Publish` is absent; `Edit`, `/reset`, `/wow`, and `Add new` remain exact.

Interaction verification:

- RED source contract printed the Publish button, callback, modal import, modal state, handler, and entity wiring before implementation.
- GREEN source contract finds none of the publish-specific references below the Slash Commands tab.
- Live DOM: one exact Edit button, zero exact Publish buttons, and one each of `/reset`, `/wow`, and Add new.
- Edit regression: clicking Edit opens the existing `Edit Preset` modal with Command, Prompt, Description, Delete Preset, Cancel, and Save controls.

No actionable P0, P1, or P2 mismatch remains in the Slash Command menu scope.

## Follow-up polish

None required for the approved scope.

final result: passed

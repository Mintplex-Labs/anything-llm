# Onenew Theme Style Guide

## Theme usage
Use `.onenew-*` utilities or CSS variables for app chrome. Avoid Tailwind color utilities except in content (markdown), charts, and third-party widgets.

## Palette tokens
| Token | Purpose |
| --- | --- |
| `--surface` | Base surface color for the app background. |
| `--surface-muted` | Elevated surfaces such as cards and panels. |
| `--border` | Default border color. |
| `--border-muted` | Subtle dividers and outlines. |
| `--text` | Primary text color. |
| `--text-muted` | Secondary text and helper copy. |
| `--primary` | Brand accent for actions and highlights. |
| `--success` | Positive status color. |
| `--warning` | Cautionary or pending status color. |
| `--danger` | Error and destructive status color. |

## Adding a new surface or status color
1. Add the CSS variable to `onenew-theme.css`.
2. Expose the token in `theme.ts` so components can reference it.
3. If needed, create a matching utility class in `onenew-components.css`.
4. Document the token in the table above.

## Adding a new component variant
1. Start with the base component class (e.g., `.onenew-btn`).
2. Define a modifier class like `.onenew-btn--myvariant` in `onenew-components.css`.
3. Apply palette tokens or existing `.onenew-*` utilities within the variant.
4. Update the docs with usage examples and ensure visual checks.

## Reference snippets
### Page wrapper
```jsx
<div className="onenew-page min-h-screen">{children}</div>
```

### Card
```jsx
<div className="onenew-card p-5">{children}</div>
```

### Primary button
```jsx
<button className="onenew-btn onenew-btn--primary">Continue</button>
```

### Input
```jsx
<label className="block text-[var(--text)] font-medium mb-1">Name</label>
<input className="onenew-input" placeholder="Enter name" />
<p className="text-sm text-[var(--text-muted)] mt-1">This appears in your workspace list.</p>
```

### Table
```jsx
<table className="onenew-table">
  <thead><tr><th>Name</th><th>Status</th></tr></thead>
  <tbody>
    <tr><td>foo.pdf</td><td><span className="onenew-chip">Embedded</span></td></tr>
  </tbody>
</table>
```

## Rollout notes
- **Order of work:** T1→T3 (infra & utilities), then T5..T11 by screen, then T12..T15 polish/enforce, then T16 QA & T17 docs.
- **Risk:** Large find/replace can break content areas (markdown/syntax themes). Keep a small allow-list for content-specific color usage.
- **Rollback:** Utilities are additive; if needed, revert T4 codemod commit to restore old color classes while keeping new infra.

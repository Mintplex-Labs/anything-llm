# Onenew Theme Style Guide

## Theme usage
Use `.onenew-*` utilities, CSS variables, or the Tailwind token classes for app chrome. Avoid the default Tailwind palette except in content (markdown), charts, and third-party widgets.

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

## Tailwind color utilities
Tailwind exposes theme tokens as color classes so components can use semantic names instead of raw values.

```jsx
<div className="bg-bg-0 text-text-0">
  <button className="bg-onenew text-white">Continue</button>
  <p className="text-success-600">Saved!</p>
</div>
```

Available classes include:
- `bg-bg-0`, `bg-bg-1`, `bg-bg-2`
- `text-text-0`, `text-text-1`
- `border-stroke-0`, `border-stroke-1`
- `bg-brand-blue-600`, `bg-brand-violet-600`
- `text-success-600`, `text-danger-600`

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

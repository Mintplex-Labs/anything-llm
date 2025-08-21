# Components

Shared React UI components used across the app such as buttons, cards, forms, and chat widgets.
All components rely on Tailwind CSS with the custom `onenew` theme and support light/dark modes.

## Guidelines
- Use design tokens defined in `tailwind.config.js`.
- Keep spacing consistent with Tailwind scale classes (`mt-4`, `px-2`, etc.).
- Prefer semantic token utilities like `bg-bg-0` and `text-text-0`.
- Co-locate component-specific styles in the `styles/` folder when needed.

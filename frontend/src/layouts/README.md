# Layouts

Page layout components that provide app structure such as headers, sidebars, and footers.
Layouts wrap page content and leverage React context providers for shared state.

## Guidelines
- Keep layouts focused on structure; delegate data fetching to pages.
- Use the `AppLayout` as the base scaffold for most views.
- Compose layout parts from shared components and follow theme tokens.

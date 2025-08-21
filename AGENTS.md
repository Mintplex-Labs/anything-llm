# Project Overview
OneNew ("Anything LLM") is a full-stack application that lets users turn documents and other resources into context for large language models. It bundles a React + Vite frontend, an Express server, and a document collector so you can chat with your data using many different LLM and vector DB providers.

## Tech Stack
- Node.js (>=20) with Yarn for dependency management
- Express server (`server/`)
- React + Vite frontend (`frontend/`)
- Tailwind CSS with the custom `onenew` theme
- Stylelint, ESLint, Prettier, and Jest for linting and tests

## Conventions
- Use **Yarn** for all scripts and installs; avoid `npm`.
- Follow [Conventional Commit](https://www.conventionalcommits.org/en/) messages (`feat:`, `fix:`, `docs:`...).
- Run `yarn lint` and `yarn test` before pushing changes.
- When editing translations, run `yarn verify:translations`.
- Do not commit binary artifacts; if one is required, add it via Git LFS.

## UI Guidelines
See `STYLEGUIDE.md` for full theme details. Key points:
- Prefer `.onenew-*` utilities and CSS variables over raw colors.
- Use semantic Tailwind token classes (e.g., `bg-bg-0`, `text-text-0`).
- Document new palette tokens or component variants when added.

## Repository Structure
- `frontend/`: React/Vite client
- `server/`: Express API and vector/LLM management
- `collector/`: document processing service
- `embed/` and `browser-extension/`: submodules for optional widgets

## Testing
Make a best effort to run:
```bash
yarn lint
yarn test
```
Run additional targeted tests when modifying specific packages.

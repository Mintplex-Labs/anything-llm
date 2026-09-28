---
name: git-commit-conventions
description: Writes clean, conventional commit messages from a list of changes or a git diff. Use when the user asks for a commit message, asks to summarize staged changes, or mentions conventional commits, Conventional Commits, or release notes.
license: MIT
metadata:
  author: anythingllm
  version: "1.0"
---

# Git Commit Conventions

Produce a single commit message following Conventional Commits 1.0.

## Format

```
<type>(<optional scope>): <short imperative summary>

<optional body>
<optional footer>
```

## Types

- `feat` - a new feature
- `fix` - a bug fix
- `docs` - documentation only
- `style` - formatting, no code change
- `refactor` - neither fixes a bug nor adds a feature
- `perf` - performance improvement
- `test` - adding or updating tests
- `chore` - build process, tooling, dependencies

## Rules

1. Summary line is imperative, lowercase, no trailing period, max 72 chars.
2. Scope is the primary module or area touched (e.g. `feat(server): ...`).
3. Break the summary and body with a blank line; wrap body at 72 chars.
4. Explain *why* in the body, not *what* - the diff already shows what changed.
5. For breaking changes, start the footer with `BREAKING CHANGE:` and describe the
   upgrade path.
6. Reference issues in the footer: `Refs: #1234` or `Closes: #1234`.

## Example

Input: "Added a new admin endpoint to list markdown skills; fixed a null-check
in the workspace model."

Output:

```
feat(server): add markdown skills admin endpoint

List all stored markdown skills via GET /admin/markdown-skills so the admin
UI can render the skills library. Also guards against a null workspace in
the workspace model that caused a crash on deleted rows.

Refs: #4821
```

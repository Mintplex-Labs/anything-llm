# Markdown Skills

This directory holds **markdown skills** in the [Agent Skills](https://agentskills.io/specification)
format. Unlike the JavaScript agent tools in `../agent-skills/`, these skills are
pure context: no code, no tool calls.

Each skill is a folder containing a `SKILL.md`. Live skills are stored in
`server/storage/plugins/skills/` (gitignored); this folder only ships
**examples** to copy from:

```
server/storage/plugins/skills/
└── git-commit-conventions/      <- copy from examples/ to activate
    └── SKILL.md
```

```bash
# install the bundled example skill:
cp -r server/utils/skills/examples/git-commit-conventions \
  server/storage/plugins/skills/
```

```markdown
---
name: git-commit-conventions
description: What the skill does and when to use it. Include trigger keywords.
license: MIT            # optional
compatibility: ...      # optional
metadata:               # optional
  author: you
---

# Skill instructions (markdown body)

Write step-by-step guidance, examples, edge cases...
```

## How they are used

On every chat turn, AnythingLLM loads each skill's `name` + `description`. When
there are more skills than fit the context budget, the embedding reranker scores
them against the current prompt and the most relevant skills (max 5) are
appended to the LLM's system prompt under a `## Skills` section. This is the
same progressive-disclosure pattern used by Cursor and Claude: metadata is
always cheap, the full instructions are only injected when the skill is judged
relevant.

## Managing skills

- Create, edit, and delete skills from **Settings -> Agent Skills -> Markdown
  Skills** in the UI.
- Or drop a skill folder into this directory directly (it is picked up live -
  the directory is re-read on every request).

`name` must match the folder name: 1-64 lowercase letters, numbers, and single
hyphens. `description` should state what the skill does **and when to use it**
- the detection is only as good as this field.

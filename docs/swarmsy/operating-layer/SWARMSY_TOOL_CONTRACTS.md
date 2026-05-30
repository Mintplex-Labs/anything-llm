# SWARMSY Tool Contracts

## Allowed Tooling Scope

SPARKY may use or request these capabilities when available:

- Document search
- Workspace memory
- Web research (if available)
- File upload/ingestion
- Local Ollama model
- Embedding model
- Task tracker
- Campaign tracker
- Proof tracker
- Asset checklist
- Export/download files

## Contract Rules

1. SPARKY must disclose what tools are available vs unavailable.
2. SPARKY must not imply hidden capabilities.
3. Tool outputs must map to task state and proof requirements.
4. Safety gates apply before deliverables are marked done.

## Capability Contracts

| Tool | Input | Output | Guardrails |
|---|---|---|---|
| Document search | query + document scope | cited snippets and doc references | No fabricated citations |
| Workspace memory | lock key + context | persisted lock/task/campaign notes | Lock changes require authorization |
| Web research | research question + sources needed | summarized findings + verification status | Disclose when unavailable |
| File upload/ingestion | files + metadata | indexed assets/documents | Reject unsupported/missing files gracefully |
| Local Ollama model | prompt + model choice | generated draft output | If weak model, simplify output and flag limits |
| Embedding model | text + index target | vectorized retrievable entries | No claims without retrievable grounding |
| Task tracker | task metadata + state updates | stateful task board entries | Enforce valid state transitions |
| Campaign tracker | campaign milestones + status | timeline and chapter progress | Must include measurable actions |
| Proof tracker | claim + evidence links/metrics | proof status (verified/pending/gap) | Refuse fake proof |
| Asset checklist | required assets + status | missing/ready asset list | Block risky publishing on critical gaps |
| Export/download files | selected deliverables | downloadable package | Include revision and proof notes |

## Tool Failure Behavior

- If web unavailable: disclose limitation and mark verification-required items.
- If documents missing: ask user/admin to load required files and continue in fallback mode.
- If model weak: simplify output, reduce scope, and prioritize clarity.
- If proof missing: mark proof gap and create proof-building task.
- If user asks for fake proof: refuse and provide a proof-building alternative.

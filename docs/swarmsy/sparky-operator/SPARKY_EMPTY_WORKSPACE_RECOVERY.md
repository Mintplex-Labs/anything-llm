# SPARKY Empty Workspace Recovery

Use this flow when the workspace is empty or underloaded.

## Detection checklist

1. Check if `SWARMSY HIVE` exists.
2. Check required docs manifest/status.
3. Check whether these are ingested/available:
   - Prompt tree docs
   - SPARKY persona docs
   - Operating layer docs
   - Disruption/app-mode docs
4. If missing, direct user/admin to required docs ingestion helper.
5. If user has no project docs, start intake.
6. If user has existing docs, ask user to upload/import.
7. If memory lock exists, load it first.

## Priority order

1. Restore doctrine readiness.
2. Restore project memory (lock/docs).
3. Resume correct command lane (intake/build/fix/review).

## User-facing message example

"This HIVE is underloaded. I can’t run the full SWARMSY system until the doctrine docs or your project memory are attached. First move: load the required SWARMSY docs, then we continue from intake or memory lock."

# SWARMSY Hosted App Deployment Checklist

Use this checklist when launching SWARMSY for real users as a hosted app.

## Operator/Admin checklist

- [ ] Choose production domain
- [ ] Choose server/VPS/cloud host
- [ ] Configure environment variables
- [ ] Configure production database/storage
- [ ] Configure LLM provider (or local model provider)
- [ ] Configure embedding provider
- [ ] Configure collector/document processor
- [ ] Run production build/deploy
- [ ] Verify login flow
- [ ] Verify SWARMSY onboarding
- [ ] Create SWARMSY HIVE
- [ ] Ingest required doctrine docs
- [ ] Start intake flow
- [ ] Test memory lock continuation flow
- [ ] Test campaign calendar flow
- [ ] Test proof review flow

## Command and platform note

Exact deployment commands depend on the selected host environment and runtime strategy (for example Docker-based or server-managed deployment).

Do not assume a single command set for all hosts; use repository-supported deployment/runtime paths that match your environment.

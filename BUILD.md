# AnythingLLM Kufer Build & Push Guide

## Embed Widget Development
```bash
# Build and publish embed widget changes to main project
cd /home/srvadmin/KI_Apps_Pipelines/Apps/anythingllm-embed
npm run build:publish

# This copies the minified files to:
# - ../anythingllm/frontend/public/embed/anythingllm-chat-widget.min.js
# - ../anythingllm/frontend/public/embed/anythingllm-chat-widget.min.css
```

## Build Image (Correct Command)
```bash
# Run from the main project directory, not docker/
cd /home/srvadmin/KI_Apps_Pipelines/Apps/anythingllm

# Build with multiple tags (no separate tagging needed)
docker build -f docker/Dockerfile -t kufer/anythingllm-kufer:VERSION -t kufer/anythingllm-kufer:latest .
```

## Push Specific Tags
```bash
# Login first (if needed)
docker login

# Push specific version and latest (no --all-tags needed)
docker push kufer/anythingllm-kufer:VERSION
docker push kufer/anythingllm-kufer:latest
```

## Example for Version 1.10
```bash
# Build with tags
cd /home/srvadmin/KI_Apps_Pipelines/Apps/anythingllm
docker build -f docker/Dockerfile -t kufer/anythingllm-kufer:1.10 -t kufer/anythingllm-kufer:latest .

# Push specific tags
docker push kufer/anythingllm-kufer:1.10
docker push kufer/anythingllm-kufer:latest
```

## Troubleshooting: Docker-Cache greift nicht

Falls nach Code-Änderungen alles `CACHED` bleibt und die Änderungen nicht im Image landen:

```bash
# Nur Frontend-Stage neu bauen (schnell, Rest bleibt gecacht)
docker build --no-cache-filter frontend-build -f docker/Dockerfile -t kufer/anythingllm-kufer:VERSION -t kufer/anythingllm-kufer:latest .

# Falls das nicht reicht: BuildKit-Cache komplett leeren + alles neu bauen
docker builder prune -f
docker build --no-cache -f docker/Dockerfile -t kufer/anythingllm-kufer:VERSION -t kufer/anythingllm-kufer:latest .
```

## Test Local Build
```bash
# Start container
docker-compose up -d

# Check logs
docker logs anythingllm-kufer

# Stop
docker-compose down
```

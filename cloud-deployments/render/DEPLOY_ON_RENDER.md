## AnythingLLM on Render.com

You can run the full stack version of AnythingLLM on a single Render.com Web Service. This repo contains all of the supports and files needed to enable persistent storage and full functionality.

**Requirements**
- An Render.com account with billing information
- AnythingLLM (GUI + document processor) must use Web Service running on the **Standard** tier.

### Creating the Render service
**Repository:** https://github.com/Mintplex-Labs/anything-llm
**Branch:** `render-deployment`
**Instance Type:** Standard
**Root Directory:** _empty_
**Dockerfile Path:** `./docker/render.Dockerfile`
**Docker Build Context Directory:** `.`
_automatic deployment is not recommended to save on build minutes - use at your discretion._
**Environment Variables:**
```
PORT=3001
STORAGE_DIR=/storage
```

**BEFORE DEPLOYING**
Ensure you have create a `Disk` and have it set to at least 1GB. The mount location **must be** `/storage`. You can increase storage at any time but you cannot decrease it.

Launch! You service should boot with 5-10 minutes and be fully available and all changes and data will persist from restart to restart!
# SWARMSY Hosted ComfyUI Setup

SWARMSY can check and submit jobs to a local/private ComfyUI endpoint, but **ComfyUI is not bundled with SWARMSY**. Admins must run ComfyUI separately and configure SWARMSY to reach it.

## Desktop/local vs hosted/server meaning

- **Desktop/local mode** uses the default `http://localhost:8188`, which means ComfyUI running on the user's own computer.
- **Hosted/server mode** must use a server-side container/service URL, such as `http://comfyui:8188`.
- In Docker, `localhost` means inside the SWARMSY/AnythingLLM app container, not the user's home PC.
- A hosted SWARMSY app cannot see ComfyUI running on a user's home PC. Use desktop mode for user-PC ComfyUI, or configure a server-side ComfyUI service.

## Environment variables

SWARMSY resolves ComfyUI in this order:

1. `SWARMSY_LOCAL_COMFYUI_URL`
2. `COMFYUI_BASE_URL`
3. Default `http://localhost:8188`

Keep the URL local/private. SWARMSY rejects public arbitrary URLs for generation and does not support using external public ComfyUI endpoints.

## Docker Compose example

```yaml
services:
  comfyui:
    image: yanwk/comfyui-boot:latest
    container_name: swarmsy-comfyui
    restart: unless-stopped
    ports:
      - "127.0.0.1:8188:8188"
    volumes:
      - ./comfyui-data:/root

  anything-llm:
    environment:
      - SWARMSY_LOCAL_COMFYUI_URL=http://comfyui:8188
      - COMFYUI_BASE_URL=http://comfyui:8188
    depends_on:
      - comfyui
```

## Operational notes

- Server ComfyUI may need GPU setup depending on your deployment and model choices.
- SWARMSY does not install ComfyUI models, checkpoints, custom nodes, or GPU drivers.
- Ollama is separate from ComfyUI. Configure Ollama/model availability independently.
- Do not expose ComfyUI publicly without authentication, firewalling, or another trusted access-control layer.
- Do not configure public arbitrary ComfyUI URLs. Use Docker service names, localhost, host-gateway names, or private network addresses only.

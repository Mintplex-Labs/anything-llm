# OpenShift-compatible Dockerfile for AnythingLLM
# 
# This Dockerfile is specifically designed for OpenShift deployments which use
# arbitrary UIDs with GID 0 (root group). Do NOT use this for standard Docker
# or Docker Compose deployments - use the main docker/Dockerfile instead.
#
# Key differences from the standard Dockerfile:
# - User is added to supplementary group 0 (root) for OpenShift compatibility
# - All files are owned by group 0 and are group-writable (chmod g+w)
# - /etc/passwd is made group-writable for dynamic UID injection
# - Uses a modified entrypoint that handles arbitrary UID scenarios

# Setup base image
FROM ubuntu:noble-20251013 AS base

# Build arguments
ARG ARG_UID=1000
ARG ARG_GID=1000

FROM base AS build-arm64
RUN echo "Preparing build of AnythingLLM image for arm64 architecture"

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Install system dependencies
# hadolint ignore=DL3008,DL3013
RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -yq --no-install-recommends \
        unzip curl gnupg libgfortran5 libgbm1 tzdata netcat-openbsd \
        libasound2t64 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 \
        libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libx11-6 libx11-xcb1 libxcb1 \
        libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
        libxss1 libxtst6 ca-certificates fonts-liberation libappindicator3-1 libnss3 lsb-release \
        xdg-utils git build-essential ffmpeg && \
    mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && \
    # Install node and yarn
    apt-get install -yq --no-install-recommends nodejs && \
    curl -LO https://github.com/yarnpkg/yarn/releases/download/v1.22.19/yarn_1.22.19_all.deb \
        && dpkg -i yarn_1.22.19_all.deb \
        && rm yarn_1.22.19_all.deb && \
    # Install uvx (pinned to 0.6.10) for MCP support
    curl -LsSf https://astral.sh/uv/0.6.10/install.sh | sh && \
        mv /root/.local/bin/uv /usr/local/bin/uv && \
        mv /root/.local/bin/uvx /usr/local/bin/uvx && \
        echo "Installed uvx! $(uv --version)" && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a group and user with specific UID and GID.
# The user's primary group is ARG_GID (default 1000) for Docker/Compose backward compatibility.
# The user is also added to the root group (GID 0) as a supplementary group so that
# OpenShift's arbitrary-UID-with-GID-0 model works via group-writable permissions.
RUN (getent passwd "$ARG_UID" && userdel -f "$(getent passwd "$ARG_UID" | cut -d: -f1)") || true && \
    if [ "$ARG_GID" != "0" ]; then \
      (getent group "$ARG_GID" && groupdel "$(getent group "$ARG_GID" | cut -d: -f1)") || true && \
      groupadd -g "$ARG_GID" anythingllm && \
      useradd -l -u "$ARG_UID" -m -d /app -s /bin/bash -g anythingllm -G 0 anythingllm; \
    else \
      useradd -l -u "$ARG_UID" -m -d /app -s /bin/bash -g 0 anythingllm; \
    fi && \
    mkdir -p /app/frontend/ /app/server/ /app/collector/ /app/.cache /app/.yarn && \
    chown -R anythingllm:0 /app && \
    chmod -R g+w /app && \
    chmod g=u /etc/passwd

# Copy docker helper scripts (use OpenShift-specific entrypoint)
COPY ./cloud-deployments/openshift/docker-entrypoint.sh /usr/local/bin/
COPY ./docker/docker-healthcheck.sh /usr/local/bin/
COPY --chown=anythingllm:0 ./docker/.env.example /app/server/.env

# Ensure the scripts are executable
RUN chmod +x /usr/local/bin/docker-entrypoint.sh && \
    chmod +x /usr/local/bin/docker-healthcheck.sh

USER anythingllm
WORKDIR /app

# Puppeteer does not ship with an ARM86 compatible build for Chromium
# so web-scraping would be broken in arm docker containers unless we patch it
# by manually installing a compatible chromedriver.
RUN echo "Need to patch Puppeteer x Chromium support for ARM86 - installing dep!" && \
    curl -fSL https://webassets.anythingllm.com/chromium-1088-linux-arm64.zip -o chrome-linux.zip && \
    unzip chrome-linux.zip && \
    rm -rf chrome-linux.zip

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV CHROME_PATH=/app/chrome-linux/chrome
ENV PUPPETEER_EXECUTABLE_PATH=/app/chrome-linux/chrome

RUN echo "Done running arm64 specific installation steps"

#############################################

# amd64-specific stage
FROM base AS build-amd64
RUN echo "Preparing build of AnythingLLM image for non-ARM architecture"

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Install system dependencies
# hadolint ignore=DL3008,DL3013
RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -yq --no-install-recommends \
        curl gnupg libgfortran5 libgbm1 tzdata netcat-openbsd \
        libasound2t64 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 \
        libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libx11-6 libx11-xcb1 libxcb1 \
        libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
        libxss1 libxtst6 ca-certificates fonts-liberation libappindicator3-1 libnss3 lsb-release \
        xdg-utils git build-essential ffmpeg && \
    mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && \
    # Install node and yarn
    apt-get install -yq --no-install-recommends nodejs && \
    curl -LO https://github.com/yarnpkg/yarn/releases/download/v1.22.19/yarn_1.22.19_all.deb \
        && dpkg -i yarn_1.22.19_all.deb \
        && rm yarn_1.22.19_all.deb && \
    # Install uvx (pinned to 0.6.10) for MCP support
    curl -LsSf https://astral.sh/uv/0.6.10/install.sh | sh && \
        mv /root/.local/bin/uv /usr/local/bin/uv && \
        mv /root/.local/bin/uvx /usr/local/bin/uvx && \
        echo "Installed uvx! $(uv --version)" && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a group and user with specific UID and GID.
# The user's primary group is ARG_GID (default 1000) for Docker/Compose backward compatibility.
# The user is also added to the root group (GID 0) as a supplementary group so that
# OpenShift's arbitrary-UID-with-GID-0 model works via group-writable permissions.
RUN (getent passwd "$ARG_UID" && userdel -f "$(getent passwd "$ARG_UID" | cut -d: -f1)") || true && \
    if [ "$ARG_GID" != "0" ]; then \
      (getent group "$ARG_GID" && groupdel "$(getent group "$ARG_GID" | cut -d: -f1)") || true && \
      groupadd -g "$ARG_GID" anythingllm && \
      useradd -l -u "$ARG_UID" -m -d /app -s /bin/bash -g anythingllm -G 0 anythingllm; \
    else \
      useradd -l -u "$ARG_UID" -m -d /app -s /bin/bash -g 0 anythingllm; \
    fi && \
    mkdir -p /app/frontend/ /app/server/ /app/collector/ /app/.cache /app/.yarn && \
    chown -R anythingllm:0 /app && \
    chmod -R g+w /app && \
    chmod g=u /etc/passwd

# Copy docker helper scripts (use OpenShift-specific entrypoint)
COPY ./cloud-deployments/openshift/docker-entrypoint.sh /usr/local/bin/
COPY ./docker/docker-healthcheck.sh /usr/local/bin/
COPY --chown=anythingllm:0 ./docker/.env.example /app/server/.env

# Ensure the scripts are executable
RUN chmod +x /usr/local/bin/docker-entrypoint.sh && \
    chmod +x /usr/local/bin/docker-healthcheck.sh

#############################################
# COMMON BUILD FLOW FOR ALL ARCHS
#############################################

# hadolint ignore=DL3006
FROM build-${TARGETARCH} AS build
RUN echo "Running common build flow of AnythingLLM image for all architectures"

USER anythingllm
WORKDIR /app

# Install & Build frontend layer
# Use BUILDPLATFORM to run on the native host architecture (not emulated).
# This avoids esbuild crashing under QEMU when cross-compiling.
# The output (static HTML/CSS/JS) is platform-independent.
FROM --platform=$BUILDPLATFORM node:18-slim AS frontend-build
WORKDIR /app/frontend
COPY ./frontend/package.json ./frontend/yarn.lock ./
RUN yarn install --network-timeout 100000 && yarn cache clean
COPY ./frontend/ ./
RUN yarn build
WORKDIR /app

# Install server layer
# Also pull and build collector deps (chromium issues prevent bad bindings)
FROM build AS backend-build
COPY --chown=anythingllm:0 ./server /app/server/
WORKDIR /app/server
RUN yarn install --production --network-timeout 100000 && yarn cache clean
WORKDIR /app

# Install collector dependencies
COPY --chown=anythingllm:0 ./collector/ ./collector/
WORKDIR /app/collector
ENV PUPPETEER_DOWNLOAD_BASE_URL=https://storage.googleapis.com/chrome-for-testing-public
RUN yarn install --production --network-timeout 100000 && yarn cache clean

WORKDIR /app
USER anythingllm

# Since we are building from backend-build we just need to move built frontend into server/public
FROM backend-build AS production-build
WORKDIR /app
COPY --chown=anythingllm:0 --from=frontend-build /app/frontend/dist /app/server/public

# Ensure all app files are owned by group 0 (root) and group-writable so that:
# - Docker/Compose: access works via user ownership (UID match)
# - OpenShift: access works via group ownership (GID 0 match + g+w)
# - Generic Kubernetes: access works via user ownership or fsGroup
# This must run after all COPY and yarn install steps to cover node_modules, etc.
USER root
RUN chown -R anythingllm:0 /app && \
    chmod -R g+w /app && \
    mkdir -p /app/server/storage

# Setup the environment
ENV NODE_ENV=production
ENV ANYTHING_LLM_RUNTIME=docker
ENV DEPLOYMENT_VERSION=1.12.1
ENV HOME=/app

# Setup the healthcheck
HEALTHCHECK --interval=1m --timeout=10s --start-period=1m \
  CMD /bin/bash /usr/local/bin/docker-healthcheck.sh || exit 1

USER anythingllm

# Run the server
# CMD ["sh", "-c", "tail -f /dev/null"] # For development: keep container open
ENTRYPOINT ["/bin/bash", "/usr/local/bin/docker-entrypoint.sh"]

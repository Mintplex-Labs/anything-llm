# syntax=docker/dockerfile:1.6

############################
# Base (create user once)
############################
FROM ubuntu:jammy-20240627.1 AS base

ARG ARG_UID=1000
ARG ARG_GID=1000
ENV APP_UID=$ARG_UID
ENV APP_GID=$ARG_GID

# Create user/group ONCE and prep dirs (idempotent)
RUN set -eux; \
    getent group anythingllm >/dev/null || groupadd -g "$APP_GID" anythingllm; \
    id -u anythingllm >/dev/null 2>&1 || useradd -l -u "$APP_UID" -m -d /app -s /bin/bash -g anythingllm anythingllm; \
    mkdir -p /app/server /app/collector; \
    chown -R anythingllm:anythingllm /app

############################
# Arm64 deps
############################
FROM base AS build-arm64
RUN echo "Preparing build of AnythingLLM image for arm64 architecture"
SHELL ["/bin/bash","-o","pipefail","-c"]

# System deps + Node + Yarn + uvx
RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -yq --no-install-recommends \
      unzip curl gnupg libgfortran5 libgbm1 tzdata netcat \
      libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 \
      libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libx11-6 libx11-xcb1 libxcb1 \
      libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
      libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release \
      xdg-utils git build-essential ffmpeg && \
    mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" > /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && \
    apt-get install -yq --no-install-recommends nodejs && \
    curl -LO https://github.com/yarnpkg/yarn/releases/download/v1.22.19/yarn_1.22.19_all.deb && dpkg -i yarn_1.22.19_all.deb && rm -f yarn_1.22.19_all.deb && \
    curl -LsSf https://astral.sh/uv/0.6.10/install.sh | sh && \
      mv /root/.local/bin/uv /usr/local/bin/uv && \
      mv /root/.local/bin/uvx /usr/local/bin/uvx && \
      echo "Installed uvx: $(uv --version)" && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# ARM chromium patch (collector scraping support)
USER anythingllm
WORKDIR /app
RUN echo "Install ARM Chromium bundle for collector" && \
    curl -fsSL https://playwright.azureedge.net/builds/chromium/1088/chromium-linux-arm64.zip -o chrome-linux.zip && \
    unzip chrome-linux.zip && rm -f chrome-linux.zip
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    CHROME_PATH=/app/chrome-linux/chrome \
    PUPPETEER_EXECUTABLE_PATH=/app/chrome-linux/chrome
USER root

############################
# Amd64 deps
############################
FROM base AS build-amd64
RUN echo "Preparing build of AnythingLLM image for amd64 architecture"
SHELL ["/bin/bash","-o","pipefail","-c"]

RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -yq --no-install-recommends \
      curl gnupg libgfortran5 libgbm1 tzdata netcat \
      libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 \
      libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libx11-6 libx11-xcb1 libxcb1 \
      libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
      libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release \
      xdg-utils git build-essential ffmpeg && \
    mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" > /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && \
    apt-get install -yq --no-install-recommends nodejs && \
    curl -LO https://github.com/yarnpkg/yarn/releases/download/v1.22.19/yarn_1.22.19_all.deb && dpkg -i yarn_1.22.19_all.deb && rm -f yarn_1.22.19_all.deb && \
    curl -LsSf https://astral.sh/uv/0.6.10/install.sh | sh && \
      mv /root/.local/bin/uv /usr/local/bin/uv && \
      mv /root/.local/bin/uvx /usr/local/bin/uvx && \
      echo "Installed uvx: $(uv --version)" && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

############################
# Common build (select arch)
############################
FROM build-${TARGETARCH} AS build
RUN echo "Running common build flow for all architectures"
USER anythingllm
WORKDIR /app

# --- Server only ---
FROM build AS backend-build
COPY --chown=anythingllm:anythingllm ./server /app/server/
WORKDIR /app/server
RUN yarn install --production --network-timeout 100000 && yarn cache clean

# --- Collector only ---
FROM build AS collector-build
COPY --chown=anythingllm:anythingllm ./collector /app/collector/
WORKDIR /app/collector
ENV PUPPETEER_DOWNLOAD_BASE_URL=https://storage.googleapis.com/chrome-for-testing-public
RUN yarn install --production --network-timeout 100000 && yarn cache clean

############################
# Final image
############################
FROM build AS production-build
WORKDIR /app

# helper scripts
USER root
COPY ./docker/docker-entrypoint.sh /usr/local/bin/
COPY ./docker/docker-healthcheck.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh /usr/local/bin/docker-healthcheck.sh

# bring in built layers
COPY --from=backend-build   /app/server     /app/server
COPY --from=collector-build /app/collector  /app/collector
RUN chown -R anythingllm:anythingllm /app/server /app/collector
USER anythingllm

ENV NODE_ENV=production \
    ANYTHING_LLM_RUNTIME=docker

HEALTHCHECK --interval=1m --timeout=10s --start-period=1m \
  CMD /bin/bash /usr/local/bin/docker-healthcheck.sh || exit 1

ENTRYPOINT ["/bin/bash","/usr/local/bin/docker-entrypoint.sh"]
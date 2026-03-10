FROM ubuntu:noble-20251013 AS base

ARG ARG_UID=1000
ARG ARG_GID=1000

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -yq --no-install-recommends \
        unzip curl gnupg libgfortran5 libgbm1 tzdata netcat-openbsd supervisor \
        libasound2t64 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 \
        libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libx11-6 libx11-xcb1 libxcb1 \
        libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
        libxss1 libxtst6 ca-certificates fonts-liberation libappindicator3-1 libnss3 lsb-release \
        xdg-utils git build-essential ffmpeg && \
    mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && \
    apt-get install -yq --no-install-recommends nodejs && \
    curl -LO https://github.com/yarnpkg/yarn/releases/download/v1.22.19/yarn_1.22.19_all.deb && \
    dpkg -i yarn_1.22.19_all.deb && \
    rm yarn_1.22.19_all.deb && \
    curl -LsSf https://astral.sh/uv/0.6.10/install.sh | sh && \
    mv /root/.local/bin/uv /usr/local/bin/uv && \
    mv /root/.local/bin/uvx /usr/local/bin/uvx && \
    curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 \
      -o /usr/local/bin/cloudflared && \
    chmod +x /usr/local/bin/cloudflared && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN (getent passwd "$ARG_UID" && userdel -f "$(getent passwd "$ARG_UID" | cut -d: -f1)") || true && \
    (getent group "$ARG_GID" && groupdel "$(getent group "$ARG_GID" | cut -d: -f1)") || true && \
    groupadd -g "$ARG_GID" anythingllm && \
    useradd -l -u "$ARG_UID" -m -d /app -s /bin/bash -g anythingllm anythingllm && \
    mkdir -p /app/frontend /app/server /app/collector && \
    chown -R anythingllm:anythingllm /app

COPY ./docker/docker-healthcheck.sh /usr/local/bin/
COPY --chown=anythingllm:anythingllm ./docker/.env.example /app/server/.env

RUN chmod +x /usr/local/bin/docker-healthcheck.sh

USER anythingllm
WORKDIR /app

FROM --platform=$BUILDPLATFORM node:18-slim AS frontend-build
WORKDIR /app/frontend
COPY ./frontend/package.json ./frontend/yarn.lock ./
RUN yarn install --network-timeout 100000 && yarn cache clean
COPY ./frontend/ ./
RUN yarn build

FROM base AS backend-build
COPY --chown=anythingllm:anythingllm ./server /app/server/
WORKDIR /app/server
RUN yarn install --production --network-timeout 100000 && yarn cache clean

COPY --chown=anythingllm:anythingllm ./collector /app/collector/
WORKDIR /app/collector
ENV PUPPETEER_DOWNLOAD_BASE_URL=https://storage.googleapis.com/chrome-for-testing-public
RUN yarn install --production --network-timeout 100000 && yarn cache clean

FROM base AS production-build
WORKDIR /app
USER root

COPY --chown=anythingllm:anythingllm --from=frontend-build /app/frontend/dist /app/server/public
COPY --chown=anythingllm:anythingllm --from=backend-build /app/server /app/server
COPY --chown=anythingllm:anythingllm --from=backend-build /app/collector /app/collector

COPY ramsli-custom/supervisord.conf /etc/supervisor/conf.d/lovora.conf
COPY ramsli-custom/entrypoint.sh /usr/local/bin/lovora-entrypoint.sh

RUN mkdir -p /var/log/supervisor /collector /collector/hotdir && \
    chmod 755 /var/log/supervisor && \
    chmod +x /usr/local/bin/lovora-entrypoint.sh && \
    chown -R anythingllm:anythingllm /collector /app/collector

ENV NODE_ENV=production
ENV ANYTHING_LLM_RUNTIME=docker

HEALTHCHECK --interval=1m --timeout=10s --start-period=1m \
  CMD /bin/bash /usr/local/bin/docker-healthcheck.sh || exit 1

EXPOSE 3001

ENTRYPOINT ["/usr/local/bin/lovora-entrypoint.sh"]

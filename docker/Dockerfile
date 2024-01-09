# Setup base image
FROM ubuntu:jammy-20230522 AS base

ARG ARG_UID=1000
ARG ARG_GID=1000

FROM base AS build-arm64
RUN echo "Preparing build of AnythingLLM image for arm64 architecture"

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
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && \
    apt-get install -yq --no-install-recommends nodejs && \
    curl -LO https://github.com/yarnpkg/yarn/releases/download/v1.22.19/yarn_1.22.19_all.deb \
        && dpkg -i yarn_1.22.19_all.deb \
        && rm yarn_1.22.19_all.deb

# Create a group and user with specific UID and GID
RUN groupadd -g $ARG_GID anythingllm && \
    useradd -u $ARG_UID -m -d /app -s /bin/bash -g anythingllm anythingllm && \
    mkdir -p /app/frontend/ /app/server/ /app/collector/ && chown -R anythingllm:anythingllm /app

# Copy docker helper scripts
COPY ./docker/docker-entrypoint.sh /usr/local/bin/
COPY ./docker/docker-healthcheck.sh /usr/local/bin/
COPY --chown=anythingllm:anythingllm ./docker/.env.example /app/server/.env

# Ensure the scripts are executable
RUN chmod +x /usr/local/bin/docker-entrypoint.sh && \
    chmod +x /usr/local/bin/docker-healthcheck.sh

USER anythingllm
WORKDIR /app

# Puppeteer does not ship with an ARM86 compatible build for Chromium
# so web-scraping would be broken in arm docker containers unless we patch it
# by manually installing a compatible chromedriver.
RUN echo "Need to patch Puppeteer x Chromium support for ARM86 - installing dep!" && \
    curl https://playwright.azureedge.net/builds/chromium/1088/chromium-linux-arm64.zip -o chrome-linux.zip && \
    unzip chrome-linux.zip && \
    rm -rf chrome-linux.zip

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV CHROME_PATH=/app/chrome-linux/chrome
ENV PUPPETEER_EXECUTABLE_PATH=/app/chrome-linux/chrome

RUN echo "Done running arm64 specific installtion steps"

#############################################

# amd64-specific stage
FROM base AS build-amd64
RUN echo "Preparing build of AnythingLLM image for non-ARM architecture"

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
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && \
    apt-get install -yq --no-install-recommends nodejs && \
    curl -LO https://github.com/yarnpkg/yarn/releases/download/v1.22.19/yarn_1.22.19_all.deb \
        && dpkg -i yarn_1.22.19_all.deb \
        && rm yarn_1.22.19_all.deb

# Create a group and user with specific UID and GID
RUN groupadd -g $ARG_GID anythingllm && \
    useradd -u $ARG_UID -m -d /app -s /bin/bash -g anythingllm anythingllm && \
    mkdir -p /app/frontend/ /app/server/ /app/collector/ && chown -R anythingllm:anythingllm /app

# Copy docker helper scripts
COPY ./docker/docker-entrypoint.sh /usr/local/bin/
COPY ./docker/docker-healthcheck.sh /usr/local/bin/
COPY --chown=anythingllm:anythingllm ./docker/.env.example /app/server/.env

# Ensure the scripts are executable
RUN chmod +x /usr/local/bin/docker-entrypoint.sh && \
    chmod +x /usr/local/bin/docker-healthcheck.sh

#############################################
# COMMON BUILD FLOW FOR ALL ARCHS
#############################################
FROM build-${TARGETARCH} AS build
RUN echo "Running common build flow of AnythingLLM image for all architectures"

USER anythingllm
WORKDIR /app

# Install frontend dependencies
FROM build as frontend-deps

COPY ./frontend/package.json ./frontend/yarn.lock ./frontend/
RUN cd ./frontend/ && yarn install --network-timeout 100000 && yarn cache clean

# Install server dependencies
FROM build as server-deps
COPY ./server/package.json ./server/yarn.lock ./server/
RUN cd ./server/ && yarn install --production --network-timeout 100000 && yarn cache clean

# Compile Llama.cpp bindings for node-llama-cpp for this operating system.
USER root
RUN cd ./server && npx --no node-llama-cpp download
USER anythingllm

# Build the frontend
FROM frontend-deps as build-stage
COPY ./frontend/ ./frontend/
RUN cd ./frontend/ && yarn build && yarn cache clean

# Setup the server
FROM server-deps as production-stage
COPY --chown=anythingllm:anythingllm ./server/ ./server/

# Copy built static frontend files to the server public directory
COPY --from=build-stage /app/frontend/dist ./server/public

# Copy the collector
COPY --chown=anythingllm:anythingllm ./collector/ ./collector/

# Install collector dependencies
RUN cd /app/collector && yarn install --production --network-timeout 100000 && yarn cache clean

# Migrate and Run Prisma against known schema
RUN cd ./server && npx prisma generate --schema=./prisma/schema.prisma
RUN cd ./server && npx prisma migrate deploy --schema=./prisma/schema.prisma

# Setup the environment
ENV NODE_ENV=production
ENV ANYTHING_LLM_RUNTIME=docker

# Expose the server port
EXPOSE 3001

# Setup the healthcheck
HEALTHCHECK --interval=1m --timeout=10s --start-period=1m \
  CMD /bin/bash /usr/local/bin/docker-healthcheck.sh || exit 1

# Run the server
ENTRYPOINT ["/bin/bash", "/usr/local/bin/docker-entrypoint.sh"]
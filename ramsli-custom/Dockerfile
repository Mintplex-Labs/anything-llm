# Stage 1: Build the custom frontend
FROM node:18-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --network-timeout 100000 && yarn cache clean
COPY frontend/ ./
RUN yarn build

# Stage 2: Final image
FROM mintplexlabs/anythingllm:latest

USER root

# Install supervisor and curl
RUN apt-get update && apt-get install -y supervisor curl && rm -rf /var/lib/apt/lists/*

# Install cloudflared
RUN curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 \
    -o /usr/local/bin/cloudflared && chmod +x /usr/local/bin/cloudflared

# Copy supervisor config and entrypoint
COPY ramsli-custom/supervisord.conf /etc/supervisor/conf.d/lovora.conf
COPY ramsli-custom/entrypoint.sh /usr/local/bin/lovora-entrypoint.sh

# Overwrite pre-built frontend with our custom build
COPY --from=frontend-build /app/frontend/dist /app/server/public

# Create log dir and set permissions
RUN mkdir -p /var/log/supervisor && chmod 755 /var/log/supervisor && \
    chmod +x /usr/local/bin/lovora-entrypoint.sh
    mkdir -p /collector/hotdir && \
    chown -R anythingllm:anythingllm /collector

EXPOSE 3001

ENTRYPOINT ["/usr/local/bin/lovora-entrypoint.sh"]

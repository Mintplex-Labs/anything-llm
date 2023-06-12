# Setup base image
FROM ubuntu:jammy-20230522 AS base

# Install system dependencies
RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -yq --no-install-recommends \
    curl libgfortran5 python3 python3-pip tzdata netcat \
    libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 \
    libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libx11-6 libx11-xcb1 libxcb1 \
    libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
    libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release \
    xdg-utils && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -yq --no-install-recommends nodejs && \
    curl -LO https://github.com/yarnpkg/yarn/releases/download/v1.22.19/yarn_1.22.19_all.deb \
        && dpkg -i yarn_1.22.19_all.deb \
        && rm yarn_1.22.19_all.deb && \
    rm -rf /var/lib/apt/lists/* && \
    dpkg-reconfigure -f noninteractive tzdata && \
    python3 -m pip install virtualenv

WORKDIR /app

# Install frontend dependencies
FROM base as frontend-deps

COPY ./frontend/package.json ./frontend/yarn.lock ./
RUN yarn install

# Install server dependencies
FROM base as server-deps
COPY ./server/package.json ./server/yarn.lock ./
RUN yarn install --production

# Build the frontend
FROM frontend-deps as build-stage
COPY ./frontend/ .
RUN yarn build

# Setup the server
FROM server-deps as production-stage
COPY ./server/ ./server/

# Copy built static frontend files to the server public directory
COPY --from=build-stage /app/dist ./server/public

# Copy the collector
COPY ./collector/ ./collector/

# Install collector dependencies
RUN cd /app/collector && \
    python3 -m virtualenv v-env && \
    . v-env/bin/activate && \
    pip install -r requirements.txt

# Setup the environment
ENV NODE_ENV=production
ENV PATH=/app/collector/v-env/bin:$PATH

# Copy the docker entrypoint and healthcheck scripts
COPY ./docker/docker-entrypoint.sh /usr/local/bin/
COPY ./docker/docker-healthcheck.sh /usr/local/bin/

# Expose the server port
EXPOSE 3001

# Setup the healthcheck
HEALTHCHECK --interval=1m --timeout=10s --start-period=1m \
  CMD /bin/bash /usr/local/bin/docker-healthcheck.sh || exit 1

# Run the server
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "/app/server/index.js"]

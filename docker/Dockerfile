# Setup base image
FROM ubuntu:jammy-20230522 AS base

# Install system dependencies
RUN apt-get update && \
    apt-get install -y \
    curl \
    libgfortran5 \
    && rm -rf /var/lib/apt/lists/*

# Install node
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Install yarn
RUN curl -LO https://github.com/yarnpkg/yarn/releases/download/v1.22.19/yarn_1.22.19_all.deb \
    && dpkg -i yarn_1.22.19_all.deb \
    && rm yarn_1.22.19_all.deb

# Install frontend dependencies
FROM base as frontend-deps

WORKDIR /app
COPY ./frontend/package.json ./frontend/yarn.lock ./
RUN yarn install

# Install server dependencies
FROM base as server-deps
WORKDIR /app
COPY ./server/package.json ./server/yarn.lock ./
RUN yarn install --production

# Build the frontend
FROM frontend-deps as build-stage
COPY ./frontend/ .
RUN yarn build

# Setup the server
FROM server-deps as production-stage
COPY ./server/ . 

# Copy built static frontend files to the server public directory
COPY --from=build-stage /app/dist ./public 

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "index.js"]

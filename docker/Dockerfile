# Stage 1: Install frontend dependencies
FROM node:18.13.0 as frontend-deps
WORKDIR /app
COPY ./frontend/package.json ./frontend/yarn.lock ./
RUN yarn install

# Stage 2: Install server dependencies
FROM node:18.13.0 as server-deps
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    openssl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY ./server/package.json ./server/yarn.lock ./
RUN yarn install --production

# Stage 3: Build the frontend
FROM frontend-deps as build-stage
COPY ./frontend/ .
RUN yarn build

# Stage 4: Setup the server
FROM server-deps as production-stage
COPY ./server/ . 

# Copy built static frontend files to the server public directory
COPY --from=build-stage /app/dist ./public 

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "index.js"]

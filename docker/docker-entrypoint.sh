#!/bin/bash

set -euo pipefail

# Check if STORAGE_DIR is set
if [ -z "${STORAGE_DIR:-}" ]; then
  echo "================================================================"
  echo "⚠️  ⚠️  ⚠️  WARNING: STORAGE_DIR environment variable is not set! ⚠️  ⚠️  ⚠️"
  echo ""
  echo "Not setting this will result in data loss on container restart since"
  echo "the application will not have a persistent storage location."
  echo "It can also result in weird errors in various parts of the application."
  echo ""
  echo "Please run the container with the official docker command at"
  echo "https://docs.anythingllm.com/installation-docker/quickstart"
  echo ""
  echo "⚠️  ⚠️  ⚠️  WARNING: STORAGE_DIR environment variable is not set! ⚠️  ⚠️  ⚠️"
  echo "================================================================"
fi

cd /app/server
npx prisma generate --schema=./prisma/schema.prisma
npx prisma migrate deploy --schema=./prisma/schema.prisma

node /app/server/index.js &
SERVER_PID=$!

if [ "${DISABLE_COLLECTOR:-false}" != "true" ]; then
  node /app/collector/index.js &
  COLLECTOR_PID=$!
else
  COLLECTOR_PID=""
fi

cleanup() {
  if kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    kill "$SERVER_PID"
  fi

  if [ -n "${COLLECTOR_PID}" ] && kill -0 "$COLLECTOR_PID" >/dev/null 2>&1; then
    kill "$COLLECTOR_PID"
  fi
}

trap cleanup SIGINT SIGTERM

wait $SERVER_PID
SERVER_EXIT=$?

if [ -n "${COLLECTOR_PID}" ]; then
  wait "$COLLECTOR_PID" || true
fi

exit "$SERVER_EXIT"
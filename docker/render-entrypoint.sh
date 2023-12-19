#!/bin/bash
# This is the entrypoint for Render.com docker builds. Do not use for targeting
# in other service docker builds

# Copy pre-built assets into storage dir.
cp -r /app/server/storage/assets/ "$STORAGE_DIR/assets"
mkdir -p "$STORAGE_DIR/documents/custom-documents"
mkdir -p "$STORAGE_DIR/models"
mkdir -p "$STORAGE_DIR/vector-cache"
mkdir -p "$STORAGE_DIR/assets"
touch "$STORAGE_DIR/anythingllm.db"

{ cd /app/server/ &&\
  npx prisma generate --schema=./prisma/schema.prisma &&\
  npx prisma migrate deploy --schema=./prisma/schema.prisma &&\
  node /app/server/index.js
} &
{ node /app/collector/index.js; } &
wait -n
exit $?
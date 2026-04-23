#!/bin/bash

# Check if STORAGE_DIR is set
if [ -z "$STORAGE_DIR" ]; then
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

# Fix storage permissions as root BEFORE dropping privileges
STORAGE="${STORAGE_DIR:-/app/server/storage}"
if [ "$(id -u)" = "0" ]; then
  echo "[entrypoint] Running as root — fixing storage permissions..."
  chown -R anythingllm:anythingllm "$STORAGE" 2>/dev/null || true
  # Also fix any WAL/SHM files
  chown anythingllm:anythingllm "$STORAGE"/anythingllm.db* 2>/dev/null || true
fi

{
  cd /app/server/ &&

    # Legacy check for non-root containers (kept for backwards compatibility)
    DB_PATH="${STORAGE_DIR:-/app/server/storage}/anythingllm.db"
    if [ -f "$DB_PATH" ] && [ ! -w "$DB_PATH" ]; then
      echo "[entrypoint] ⚠️  DB file is not writable — fixing ownership..."
      chown "$(id -u):$(id -g)" "$DB_PATH" 2>/dev/null || true
    fi

    # Disable Prisma CLI telemetry (https://www.prisma.io/docs/orm/tools/prisma-cli#how-to-opt-out-of-data-collection)
    export CHECKPOINT_DISABLE=1 &&
    npx prisma generate --schema=./prisma/schema.prisma &&

    # Run migrations — if deploy fails (e.g. column already exists from manual ALTER),
    # auto-resolve failed migrations and retry once.
    if ! npx prisma migrate deploy --schema=./prisma/schema.prisma 2>&1; then
      echo "[entrypoint] ⚠️  prisma migrate deploy failed — attempting auto-resolve..."
      DB_PATH="${STORAGE_DIR:-/app/server/storage}/anythingllm.db"
      if [ -f "$DB_PATH" ]; then
        # Find failed migrations (finished_at is NULL) and mark them as applied
        FAILED=$(sqlite3 "$DB_PATH" "SELECT migration_name FROM _prisma_migrations WHERE finished_at IS NULL OR finished_at = '';" 2>/dev/null)
        if [ -n "$FAILED" ]; then
          NOW_MS=$(date +%s)000
          for MIG in $FAILED; do
            echo "[entrypoint] Marking migration '$MIG' as applied..."
            sqlite3 "$DB_PATH" "UPDATE _prisma_migrations SET finished_at = $NOW_MS, rolled_back_at = NULL, applied_steps_count = 1, logs = NULL WHERE migration_name = '$MIG';"
          done
          echo "[entrypoint] Retrying prisma migrate deploy..."
          npx prisma migrate deploy --schema=./prisma/schema.prisma
        else
          echo "[entrypoint] ❌ No failed migrations found — unknown error"
          exit 1
        fi
      else
        echo "[entrypoint] ❌ DB not found at $DB_PATH — cannot auto-resolve"
        exit 1
      fi
    fi &&

    # Drop to anythingllm user if running as root
    if [ "$(id -u)" = "0" ] && command -v gosu >/dev/null 2>&1; then
      exec gosu anythingllm node /app/server/index.js
    else
      node /app/server/index.js
    fi
} &
{
  if [ "$(id -u)" = "0" ] && command -v gosu >/dev/null 2>&1; then
    gosu anythingllm node /app/collector/index.js
  else
    node /app/collector/index.js
  fi
} &
wait -n
exit $?
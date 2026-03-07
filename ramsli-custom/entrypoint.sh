#!/bin/bash
set -e

# Fix workspace permissions on every boot
if [ -d /workspace ]; then
    chown -R anythingllm:anythingllm /workspace 2>/dev/null || true
fi

# ── Persist collector hotdir on /workspace ────────────────────────────────────
# The server and collector reference different hotdir paths; both must resolve
# to the same persistent location on RunPod.
mkdir -p /workspace/hotdir /collector /app/collector
rm -rf /collector/hotdir /app/collector/hotdir
ln -s /workspace/hotdir /collector/hotdir
ln -s /workspace/hotdir /app/collector/hotdir
chown -R anythingllm:anythingllm /collector /app/collector /workspace/hotdir 2>/dev/null || true
echo "[entrypoint] collector hotdirs -> /workspace/hotdir"

# ── Persist SQLite DB on /workspace ──────────────────────────────────────────
DB_CONTAINER="/app/server/storage/anythingllm.db"
DB_VOLUME="/workspace/anythingllm.db"

# Remove dangling symlink if present
if [ -L "$DB_CONTAINER" ] && [ ! -e "$DB_CONTAINER" ]; then
    rm "$DB_CONTAINER"
fi

if [ -f "$DB_VOLUME" ] && [ ! -L "$DB_CONTAINER" ]; then
    # Volume has a saved DB — replace container copy with symlink
    rm -f "$DB_CONTAINER"
    ln -s "$DB_VOLUME" "$DB_CONTAINER"
    echo "[entrypoint] Restored DB from volume"
elif [ ! -f "$DB_VOLUME" ] && [ ! -L "$DB_CONTAINER" ] && [ -f "$DB_CONTAINER" ]; then
    # First boot — move container DB to volume and symlink
    mv "$DB_CONTAINER" "$DB_VOLUME"
    ln -s "$DB_VOLUME" "$DB_CONTAINER"
    echo "[entrypoint] Moved DB to volume and linked"
elif [ ! -L "$DB_CONTAINER" ]; then
    # No DB anywhere yet — symlink (Prisma will create it on volume)
    ln -s "$DB_VOLUME" "$DB_CONTAINER"
    echo "[entrypoint] Pre-linked DB to volume"
else
    echo "[entrypoint] DB symlink already in place"
fi

exec /usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf

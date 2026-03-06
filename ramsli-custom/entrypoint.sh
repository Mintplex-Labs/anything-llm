#!/bin/bash
set -e

# Fix workspace permissions on every boot
if [ -d /workspace ]; then
    chown -R anythingllm:anythingllm /workspace 2>/dev/null || true
fi

DB_CONTAINER="/app/server/storage/anythingllm.db"
DB_VOLUME="/workspace/anythingllm.db"

# Remove any dangling symlink first
if [ -L "$DB_CONTAINER" ] && [ ! -e "$DB_CONTAINER" ]; then
    rm "$DB_CONTAINER"
fi

if [ -f "$DB_VOLUME" ] && [ ! -L "$DB_CONTAINER" ]; then
    # Volume has a real DB — replace container copy with symlink
    rm -f "$DB_CONTAINER"
    ln -s "$DB_VOLUME" "$DB_CONTAINER"
    echo "[entrypoint] Linked DB from volume: $DB_VOLUME"
elif [ ! -f "$DB_VOLUME" ] && [ ! -L "$DB_CONTAINER" ] && [ -f "$DB_CONTAINER" ]; then
    # First boot with a real DB in container — move it to volume and symlink
    mv "$DB_CONTAINER" "$DB_VOLUME"
    ln -s "$DB_VOLUME" "$DB_CONTAINER"
    echo "[entrypoint] Moved DB to volume and linked: $DB_VOLUME"
elif [ ! -L "$DB_CONTAINER" ]; then
    # No DB anywhere yet — just symlink (Prisma will create it on volume)
    ln -s "$DB_VOLUME" "$DB_CONTAINER"
    echo "[entrypoint] Pre-linked DB to volume: $DB_VOLUME"
else
    echo "[entrypoint] DB symlink already in place -> $DB_VOLUME"
fi

exec /usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf

#!/bin/bash
# This is the entrypoint for Render.com docker builds. Do not use for targeting
# in other service docker builds

if test -f "$STORAGE_DIR/.env"; then
    export $(xargs < "$STORAGE_DIR/.env")
    echo $STORAGE_DIR

    # Copy pre-built assets into storage dir.
    cp -r /app/server/storage/assets/ "$STORAGE_DIR/assets"
fi

{ cd /app/server/ &&\
  npx prisma generate --schema=./prisma/schema.prisma &&\
  npx prisma migrate deploy --schema=./prisma/schema.prisma &&\
  node /app/server/index.js
} &
{ node /app/collector/index.js; } &
wait -n
exit $?
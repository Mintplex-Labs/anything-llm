#!/bin/bash

# OpenShift runs containers with an arbitrary UID that may not exist in /etc/passwd.
# Many tools (npm, prisma, git, etc.) expect a passwd entry for the running user.
# If the current UID has no entry, dynamically add one using nss_wrapper-style injection.
if ! whoami &> /dev/null 2>&1; then
  if [ -w /etc/passwd ]; then
    echo "anythingllm:x:$(id -u):0:AnythingLLM User:/app:/bin/bash" >> /etc/passwd
  fi
fi
export HOME=/app

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

{
  cd /app/server/ &&
    # Disable Prisma CLI telemetry (https://www.prisma.io/docs/orm/tools/prisma-cli#how-to-opt-out-of-data-collection)
    export CHECKPOINT_DISABLE=1 &&
    npx prisma generate --schema=./prisma/schema.prisma &&
    npx prisma migrate deploy --schema=./prisma/schema.prisma &&
    node /app/server/index.js
} &
{ node /app/collector/index.js; } &
wait -n
exit $?

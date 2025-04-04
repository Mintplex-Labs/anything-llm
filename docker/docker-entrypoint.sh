#!/bin/bash

if [ ! -z "${UID}" ]; then
  if [ ! "$(id -u anythingllm)" -eq "${UID}" ]; then
    usermod -o -u "${UID}" anythingllm
  fi
fi

if [ ! -z "${GID}" ]; then
  if [ ! "$(id -g anythingllm)" -eq "${GID}" ]; then
    groupmod -g "${GID}" anythingllm
  fi
fi

chown -R anythingllm:anythingllm /app
chown -R anythingllm:anythingllm "${STORAGE_DIR}"

gosu anythingllm bash -c "cd /app/server && npx prisma generate --schema=./prisma/schema.prisma && npx prisma migrate deploy --schema=./prisma/schema.prisma && node /app/server/index.js" &

gosu anythingllm bash -c "node /app/collector/index.js" &

wait -n
exit $?
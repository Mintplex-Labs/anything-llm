#!/bin/bash
{ cd /app/server/ &&\
  npx prisma generate --schema=./prisma/schema.prisma &&\
  npx prisma migrate deploy --schema=./prisma/schema.prisma &&\
  node /app/server/index.js
} &
{ cd /app/collector/ &&\
  node /app/server/index.js
 } &
wait -n
exit $?
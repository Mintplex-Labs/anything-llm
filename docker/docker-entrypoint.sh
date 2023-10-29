#!/bin/bash
{ cd /app/server/ &&\
  npx prisma generate --schema=./prisma/schema.prisma &&\
  npx prisma migrate deploy --schema=./prisma/schema.prisma &&\
  node /app/server/index.js
} &
{ FLASK_ENV=production FLASK_APP=wsgi.py cd collector && gunicorn --timeout 300 --workers 4 --bind 0.0.0.0:8888 wsgi:api; } &
wait -n
exit $?
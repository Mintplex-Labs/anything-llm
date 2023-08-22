#!/bin/bash
if test -f "$STORAGE_DIR/.env"; then
    export $(xargs < "$STORAGE_DIR/.env")
    echo $STORAGE_DIR
    echo $VECTOR_DB
fi

node /app/server/index.js &
{ FLASK_ENV=production FLASK_APP=wsgi.py cd collector && gunicorn --timeout 300 --workers 4 --bind 0.0.0.0:8888 wsgi:api; } &
wait -n
exit $?
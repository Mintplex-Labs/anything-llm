#!/bin/bash

# The container is only healthy when both the server and the collector respond.
# The server boots with `process.env.SERVER_PORT || 3001`, so check the same port it is listening on
server=$(curl --max-time 4 --write-out '%{http_code}' --silent --output /dev/null "http://localhost:${SERVER_PORT:-3001}/api/ping")
# The collector boots on COLLECTOR_PORT and falls back to 8888 when it is unset or empty
collector=$(curl --max-time 4 --write-out '%{http_code}' --silent --output /dev/null "http://localhost:${COLLECTOR_PORT:-8888}/accepts")

if [ "$server" -ne 200 ]; then
  echo "Server is down"
  exit 1
fi

if [ "$collector" -ne 200 ]; then
  echo "Collector is down"
  exit 1
fi

echo "Server and collector are up"
exit 0

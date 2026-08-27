#!/bin/bash

# Send a request to the specified URL
# The server boots with `process.env.SERVER_PORT || 3001`, so check the same port it is listening on
response=$(curl --write-out '%{http_code}' --silent --output /dev/null "http://localhost:${SERVER_PORT:-3001}/api/ping")

# If the HTTP response code is 200 (OK), the server is up
if [ "$response" -eq 200 ]; then
  echo "Server is up"
  exit 0
else
  echo "Server is down"
  exit 1
fi

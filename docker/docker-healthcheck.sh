#!/bin/bash

# Send a request to the specified URL
response=$(curl --write-out '%{http_code}' --silent --output /dev/null http://localhost:3001/api/ping)

# If the HTTP response code is 200 (OK), the server is up
if [ "$response" -eq 200 ]; then
  echo "Server is up"
  exit 0
else
  echo "Server is down"
  exit 1
fi

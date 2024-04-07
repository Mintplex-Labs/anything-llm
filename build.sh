#!/bin/bash

docker buildx create --use

docker buildx build --push \
--platform linux/amd64,linux/arm64 -f docker/Dockerfile \
--tag  tribehealth/anything-llm:v0.0.1 .

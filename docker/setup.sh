#!/bin/bash

# 設定錯誤時停止腳本
set -e

echo "🛠 啟動 Docker BuildKit 並建構映像..."
DOCKER_BUILDKIT=1 docker-compose build --progress=auto

echo "🚀 啟動 AnythingLLM Docker 容器（背景執行）..."
docker-compose up -d

echo "✅ 完成！你可以在 http://localhost:3001 上存取 AnythingLLM"
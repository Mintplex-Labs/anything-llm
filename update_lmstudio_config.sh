#!/bin/bash

# Update LM Studio LLM Provider configuration
echo "Updating LM Studio LLM Provider configuration..."

# Comment out all other LLM providers
sed -i '' 's/^LLM_PROVIDER=/# LLM_PROVIDER=/g' server/.env.development

# Uncomment and configure LM Studio LLM provider
sed -i '' 's/^# LLM_PROVIDER=.*lmstudio.*$/LLM_PROVIDER=lmstudio/g' server/.env.development
sed -i '' 's/^# LMSTUDIO_BASE_PATH=.*$/LMSTUDIO_BASE_PATH=http:\/\/localhost:1234\/v1/g' server/.env.development
sed -i '' 's/^# LMSTUDIO_MODEL_PREF=.*$/LMSTUDIO_MODEL_PREF=qwen2.5-0.5b-instruct-mlx/g' server/.env.development
sed -i '' 's/^# LMSTUDIO_MODEL_TOKEN_LIMIT=.*$/LMSTUDIO_MODEL_TOKEN_LIMIT=4096/g' server/.env.development

# Configure LM Studio Embedding Engine
echo "Updating LM Studio Embedding Engine configuration..."

# Comment out all other embedding engines
sed -i '' 's/^EMBEDDING_ENGINE=/# EMBEDDING_ENGINE=/g' server/.env.development

# Uncomment and configure LM Studio embedding engine
sed -i '' 's/^# EMBEDDING_ENGINE=.*lmstudio.*$/EMBEDDING_ENGINE=lmstudio/g' server/.env.development
sed -i '' 's/^# EMBEDDING_BASE_PATH=.*https:\/\/localhost:1234\/v1.*$/EMBEDDING_BASE_PATH=http:\/\/localhost:1234\/v1/g' server/.env.development
sed -i '' 's/^# EMBEDDING_MODEL_PREF=.*nomic-ai\/nomic-embed-text-v1.5-GGUF.*$/EMBEDDING_MODEL_PREF=text-embedding-nomic-embed-text-v1.5/g' server/.env.development
sed -i '' 's/^# EMBEDDING_MODEL_MAX_CHUNK_LENGTH=.*8192.*$/EMBEDDING_MODEL_MAX_CHUNK_LENGTH=8192/g' server/.env.development

echo "Configuration updated successfully!"
echo "LLM Provider: LM Studio with qwen2.5-0.5b-instruct-mlx"
echo "Embedding Engine: LM Studio with text-embedding-nomic-embed-text-v1.5" 
# Migration Notes - Ollama Embedding Models Support

## Overview
This document outlines the improvements made to Ollama embedding model support in AnythingLLM.

## What Changed
**If you previously only saw BERT models or limited embedding model options, upgrade to commit 2c19dd09 or later.**

### Commit Reference
- **Key Commit**: `2c19dd09` - "Native Embedder model selection (incl: Multilingual support)"
- **Date**: Recent (refer to git log for exact timestamp)

### Improvements Made
1. **Enhanced Model Discovery**: Improved embedding model detection and listing
2. **Multilingual Support**: Better support for non-English embedding models  
3. **Expanded Model Coverage**: Support for more embedding model types beyond basic BERT models

## Supported Ollama Embedding Models
The following popular Ollama embedding models are now fully supported:

- **`nomic-embed-text`** - High-quality text embeddings (recommended)
  ```bash
  curl ollama pull nomic-embed-text
  ```

- **`all-minilm`** - Lightweight and fast embeddings
  ```bash
  curl ollama pull all-minilm
  ```

- **`mxbai-embed-large`** - Large context embeddings
  ```bash
  curl ollama pull mxbai-embed-large
  ```

- **`snowflake-arctic-embed`** - Optimized for retrieval tasks
  ```bash
  curl ollama pull snowflake-arctic-embed
  ```

## Migration Steps

### For New Installations
1. Install AnythingLLM at commit `2c19dd09` or later
2. Set up Ollama with your preferred embedding model:
   ```bash
   curl ollama pull nomic-embed-text
   ```
3. Configure AnythingLLM to use Ollama embeddings
4. Select your model from the available options

### For Existing Installations
1. Update to the latest version (post-`2c19dd09`)
2. If you were using manual configuration, the new version should automatically detect available models
3. Verify your embedding model selection in the AnythingLLM settings

## Environment Variables
The following environment variables are relevant for Ollama embeddings:

```bash
EMBEDDING_ENGINE=ollama
EMBEDDING_BASE_PATH=http://localhost:11434
EMBEDDING_MODEL_PREF=nomic-embed-text  # Your chosen model
```

## Troubleshooting
- **Empty model dropdown**: Ensure Ollama is running and models are pulled
- **Connection issues**: Verify `EMBEDDING_BASE_PATH` points to your Ollama instance
- **Model not found**: Use `ollama list` to confirm the model is available locally

## Benefits of This Update
- ✅ Automatic model discovery from Ollama
- ✅ Support for multilingual embedding models
- ✅ Improved performance with specialized embedding models
- ✅ Better integration with Ollama ecosystem

## For Developers
If you're contributing to AnythingLLM's Ollama integration:
- Review the changes in `/server/utils/EmbeddingEngines/ollama/index.js`
- Model discovery logic has been enhanced
- Test with multiple embedding models to ensure compatibility

---

**Need help?** Check the [Ollama embedding documentation](server/utils/AiProviders/ollama/README.md) or join our [Discord community](https://discord.gg/6UyHPeGZAC).

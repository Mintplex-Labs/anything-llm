# SPARKY Model & Provider Troubleshooting

## Baseline local starter recommendation

AnythingLLM + Ollama + one chat model + one embedding model.

## Troubleshooting matrix

### No LLM provider
- Diagnose: No chat engine configured.
- User terms: "The brain is offline."
- Recovery: Configure local Ollama or cloud provider and test response.

### No embedder
- Diagnose: Retrieval engine missing.
- User terms: "The brain is running, but the memory search is not."
- Recovery: Configure embedding provider/model and re-index docs.

### Ollama not running
- Diagnose: Local runtime unavailable.
- User terms: "Local engine is selected, but the local server is not running."
- Recovery: Start Ollama service, verify model availability, retest.

### Model too weak
- Diagnose: Model cannot sustain task quality.
- User terms: "Your model responds, but it’s underpowered for this workload."
- Recovery: Move to stronger local/cloud model.

### Embeddings not configured
- Diagnose: Docs cannot become searchable memory.
- User terms: "The chat model is available, but the document embedder is missing."
- Recovery: Set embedder provider + model, then re-ingest.

### Document search not working
- Diagnose: Ingestion/index mismatch.
- User terms: "The HIVE has docs on disk, but they are not ingested into project memory yet."
- Recovery: Verify ingestion status, re-index, confirm source citations appear.

### Cloud API key missing
- Diagnose: Cloud provider auth missing.
- User terms: "Cloud engine is selected, but the access key is missing or invalid."
- Recovery: Add valid API key and run a test prompt.

### Web unavailable
- Diagnose: Current research path unavailable.
- User terms: "Live web lane is unavailable right now."
- Recovery: Use project docs/offline reasoning, ask user for manual source links.

### Response too generic
- Diagnose: Wrong prompt/profile/docs lane.
- User terms: "SPARKY doctrine is not fully active in this lane."
- Recovery: Verify workspace prompt, profile, and required docs are loaded.

### Slow local model
- Diagnose: Resource bottleneck.
- User terms: "The engine is working but slow on this hardware/model size."
- Recovery: Reduce model size, simplify context, or switch provider.

### Context too large
- Diagnose: Prompt exceeds efficient context use.
- User terms: "Too much context at once is diluting quality and speed."
- Recovery: Split tasks, summarize memory lock, and route by lane.

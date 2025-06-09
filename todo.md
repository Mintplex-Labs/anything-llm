Hybrid Search – Remaining Tasks

Branch: feat/hybrid-search-bm25-milvus

⸻

1  Milvus Adapter Updates
•	Import BM25Index into Milvus adapter.
•	Index lexical chunks in addDocumentToNamespace() via BM25Index.indexChunks().
•	Purge lexical docs inside deleteDocumentFromNamespace() and delete-namespace.

2  Hybrid Orchestrator
•	Create utils/search/hybridSearch.js.
•	Implement fusion (weighted-sum or RRF) and score normalisation.
•	Expose hybridSearch(params) matching the old return shape.

3  Chat Endpoint Wiring
•	Replace direct Milvus.performSimilaritySearch() with hybridSearch().
•	Pass configurable weights/k from request → fusion layer.

4  BM25 Index Module Polish
•	Optimise save/load (consider async file I/O & gzip).
•	Provide method to delete individual chunk IDs (not whole namespace).

5  Testing
•	Unit tests for BM25Index (index, search, delete).
•	Integration test: dense + lexical fusion ordering.
•	Regression test for chat Endpoint with hybrid search.

6  Performance & Tuning
•	Benchmark memory footprint of BM25 JSON dumps.
•	Tune fusion weights (λ) on a sample log dataset.
•	Stress-test namespace with ≥100k chunks.

7  Developer Docs
•	Update README with hybrid architecture diagram.
•	Document new ENV vars (STORAGE_DIR/bm25, fusion weights).
•	Add example curl for the new search endpoint.

8  CI / CD
•	Add lint + test jobs for new modules.
•	Update Dockerfile to include wink-bm25 & wink-nlp deps.

9  Clean-up
•	Fix “unknown model class ‘gte’” log (swap to real model ID).
•	Remove any unused debug console.logs before merge.

⸻

Keep this list updated as tasks are completed or new items emerge during QA.

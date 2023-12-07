## Native models used by AnythingLLM

This folder is specifically created as a local cache and storage folder that is used for native models that can run on a CPU.

Currently, AnythingLLM uses this folder for the following parts of the application.

### Embedding
When your embedding engine preference is `native` we will use the ONNX **all-MiniLM-L6-v2** model built by [Xenova on HuggingFace.co](https://huggingface.co/Xenova/all-MiniLM-L6-v2). This model is a quantized and WASM version of the popular [all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) which produces a 384-dimension vector.

If you are using the `native` embedding engine your vector database should be configured to accept 384-dimension models if that parameter is directly editable (Pinecone only).

### Text generation (LLM selection)
_in progress_
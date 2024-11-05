# Native models used by Raiqa Assistant

This folder is specifically created as a local cache and storage folder that is used for native models that can run on a CPU.

Currently, Raiqa Assistant uses this folder for the following parts of the application.

## Embedding
When your embedding engine preference is `native` we will use the ONNX **all-MiniLM-L6-v2** model built by [Xenova on HuggingFace.co](https://huggingface.co/Xenova/all-MiniLM-L6-v2). This model is a quantized and WASM version of the popular [all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) which produces a 384-dimension vector.

If you are using the `native` embedding engine your vector database should be configured to accept 384-dimension models if that parameter is directly editable (Pinecone only).

## Audio/Video transcription
Raiqa Assistant allows you to upload various audio and video formats as source documents. In all cases the audio tracks will be transcribed by a locally running ONNX model **whisper-small** built by [Xenova on HuggingFace.co](https://huggingface.co/Xenova/whisper-small). The model is a smaller version of the OpenAI Whisper model. Given the model runs locally on CPU, larger files will result in longer transcription times.

Once transcribed you can embed these transcriptions into your workspace like you would any other file!

**Other external model/transcription providers are also live.**
- [OpenAI Whisper via API key.](https://openai.com/research/whisper)

## Text generation (LLM selection)
> [!IMPORTANT]
> Use of a locally running LLM model is **experimental** and may behave unexpectedly, crash, or not function at all.
> We suggest for production-use of a local LLM model to use a purpose-built inference server like [LocalAI](https://localai.io) or [LMStudio](https://lmstudio.ai).

> [!TIP]
> We recommend at _least_ using a 4-bit or 5-bit quantized model for your LLM. Lower quantization models tend to
> just output unreadable garbage.

If you would like to use a local Llama compatible LLM model for chatting you can select any model from this [HuggingFace search filter](https://huggingface.co/models?pipeline_tag=text-generation&library=gguf&other=text-generation-inference&sort=trending)

**Requirements**
- Model must be in the latest `GGUF` format
- Model should be compatible with latest `llama.cpp`
- You should have the proper RAM to run such a model. Requirement depends on model size.

### Where do I put my GGUF model?
> [!IMPORTANT]
> If running in Docker you should be running the container to a mounted storage location on the host machine so you
> can update the storage files directly without having to re-download or re-build your docker container. [See suggested Docker config](../../../README.md#recommended-usage-with-docker-easy)

> [!NOTE]
> `/server/storage/models/downloaded` is the default location that your model files should be at.
> Your storage directory may differ if you changed the STORAGE_DIR environment variable.

All local models you want to have available for LLM selection should be placed in the `server/storage/models/downloaded` folder. Only `.gguf` files will be allowed to be selected from the UI.

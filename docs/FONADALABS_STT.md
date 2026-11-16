# FonadaLabs speech-to-text

AnythingLLM can ingest an uploaded audio or video recording through FonadaLabs Kapture V3. The transcript is written into AnythingLLM's normal document pipeline, where it can be embedded into a workspace and used by workspace search and chat.

## Configure

1. Open **Settings → AI Providers → Transcription**.
2. Select **FonadaLabs** (the entry includes the FonadaLabs icon).
3. Enter a customer-owned FonadaLabs API key.
4. Enter the Fonada `language_id`, such as `en` or `hi`.
5. Save the setting.

No key is committed to source control. Runtime configuration may also be supplied through:

```bash
WHISPER_PROVIDER="fonadalabs"
WHISPER_FONADALABS_API_KEY="your-fonadalabs-api-key"
WHISPER_FONADALABS_LANGUAGE_ID="en"
WHISPER_FONADALABS_MAX_CONCURRENCY="2"
```

## Ingest a recording into a searchable workspace

1. Open or create a workspace.
2. Upload an audio or video document.
3. Wait for document processing to complete.
4. Add/embed the processed document in the workspace.
5. Ask a question in workspace chat or use search. The transcript is part of the workspace context.

## API behavior and large files

The provider sends `POST https://api.fonada.ai/v3/asr/transcribe` with Bearer authentication, the recording as `file`, and the selected `language_id`.

FonadaLabs has a 25 MB public request limit. Every recording is normalized to mono 16 kHz audio and split into ordered 60-second MP3 chunks. Duration-based chunks proved more reliable than sending long, highly compressed recordings as a single request. Results are joined in source order, even when chunks finish out of order.

`WHISPER_FONADALABS_MAX_CONCURRENCY` controls the number of simultaneous chunks. It accepts `1` through `4`; the default is `2`. The local test deployment uses `2` because near-limit parallel jobs received upstream 502 responses. Raising it improves throughput but can cause rate limits or consume credits faster.

The provider retries an HTTP 429 response once after at least 60 seconds (or a longer `Retry-After` delay, up to one hour). It independently retries Fonada gateway HTTP 502 responses up to four times, with 60- to 120-second backoff. A preceding rate limit therefore cannot consume the 502 recovery budget. It does not retry timeouts, connection failures, or other uncertain billed requests.

Successful chunks are checkpointed in AnythingLLM storage. If a later chunk fails, uploading the same recording again reuses completed chunks and resumes the remaining work instead of retranscribing the whole file. Checkpoints are isolated by API credential, language, model, and normalized audio content.

## Verification performed locally

- The FonadaLabs entry, settings fields, and icon are present in the Transcription provider selector.
- The provider sends the required multipart file, Bearer authorization, and `language_id` fields.
- A 48-minute recording was normalized into 48 ordered chunks. Processing recovered from rate limits and temporary upstream failures while retaining completed checkpoints.
- The completed FonadaLabs transcript passed through the normal `asAudio` document converter and was stored as a thread attachment.
- The agent document summarizer listed the attached recording and read its 42,653-character transcript successfully.
- The production frontend build and focused server regression tests pass.

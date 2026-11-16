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

FonadaLabs has a 25 MB public request limit. Recordings at or below this limit are sent as one request. Larger audio or video files are extracted/re-encoded and split into ordered 23 MB MP3 chunks. Results are joined in source order, even when chunks finish out of order.

`WHISPER_FONADALABS_MAX_CONCURRENCY` controls the number of simultaneous chunks. It accepts `1` through `4`; the default is `2`. Raising it improves throughput but can cause Fonada rate limits or consume credits faster. Use `4` only if the Fonada account supports that request rate.

The provider does not automatically retry a failed transcription request. A missing response may still represent a billable request, so retrying is deliberately left to the user.

## Verification performed locally

- The FonadaLabs entry, settings fields, and icon are present in the Transcription provider selector.
- The provider sends the required multipart file, Bearer authorization, and `language_id` fields.
- A generated recording larger than 25 MB was split into two chunks; two mocked requests ran concurrently and the returned text remained correctly ordered.
- The normal `asAudio` converter maps successful transcript text into an AnythingLLM document, which is the existing path for workspace embedding and search.

The final end-to-end check requires a customer-owned key: upload a real recording, confirm it reaches **Ready** status, add it to the workspace, and ask a question whose answer exists only in the recording.

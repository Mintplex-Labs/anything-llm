import { useEffect, useState, useRef } from "react";
import { SpeakerHigh, PauseCircle, CircleNotch } from "@phosphor-icons/react";
import PiperTTSClient from "@/utils/piperTTS";
import messageToSpeech from "@/utils/chat/messageToSpeech";

export default function PiperTTS({ chatId, voiceId = null, message }) {
  const playerRef = useRef(null);
  // Ordered queue of chunk blob URLs - filled as the worker streams audio in.
  const queueRef = useRef([]);
  // Index of the next chunk to play from queueRef.
  const nextIdxRef = useRef(0);
  // True once the worker has posted stream-end (or errored) - no more chunks.
  const streamDoneRef = useRef(false);
  // True when playback caught up to generation and is waiting on the next chunk.
  const waitingRef = useRef(false);
  // True once a stream has been requested - replays reuse the cached queue.
  const startedRef = useRef(false);
  // Abort handle for the in-flight stream - invoked on unmount (thread change)
  // so the shared worker stops rendering audio for a message no longer shown.
  const abortStreamRef = useRef(null);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);

  function playNext() {
    const player = playerRef.current;
    if (!player) return;

    if (nextIdxRef.current < queueRef.current.length) {
      waitingRef.current = false;
      player.src = queueRef.current[nextIdxRef.current];
      nextIdxRef.current += 1;
      player.play().catch(() => setSpeaking(false));
      return;
    }

    if (!streamDoneRef.current) {
      // Playback caught up to generation - hold here and resume automatically
      // when the next streamed chunk arrives (see onChunk below).
      console.log(
        `PiperTTS playback: caught up to generation - waiting on chunk ${nextIdxRef.current + 1}...`
      );
      waitingRef.current = true;
      return;
    }

    setSpeaking(false);
  }

  function stopAndReset() {
    // Stop generating remaining chunks and hard-stop the audio element - a
    // detached or reused <audio> keeps playing otherwise, which is how TTS
    // carried over between threads.
    abortStreamRef.current?.();
    abortStreamRef.current = null;
    const player = playerRef.current;
    if (player) {
      player.pause();
      player.removeAttribute("src");
    }
    queueRef.current.forEach((url) => URL.revokeObjectURL(url));
    queueRef.current = [];
    nextIdxRef.current = 0;
    streamDoneRef.current = false;
    waitingRef.current = false;
    startedRef.current = false;
    setSpeaking(false);
    setLoading(false);
  }

  async function speakMessage(e) {
    e.preventDefault();
    if (speaking) {
      playerRef?.current?.pause();
      return;
    }

    // Replay: chunks are cached (and may still be arriving) - start over.
    if (startedRef.current) {
      nextIdxRef.current = 0;
      playNext();
      return;
    }

    try {
      startedRef.current = true;
      setLoading(true);
      const client = new PiperTTSClient({ voiceId });
      abortStreamRef.current = client.streamAudioForText(
        messageToSpeech(message),
        voiceId,
        {
          onChunk: (blobUrl) => {
            queueRef.current.push(blobUrl);
            setLoading(false);
            // Kick off playback on the first chunk, or resume if playback had
            // caught up to generation and was waiting for this chunk.
            if (nextIdxRef.current === 0 || waitingRef.current) playNext();
          },
          onEnd: () => {
            streamDoneRef.current = true;
            abortStreamRef.current = null;
            setLoading(false);
            if (waitingRef.current) playNext();
          },
          onError: () => {
            // Toast is shown by the client. Release any waiting playback so the
            // button does not hang in the speaking state.
            streamDoneRef.current = true;
            abortStreamRef.current = null;
            setLoading(false);
            if (waitingRef.current) playNext();
            if (queueRef.current.length === 0) startedRef.current = false;
          },
        }
      );
    } catch (e) {
      console.error(e);
      setLoading(false);
      setSpeaking(false);
      startedRef.current = false;
    }
  }

  useEffect(() => {
    function setupPlayer() {
      if (!playerRef?.current) return;
      playerRef.current.addEventListener("play", () => {
        setSpeaking(true);
      });

      playerRef.current.addEventListener("ended", () => {
        playNext();
      });

      playerRef.current.addEventListener("pause", (e) => {
        // Read the element from the event - the ref may already be nulled if
        // this fires during unmount cleanup.
        const el = e.target;
        // A finished chunk fires pause->ended; only a user-initiated pause
        // (not at the end of media) should stop queue playback.
        if (el.ended) return;
        el.currentTime = 0;
        setSpeaking(false);
      });
    }
    setupPlayer();
  }, []);

  // Keyed to the message identity, NOT mount/unmount alone: React reuses these
  // component instances across thread changes (index-keyed lists), so the
  // cleanup must fire whenever this button starts representing a different
  // message - as well as on real unmount.
  useEffect(() => {
    return () => stopAndReset();
  }, [chatId]);

  return (
    <div className="mt-3 relative">
      <button
        type="button"
        onClick={speakMessage}
        disabled={loading}
        data-auto-play-chat-id={chatId}
        data-tooltip-id="message-to-speech"
        data-tooltip-content={
          speaking ? "Pause TTS speech of message" : "TTS Speak message"
        }
        className="border-none text-[var(--theme-sidebar-footer-icon-fill)]"
        aria-label={speaking ? "Pause speech" : "Speak message"}
      >
        {speaking ? (
          <PauseCircle size={18} className="mb-1" />
        ) : (
          <>
            {loading ? (
              <CircleNotch size={18} className="mb-1 animate-spin" />
            ) : (
              <SpeakerHigh size={18} className="mb-1" />
            )}
          </>
        )}
        <audio ref={playerRef} hidden={true} controls={false} />
      </button>
    </div>
  );
}

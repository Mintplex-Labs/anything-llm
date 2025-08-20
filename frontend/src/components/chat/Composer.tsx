import React, { useState, FormEvent } from "react";
import { PaperPlaneRight, PaperclipHorizontal, Microphone } from "@phosphor-icons/react";
import "@/styles/chat.css";

interface ComposerProps {
  onSend?: (message: string) => void;
}

export default function Composer({ onSend }: ComposerProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSend?.(message);
    setMessage("");
  };

  return (
    <form className="flex items-center gap-2" onSubmit={handleSubmit}>
      <button type="button" className="icon-btn" aria-label="Attach file">
        <PaperclipHorizontal weight="bold" />
      </button>
      <textarea
        className="onenew-input flex-1 min-h-[44px] resize-none"
        placeholder="Type a message or /command…"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="button" className="icon-btn" aria-label="Start voice input">
        <Microphone weight="bold" />
      </button>
      <button type="submit" className="onenew-btn" aria-label="Send message">
        <PaperPlaneRight weight="fill" />
      </button>
    </form>
  );
}

/**
 * Message component: renders a single chat message with styling based on the sender.
 *
 * Props:
 *  - sender: "user" | "bot" - determines alignment and appearance.
 *  - children: ReactNode - message content to display.
 *
 * Used within chat transcripts to display messages from either the user or the assistant.
 */
import React, { ReactNode } from "react";
import "@/styles/chat.css";

type MessageProps = {
  sender: "user" | "bot";
  children: ReactNode;
};

export default function Message({ sender, children }: MessageProps) {
  return <div className={`msg ${sender}`}>{children}</div>;
}

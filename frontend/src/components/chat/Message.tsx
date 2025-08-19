import React, { ReactNode } from "react";
import "@/styles/chat.css";

type MessageProps = {
  sender: "user" | "bot";
  children: ReactNode;
};

export default function Message({ sender, children }: MessageProps) {
  return <div className={`msg ${sender}`}>{children}</div>;
}

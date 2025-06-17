import React from "react";

export default function SlashCommandIcon({ className }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 14 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="0.5"
        y="1"
        width="13"
        height="13"
        rx="3.5"
        stroke="currentColor"
      />
      <path
        d="M4.18103 10.7974L9.8189 4.20508"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  );
}

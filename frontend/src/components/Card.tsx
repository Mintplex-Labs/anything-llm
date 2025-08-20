import React, { type HTMLAttributes } from "react";

export default function Card({
  className = "",
  onClick,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const classes = ["card", onClick ? "clickable" : "", className]
    .filter(Boolean)
    .join(" ");
  return (
    <div {...props} onClick={onClick} className={classes}>
      {children}
    </div>
  );
}

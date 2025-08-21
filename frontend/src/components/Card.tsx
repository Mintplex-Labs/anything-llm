/**
 * Card component: lightweight container with optional click handling and custom classes.
 *
 * Props:
 *  - className?: string - additional CSS classes.
 *  - onClick?: (event) => void - click handler enabling interactive styling.
 *  - children: ReactNode - content displayed inside the card.
 *
 * Use to group related content in a bordered box; becomes clickable when onClick is provided.
 */
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

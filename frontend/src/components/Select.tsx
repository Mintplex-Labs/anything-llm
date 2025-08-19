import React, { type SelectHTMLAttributes } from "react";

export default function Select({
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  const classes = ["select", className].filter(Boolean).join(" ");
  return <select {...props} className={classes} />;
}

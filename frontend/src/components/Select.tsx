/**
 * Select component: styled wrapper around the native `<select>` element.
 *
 * Props:
 *  - className?: string - additional classes to apply.
 *  - ...SelectHTMLAttributes - standard select element attributes and event handlers.
 *
 * Use in forms to maintain consistent appearance across the application.
 */
import React, { type SelectHTMLAttributes } from "react";

export default function Select({
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  const classes = ["select", className].filter(Boolean).join(" ");
  return <select {...props} className={classes} />;
}

import React, { useState } from "react";

export default function TextArea({
  defaultValue,
  required = true,
  placeholder = "Place your text here...",
  onChange,
  name = "text-area",
  disabled = false,
  initialRows = 5,
  className = "",
  autoComplete = "off",
  wrap = "soft",
}) {
  const [rows, setRows] = useState(initialRows);

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }

    // Dynamically adjust rows
    const textareaLineHeight = 24;
    const previousRows = e.target.rows;
    e.target.rows = initialRows;

    const currentRows = ~~(e.target.scrollHeight / textareaLineHeight);

    if (currentRows === previousRows) {
      e.target.rows = currentRows;
    }

    if (e.target.scrollHeight > e.target.clientHeight) {
      e.target.rows = currentRows;
    }

    setRows(currentRows);
  };

  return (
    <textarea
      name={name}
      rows={rows}
      defaultValue={defaultValue}
      className={`resize-none bg-zinc-900 placeholder:text-white/20 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-2 ${className}`}
      placeholder={placeholder}
      required={required}
      wrap={wrap}
      autoComplete={autoComplete}
      onChange={onChange || handleChange}
      disabled={disabled}
    />
  );
}

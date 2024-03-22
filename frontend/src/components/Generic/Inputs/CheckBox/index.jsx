import React, { useState, useEffect } from "react";

export default function CheckBox({
  initialChecked = false,
  onToggle,
  name,
  disabled,
}) {
  const [isChecked, setIsChecked] = useState(initialChecked);
  useEffect(() => {
    setIsChecked(initialChecked);
  }, [initialChecked]);

  const handleChange = (e) => {
    setIsChecked(e.target.checked);
    if (onToggle) {
      onToggle(e.target.checked);
    }
  };

  return (
    <label className="inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        name={name}
        onChange={handleChange}
        checked={isChecked}
        disabled={disabled}
        className="cursor-pointer rounded text-sky-400 focus:ring-blue-800 focus:border-blue-800"
      />
    </label>
  );
}

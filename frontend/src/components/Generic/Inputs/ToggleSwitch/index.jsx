import React, { useState, useEffect } from "react";

export default function ToggleButton({
  initialChecked,
  onToggle,
  name,
  disabled,
}) {
  const [isChecked, setIsChecked] = useState(initialChecked);

  useEffect(() => {
    setIsChecked(initialChecked);
  }, [initialChecked]);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    if (onToggle) {
      onToggle(!isChecked);
    }
  };

  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        name={name}
        onChange={handleToggle}
        checked={isChecked}
        className="peer sr-only pointer-events-none"
        disabled={disabled}
      />
      <div className="pointer-events-none peer h-6 w-11 rounded-full bg-stone-400 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border after:border-gray-600 after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-lime-300 peer-checked:after:translate-x-full peer-checked:after:border-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800"></div>
    </label>
  );
}

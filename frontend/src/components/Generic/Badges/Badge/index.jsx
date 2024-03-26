import React from "react";

// Updated utility function for dark theme
const colorMapping = (bg) => {
  const mappings = {
    "bg-green-500": {
      text: "text-green-400",
      icon: "text-green-600 group-hover:text-green-50",
      ring: "ring-1 ring-inset ring-green-500/20",
    },
  };

  return (
    mappings[bg] || {
      text: "text-white/60",
      icon: "text-white/80 group-hover:text-white/50",
      ring: "ring-1 ring-inset ring-gray-500/20",
    }
  );
};

// Badge Component

export default function Badge({
  label = "Beta",
  size = "sm", // "sm", "md", "lg" or "xl"
  rounded = "full", // "none", "sm", "md", "lg", "full"
  shadow = "none", // "none", "sm", "md", "lg", "xl"
  showDot = false,
  showClose = false,
  bg = "bg-green-500",
  animated = false,
  active = false,
  onClose = () => {}, // Callback for close icon
  onSelect = () => {}, // Callback for badge click
  onDoubleClick = () => {}, // Callback for badge double click
}) {
  const {
    text: textColor,
    icon: iconColor,
    ring: ringClasses,
  } = colorMapping(bg);
  const animatedClasses = animated ? "animate-pulse" : "";
  const sizeClasses = {
    sm: "py-0.5 px-2 pr-0.5 text-xs",
    md: "py-1.5 px-2 pr-1 text-xs",
    lg: "py-2 px-3 text-sm",
    xl: "py-2.5 px-4 text-base",
  }[size];
  const iconSizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
    xl: "h-4 w-4",
  }[size];
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  }[rounded];
  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  }[shadow];
  const backgroundClasses = `${bg} ${
    active ? "bg-opacity-20" : "bg-opacity-10"
  } hover:bg-opacity-30`;

  // SVG Icons
  const DotIcon = () => (
    <svg
      viewBox="0 0 8 8"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`${iconSizeClasses} ${iconColor} ${animatedClasses}`}
    >
      <circle cx="4" cy="4" r="4" />
    </svg>
  );

  const CloseIcon = () => (
    <svg
      viewBox="0 0 12 12"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`${iconSizeClasses} ${iconColor}`}
    >
      <path d="M6 4.586L2.929 1.515 1.515 2.929 4.586 6l-3.071 3.071 1.414 1.414L6 7.414l3.071 3.071 1.414-1.414L7.414 6l3.071-3.071-1.414-1.414L6 4.586z" />
    </svg>
  );

  return (
    <div
      className={`flex flex-row gap-0.5 w-fit h-fit  justify-center items-center cursor-pointer select-none group ${sizeClasses} ${backgroundClasses} ${roundedClasses} ${shadowClasses} ${ringClasses}`}
      onDoubleClick={onDoubleClick}
      onClick={onSelect}
    >
      {showDot && (
        <div>
          <DotIcon />
        </div>
      )}
      <p className={`block text-center font-medium pr-2 pl-1  ${textColor}`}>
        {label}
      </p>
      {showClose && (
        <div
          className="flex flex-row justify-start items-start p-1 rounded-lg cursor-pointer z-10"
          onClick={onClose}
        >
          <CloseIcon className="p1" />
        </div>
      )}
    </div>
  );
}

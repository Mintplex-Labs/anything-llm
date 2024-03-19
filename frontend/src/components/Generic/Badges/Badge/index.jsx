import React from "react";

// Updated utility function for dark theme
const colorMapping = (bg) => {
  const mappings = {
    "emerald-600": { text: "text-emerald-100", icon: "text-emerald-200 group-hover:text-emerald-50" },
    "red-600": { text: "text-red-100", icon: "text-red-200 group-hover:text-red-50" },
    "blue-600": { text: "text-blue-100", icon: "text-blue-200 group-hover:text-blue-50" },
    "yellow-600": { text: "text-yellow-100", icon: "text-yellow-200 group-hover:text-yellow-50" },
    "gray-600": { text: "text-gray-100", icon: "text-gray-200 group-hover:text-gray-50" },
    "purple-600": { text: "text-purple-100", icon: "text-purple-200 group-hover:text-purple-50" },
    "pink-600": { text: "text-pink-100", icon: "text-pink-200 group-hover:text-pink-50" },
    "indigo-600": { text: "text-indigo-100", icon: "text-indigo-200 group-hover:text-indigo-50" },
  };

  return mappings[bg] || { text: "text-gray-100", icon: "text-gray-200" };
};

// Badge Component

export default function Badge({
  label = "Beta",
  size = "sm", // "sm", "md", "lg" or "xl"
  rounded = "full", // "none", "sm", "md", "lg", "full"
  shadow = "none", // "none", "sm", "md", "lg", "xl"
  showDot = false,
  showClose = false,
  bg = "emerald-600",
  animated = false,
  onClose = () => {}, // Callback for close icon
}) {
  // Adjustments based on props
  const { text: textColor, icon: iconColor } = colorMapping(bg);
  const animatedClasses = animated ? "animate-pulse" : "";
  const sizeClasses = {
    sm: "py-0.5 pl-2 pr-0.5 text-xs",
    md: "py-1 pl-2 pr-1 text-sm",
    lg: "py-1 px-3 text-sm",
    xl: "py-1.5 px-4 text-base",
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
  const backgroundClasses = `bg-${bg}`;

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
      className={`flex flex-row gap-0.5 w-fit h-fit  justify-center items-center  group ${sizeClasses} ${backgroundClasses} ${roundedClasses} ${shadowClasses}`}
    >
      {showDot && (
        <div>
          <DotIcon />
        </div>
      )}
      <p className={`block text-center font-medium px-1 ${textColor}`}>
        {label}
      </p>
      {showClose && (
        <div
          className="flex flex-row justify-start items-start p-1 rounded-lg cursor-pointer"
          onClick={onClose}
        >
          <CloseIcon />
        </div>
      )}
    </div>
  );
};
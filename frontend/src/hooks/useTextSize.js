import { useState, useEffect } from "react";

export default function useTextSize() {
  const [textSize, setTextSize] = useState("normal");
  const [textSizeClass, setTextSizeClass] = useState("text-[14px]");

  const getTextSizeClass = (size) => {
    switch (size) {
      case "small":
        return "text-[12px]";
      case "large":
        return "text-[18px]";
      default:
        return "text-[14px]";
    }
  };

  useEffect(() => {
    const storedTextSize = window.localStorage.getItem("anythingllm_text_size");
    if (storedTextSize) {
      setTextSize(storedTextSize);
      setTextSizeClass(getTextSizeClass(storedTextSize));
    }

    const handleTextSizeChange = (event) => {
      const size = event.detail;
      setTextSize(size);
      setTextSizeClass(getTextSizeClass(size));
    };

    window.addEventListener("textSizeChange", handleTextSizeChange);
    return () => {
      window.removeEventListener("textSizeChange", handleTextSizeChange);
    };
  }, []);

  return { textSize, textSizeClass };
}

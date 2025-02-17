import { useState, useEffect } from "react";

export function useMessageDirection(role) {
  const [msgDirection, setMsgDirection] = useState(() => {
    return localStorage.getItem("msg-direction") || "left";
  });

  useEffect(() => {
    if (msgDirection) {
      localStorage.setItem("msg-direction", msgDirection);
    }
  }, [msgDirection]);

  const isLeftToRight = role === "user" && msgDirection === "left_right";
  return {
    msgDirection,
    setMsgDirection,
    isLeftToRight: isLeftToRight,
    directionCls: isLeftToRight ? "flex-row-reverse" : "",
  };
}

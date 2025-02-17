import {
  useState,
  useEffect
} from "react";


export function useMessageDirection() {
  const [msgDirection, setMsgDirection] = useState(() => {
    return localStorage.getItem("msg-direction") || 'left';
  });

  useEffect(() => {
    if (msgDirection) {
      localStorage.setItem("msg-direction", msgDirection);
    }
  }, [msgDirection]);

  return {
    msgDirection,
    setMsgDirection
  };
}

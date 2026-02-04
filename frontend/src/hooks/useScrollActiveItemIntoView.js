import { useEffect, useRef } from "react";

export default function useScrollActiveItemIntoView({ isActive }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isActive) {
      ref.current.scrollIntoView({
        behavior: "instant",
        block: "center",
      });
    }
  }, [isActive]);

  return {
    ref,
  };
}

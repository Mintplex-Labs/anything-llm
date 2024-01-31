import { useState } from "react";

export default function useOpenChat() {
  const [isOpen, setOpen] = useState(false);

  //TODO: Detect if chat was previously open??
  return { isChatOpen: isOpen, toggleOpenChat: setOpen };
}

import { createContext, useContext, useState } from "react";

const ChatSidebarContext = createContext();

export function ChatSidebarProvider({ children }) {
  const [activeSidebar, setActiveSidebar] = useState(null);
  const [sidebarData, setSidebarData] = useState(null);

  function openSidebar(type, data = null) {
    setActiveSidebar(type);
    setSidebarData(data);
  }

  function closeSidebar() {
    setActiveSidebar(null);
    setSidebarData(null);
  }

  function toggleSidebar(type, data = null) {
    if (activeSidebar === type) closeSidebar();
    else openSidebar(type, data);
  }

  return (
    <ChatSidebarContext.Provider
      value={{
        activeSidebar,
        sidebarData,
        openSidebar,
        closeSidebar,
        toggleSidebar,
      }}
    >
      {children}
    </ChatSidebarContext.Provider>
  );
}

export function useChatSidebar() {
  return useContext(ChatSidebarContext);
}

export function useSourcesSidebar() {
  const { activeSidebar, sidebarData, openSidebar, closeSidebar } =
    useContext(ChatSidebarContext);
  return {
    sidebarOpen: activeSidebar === "sources",
    sources: activeSidebar === "sources" ? sidebarData : [],
    openSidebar: (sources) => openSidebar("sources", sources),
    closeSidebar,
  };
}

export function useMemoriesSidebar() {
  const { activeSidebar, toggleSidebar, closeSidebar } =
    useContext(ChatSidebarContext);
  return {
    sidebarOpen: activeSidebar === "memories",
    toggleSidebar: () => toggleSidebar("memories"),
    closeSidebar,
  };
}

/**
 * Reusable animation wrapper for right-side chat panels.
 * Handles the slide-in/out transition only; each panel provides its own layout.
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {React.ReactNode} props.children
 */
export default function ChatSidebar({ isOpen, children }) {
  return (
    <div
      className="h-full overflow-hidden transition-all duration-500 flex-shrink-0"
      style={{ width: isOpen ? "366px" : "0px" }}
    >
      {children}
    </div>
  );
}

import React from "react";
import DefaultChatContainer from "../../components/DefaultChat";
import Sidebar from "../../components/Sidebar";

export default function Main() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-orange-100 dark:bg-stone-700 flex">
      <Sidebar />
      <DefaultChatContainer />
    </div>
  );
}

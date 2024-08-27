import React from "react";
import Config from "./components/Config";
import useApiConnection from "./hooks/useApiConnection";

const App = () => {
  const { status, checkApiKeyStatus, logoUrl } = useApiConnection();
  return (
    <div className="p-6 bg-[#25272C] min-h-screen flex flex-col items-center">
      <img src={logoUrl} alt="AnythingLLM Logo" className="w-40 mb-6" />
      <div className="bg-[#2C2E33] p-6 rounded-lg shadow-lg w-full max-w-md">
        <p className="text-white text-sm font-medium mb-6">
          Right click on any page and send selected text or entire pages to
          AnythingLLM.
        </p>
        <Config status={status} onStatusChange={checkApiKeyStatus} />
      </div>
    </div>
  );
};

export default App;

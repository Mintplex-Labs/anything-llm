import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import React, { useState } from "react";

import { FullScreenLoader } from "@/components/Preloader";
import Sidebar from "@/components/Sidebar";
import UserMenu from "@/components/UserMenu";
import axios from "axios";
import { isMobile } from "react-device-detect";
import InsightBotFileUpload from "./InsightBotUploadComponent"; // Ensure the correct import path

export default function InsightBotUpload() {
  const { loading, requiresAuth, mode } = usePasswordModal();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [promptTemplates, setPromptTemplates] = useState([""]);
  const [currentStep, setCurrentStep] = useState(1);
  const [affectedFiles, setAffectedFiles] = useState([]);

  const fetchKeys = async (force = false) => {
    // Implement the logic to fetch keys or other necessary data after file upload
    console.log("Fetching keys...", force);
  };

  const handleSetLoading = (loading) => {
    setIsLoading(loading);
  };

  const handleSetLoadingMessage = (message) => {
    setLoadingMessage(message);
  };

  const handleAddPromptTemplate = () => {
    setPromptTemplates([...promptTemplates, ""]);
  };

  const handlePromptTemplateChange = (index, value) => {
    const newPromptTemplates = [...promptTemplates];
    newPromptTemplates[index] = value;
    setPromptTemplates(newPromptTemplates);
  };

  const sendRequest = async (promptTemplate, previousFolder, outputFolder) => {
    setIsLoading(true);
    setLoadingMessage(`Processing: ${promptTemplate}`);
    try {
      const response = await axios.post(
        "http://localhost:5000/convert_and_enrich",
        {
          folder_path: "./extracted",
          previous_folder: previousFolder,
          output_folder: outputFolder,
          state_file: "./file_state.json",
          prompt_template: promptTemplate,
          affected_files: affectedFiles.length > 0 ? affectedFiles : undefined,
        }
      );

      const newAffected = response.data.affected_files.map((path) =>
        path.replace("./extracted", "./step-1/docs")
      );
      console.log("newAffected", newAffected);
      setAffectedFiles(newAffected);
      console.log(response.data.message);
    } catch (error) {
      console.error("Error in request:", error);
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const handleStartProcessing = async () => {
    let previousFolder = "./docs";
    let outputFolder = "./step-1";

    for (let i = 0; i < promptTemplates.length; i++) {
      const response = await sendRequest(
        promptTemplates[i],
        previousFolder,
        outputFolder
      );
      console.log("response", response);
      previousFolder = outputFolder;
      outputFolder = `./step-${currentStep + 1}`;
      setCurrentStep(currentStep + 1);
    }
  };

  if (loading) return <FullScreenLoader />;
  if (requiresAuth !== false) {
    return <>{requiresAuth !== null && <PasswordModal mode={mode} />}</>;
  }

  return (
    <UserMenu>
      <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
        {!isMobile && <Sidebar />}
        <div className="flex-grow p-4">
          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="text-white text-lg">{loadingMessage}</div>
            </div>
          )}
          <InsightBotFileUpload
            fetchKeys={fetchKeys}
            setLoading={handleSetLoading}
            setLoadingMessage={handleSetLoadingMessage}
          />
          <div className="mt-4">
            {promptTemplates.map((prompt, index) => (
              <div key={index} className="mb-2 flex items-center">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) =>
                    handlePromptTemplateChange(index, e.target.value)
                  }
                  className="flex-grow p-2 border border-gray-300 rounded"
                  placeholder="Enter prompt template"
                />
              </div>
            ))}
            <button
              onClick={handleAddPromptTemplate}
              className="mt-2 p-2 bg-blue-500 text-white rounded"
            >
              Add new prompt template
            </button>
            <button
              onClick={handleStartProcessing}
              className="mt-2 p-2 bg-green-500 text-white rounded"
            >
              Start Processing
            </button>
          </div>
        </div>
      </div>
    </UserMenu>
  );
}

import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import React, { useState } from "react";

import { FullScreenLoader } from "@/components/Preloader";
import Sidebar from "@/components/Sidebar";
import UserMenu from "@/components/UserMenu";
import FileDetails from "@/pages/InsightBotUpload/InsightBotFileDetails";
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
  const [fileDetails, setFileDetails] = useState([]); // New state for file details
  const [totalTokens, setTotalTokens] = useState(0); // New state for total tokens

  const fetchKeys = async (force = false) => {
    console.log("Fetching keys...", force);
    try {
      const response = await axios.get("http://localhost:5000/list_files_upload");
      const { files, total_tokens } = response.data;

      setFileDetails(files);
      setTotalTokens(total_tokens);
      console.log("File details:", files);
      console.log("Total tokens:", total_tokens);
    } catch (error) {
      console.error("Error fetching file details:", error);
    }
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

  const sendRequest = async (promptTemplate, previousFolder, outputFolder, isFirstRun) => {
    setIsLoading(true);
    setLoadingMessage(`Processing: ${promptTemplate}`);
    try {
      const response = await axios.post(
        "http://localhost:5000/convert_and_enrich",
        {
          folder_path: "./public/extracted",
          previous_folder: previousFolder,
          output_folder: outputFolder,
          state_file: "./file_state.json",
          prompt_template: promptTemplate,
          is_local: false,
          affected_files: isFirstRun ? undefined : affectedFiles,
        }
      );

      const newAffected = response.data.affected_files.map((path) =>
        path.replace("./extracted", `${outputFolder}/docs`)
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
    let previousFolder = "./public/initial-docs";
    let outputFolder = "./public/step-1";
    let isFirstRun = true;

    for (let i = 0; i < promptTemplates.length; i++) {
      await sendRequest(promptTemplates[i], previousFolder, outputFolder, isFirstRun);
      isFirstRun = false;
      previousFolder = outputFolder;
      outputFolder = `./public/step-${i + 2}`; // Ensure unique folder path for each step
      setCurrentStep((prevStep) => prevStep + 1);
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
            <FileDetails fileDetails={fileDetails} totalTokens={totalTokens} />
            <p className="text-white">{promptTemplates[0]}</p>
          </div>
        </div>
      </div>
    </UserMenu>
  );
}

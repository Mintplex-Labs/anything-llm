import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import React, { useState } from "react";

import { FullScreenLoader } from "@/components/Preloader";
import Sidebar from "@/components/Sidebar";
import UserMenu from "@/components/UserMenu";
import FileDetails from "@/pages/InsightBotUpload/InsightBotFileDetails";
import {
  Plus
} from "@phosphor-icons/react";
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
        <div className="flex-grow p-4 overflow-y-auto">
          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="text-white text-lg">{loadingMessage}</div>
            </div>
          )}
          <h2 className="text-white text-4xl mt-4 font-bold">Upload Your ZIP File</h2>
          <p className="text-white mt-4  font-light italic">
            Please upload your ZIP file containing the necessary documents.
          </p>
          <p className="text-white mb-4 font-light">
            <b>Tip</b>: Always use your original files to enrich.
          </p>
          <InsightBotFileUpload
            fetchKeys={fetchKeys}
            setLoading={handleSetLoading}
            setLoadingMessage={handleSetLoadingMessage}
          />
          <div className="mt-8">
            <FileDetails
              fileDetails={fileDetails}
              totalTokens={totalTokens}
            />
          </div>

          <div className="mt-8">
            <h2 className='text-white font-semibold text-2xl'>Add Prompt Templates</h2>
            <p className='text-white font-light mb-4'>Add new prompt templates and start processing to enrich your files using advanced AI.</p>
            {promptTemplates.map((prompt, index) => (
              <div key={index} className="mb-2">
                <label className="block text-white mb-1" htmlFor={`prompt-${index}`}>
                  Prompt Template {index + 1}
                </label>
                <textarea
                  id={`prompt-${index}`}
                  value={prompt}
                  onChange={(e) =>
                    handlePromptTemplateChange(index, e.target.value)
                  }
                  className="w-full md:w-3/5 lg:w-9/12 p-2 border text-white border-slate-400 bg-black bg-opacity-20 rounded resize-none"
                  placeholder="Enter prompt template"
                  rows="4"
                />
              </div>
            ))}
            <div className="w-full md:w-3/5 lg:w-9/12 flex columns-2 justify-between">
              <button
                onClick={handleAddPromptTemplate}
                className="flex items-center justify-center p-4 rounded bg-blue-500 text-white"
              >
                <Plus />New Prompt
              </button>
              <button
                onClick={handleStartProcessing}
                className="flex items-center justify-center p-4 rounded bg-green-500 text-white"
              >
                Start Processing
              </button>
            </div>
          </div>
        </div>
      </div>
    </UserMenu>
  );
}

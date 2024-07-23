/* eslint-disable prettier/prettier */
import Document from "@/models/document";
import { X } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import { folderColumns } from "../utils";

export default function NewFolderModal({ closeModal, setFiles, existingData }) {
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    folderName: "",
    numExp: "",
    ano: "",
    cliente: "",
    juzgadoPrincipal: "",
    fechaAlta: "",
    estadoDeExpediente: "",
  });

  useEffect(() => {
    if (existingData) {
      setFormData({
        folderName: existingData.name || "",
        numExp: existingData.metadata?.numExp || "",
        año: existingData.metadata?.ano || "",
        cliente: existingData.metadata?.cliente || "",
        juzgadoPrincipal: existingData.metadata?.juzgadoPrincipal || "",
        fechaAlta: existingData.metadata?.fechaAlta || "",
        estadoDeExpediente: existingData.metadata?.estadoDeExpediente || "",
      });
    }
  }, [existingData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    if (Object.values(formData).some((value) => value.trim() === "")) {
      setError("All fields are required");
      return;
    }

    const newFolder = {
      name: formData.folderName,
      type: "folder",
      items: [],
      metadata: {
        numExp: formData.numExp,
        ano: formData.ano,
        cliente: formData.cliente,
        juzgadoPrincipal: formData.juzgadoPrincipal,
        fechaAlta: formData.fechaAlta,
        estadoDeExpediente: formData.estadoDeExpediente,
      },
    };

    const { success } = await Document.createFolder(
      formData.folderName,
      newFolder.metadata
    );
    if (success) {
      setFiles((prevFiles) => ({
        ...prevFiles,
        items: [...prevFiles.items, newFolder],
      }));
      closeModal();
    } else {
      setError("Failed to create folder");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    if (Object.values(formData).some((value) => value.trim() === "")) {
      setError("All fields are required");
      return;
    }

    const updatedFolder = {
      name: formData.folderName,
      type: "folder",
      items: [],
      metadata: {
        numExp: formData.numExp,
        ano: formData.ano,
        cliente: formData.cliente,
        juzgadoPrincipal: formData.juzgadoPrincipal,
        fechaAlta: formData.fechaAlta,
        estadoDeExpediente: formData.estadoDeExpediente,
      },
    };

    const { success } = await Document.updateFolderMetadata(
      formData.folderName,
      updatedFolder.metadata
    );
    if (success) {
      setFiles((prevFiles) => ({
        ...prevFiles,
        items: prevFiles.items.map((item) =>
          item.name === formData.folderName
            ? { ...item, metadata: updatedFolder.metadata }
            : item
        ),
      }));
      closeModal();
    } else {
      setError("Failed to update folder");
    }
  };

  return (
    <div className="relative w-full max-w-xl max-h-full">
      <div className="relative bg-main-gradient rounded-lg shadow">
        <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-500/50">
          <h3 className="text-xl font-semibold text-white">
            {existingData ? "Update Folder" : "Create New Folder"}
          </h3>
          <button
            onClick={closeModal}
            type="button"
            className="transition-all duration-300 text-gray-400 bg-transparent hover:border-white/60 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
            data-modal-hide="staticModal"
          >
            <X className="text-gray-300 text-lg" />
          </button>
        </div>
        <form onSubmit={existingData ? handleUpdate : handleCreate}>
          <div className="p-6 grid grid-cols-2 gap-4">
            {Object.entries(formData).map(([key, value], index) => (
              <div
                key={key}
                className={
                  index === Object.entries(formData).length - 1
                    ? "col-span-2"
                    : ""
                }
              >
                <label
                  htmlFor={key}
                  className="block mb-2 text-sm font-medium text-white"
                >
                  {folderColumns[key]?.label || key}
                </label>
                <input
                  name={key}
                  type="text"
                  id={key}
                  className="bg-zinc-900 w-full text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block p-2.5"
                  placeholder={`Enter ${folderColumns[key]?.label || key}`}
                  required={true}
                  autoComplete="off"
                  value={value}
                  onChange={handleInputChange}
                  disabled={key === "folderName" && !!existingData}
                />
              </div>
            ))}
          </div>
          {error && <p className="text-red-400 text-sm px-6">Error: {error}</p>}
          <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
            <button
              onClick={closeModal}
              type="button"
              className="px-4 py-2 rounded-lg text-white hover:bg-stone-900 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            >
              {existingData ? "Update Folder" : "Create Folder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

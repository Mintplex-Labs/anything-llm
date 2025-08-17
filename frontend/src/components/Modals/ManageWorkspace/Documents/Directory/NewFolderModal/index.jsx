import React, { useState } from "react";
import { X } from "@phosphor-icons/react";
import Document from "@/models/document";
import ModalWrapper from "@/components/ModalWrapper";

export default function NewFolderModal({ closeModal, files, setFiles }) {
  const [error, setError] = useState(null);
  const [folderName, setFolderName] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    if (folderName.trim() !== "") {
      const newFolder = {
        name: folderName,
        type: "folder",
        items: [],
      };
      const { success } = await Document.createFolder(folderName);
      if (success) {
        setFiles({
          ...files,
          items: [...files.items, newFolder],
        });
        closeModal();
      } else {
        setError("Failed to create folder");
      }
    }
  };

  return (
    <ModalWrapper isOpen={true} onClose={closeModal} noPortal>
      <div className="onenew-card p-5 shadow-2xl max-w-lg w-[90vw]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
            Create New Folder
          </h3>
          <button onClick={closeModal} type="button" className="onenew-btn">
            <X size={24} weight="bold" className="text-white" />
          </button>
        </div>
        <form onSubmit={handleCreate}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="folderName"
                className="block mb-2 text-sm font-medium text-white"
              >
                Folder Name
              </label>
              <input
                name="folderName"
                type="text"
                className="onenew-input w-full"
                placeholder="Enter folder name"
                required={true}
                autoComplete="off"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
              />
            </div>
            {error && <p className="text-red-400 text-sm">Error: {error}</p>}
          </div>
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-theme-modal-border">
            <button onClick={closeModal} type="button" className="onenew-btn">
              Cancel
            </button>
            <button type="submit" className="onenew-btn">
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
}

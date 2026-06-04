import React, { useState } from "react";
import Document from "@/models/document";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
  ModalSecondaryButton,
} from "@/components/lib/Modal";

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
    <form onSubmit={handleCreate} className="flex flex-col gap-y-5">
      <ModalHeader title="Create New Folder" onClose={closeModal} />
      <ModalBody>
        <div>
          <label
            htmlFor="folderName"
            className="block mb-1.5 text-sm font-medium text-zinc-50 light:text-slate-700"
          >
            Folder Name
          </label>
          <input
            name="folderName"
            type="text"
            className="w-full h-[34px] px-3.5 text-sm rounded-lg outline-none bg-zinc-800 border border-zinc-800 text-zinc-300 placeholder:text-zinc-400 light:bg-white light:border-slate-300 light:text-slate-700 light:placeholder:text-slate-400 focus:border-sky-500 light:focus:border-sky-500"
            placeholder="Enter folder name"
            required={true}
            autoComplete="off"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
        </div>
        {error && <p className="text-red-400 text-sm">Error: {error}</p>}
      </ModalBody>
      <ModalFooter>
        <ModalSecondaryButton onClick={closeModal} type="button">
          Cancel
        </ModalSecondaryButton>
        <ModalPrimaryButton type="submit">Create Folder</ModalPrimaryButton>
      </ModalFooter>
    </form>
  );
}

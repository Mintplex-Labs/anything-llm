import React, { useState } from "react";
import { Warning, X } from "@phosphor-icons/react";
import showToast from "@/utils/toast";
import Embed from "@/models/embed";

export default function DeleteEmbedModal({ closeModal, embed, onConfirm }) {
  const [error, setError] = useState(null);
  
  const handleDelete = async (e) => {
    setError(null);
    e.preventDefault();
    const { success, error } = await Embed.deleteEmbed(embed.id);
    if (success) {
      closeModal();
      onConfirm();
      showToast("Embed deleted successfully", "success", { clear: true });
    }
    setError(error);
  };

  return (
    <div className="relative w-[650px] max-w-2xl max-h-full">
      <div className="relative bg-theme-bg-secondary rounded-lg shadow border-2 border-gray-500/50 custom-theme-bg-tertiary">
        <div
          className="flex justify-end px-4 pt-4 cursor-pointer"
          onClick={closeModal}
        >
          <X className="text-lg text-white w-6 h-6 custom-text-secondary" />
        </div>
        <div className="flex items-start justify-between px-4 pb-4 border-b rounded-t border-gray-500/50">
          <div className="flex items-center gap-2">
            <Warning className="text-red-500 text-lg w-6 h-6" weight="fill" />
            <h3 className="text-xl font-semibold text-red-500">
              WARNING - This action is irreversible
            </h3>
          </div>
        </div>
        <div className="p-6 text-white custom-text-secondary">
          <p>
            Are you sure you want to delete this embed?
            <br />
            Once deleted this embed will no longer respond to chats or be active.
            <br />
            <br />
            Are you sure you want to proceed?
          </p>
          <br />
          {error && <p className="text-red-400 text-sm">Error: {error}</p>}
        </div>

        <div className="flex w-full justify-end items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
          <button
            onClick={closeModal}
            type="button"
            className="px-4 py-2 rounded-lg text-white transition-all duration-300 border-2 custom-button-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="transition-all duration-300 border-slate-200 px-4 py-2 rounded-lg text-white items-center flex gap-x-2 bg-red-500 hover:bg-red-400 focus:ring-gray-800"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

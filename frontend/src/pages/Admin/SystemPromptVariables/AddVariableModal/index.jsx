import React, { useState } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
  ModalSecondaryButton,
  ModalInput,
} from "@/components/lib/Modal";

export default function AddVariableModal({ closeModal, onRefresh }) {
  const [error, setError] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.target);
    const newVariable = {};
    for (const [key, value] of formData.entries())
      newVariable[key] = value.trim();

    if (!newVariable.key || !newVariable.value) {
      setError("Key and value are required");
      return;
    }

    try {
      await System.promptVariables.create(newVariable);
      showToast("Variable created successfully", "success", { clear: true });
      if (onRefresh) onRefresh();
      closeModal();
    } catch (error) {
      console.error("Error creating variable:", error);
      setError("Failed to create variable");
    }
  };

  return (
    <form onSubmit={handleCreate} className="flex flex-col gap-y-5">
      <ModalHeader title="Add New Variable" onClose={closeModal} />
      <ModalBody>
        <ModalInput
          label="Key"
          name="key"
          type="text"
          minLength={3}
          maxLength={255}
          placeholder="e.g., company_name"
          required={true}
          autoComplete="off"
          pattern="^[a-zA-Z0-9_]+$"
          hint={
            <>
              Key must be unique and will be used in prompts as {"{key}"}. Only
              letters, numbers and underscores are allowed.
            </>
          }
        />
        <ModalInput
          label="Value"
          name="value"
          type="text"
          placeholder="e.g., Acme Corp"
          required={true}
          autoComplete="off"
        />
        <ModalInput
          label="Description"
          name="description"
          type="text"
          placeholder="Optional description"
          autoComplete="off"
        />
        {error && <p className="text-red-400 text-sm">Error: {error}</p>}
      </ModalBody>
      <ModalFooter>
        <ModalSecondaryButton onClick={closeModal} type="button">
          Cancel
        </ModalSecondaryButton>
        <ModalPrimaryButton type="submit">Create variable</ModalPrimaryButton>
      </ModalFooter>
    </form>
  );
}

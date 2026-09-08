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

export default function EditVariableModal({ variable, closeModal, onRefresh }) {
  const [error, setError] = useState(null);

  const handleUpdate = async (e) => {
    if (!variable.id) return;
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.target);
    const updatedVariable = {};
    for (const [key, value] of formData.entries())
      updatedVariable[key] = value.trim();

    if (!updatedVariable.key || !updatedVariable.value) {
      setError("Key and value are required");
      return;
    }

    try {
      await System.promptVariables.update(variable.id, updatedVariable);
      showToast("Variable updated successfully", "success", { clear: true });
      if (onRefresh) onRefresh();
      closeModal();
    } catch (error) {
      console.error("Error updating variable:", error);
      setError("Failed to update variable");
    }
  };

  return (
    <form onSubmit={handleUpdate} className="flex flex-col gap-y-5">
      <ModalHeader title={`Edit ${variable.key}`} onClose={closeModal} />
      <ModalBody>
        <ModalInput
          label="Key"
          name="key"
          minLength={3}
          maxLength={255}
          type="text"
          placeholder="e.g., company_name"
          defaultValue={variable.key}
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
          defaultValue={variable.value}
          required={true}
          autoComplete="off"
        />
        <ModalInput
          label="Description"
          name="description"
          type="text"
          placeholder="Optional description"
          defaultValue={variable.description}
          autoComplete="off"
        />
        {error && <p className="text-red-400 text-sm">Error: {error}</p>}
      </ModalBody>
      <ModalFooter>
        <ModalSecondaryButton onClick={closeModal} type="button">
          Cancel
        </ModalSecondaryButton>
        <ModalPrimaryButton type="submit">Update variable</ModalPrimaryButton>
      </ModalFooter>
    </form>
  );
}

import React, { useState } from "react";
import {
  BooleanInput,
  ChatModeSelection,
  NumberInput,
  PermittedDomains,
  WorkspaceSelection,
  enforceSubmissionSchema,
} from "../../NewEmbedModal";
import Embed from "@/models/embed";
import showToast from "@/utils/toast";
import { safeJsonParse } from "@/utils/request";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
  ModalSecondaryButton,
} from "@/components/lib/Modal";

export default function EditEmbedModal({ embed, closeModal }) {
  const [error, setError] = useState(null);

  const handleUpdate = async (e) => {
    setError(null);
    e.preventDefault();
    const form = new FormData(e.target);
    const data = enforceSubmissionSchema(form);
    const { success, error } = await Embed.updateEmbed(embed.id, data);
    if (success) {
      showToast("Embed updated successfully.", "success", { clear: true });
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
    setError(error);
  };

  return (
    <form onSubmit={handleUpdate} className="flex flex-col gap-y-5">
      <ModalHeader title={`Update embed #${embed.id}`} onClose={closeModal} />
      <ModalBody className="max-h-[60vh] overflow-y-auto">
        <WorkspaceSelection defaultValue={embed.workspace.id} />
        <ChatModeSelection defaultValue={embed.chat_mode} />
        <PermittedDomains
          defaultValue={safeJsonParse(embed.allowlist_domains, null) || []}
        />
        <NumberInput
          name="max_chats_per_day"
          title="Max chats per day"
          hint="Limit the amount of chats this embedded chat can process in a 24 hour period. Zero is unlimited."
          defaultValue={embed.max_chats_per_day}
        />
        <NumberInput
          name="max_chats_per_session"
          title="Max chats per session"
          hint="Limit the amount of chats a session user can send with this embed in a 24 hour period. Zero is unlimited."
          defaultValue={embed.max_chats_per_session}
        />
        <NumberInput
          name="message_limit"
          title="Message History Limit"
          hint="The number of previous messages to include in the chat context. Default is 20."
          defaultValue={embed.message_limit}
        />
        <BooleanInput
          name="allow_model_override"
          title="Enable dynamic model use"
          hint="Allow setting of the preferred LLM model to override the workspace default."
          defaultValue={embed.allow_model_override}
        />
        <BooleanInput
          name="allow_temperature_override"
          title="Enable dynamic LLM temperature"
          hint="Allow setting of the LLM temperature to override the workspace default."
          defaultValue={embed.allow_temperature_override}
        />
        <BooleanInput
          name="allow_prompt_override"
          title="Enable Prompt Override"
          hint="Allow setting of the system prompt to override the workspace default."
          defaultValue={embed.allow_prompt_override}
        />

        {error && <p className="text-red-400 text-sm">Error: {error}</p>}
        <p className="text-xs text-zinc-400 light:text-slate-600">
          After creating an embed you will be provided a link that you can
          publish on your website with a simple
          <code className="border-none bg-zinc-800 light:bg-stone-300 text-white mx-1 px-1 rounded-sm">
            &lt;script&gt;
          </code>{" "}
          tag.
        </p>
      </ModalBody>
      <ModalFooter>
        <ModalSecondaryButton onClick={closeModal} type="button">
          Cancel
        </ModalSecondaryButton>
        <ModalPrimaryButton type="submit">Update embed</ModalPrimaryButton>
      </ModalFooter>
    </form>
  );
}

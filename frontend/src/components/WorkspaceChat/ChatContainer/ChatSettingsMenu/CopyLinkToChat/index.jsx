import Modal, { ModalHeader, ModalBody } from "@/components/lib/Modal";
import { useModal } from "@/hooks/useModal";
import { useState } from "react";
import { useParams } from "react-router-dom";

const SEEN_COPY_LINK_CHAT_ALERT = "anythingllm_seen_copy_link_chat_alert";

export default function CopyLinkToChatRow() {
  const { slug, threadSlug } = useParams();
  const [copied, setCopied] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();

  if (!slug) return null;

  function getChatUrl() {
    let path = `/workspace/${slug}`;
    if (threadSlug) path += `/t/${threadSlug}`;
    return `${window.location.origin}${path}`;
  }

  function handleClick() {
    navigator.clipboard.writeText(getChatUrl()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });

    if (!window.localStorage.getItem(SEEN_COPY_LINK_CHAT_ALERT)) {
      window.localStorage.setItem(SEEN_COPY_LINK_CHAT_ALERT, "1");
      openModal();
    }
  }

  return (
    <>
      <div
        onClick={handleClick}
        className="flex items-center px-2 py-1 rounded cursor-pointer hover:bg-zinc-700 light:hover:bg-slate-200"
      >
        <span className="text-sm font-normal text-white light:text-slate-800">
          {copied ? "Link copied!" : "Copy chat link"}
        </span>
      </div>
      <CopyLinkModal
        isOpen={isOpen}
        closeModal={closeModal}
        url={getChatUrl()}
      />
    </>
  );
}

function CopyLinkModal({ isOpen, closeModal, url }) {
  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalHeader title="Chat link copied!" onClose={closeModal} />
      <ModalBody>
        <p className="text-sm text-zinc-400 light:text-slate-500">
          The link to this chat has been copied to your clipboard.
        </p>
        <p className="text-sm text-zinc-400 light:text-slate-500">
          This <strong>does not</strong> change permissions on the chat and is
          simply a way for you to quick link to you own chats.
        </p>
        <div className="px-3 py-2 rounded-md bg-zinc-800 light:bg-slate-100 border border-white/10 light:border-slate-300 text-sm text-white light:text-slate-900 break-all select-all">
          {url}
        </div>
      </ModalBody>
    </Modal>
  );
}

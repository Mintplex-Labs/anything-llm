import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";
import { refocusApplication } from "@/ipc/node-api";
import Workspace from "@/models/workspace";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { DotsThree, PencilSimple, Trash, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import truncate from "truncate";

const THREAD_CALLOUT_DETAIL_WIDTH = 26;
export default function ThreadItem({
  workspace,
  thread,
  onUpdate,
  onRemove,
  hasNext,
}) {
  const optionsContainer = useRef(null);
  const { slug, threadSlug = null } = useParams();
  const [showOptions, setShowOptions] = useState(false);

  const isActive = threadSlug === thread.slug;
  const linkTo = !thread.slug
    ? paths.workspace.chat(slug)
    : paths.workspace.thread(slug, thread.slug);

  return (
    <div className="w-full relative flex h-[40px] items-center border-none hover:bg-slate-600/20 rounded-lg">
      {/* Curved line Element and leader if required */}
      <div
        style={{
          width: THREAD_CALLOUT_DETAIL_WIDTH / 2,
          borderLeftStyle: "solid",
          borderBottomStyle: "solid",
        }}
        className="border-slate-300 h-[50%] absolute top-0 left-2 rounded-bl-lg"
      ></div>
      {hasNext && (
        <div
          style={{
            width: THREAD_CALLOUT_DETAIL_WIDTH / 2,
            borderLeftStyle: "solid",
          }}
          className="border-slate-300 h-[100%] absolute top-0 left-2"
        ></div>
      )}

      {/* Curved line inline placeholder for spacing */}
      <div
        style={{ width: THREAD_CALLOUT_DETAIL_WIDTH }}
        className="w-[26px] h-full"
      />
      <div className="flex w-full items-center justify-between pr-2 group relative">
        <Link to={isActive ? "#" : linkTo} className="w-full">
          <p
            className={`text-left text-sm ${
              isActive
                ? "font-semibold text-slate-300"
                : "text-slate-400 italic"
            }`}
          >
            {truncate(thread.name, 20)}
          </p>
        </Link>
        {!!thread.slug && (
          <div ref={optionsContainer}>
            <div className="flex items-center w-fit group-hover:visible md:invisible gap-x-1">
              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                className="border-none"
              >
                <DotsThree className="text-slate-300" size={25} />
              </button>
            </div>
            {showOptions && (
              <OptionsMenu
                containerRef={optionsContainer}
                workspace={workspace}
                thread={thread}
                onRemove={onRemove}
                onRename={onUpdate}
                close={() => setShowOptions(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function OptionsMenu({
  containerRef,
  workspace,
  thread,
  onRename,
  onRemove,
  close,
}) {
  const { isOpen, openModal, closeModal } = useModal();
  const menuRef = useRef(null);

  // Ref menu options
  const outsideClick = (e) => {
    if (!menuRef.current) return false;
    if (
      !menuRef.current?.contains(e.target) &&
      !containerRef.current?.contains(e.target)
    )
      close();
    return false;
  };

  const isEsc = (e) => {
    if (e.key === "Escape" || e.key === "Esc") close();
  };

  function cleanupListeners() {
    window.removeEventListener("click", outsideClick);
    window.removeEventListener("keyup", isEsc);
  }
  // end Ref menu options

  useEffect(() => {
    function setListeners() {
      if (!menuRef?.current || !containerRef.current) return false;
      window.document.addEventListener("click", outsideClick);
      window.document.addEventListener("keyup", isEsc);
    }

    setListeners();
    return cleanupListeners;
  }, [menuRef.current, containerRef.current]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this thread? All of its chats will be deleted. You cannot undo this."
      )
    ) {
      refocusApplication();
      return;
    }

    refocusApplication();
    const success = await Workspace.threads.delete(workspace.slug, thread.slug);
    if (!success) {
      showToast("Thread could not be deleted!", "error", { clear: true });
      return;
    }
    if (success) {
      showToast("Thread deleted successfully!", "success", { clear: true });
      onRemove(thread.id);
      return;
    }
  };

  return (
    <>
      <div
        ref={menuRef}
        className="absolute w-fit z-[20] top-[25px] right-[10px] bg-zinc-900 rounded-lg p-1"
      >
        <button
          onClick={openModal}
          type="button"
          className="border-none w-full rounded-md flex items-center p-2 gap-x-2 hover:bg-slate-500/20 text-slate-300"
        >
          <PencilSimple size={18} />
          <p className="text-sm">Rename</p>
        </button>
        <button
          onClick={handleDelete}
          type="button"
          className="border-none w-full rounded-md flex items-center p-2 gap-x-2 hover:bg-red-500/20 text-slate-300 hover:text-red-100"
        >
          <Trash size={18} />
          <p className="text-sm">Delete Thread</p>
        </button>
      </div>
      <RenameThreadModal
        isOpen={isOpen}
        onRename={(updatedThread) => {
          onRename(updatedThread);
          close();
        }}
        hideModal={closeModal}
        workspace={workspace}
        thread={thread}
      />
    </>
  );
}

function RenameThreadModal({ isOpen, hideModal, onRename, workspace, thread }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const name = form.get("name");

    if (!name || name.length === 0) {
      hideModal();
      return;
    }

    const { message } = await Workspace.threads.update(
      workspace.slug,
      thread.slug,
      { name }
    );

    if (!!message) {
      showToast(`Thread could not be updated! ${message}`, "error", {
        clear: true,
      });
      hideModal();
      return;
    }

    onRename({ ...thread, name });
    hideModal();
  };

  return (
    <ModalWrapper isOpen={isOpen}>
      <div className="relative w-[500px] max-h-full">
        <div className="relative bg-modal-gradient rounded-lg shadow-md border-2 border-accent">
          <div className="flex items-start justify-between p-4 border-b rounded-t border-white/10">
            <h3 className="text-xl font-semibold text-white">Rename thread</h3>
            <button
              onClick={hideModal}
              type="button"
              className="transition-all duration-300 text-gray-400 bg-transparent hover:border-white/60 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
            >
              <X className="text-gray-300 text-lg" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6 flex h-full w-full">
              <div className="w-full flex flex-col gap-y-4">
                <div>
                  <input
                    name="name"
                    type="text"
                    id="name"
                    className="border-none bg-zinc-900 w-full text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
                    placeholder="New thread"
                    required={true}
                    defaultValue={thread.name}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <div className="flex w-full justify-end items-center p-6 space-x-2 border-t border-white/10 rounded-b">
              <button
                type="submit"
                className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalWrapper>
  );
}

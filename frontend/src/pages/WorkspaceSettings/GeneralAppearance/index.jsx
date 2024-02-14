import PreLoader from "@/components/Preloader";
import System from "@/models/system";
import Workspace from "@/models/workspace";
import { castToType } from "@/utils/types";
import showToast from "@/utils/toast";
import { useEffect, useRef, useState } from "react";
import { Plus, X } from "@phosphor-icons/react";

export default function GeneralInfo({ slug }) {
  const [workspace, setWorkspace] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const formEl = useRef(null);

  useEffect(() => {
    async function fetchWorkspace() {
      const workspace = await Workspace.bySlug(slug);
      setWorkspace(workspace);
      setLoading(false);
    }
    fetchWorkspace();
  }, [slug]);

  const handleUpdate = async (e) => {
    setSaving(true);
    e.preventDefault();
    const data = {};
    const form = new FormData(formEl.current);
    for (var [key, value] of form.entries()) data[key] = castToType(key, value);
    const { workspace: updatedWorkspace, message } = await Workspace.update(
      workspace.slug,
      data
    );
    if (!!updatedWorkspace) {
      showToast("Workspace updated!", "success", { clear: true });
      setTimeout(() => window.location.reload(), 1_500);
    } else {
      showToast(`Error: ${message}`, "error", { clear: true });
    }
    setSaving(false);
    setHasChanges(false);
  };

  if (!workspace || loading) return null;
  return (
    <>
      <form
        ref={formEl}
        onSubmit={handleUpdate}
        className="w-1/2 flex flex-col gap-y-6"
      >
        <VectorCount reload={true} workspace={workspace} />
        <WorkspaceName
          key={workspace.slug}
          workspace={workspace}
          setHasChanges={setHasChanges}
        />

        {hasChanges && (
          <button
            type="submit"
            className="transition-all w-fit duration-300 border border-slate-200 px-5 py-2.5 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
          >
            {saving ? "Updating..." : "Update workspace"}
          </button>
        )}
      </form>
      <div className="mt-6">
        <SuggestedChatMessages slug={workspace.slug} />
      </div>
    </>
  );
}

function VectorCount({ reload, workspace }) {
  const [totalVectors, setTotalVectors] = useState(null);
  useEffect(() => {
    async function fetchVectorCount() {
      const totalVectors = await System.totalIndexes(workspace.slug);
      setTotalVectors(totalVectors);
    }
    fetchVectorCount();
  }, [workspace?.slug, reload]);

  if (totalVectors === null)
    return (
      <div>
        <h3 className="text-white text-sm font-semibold">Number of vectors</h3>
        <p className="text-white text-opacity-60 text-xs font-medium py-1">
          Total number of vectors in your vector database.
        </p>
        <p className="text-white text-opacity-60 text-sm font-medium">
          <PreLoader size="4" />
        </p>
      </div>
    );
  return (
    <div>
      <h3 className="text-white text-sm font-semibold">Number of vectors</h3>
      <p className="text-white text-opacity-60 text-xs font-medium py-1">
        Total number of vectors in your vector database.
      </p>
      <p className="text-white text-opacity-60 text-sm font-medium">
        {totalVectors}
      </p>
    </div>
  );
}

function WorkspaceName({ workspace, setHasChanges }) {
  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block text-sm font-medium text-white">
          Workspace Name
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          This will only change the display name of your workspace.
        </p>
      </div>
      <input
        name="name"
        type="text"
        minLength={2}
        maxLength={80}
        defaultValue={workspace?.name}
        className="bg-zinc-900 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder="My Workspace"
        required={true}
        autoComplete="off"
        onChange={() => setHasChanges(true)}
      />
    </div>
  );
}

function SuggestedChatMessages({ slug }) {
  const [suggestedMessages, setSuggestedMessages] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [newMessage, setNewMessage] = useState({ heading: "", message: "" });
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkspace() {
      if (!slug) return;
      const suggestedMessages = await Workspace.getSuggestedMessages(slug);
      setSuggestedMessages(suggestedMessages);
      setLoading(false);
    }
    fetchWorkspace();
  }, [slug]);

  const handleSaveSuggestedMessages = async () => {
    const validMessages = suggestedMessages.filter(
      (msg) =>
        msg?.heading?.trim()?.length > 0 || msg?.message?.trim()?.length > 0
    );
    const { success, error } = await Workspace.setSuggestedMessages(
      slug,
      validMessages
    );
    if (!success) {
      showToast(`Failed to update welcome messages: ${error}`, "error");
      return;
    }
    showToast("Successfully updated welcome messages.", "success");
    setHasChanges(false);
  };

  const addMessage = () => {
    setEditingIndex(-1);
    if (suggestedMessages.length >= 4) {
      showToast("Maximum of 4 messages allowed.", "warning");
      return;
    }
    const defaultMessage = {
      heading: "Explain to me",
      message: "the benefits of AnythingLLM",
    };
    setNewMessage(defaultMessage);
    setSuggestedMessages([...suggestedMessages, { ...defaultMessage }]);
    setHasChanges(true);
  };

  const removeMessage = (index) => {
    const messages = [...suggestedMessages];
    messages.splice(index, 1);
    setSuggestedMessages(messages);
    setHasChanges(true);
  };

  const startEditing = (e, index) => {
    e.preventDefault();
    setEditingIndex(index);
    setNewMessage({ ...suggestedMessages[index] });
  };

  const handleRemoveMessage = (index) => {
    removeMessage(index);
    setEditingIndex(-1);
  };

  const onEditChange = (e) => {
    const updatedNewMessage = {
      ...newMessage,
      [e.target.name]: e.target.value,
    };
    setNewMessage(updatedNewMessage);
    const updatedMessages = suggestedMessages.map((message, index) => {
      if (index === editingIndex) {
        return { ...message, [e.target.name]: e.target.value };
      }
      return message;
    });

    setSuggestedMessages(updatedMessages);
    setHasChanges(true);
  };

  if (loading)
    return (
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-white">
          Suggested Chat Messages
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          Customize the messages that will be suggested to your workspace users.
        </p>
        <p className="text-white text-opacity-60 text-sm font-medium mt-6">
          <PreLoader size="4" />
        </p>
      </div>
    );
  return (
    <div className="w-screen">
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-white">
          Suggested Chat Messages
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          Customize the messages that will be suggested to your workspace users.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/60 text-xs mt-2 w-full justify-center max-w-[600px]">
        {suggestedMessages.map((suggestion, index) => (
          <div key={index} className="relative w-full">
            <button
              className="transition-all duration-300 absolute z-10 text-neutral-700 bg-white rounded-full hover:bg-zinc-600 hover:border-zinc-600 hover:text-white border-transparent border shadow-lg ml-2"
              style={{
                top: -8,
                left: 265,
              }}
              onClick={() => handleRemoveMessage(index)}
            >
              <X className="m-[1px]" size={20} />
            </button>
            <button
              key={index}
              onClick={(e) => startEditing(e, index)}
              className={`text-left p-2.5 border rounded-xl w-full border-white/20 bg-sidebar hover:bg-workspace-item-selected-gradient ${
                editingIndex === index ? "border-sky-400" : ""
              }`}
            >
              <p className="font-semibold">{suggestion.heading}</p>
              <p>{suggestion.message}</p>
            </button>
          </div>
        ))}
      </div>
      {editingIndex >= 0 && (
        <div className="flex flex-col gap-y-4 mr-2 mt-8">
          <div className="w-1/2">
            <label className="text-white text-sm font-semibold block mb-2">
              Heading
            </label>
            <input
              placeholder="Message heading"
              className=" bg-zinc-900 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full"
              value={newMessage.heading}
              name="heading"
              onChange={onEditChange}
            />
          </div>
          <div className="w-1/2">
            <label className="text-white text-sm font-semibold block mb-2">
              Message
            </label>
            <input
              placeholder="Message"
              className="bg-zinc-900 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full"
              value={newMessage.message}
              name="message"
              onChange={onEditChange}
            />
          </div>
        </div>
      )}
      {suggestedMessages.length < 4 && (
        <button
          type="button"
          onClick={addMessage}
          className="flex gap-x-2 items-center justify-center mt-6 text-white text-sm hover:text-sky-400 transition-all duration-300"
        >
          Add new message <Plus className="" size={24} weight="fill" />
        </button>
      )}

      {hasChanges && (
        <div className="flex justify-start py-6">
          <button
            type="button"
            className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            onClick={handleSaveSuggestedMessages}
          >
            Save Messages
          </button>
        </div>
      )}
    </div>
  );
}

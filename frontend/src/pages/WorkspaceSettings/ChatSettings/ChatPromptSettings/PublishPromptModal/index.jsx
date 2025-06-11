import { X } from "@phosphor-icons/react";
import { useState } from "react";
import CommunityHub from "@/models/communityHub";
import showToast from "@/utils/toast";

export default function PublishPromptModal({ show, onClose, currentPrompt }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const form = new FormData(e.target.closest("form"));
      const data = {
        name: form.get("name"),
        description: form.get("description"),
        prompt: form.get("prompt"),
        tags: tags,
        visibility: form.get("visibility"),
      };

      const { success, error } = await CommunityHub.createSystemPrompt(data);
      if (!success) throw new Error(error);
      showToast("System prompt published successfully!", "success", {
        clear: true,
      });
      onClose();
    } catch (error) {
      console.error("Failed to publish prompt:", error);
      showToast(`Failed to publish prompt: ${error.message}`, "error", {
        clear: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = tagInput.trim();
      if (value && !tags.includes(value)) {
        setTags([...tags, value]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative w-[900px] max-w-full bg-theme-bg-primary rounded-lg shadow border border-theme-modal-border">
        <div className="relative p-6">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white">
              Publish System Prompt
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
          >
            <X size={24} weight="bold" className="text-white" />
          </button>
        </div>

        <form className="flex">
          <div className="w-1/2 p-6 pt-0 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-1">
                Name
              </label>
              <div className="text-xs text-white/60 mb-2">
                This is the display name of your system prompt.
              </div>
              <input
                type="text"
                name="name"
                required
                minLength={3}
                placeholder="My System Prompt"
                className="w-full bg-theme-bg-secondary rounded-lg p-2 text-white text-sm focus:outline-primary-button active:outline-primary-button outline-none placeholder:text-theme-text-placeholder"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-1">
                Description
              </label>
              <div className="text-xs text-white/60 mb-2">
                This is the description of your system prompt. Use this to
                describe the purpose of your system prompt.
              </div>
              <textarea
                name="description"
                required
                minLength={10}
                placeholder="This is the description of your system prompt. Use this to describe the purpose of your system prompt."
                className="w-full bg-theme-bg-secondary rounded-lg p-2 text-white text-sm focus:outline-primary-button active:outline-primary-button outline-none min-h-[80px] placeholder:text-theme-text-placeholder"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-1">
                Tags
              </label>
              <div className="text-xs text-white/60 mb-2">
                Tags are used to label your system prompt for easier searching.
                You can add multiple tags.
              </div>
              <div className="flex flex-wrap gap-2 p-2 bg-theme-bg-secondary rounded-lg min-h-[42px]">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 text-sm text-white bg-white/10 rounded-md"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-white/60 hover:text-white"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 256 256"
                        fill="currentColor"
                      >
                        <path d="M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.49a12 12 0 0 1-17-17L111 128L47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z" />
                      </svg>
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type and press Enter to add tags"
                  className="flex-1 min-w-[200px] border-none bg-transparent text-white placeholder:text-theme-text-placeholder p-0 h-[24px] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-1">
                Visibility
              </label>
              <div className="text-xs text-white/60 mb-2">
                Public system prompts are visible to everyone.
              </div>
              <div className="w-fit h-[42px] bg-theme-bg-secondary rounded-lg p-0.5">
                <div className="flex items-center" role="group">
                  <input
                    type="radio"
                    id="public"
                    name="visibility"
                    value="public"
                    className="peer/public hidden"
                    defaultChecked
                  />
                  <input
                    type="radio"
                    id="private"
                    name="visibility"
                    value="private"
                    className="peer/private hidden"
                  />
                  <label
                    htmlFor="public"
                    className="h-[36px] px-4 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer text-white/60 hover:text-white peer-checked/public:bg-theme-action-menu-bg peer-checked/public:text-white flex items-center justify-center"
                  >
                    Public
                  </label>
                  <label
                    htmlFor="private"
                    className="h-[36px] px-4 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer text-white/60 hover:text-white peer-checked/private:bg-theme-action-menu-bg peer-checked/private:text-white flex items-center justify-center"
                  >
                    Private
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="w-1/2 p-6 pt-0 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-1">
                Prompt
              </label>
              <div className="text-xs text-white/60 mb-2">
                This is the actual slash command that will be used to guide the
                LLM.
              </div>
              <textarea
                name="prompt"
                required
                minLength={10}
                defaultValue={currentPrompt}
                placeholder="Enter your system prompt here..."
                className="w-full bg-theme-bg-secondary rounded-lg p-2 text-white text-sm focus:outline-primary-button active:outline-primary-button outline-none min-h-[300px] placeholder:text-theme-text-placeholder"
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-cta-button hover:bg-opacity-80 text-theme-bg-primary font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Publishing..." : "Publish to Community Hub"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

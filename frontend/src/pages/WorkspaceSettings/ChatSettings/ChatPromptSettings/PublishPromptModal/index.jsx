import { useState } from "react";
import { X } from "@phosphor-icons/react";

export default function PublishPromptModal({ show, onClose, currentPrompt }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    prompt: currentPrompt || "",
    tags: "",
    visibility: "public",
  });

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
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

        <form onSubmit={handleSubmit} className="flex">
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
                value={formData.name}
                placeholder="My System Prompt"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
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
                value={formData.description}
                placeholder="This is the description of your system prompt. Use this to describe the purpose of your system prompt."
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
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
              <input
                type="text"
                value={formData.tags}
                placeholder="tag1, tag2, tag3"
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className="w-full bg-theme-bg-secondary rounded-lg p-2 text-white text-sm focus:outline-primary-button active:outline-primary-button outline-none placeholder:text-theme-text-placeholder"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-1">
                Visibility
              </label>
              <div className="text-xs text-white/60 mb-2">
                Public system prompts are visible to everyone. Private system
                prompts are only visible to you and your team.
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={formData.visibility === "public"}
                    onChange={(e) =>
                      setFormData({ ...formData, visibility: e.target.value })
                    }
                    className="mr-2"
                  />
                  <span className="text-white text-sm">Public</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={formData.visibility === "private"}
                    onChange={(e) =>
                      setFormData({ ...formData, visibility: e.target.value })
                    }
                    className="mr-2"
                  />
                  <span className="text-white text-sm">Private</span>
                </label>
              </div>
              <div className="text-xs text-white/60 mt-2">
                Private system prompts are currently in early access - you can
                apply via email to contacting support.
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
                value={formData.prompt}
                placeholder="Enter your system prompt here..."
                onChange={(e) =>
                  setFormData({ ...formData, prompt: e.target.value })
                }
                className="w-full bg-theme-bg-secondary rounded-lg p-2 text-white text-sm focus:outline-primary-button active:outline-primary-button outline-none min-h-[300px] placeholder:text-theme-text-placeholder"
              />
            </div>

            <button
              type="submit"
              form="publish-form"
              className="w-full bg-cta-button hover:bg-opacity-80 text-theme-bg-primary font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Create slash command
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

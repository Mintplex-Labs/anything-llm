import SettingsSidebar from "@/components/SettingsSidebar";
import { useEffect, useState, Fragment } from "react";
import { isMobile } from "react-device-detect";
import System from "@/models/system";
import showToast from "@/utils/toast";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Highlighter from "react-highlight-words";
import SystemPromptVariable from "@/models/systemPromptVariable";
import { Link } from "react-router-dom";
import paths from "@/utils/paths";

export default function DefaultSystemPrompt() {
  const [systemPromptForm, setSystemPromptForm] = useState({
    value: "",
    default: "",
    isDirty: false,
    isSubmitting: false,
    isLoading: true,
    isEditing: false,
  });
  const [saneDefaultSystemPrompt, setSaneDefaultSystemPrompt] = useState("");
  const [availableVariables, setAvailableVariables] = useState([]);
  useEffect(() => {
    async function setupVariableHighlighting() {
      const { variables } = await SystemPromptVariable.getAll();
      setAvailableVariables(variables);
    }
    setupVariableHighlighting();
  }, []);

  useEffect(() => {
    async function fetchDefaultSystemPrompt() {
      setSystemPromptForm((prev) => ({
        ...prev,
        isLoading: true,
      }));
      const { defaultSystemPrompt, saneDefaultSystemPrompt } =
        await System.fetchDefaultSystemPrompt();
      setSaneDefaultSystemPrompt(saneDefaultSystemPrompt);
      if (!defaultSystemPrompt)
        return setSystemPromptForm((prev) => ({
          ...prev,
          isLoading: false,
        }));

      setSystemPromptForm((prev) => ({
        ...prev,
        default: defaultSystemPrompt,
        value: defaultSystemPrompt,
        isLoading: false,
      }));
    }
    fetchDefaultSystemPrompt();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    const isDirty = value !== systemPromptForm.default;

    setSystemPromptForm((prev) => ({
      ...prev,
      value,
      isDirty,
      isSubmitting: false,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSystemPromptForm((prev) => ({
      ...prev,
      isSubmitting: true,
    }));
    const newSystemPrompt = systemPromptForm.value.trim();
    await System.updateDefaultSystemPrompt(newSystemPrompt)
      .then(({ success, message }) => {
        if (!success) throw new Error(message);

        // If the user has set the default system prompt to the sane default, reset the value to the sane default.
        if (
          !newSystemPrompt ||
          newSystemPrompt.trim() === saneDefaultSystemPrompt
        ) {
          return setSystemPromptForm((prev) => ({
            ...prev,
            value: saneDefaultSystemPrompt,
          }));
        }

        showToast("Default system prompt updated successfully.", "success");
        setSystemPromptForm((prev) => ({
          ...prev,
          default: newSystemPrompt,
          isDirty: false,
          isSubmitting: false,
        }));
      })
      .catch((error) => {
        showToast(
          `Failed to update default system prompt: ${error.message}`,
          "error"
        );
        setSystemPromptForm((prev) => ({
          ...prev,
          isSubmitting: false,
        }));
      });
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <SettingsSidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white/10 border-b-2">
            <div className="items-center flex gap-x-4">
              <p className="text-lg leading-6 font-bold text-theme-text-primary">
                Default System Prompt
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary">
              This is the default system prompt that will be used for new
              workspaces.
            </p>
          </div>
          <div>
            {systemPromptForm.isLoading ? (
              <div className="mt-8 flex flex-col gap-y-4">
                <Skeleton.default
                  height={20}
                  width={160}
                  highlightColor="var(--theme-bg-primary)"
                  baseColor="var(--theme-bg-secondary)"
                />
                <Skeleton.default
                  height={120}
                  width="100%"
                  highlightColor="var(--theme-bg-primary)"
                  baseColor="var(--theme-bg-secondary)"
                  className="rounded-lg"
                />
                <Skeleton.default
                  height={36}
                  width={140}
                  highlightColor="var(--theme-bg-primary)"
                  baseColor="var(--theme-bg-secondary)"
                />
              </div>
            ) : (
              <div className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <label
                    htmlFor="default-system-prompt"
                    className=" text-base font-bold text-white"
                  >
                    System Prompt
                  </label>
                  <div className="space-y-1">
                    <p className="text-white text-opacity-60 text-xs font-medium">
                      A system prompt provides instructions that shape the AI’s
                      responses and behavior. This prompt will be automatically
                      applied to all newly created workspaces. To change the
                      system prompt of a{" "}
                      <span className="font-bold">specific workspace</span>,
                      edit the prompt in the{" "}
                      <span className="font-bold">workspace settings</span>. To
                      restore the system prompt to our sane default, leave this
                      field empty and save changes.
                    </p>
                    <p className="text-white text-opacity-60 text-xs font-medium mb-2">
                      You can insert{" "}
                      <Link
                        to={paths.settings.systemPromptVariables()}
                        className="text-primary-button"
                      >
                        system prompt variables
                      </Link>{" "}
                      like:{" "}
                      {availableVariables.slice(0, 3).map((v, i) => (
                        <Fragment key={v.key}>
                          <span className="bg-theme-settings-input-bg px-1 py-0.5 rounded">
                            {`{${v.key}}`}
                          </span>
                          {i < availableVariables.length - 1 && ", "}
                        </Fragment>
                      ))}
                      {availableVariables.length > 3 && (
                        <Link
                          to={paths.settings.systemPromptVariables()}
                          className="text-primary-button"
                        >
                          +{availableVariables.length - 3} more...
                        </Link>
                      )}
                    </p>
                  </div>

                  {systemPromptForm.isEditing ? (
                    <textarea
                      autoFocus={true}
                      value={systemPromptForm.value}
                      onChange={handleChange}
                      onBlur={() =>
                        setSystemPromptForm((prev) => ({
                          ...prev,
                          isEditing: false,
                        }))
                      }
                      placeholder={
                        systemPromptForm.isLoading
                          ? "Loading..."
                          : "You are an AI assistant that can answer questions and help with tasks."
                      }
                      rows={5}
                      style={{
                        resize: "vertical",
                        overflowY: "scroll",
                        minHeight: "150px",
                      }}
                      className="w-full border-none bg-theme-settings-input-bg placeholder:text-theme-settings-input-placeholder text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block p-2.5"
                    />
                  ) : (
                    <div
                      onClick={() =>
                        setSystemPromptForm((prev) => ({
                          ...prev,
                          isEditing: true,
                        }))
                      }
                      style={{
                        resize: "vertical",
                        overflowY: "scroll",
                        minHeight: "150px",
                      }}
                      className="w-full border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block p-2.5 cursor-text"
                    >
                      <Highlighter
                        className="whitespace-pre-wrap"
                        highlightClassName="bg-cta-button p-0.5 rounded-md"
                        searchWords={availableVariables.map(
                          (v) => `{${v.key}}`
                        )}
                        autoEscape={true}
                        caseSensitive={true}
                        textToHighlight={systemPromptForm.value || ""}
                      />
                    </div>
                  )}
                  <button
                    disabled={
                      !systemPromptForm.isDirty || systemPromptForm.isSubmitting
                    }
                    className={`enabled:hover:bg-secondary enabled:hover:text-white rounded-lg bg-primary-button w-fit py-2 px-4 font-semibold text-xs disabled:opacity-20 disabled:cursor-not-allowed`}
                    type="submit"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

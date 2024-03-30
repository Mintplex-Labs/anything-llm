import ToggleBlock from "@/components/Generic/Blocks/ToggleBlock";
import showToast from "@/utils/toast";
import { useState } from "react";

export default function EnableSystemPrompt({
  settings,
  onUpdateSettings,
  content,
}) {
  const [isEnabled, setIsEnabled] = useState(
    settings.config.systemPrompt.isEnabled ||
      settings.config.systemPrompt.list[settings.config.systemPrompt.active]
        .content
  );

  const toggleSystemPrompt = () => {
    onUpdateSettings({
      ...settings,
      config: {
        ...settings.config,
        systemPrompt: {
          ...settings.config.systemPrompt,
          isEnabled: !isEnabled,
        },
      },
    });
    setIsEnabled(!isEnabled);
    showToast(
      isEnabled
        ? "System Prompt has been disabled"
        : "System Prompt has been enabled",
      "success",
      { clear: true }
    );
  };

  return (
    <div className="relative w-full max-h-full ">
      <ToggleBlock
        initialChecked={isEnabled}
        label={
          isEnabled
            ? "System Prompt (Handled by Meta Response Inputs)"
            : "Handle System Prompt - (optional)"
        }
        onToggle={toggleSystemPrompt}
        name="systemPrompt"
        description="Specify the context and instructions for the AI in this workspace. A well-defined prompt ensures the AI delivers relevant and precise responses."
        inline
        content={content}
        disabled={
          settings.config.systemPrompt.list[settings.config.systemPrompt.active]
            .content
        }
      />
    </div>
  );
}

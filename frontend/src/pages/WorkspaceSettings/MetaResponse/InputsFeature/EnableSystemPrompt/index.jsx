import ToggleBlock from "@/components/Generic/Blocks/ToggleBlock";
import { useState } from "react";

export default function EnableSystemPrompt({ workspace, config }) {
  const [isEnabled, setIsEnabled] = useState(config.systemPrompt.isEnabled);
  const toggleSystemPrompt = () => {
    setIsEnabled(!isEnabled);
  };

  return (
    <div className="relative w-full max-h-full ">
      <ToggleBlock
        initialChecked={config.systemPrompt.isEnabled}
        label={
          config.systemPrompt.isEnabled
            ? "System Prompt is Enabled - (optional)"
            : "Enable System Prompt - (optional)"
        }
        onToggle={toggleSystemPrompt}
        name="systemPrompt"
        description="Specify the context and instructions for the AI in this workspace. A well-defined prompt ensures the AI delivers relevant and precise responses."
        inline
      />
    </div>
  );
}

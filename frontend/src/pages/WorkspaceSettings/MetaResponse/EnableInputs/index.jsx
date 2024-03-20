import ToggleBlock from "@/components/Generic/Blocks/ToggleBlock";
import { List } from "@phosphor-icons/react";

export default function EnableInputs({ inputs, onToggle }) {
  return (
    <div className="relative w-full max-h-full ">
      <ToggleBlock
        initialChecked={inputs?.isEnabled}
        label={inputs?.isEnabled ? "Inputs is Enabled" : "Enable Inputs"}
        onToggle={onToggle}
        name="inputs"
        description="Traditionally, interaction with AnythingLLM occurs through a text area. Meta Inputs enhance this by offering alternative interaction methods, including option buttons, multi-select checkboxes, sliders, drop-down menus, and date/time selectors. To utilize these components, you'll need to guide the LLM on incorporating them into its responses with a specific schema"
        badge
        border
        Icon={List}
      />
    </div>
  );
}

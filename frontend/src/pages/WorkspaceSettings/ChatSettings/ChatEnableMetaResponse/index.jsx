import GenericBadge from "@/components/Generic/Badges/Badge";
import ToggleBlock from "@/components/Generic/Blocks/ToggleBlock";

export default function ChatEnableMetaResponse({ workspace, setHasChanges }) {
  // Toggle metaResponse value

  const toggleMetaResponse = () => {
    setHasChanges(true);
  };
  return (
    <div className="relative w-full max-h-full">
      <ToggleBlock
        initialChecked={workspace?.metaResponse}
        label={
          workspace.metaResponse
            ? "Meta Response is Enabled"
            : "Enable Meta Response"
        }
        onToggle={toggleMetaResponse}
        name="metaResponse"
        description="Turn on this feature to dynamically adjust the chat interface based on conversation context, using options like dropdowns, sliders, and suggestions for a tailored user experience."
      />
    </div>
  );
}

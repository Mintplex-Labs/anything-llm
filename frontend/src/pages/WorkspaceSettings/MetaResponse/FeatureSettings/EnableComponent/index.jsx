import ToggleBlock from "@/components/Generic/Blocks/ToggleBlock";

export default function EnableComponent({
  component,
  isEnabled,
  description,
  onToggle,
  Icon,
  content,
  disabled,
  bg,
}) {
  return (
    <div className="relative w-full max-h-full ">
      <ToggleBlock
        initialChecked={isEnabled}
        label={isEnabled ? `${component} is Enabled` : `Enable ${component}`}
        onToggle={onToggle}
        name={component}
        description={description}
        border
        Icon={Icon}
        content={content}
        disabled={disabled}
        bg={bg}
      />
    </div>
  );
}

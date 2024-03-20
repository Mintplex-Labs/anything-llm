import ToggleBlock from "@/components/Generic/Blocks/ToggleBlock";

export default function EnableFeatures({
  feature,
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
        label={isEnabled ? `${feature} is Enabled` : `Enable ${feature}`}
        onToggle={onToggle}
        name={feature}
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

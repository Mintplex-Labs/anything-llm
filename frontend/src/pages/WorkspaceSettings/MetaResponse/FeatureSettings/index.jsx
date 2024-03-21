import TextAreaBlock from "@/components/Generic/Blocks/TextAreaBlock";
import EnableSystemPrompt from "./EnableSystemPrompt";
import CheckBoxBlock from "@/components/Generic/Blocks/CheckBoxBlock";
import TitleBlock from "@/components/Generic/Blocks/TitleBlock";
import ToggleBlock from "@/components/Generic/Blocks/ToggleBlock";
import TextArea from "@/components/Generic/Inputs/TextArea";

export default function FeatureSettings({
  workspace,
  settings,
  onUpdateSettings,
}) {
  return (
    <div className="flex flex-col gap-2 mt-4 pt-8 border-t-2 border-white/10">
      <EnableSystemPrompt
        workspace={workspace}
        settings={settings}
        onUpdateSettings={onUpdateSettings}
      />
      {settings.config.systemPrompt.isEnabled && (
        <>
          <TextAreaBlock workspace={workspace} />
          <CheckBoxBlock
            workspace={workspace}
            label="override workspace prompt"
            inline
            name="systemPrompt"
          />
        </>
      )}
      <TitleBlock
        label="Prompt-schema"
        description="Define the schema context and instructions for the AI to generate a response. You should to provide a carefully crafted prompt so the AI can generate a relevant and accurate response."
      />
      <TextArea
        name="openAiPrompt"
        defaultValue={settings.config.openAiPrompt}
        placeholder="Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed."
        onChange={(e) =>
          onUpdateSettings({
            ...settings,
            config: {
              ...settings.config,
              openAiPrompt: e.target.value,
            },
          })
        }
      />
      <TitleBlock
        label="Components"
        description="Select components for your schema, if you have specified a drop-down menu schema chose the drop-down menu component and remove the rest to get consistent results."
        labelStyles="text-md font-bold text-white"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {Object.keys(settings.config.components).map((component, index) => {
          const componentLabel = component
            .split(/(?=[A-Z])/)
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            .join(" ");
          const _componentLabel = settings.config.components[component]
            .isEnabled
            ? `${componentLabel} (Enabled)`
            : `Enable ${componentLabel}`;
          const handleComponentUpdate = (enabled) => {
            onUpdateSettings({
              ...settings,
              config: {
                ...settings.config,
                components: {
                  ...settings.config.components,
                  [component]: {
                    ...settings.config.components[component],
                    isEnabled: enabled,
                  },
                },
              },
            });
            showToast(
              `${componentLabel} has been ${enabled ? "enabled" : "disabled"}`,
              "success",
              { clear: true }
            );
          };
          return (
            <div key={component}>
              <ToggleBlock
                initialChecked={settings.config.components[component].isEnabled}
                label={_componentLabel}
                onToggle={handleComponentUpdate}
                name={component}
                description={settings.config.components[component].description}
                inline
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

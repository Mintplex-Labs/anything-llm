import TextAreaBlock from "@/components/Generic/Blocks/TextAreaBlock";
import EnableSystemPrompt from "./EnableSystemPrompt";
import CheckBoxBlock from "@/components/Generic/Blocks/CheckBoxBlock";
import TitleBlock from "@/components/Generic/Blocks/TitleBlock";
import ToggleBlock from "@/components/Generic/Blocks/ToggleBlock";
import TextArea from "@/components/Generic/Inputs/TextArea";
import Badge from "@/components/Generic/Badges/Badge";

export default function FeatureSettings({
  workspace,
  settings,
  onUpdateSettings,
}) {
  return (
    <div className="flex flex-col gap-6 mt-4 pt-8 border-t-2 border-white/10">
      <div>
        <EnableSystemPrompt
          workspace={workspace}
          settings={settings}
          onUpdateSettings={onUpdateSettings}
        />
        {settings.config.systemPrompt.isEnabled && (
          <div className="flex flex-col gap-2">
            <TextAreaBlock
              workspace={workspace}
              label="System Prompt"
              description="Specify the context and instructions for the AI in this workspace. A well-defined prompt ensures the AI delivers relevant and precise responses."
              name="systemPrompt"
              defaultValue={settings.config.systemPrompt.content}
              onSave={(newContent) =>
                onUpdateSettings({
                  ...settings,
                  config: {
                    ...settings.config,
                    systemPrompt: {
                      ...settings.config.systemPrompt,
                      content: newContent,
                    },
                  },
                })
              }
              code
              initialRows={6}
            />
            <CheckBoxBlock
              workspace={workspace}
              label="override workspace prompt"
              inline
              name="overrideSystemPrompt"
              initialChecked={settings.config.systemPrompt.override}
              onToggle={(override) =>
                onUpdateSettings({
                  ...settings,
                  config: {
                    ...settings.config,
                    systemPrompt: {
                      ...settings.config.systemPrompt,
                      override,
                    },
                  },
                })
              }
            />
          </div>
        )}
      </div>
      <div>
        <TitleBlock
          label="Prompt-schema"
          description="Define the schema context and instructions for the AI to generate a response. You should to provide a carefully crafted prompt so the AI can generate a relevant and accurate response."
        />
        <div className=" flex gap-1 -mb-1 mt-4">
          {settings.config.promptSchema.schemas.map((schema, index) => (
            <Badge
              key={`schema_${index}`}
              size="md"
              rounded="md"
              label={`${schema.title}`}
            />
          ))}
        </div>
        <TextArea
          name="openAiPrompt"
          defaultValue={settings.config.promptSchema.content}
          placeholder="Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed."
          onSave={(e) =>
            onUpdateSettings({
              ...settings,
              config: {
                ...settings.config,
                promptSchema: {
                  ...settings.config.promptSchema,
                  content: e,
                },
              },
            })
          }
          code
          initialRows={6}
        />
      </div>
      <div>
        <TitleBlock
          label="Components"
          description="Select components for your schema, if you have specified a drop-down menu schema chose the drop-down menu component and remove the rest to get consistent results."
          labelStyles="text-md font-bold text-white"
          divider
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
                `${componentLabel} has been ${
                  enabled ? "enabled" : "disabled"
                }`,
                "success",
                { clear: true }
              );
            };
            return (
              <div key={component}>
                <ToggleBlock
                  initialChecked={
                    settings.config.components[component].isEnabled
                  }
                  label={_componentLabel}
                  onToggle={handleComponentUpdate}
                  name={component}
                  description={
                    settings.config.components[component].description
                  }
                  inline
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

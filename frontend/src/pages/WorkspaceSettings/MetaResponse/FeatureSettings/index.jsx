import Badge from "@/components/Generic/Badges/Badge";
import TextAreaBlock from "@/components/Generic/Blocks/TextAreaBlock";
import TitleBlock from "@/components/Generic/Blocks/TitleBlock";
import ToggleBlock from "@/components/Generic/Blocks/ToggleBlock";
import Button from "@/components/Generic/Buttons/Button";
import TextArea from "@/components/Generic/Inputs/TextArea";
import showToast from "@/utils/toast";
import EnableSystemPrompt from "./EnableSystemPrompt";

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
        {settings.config.systemPrompt.list[settings.config.systemPrompt.active]
          .content || settings.config.systemPrompt.isEnabled ? (
          <div className="flex flex-col gap-2">
            <div>
              <div className=" flex gap-1 -mb-1 mt-4 flex-wrap items-center">
                {settings.config.systemPrompt.list.map((item, index) => (
                  <Badge
                    key={`schema_${index}`}
                    showClose
                    size="md"
                    rounded="md"
                    label={`${item?.title}`}
                    active={settings.config.systemPrompt.active === index}
                    onSelect={
                      // fill systemPrompt.active with index of selected item
                      (e) => {
                        e.stopPropagation();
                        console.log("selected item", item);
                        onUpdateSettings({
                          ...settings,
                          config: {
                            ...settings.config,
                            systemPrompt: {
                              ...settings.config.systemPrompt,
                              active: index,
                            },
                          },
                        });
                        showToast(
                          `Schema ${item.title} has been selected`,
                          "success",
                          { clear: true }
                        );
                      }
                    }
                    onDoubleClick={() => {
                      // rename item
                      console.log("renaming item", item);
                      const newSchemas = settings.config.systemPrompt.list.map(
                        (s, i) => {
                          if (i === index) {
                            return {
                              ...s,
                              title:
                                prompt("Enter new item title", s.title) ||
                                s.title,
                            };
                          }
                          return s;
                        }
                      );
                      console.log("New item", newSchemas);
                      onUpdateSettings({
                        ...settings,
                        config: {
                          ...settings.config,
                          systemPrompt: {
                            ...settings.config.systemPrompt,
                            list: newSchemas,
                          },
                        },
                      });
                    }}
                    onClose={(e) => {
                      e.stopPropagation();
                      if (settings.config.systemPrompt.list.length === 1) {
                        showToast("Cannot remove last schema", "error", {
                          clear: true,
                        });
                        return;
                      }
                      const newSchemas =
                        settings.config.systemPrompt.list.filter(
                          (_, i) => i !== index
                        );
                      const active = settings.config.systemPrompt.active;
                      const newActive = active === index ? active - 1 : active;
                      onUpdateSettings({
                        ...settings,
                        config: {
                          ...settings.config,
                          systemPrompt: {
                            ...settings.config.systemPrompt,
                            list: newSchemas,
                            active: newActive,
                          },
                        },
                      });
                      showToast(
                        `Schema ${item.title} has been removed`,
                        "success",
                        {
                          clear: true,
                        }
                      );
                    }}
                  />
                ))}
                <Button
                  text="+"
                  onClick={() => {
                    const newSchema = {
                      title: prompt("Enter new item title"),
                      content: "",
                    };
                    // if cancel is clicked
                    if (!newSchema.title) return;
                    const newSchemas = [
                      ...settings.config.systemPrompt.list,
                      newSchema,
                    ];
                    onUpdateSettings({
                      ...settings,
                      config: {
                        ...settings.config,
                        systemPrompt: {
                          ...settings.config.systemPrompt,
                          list: newSchemas,
                          active: newSchemas.length - 1,
                        },
                      },
                    });
                    showToast(
                      `Schema ${newSchema.title} has been added`,
                      "success",
                      {
                        clear: true,
                      }
                    );
                  }}
                />
              </div>
              <TextArea
                name="openAiPrompt"
                value={
                  // use value instead of defaultValue
                  settings.config.systemPrompt.list[
                    settings.config.systemPrompt.active
                  ].content
                }
                placeholder="Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed."
                onSave={
                  // fill systemPrompt.list[active].content with new content
                  (newContent) => {
                    const newSchemas = settings.config.systemPrompt.list.map(
                      (item, idx) => {
                        if (idx === settings.config.systemPrompt.active) {
                          return {
                            ...item,
                            content: newContent,
                          };
                        }
                        return item;
                      }
                    );
                    onUpdateSettings({
                      ...settings,
                      config: {
                        ...settings.config,
                        systemPrompt: {
                          ...settings.config.systemPrompt,
                          list: newSchemas,
                        },
                      },
                    });
                  }
                }
                code
                initialRows={6}
              />
            </div>
          </div>
        ) : null}
      </div>
      <div>
        <TitleBlock
          label="Inputs Schema"
          description="Define the schema context and instructions for the AI to generate a response. You should to provide a carefully crafted prompt so the AI can generate a relevant and accurate response."
        />
        <div className=" flex gap-1 -mb-1 mt-4 flex-wrap items-center">
          {settings.config.promptSchema.list.map((item, index) => (
            <Badge
              key={`schema_${index}`}
              showClose
              size="md"
              rounded="md"
              label={`${item?.title}`}
              active={settings.config.promptSchema.active === index}
              onSelect={
                // fill promptSchema.active with index of selected item
                (e) => {
                  e.stopPropagation();
                  console.log("selected item", item);
                  onUpdateSettings({
                    ...settings,
                    config: {
                      ...settings.config,
                      promptSchema: {
                        ...settings.config.promptSchema,
                        active: index,
                      },
                    },
                  });
                  showToast(
                    `Schema ${item.title} has been selected`,
                    "success",
                    { clear: true }
                  );
                }
              }
              onDoubleClick={() => {
                // rename item
                console.log("renaming item", item);
                const newSchemas = settings.config.promptSchema.list.map(
                  (s, i) => {
                    if (i === index) {
                      return {
                        ...s,
                        title:
                          prompt("Enter new item title", s.title) || s.title,
                      };
                    }
                    return s;
                  }
                );
                console.log("New item", newSchemas);
                onUpdateSettings({
                  ...settings,
                  config: {
                    ...settings.config,
                    promptSchema: {
                      ...settings.config.promptSchema,
                      list: newSchemas,
                    },
                  },
                });
              }}
              onClose={(e) => {
                e.stopPropagation();
                if (settings.config.promptSchema.list.length === 1) {
                  showToast("Cannot remove last schema", "error", {
                    clear: true,
                  });
                  return;
                }
                const newSchemas = settings.config.promptSchema.list.filter(
                  (_, i) => i !== index
                );
                const active = settings.config.promptSchema.active;
                const newActive = active === index ? active - 1 : active;
                onUpdateSettings({
                  ...settings,
                  config: {
                    ...settings.config,
                    promptSchema: {
                      ...settings.config.promptSchema,
                      list: newSchemas,
                      active: newActive,
                    },
                  },
                });
                showToast(`Schema ${item.title} has been removed`, "success", {
                  clear: true,
                });
              }}
            />
          ))}
          <Button
            text="+"
            onClick={() => {
              const newSchema = {
                title: prompt("Enter new item title"),
                content: "",
              };
              // if cancel is clicked
              if (!newSchema.title) return;
              const newSchemas = [
                ...settings.config.promptSchema.list,
                newSchema,
              ];
              onUpdateSettings({
                ...settings,
                config: {
                  ...settings.config,
                  promptSchema: {
                    ...settings.config.promptSchema,
                    list: newSchemas,
                    active: newSchemas.length - 1,
                  },
                },
              });
              showToast(`Schema ${newSchema.title} has been added`, "success", {
                clear: true,
              });
            }}
          />
        </div>
        <TextArea
          name="openAiPrompt"
          value={
            // use value instead of defaultValue
            settings.config.promptSchema.list[
              settings.config.promptSchema.active
            ].content
          }
          placeholder="Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed."
          onSave={
            // fill promptSchema.list[active].content with new content
            (newContent) => {
              const newSchemas = settings.config.promptSchema.list.map(
                (item, idx) => {
                  if (idx === settings.config.promptSchema.active) {
                    return {
                      ...item,
                      content: newContent,
                    };
                  }
                  return item;
                }
              );
              onUpdateSettings({
                ...settings,
                config: {
                  ...settings.config,
                  promptSchema: {
                    ...settings.config.promptSchema,
                    list: newSchemas,
                  },
                },
              });
            }
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
                  disabled={settings.config.components[component].isDefault}
                  badge={settings.config.components[component].isDefault}
                  badgeLabel="Default"
                  badgeBg="bg-gray-500"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

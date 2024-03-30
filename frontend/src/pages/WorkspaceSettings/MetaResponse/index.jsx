import TitleBlock from "@/components/Generic/Blocks/TitleBlock";
import MetaResponse from "@/models/metaResponse";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import { ChatText, Cube, Heart, UserCircle } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import EnableFeatures from "./EnableFeatures";
import FeatureSettings from "./FeatureSettings";

export default function MetaResponseSettings({ workspace, setWorkspace }) {
  const [settings, setSettings] = useState({});
  useEffect(() => {
    const fetchMetaResponseSettings = async () => {
      const settings = await MetaResponse.getMetaResponseSettings(
        workspace.slug
      );
      console.log(settings);
      setSettings(settings);
    };
    fetchMetaResponseSettings();
  }, []);

  const handleToggleEnableFeatures = async (feature, enabled) => {
    let updatedFeatureSettings = {
      ...settings[feature],
      isEnabled: enabled,
    };
    // if enabling a feature, set the systemPrompt content to openAiPrompt and clear openAiPrompt
    if (settings[feature].config.systemPrompt.openAiPrompt != "") {
      console.log(
        "settings[feature].config.systemPrompt.openAiPrompt: ",
        settings[feature].config.systemPrompt.openAiPrompt
      );
      updatedFeatureSettings = {
        ...updatedFeatureSettings,
        config: {
          ...settings[feature].config,
          systemPrompt: {
            ...settings[feature].config.systemPrompt,
            content: settings[feature].config.systemPrompt.openAiPrompt,
            openAiPrompt: "",
          },
        },
      };
      // if disabling a feature, clear the systemPrompt.openAiPrompt for all other features
      Object.keys(settings).map((f) => {
        if (f !== feature) {
          const featureSettings = settings[f];
          if (featureSettings.config.systemPrompt.openAiPrompt !== "") {
            const updatedFeatureSettings = {
              ...featureSettings,
              config: {
                ...featureSettings.config,
                systemPrompt: {
                  ...featureSettings.config.systemPrompt,
                  openAiPrompt: "",
                },
              },
            };
            settings[f] = updatedFeatureSettings;
          }
        }
      });
    }

    const updatedSettings = await MetaResponse.updateMetaResponseSettings(
      workspace.slug,
      {
        ...settings,
        [feature]: updatedFeatureSettings,
      }
    );

    console.log("updatedSettings: - ", updatedSettings);
    setSettings(updatedSettings);
    showToast(
      `${feature} has been ${enabled ? "enabled" : "disabled"}`,
      "success",
      { clear: true }
    );
  };

  const handleUpdateFeatureSettings = async (
    feature,
    updatedFeatureSettings
  ) => {
    try {
      const updatedSettings = await MetaResponse.updateMetaResponseSettings(
        workspace.slug,
        {
          ...settings,
          [feature]: updatedFeatureSettings,
        }
      );
      setSettings(updatedSettings);
    } catch (error) {
      console.error(
        " Error while updating feature settings in MetaResponseSettings: ",
        error
      );
      showToast(`Error: ${error.message}`, "error", { clear: true });
    }
  };

  const handleUpdateWorkspaceOpenAiPrompt = async () => {
    const openAiPrompt = () => {
      let openAiPrompt = "";
      Object.keys(settings).map((feature) => {
        const featureSettings = settings[feature];
        if (featureSettings.isEnabled) {
          openAiPrompt +=
            featureSettings.config.systemPrompt.list[
              featureSettings.config.systemPrompt.active
            ].content;
          openAiPrompt +=
            featureSettings.config.promptSchema.list[
              featureSettings.config.promptSchema.active
            ].content;
          Object.keys(featureSettings.config.components).map((component) => {
            const componentSettings =
              featureSettings.config.components[component];
            if (componentSettings.isEnabled) {
              openAiPrompt += componentSettings.schema;
            }
          });
        }
      });
      return openAiPrompt;
    };
    try {
      const updatedSettings = await Workspace.update(workspace.slug, {
        openAiPrompt: openAiPrompt(),
      });
      if (!updatedSettings) return;
      setWorkspace(updatedSettings.workspace);
    } catch (error) {
      console.error(
        " Error while updating workspace.openAiPrompt in MetaResponseSettings: ",
        error
      );
      showToast(`Error: ${error.message}`, "error", { clear: true });
    }
  };

  useEffect(() => {
    if (
      workspace.metaResponse &&
      Object.keys(settings).length > 0 &&
      Object.values(settings).some((feature) => feature.isEnabled)
    ) {
      handleUpdateWorkspaceOpenAiPrompt();
    }
  }, [settings]);

  const mapIcons = {
    inputs: ChatText,
    sentiments: Heart,
    avatars: UserCircle,
  };

  //   const mapFeatures = {
  //     inputs: InputsFeature,
  //     sentiments: SentimentsFeature,
  //     avatars: AvatarsFeature,
  //   };

  return (
    <div className="flex flex-col gap-4 max-w-3xl">
      <div className="px-4">
        <TitleBlock
          label="Meta Response"
          description="This feature lets you dictate app behavior through AI-generated responses, using a specific schema to structure data. It aligns with specially designed components that interpret this schema, enabling custom configurations for managing these components efficiently. runs better with OPENAI GPT-4 or nay advanced LLM model."
          labelStyles="text-2xl font-semi-bold text-white"
          Icon={Cube}
        />
      </div>
      <div className="relative w-full gap-4 max-h-full grid grid-cols-1 lg:grid-cols-2  ">
        {Object.keys(settings).map((feature) => {
          const featureSettings = settings[feature];
          const IconComponent = mapIcons[feature];
          // const FeatureComponent = mapFeatures[feature];
          return (
            <div
              key={feature}
              className={featureSettings.isEnabled ? "lg:col-span-2 " : ""}
            >
              <EnableFeatures
                feature={feature}
                isEnabled={featureSettings.isEnabled}
                description={featureSettings.description}
                onToggle={(enabled) =>
                  workspace.metaResponse &&
                  handleToggleEnableFeatures(feature, enabled)
                }
                disabled={!workspace.metaResponse}
                Icon={IconComponent}
                content={
                  featureSettings.isEnabled && (
                    <FeatureSettings
                      workspace={workspace}
                      feature={feature}
                      config={featureSettings.config}
                      settings={featureSettings}
                      onUpdateSettings={(updatedFeatureSettings) =>
                        handleUpdateFeatureSettings(
                          feature,
                          updatedFeatureSettings
                        )
                      }
                    />
                  )
                }
                bg={featureSettings.isEnabled}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

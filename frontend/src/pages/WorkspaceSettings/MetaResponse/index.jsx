import MetaResponse from "@/models/metaResponse";
import showToast from "@/utils/toast";
import { ChatText, Cube, Heart, UserCircle } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import EnableFeatures from "./EnableFeatures";
import FeatureSettings from "./FeatureSettings";
import TitleBlock from "@/components/Generic/Blocks/TitleBlock";

export default function MetaResponseSettings({ workspace }) {
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
    const updatedFeatureSettings = {
      ...settings[feature],
      isEnabled: enabled,
    };

    const updatedSettings = await MetaResponse.updateMetaResponseSettings(
      workspace.slug,
      {
        ...settings,
        [feature]: updatedFeatureSettings,
      }
    );

    console.log("updatedSettings: ", updatedSettings);
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
    const updatedSettings = await MetaResponse.updateMetaResponseSettings(
      workspace.slug,
      {
        ...settings,
        [feature]: updatedFeatureSettings,
      }
    );

    console.log("updatedSettings: ", updatedSettings);
    setSettings(updatedSettings);
  };

  const mapIcons = {
    inputs: ChatText,
    sentiments: Heart,
    avatars: UserCircle,
  };

  //   const mapFeatures = {
  //     inputs: InputsFeature,
  //     sentiments: InputsFeature,
  //     avatars: InputsFeature,
  //   };

  return (
    <div className="flex flex-col gap-4 max-w-3xl">
      <div className="px-4">
        <TitleBlock
          label="Meta Response"
          description="This feature lets you dictate app behaviour through AI-generated responses, using a specific schema to structure data. It aligns with specially designed components that interpret this schema, enabling custom configurations for managing these components efficiently."
          labelStyles="text-2xl font-bold text-white"
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

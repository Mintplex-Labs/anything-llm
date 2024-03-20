import MetaResponse from "@/models/metaResponse";
import { ChatText, Heart, UserCircle } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import EnableFeatures from "./EnableFeatures";
import InputsFeature from "./InputsFeature";

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
  };

  const mapIcons = {
    inputs: ChatText,
    sentiments: Heart,
    avatars: UserCircle,
  };

  const mapFeatures = {
    inputs: InputsFeature,
  };

  return (
    <div className="relative w-full gap-4 max-h-full grid  grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
      {Object.keys(settings).map((feature) => {
        const featureSettings = settings[feature];
        const IconComponent = mapIcons[feature];
        const FeatureComponent = mapFeatures[feature];
        return (
          <div
            key={feature}
            className={
              featureSettings.isEnabled ? "lg:col-span-2 2xl:col-span-3" : ""
            }
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
                featureSettings.isEnabled &&
                FeatureComponent && (
                  <FeatureComponent
                    workspace={workspace}
                    config={featureSettings.config}
                  />
                )
              }
            />
          </div>
        );
      })}
    </div>
  );
}

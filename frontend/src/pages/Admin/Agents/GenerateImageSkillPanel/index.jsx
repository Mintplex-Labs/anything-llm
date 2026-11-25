import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trans } from "react-i18next";
import { Warning } from "@phosphor-icons/react";
import System from "@/models/system";
import paths from "@/utils/paths";
import GenericSkillPanel from "../GenericSkillPanel";

export default function GenerateImageSkillPanel(props) {
  const [providerConfigured, setProviderConfigured] = useState(true);

  useEffect(() => {
    System.isImageGenerationAvailable().then(setProviderConfigured);
  }, []);

  return (
    <GenericSkillPanel {...props}>
      {!providerConfigured && <NoProviderBanner />}
    </GenericSkillPanel>
  );
}

function NoProviderBanner() {
  return (
    <div className="flex items-center gap-x-2.5 p-2.5 bg-orange-800/20 light:bg-orange-800/10 text-orange-400 light:text-orange-600 border border-orange-400/30 rounded-lg">
      <Warning size={20} className="flex-shrink-0" weight="fill" />
      <p className="text-xs font-medium">
        <Trans
          i18nKey="agent.skill.generateImage.noProvider"
          components={{
            a: (
              <Link
                to={paths.settings.imageGenerationPreference()}
                className="underline hover:text-orange-300 light:hover:text-orange-700"
              />
            ),
          }}
        />
      </p>
    </div>
  );
}

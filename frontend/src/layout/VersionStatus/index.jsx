import { useEffect, useState } from "react";
import System from "@/models/system";
import { _APP_VERSION } from "@/utils/constants";
import { ShieldWarning } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import semver from "semver";

export default function VersionStatus() {
  const currentVersion = _APP_VERSION.value;
  const [remoteVersion, setRemoteVersion] = useState("");

  useEffect(() => {
    async function getRemoteVersion() {
      setRemoteVersion(await System.remoteAppVersion());
    }
    getRemoteVersion();
  }, []);

  if (!semver.valid(remoteVersion))
    return <VersionTag version={currentVersion} />;
  if (semver.lt(currentVersion, remoteVersion))
    return <VersionTag version={currentVersion} needsUpdate={true} />;
  return <VersionTag version={currentVersion} />;
}

function VersionTag({ version, needsUpdate = false }) {
  if (needsUpdate) {
    return (
      <>
        <a
          href="https://useanything.com/download"
          target="_blank"
          data-tooltip-id="version-tag"
          data-tooltip-content="Update available. Click to download."
          className="border-none flex items-center gap-x-1 hover:bg-yellow-600/10 rounded-lg px-2"
        >
          <ShieldWarning size={12} weight="fill" className="text-yellow-600" />
          <p className="text-yellow-600 text-sm">v{version}</p>
        </a>
        <Tooltip
          id="version-tag"
          place="bottom"
          delayShow={300}
          className="tooltip invert !text-xs"
        />
      </>
    );
  }

  return (
    <div className="border-none flex items-center gap-x-1 px-2">
      <p className="text-white/30 text-xs">v{version}</p>
    </div>
  );
}

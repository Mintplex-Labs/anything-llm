import RemoteNvidiaNimOptions from "./remote";
import ManagedNvidiaNimOptions from "./managed";

export default function NvidiaNimOptions({ settings }) {
  const version = "remote"; // static to "remote" when in docker version.
  return version === "remote" ? (
    <RemoteNvidiaNimOptions settings={settings} />
  ) : (
    <ManagedNvidiaNimOptions settings={settings} />
  );
}

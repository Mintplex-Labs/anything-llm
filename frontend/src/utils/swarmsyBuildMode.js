export const IS_SWARMSY_PUBLIC_DOWNLOAD_BUILD =
  import.meta.env.VITE_SWARMSY_PUBLIC_DOWNLOAD_BUILD === "true";

export function isSwarmsyPublicDownloadBuild() {
  return IS_SWARMSY_PUBLIC_DOWNLOAD_BUILD;
}

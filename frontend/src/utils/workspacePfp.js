export const CACHE_EXPIRATION = 2 * 60 * 60 * 1000;

export function cacheWorkspacePfp(workspaceSlug, base64Image) {
  const cachedData = window.localStorage.getItem("workspacePfpCache");
  const parsedData = cachedData ? JSON.parse(cachedData) : [];
  const existingIndex = parsedData.findIndex(
    (item) => item.workspaceSlug === workspaceSlug
  );
  if (existingIndex !== -1) {
    parsedData[existingIndex] = {
      workspaceSlug,
      base64Image,
      timestamp: Date.now(),
    };
  } else {
    parsedData.push({ workspaceSlug, base64Image, timestamp: Date.now() });
  }
  window.localStorage.setItem("workspacePfpCache", JSON.stringify(parsedData));
}

export function getWorkspacePfpFromCache(workspaceSlug) {
  const cachedData = window.localStorage.getItem("workspacePfpCache");
  if (cachedData) {
    const parsedData = JSON.parse(cachedData);
    const workspacePfp = parsedData.find(
      (item) => item.workspaceSlug === workspaceSlug
    );
    if (
      workspacePfp &&
      Date.now() - workspacePfp.timestamp < this.CACHE_EXPIRATION
    ) {
      return workspacePfp.base64Image;
    }
  }
  return null;
}

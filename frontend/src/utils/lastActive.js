const LAST_ACTIVE_KEY = "anythingllm_last_active_location";

export const saveLastActive = (workspace, thread = null) => {
  const location = {
    workspace,
    thread,
    timestamp: Date.now()
  };
  localStorage.setItem(LAST_ACTIVE_KEY, JSON.stringify(location));
};

export const getLastActive = () => {
  try {
    const stored = localStorage.getItem(LAST_ACTIVE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
};

export const clearLastActive = () => {
  localStorage.removeItem(LAST_ACTIVE_KEY);
};
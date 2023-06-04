import { API_BASE } from "../utils/constants";

const System = {
  ping: async function () {
    return await fetch(`${API_BASE}/ping`)
      .then((res) => res.ok)
      .catch(() => false);
  },
  totalIndexes: async function () {
    return await fetch(`${API_BASE}/system-vectors`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not find indexes.");
        return res.json();
      })
      .then((res) => res.vectorCount)
      .catch(() => 0);
  },
  keys: async function () {
    return await fetch(`${API_BASE}/setup-complete`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not find setup information.");
        return res.json();
      })
      .then((res) => res.results)
      .catch(() => null);
  },
  localFiles: async function () {
    return await fetch(`${API_BASE}/local-files`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not find setup information.");
        return res.json();
      })
      .then((res) => res.localFiles)
      .catch(() => null);
  },
};

export default System;

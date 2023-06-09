import { API_BASE } from "../utils/constants";
import { baseHeaders } from "../utils/request";

const System = {
  ping: async function () {
    return await fetch(`${API_BASE}/ping`)
      .then((res) => res.ok)
      .catch(() => false);
  },
  totalIndexes: async function () {
    return await fetch(`${API_BASE}/system/system-vectors`, {
      headers: baseHeaders(),
    })
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
    return await fetch(`${API_BASE}/system/local-files`, {
      headers: baseHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not find setup information.");
        return res.json();
      })
      .then((res) => res.localFiles)
      .catch(() => null);
  },
  checkAuth: async function (currentToken = null) {
    return await fetch(`${API_BASE}/system/check-token`, {
      headers: baseHeaders(currentToken),
    })
      .then((res) => res.ok)
      .catch(() => false);
  },
  requestToken: async function (body) {
    return await fetch(`${API_BASE}/request-token`, {
      method: "POST",
      body: JSON.stringify({ ...body }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not validate login.");
        return res.json();
      })
      .then((res) => res)
      .catch((e) => {
        return { valid: false, message: e.message };
      });
  },
};

export default System;

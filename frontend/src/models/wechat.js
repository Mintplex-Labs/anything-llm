import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const WeChat = {
  getConfig: async function () {
    return await fetch(`${API_BASE}/wechat/config`, {
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { config: null, error: e.message };
      });
  },

  saveConfig: async function (updates = {}) {
    return await fetch(`${API_BASE}/wechat/config`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(updates),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  generateQrCode: async function () {
    return await fetch(`${API_BASE}/wechat/qrcode`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  getStatus: async function () {
    return await fetch(`${API_BASE}/wechat/status`, {
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  disconnect: async function () {
    return await fetch(`${API_BASE}/wechat/disconnect`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
};

export default WeChat;

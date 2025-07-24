const prisma = require("../utils/prisma");
const { v4: uuidv4 } = require("uuid");

const MobileDevice = {
  platform: "server",
  tablename: "desktop_mobile_devices",
  writable: ["approved"],
  validators: {
    approved: (value) => {
      if (typeof value !== "boolean") return "Must be a boolean";
      return null;
    },
  },

  /**
   * Returns the connection URL for the mobile app to use to connect to the backend
   * @returns {string}
   */
  connectionURL: () => {
    // relative path - client will resolve full URL
    if (process.env.NODE_ENV === "production") return "/api/mobile";
    const ip = require("ip");
    return `http://${ip.address()}:${process.env.SERVER_PORT || 3001}/api/mobile`;
  },

  /**
   * Creates a new device for the mobile app
   * @param {string} deviceOs - Device os to associate creation of key with.
   * @param {string} deviceName - Device name to associate creation of key with.
   * @returns {Promise<{device: import("@prisma/client").desktop_mobile_devices|null, error:string|null}>}
   */
  create: async function ({ deviceOs, deviceName }) {
    try {
      if (!deviceOs || !deviceName)
        return { device: null, error: "Device OS and name are required" };
      if (!["ios", "android"].includes(deviceOs))
        return { device: null, error: "Invalid device OS" };

      const device = await prisma.desktop_mobile_devices.create({
        data: {
          deviceName: String(deviceName),
          deviceOs: String(deviceOs).toLowerCase(),
          token: uuidv4(),
        },
      });
      return { device, error: null };
    } catch (error) {
      console.error("Failed to create mobile device", error);
      return { device: null, error: error.message };
    }
  },

  /**
   * Validated existing API key
   * @param {string} id - Device id (db id)
   * @param {object} updates - Updates to apply to device
   * @returns {Promise<{device: import("@prisma/client").desktop_mobile_devices|null, error:string|null}>}
   */
  update: async function (id, updates = {}) {
    const device = await this.get({ id: parseInt(id) });
    if (!device) return { device: null, error: "Device not found" };

    const validUpdates = {};
    for (const [key, value] of Object.entries(updates)) {
      if (!this.writable.includes(key)) continue;
      const validation = this.validators[key](value);
      if (validation !== null) return { device: null, error: validation };
      validUpdates[key] = value;
    }
    // If no updates, return the device.
    if (Object.keys(validUpdates).length === 0) return { device, error: null };

    const updatedDevice = await prisma.desktop_mobile_devices.update({
      where: { id: device.id },
      data: validUpdates,
    });
    return { device: updatedDevice, error: null };
  },

  /**
   * Fetches mobile device by params.
   * @param {object} clause - Prisma props for search
   * @returns {Promise<import("@prisma/client").desktop_mobile_devices[]>}
   */
  get: async function (clause = {}) {
    try {
      const device = await prisma.desktop_mobile_devices.findFirst({
        where: clause,
      });
      return device;
    } catch (error) {
      console.error("FAILED TO GET MOBILE DEVICE.", error);
      return [];
    }
  },

  /**
   * Deletes mobile device by db id.
   * @param {number} id - database id of mobile device
   * @returns {Promise<{success: boolean, error:string|null}>}
   */
  delete: async function (id) {
    try {
      await prisma.desktop_mobile_devices.delete({
        where: { id: parseInt(id) },
      });
      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to delete mobile device", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Gets mobile devices by params
   * @param {object} clause
   * @param {number|null} limit
   * @param {object|null} orderBy
   * @returns {Promise<import("@prisma/client").desktop_mobile_devices[]>}
   */
  where: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const devices = await prisma.desktop_mobile_devices.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return devices;
    } catch (error) {
      console.error("FAILED TO GET MOBILE DEVICES.", error.message);
      return [];
    }
  },
};

module.exports = { MobileDevice };

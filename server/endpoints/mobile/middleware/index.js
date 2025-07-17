const { MobileDevice } = require("../../../models/mobileDevice");

/**
 * Validates the device id from the request headers by checking if the device
 * exists in the database and is approved.
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @param {import("express").NextFunction} next
 */
async function validDeviceToken(request, response, next) {
  try {
    const token = request.header("x-anythingllm-mobile-device-token");
    if (!token)
      return response.status(400).json({ error: "Device token is required" });

    const device = await MobileDevice.get({ token: String(token) });
    if (!device)
      return response.status(400).json({ error: "Device not found" });
    if (!device.approved)
      return response.status(400).json({ error: "Device not approved" });
    response.locals.device = device;
    next();
  } catch (error) {
    console.error("validDeviceToken", error);
    response.status(500).json({ error: "Invalid middleware response" });
  }
}

module.exports = {
  validDeviceToken,
};

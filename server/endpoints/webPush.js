const { reqBody } = require("../utils/http");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { pushNotificationService } = require("../utils/PushNotifications");

function webPushEndpoints(app) {
  if (!app) return;

  app.post(
    "/web-push/subscribe",
    [validatedRequest],
    async (request, response) => {
      const subscription = reqBody(request);
      await pushNotificationService.registerSubscription(
        response.locals.user,
        subscription
      );
      response.status(201).json({});
    }
  );

  app.get("/web-push/pubkey", [validatedRequest], (_request, response) => {
    const publicKey = pushNotificationService.publicVapidKey;
    response.status(200).json({ publicKey });
  });

  setTimeout(() => {
    pushNotificationService.sendNotification({
      to: "primary",
      payload: {
        title: "Test Notification",
        body: "This is a test notification",
      },
    });
  }, 5_000);
}

module.exports = { webPushEndpoints };

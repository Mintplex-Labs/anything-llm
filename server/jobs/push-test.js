const { log, conclude } = require('./helpers/index.js');
const { pushNotificationService } = require('../utils/PushNotifications');
const { ApiChatHandler } = require('../utils/chats/apiChatHandler');
const { Workspace } = require('../models/workspace');
const { v4: uuidv4 } = require('uuid');

// Seen success with gemma3:1B with this format (limited testing)
function makeTitlePrompt(response) {
  return `Generate a short title for a browser notification title based on the following content. Do not provide options or other text. Limit to 3-5 words:\n\n${response.textResponse}`;
}

function makeDescriptionPrompt(response) {
  return `Summarize the following content into a browser notification message string - do not provide options or other text - just the content should be returned:\n\n${response.textResponse}`;
}

(async () => {
  try {
    console.log('Testing push notification service...');
    const pushService = pushNotificationService.pushService;
    if (!pushService) throw new Error('Failed to get push service');

    const subscription = pushNotificationService.subscriptions?.[0];
    if (!subscription) throw new Error('No subscription found');

    const workspace = (await Workspace.where({}))[0]; // tmp
    const message = '@agent open news.ycombinator.com and get me the latest news that might be interesting to read. I am specifically interested in the latest news about open source projects or AI related news.';

    const chatPayload = {
      workspace,
      message,
      mode: "chat",
      user: null,
      sessionId: uuidv4(),
    }
    const response = await ApiChatHandler.chatSync(chatPayload);
    const titleResponse = await ApiChatHandler.chatSync({
      workspace,
      message: makeTitlePrompt(response),
      mode: "chat",
      user: null,
      sessionId: uuidv4(),
    }).then(r => r.textResponse);
    const descriptionResponse = await ApiChatHandler.chatSync({
      workspace,
      message: makeDescriptionPrompt(response),
      mode: "chat",
      user: null,
      sessionId: uuidv4(),
    }).then(r => r.textResponse);

    await pushService.sendNotification(subscription, JSON.stringify({
      title: titleResponse,
      message: descriptionResponse,
      // onClickUrl: 'https://github.com/mintplex-labs/anything-llm'
    }));
    console.log('Successfully sent notification');
  } catch (e) {
    console.error(e)
    log(`errored with ${e.message}`)
  } finally {
    conclude();
  }
})();

const { reqBody } = require('../utils/http');
const { Workspace } = require('../models/workspace');
const { chatWithWorkspace } = require('../utils/chats');

function chatEndpoints(app) {
  if (!app) return;

  app.post('/workspace/:slug/chat', async (request, response) => {
    const { slug } = request.params
    const { message, mode = 'query' } = reqBody(request)
    const workspace = await Workspace.get(`slug = '${slug}'`);
    if (!workspace) {
      response.sendStatus(400).end();
      return;
    }

    const result = await chatWithWorkspace(workspace, message, mode);
    response.status(200).json({ ...result });
  })

}

module.exports = { chatEndpoints }
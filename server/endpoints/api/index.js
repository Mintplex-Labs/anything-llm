const { useSwagger } = require("../../swagger/utils");
const { apiAdminEndpoints } = require("./admin");
const { apiAuthEndpoints } = require("./auth");
const { apiDocumentEndpoints } = require("./document");
const { apiSystemEndpoints } = require("./system");
const { apiWorkspaceEndpoints } = require("./workspace");
const { apiWorkspaceThreadEndpoints } = require("./workspaceThread");
const { apiUserManagementEndpoints } = require("./userManagement");

// All endpoints must be documented and pass through the validApiKey Middleware.
// How to JSDoc an endpoint
// https://www.npmjs.com/package/swagger-autogen#openapi-3x
function developerEndpoints(app, router) {
  if (!router) return;
  useSwagger(app);
  apiAuthEndpoints(router);
  apiAdminEndpoints(router);
  apiSystemEndpoints(router);
  apiWorkspaceEndpoints(router);
  apiDocumentEndpoints(router);
  apiWorkspaceThreadEndpoints(router);
  apiUserManagementEndpoints(router);
}

module.exports = { developerEndpoints };

const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });
const fs = require("fs");
const path = require("path");

const doc = {
  info: {
    version: "1.0.0",
    title: "AnythingLLM Developer API",
    description:
      "API endpoints that enable programmatic reading, writing, and updating of your AnythingLLM instance. UI supplied by Swagger.io.\n\nAPI keys are either full access or hold one or more scopes: chat (chat with workspaces), workspace (update or delete workspaces and their documents, and every thread endpoint including thread chats), documents (the shared document store and uploads), openai (the OpenAI compatible endpoints, chat completions also needs chat), embeds, mcp, users (users, invites and workspace membership) and sso (issue login tokens). A scoped key can also be limited to specific workspaces. Any endpoint not covered by a scope needs a full access key, and a key used outside of its scopes receives a 403. A users key can create admins, so treat it as full access. GET /v1/auth returns the scopes and workspaces of the key.",
  },
  // Swagger-autogen does not allow us to use relative paths as these will resolve to
  // http:///api in the openapi.json file, so we need to monkey-patch this post-generation.
  host: "/api",
  schemes: ["http"],
  securityDefinitions: {
    BearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
  security: [{ BearerAuth: [] }],
  definitions: {
    InvalidAPIKey: {
      message: "Invalid API Key",
    },
  },
};

const outputFile = path.resolve(__dirname, "./openapi.json");
const endpointsFiles = [
  "../endpoints/api/auth/index.js",
  "../endpoints/api/admin/index.js",
  "../endpoints/api/document/index.js",
  "../endpoints/api/workspace/index.js",
  "../endpoints/api/system/index.js",
  "../endpoints/api/workspaceThread/index.js",
  "../endpoints/api/userManagement/index.js",
  "../endpoints/api/openai/index.js",
  "../endpoints/api/embed/index.js",
  "../endpoints/api/mcpServers/index.js",
];

swaggerAutogen(outputFile, endpointsFiles, doc).then(({ data }) => {
  // Remove Authorization parameters from arguments.
  for (const path of Object.keys(data.paths)) {
    if (data.paths[path].hasOwnProperty("get")) {
      let parameters = data.paths[path].get?.parameters || [];
      parameters = parameters.filter((arg) => arg.name !== "Authorization");
      data.paths[path].get.parameters = parameters;
    }

    if (data.paths[path].hasOwnProperty("post")) {
      let parameters = data.paths[path].post?.parameters || [];
      parameters = parameters.filter((arg) => arg.name !== "Authorization");
      data.paths[path].post.parameters = parameters;
    }

    if (data.paths[path].hasOwnProperty("delete")) {
      let parameters = data.paths[path].delete?.parameters || [];
      parameters = parameters.filter((arg) => arg.name !== "Authorization");
      data.paths[path].delete.parameters = parameters;
    }
  }

  const openApiSpec = {
    ...data,
    servers: [
      {
        url: "/api",
      },
    ],
  };
  fs.writeFileSync(outputFile, JSON.stringify(openApiSpec, null, 2), {
    encoding: "utf-8",
    flag: "w",
  });
  console.log(`Swagger-autogen:  \x1b[32mPatched servers.url ✔\x1b[0m`);
});

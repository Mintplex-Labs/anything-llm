const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });
const fs = require('fs')
const path = require('path')

const doc = {
  info: {
    version: '1.0.0',
    title: 'AnythingLLM Developer API',
    description: 'API endpoints that enable programmatic reading, writing, and updating of your AnythingLLM instance. UI supplied by Swagger.io.',
  },
  // Swagger-autogen does not allow us to use relative paths as these will resolve to
  // http:///api in the openapi.json file, so we need to monkey-patch this post-generation.
  host: '/api',
  schemes: ['http'],
  securityDefinitions: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  },
  security: [
    { BearerAuth: [] }
  ],
  definitions: {
    InvalidAPIKey: {
      message: 'Invalid API Key',
    },
  }
};

const outputFile = path.resolve(__dirname, './openapi.json');
const endpointsFiles = [
  '../endpoints/api/auth/index.js',
  '../endpoints/api/admin/index.js',
  '../endpoints/api/document/index.js',
  '../endpoints/api/workspace/index.js',
  '../endpoints/api/system/index.js',
];

swaggerAutogen(outputFile, endpointsFiles, doc)
  .then(({ data }) => {
    const openApiSpec = {
      ...data,
      servers: [{
        url: "/api"
      }]
    }
    fs.writeFileSync(outputFile, JSON.stringify(openApiSpec, null, 2), { encoding: 'utf-8', flag: 'w' });
    console.log(`Swagger-autogen:  \x1b[32mPatched servers.url ✔\x1b[0m`)
  })
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    version: '1.0.0',
    title: 'AnythingLLM Developer API',
    description: 'API endpoints that enable programmatic reading, writing, and updating of your AnythingLLM instance. UI supplied by Swagger.io.',
  },
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

const outputFile = './openapi.json';
const endpointsFiles = [
  '../endpoints/api/auth/index.js',
  '../endpoints/api/admin/index.js',
  '../endpoints/api/document/index.js',
  '../endpoints/api/workspace/index.js',
  '../endpoints/api/system/index.js',
];

swaggerAutogen(outputFile, endpointsFiles, doc)
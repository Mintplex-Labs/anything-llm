const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

function faviconUrl() {
  return process.env.NODE_ENV === "production" ?
    '/public/favicon.png' :
    'http://localhost:3000/public/favicon.png'
}

function useSwagger(app) {
  app.use('/api/docs', swaggerUi.serve);
  const options = {
    customCss: [
      fs.readFileSync(path.resolve(__dirname, 'index.css')),
      fs.readFileSync(path.resolve(__dirname, 'dark-swagger.css'))
    ].join('\n\n\n'),
    customSiteTitle: 'AnythingLLM Developer API Documentation',
    customfavIcon: faviconUrl(),
  }

  if (process.env.NODE_ENV === "production") {
    const swaggerDocument = require('./openapi.json');
    app.get('/api/docs', swaggerUi.setup(
      swaggerDocument,
      {
        ...options,
        customJsStr: 'window.SWAGGER_DOCS_ENV = "production";\n\n' + fs.readFileSync(path.resolve(__dirname, 'index.js'), 'utf8'),
      },
    ));
  } else {
    // we regenerate the html page only in development mode to ensure it is up-to-date when the code is hot-reloaded.
    app.get(
      "/api/docs",
      async (_, response) => {
        // #swagger.ignore = true
        const swaggerDocument = require('./openapi.json');
        return response.send(
          swaggerUi.generateHTML(
            swaggerDocument,
            {
              ...options,
              customJsStr: 'window.SWAGGER_DOCS_ENV = "development";\n\n' + fs.readFileSync(path.resolve(__dirname, 'index.js'), 'utf8'),
            }
          )
        );
      }
    );
  }
}

module.exports = { faviconUrl, useSwagger }
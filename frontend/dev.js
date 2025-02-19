process.env.NODE_ENV = 'development';
require('vite').createServer({
  configFile: './vite.config.js',
  mode: 'development',
  server: {
    host: '0.0.0.0',
    port: 3000
  }
}).then(server => server.listen()); 
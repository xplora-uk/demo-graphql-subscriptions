const { join, resolve } = require('path');

function makeConfig(penv = process.env) {
  const webAppBuildDir = penv.WEB_APP_BUILD_DIR || join(__dirname, '/../../demo-app-cra/build');
  return {
    http: {
      port: penv.HTTP_PORT || 8080,
    },
    mongodb: {
      url: penv.MONGODB_URL || 'mongodb://localhost:27017',
      dbName: penv.MONGODB_NAME || 'graphql',
    },
    webApp: {
      buildDir: resolve(webAppBuildDir),
    },
  };
}

module.exports = { makeConfig };

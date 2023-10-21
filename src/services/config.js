function makeConfig(penv = process.env) {
  return {
    http: {
      port: penv.HTTP_PORT || 8080,
    },
    mongodb: {
      url: penv.MONGODB_URL || 'mongodb://localhost:27017',
      dbName: penv.MONGODB_NAME || 'graphql',
    },
  };
}

module.exports = { makeConfig };

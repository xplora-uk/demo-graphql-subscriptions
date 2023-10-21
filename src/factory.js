const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const express = require('express');
const { createServer } = require('http');
//const { WebSocketServer } = require('ws');

const { makeConfig } = require('./services/config');
const { makeGraphqlSchema } = require('./graphql/schema');
const { makeWatchService } = require('./services/watch-service');
const { makeMongoDbClient } = require('./services/mongodb');

async function factory(penv = process.env) {
  const config = makeConfig(penv);
  const logger = console;

  const app = express();

  const httpServer = createServer(app);

  const db = await makeMongoDbClient(config.mongodb);
  logger.info('Connected to MongoDB!');

  const watchService = await makeWatchService(db);

  const schema = await makeGraphqlSchema(config, logger, watchService);

  const graphqlServer = new ApolloServer({ schema });

  await graphqlServer.start();
  app.use('/graphql', cors('*'), express.json(), expressMiddleware(graphqlServer));

  return {
    app,
    config,
    db,
    graphqlServer,
    httpServer,
    logger,
    schema,
    watchService,
  };
}

module.exports = { factory };

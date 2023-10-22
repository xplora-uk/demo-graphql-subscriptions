const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const cors = require('cors');
const express = require('express');
const { createServer } = require('http');

const { makeConfig } = require('./services/config');
const { makeGraphqlSchema } = require('./graphql/schema');
const { makeWatchService } = require('./services/watch-service');
const { makeMongoDbClient } = require('./services/mongodb');
const { makeWsServer } = require('./services/ws-server');

async function factory(penv = process.env) {
  const config = makeConfig(penv);
  const logger = console;

  // prepare express app
  const app = express();
  app.use(cors('*'));
  app.use(express.json());
  app.use(express.static(config.webApp.buildDir));

  // prepare db connection
  const db = await makeMongoDbClient(config.mongodb);
  logger.info('Connected to MongoDB!');

  // prepare watch service
  const watchService = await makeWatchService(db);

  // prepare GraphQL schema with type defs and resolvers
  const schema = await makeGraphqlSchema(config, logger, watchService);

  // prepare HTTP server
  const httpServer = createServer(app);

  // prepare web socket server that can run subscription operations
  const { wsServer, wsServerCleanup } = await makeWsServer(logger, httpServer, schema);

  // prepapre Apollo server that can run query and mutation operations
  const graphqlServer = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await wsServerCleanup.dispose();
            },  
          };
        },
      },
    ],
  });

  await graphqlServer.start();

  app.use('/api/graphql', expressMiddleware(graphqlServer));

  return {
    app,
    config,
    db,
    graphqlServer,
    httpServer,
    logger,
    schema,
    watchService,
    wsServer,
  };
}

module.exports = { factory };

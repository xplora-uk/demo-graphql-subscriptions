const { makeExecutableSchema } = require('@graphql-tools/schema');
const { makeGraphqlTypeDefs } = require('./typeDefs');
const { makeGraphqlResolvers } = require('./resolvers');

function makeGraphqlSchema(config, logger, watchService) {
  const typeDefs  = makeGraphqlTypeDefs(config, logger);
  const resolvers = makeGraphqlResolvers(logger, watchService);
  const schema    = makeExecutableSchema({ typeDefs, resolvers });

  return schema;
}

module.exports = { makeGraphqlSchema };

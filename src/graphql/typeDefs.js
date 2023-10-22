const { readFileSync } = require('fs');
const { resolve } = require('path');

function makeGraphqlTypeDefs() {
  const typeDefs = readFileSync(resolve(__dirname + '/../../schema.graphql'), 'utf8');

  return typeDefs;
}

module.exports = { makeGraphqlTypeDefs };

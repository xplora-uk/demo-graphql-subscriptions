require('dotenv').config();
const { factory } = require('./factory');

main();

async function main() {
  const { config, httpServer } = await factory(process.env);

  httpServer.listen(config.http.port, () => {
    console.log(`🚀 Query endpoint ready at http://localhost:${config.http.port}/graphql`);
    console.log(`🚀 Subscription endpoint ready at ws://localhost:${config.http.port}/graphql`);
  });
}

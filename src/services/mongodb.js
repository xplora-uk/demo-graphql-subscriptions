// This is file to make a MongoDB connection using the Node.js driver

const { MongoClient, ServerApiVersion } = require('mongodb');

// TODO: implement connection pooling or re-connection strategy

async function makeMongoDbClient({ url, dbName }) {

  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const serverApi = {
    version          : ServerApiVersion.v1,
    strict           : true,
    deprecationErrors: true,
  };
  const _client = new MongoClient(url, { serverApi });

  // Connect the client to the server	(optional starting in v4.7)
  await _client.connect();

  const _db = _client.db(dbName);

  const messageColl      = _db.collection('messages');
  const subscriptionColl = _db.collection('subscriptions');
  const watchColl        = _db.collection('watches');

  // Send a ping to confirm a successful connection
  await _db.command({ ping: 1 });

  return {
    _client,
    _db,
    subscriptionColl,
    messageColl,
    watchColl,
  };
}

module.exports = { makeMongoDbClient };

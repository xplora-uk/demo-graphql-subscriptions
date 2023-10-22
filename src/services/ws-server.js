const { useServer } = require('graphql-ws/lib/use/ws');
const WebSocket = require('ws');
const { WebSocketServer } = require('ws');
const { jsonParse, jsonStringify } = require('../utils/json');

function makeWsServer(logger, httpServer, schema) {
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/subscriptions',
  });

  const wsServerCleanup = useServer({
    schema,
    onConnect: (ctx) => {
      console.log('graphql-ws Connect', ctx);
    },
    onSubscribe: (ctx, msg) => {
      console.log('graphql-ws Subscribe', { ctx, msg });
    },
    onNext: (ctx, msg, args, result) => {
      console.debug('graphql-ws Next', { ctx, msg, args, result });
    },
    onError: (ctx, msg, errors) => {
      console.error('graphql-ws Error', { ctx, msg, errors });
    },
    onComplete: (ctx, msg) => {
      console.log('graphql-ws Complete', { ctx, msg });
    },
  }, wsServer);

  function sendJson(ws, cmd, payload) {
    const msg = jsonStringify({ cmd, payload, ts: new Date() });
    ws.send(msg);
  }

  async function cmdBroadcast(wsSender, payload) {
    // tell everyone else
    wsServer.clients.forEach((client) => {
      if (client !== wsSender && client.readyState === WebSocket.OPEN) {
        const msg = jsonStringify({ cmd: 'broadcast:out', payload, ts: new Date() });
        try {
          client.send(msg);
        } catch (err) {
          logger.error('cmdBroadcast broadcast:out send error', err);
        }
      }
    });
  }

  async function cmdQuery(wsSender, payload) {
    const { id, query, variables } = payload;
    const result = await graphqlServer.executeOperation({ query, variables });
    sendJson(wsSender, 'query:out', { id, result });
  }

  async function cmdMutation(wsSender, payload) {
    const { id, mutation, variables } = payload;
    const result = await graphqlServer.executeOperation({ mutation, variables });
    sendJson(wsSender, 'mutation:out', { id, result });
  }

  async function cmdSubscription(wsSender, payload) {
    const { id, subscription, variables } = payload;
    const result = await graphqlServer.executeOperation({ subscription, variables });
    sendJson(wsSender, 'subscription:out', { id, result });
  }

  async function messageProxy(ws, data, isBinary) {
    logger.info('messageProxy', { data, isBinary });
    const jsonResult = jsonParse(data);
    if (jsonResult.error) {
      logger.warn('messageProxy JSON error', jsonResult.error);
      return;
    }
    const { cmd, payload } = jsonResult.success || {};
    logger.info('messageProxy', jsonResult);

    switch (cmd) {
      case 'query':
        cmdQuery(ws, payload);
        break;

      case 'mutation':
        cmdMutation(ws, payload);
        break;

      case 'subscription':
        cmdSubscription(ws, payload);
        break;

      case 'broadcast':
        cmdBroadcast(ws, payload);
        break;
      default:
        logger.warn('unknown command: %s', { cmd });
        // do nothing
    }
  }

  function onConnection(ws, req) {
    //const ip = req.headers['x-forwarded-for'].split(',')[0].trim() || '';
    const ip = req.socket.remoteAddress;
    logger.info('ws new connection from', ip);

    ws.isAlive = true;
    ws.on('pong', () => ws.isAlive = true);
    ws.on('error', (err) => logger.error('ws error', err));
  
    function onMessage(data, isBinary) {
      logger.info('received: %s', { data, isBinary });
      messageProxy(ws, data, isBinary);
    }

    ws.on('message', onMessage);
  }

  wsServer.on('connection', onConnection);

  // regularly check if clients are still connected
  function pingAllClients() {
    wsServer.clients.forEach(ws => {
      if (ws.isAlive === false) return ws.terminate();
  
      ws.isAlive = false;
      ws.ping();
    });
  }

  const interval = setInterval(pingAllClients, 30 * 1000);

  wsServer.on('close', () => {
    clearInterval(interval);
  });

  return {
    wsServer,
    wsServerCleanup,
  };
}

module.exports = { makeWsServer };

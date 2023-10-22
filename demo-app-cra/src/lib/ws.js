import WebSocket from 'ws';

export function makeWsClient({
  url = process.env.REACT_APP_WS_BASE_URL || 'ws://localhost:8080',
  onError = console.error,
  onMessage = console.log,
}) {

  const PING_INTERVAL = 30 * 1000;
  const PING_TIMEOUT = PING_INTERVAL + 1000;

  function heartbeat() {
    clearTimeout(this.pingTimeout);

    this.pingTimeout = setTimeout(() => {
      this.terminate();
    }, PING_TIMEOUT);
  }

  const client = new WebSocket(url);

  client.on('error', onError);
  client.on('open', heartbeat);
  client.on('ping', heartbeat);
  client.on('message', onMessage);
  client.on('close', function clear() {
    clearTimeout(this.pingTimeout);
  });

  function sendJson(cmd, payload) {
    client.send(JSON.stringify({ cmd, payload }));
  }

  return {
    client,
    sendJson,
  };
}

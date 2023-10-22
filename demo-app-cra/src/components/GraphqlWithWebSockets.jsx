import { useContext, useState } from 'react';
import { WebSocketContext } from '../lib/WebSocketContext';

export function GraphqlWithWebSockets() {
  const [username, setUsername] = useState('');
  const [cmd, setCmd] = useState('');
  const [payload, setPayload] = useState('');
  const { ws, errors, messages } = useContext(WebSocketContext);

  async function sendGqlCommand() {
    if (!ws) return;
    ws.send(JSON.stringify({ cmd, payload }));
  }

  return (
    <div className='gql-with-ws'>
      <h1>GraphqlWithWebSockets</h1>

      <form>

        <div>
          <label htmlFor='username'>Username</label>
          <input type='text' id='username' name='username' value={username} onChange={e => setUsername(e.target.value)} />
        </div>

        <div>
          <label htmlFor='cmd'>Socket command</label>
          <input type='text' id='cmd' name='cmd' value={cmd} onChange={e => setCmd(e.target.value)} />
        </div>

        <div>
          <label htmlFor='payload'>Socket payload</label>
          <textarea id='payload' name='payload' onChange={e => setPayload(e.target.value)} value={payload} />
        </div>

        <div>
          <button type='button' onClick={sendGqlCommand}>Send</button>
        </div>

      </form>

      <div>
        <h2>Response</h2>
        <div>
          ...
        </div>
      </div>

      <div>
        <h2>WebSocket messages</h2>
        <div>
          {messages.forEach((message, i) => <div key={i}>{message}</div>)}
        </div>
      </div>

      <div>
        <h2>WebSocket errors</h2>
        <div>
          {errors.forEach((err, i) => <div key={i}>{err}</div>)}
        </div>
      </div>

    </div>
  );
}

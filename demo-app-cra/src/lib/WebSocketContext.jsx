import { createContext, useRef, useState } from 'react';
import { makeWsClient } from './ws';

export const WebSocketContext = createContext(null);

export function WebSocketContextProvider({
  url,
  children,
}) {
  const [errors, setErrors] = useState([]);
  const onError = (e) => {
    setErrors((errors) => [...errors, e.message]);
  }

  const [messages, setMessages] = useState([]);
  const onMessage = (msg) => {
    setMessages((messages) => [...messages, msg]);
  }

  const wsRef = useRef(makeWsClient({ url, onError, onMessage }));

  const value = { wsRef, ws: wsRef.current, errors, messages, setErrors, setMessages };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

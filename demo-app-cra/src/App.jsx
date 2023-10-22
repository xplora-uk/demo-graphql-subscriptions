import { WebSocketContextProvider } from './lib/WebSocketContext';
import { GraphqlWithWebSockets } from './components/GraphqlWithWebSockets';
import './App.css';

function App() {
  return (
    <WebSocketContextProvider>
      <div className='App'>
        <header className='App-header'>
          Demo React App
        </header>
        <GraphqlWithWebSockets />
      </div>
    </WebSocketContextProvider>
  );
}

export default App;

// src/App.jsx
import Chat from "./components/Chat";

import "./App.css";

function App() {
  return (
    <div className="App">
      <h2 style={{ textAlign: "center", marginTop: "20px" }}>🤖 AI Chatbot</h2>
      <Chat />
    </div>
  );
}

export default App;

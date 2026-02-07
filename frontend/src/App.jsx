import SendMessage from "./components/SendMessage";
import MessageList from "./components/MessageList";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>WhatsApp Messaging Practice App</h1>

      <SendMessage />
      <MessageList />

    </div>
  );
}

export default App;

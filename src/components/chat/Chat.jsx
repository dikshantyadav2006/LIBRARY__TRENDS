import { useState, useEffect } from "react";
import io from "socket.io-client";

// ✅ Connect to backend WebSocket
const socket = io("http://localhost:5000", { transports: ["websocket"] });

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("message"); // Cleanup on unmount
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("message", message);
    setMessage("");
  };

  return (
    <div className="p-4 border rounded">
      <div className="h-40 overflow-y-auto border p-2">
        {messages.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        className="w-full p-2 border"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage} className="mt-2 px-4 py-2 bg-purple-500 text-white rounded">
        Send
      </button>
    </div>
  );
};

export default Chat;

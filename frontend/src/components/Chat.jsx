// src/components/Chat.jsx

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const messagesEndRef = useRef(null);


  



  // Fetch chat history on mount
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/history/")
      .then((res) => setChatHistory(res.data))
      .catch((err) => console.error("Failed to load chat history:", err));
  }, []);

  // Auto scroll chat to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/chat/", {
        message: input,
      });

      setTimeout(() => {
        const botMessage = {
          sender: "bot",
          text: res.data.response,
        };
        setMessages((prev) => [...prev, botMessage]);
        setLoading(false);
      }, 2500);
    } catch (err) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Error: Could not get a response." },
        ]);
        setLoading(false);
      }, 2500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-wrapper">
      
      {/* Sidebar - Chat History */}
      <div className="chat-history">
        <h3>Chat History</h3>
        {chatHistory.map((item, index) => (
          <div key={index} className="history-item">
            <p
              className="history-heading"
              onClick={() =>
                setExpandedIndex(index === expandedIndex ? null : index)
              }
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              📌 You: {item.user_message.slice(0, 30)}...
            </p>

            {/* Show full details if selected */}
            {expandedIndex === index && (
              <div className="history-details">
                <p><strong>You:</strong> {item.user_message}</p>
                <p><strong>Bot:</strong> {item.bot_response}</p>
                <p style={{ fontSize: "0.85rem", color: "gray" }}>
                  🕒 Searched on:{" "}
                  {item.timestamp
                    ? new Date(item.timestamp).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Chat Window */}
      <div className="chat-container">
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-bubble ${msg.sender === "user" ? "user" : "bot"}`}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="chat-bubble bot typing">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};


export default Chat;




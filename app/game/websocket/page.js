"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function WebSocketChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    const userId = Cookies.get("userId");
    if (userId) {
      axios
        .get(`/api/user/currentUser?userId=${userId}`)
        .then((res) => {
          setUsername(res.data.username);
        })
        .catch((err) => console.error("Failed to fetch user:", err));
    }

    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onmessage = (event) => {
      try {
        const receivedData = JSON.parse(event.data);

        if (receivedData.type === "history") {
          setMessages(receivedData.data);
        } else if (receivedData.type === "message") {
          setMessages((prev) => [...prev, receivedData.data]);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed, attempting to reconnect...");
      setTimeout(() => {
        ws.current = new WebSocket("ws://localhost:8080");
      }, 3000);
    };

    return () => ws.current.close();
  }, []);

  const sendMessage = () => {
    if (ws.current && input && username) {
      const messageData = { text: input, username };
      ws.current.send(JSON.stringify(messageData));
      setInput("");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-4 rounded-lg shadow-md w-96 h-[600px] flex flex-col">
        <h1 className="text-2xl font-bold text-blue-400 mb-4">WebSocket Chat</h1>
        <ul className="flex-grow overflow-y-auto mb-4 space-y-2">
          {messages.map((msg, index) => (
            <li key={index} className={`flex ${msg.username === username ? "justify-end" : "justify-start"}`}>
              <div className={`px-4 py-2 rounded-lg max-w-[75%] ${msg.username === username ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black self-start"}`}>
                <span className="block text-xs font-semibold text-gray-600">{msg.username}</span>
                {msg.text}
              </div>
            </li>
          ))}
        </ul>
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

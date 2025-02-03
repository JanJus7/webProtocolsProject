"use client";

import { useState, useEffect, useRef } from "react";

export default function WebSocketChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onmessage = (event) => {
      setMessages((prev) => [
        ...prev,
        { text: event.data, isSentByUser: false },
      ]);
    };

    return () => ws.current.close();
  }, []);

  const sendMessage = () => {
    if (ws.current && input) {
      ws.current.send(input);
      setMessages((prev) => [...prev, { text: input, isSentByUser: true }]);
      setInput("");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-4 rounded-lg shadow-md w-96 h-[600px] flex flex-col">
        <h1 className="text-2xl font-bold text-blue-400 mb-4">
          WebSocket Chat
        </h1>
        <h5 className="text-l font-bold text-blue-400 mb-4">
          Beware that you are chatting with everyone on this page right now and if you leave, the messages will dissapear for you!
        </h5>
        <ul className="flex-grow overflow-y-auto mb-4 space-y-2">
          {messages.map((msg, index) => (
            <li
              key={index}
              className={`flex ${
                msg.isSentByUser ? "justify-end" : "justify-start"
              }`}
            >
              <span
                className={`px-4 py-2 rounded-lg max-w-[75%] ${
                  msg.isSentByUser
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 text-black self-start"
                }`}
              >
                {msg.text}
              </span>
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

import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
const messageHistory = [];

wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  if (messageHistory.length > 0) {
    ws.send(JSON.stringify({ type: "history", data: messageHistory }));
  }

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);

    try {
      const messageData = JSON.parse(message);
      messageHistory.push(messageData);

      if (messageHistory.length > 100) {
        messageHistory.shift();
      }

      wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify({ type: "message", data: messageData }));
        }
      });
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

console.log("WebSocket server running on ws://localhost:8080");

const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);

    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

console.log("WebSocket server running on ws://localhost:8080");
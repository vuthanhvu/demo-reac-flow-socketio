// Import required modules
const { WebSocket, WebSocketServer } = require("ws");
const http = require("http");
const uuidv4 = require("uuid").v4;

// Create an HTTP server and a WebSocket server
const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;

// Start the WebSocket server
server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});

// Handle new client connections
wsServer.on("connection", function handleNewConnection(connection) {
  const userId = uuidv4();
  console.log("Received a new connection");

  connection.on('message', (message) => {
    console.log(`==>222`, JSON.parse(message.toString()));
    connection.emit('name', '1')
  console.log(`==>1`);
  });



//   clients[userId] = connection;
//   console.log(`${userId} connected.`);

//   connection.on("message", (message) => processReceivedMessage(message, userId));
//   connection.on("close", () => handleClientDisconnection(userId));
});

// wsServer.on('message', (connection) => {
//     console.log(`==>`, connection);
// })

// function processReceivedMessage(message, userId) {
//     const dataFromClient = JSON.parse(message.toString());
//     const json = { type: dataFromClient.type };
  
//     if (dataFromClient.type === eventTypes.USER_EVENT) {
//       users[userId] = dataFromClient;
//       userActivity.push(`${dataFromClient.username} joined to collaborate`);
//       json.data = { users, userActivity };
//     } else if (dataFromClient.type === eventTypes.CONTENT_CHANGE) {
//       editorContent = dataFromClient.content;
//       json.data = { editorContent, userActivity };
//     }
  
//     sendMessageToAllClients(json);
//   }

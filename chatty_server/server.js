// server.js

const express = require('express');
const WebSocket = require('ws');
const SocketServer = require('ws').Server;
const uuidv1 = require('uuid/v1');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

const colourArray = ['#9b59b6', '#3498db', '#16a085', '#e74c3c'];
let colourIndex = 0;
// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Set colours:
  colourIndex < 3 ? colourIndex++ : colourIndex = 0;

  ws.send(JSON.stringify({
    type: 'colour',
    colour: colourArray[colourIndex]
  }));

  // Notification when new user connects, broadcasts to all
  wss.clients.forEach(function each(client) {
    client.send(JSON.stringify({
      type: 'connect',
      count: wss.clients.size
    }));
  });

  ws.on('message', function incoming(data) {
    // Parse the JSON file
    const parsedData = JSON.parse(data)

    // Add unique id for a message before sending back to browser
    parsedData.id = uuidv1();

    // Handler on server for receiving user messages, broadcasting to all users
    if (parsedData.type === 'postMessage') {
      parsedData.type = 'incomingMessage';
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedData));
        }
      });
    }
    // Handler to receive name change notifications, broadcasting to all users
    else if (parsedData.type === 'postNotification') {
      parsedData.type = 'incomingNotification';
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedData));
        }
      });
    }
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected')
    wss.clients.forEach(function each(client) {
      client.send(JSON.stringify({
        type: 'connect',
        count: wss.clients.size
      }));
    });
  });
});
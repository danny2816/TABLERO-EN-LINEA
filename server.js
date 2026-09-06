const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let boardData = [];

app.use(express.static(__dirname));

io.on('connection', (socket) => {
  socket.emit('init', boardData);

  socket.on('draw', (data) => {
    boardData.push(data);
    socket.broadcast.emit('draw', data);
  });

  socket.on('update-board', (data) => {
    boardData = data;
    socket.broadcast.emit('update-board', boardData);
  });

  socket.on('clear', () => {
    boardData = [];
    socket.broadcast.emit('clear');
  });
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Tablero en vivo activo en puerto ${PORT}`);
});

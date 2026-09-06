const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static('public'));

let boardState = [];

io.on('connection', (socket) => {
    socket.emit('init-board', boardState);

    socket.on('draw-action', (action) => {
        boardState.push(action);
        socket.broadcast.emit('draw-action', action);
    });

    socket.on('clear-board', () => {
        boardState = [];
        io.emit('clear-board');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor activo`));

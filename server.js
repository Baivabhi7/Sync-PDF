// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Frontend URL
        methods: ["GET", "POST"]
    }
});

let currentPage = 1;

io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Send the current page to the newly connected client
    socket.emit('page-change', currentPage);

    // Listen for page changes from the admin
    socket.on('page-change', (page) => {
        currentPage = page;
        io.emit('page-change', currentPage); // Broadcast to all clients
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(5000, () => {
    console.log("Server is running on port 5000");
});

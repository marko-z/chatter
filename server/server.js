const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
app.use(cors());
const server = http.createServer(app);
const util = require('util');
const port = 3001;
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
    }
});
//const { Server } = require('socket.io');
//const io = new Server(server);

app.use(express.static(__dirname + '/public/'))

io.on('connection', (socket) => {
	console.log('A user connected!');
    whoKnows = 
    io.emit('new message', {messageText: `${socket.id} joined the room.`, socketid: socket.id, notice: true});

    io.emit('updateUserList', Array.from(io.sockets.sockets.keys())); 
	socket.on('disconnect', () => {
        io.emit('new message', {messageText: `${socket.id} left the room.`, socketid: socket.id, notice: true});
		console.log('A user disconnected');
	});

    socket.on('new message', (message) => {
        io.emit('new message', {messageText, socketid: socket.id, notice: false}); 
    });
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});


server.listen(port, () => {
	console.log(`Listening on ${port}`);
});


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
    io.emit('announce', (socket.id));

    // for ( let key of io.sockets.sockets.keys()) {
    //     console.log(key);
    // }
    io.emit('updateUserList', Array.from(io.sockets.sockets.keys())); 
	socket.on('disconnect', () => {
        io.emit('announce exit', socket.id)
		console.log('A user disconnected');
	});

    socket.on('chat message', (message) => {
        io.emit('chat message', {message, socketid: socket.id}); 
    });
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});


server.listen(port, () => {
	console.log(`Listening on ${port}`);
});


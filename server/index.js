const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);


const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static(__dirname + '/public/'))
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});


app.get('/', (req, res) => {
	res.send('hello world');
});

app.listen(3000, () => {
	console.log('Listening on 3000');
});


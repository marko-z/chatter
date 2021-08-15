const express = require('express');
const http = require('http');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const Users = require('./data/Users');
const bcrypt = require('bcrypt');
const app = express();
app.use(cors());

const server = http.createServer(app);
const port = 3001;

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
    }
}); //what what exactly is the function of this?

//const { Server } = require('socket.io');
//const io = new Server(server);

//where the passport.use( new LocalStrategy(...)) resides
require('./config/passport.js'); 

// Probably needs more configuration
app.use(session({ 
    secret: 'someSecretCode',
    resave: true,
    saveUninitialized: true,
}));

const users = new Users;

//
//next step is probably going to be accessing the body.req so that we know if we should send postive or negative information to client
//

app.use(passport.initialize());
app.use(passport.session());

app.post('/loginUser', (req, res) => { //passport.authenticate('local', { ... }) 
    console.log('POST at /loginUser');
    console.log(req.body);
    // res.send(true);
    // res.send(false);
    
    // I just want to send the confirmation message that the authentication was either successful or unsuccessful
})

//Here I will add a user to users 
app.post('/registerUser', (req, res) => {
    
    if (!users.getUser(req.body.username)) {
        users.addUser(req.body.username, bcrypt(req.body.password, 10));
        res.send(true);
    } else {
        res.send(false);
    }
});

//Might not need this now that I use react
app.use(express.static(__dirname + '/public/'))

io.on('connection', (socket) => {
	console.log('A user connected!');
    io.emit('new message', {messageText: `${socket.id} joined the room.`, socketid: socket.id, notice: true});

    io.emit('updateUserList', Array.from(io.sockets.sockets.keys())); 
	socket.on('disconnect', () => {
        io.emit('new message', {messageText: `${socket.id} left the room.`, socketid: socket.id, notice: true});
		console.log('A user disconnected');
	});

    socket.on('new message', (message) => {
        io.emit('new message', {messageText: message, socketid: socket.id, notice: false}); 
    });
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

server.listen(port, () => {
	console.log(`Listening on ${port}`);
});


const express = require('express');
const http = require('http');
const cors = require('cors');
const session = require('express-session');

const passport = require('passport');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors()); //allow access to localhost:3001 from localhost:3000 (client)
app.use(express.json());

const server = http.createServer(app);
const port = 3001;

const io = require('socket.io')(server, {
    cors: {
        origin: '*', //could probably put the address of the client here. ie. http://localhost:3000, this is cors separate to app.use(cors) which applies to regular requests
        methods: ["GET", "POST"],
    }
});

//const { Server } = require('socket.io');
//const io = new Server(server);

//where the passport.use( new LocalStrategy(...)) resides
//So I presume that after the following command I will have access to the users variable but also execute passport.use(...)
const { users } = require('./config/passport.js'); 

// Probably needs more configuration
app.use(session({ 
    secret: 'someSecretCode',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 // 1 hour
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.post('/loginUser', (req, res) => { //passport.authenticate('local', { ... }) 
    passport.authenticate('local', (err, user, info) => {
        if (err) throw err;
        if (user) {
            req.logIn(user, (err) => { if (err) throw err });
            res.send(true); //difference between logIn and login?
        } else {
            res.send(false);
        }
    });
});

//Here I will add a user to users 
app.post('/registerUser', async (req, res) => {
    console.log(req.body);
    if (!users.getUser(req.body.username)) {
        const user = users.addUser({type: 'user', username: req.body.username, password: await bcrypt.hash(req.body.password, 10)});
        req.logIn(user.id, (err) => { if (err) throw err });
        res.send(true);
        console.log('Added user to users')
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


const express = require('express');
const http = require('http');
//const cors = require('cors');
const session = require('express-session');

const passport = require('passport');
const bcrypt = require('bcrypt');

const app = express();
// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
    
// })); //allow access to localhost:3001 (here) from localhost:3000 (client), allow storing of cookies from 3001 on 3000
app.use(express.json());

const server = http.createServer(app);
const port = 3001;

// const io = require('socket.io')(server);
const io = require('socket.io')(server, {
    cors: {
        origin: '*', //could probably put the address of the client here. ie. http://localhost:3000, this is cors separate to app.use(cors) which applies to regular requests
        methods: ["GET", "POST"],
    }
});

//alternative import of io?
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
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: false
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

app.post('/registerUser', async (req, res) => {
    //going to have to handle requests without password (adding guests)
    if (!users.findUser(req.body.username)) {
        const password = await bcrypt.hash(req.body.password, 10);
        const username = req.body.username;
        const type = 'user';
        const user = users.addUser({type, username, password});
        req.login(user, (err) => { if (err) throw err });
        //Shouldn't we be sending the client a cookie with the session id?
        res.send(true);
        console.log('Server: Added user to users')
        console.log(req.session); 
    } else {
        console.log('Server: Requested username already in use')
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


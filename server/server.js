const express = require('express');
const http = require('http');
//const cors = require('cors');
const session = require('express-session');

const passport = require('passport');
const bcrypt = require('bcrypt');

// const sharedSession = require('express-socket.io-session');

const app = express();
// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
    
// })); //allow access to localhost:3001 (here) from localhost:3000 (client), allow storing of cookies from 3001 on 3000
//not needed as we are using proxy

app.use(express.json());

const server = http.createServer(app);
const port = 3001;

const io = require('socket.io')(server);
// don't do the approach below, instead use proxy and send socket.io messages to 3000 (i.e address of the client)
// const io = require('socket.io')(server, {
//     cors: {
//         origin: '*', //could probably put the address of the client here. ie. http://localhost:3000, this is cors separate to app.use(cors) which applies to regular requests
//         methods: ["GET", "POST"],
//     }
// });

//alternative import of io?
//const { Server } = require('socket.io');
//const io = new Server(server);

//where the passport.use( new LocalStrategy(...)) resides
//So I presume that after the following command I will have access to the users variable but also execute passport.use(...)
const { users } = require('./config/passport.js'); 

// Probably needs more configuration
let sessionMiddleware = session({ 
    secret: 'someSecretCode',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: false
    }
});

app.use(sessionMiddleware); 
app.use(passport.initialize());
app.use(passport.session());


// io.use(sharedSession(sessionMiddleware, {
//     autoSave: true
// }));


// Method below doens't want to update the session object used by socket io after authentication
// io.use((socket, next) => {
//     sessionMiddleware(socket.request, {}, next) //this way, the 
// });

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
        console.log('user data in app.post after register:'); 
        console.log(req.session.passport.user);
        console.log(req.user)
    } else {
        console.log('Server: Requested username already in use')
        res.send(false);
    }
});

//Might not need this now that I use react
// app.use(express.static(__dirname + '/public/'))


//there is an issue where we get notified of the user joining when they are still on the login page

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));


// !!! we want to implement middleware that checks if the user is stored in the socket.request.session object
// For now I will just check for the socket.request.session.user object at every request

//!!! After we fix the issue above we want to add message logging into the database

// !!! passport not appearing inside the session object, the session object doesn't update (even after reconnect)
io.on('connection', (socket) => {
    console.log('Socket connection');

    socket.on('enteredChat', () => { //alternatively implement some kind of room which the user joins when messages are rendered and it fires an updatelist event? 

        console.log('user data in socket.io')
        console.log(socket.request.user);
        console.log(socket.request.session.passport?.user);  
        const username = socket.request.user?.username;
        if (username) {
            console.log(`User ${username} entered chat`)
            socket.broadcast.emit('new message', {messageText: `${username} joined the room.`, username, className: 'notice'});
            io.emit('updateUserList', users.getUsernames()); // Array.from(io.sockets.sockets.keys()) for sockets
        }
    });

    socket.on('new message', (messageText) => {
        // const username = users.getUser(socket.handshake.session.passport?.user);
        const username = users.getUser(socket.request.session.passport?.user);
        console.log(`User ${username} sent message`)
        if (username) {
            socket.broadcast.emit('new message', {messageText, username, className: 'message other'});
            socket.emit('new message', { messageText, username, className: 'message own'}); 
        }
    });
    
	socket.on('disconnect', () => {
        io.emit('new message', {messageText: `${socket.id} left the room.`, socketid: socket.id, notice: true});
		console.log('A user disconnected');
	});

  
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

server.listen(port, () => {
	console.log(`Listening on ${port}`);
});


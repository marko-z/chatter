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
    
// })); //allow access to localhost:3001 (here) from localhost:3000 (client),
// allow storing of cookies from 3001 on 3000 BUT: not needed as we are using proxy

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

// where the passport.use( new LocalStrategy(...)) resides
// So I presume that after the following command I will have access to the users
// variable but also execute passport.use(...)

const { users } = require('./config/passport.js'); 
const Cookies = require('cookies');

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

let currentUsers = [];
let messageList = [];

// To refresh the socket I refresh the client - is there a way to do it from server-side only?
app.post('/loginUser', (req, res, next) => { //passport.authenticate('local', { ... }) 
    passport.authenticate('local', (err, user, info) => {
        if (err) throw err;

        if (user) {
            req.logIn(user, (err) => { if (err) throw err }); //login and logIn are aliases
            currentUsers.push(user);
            res.send(true); 
        } else {
            res.send(false);
        }
    })(req,res,next); // (req,res,next) important
});

app.post('/registerUser', async (req, res) => {
    //going to have to handle requests without password (adding guests)
    
    if (!users.findUser(req.body.username)) {
 
        const user = users.addUser({
            username: req.body.username, 
            password: await bcrypt.hash(req.body.password, 10) 
        }, guest=false);

        currentUsers.push(user);

        req.login(user, (err) => { 
            if (err) throw err 
            res.send(true);
        });
        
    } else {
        console.log('Server: Requested username already in use')
        res.send(false);
    }
});

app.post('/logout', (req, res) => {
    if (req.user) { 
        console.log('/logout: req.user exists');

         //is this operation in-place?
        currentUsers = currentUsers.filter(user => user.id !== req.user.id);
        //would this alone delete the cookie in the client with the next response? --> no.
        req.logout();
    } else {
        console.log('/logout: req.user does not exist');
    }
})

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));


// !!! we want to implement middleware that checks if the user is stored in the
// socket.request.session object For now I will just check for the
// socket.request.session.user object at every request

//!!! After we fix the issue above we want to add message logging into the database

// PROBLEM: session.passport.user / user not appearing in socket.request even
// after refresh SOLUTION: check that the socket.io from client connects to 3000
// (and so to 3001 via proxy) and not 3001 (not sure why it doesn't populate it
// this way but hey)

io.on('connection', (socket) => {
    console.log('Socket connection');

    //Might not be that great of a solution if the socket disconnects when in
    //messages component, as it might no longer be able to receive events
    socket.on('enteredChat', () => {  

        // console.log('user data in socket.io')
        // console.log(socket.request.user);
        // console.log(socket.request.session.passport?.user);  
        const username = socket.request.user?.username;
        if (username) { //means user logged into session
            socket.broadcast.emit('new message', {
                messageText: `${username} joined the room.`, username, className: 'notice'
            });
            // Array.from(io.sockets.sockets.keys()) for sockets
            io.emit('updateUserList', currentUsers); 
            io.emit('updateMessageList', messageList);
        }

    });

    // socket.on('enteredLogin', () => {
    //     //no need to logout here if the client removed its own cookie - passport data automatically removed from session
    //     //but then how am I supposed to know who to remove? Is there a way of connecting the user in currentUsers to a particular
    //     //session? Or is removing the cookie from the server the only way?
    //     if (socket.request.user) {
    //         currentUsers = currentUsers.filter(user => user.id !== socket.request.user.id)
    //         socket.request.logout();
    //         Cookies.set 
    //     }
    // });

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


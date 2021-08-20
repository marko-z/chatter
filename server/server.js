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
const sessionMiddleware = session({ 
    secret: 'someSecretCode',
    // resave: false,
    // saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: false
    }
});



app.use(sessionMiddleware); 
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
        console.log(req.session.passport.user);
    } else {
        console.log('Server: Requested username already in use')
        res.send(false);
    }
});

//Might not need this now that I use react
// app.use(express.static(__dirname + '/public/'))


//there is an issue where we get notified of the user joining when they are still on the login page

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next) //this way, the 
})

// now we can access socket.request.session in io.on(...)


// !!! passport not appearing inside the session object
io.on('connection', (socket) => {
	console.log('A user connected!');
    // I would like the following, but unfortunately the passport property doesn't show up in session object here
    // const user = users.getUser(socket.request.session.passport.user)
    io.emit('new message', {messageText: `${socket.id} joined the room.`, socketid: socket.id, notice: true});
    console.log(`Server: updateUserList to be sent: ${users.getUsernames()}`);
    io.emit('updateUserList', users.getUsernames()); // Array.from(io.sockets.sockets.keys()) for sockets
	socket.on('disconnect', () => {
        io.emit('new message', {messageText: `${socket.id} left the room.`, socketid: socket.id, notice: true});
		console.log('A user disconnected');
	});

    socket.on('new message', (message) => {
        console.log(socket.request.session);
        console.log(socket.request.session.passport);
        io.emit('new message', {messageText: message, socketid: socket.id, notice: false}); 
    });
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

server.listen(port, () => {
	console.log(`Listening on ${port}`);
});


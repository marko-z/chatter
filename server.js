const express = require('express');
const http = require('http');
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());

const server = http.createServer(app);
const port = process.env.PORT || 3001;

const io = require('socket.io')(server);
//alternative?
// const { Server } = require('socket.io');
// const io = new Server(server);

if (process.env.NODE_ENV === "production") {
  //so do I include NODE_ENV=production in Procfile or?
  app.use(express.static("build"));
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}

const { users } = require('./config/passport.js');

// Probably needs more configuration.
let sessionMiddleware = session({
  secret: 'someSecretCode',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 20, // 20 seconds
    httpOnly: true,
  }
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());


// io.use(sharedSession(sessionMiddleware, {
//     autoSave: true
// }));


// Method below doesn't want to update the session object used by socket io after authentication
// io.use((socket, next) => {
//     sessionMiddleware(socket.request, {}, next) 
// });


// To refresh the socket I refresh the client - is there a way to do it from server-side only?
app.post('/loginUser', (req, res, next) => { //passport.authenticate('local', { ... }) 
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err;

    if (user) {
      req.logIn(user, (err) => { if (err) throw err }); //login and logIn are aliases
      res.send(true);
    } else {
      res.send(false);
    }
  })(req, res, next); // (req,res,next) important
});

app.post('/registerUser', async (req, res) => {
  if (!users.findUser(req.body.username)) {
    const user = users.addUser({
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, 10)
    }, guest = false);

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
    userList = userList.filter(user => user.id !== req.user.id);
    //would this alone delete the cookie in the client with the next response? --> no.
    req.logout();
  } else {
    console.log('/logout: req.user does not exist');
  }
  req.session.destroy();
})

app.get('/vibecheck', (req, res) => {
  // req.session.id will be populated if the incoming cookie matched an id in
  // the MemoryStore
  // similarly, passport populated req.user with relevant information specified
  // in passport.js, and will only be available if the cookie matched an entry
  // in the MemoryStore 
  
  if (req.user) { 
    res.send('gachiAPPROVE');
  } else {
    res.status(401);
    res.send();
  }
})

// Could lead to a memory leak (only way users are removed from userList is
// through 'disconnect' event of the relevant socket). We don't cary about any
// cookie expiry.
let userList = [];
let messageList = [];

io.on('connection', (socket) => {
  socket.on('enteredChat', (username) => {
    // socket.data.username = username; // no point in saving the username information as it will disappear anyway
    const message = { className: 'notice', username: username, messageText: `${username} entered` }
    // every client updated with new message
    io.emit('new message', message);

    // all chatters receive the full updated user list on each user enter
    userList.push(username);
    io.emit('updateUserList', userList);

    // the new client receives the whole updated message list without notices
    // (once upon enter)
    socket.emit('updateMessageList', messageList);
  });

  socket.on('client message', ({username, messageText}) => {

    // console.log(`username: ${username}, message: ${messageText}`);

    // this format is fine, this isnt python
    messageOther = {className: 'message other', username, messageText}
    messageOwn = {className: 'message own', username, messageText}
    
    messageList.push(messageOther);
    socket.broadcast.emit('new message', messageOther);
    socket.emit('new message', messageOwn);
  });

    // sockets are volatile so the newly assigned socket.id doesn't refer to
    // our username  cause it doesn't to through 'enteredChat' event anymore
    // (since client routines trigger only once) 
    
    // can't rely on particular socket 'disconnect', rather the client must fire
    // an ending event to delete the particular user

    // so we don't need to track the individual socket id's in the userList as they
    // will change anyway over the course of a session

  socket.on('leaveChat', (username) => {

    
    io.emit('new message', { 
      className: 'notice',
     username: username, 
     messageText: `${username} left the room.`
    });

    // deleting user from present users and sending updated info to all clients
    // except the disconnecting one (their list reaches the end of its lifecycle
    // anyway right?) // Intermediate disconnects?
    
    userList = userList.filter(user => user !== username);
    io.emit('updateUserList', userList);

  });

  // Destroy sesssion on disconnect? Otherwise memory leak?
});

// app.get('/', (req, res) => {
// 	res.sendFile(__dirname + '/public/index.html');
// });

server.listen(port, () => {
  console.log(`Listening on ${port}`);
});


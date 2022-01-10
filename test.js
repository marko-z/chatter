process.stdout.write('\033c')
process.setgid('www - data');
process.setuid('www - data')
require('dotenv').config()
'use strict'
var express = require('express'),
    app = express()
app.set('colors', require('chalk'))
function loadSession() {
    var express_sess = require('express - session'),
        redis_sess = require('connect - redis')(express_sess),
        uid = require('uid - safe').sync,
        session = express_sess({
            genid: req => {
                if (req.session) {
                    if (req.session.uid)
                        return req.session.uid + '_' + uid(24)
                }
                return uid(24)
            },
            store: new redis_sess({
                port: process.env.redis_port,
                ttl: 3600
            }),
            secret: process.env.session_secret,
            name: 'indo_sess',
            rolling: true,
            saveUninitialized: true,
            resave: true,
            proxy: true,
            logErrors: false,
            cookie: {
                path: '/',
                domain: '.' + process.env.app_domain,
                httpOnly: true,
                secure: process.env.protocol === 'https',
                maxAge: (60 * 60 * 1000)
            }
        })
    app.use(session)
    app.set('session', session)
    app.use(require('./middleware')(app))
    initServer()
}
function initServer() {
    app.set('json spaces', 4)
    app.disable('x - powered - by')
    app.enable('trust proxy')
    app.use(require('./csp').rules())
    app.set('server', app.listen(process.env.app_port, ret => {
        require('./websocket')(app)
        console.log(app.get('colors').green('[' + connected_string + ']') + ' Server')
    }))
}

// websocket.js
module.exports = app => {
    app.set('socketClients', [])
    var websocket = require('socket.io').listen(app.get('server'), {
        transports: ['websocket']
    })
    websocket.use((socket, next) => {
        app.get('session')(socket.request, socket.request.res || {}, next)
    })
    websocket.set('authorization', (handshake, accept) => {
        app.get('session')(handshake, {}, err => {
            if (err) {
                console.log(app.get('colors').red('socket.handshake err: ' + err))
                return accept(false)
            }
            accept(null, true)
        })
    })
    websocket.on('connection', socket => {
        socket.on('disconnect', ret => {
            // console.log('typeof socket: ' + typeof(socket))
            console.log('socket disconnected! handshake.session.id: ' + socket.handshake.session.id + ' ip: ' + socket.request.session.ip)
        })
        app.get('session')(socket.handshake, {}, err => {
            if (err) {
                console.log(app.get('colors').red('socket.handshake error: ' + err))
                return
            }
            console.log('socket connected! handshake.session.id: ' + socket.handshake.session.id + ' ip: ' + socket.request.session.ip)
            // socket.join('room_' + socket.request.session.id, ret => {
            // console.log('client joined: room_' + socket.handshake.session.id)
            // })
            socket.on('auth', data => {
                var session = socket.request.session
                // console.log(JSON.stringify(session, null, 4))
                if (!session.user_id) {
                    socket.emit('auth', session)
                    return
                }
                app.get('model').users.get(session.user_id, user_rec => {
                    if (!user_rec) {
                        app.get('functions').logout(session, ret => {
                            socket.emit('auth', session)
                        })
                        return
                    }
                    Object.keys(user_rec.blob).forEach(key => {
                        session[key] = user_rec.blob[key]
                    })
                    socket.emit('auth', session)
                })
            })
        })
        var socketClients = app.get('socketClients')
        socketClients.push(socket)
        app.set('socketClients', socketClients)
    })
    app.set('websocket', websocket)
}
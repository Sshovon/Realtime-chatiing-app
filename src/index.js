const express = require("express");
const http = require('http');
const path = require('path') //nn to install expliclitly
const socketio = require('socket.io');
const port = process.env.PORT || 3000;
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');

const {addUser, removeUser,getUser, getUsersInRoom} = require('./utils/users')


const app = express();
const server = http.createServer(app);
const io = socketio(server);


const publicDirectoryPath = path.join(__dirname, '../public') //joining path
app.use(express.static(publicDirectoryPath));

///socket.emit = sents event
///socket.on = receive event


io.on('connection', (socket) => {

    socket.on('join', ({ username, room } , cb) => {
        const { error, user } = addUser({ id: socket.id, username, room })
        if (error) return cb(error);
        socket.join(user.room);
        socket.emit("message", generateMessage(`Welcome! ${user.username}`, 'Admin'));
        socket.broadcast.to(user.room).emit("message", generateMessage(`${user.username} has joined the chat room`, 'Admin'));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        cb();
    })

    socket.on('sendMessage', (msg , cb) => {
        const user = getUser(socket.id);
        const filter = new Filter()
        if (filter.isProfane(msg)) return cb('message is prohabited');
        io.to(user.room).emit('message', generateMessage(msg,user.username));
        cb()
    })

    socket.on('sendLocation', ({ latitude, longitude }, cb) => {
        const user = getUser(socket.id);
        if (!(latitude && longitude)) return cb('location not available');
        io.to(user.room).emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${latitude},${longitude}`,user.username))
        cb();
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} left the room!`, 'Admin'));
            
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room) 
            })

        }
    })


})

server.listen(port, () => {
    console.log(`server is up on port ${port}`)
})
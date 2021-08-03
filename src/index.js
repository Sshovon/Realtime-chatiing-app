const express = require("express");
const http = require('http');
const path = require('path') //nn to install expliclitly
const socketio = require('socket.io');
const port = process.env.PORT || 3000;
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');


const app = express();
const server = http.createServer(app);
const io = socketio(server);


const publicDirectoryPath = path.join(__dirname, '../public') //joining path
app.use(express.static(publicDirectoryPath));

///socket.emit = sents event
///socket.on = receive event


io.on('connection', (socket) => {
    socket.emit("message", generateMessage('Welcome!') );
    socket.broadcast.emit("message", generateMessage('A new user joined to the server'));


    socket.on('sendMessage', (msg, cb) => {
        const filter = new Filter()
        
        if (filter.isProfane(msg)) {
            return cb('message is prohabited');
        }
        io.emit('message', generateMessage(msg));
        cb()
    })

    socket.on('sendLocation', ({ latitude, longitude }, cb) => {
        if (!(latitude && longitude)) return cb('location not available');
        io.emit('locationMessage',generateLocationMessage(`https://google.com/maps?q=${latitude},${longitude}`))
        cb();
    })


    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user left'));
    })
    

})


server.listen(port, () => {
    console.log(`server is up on port ${port}`)
})
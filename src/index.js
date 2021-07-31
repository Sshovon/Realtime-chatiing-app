const express = require("express");
const http = require('http');
const path = require('path') //nn to install expliclitly
const socketio = require('socket.io');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);


const publicDirectoryPath = path.join(__dirname, '../public') //joining path
app.use(express.static(publicDirectoryPath));

///socket.emit = sents event
///socket.on = receive event


io.on('connection', (socket) => {
    console.log('new user connected'); /// this is server-side messeage for new user
    
    socket.emit("message", "Welcome");

    socket.on('sendMessage', (msg) => {
        io.emit('message', msg); 
    })
    

})


server.listen(port, () => {
    console.log(`server is up on port ${port}`)
})
const socket = io();

socket.on("message", (msg) => {
    console.log(msg);
})


document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault(); ///so that the page doesn't refresh

    const msg = document.querySelector('input').value;
    socket.emit('sendMessage', msg);
    
})
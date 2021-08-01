const socket = io();

socket.on("message", (msg) => {
    console.log(msg);
})


document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault(); ///so that the page doesn't refresh

    const msg = e.target.elements.message.value;
    socket.emit('sendMessage', msg);

})

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation)
        return alert('location not available');
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        })
    })
})
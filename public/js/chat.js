const socket = io();

/// starting with $ means its a dom element
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

////// templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;


////// options
const {username,room} = Qs.parse(location.search, { ignoreQueryPrefix: true });

///////////


const autoScroll = () => {
    const $newMessage = $messages.lastElementChild;
    const newMessageStyle = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyle.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    const visibleHeight = $messages.offsetHeight;
    const containerHeight = $messages.scrollHeight;
    
    const scrollOffSet = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <=scrollOffSet) {
        $messages.scrollTop = $messages.scrollHeight
    }


}


socket.on("message", (message ) => {
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a'),
        username:message.username
    });


    $messages.insertAdjacentHTML('beforeend', html);
    autoScroll()

})

socket.on('locationMessage', ({location,createdAt,username}) => {
    const html = Mustache.render(locationMessageTemplate, {
        location,
        createdAt: moment(createdAt).format('h:mm a'),
        username
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoScroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html;
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault(); ///so that the page doesn't refresh
    $messageFormButton.setAttribute('disabled', 'disabled');
    const msg = $messageFormInput.value;

    socket.emit('sendMessage',  msg , (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = "";
        $messageFormInput.focus();
        if(error)
            return console.log(error);
        
        console.log('message delivered');
    });

})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation)
        return alert('location not available');
    $sendLocationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (error) => {
            $sendLocationButton.removeAttribute('disabled');
            if (error) return console.log(error);
            console.log('Location shared');
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href ='/'
    }
});
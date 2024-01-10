const socket = io();
const online = document.getElementById('online');
const messageContainer = document.getElementById('message-container');
const userInput = document.getElementById('user-input');
const message = document.getElementById('message-input');
const sendBtn = document.getElementById('send-button');
sendBtn.addEventListener('click', (e) => {
    sendMessage();
})




socket.on('clients-total', (data) => {
    online.innerHTML = data;
})

function sendMessage() {
    const data = {
        message: message.value,
        dataTime : new Date()
    }
    socket.emit('message', data)
    addMessage(true, data);
    message.value = '';
}
socket.on('chat-message', (data) => {
    addMessage(false, data);
});

function addMessage(isOwnMessage, data) {
    clearFeedback();
    const element = ` <li class="${isOwnMessage ? 'right-messages' : 'left-messages'}">
    <p class="message"> ${data.message}</p>
    <span class="info">${moment(data.dateTime).fromNow()}</span>
  </li>`;
    messageContainer.innerHTML += element;
}
message.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback : "Someone is typing..."
    })
})
message.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback : "Someone is typing..."
    })
})
message.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback : " "
    })
})

socket.on('feedback', (data) => {
    clearFeedback();
    const element = ` <li class="feedback-message">
    <p class="feedback" id="feedback"> ${data.feedback}</p>
  </li>`;
    messageContainer.innerHTML += element;
})

function clearFeedback() {
    document.querySelectorAll('li.feedback-message').forEach(element => {
        element.parentNode.removeChild(element);
    })
}


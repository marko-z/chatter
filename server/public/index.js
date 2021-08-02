let socket = io();

let form = document.getElementById('form');
let input = document.getElementById('input');
let messages = document.getElementById('messages');
let userListDiv = document.getElementById('users');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', `${socket.id}: ${input.value}`);
        input.value = '';
    }
});

socket.on('chat message', (data) => {
    
    let item = document.createElement('li');
    item.textContent = data.message;

    if (data.socketid === socket.id) {
        item.className="message own";
    } else {
        item.className="message other";
    }

    messages.appendChild(item);
    window.scrollTo(0,document.body.scrollHeight) //??
});

socket.on('announce', (socketid) => {
    console.log('ANNOUNCED');
    let item = document.createElement('li');
    item.textContent = `${socketid} joined the room`; 
    item.className = 'notice';
    messages.appendChild(item);
    window.scrollTo(0,document.body.scrollHeight)
});

socket.on('announce exit', (socketid) => {
    let item = document.createElement('li');
    item.textContent = `${socketid} left the room`; 
    item.className = 'notice';
    messages.appendChild(item);
    // window.scrollTo(0,document.body.scrollHeight)
 });

socket.on('updateUserList', (userList) => {
    userListDiv.textContent='';
    console.log(userList);
    for (let user of userList) {
        let userItem = document.createElement('li');
        userItem.textContent = user;
        userListDiv.appendChild(userItem);
    }
    // console.log('userIter: ' + userIter);
    // console.log('userList: ' + userList.textContent);
    
})
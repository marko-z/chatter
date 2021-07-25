let socket = io();

let form = document.getElementById('form');
let input = document.getElementById('input');
let messages = document.getElementById('messages');

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
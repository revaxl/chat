const socket = io();
const ul = document.querySelector('#messages');
const form = document.querySelector('#chat-form');

socket.on('connect', () => {
   console.log('connected to server');
   const username = document.querySelector('#username').innerHTML;
   const room = document.querySelector('#room').innerHTML;
   console.log(username, room);
   socket.emit('join', {username, room}, function(messages){
    console.log(messages); 
    messages.forEach(msg => {
      const li = document.createElement('li');
      li.innerHTML = `${msg.name}: ${msg.message}`;
      li.classList.add('message');
      ul.appendChild(li);
    });
   });
});

socket.on('disconnect', () => console.log('disconnected'));

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const msg = document.querySelector('#message');
  console.log(msg.value);
  socket.emit('createMessage', {message: msg.value});
  form.reset();
});

socket.on('newMessage', (data) => {
  console.log(data);
  const li = document.createElement('li');
  li.innerHTML = `${data.username}: ${data.message}`;
  li.classList.add('message');
  ul.appendChild(li);
});

socket.on('userJoined', (data) => {
  console.log(data);
  const li = document.createElement('li');
  li.classList.add('shout');
  li.innerHTML = data.message;
  ul.appendChild(li);
});
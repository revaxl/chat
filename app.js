const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const bodyParser = require('body-parser');
const User = require('./models/user');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

var users = [];

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', (req, res) => {
  console.log(req.body);
  res.render('chat', {data: req.body});
});

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('join', (data) => {
    socket.join(data.room);
    const user = new User(data.username, data.room, socket.id);
    users.push(user);
    io.to(user.room).emit('userJoined', 
        {message: `${user.username} joined the room: ${user.room}`});
  });

  socket.on('createMessage', (data) => {
    const currentUser = users.filter(user => user.socketid === socket.id)[0];
    console.log(currentUser);
    const username = currentUser.username;
    const message = data.message;
    io.to(currentUser.room).emit('newMessage', {username, message});
  });

  socket.on('disconnet', () => console.log('user disconnect'));
});

server.listen(port, () => console.log('server working'));
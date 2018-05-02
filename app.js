const express = require('express');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const http = require('http');
const bodyParser = require('body-parser');

const User = require('./models/user');
const Message = require('./models/message');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/chat', (err) => {
  if (err) return console.log(err);
  console.log("connected to mongodb");
});

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

  socket.on('join', (data, cb) => {
    socket.join(data.room);
    const user = new User(data.username, data.room, socket.id);
    users.push(user);
    const messages = Message.find({room: data.room}, (err, result) => {
      if (err) return err;
      console.log(result);
     // callback(result);
     cb(result);
    });
    io.to(user.room).emit('userJoined', 
        {message: `${user.username} joined the room: ${user.room}`});
  });

  socket.on('createMessage', (data) => {
    const currentUser = users.filter(user => user.socketid === socket.id)[0];
    console.log(currentUser);
    const username = currentUser.username;
    const message = data.message;
    const msg = new Message({name: username, message: message, room: currentUser.room});
    msg.save()
      .then(result => {
        io.to(currentUser.room).emit('newMessage', {username, message});
      })
      .catch(err => {
        return err;
      })
  });

  socket.on('disconnet', () => console.log('user disconnect'));
});

server.listen(port, () => console.log('server working'));
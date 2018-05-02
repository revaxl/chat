function User(username, room, socketid){
  this.username = username;
  this.room = room;
  this.socketid = socketid;
};

module.exports = User;
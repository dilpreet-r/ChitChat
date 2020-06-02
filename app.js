var express = require('express');
var socket = require('socket.io');
var favicon = require('serve-favicon');
var path = require('path')


// App setup
var app = express();
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
var server = app.listen(4000, function(){
    console.log('listening for requests on port 4000,');
});

// Static files

app.use(express.static('public'));
const roomList=['CHIT CHAT'];
var msg="";
var usernames={};
// Socket setup & pass server
var io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);
    // Handle chat event

    socket.on('chat', function(data){
        // console.log(data);
        io.sockets.in(socket.room).emit('chat',socket.username, data);
    });

    // Handle typing event
    socket.on('typing', function(data){
        socket.broadcast.to(socket.room).emit('typing', data.handle);
    });

    socket.on('disconnect',()=>{
      // delete usernames[socket.username];
      socket.broadcast.emit('entered', socket.username + ' has disconnected');
      socket.leave(socket.room);
    });

    socket.on('entered', function(data){
        socket.username=data.handle;
        socket.room=data.room;
        // usernames[username]=data.handle;
        socket.join(data.room);
        socket.emit('entered','You have joined '+data.room);
        socket.broadcast.to(data.room).emit('entered', data.handle+' has joined '+data.room);
    });
    socket.on('create', function(data) {

        socket.leave(socket.room);
		    socket.join(data.room);
		    socket.emit('entered','You have connected to '+ data.room);
		    // sent message to OLD room
		    socket.broadcast.to(socket.room).emit('entered',socket.username+' has left this room');
		    // update socket session room title
		    socket.room = data.room;
		    socket.broadcast.to(data.room).emit('entered',socket.username+' has joined this room');

    });
    socket.on('rooming',function(){
      io.sockets.emit('roomCreate',{rooms:roomList,msg:""});
    });
    socket.on('roomCreated',function(data){
      if(!(roomList.includes(data.roomName))){
        roomList.push(data.roomName);
      }else{
        msg="Room already EXISTS!";
      }
      io.sockets.emit('roomCreate',{rooms:roomList,msg:msg});
    });
});

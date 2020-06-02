var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(4000, function(){
    console.log('listening for requests on port 4000,');
});

// Static files
app.use(express.static('public'));

const roomList=['CHIT CHAT'];
var msg="";
var room=roomList[0];
// Socket setup & pass server
var io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);
    // Handle chat event
    socket.on('create', function(room) {
        socket.join(room);

    });
    socket.on('chat', function(data){
        // console.log(data);
        io.sockets.to(data.room).emit('chat', data);
    });

    // Handle typing event
    socket.on('typing', function(data){
        socket.broadcast.to(data.room).emit('typing', data.handle);
    });

    socket.on('disconnect',(user)=>{
      console.log(user+ "has disconnected");
    });

    socket.on('entered', function(data){
        socket.join(data.room);
        socket.broadcast.to(data.room).emit('entered', data.handle);
    });
    socket.on('rooming',function(){
      io.sockets.to(room).emit('roomCreate',{rooms:roomList,msg:""});
    });
    socket.on('roomCreated',function(data){
      if(!(roomList.includes(data.roomName))){
        roomList.push(data.roomName);
      }else{
        msg="Room already EXISTS!";
      }
      io.sockets.to(room).emit('roomCreate',{rooms:roomList,msg:msg});
    });
});

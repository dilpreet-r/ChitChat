// Make connection

var socket = io.connect('http://localhost:4000');

// Query DOM
var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      button1=document.getElementById('click'),
      output = document.getElementById('output'),
      button2=document.getElementById('add'),
      iRoom = document.getElementById('room'),
      cRoom = document.getElementById('create'),
      list = document.getElementById('list'),
      header=document.getElementById('header'),
      feedback = document.getElementById('feedback');


// By default, submit button is disabled
button1.disabled = true;

// Enable button only if there is text in the input field
handle.onkeyup = () => {
  if (handle.value.length > 0){
      button1.disabled = false;}
  else{
      button1.disabled = true;}
};

// By default, submit button is disabled
btn.disabled = true;

// Enable button only if there is text in the input field
message.onkeyup = () => {
  if (message.value.length > 0){
      btn.disabled = false;}
  else{
      btn.disabled = true;}
};
cRoom.disabled = true;

// Enable button only if there is text in the input field
iRoom.onkeyup = () => {
  if (iRoom.value.length > 0){
      cRoom.disabled = false;}
  else{
      cRoom.disabled = true;}
};

cRoom.addEventListener('click',function(){
  socket.emit('roomCreated',{
    roomName:iRoom.value
  });
})
// Emit events
btn.addEventListener('click', buttonclick);

function buttonclick(){
      var d = new Date();
      var t=d.toString();
      var arr=t.split(" ");
      var x=d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
      var date=" "+x;
      socket.emit('chat', {
        message: message.value,
        handle: handle.value,
        date:date,
        room:header.innerHTML
      });
      message.value = "";
      btn.disabled=true;
}

var roomclicked=function(obj){
  header.innerHTML=" "+obj.innerHTML;
  $(".lime").fadeOut();
  $(".blue").fadeIn();
  socket.emit('create',obj.innerHTML);
}

message.addEventListener('keypress', function(){
    socket.emit('typing', {handle:handle.value,room:header.innerHTML});
})
button1.addEventListener('click', function(){
        $(".tomato").fadeOut();
        $(".blue").fadeIn();
        socket.emit('entered', {handle:handle.value,room:header.innerHTML});
})



button2.addEventListener('click',function(){
  $(".blue").fadeOut();
  $(".lime").fadeIn();
  socket.emit('rooming');
})


// Listen for events
socket.on('chat', function(data){
    feedback.innerHTML = '';
    var code='<div class="line"><div class="sender">'+ data.handle +'</div><div class="msg">'+ data.message +'</div><p>'+ data.date +'</p></div>';
    output.innerHTML += code;
});
socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing ...</em></p>';
});

socket.on('entered', function(data){
      feedback.innerHTML = '<p><em>' + data + ' has joined... </em></p>';
});

socket.on('roomCreate',function(data){
  var rooms=data.rooms;
  if(data.msg){
    alert(data.msg);
  }
  list.innerHTML="";
  rooms.forEach((room)=>{
    var code='<li> <button class="btn lbtn" onclick="roomclicked(this)">'+ room +'</button> </li>';
    list.innerHTML += code;
  })
});

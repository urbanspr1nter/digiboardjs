var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html', {
    headers: {
      'content-type': 'text/html'
    }
  });
});
app.get('/style.css', function(req, res) {
  res.sendFile(__dirname + '/style.css', {
    headers: {
      'content-type': 'text/css'
    }
  });
});
app.get('/alexa-grid.css', function(req, res) {
  res.sendFile(__dirname + '/alexa-grid.css', {
    headers: {
      'content-type': 'text/css'
    }
  });
});
app.get('/ws_whiteboard.js', function(req, res) {
  res.sendFile(__dirname + '/ws_whiteboard.js', {
    headers: {
      'content-type': 'text/javascript'
    }
  });
});


io.on('connection', function(socket){
  socket.on('push', function(msg){
    io.emit('receive', msg);
  });

  socket.on('clear', function(msg) {
    io.emit('clear', msg);
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
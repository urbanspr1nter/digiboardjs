const config = require('config-node')({
  env: 'development'
});

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
app.get('/index.js', function(req, res) {
  res.sendFile(__dirname + '/index.js', {
    headers: {
      'content-type': 'text/javascript'
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

io.on('connection', function(socket){
  socket.on('push', function(msg){
    io.emit('receive', msg);
  });

  socket.on('clear', function(msg) {
    io.emit('clear', msg);
  });
});

http.listen(config.port, function() {
  console.log('listening on *:3000');
});